import React, { useEffect, useState } from 'react';
import { Menu, ArrowUp } from 'lucide-react';

interface ScrollIslandProps {
  onMenuToggle?: () => void;
  isMenuOpen?: boolean;
}

const ScrollIsland: React.FC<ScrollIslandProps> = ({ onMenuToggle, isMenuOpen }) => {
  const [progress, setProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    // Initial check
    const currentScroll = window.scrollY;
    setIsVisible(currentScroll > 50);

    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      const currentScroll = window.scrollY;
      const scrollPercent = Math.min(100, Math.max(0, (currentScroll / totalHeight) * 100));
      
      setProgress(scrollPercent);
      setIsVisible(currentScroll > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = (e: React.MouseEvent) => {
    e.stopPropagation();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div 
      className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 transition-all duration-500 ease-spring ${
        isVisible || isMenuOpen ? 'translate-y-0 opacity-100' : '-translate-y-20 opacity-0'
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className={`
          relative flex items-center justify-between overflow-hidden
          bg-black/90 backdrop-blur-xl border border-white/10 shadow-2xl
          transition-all duration-500 ease-out group
          ${isHovered ? 'w-56 px-4 py-3 rounded-2xl' : 'w-40 px-3 py-2 rounded-full'}
        `}
      >
        {/* Progress Bar Background (Fill) */}
        <div 
            className="absolute left-0 top-0 h-full bg-white/5 transition-all duration-100 ease-linear pointer-events-none"
            style={{ width: `${progress}%` }}
        />

        {/* Content Container */}
        <div className="relative z-10 flex items-center justify-between w-full gap-3">
            
            {/* Left: Scroll Info / Back to Top */}
            <button 
                onClick={scrollToTop}
                className="flex items-center gap-2 transition-all duration-300 hover:text-emerald-400"
            >
                <div className="relative w-5 h-5 flex items-center justify-center">
                    {isHovered ? (
                        <ArrowUp size={14} className="text-emerald-400 animate-bounce" />
                    ) : (
                        <div className={`w-2 h-2 rounded-full ${progress === 100 ? 'bg-emerald-500 animate-pulse' : 'bg-white/50'}`}></div>
                    )}
                </div>
                <span className={`font-mono text-sm font-bold text-white tabular-nums`}>
                    {Math.round(progress)}%
                </span>
            </button>

            {/* Divider */}
            <div className="w-[1px] h-4 bg-white/10"></div>

            {/* Right: Menu Toggle */}
            <button 
                onClick={onMenuToggle}
                className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-300 hover:text-white transition-colors"
            >
                <span className={`${isHovered ? 'opacity-100 max-w-[40px]' : 'opacity-0 max-w-0'} overflow-hidden transition-all duration-300`}>
                    Menu
                </span>
                <Menu size={16} className={`transition-transform duration-300 ${isMenuOpen ? 'rotate-90 text-emerald-400' : ''}`} />
            </button>
        </div>
      </div>
    </div>
  );
};

export default ScrollIsland;
