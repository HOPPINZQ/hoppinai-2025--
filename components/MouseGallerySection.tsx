import React, { useLayoutEffect, useRef } from 'react';
import { ArrowUpRight } from 'lucide-react';

const GALLERY_ITEMS = [
  { id: 1, src: 'https://picsum.photos/600/800?random=301', title: 'Alone on Nature', cat: 'Nature', className: 'md:col-span-1 md:row-span-2' },
  { id: 2, src: 'https://picsum.photos/800/600?random=302', title: 'Urban Solitude', cat: 'City', className: 'md:col-span-2 md:row-span-1' },
  { id: 3, src: 'https://picsum.photos/600/800?random=303', title: 'Living Dream', cat: 'Life', className: 'md:col-span-1 md:row-span-1' },
  { id: 4, src: 'https://picsum.photos/600/800?random=304', title: 'Forever Young', cat: 'Portrait', className: 'md:col-span-1 md:row-span-1' },
  { id: 5, src: 'https://picsum.photos/800/600?random=305', title: 'Sunny Side Up', cat: 'Vibes', className: 'md:col-span-1 md:row-span-1' },
  { id: 6, src: 'https://picsum.photos/600/800?random=306', title: 'The Other Side', cat: 'Abstract', className: 'md:col-span-1 md:row-span-2' },
  { id: 7, src: 'https://picsum.photos/800/600?random=307', title: 'Discover Norway', cat: 'Travel', className: 'md:col-span-2 md:row-span-1' },
  { id: 8, src: 'https://picsum.photos/600/800?random=308', title: 'Wonderful Life', cat: 'Moments', className: 'md:col-span-1 md:row-span-1' },
];

const MouseGallerySection: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const galleryRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const ctx = window.gsap.context(() => {
      // Mouse Move Parallax Logic
      const handleMouseMove = (e: MouseEvent) => {
        if (!galleryRef.current) return;

        const xPercent = (e.clientX / window.innerWidth) - 0.5;
        const yPercent = (e.clientY / window.innerHeight) - 0.5;

        // Move the gallery opposite to mouse direction
        // The gallery is larger than the screen, so we shift it to reveal edges
        window.gsap.to(galleryRef.current, {
          x: xPercent * -100, // Move up to 100px left/right
          y: yPercent * -100, // Move up to 100px up/down
          rotationY: xPercent * 5, // Subtle 3D tilt
          rotationX: -yPercent * 5,
          duration: 1.2,
          ease: "power2.out"
        });
      };

      window.addEventListener('mousemove', handleMouseMove);

      // Clean up event listener when component unmounts or context reverts
      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
      };
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="relative w-full h-screen overflow-hidden bg-[#111] z-30">
      
      {/* Coherence Line */}
      <div className="absolute top-0 left-6 md:left-10 w-px h-32 bg-gradient-to-b from-white/0 via-white/20 to-white/0 z-50"></div>

      {/* Header (Absolute) */}
      <div className="absolute top-0 left-0 w-full z-40 px-6 md:px-10 pt-24 pb-4 pointer-events-none">
        <div>
           <h2 className="text-3xl md:text-5xl font-display font-bold text-white">
              Section 5: <span className="text-yellow-400">Visual Showcase</span>
           </h2>
           <p className="text-slate-400 mt-2 text-sm md:text-base">Interactive Pan • Move mouse to explore</p>
        </div>
      </div>

      {/* 
          Gallery Container 
          - Width/Height > 100% to allow movement without showing edges
          - Centered initially
      */}
      <div 
        ref={galleryRef}
        className="absolute top-[-10%] left-[-10%] w-[120%] h-[120%] flex items-center justify-center perspective-1000"
      >
        <div className="w-full max-w-[1600px] p-4 grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 auto-rows-[200px] md:auto-rows-[300px]">
           {GALLERY_ITEMS.map((item) => (
              <div 
                key={item.id} 
                className={`relative group overflow-hidden rounded-lg cursor-pointer shadow-2xl ${item.className || ''}`}
              >
                 {/* Image */}
                 <img 
                   src={item.src} 
                   alt={item.title} 
                   className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                 />
                 
                 {/* Overlay (Matches your requested style) */}
                 <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                 
                 {/* Content Box */}
                 <div className="absolute bottom-6 left-6 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 delay-75">
                    <div className="text-amber-400 text-xs font-bold uppercase tracking-widest mb-1">{item.cat}</div>
                    <h3 className="text-white text-xl md:text-2xl font-display font-bold leading-tight flex items-center gap-2">
                      {item.title} <ArrowUpRight size={18} className="text-white/50" />
                    </h3>
                 </div>
                 
                 {/* Border Effect */}
                 <div className="absolute inset-4 border border-white/20 scale-95 opacity-0 group-hover:scale-100 group-hover:opacity-100 transition-all duration-500"></div>
              </div>
           ))}
        </div>
      </div>

      <style>{`
        .perspective-1000 {
           perspective: 1000px;
        }
      `}</style>
    </div>
  );
};

export default MouseGallerySection;