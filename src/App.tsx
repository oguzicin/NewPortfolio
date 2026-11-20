import React, { useEffect, useState } from 'react';
import { siteContent } from './data/content';
import { Navbar } from './components/Navbar';
import { ParticleHero } from './components/hero/ParticleHero';
import { HandsIntro } from './components/hero/HandsIntro';
import { About } from './components/About';
import { ExperienceTabs } from './components/ExperienceTabs';
import { SectionReveal } from './components/SectionReveal';
import { SectionTitle } from './components/SectionTitle';
import { ImageSlider } from './components/ImageSlider';
import { ProjectCard } from './components/ProjectCard';
import { Footer } from './components/Footer';

export const App: React.FC = () => {
  const [heroOn, setHeroOn] = useState(false);
  const [introDone, setIntroDone] = useState(false);

  // Lock scroll while hands play
  useEffect(() => {
    if (introDone) return;
    window.scrollTo(0, 0);
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, [introDone]);

  return (
    <div className="min-h-screen bg-bg text-text-primary flex flex-col">
      <Navbar
        navItems={siteContent.navItems}
        socials={siteContent.socials}
      />

      <main className="site-container flex-1 flex flex-col gap-44 custom-sm:gap-28">
        {/* Spacer keeps page height; hero mounts at the moment fingertips touch */}
        <div className="h-[min(100vh,900px)] min-h-[540px]">
          {heroOn && <ParticleHero content={siteContent.hero} />}
        </div>

        <About content={siteContent.about} />

        <ExperienceTabs content={siteContent.experience} />

        <SectionReveal
          id="projects"
          className="py-12 custom-sm:py-8"
        >
          <SectionTitle title={siteContent.projects.sectionTitle} />

          <ImageSlider slides={siteContent.projects.sliderImages} />

          <div className="mt-12 flex flex-wrap justify-center gap-6 custom-sm:flex-col custom-sm:items-center">
            {siteContent.projects.projects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        </SectionReveal>
      </main>

      <Footer content={siteContent.footer} />

      {/* Hands overlay: last in DOM so it sits above the navbar */}
      {!introDone && (
        <HandsIntro
          onTouch={() => setHeroOn(true)}
          onDone={() => setIntroDone(true)}
        />
      )}
    </div>
  );
};

export default App;