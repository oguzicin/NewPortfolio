export interface NavItem {
  label: string;
  href: string;
}

export interface SocialLinks {
  github: string;
  linkedin: string;
}

export interface HeroContent {
  introLine: string;
  name: string;
  roles: string[];
  desktopHint: string;
  touchHint: string;
}

export interface AboutContent {
  sectionTitle: string;
  bio: string;
  techIntro: string;
  techColumns: [string[], string[]];
  photo: {
    src: string;
    alt: string;
  };
}

export interface ExperienceItem {
  id: string;
  tabLabel: string;
  role: string;
  company: string;
  location?: string;
  employmentType?: string;
  bullets: string[];
}

export interface ExperienceContent {
  sectionTitle: string;
  items: ExperienceItem[];
}

export interface SliderImage {
  src: string;
  alt: string;
  caption?: string;
}

export interface ProjectItem {
  id: string;
  title: string;
  description: string;
  techStack?: string;
  githubUrl?: string;
}

export interface ProjectsContent {
  sectionTitle: string;
  sliderImages: SliderImage[];
  projects: ProjectItem[];
}

export interface FooterContent {
  line1: string;
  line2: string;
}

export interface SiteContent {
  navItems: NavItem[];
  socials: SocialLinks;
  hero: HeroContent;
  about: AboutContent;
  experience: ExperienceContent;
  projects: ProjectsContent;
  footer: FooterContent;
}

export const siteContent: SiteContent = {
  navItems: [
    { label: 'Home', href: '#home' },
    { label: 'About', href: '#about' },
    { label: 'Experience', href: '#experience' },
    { label: 'Projects', href: '#projects' },
  ],
  socials: {
    github: 'https://github.com/oguzicin',
    linkedin: 'https://www.linkedin.com/in/oguzicin/',
  },
  hero: {
    introLine: '> hello, i am',
    name: 'oguz',
    roles: [
      'AI engineer',
      'full-stack dev',
      'robotics tinkerer',
      'cv nerd',
    ],
    desktopHint: 'move your mouse',
    touchHint: 'touch the letters',
  },
  about: {
    sectionTitle: 'about me',
    bio: "I'm studying Computer Engineering program in Dogus University (Istanbul), working as an intern at Altinay Robot Technologies. While I am practicing web development, I also have an interest in machine learning, image processing, and AI. I practice that interest with my pet projects.",
    techIntro: 'Here are some technologies I have been working with:',
    techColumns: [
      ['Python', 'JavaScript', 'OpenCV', 'HTML/CSS'],
      ['React', 'C++', 'MS SQL', 'TypeScript'],
    ],
    photo: {
      src: `${process.env.PUBLIC_URL}/me.jpeg`,
      alt: 'Portrait of Oguz Icin',
    },
  },
  experience: {
    sectionTitle: 'experience',
    items: [
      {
        id: 'lookus',
        tabLabel: 'LookUs Scientific',
        role: 'Software Developer',
        company: 'LookUs Scientific',
        location: 'İstanbul, Turkey',
        bullets: [
          'Engineered responsive, WCAG 2.1 AA-compliant interfaces and program matrices for 10+ international academic congresses, supporting concurrent sessions and speaker data.',
          'Optimized MS SQL Server database schemas and client-side data binding, reducing data-retrieval latency by 30% for concurrent sessions, speakers, and presentations.',
          'Enhanced user experience and data integrity by implementing client-side input validation and Bootstrap modal/grid components across forms, achieving improvement in user task completion.',
        ],
      },
      {
        id: 'bluesense',
        tabLabel: 'BLUESENSE AI Inc.',
        role: 'AI Engineer',
        company: 'BLUESENSE AI Inc.',
        location: 'Vancouver, Canada',
        employmentType: 'Internship (Remote)',
        bullets: [
          'Trained and benchmarked acne-detection models using YOLO and Faster R-CNN for facial image analysis.',
          'Segmented facial regions to support region-based acne detection and analysis.',
          'Augmented and preprocessed image datasets, then evaluated model performance across YOLO and Faster R-CNN experiments.',
        ],
      },
      {
        id: 'altinay',
        tabLabel: 'Altınay Robot Tech.',
        role: 'Software Developer',
        company: 'Altınay Robot Tech.',
        location: 'İstanbul, Turkey',
        employmentType: 'Internship',
        bullets: [
          'Produced a React-based interface for TCP-connected industrial robot control systems.',
          'Delivered the frontend during a short-term Computer Engineering internship focused on industrial robotics.',
        ],
      },
    ],
  },
  projects: {
    sectionTitle: 'projects',
    sliderImages: [
      {
        src: `${process.env.PUBLIC_URL}/slides/job-tracker.jpg`,
        alt: 'Job Tracker — Application Tracker interface',
        caption: 'Job Tracker — Application Pipeline & Status Dashboard',
      },
      {
        src: `${process.env.PUBLIC_URL}/slides/robot-interface.png`,
        alt: 'Robot Control Interface — TCP Position, Orientation & Joint Controls',
        caption: 'Robot Control Interface — TCP & Joint Actuator Controls',
      },
      {
        src: `${process.env.PUBLIC_URL}/slides/plate-recognition.png`,
        alt: 'Plate Recognition System — OpenCV license plate detection GUI',
        caption: 'Plate Recognition System — License Plate Detection & Logging',
      },
      {
        src: `${process.env.PUBLIC_URL}/slides/author-classification.png`,
        alt: 'Data Mining Project — Author Identification & Text Classification',
        caption: 'Data Mining Project — Author Identification & Text Classification',
      },
      {
        src: `${process.env.PUBLIC_URL}/slides/moviez.jpg`,
        alt: 'Moviez — Movie search and rating mobile interface',
        caption: 'Moviez — Movie Discovery & Rating Interface',
      },
    ],
    projects: [
      {
        id: 'agent-harness',
        title: 'Agent Harness',
        description:
          'AI-powered coding workspace (COME 492 graduation project). Desktop app for OpenAI Codex with real-time communication, diff visualization, command approval, integrated terminal, event-sourced state, and mobile pairing.',
        techStack: 'React, TS, Electron, Node.js, SQLite, WS',
      },
      {
        id: 'job-tracker',
        title: 'Job Tracker',
        description:
          'Full-stack web application to track and monitor job application pipelines with an interactive React/TypeScript UI, asynchronous data fetching, and relational database CRUD persistence.',
        techStack: 'React, TypeScript, Node.js, Express, PostgreSQL',
        githubUrl: 'https://github.com/oguzicin',
      },
      {
        id: 'author-classification',
        title: 'Author Classification',
        description:
          'Full-stack web app for author prediction and keyword/topic tagging. Integrates a React (TypeScript) frontend with a Flask backend combining traditional ML (TF-IDF, N-grams) and deep learning (BERT).',
        techStack: 'React, TS, Flask, Scikit-learn, BERT, TF-IDF',
        githubUrl: 'https://github.com/oguzicin/Data-Mining-Project',
      },
      {
        id: 'robot-interface',
        title: 'Robot Interface',
        description:
          'Interactive user interface built with React to control and manage robots.',
        techStack: 'React, JavaScript, TCP',
        githubUrl: 'https://github.com/oguzicin/React-Robot-Interface',
      },
      {
        id: 'plate-recognition',
        title: 'Plate Recognition',
        description:
          'Basic image processing with python to recognate the car plates.',
        techStack: 'Python, OpenCV',
        githubUrl: 'https://github.com/oguzicin/license-plate-recognition',
      },
    ],
  },
  footer: {
    line1: 'Built and designed by Oguz.',
    line2: 'All rights reserved. ©',
  },
};

