import { useEffect, useRef } from 'react';
import type React from 'react';

interface UseRafLoopOptions {
  containerRef: React.RefObject<HTMLElement | null>;
  enabled?: boolean;
  onFrame: (timestamp: number) => void;
}

export function useRafLoop({
  containerRef,
  enabled = true,
  onFrame,
}: UseRafLoopOptions) {
  const onFrameRef = useRef(onFrame);
  onFrameRef.current = onFrame;

  const isIntersectingRef = useRef(true);
  const isTabVisibleRef = useRef(
    typeof document !== 'undefined' ? !document.hidden : true
  );
  const rafIdRef = useRef<number | null>(null);

  useEffect(() => {
    if (!enabled) return;

    const startLoop = () => {
      if (rafIdRef.current !== null) return;
      if (!isIntersectingRef.current || !isTabVisibleRef.current) return;

      const tick = (time: number) => {
        if (!isIntersectingRef.current || !isTabVisibleRef.current) {
          rafIdRef.current = null;
          return;
        }
        onFrameRef.current(time);
        rafIdRef.current = window.requestAnimationFrame(tick);
      };

      rafIdRef.current = window.requestAnimationFrame(tick);
    };

    const stopLoop = () => {
      if (rafIdRef.current !== null) {
        window.cancelAnimationFrame(rafIdRef.current);
        rafIdRef.current = null;
      }
    };

    const handleVisibilityChange = () => {
      isTabVisibleRef.current = !document.hidden;
      if (isTabVisibleRef.current && isIntersectingRef.current) {
        startLoop();
      } else {
        stopLoop();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    let observer: IntersectionObserver | null = null;
    const containerEl = containerRef.current;

    if (containerEl && typeof IntersectionObserver !== 'undefined') {
      observer = new IntersectionObserver(
        (entries) => {
          const entry = entries[0];
          if (entry) {
            isIntersectingRef.current = entry.isIntersecting;
            if (entry.isIntersecting && isTabVisibleRef.current) {
              startLoop();
            } else {
              stopLoop();
            }
          }
        },
        { threshold: 0.01 }
      );
      observer.observe(containerEl);
    }

    startLoop();

    return () => {
      stopLoop();
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      if (observer) {
        observer.disconnect();
      }
    };
  }, [containerRef, enabled]);
}

