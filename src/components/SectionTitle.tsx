import React from 'react';

interface SectionTitleProps {
  title: string;
}

export const SectionTitle: React.FC<SectionTitleProps> = ({ title }) => {
  return (
    <div className="flex items-center gap-4 mb-10 custom-sm:mb-8">
      <h2 className="text-[36px] custom-sm:text-[28px] font-bold text-text-primary leading-tight whitespace-nowrap">
        <span className="text-text-muted mr-1.5 select-none">/</span>
        <span>{title}</span>
      </h2>
      <div
        aria-hidden="true"
        className="h-[1px] bg-accent-line flex-1 max-w-[320px] mt-1"
      />
    </div>
  );
};

