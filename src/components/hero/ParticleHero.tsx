import React, { useEffect, useRef, useState } from 'react';
import { HeroContent } from '../../data/content';
import { usePointer } from './usePointer';
import { useParticleText } from './useParticleText';

interface ParticleHeroProps {
  content: HeroContent;
}

export const ParticleHero: React.FC<ParticleHeroProps> = ({ content }) => {
  const containerRef = useRef<HTMLElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const [reducedMotion, setReducedMotion] = useState(() => {
    if (typeof window !== 'undefined' && window.matchMedia) {
      return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    }
    return false;
  });

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const mql = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handleChange = (e: MediaQueryListEvent) => {
      setReducedMotion(e.matches);
    };
    mql.addEventListener('change', handleChange);
    return () => mql.removeEventListener('change', handleChange);
  }, []);

  const burstCallbackRef = useRef<(x: number, y: number) => void>(() => {});

  const { pointerRef, hasInteracted, isTouch, pointerHandlers } = usePointer({
    disabled: reducedMotion,
    onBurst: (x, y) => burstCallbackRef.current(x, y),
  });

  const { canvasFailed, fontSizePx, triggerBurst } = useParticleText({
    text: content.name,
    containerRef,
    canvasRef,
    pointerRef,
    reducedMotion,
  });

  burstCallbackRef.current = triggerBurst;

  // Rotating role state: rotates every 2.2s with 250ms opacity + 6px translate-y fade
  const [roleIndex, setRoleIndex] = useState(0);
  const [isFadingRole, setIsFadingRole] = useState(false);

  useEffect(() => {
    if (reducedMotion || content.roles.length <= 1) return;

    let fadeTimeout: number | null = null;

    const interval = window.setInterval(() => {
      setIsFadingRole(true);
      fadeTimeout = window.setTimeout(() => {
        setRoleIndex((prev) => (prev + 1) % content.roles.length);
        setIsFadingRole(false);
      }, 250);
    }, 2200);

    return () => {
      window.clearInterval(interval);
      if (fadeTimeout !== null) {
        window.clearTimeout(fadeTimeout);
      }
    };
  }, [content.roles.length, reducedMotion]);

  const currentRole = content.roles[roleIndex] ?? content.roles[0] ?? '';
  const hintText = isTouch ? content.touchHint : content.desktopHint;

  // Reserve vertical space matching the centered offscreen canvas word height (including "g" descender)
  const wordSlotHeight = Math.round(fontSizePx * 1.32);

  return (
    <section
      id="home"
      ref={containerRef}
      {...pointerHandlers}
      className="relative w-screen left-1/2 -translate-x-1/2 h-[min(100vh,900px)] min-h-[540px] bg-bg flex flex-col items-center justify-center overflow-hidden select-none scroll-mt-24"
    >
      {/* Background Particle Canvas */}
      {!canvasFailed && (
        <canvas
          ref={canvasRef}
          aria-hidden="true"
          className="absolute inset-0 w-full h-full block pointer-events-none"
        />
      )}

      {/* Visually Hidden H1 for Screen Readers & SEO */}
      <h1 className="sr-only">{content.name}</h1>

      {/* Noscript fallback if JS is disabled */}
      <noscript>
        <div className="text-[clamp(88px,18vw,220px)] font-bold text-accent leading-none">
          {content.name}
        </div>
      </noscript>

      {/* Foreground DOM Text Around the Canvas Word */}
      <div className="relative z-10 flex flex-col items-center justify-center pointer-events-none px-4 text-center">
        {/* Above the word: Reddit Mono 13px, text-muted */}
        <p className="font-mono text-[13px] text-text-muted tracking-wide mb-2">
          {content.introLine}
        </p>

        {/* Reserved slot for the particle word "oguz" (or fallback text if canvas fails) */}
        <div
          style={{ height: `${wordSlotHeight}px` }}
          className="flex items-center justify-center w-full"
        >
          {canvasFailed && (
            <span
              aria-hidden="true"
              className="text-[clamp(88px,18vw,220px)] font-bold text-accent leading-none"
            >
              {content.name}
            </span>
          )}
        </div>

        {/* Below the word: Role line in Tiny5 24px, text-faint, rotating every 2.2s */}
        <div className="mt-2 min-h-[34px] flex items-center justify-center">
          <p
            aria-live="polite"
            className={`font-tiny5 text-[24px] text-text-faint leading-snug transition-all duration-[250ms] ease-out ${
              isFadingRole
                ? 'opacity-0 translate-y-[6px]'
                : 'opacity-100 translate-y-0'
            }`}
          >
            {currentRole}
          </p>
        </div>

        {/* Small hint under the roles: Tiny5 16px, text-faint, fades out after first interaction */}
        <p
          aria-hidden={hasInteracted}
          className={`font-tiny5 text-[16px] text-text-faint/80 mt-2 transition-opacity duration-500 ease-out ${
            hasInteracted || reducedMotion ? 'opacity-0' : 'opacity-100'
          }`}
        >
          {hintText}
        </p>
      </div>
    </section>
  );
};

export default ParticleHero;
