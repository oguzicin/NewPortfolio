import React, { useState, useEffect } from 'react';
import { FiGithub, FiLinkedin } from 'react-icons/fi';
import { HiOutlineMenuAlt3, HiOutlineX } from 'react-icons/hi';
import { NavItem, SocialLinks } from '../data/content';

interface NavbarProps {
  navItems: NavItem[];
  socials: SocialLinks;
}

export const Navbar: React.FC<NavbarProps> = ({ navItems, socials }) => {
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && menuOpen) {
        setMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [menuOpen]);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-bg/95 backdrop-blur-sm">
      <nav
        aria-label="Primary Navigation"
        className="site-container flex items-center justify-between h-20"
      >
        {/* Left: Desktop Navigation Links */}
        <ul className="flex items-center gap-8 custom-sm:hidden">
          {navItems.map((item) => (
            <li key={item.href}>
              <a
                href={item.href}
                className="inline-block text-[16px] font-semibold text-text-primary hover:text-accent hover:-translate-y-2 transition-all duration-200 ease-in-out rounded px-1 py-0.5"
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>

        {/* Mobile Hamburger Button (shown at <=640px) */}
        <button
          type="button"
          onClick={() => setMenuOpen((prev) => !prev)}
          aria-expanded={menuOpen}
          aria-controls="mobile-nav-menu"
          aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
          className="hidden custom-sm:inline-flex items-center justify-center p-2 -ml-2 rounded-lg text-text-primary hover:text-accent transition-colors duration-200"
        >
          {menuOpen ? (
            <HiOutlineX className="w-7 h-7" aria-hidden="true" />
          ) : (
            <HiOutlineMenuAlt3 className="w-7 h-7" aria-hidden="true" />
          )}
        </button>

        {/* Right: Social Icons */}
        <div className="flex items-center gap-5">
          <a
            href={socials.github}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub Profile"
            className="inline-flex items-center justify-center text-text-primary hover:text-accent hover:-translate-y-2 transition-all duration-200 ease-in-out rounded p-1"
          >
            <FiGithub className="w-[28px] h-[28px]" aria-hidden="true" />
          </a>
          <a
            href={socials.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn Profile"
            className="inline-flex items-center justify-center text-text-primary hover:text-accent hover:-translate-y-2 transition-all duration-200 ease-in-out rounded p-1"
          >
            <FiLinkedin className="w-[28px] h-[28px]" aria-hidden="true" />
          </a>
        </div>
      </nav>

      {/* Mobile Collapsible Menu */}
      {menuOpen && (
        <div
          id="mobile-nav-menu"
          className="hidden custom-sm:block bg-card border-b border-accent-line/30 shadow-xl"
        >
          <ul className="site-container py-4 flex flex-col gap-3">
            {navItems.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  onClick={() => setMenuOpen(false)}
                  className="block py-2 text-[16px] font-semibold text-text-primary hover:text-accent transition-colors duration-150"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </header>
  );
};

