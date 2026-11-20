/// <reference types="react-scripts" />

declare module 'react-icons/fi' {
  import * as React from 'react';
  export type IconComponent = (props: React.SVGAttributes<SVGElement>) => JSX.Element;
  export const FiGithub: IconComponent;
  export const FiLinkedin: IconComponent;
  export const FiFolder: IconComponent;
  export const FiChevronLeft: IconComponent;
  export const FiChevronRight: IconComponent;
}

declare module 'react-icons/fa' {
  import * as React from 'react';
  export type IconComponent = (props: React.SVGAttributes<SVGElement>) => JSX.Element;
  export const FaGithub: IconComponent;
  export const FaLinkedin: IconComponent;
}

declare module 'react-icons/hi' {
  import * as React from 'react';
  export type IconComponent = (props: React.SVGAttributes<SVGElement>) => JSX.Element;
  export const HiOutlineMenuAlt3: IconComponent;
  export const HiOutlineX: IconComponent;
}


