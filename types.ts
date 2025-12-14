export interface TimelineEvent {
  id: string;
  date: string;
  type: 'travel' | 'work' | 'personal' | 'achievement';
  title: string;
  description: string;
  imageUrl?: string;
  icon?: string;
  color?: string;
  metrics?: {
    value: number;
    unit: string;
  };
}

export interface StatCard {
  id: string;
  label: string;
  value: string | number;
  trend?: string;
  color: string;
}

export interface ImageMemory {
  id: string;
  url: string;
  alt: string;
  rotation: number;
}

// GSAP Global Definition
declare global {
  interface Window {
    gsap: any;
    ScrollTrigger: any;
    MotionPathPlugin: any;
  }
}