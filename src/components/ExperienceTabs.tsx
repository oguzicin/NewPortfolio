import React, { useState, useRef } from 'react';
import { ExperienceContent } from '../data/content';
import { SectionReveal } from './SectionReveal';
import { SectionTitle } from './SectionTitle';

interface ExperienceTabsProps {
  content: ExperienceContent;
}

export const ExperienceTabs: React.FC<ExperienceTabsProps> = ({ content }) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const handleSelectTab = (index: number) => {
    if (index === selectedIndex) return;

    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    if (prefersReducedMotion) {
      setSelectedIndex(index);
      return;
    }

    setIsAnimating(true);
    window.setTimeout(() => {
      setSelectedIndex(index);
      window.requestAnimationFrame(() => {
        setIsAnimating(false);
      });
    }, 150);
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLButtonElement>,
    index: number
  ) => {
    const count = content.items.length;
    let nextIndex: number | null = null;

    if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
      e.preventDefault();
      nextIndex = (index + 1) % count;
    } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
      e.preventDefault();
      nextIndex = (index - 1 + count) % count;
    } else if (e.key === 'Home') {
      e.preventDefault();
      nextIndex = 0;
    } else if (e.key === 'End') {
      e.preventDefault();
      nextIndex = count - 1;
    }

    if (nextIndex !== null) {
      tabRefs.current[nextIndex]?.focus();
      handleSelectTab(nextIndex);
    }
  };

  const activeItem = content.items[selectedIndex] ?? content.items[0];

  return (
    <SectionReveal
      id="experience"
      className="py-12 custom-sm:py-8"
    >
      <SectionTitle title={content.sectionTitle} />

      <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-start">
        {/* Left (~1/3): Vertical tab list on desktop, horizontal scrollable row on mobile/tablet */}
        <div
          role="tablist"
          aria-label="Work experience tabs"
          className="w-full lg:w-1/3 flex lg:flex-col overflow-x-auto lg:overflow-visible gap-2 pb-1 lg:pb-0"
        >
          {content.items.map((item, idx) => {
            const isSelected = idx === selectedIndex;
            return (
              <button
                key={item.id}
                ref={(el) => {
                  tabRefs.current[idx] = el;
                }}
                id={`tab-${item.id}`}
                role="tab"
                type="button"
                aria-selected={isSelected}
                aria-controls={`panel-${item.id}`}
                tabIndex={isSelected ? 0 : -1}
                onClick={() => handleSelectTab(idx)}
                onKeyDown={(e) => handleKeyDown(e, idx)}
                className={`w-full whitespace-nowrap lg:whitespace-normal px-4 py-3 rounded-lg text-center text-[16px] font-semibold transition-colors duration-200 ${
                  isSelected
                    ? 'bg-tab-active text-accent'
                    : 'bg-transparent text-text-muted hover:text-text-primary'
                }`}
              >
                {item.tabLabel}
              </button>
            );
          })}
        </div>

        {/* Right (~2/3): Experience details with 300ms fade + 8px translate-y */}
        <div
          id={`panel-${activeItem.id}`}
          role="tabpanel"
          aria-labelledby={`tab-${activeItem.id}`}
          tabIndex={0}
          className={`w-full lg:w-2/3 transition-all duration-300 ease-out ${
            isAnimating
              ? 'opacity-0 translate-y-2'
              : 'opacity-100 translate-y-0'
          }`}
        >
          <h3 className="text-[22px] font-bold text-text-heading leading-snug">
            {activeItem.role}{' '}
            <span className="text-accent">@ {activeItem.company}</span>
          </h3>

          {(activeItem.employmentType || activeItem.location) && (
            <p className="font-mono text-[13px] text-text-muted mt-1 mb-4">
              {[activeItem.employmentType, activeItem.location]
                .filter(Boolean)
                .join(' • ')}
            </p>
          )}

          <ul className="mt-4 space-y-3 text-[16px] text-text-secondary leading-[1.6]">
            {activeItem.bullets.map((bullet, idx) => (
              <li key={idx} className="flex items-start gap-3">
                <span
                  aria-hidden="true"
                  className="text-accent text-xs mt-1.5 select-none shrink-0"
                >
                  ▹
                </span>
                <span>{bullet}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </SectionReveal>
  );
};

