import React, { useEffect, useRef } from 'react';
import { OUTLINE, FILL } from './handPoints';

interface Props {
  onTouch: () => void; // fingertips touch -> mount ParticleHero
  onDone: () => void;  // overlay finished -> unmount it
}

type Dot = {
  bx: number;
  by: number;
  side: 0 | 1;
  ph: number;
  rn: number;
  jx: number;
  jy: number;
  wW: number;
  fW: number;
};

const DW = 1000;
const FAR = 430;
const REACH = 3;
const TOUCH = 4.8;
const SIZE = 2.5;
const PX = [300, 720]; // wrist pivots (x)
const PY = [215, 240]; // wrist pivots (y)
const KX = [385, 680]; // knuckle pivots (x)
const KY = [255, 265]; // knuckle pivots (y)

const ease = (x: number) =>
  x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
const cl = (x: number) => Math.max(0, Math.min(1, x));
const sm = (x: number) => (x <= 0 ? 0 : x >= 1 ? 1 : x * x * (3 - 2 * x));

const rot = (
  x: number,
  y: number,
  cx: number,
  cy: number,
  a: number
): [number, number] => {
  const c = Math.cos(a);
  const s = Math.sin(a);
  const dx = x - cx;
  const dy = y - cy;
  return [cx + dx * c - dy * s, cy + dx * s + dy * c];
};

const build = (arr: number[]): Dot[] => {
  const out: Dot[] = [];
  for (let i = 0; i < arr.length; i += 3) {
    const bx = arr[i];
    const side = arr[i + 2] as 0 | 1;
    const a = Math.random() * 6.283;
    const r = Math.sqrt(Math.random()) * 150;
    out.push({
      bx,
      by: arr[i + 1],
      side,
      ph: Math.random() * 6.283,
      rn: Math.random(),
      jx: Math.cos(a) * r,
      jy: Math.sin(a) * r,
      // wrist bend weight
      wW: side ? sm((790 - bx) / 140) : sm((bx - 220) / 140),
      // finger flex weight
      fW: side ? sm((680 - bx) / 70) : sm((bx - 370) / 70),
    });
  }
  return out;
};

export const HandsIntro: React.FC<Props> = ({ onTouch, onDone }) => {
  const ref = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const cv = ref.current;
    if (!cv) return;
    const ctx = cv.getContext('2d');
    if (!ctx) return;

    const dots: Dot[] = [...build(OUTLINE), ...build(FILL)];
    let W = 0;
    let H = 0;
    let S = 1;
    let OX = 0;
    let OY = 0;
    let raf = 0;
    let touched = false;
    let finished = false;
    const t0 = performance.now();

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = window.innerWidth;
      H = window.innerHeight;
      cv.width = W * dpr;
      cv.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      S = 1.6 * Math.min((W * 1.32) / DW, (H * 0.85) / 500);
      OX = (W - DW * S) / 2;
      OY = H / 2 - 270 * S;
    };
    resize();
    window.addEventListener('resize', resize);

    const frame = (now: number) => {
      const t = (now - t0) / 1000;
      const u = ease(cl((t - 0.4) / (TOUCH - 0.4))); // approach progress
      const scat = Math.pow(1 - u, 2.2);
      const k = Math.pow(1 - u, 1.5);
      const arc = -Math.sin(Math.PI * u) * 14;
      const A =
        ease(cl((t - 0.8) / 1.6)) *
        (1 - 0.97 * ease(cl((t - (TOUCH - 1)) / 1.2)));
      const TH = [
        0.24 * k +
          0.05 * A * Math.sin(t * 0.9) +
          0.02 * A * Math.sin(t * 1.7 + 1),
        -0.2 * k +
          0.05 * A * Math.sin(t * 0.8 + 2) +
          0.02 * A * Math.sin(t * 1.5),
      ];
      const tb = t - TOUCH;

      if (tb > 0 && !touched) {
        touched = true;
        onTouch();
      }

      ctx.clearRect(0, 0, W, H);
      ctx.fillStyle = '#64ffda';
      ctx.beginPath();

      for (const d of dots) {
        const s = d.side;
        let X = d.bx;
        let Y = d.by;

        if (d.fW > 0) {
          [X, Y] = rot(
            X,
            Y,
            KX[s],
            KY[s],
            (Math.sin(t * 1.2 + d.by * 0.05 + s * 2) * 0.07 * A +
              (s ? -0.2 : 0.2) * k) *
              d.fW
          );
        }
        if (d.wW > 0) {
          [X, Y] = rot(X, Y, PX[s], PY[s], TH[s] * d.wW);
        }

        const shift = s
          ? FAR - (FAR + REACH) * u
          : -FAR + (FAR + REACH) * u;

        let x =
          OX + (X + shift + d.jx * scat + Math.sin(t * 0.9 + d.ph) * 1.1) * S;
        let y =
          OY +
          (Y +
            arc * (s ? 0.5 : 1) +
            d.jy * scat +
            Math.cos(t * 0.8 + d.ph) * 1.1) *
            S;

        // appear from nothing
        let size = SIZE * ease(cl((t - 0.2) / 2 - d.rn * 0.7));

        // converge inward toward the center "oguz" text region
        if (tb > 0) {
          const e = ease(cl(tb / 1.05));
          const fontApprox = Math.min(220, Math.max(88, W * 0.18));
          const tx = W / 2 + (d.rn - 0.5) * (fontApprox * 2.05);
          const ty = H / 2 + Math.sin(d.ph) * 0.5 * (fontApprox * 0.65);
          x += (tx - x) * e;
          y += (ty - y) * e;
          size *= 1 - ease(cl((tb - 0.25) / 0.85));
        }

        if (size > 0.05) ctx.rect(x - size / 2, y - size / 2, size, size);
      }
      ctx.fill();

      if (tb > 1.2 && !finished) {
        finished = true;
        onDone();
        return;
      }
      raf = requestAnimationFrame(frame);
    };

    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={ref}
      aria-hidden="true"
      className="fixed inset-0 w-full h-full z-[60] pointer-events-none"
    />
  );
};

export default HandsIntro;