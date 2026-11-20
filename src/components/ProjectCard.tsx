import React from 'react';
import { FiFolder } from 'react-icons/fi';
import { FaGithub } from 'react-icons/fa';
import { ProjectItem } from '../data/content';

interface ProjectCardProps {
  project: ProjectItem;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  return (
    <article className="w-64 h-[17rem] rounded-xl bg-card hover:bg-card-hover hover:-translate-y-2 transition-all duration-100 ease-in-out p-4 flex flex-col justify-between shadow-lg overflow-hidden">
      {/* Top Row: Accent outline folder icon + Title */}
      <header className="flex items-start gap-2.5 shrink-0 mb-2">
        <FiFolder
          className="w-6 h-6 text-accent shrink-0 mt-1"
          aria-hidden="true"
        />
        <h3 className="text-[20px] leading-[1.2] font-normal text-text-heading">
          {project.title}
        </h3>
      </header>

      {/* Middle Body: Reddit Mono description */}
      <div className="flex-1 min-h-0 overflow-y-auto pr-0.5">
        <p className="font-mono text-[12px] leading-[1.42] text-text-muted">
          {project.description}
        </p>
      </div>

      {/* Footer Row: Tech stack + optional GitHub icon pinned bottom-right */}
      <footer className="mt-2 pt-1.5 flex items-end justify-between gap-2 shrink-0 border-t border-accent-line/15">
        {project.techStack ? (
          <span className="font-mono text-[10.5px] leading-tight text-accent/80 line-clamp-2">
            {project.techStack}
          </span>
        ) : (
          <span />
        )}

        {project.githubUrl && (
          <a
            href={project.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`View ${project.title} repository on GitHub`}
            className="text-text-primary hover:text-accent transition-colors duration-150 rounded p-0.5 shrink-0 ml-auto"
          >
            <FaGithub className="w-5 h-5" aria-hidden="true" />
          </a>
        )}
      </footer>
    </article>
  );
};

