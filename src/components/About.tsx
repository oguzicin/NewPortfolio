import React from 'react';
import { AboutContent } from '../data/content';
import { SectionReveal } from './SectionReveal';
import { SectionTitle } from './SectionTitle';

interface AboutProps {
  content: AboutContent;
}

export const About: React.FC<AboutProps> = ({ content }) => {
  return (
    <SectionReveal id="about" className="py-12 custom-sm:py-8">
      <SectionTitle title={content.sectionTitle} />

      <div className="flex flex-col-reverse lg:flex-row items-start justify-between gap-10 lg:gap-16">
        {/* Left: Bio & Technologies */}
        <div className="flex-1 text-[16px] font-normal text-text-muted leading-[2.2]">
          <p className="mb-4">{content.bio}</p>
          <p className="mb-3">{content.techIntro}</p>

          <div className="grid grid-cols-2 gap-x-8 max-w-[340px] leading-[1.9]">
            {content.techColumns.map((column, colIdx) => (
              <ul key={colIdx} className="space-y-1">
                {column.map((tech) => (
                  <li
                    key={tech}
                    className="flex items-center gap-2.5 text-[15px] text-text-muted"
                  >
                    <span
                      aria-hidden="true"
                      className="text-accent text-xs select-none"
                    >
                      ▹
                    </span>
                    <span>{tech}</span>
                  </li>
                ))}
              </ul>
            ))}
          </div>
        </div>

        {/* Right on desktop / Top on mobile & tablet: Portrait Photo */}
        <div className="shrink-0 mx-auto lg:mx-0">
          <img
            src={content.photo.src}
            alt={content.photo.alt}
            width={250}
            height={330}
            loading="lazy"
            className="w-[250px] h-[330px] custom-xs:w-[220px] custom-xs:h-[290px] object-cover rounded-2xl grayscale hover:grayscale-0 transition-all duration-300 ease-in-out shadow-lg border border-accent-line/20"
          />
        </div>
      </div>
    </SectionReveal>
  );
};

