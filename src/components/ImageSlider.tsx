import React, { useState, useRef, useEffect } from 'react';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { SliderImage } from '../data/content';

interface ImageSliderProps {
  slides: SliderImage[];
}

export const ImageSlider: React.FC<ImageSliderProps> = ({ slides }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const touchStartX = useRef<number | null>(null);

  const total = slides.length;

  useEffect(() => {
    if (total <= 1) return;
    const timer = window.setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % total);
    }, 5000);
    return () => window.clearInterval(timer);
  }, [total, currentIndex]);

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + total) % total);
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % total);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      prevSlide();
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      nextSlide();
    }
  };

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    touchStartX.current = e.touches[0]?.clientX ?? null;
  };

  const handleTouchEnd = (e: React.TouchEvent<HTMLDivElement>) => {
    if (touchStartX.current === null) return;
    const endX = e.changedTouches[0]?.clientX ?? touchStartX.current;
    const diff = touchStartX.current - endX;

    if (Math.abs(diff) > 40) {
      if (diff > 0) {
        nextSlide();
      } else {
        prevSlide();
      }
    }
    touchStartX.current = null;
  };

  if (total === 0) return null;

  return (
    <div
      role="region"
      aria-roledescription="carousel"
      aria-label="Project screenshots"
      tabIndex={0}
      onKeyDown={handleKeyDown}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      className="relative w-full max-w-[740px] mx-auto rounded-3xl overflow-hidden shadow-2xl border border-accent-line/25 bg-card select-none"
    >
      {/* Slider Track */}
      <div
        className="flex w-full transition-transform duration-300 ease-slider-track"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {slides.map((slide, idx) => (
          <div
            key={slide.src}
            role="group"
            aria-roledescription="slide"
            aria-label={`${idx + 1} of ${total}: ${slide.alt}`}
            aria-hidden={idx !== currentIndex}
            className="w-full shrink-0 relative aspect-video bg-bg"
          >
            <img
              src={slide.src}
              alt={slide.alt}
              loading={idx === 0 ? 'eager' : 'lazy'}
              className="w-full h-full object-contain block"
            />
          </div>
        ))}
      </div>

      {/* Left Arrow Button */}
      <button
        type="button"
        onClick={prevSlide}
        aria-label="Previous slide"
        className="absolute inset-y-0 left-0 px-3 sm:px-4 flex items-center justify-center hover:bg-black/20 focus-visible:bg-black/20 transition-colors duration-100 ease-in-out group"
      >
        <span className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-slider-btn-bg flex items-center justify-center text-accent shadow-md">
          <FiChevronLeft className="w-6 h-6" aria-hidden="true" />
        </span>
      </button>

      {/* Right Arrow Button */}
      <button
        type="button"
        onClick={nextSlide}
        aria-label="Next slide"
        className="absolute inset-y-0 right-0 px-3 sm:px-4 flex items-center justify-center hover:bg-black/20 focus-visible:bg-black/20 transition-colors duration-100 ease-in-out group"
      >
        <span className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-slider-btn-bg flex items-center justify-center text-accent shadow-md">
          <FiChevronRight className="w-6 h-6" aria-hidden="true" />
        </span>
      </button>

      {/* Dot Indicators Overlaid at Bottom */}
      <div
        role="tablist"
        aria-label="Slide selection"
        className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-bg/65 backdrop-blur-sm"
      >
        {slides.map((slide, idx) => {
          const isActive = idx === currentIndex;
          return (
            <button
              key={slide.src}
              type="button"
              role="tab"
              aria-selected={isActive}
              aria-label={`Go to slide ${idx + 1}`}
              onClick={() => setCurrentIndex(idx)}
              className={`w-2.5 h-2.5 rounded-full hover:scale-110 focus-visible:scale-110 transition-transform duration-100 ${
                isActive ? 'bg-accent scale-110' : 'bg-text-muted/60 hover:bg-text-primary'
              }`}
            />
          );
        })}
      </div>
    </div>
  );
};

