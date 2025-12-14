import React, { useLayoutEffect, useRef } from 'react';

const StrangeLoopSection: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef1 = useRef<HTMLSpanElement>(null);
  const textRef2 = useRef<HTMLSpanElement>(null);
  const textRef3 = useRef<HTMLSpanElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const linearContainerRef = useRef<HTMLDivElement>(null);
  const quoteRef = useRef<HTMLDivElement>(null);

  // Data for the loop elements
  const ITEMS = [
    { id: 1, logic: 'G', note: '♩', angle: 0 },
    { id: 2, logic: '⊃', note: '♪', angle: 51.4 },
    { id: 3, logic: '∀', note: '♫', angle: 102.8 },
    { id: 4, logic: '∃', note: '♭', angle: 154.2 },
    { id: 5, logic: '~', note: '♮', angle: 205.6 },
    { id: 6, logic: 'a', note: '♯', angle: 257 },
    { id: 7, logic: 'S', note: 'ø', angle: 308.4 }
  ];

  useLayoutEffect(() => {
    const ctx = window.gsap.context(() => {
      window.gsap.registerPlugin(window.ScrollTrigger);

      const tl = window.gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "+=400%", // Long scroll
          pin: true,
          scrub: 1,
          anticipatePin: 1,
        }
      });

      // --- PHASE 1: Text Cycle & Ring Rotation (0% - 30%) ---
      
      // Text 1 -> Text 2
      tl.to(textRef1.current, { opacity: 0, duration: 1 }, 0.5);
      tl.to(textRef2.current, { opacity: 1, duration: 1 }, 1);
      
      // Rotate Ring
      tl.to(ringRef.current, { rotation: 360, duration: 10, ease: "none" }, 0);

      // --- PHASE 2: Morph Logic -> Geometry (20% - 40%) ---
      tl.to('.layer-logic', { opacity: 0, duration: 2 }, 2);
      tl.to('.layer-geo', { opacity: 1, duration: 2 }, 2);

      // Text 2 -> Text 3
      tl.to(textRef2.current, { opacity: 0, duration: 1 }, 3);
      tl.to(textRef3.current, { opacity: 1, duration: 1 }, 3.5);

      // --- PHASE 3: Morph Geometry -> Music (40% - 60%) ---
      tl.to('.layer-geo', { opacity: 0, duration: 2 }, 5);
      tl.to('.layer-music', { opacity: 1, duration: 2 }, 5);

      // --- PHASE 4: Break the Loop (60% - 80%) ---
      // Fade out ring container
      tl.to(ringRef.current, { opacity: 0, scale: 0.5, duration: 2 }, 7);
      
      // Fade in linear equation container
      tl.fromTo(linearContainerRef.current, 
        { opacity: 0, scale: 1.2 },
        { opacity: 1, scale: 1, duration: 2 }, 
        7.5
      );

      // --- PHASE 5: Reveal Quote (80% - 100%) ---
      tl.to(quoteRef.current, { opacity: 1, y: 0, duration: 2 }, 9);

    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="relative w-full h-screen bg-[#fdfbf7] text-black overflow-hidden z-20 font-serif">
      
      {/* Top Gradient for Smooth Transition from Section 5 */}
      <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-[#022c22] to-transparent z-10 pointer-events-none"></div>

      {/* Coherence Line (Starts dark to match transition, then fades) */}
      <div className="absolute top-0 left-6 md:left-10 w-px h-32 bg-gradient-to-b from-white/20 via-black/10 to-transparent z-50"></div>

      <div className="relative w-full h-full flex flex-col items-center justify-center">
        
        {/* --- TITLE SECTION --- */}
        <div className="absolute top-24 md:top-32 text-center z-30 mix-blend-difference text-white pointer-events-none">
          <h2 className="text-4xl md:text-6xl font-bold tracking-[0.5em] uppercase font-display">Strange Loop</h2>
          <div className="mt-4 text-lg md:text-xl italic opacity-90 h-8 relative w-[80vw] mx-auto">
             <span ref={textRef1} className="absolute left-0 right-0 top-0 transition-opacity">“In the beginning was the Word...”</span>
             <span ref={textRef2} className="absolute left-0 right-0 top-0 opacity-0 transition-opacity">“...and the Word was made flesh...”</span>
             <span ref={textRef3} className="absolute left-0 right-0 top-0 opacity-0 transition-opacity">“...and the flesh sang the Word.”</span>
          </div>
        </div>

        {/* --- CIRCULAR RING (The Loop) --- */}
        <div ref={ringRef} className="relative w-[300px] h-[300px] md:w-[500px] md:h-[500px] flex items-center justify-center ring-container">
           {ITEMS.map((item, i) => (
              <div 
                key={item.id}
                className="absolute left-1/2 top-1/2 w-24 h-24 -ml-12 -mt-12 flex items-center justify-center"
                style={{ 
                   transform: `rotate(${item.angle}deg) translateY(calc(var(--loop-radius) * -1)) rotate(${-item.angle}deg)` 
                }}
              >
                 <div className="relative w-full h-full flex items-center justify-center">
                    {/* Layer 1: Logic */}
                    <div className="layer-logic absolute inset-0 flex items-center justify-center text-4xl md:text-5xl font-mono font-bold">
                       {item.logic}
                    </div>
                    
                    {/* Layer 2: Geometry (Escher-esque Diamond) */}
                    <div className="layer-geo absolute inset-0 flex items-center justify-center opacity-0">
                       <svg viewBox="0 0 100 100" className="w-16 h-16 md:w-20 md:h-20 fill-black">
                          <path d="M50 0 L75 25 L100 50 L75 75 L50 100 L25 75 L0 50 L25 25 Z" />
                          <circle cx="35" cy="40" r="4" fill="#fdfbf7" /> 
                       </svg>
                    </div>

                    {/* Layer 3: Music */}
                    <div className="layer-music absolute inset-0 flex items-center justify-center opacity-0 text-5xl md:text-6xl">
                       {item.note}
                    </div>
                 </div>
              </div>
           ))}
           {/* Center Decoration */}
           <div className="absolute text-sm font-mono tracking-widest opacity-20">G E B</div>
        </div>

        {/* --- LINEAR FORM (The Proof) --- */}
        <div ref={linearContainerRef} className="absolute inset-0 flex items-center justify-center opacity-0 pointer-events-none">
           <div className="flex flex-col items-center gap-8">
              {/* The "Formula" */}
              <div className="flex items-center gap-4 md:gap-8 text-3xl md:text-5xl font-mono font-bold">
                 <span>~</span>
                 <span>∃</span>
                 <span>a</span>
                 <span>:</span>
                 <span className="bg-black text-[#fdfbf7] px-2">Proof</span>
                 <span>(a)</span>
              </div>
              
              {/* Music Staff visual */}
              <div className="w-[80vw] max-w-lg h-24 border-y border-black/10 flex items-center justify-around relative">
                 <div className="absolute inset-x-0 top-1/3 h-px bg-black/10"></div>
                 <div className="absolute inset-x-0 bottom-1/3 h-px bg-black/10"></div>
                 
                 {ITEMS.map((item, i) => (
                    <span key={i} className="text-3xl md:text-4xl relative" style={{ top: Math.sin(i) * 10 }}>
                       {item.note}
                    </span>
                 ))}
              </div>
           </div>
        </div>

        {/* --- FOOTER QUOTE --- */}
        <div ref={quoteRef} className="absolute bottom-12 md:bottom-20 px-6 text-center opacity-0 transform translate-y-10">
           <p className="text-xl md:text-2xl font-serif italic max-w-3xl mx-auto leading-relaxed text-gray-800">
             "Gödel, Escher, and Bach were only shadows cast in different directions by some central solid essence."
           </p>
           <div className="mt-6 font-mono text-xs md:text-sm tracking-[0.2em] text-gray-500 uppercase">
             — Douglas Hofstadter
           </div>
        </div>

      </div>

      <style>{`
        .ring-container {
            --loop-radius: 140px;
        }
        @media (min-width: 768px) {
            .ring-container {
                --loop-radius: 220px;
            }
        }
      `}</style>
    </div>
  );
};

export default StrangeLoopSection;