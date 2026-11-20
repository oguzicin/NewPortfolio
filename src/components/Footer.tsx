import React from 'react';
import { FooterContent } from '../data/content';

interface FooterProps {
  content: FooterContent;
}

export const Footer: React.FC<FooterProps> = ({ content }) => {
  return (
    <footer className="mt-40 custom-sm:mt-28 mb-12 text-center text-[12px] text-text-muted leading-relaxed">
      <p>{content.line1}</p>
      <p>{content.line2}</p>
    </footer>
  );
};

