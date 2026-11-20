import { useRef, useState, useEffect, useCallback } from 'react';
import type React from 'react';

export interface PointerPosition {
  x: number;
  y: number;
}

interface UsePointerOptions {
  onBurst?: (x: number, y: number) => void;
  disabled?: boolean;
}

export function usePointer({ onBurst, disabled = false }: UsePointerOptions = {}) {
  const pointerRef = useRef<PointerPosition | null>(null);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [isTouch, setIsTouch] = useState(false);

  useEffect(() => {
    const checkTouch = () => {
      if (typeof window === 'undefined') return;
      const coarse =
        window.matchMedia?.('(pointer: coarse)').matches ||
        'ontouchstart' in window ||
        navigator.maxTouchPoints > 0 ||
        window.innerWidth <= 768;
      setIsTouch(Boolean(coarse));
    };

    checkTouch();
    window.addEventListener('resize', checkTouch);
    return () => window.removeEventListener('resize', checkTouch);
  }, []);

  const updatePosition = useCallback(
    (e: React.PointerEvent<HTMLElement>) => {
      if (disabled) return null;
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      pointerRef.current = { x, y };
      if (!hasInteracted) {
        setHasInteracted(true);
      }
      if (e.pointerType === 'touch' && !isTouch) {
        setIsTouch(true);
      }
      return { x, y };
    },
    [disabled, hasInteracted, isTouch]
  );

  const handlePointerMove = useCallback(
    (e: React.PointerEvent<HTMLElement>) => {
      updatePosition(e);
    },
    [updatePosition]
  );

  const handlePointerDown = useCallback(
    (e: React.PointerEvent<HTMLElement>) => {
      const pos = updatePosition(e);
      if (pos && onBurst && !disabled) {
        onBurst(pos.x, pos.y);
      }
    },
    [updatePosition, onBurst, disabled]
  );

  const handlePointerLeaveOrUp = useCallback(() => {
    pointerRef.current = null;
  }, []);

  return {
    pointerRef,
    hasInteracted,
    isTouch,
    pointerHandlers: {
      onPointerMove: handlePointerMove,
      onPointerDown: handlePointerDown,
      onPointerUp: handlePointerLeaveOrUp,
      onPointerLeave: handlePointerLeaveOrUp,
      onPointerCancel: handlePointerLeaveOrUp,
    },
  };
}
