import React, { useLayoutEffect, useRef, useState } from 'react';
import { ImageMemory, StatCard } from '../types';

interface IntroAnimationProps {
  images: ImageMemory[];
  stats: StatCard[];
  onComplete: () => void;
}

const IntroAnimation: React.FC<IntroAnimationProps> = ({ images, stats, onComplete }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const imagesRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const aiTextRef = useRef<HTMLDivElement>(null);
  const hintRef = useRef<HTMLDivElement>(null);
  
  // New Refs for Loading Animation
  const loadingRef = useRef<HTMLDivElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  
  const [isMobile, setIsMobile] = useState(false);
  const [activeCardId, setActiveCardId] = useState<string | null>(null);

  // Memoize card positions to prevent re-calculation on render
  const cardsWithPositions = React.useMemo(() => {
    return stats.map((stat, i) => ({
      ...stat,
      offsetX: (i % 2 === 0 ? -1 : 1) * (200 + Math.random() * 150),
      offsetY: (i < 2 ? -1 : 1) * (150 + Math.random() * 100),
      rotation: Math.random() * 10 - 5
    }));
  }, [stats]);

  useLayoutEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useLayoutEffect(() => {
    const ctx = window.gsap.context(() => {
      // Register ScrollTrigger
      window.gsap.registerPlugin(window.ScrollTrigger);

      // We pin the container for 200% viewport height
      const timeline = window.gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "+=200%", 
          scrub: 0.5,
          pin: true,
        }
      });

      // --- Stage 1: Initial & Hints ---
      timeline.to(hintRef.current, { opacity: 0, y: 20, duration: 0.5 }, 0);
      
      // Floating/parallax for start
      if (imagesRef.current) {
         Array.from(imagesRef.current.children).forEach((img, i) => {
            timeline.to(img, {
               y: (i % 2 === 0 ? -50 : 50),
               rotation: (Math.random() * 10 - 5),
               duration: 1
            }, 0);
         });
      }

      // --- Stage 2: Explosion (Scroll 20% - 50%) ---
      
      // Explode images out
      if (imagesRef.current) {
        Array.from(imagesRef.current.children).forEach((img) => {
          timeline.to(img, {
            x: () => Math.random() * window.innerWidth - window.innerWidth / 2,
            y: () => Math.random() * window.innerHeight - window.innerHeight / 2,
            opacity: 0,
            scale: 0.5,
            rotation: () => Math.random() * 360,
            duration: 2
          }, 0.5);
        });
      }

      // Explode cards out
      if (cardsRef.current) {
         Array.from(cardsRef.current.children).forEach((card) => {
            timeline.to(card, {
               x: () => (Math.random() - 0.5) * 800,
               y: () => (Math.random() - 0.5) * 800,
               opacity: 0,
               rotation: () => Math.random() * 90 - 45,
               scale: 0.2,
               duration: 2
            }, 0.5);
         });
      }

      // Hide Title
      timeline.to(titleRef.current, {
         opacity: 0,
         scale: 1.5,
         filter: 'blur(10px)',
         duration: 1
      }, 0.5);

      // --- Stage 2.5: Simulated Loading (Bridge) ---
      // Fade in loader
      timeline.fromTo(loadingRef.current, 
        { opacity: 0, scale: 0.9 },
        { opacity: 1, scale: 1, duration: 0.5, ease: "power2.out" },
        0.8 // Start while explosion is happening
      );

      // Fill Bar
      if (progressBarRef.current) {
        timeline.fromTo(progressBarRef.current,
           { width: "0%" },
           { width: "100%", duration: 1.0, ease: "none" }, // Linear fill for tech feel
           0.8
        );
      }

      // Fade out loader
      timeline.to(loadingRef.current, 
         { opacity: 0, scale: 1.1, filter: 'blur(8px)', duration: 0.5 }, 
         1.8 // Fade out as AI text is appearing
      );


      // --- Stage 3: AI Text (50% - 80%) ---
      // Show AI Text
      timeline.fromTo(aiTextRef.current, 
        { scale: 0, opacity: 0 },
        { scale: 1, opacity: 1, duration: 1, ease: "elastic.out(1, 0.3)" }
      , 1.5);

      // Expand AI Text
      timeline.to(aiTextRef.current, {
         scale: 50,
         filter: 'blur(2px)',
         duration: 2.5,
         ease: "power2.in"
      }, 2.5);

      // Text turns to light
      timeline.to('.ai-text-gradient', {
         backgroundImage: 'linear-gradient(to right, #ffffff, #ffffff)',
         duration: 1.5
      }, 3);
      
    }, containerRef);

    return () => ctx.revert();
  }, [isMobile]);

  // Removed handleMouseMove as parallax is disabled

  return (
    <div 
        ref={containerRef} 
        className="relative w-full h-screen overflow-hidden text-white"
    > 
      {/* Removed the opaque gradient background so SnakeBackground (z-0) is visible */}
      <div ref={contentRef} className="absolute inset-0 w-full h-full">
        
        {/* Subtle glow blobs for atmosphere, but transparent enough */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
           <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-purple-600/20 rounded-full filter blur-[100px] animate-blob"></div>
           <div className="absolute top-[20%] right-[-10%] w-[50vw] h-[50vw] bg-pink-600/20 rounded-full filter blur-[100px] animate-blob animation-delay-2000"></div>
           <div className="absolute bottom-[-20%] left-[20%] w-[50vw] h-[50vw] bg-indigo-600/20 rounded-full filter blur-[100px] animate-blob animation-delay-4000"></div>
        </div>

        <div className="relative h-full w-full flex flex-col items-center justify-center z-10">
            
            {/* Title */}
            <div ref={titleRef} className="z-20 text-center mb-10 p-4">
               <h1 className="font-display text-5xl md:text-8xl font-bold text-white tracking-tight drop-shadow-lg">
                 2025 <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">Review</span>
               </h1>
               <p className="mt-4 text-xl text-slate-300 font-light tracking-wide">A journey through time and memory</p>
            </div>

            {/* Hint */}
            <div ref={hintRef} className="absolute bottom-10 z-20 flex flex-col items-center animate-bounce">
               <span className="text-slate-400 text-sm mb-2 uppercase tracking-widest">Scroll to start</span>
               <svg className="w-6 h-6 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
               </svg>
            </div>

            {/* Images Grid */}
            <div ref={imagesRef} className="absolute inset-0 z-10 pointer-events-none">
               {images.map((img) => {
                  const randomTop = 15 + Math.random() * 60;
                  const randomLeft = 10 + Math.random() * 80;
                  return (
                     <div 
                        key={img.id}
                        className="absolute shadow-2xl rounded-lg overflow-hidden border-2 border-white/20 transform hover:scale-110 transition-transform duration-300"
                        style={{
                           top: `${randomTop}%`,
                           left: `${randomLeft}%`,
                           width: isMobile ? '100px' : '180px',
                           transform: `rotate(${img.rotation}deg)`,
                        }}
                     >
                        <img src={img.url} alt={img.alt} className="w-full h-full object-cover opacity-90 hover:opacity-100" />
                     </div>
                  );
               })}
            </div>

            {/* Info Cards - MODIFIED SECTION */}
            <div ref={cardsRef} className="absolute inset-0 z-10 pointer-events-none flex items-center justify-center">
               {cardsWithPositions.map((stat, i) => {
                   const isActive = activeCardId === stat.id;
                   
                   return (
                      <div 
                        key={stat.id}
                        className="absolute pointer-events-auto flex justify-center items-center"
                        style={{
                           transform: `translate(${stat.offsetX}px, ${stat.offsetY}px) rotate(${stat.rotation}deg)`
                        }}
                      >
                         {/* Float Animation Wrapper (CSS) */}
                         <div className={i % 2 === 0 ? "animate-float-gentle" : "animate-float-shake"}>
                             
                             {/* Parallax Wrapper REMOVED (Keep structure for stability) */}
                             <div>
                                 {/* Card Content (Accordion) */}
                                 <div 
                                    onMouseEnter={() => setActiveCardId(stat.id)}
                                    onMouseLeave={() => setActiveCardId(null)}
                                    className={`
                                       relative overflow-hidden transition-all duration-300 ease-out cursor-pointer
                                       ${isActive ? 'w-80 z-50 scale-110 bg-slate-800/90' : 'w-40 md:w-48 h-32 bg-slate-900/60'}
                                       rounded-2xl shadow-2xl backdrop-blur-xl border border-white/10 text-white
                                       flex flex-col
                                       p-4 md:p-6
                                    `}
                                 >
                                    <div className="flex-shrink-0">
                                        <div className="text-2xl md:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">{stat.value}</div>
                                        <div className="text-xs md:text-sm font-medium uppercase tracking-wider text-slate-400">{stat.label}</div>
                                        {stat.trend && <div className="text-xs mt-2 font-bold text-green-400">{stat.trend}</div>}
                                    </div>
                                    
                                    {/* Expanded Details */}
                                    <div 
                                        className={`
                                            mt-4 pt-4 border-t border-white/10 text-xs text-slate-300 leading-relaxed
                                            transition-all duration-500 ease-in-out
                                            ${isActive ? 'opacity-100 max-h-40 translate-y-0' : 'opacity-0 max-h-0 translate-y-4'}
                                        `}
                                    >
                                        {stat.details || "More details coming soon..."}
                                    </div>
                                 </div>
                             </div>
                         </div>
                      </div>
                   );
               })}
            </div>

            {/* Simulated Loading Bar (Visible during transition) */}
            <div ref={loadingRef} className="absolute z-25 flex flex-col items-center justify-center opacity-0 pointer-events-none gap-3">
               <div className="w-48 md:w-64 h-[2px] bg-white/10 rounded-full overflow-hidden">
                  <div ref={progressBarRef} className="h-full bg-gradient-to-r from-transparent via-purple-400 to-white w-0 shadow-[0_0_15px_rgba(168,85,247,0.8)]"></div>
               </div>
               <div className="text-[10px] font-mono text-purple-300 tracking-[0.3em] uppercase animate-pulse">
                  Synthesizing Neural Data...
               </div>
            </div>

            {/* AI Text (Hidden initially) */}
            <div ref={aiTextRef} className="absolute z-30 opacity-0 pointer-events-none flex items-center justify-center">
               <span className="ai-text-gradient font-display font-black text-8xl md:text-9xl text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600 filter drop-shadow-[0_0_20px_rgba(236,72,153,0.5)]">
                 AI
               </span>
            </div>
            
        </div>
      </div>
    </div>
  );
};

export default IntroAnimation;
