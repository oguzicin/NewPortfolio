import { useEffect, useRef, useState, useCallback } from 'react';
import type React from 'react';
import { PointerPosition } from './usePointer';
import { useRafLoop } from './useRafLoop';

interface ParticleBuffers {
  count: number;
  x: Float32Array;
  y: Float32Array;
  homeX: Float32Array;
  homeY: Float32Array;
  vx: Float32Array;
  vy: Float32Array;
}

interface UseParticleTextOptions {
  text: string;
  containerRef: React.RefObject<HTMLElement | null>;
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  pointerRef: React.RefObject<PointerPosition | null>;
  reducedMotion: boolean;
}

export function useParticleText({
  text,
  containerRef,
  canvasRef,
  pointerRef,
  reducedMotion,
}: UseParticleTextOptions) {
  const [canvasFailed, setCanvasFailed] = useState(false);
  const [fontSizePx, setFontSizePx] = useState(140);

  const buffersRef = useRef<ParticleBuffers | null>(null);
  const sizeRef = useRef<{ width: number; height: number; dpr: number }>({
    width: 0,
    height: 0,
    dpr: 1,
  });
  const introStartRef = useRef<number | null>(null);
  const hasInitializedRef = useRef(false);

  const drawStaticFrame = useCallback(() => {
    const canvas = canvasRef.current;
    const buffers = buffersRef.current;
    if (!canvas || !buffers) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { width, height, dpr } = sizeRef.current;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = '#64ffda';

    const { count, homeX, homeY } = buffers;
    for (let i = 0; i < count; i++) {
      ctx.fillRect(homeX[i] - 1.25, homeY[i] - 1.25, 2.5, 2.5);
    }
  }, [canvasRef]);

  const sampleTextParticles = useCallback(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    const rect = container.getBoundingClientRect();
    const width = Math.max(300, Math.floor(rect.width));
    const height = Math.max(400, Math.floor(rect.height));
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    sizeRef.current = { width, height, dpr };
    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    // Fluid font size: clamp(88px, 18vw, 220px)
    const computedFontSize = Math.min(220, Math.max(88, Math.round(width * 0.18)));
    setFontSizePx(computedFontSize);

    try {
      const offscreen = document.createElement('canvas');
      offscreen.width = width;
      offscreen.height = height;
      const offCtx = offscreen.getContext('2d', { willReadFrequently: true });

      if (!offCtx) {
        setCanvasFailed(true);
        return;
      }

      offCtx.clearRect(0, 0, width, height);
      offCtx.fillStyle = '#ffffff';
      offCtx.font = `700 ${computedFontSize}px Nunito, sans-serif`;
      offCtx.textAlign = 'center';
      offCtx.textBaseline = 'middle';
      offCtx.fillText(text, width / 2, height / 2);

      const imageData = offCtx.getImageData(0, 0, width, height).data;

      // Base step N: 4 on desktop, 6 on tablet, 7 on mobile (scaled by 1/sqrt(0.8) for 20% fewer dots)
      const densityScale = 1 / Math.sqrt(0.8);
      let step = (width <= 480 ? 7 : width <= 768 ? 6 : 4) * densityScale;
      let coordsX: number[] = [];
      let coordsY: number[] = [];

      // Ensure particle count never exceeds 4800 (reduced 20% from 6000)
      while (step <= 16) {
        coordsX = [];
        coordsY = [];
        for (let py = 0; py < height; py += step) {
          const iy = Math.floor(py);
          const rowOffset = iy * width * 4;
          for (let px = 0; px < width; px += step) {
            const ix = Math.floor(px);
            const alpha = imageData[rowOffset + ix * 4 + 3];
            if (alpha > 128) {
              coordsX.push(px);
              coordsY.push(py);
            }
          }
        }
        if (coordsX.length <= 4800) {
          break;
        }
        step += 1;
      }

      const count = coordsX.length;
      if (count === 0) {
        setCanvasFailed(true);
        return;
      }

      const prevBuffers = buffersRef.current;
      const x = new Float32Array(count);
      const y = new Float32Array(count);
      const homeX = new Float32Array(count);
      const homeY = new Float32Array(count);
      const vx = new Float32Array(count);
      const vy = new Float32Array(count);

      const isFirstLoad = !hasInitializedRef.current;

      for (let i = 0; i < count; i++) {
        homeX[i] = coordsX[i];
        homeY[i] = coordsY[i];

        if (reducedMotion) {
          x[i] = coordsX[i];
          y[i] = coordsY[i];
        } else if (isFirstLoad || !prevBuffers || prevBuffers.count === 0) {
          // Spawn along the left and right hand positions so hand dots flow into the center "oguz" text
          const fromRight = i % 2 === 1;
          const handOffset = (0.04 + Math.random() * 0.34) * width;
          x[i] = width / 2 + (fromRight ? handOffset : -handOffset);
          y[i] = height / 2 + (Math.random() - 0.5) * Math.min(160, height * 0.24);
        } else {
          // On resize, reuse existing particle positions smoothly
          const prevIdx = i % prevBuffers.count;
          x[i] = prevBuffers.x[prevIdx];
          y[i] = prevBuffers.y[prevIdx];
        }
      }

      buffersRef.current = { count, x, y, homeX, homeY, vx, vy };

      if (isFirstLoad) {
        hasInitializedRef.current = true;
        introStartRef.current = performance.now();
      }

      if (reducedMotion) {
        drawStaticFrame();
      }
    } catch {
      setCanvasFailed(true);
    }
  }, [containerRef, canvasRef, text, reducedMotion, drawStaticFrame]);

  useEffect(() => {
    let isMounted = true;
    let resizeTimer: number | null = null;

    const init = async () => {
      try {
        if (document.fonts && document.fonts.ready) {
          await document.fonts.ready;
        }
      } catch {
        // Proceed with fallback font metrics if fonts API fails
      }
      if (isMounted) {
        sampleTextParticles();
      }
    };

    init();

    const handleResize = () => {
      if (resizeTimer !== null) {
        window.clearTimeout(resizeTimer);
      }
      resizeTimer = window.setTimeout(() => {
        if (isMounted) {
          sampleTextParticles();
        }
      }, 200);
    };

    window.addEventListener('resize', handleResize);
    return () => {
      isMounted = false;
      if (resizeTimer !== null) {
        window.clearTimeout(resizeTimer);
      }
      window.removeEventListener('resize', handleResize);
    };
  }, [sampleTextParticles]);

  const triggerBurst = useCallback(
    (burstX: number, burstY: number) => {
      if (reducedMotion) return;
      const buffers = buffersRef.current;
      if (!buffers) return;

      const { count, x, y, vx, vy } = buffers;
      const burstRadius = 140;
      const burstRadiusSq = burstRadius * burstRadius;
      const maxPush = 18;

      for (let i = 0; i < count; i++) {
        const dx = x[i] - burstX;
        const dy = y[i] - burstY;
        const distSq = dx * dx + dy * dy;

        if (distSq < burstRadiusSq && distSq > 0.001) {
          const dist = Math.sqrt(distSq);
          const factor = 1 - dist / burstRadius;
          const nx = dx / dist;
          const ny = dy / dist;

          x[i] += nx * maxPush * factor;
          y[i] += ny * maxPush * factor;
          vx[i] += nx * (maxPush * 0.65) * factor;
          vy[i] += ny * (maxPush * 0.65) * factor;
        }
      }
    },
    [reducedMotion]
  );

  const onFrame = useCallback(
    (timestamp: number) => {
      const canvas = canvasRef.current;
      const buffers = buffersRef.current;
      if (!canvas || !buffers) return;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const { width, height, dpr } = sizeRef.current;
      const { count, x, y, homeX, homeY, vx, vy } = buffers;

      // 1.8s intro assembly ramp -> steady 0.08 ease
      const introStart = introStartRef.current ?? timestamp;
      const elapsed = Math.max(0, timestamp - introStart);
      const introProgress = Math.min(1, elapsed / 1800);
      const ease =
        introProgress < 1
          ? 0.032 + 0.048 * (introProgress * introProgress)
          : 0.08;

      // Scale repel radius with canvas width on mobile/tablet
      const repelRadius = width <= 480 ? 46 : width <= 768 ? 58 : 70;
      const repelRadiusSq = repelRadius * repelRadius;
      const pointer = pointerRef.current;
      const hasPointer = pointer !== null;
      const px = pointer ? pointer.x : 0;
      const py = pointer ? pointer.y : 0;

      const timeSec = timestamp * 0.0022;

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = '#64ffda';

      for (let i = 0; i < count; i++) {
        // Subtle idle breathing (+-1px sin/cos jitter)
        const breatheX = Math.sin(timeSec + i * 0.37) * 0.9;
        const breatheY = Math.cos(timeSec * 1.13 + i * 0.53) * 0.9;

        const targetX = homeX[i] + breatheX;
        const targetY = homeY[i] + breatheY;

        // 1. Ease toward home
        x[i] += (targetX - x[i]) * ease + vx[i];
        y[i] += (targetY - y[i]) * ease + vy[i];

        vx[i] *= 0.84;
        vy[i] *= 0.84;

        // 2. Mouse repel: if distance < repelRadius, push away up to 6px
        if (hasPointer) {
          const dx = x[i] - px;
          const dy = y[i] - py;
          const distSq = dx * dx + dy * dy;

          if (distSq < repelRadiusSq && distSq > 0.0001) {
            const dist = Math.sqrt(distSq);
            const push = (1 - dist / repelRadius) * 6;
            x[i] += (dx / dist) * push;
            y[i] += (dy / dist) * push;
          }
        }

        // 3. Draw as 2.5px square
        ctx.fillRect(x[i] - 1.25, y[i] - 1.25, 2.5, 2.5);
      }
    },
    [canvasRef, pointerRef]
  );

  useRafLoop({
    containerRef,
    enabled: !reducedMotion && !canvasFailed,
    onFrame,
  });

  return {
    canvasFailed,
    fontSizePx,
    triggerBurst,
  };
}

