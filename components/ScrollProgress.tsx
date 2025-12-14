import React, { useEffect, useState } from 'react';
import { ArrowUp } from 'lucide-react';

const ScrollProgress: React.FC = () => {
  const [progress, setProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      const currentScroll = window.scrollY;
      const scrollPercent = Math.min(100, Math.max(0, (currentScroll / totalHeight) * 100));
      
      setProgress(scrollPercent);
      setIsVisible(currentScroll > 100);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  // Circle properties
  const radius = 24;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div 
      className={`fixed bottom-8 right-8 z-50 transition-all duration-500 transform ${
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'
      }`}
    >
      <button
        onClick={scrollToTop}
        className={`group relative flex items-center justify-center w-16 h-16 rounded-full bg-white/10 backdrop-blur-md border border-white/20 shadow-2xl transition-all duration-300 hover:scale-110 hover:bg-white/20 ${progress > 99 ? 'animate-pulse shadow-[0_0_20px_rgba(16,185,129,0.5)]' : ''}`}
        aria-label="Scroll to top"
      >
        {/* Progress Ring SVG */}
        <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 60 60">
          {/* Track */}
          <circle
            cx="30"
            cy="30"
            r={radius}
            fill="none"
            stroke="#ffffff"
            strokeWidth="3"
            strokeOpacity="0.1"
          />
          {/* Indicator */}
          <circle
            cx="30"
            cy="30"
            r={radius}
            fill="none"
            stroke="url(#progressGradient)"
            strokeWidth="3"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-200 ease-out"
          />
          <defs>
            <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
               <stop offset="0%" stopColor="#06b6d4" />
               <stop offset="100%" stopColor="#10b981" />
            </linearGradient>
          </defs>
        </svg>

        {/* Center Content */}
        <div className="relative z-10 text-white group-hover:-translate-y-1 transition-transform duration-300">
          {progress >= 99 ? (
             <span className="text-xl">🐍</span>
          ) : (
             <ArrowUp size={20} className="stroke-[3]" />
          )}
        </div>

        {/* Percentage Tooltip */}
        <div className="absolute -top-10 left-1/2 -translate-x-1/2 px-2 py-1 bg-black/80 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
          {Math.round(progress)}%
        </div>
      </button>
    </div>
  );
};

export default ScrollProgress;