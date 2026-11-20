import React, { useEffect, useRef, useState } from 'react';

interface SectionRevealProps {
  children: React.ReactNode;
  className?: string;
  id?: string;
}

export const SectionReveal: React.FC<SectionRevealProps> = ({
  children,
  className = '',
  id,
}) => {
  const ref = useRef<HTMLElement | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    if (prefersReducedMotion) {
      setIsVisible(true);
      return;
    }

    const element = ref.current;
    if (!element) return;

    const checkViewport = () => {
      const rect = element.getBoundingClientRect();
      if (rect.top < window.innerHeight * 0.88 && rect.bottom > 0) {
        setIsVisible(true);
        return true;
      }
      return false;
    };

    if (checkViewport()) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.15,
      }
    );

    observer.observe(element);
    window.addEventListener('scroll', checkViewport, { passive: true });

    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', checkViewport);
    };
  }, []);

  return (
    <section
      id={id}
      ref={ref}
      className={`reveal-section scroll-mt-24 transition-all duration-[2000ms] ease-scroll-reveal ${
        isVisible
          ? 'opacity-100 blur-0 translate-y-0'
          : 'opacity-0 blur-sm translate-y-10'
      } ${className}`}
    >
      {children}
    </section>
  );
};

