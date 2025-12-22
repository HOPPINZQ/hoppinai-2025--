import React, { useLayoutEffect, useRef } from 'react';
import { MEMORY_IMAGES } from '../data';

const ExpandingGallerySection: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const windowRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const ctx = window.gsap.context(() => {
      // Register ScrollTrigger
      window.gsap.registerPlugin(window.ScrollTrigger);

      const timeline = window.gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "+=300%", // Long scroll distance for the effect
          scrub: 1,
          pin: true,
          anticipatePin: 1,
        }
      });

      // 1. Expand the window to full screen
      // Use fromTo to strictly control the initial state and avoid CSS conflicts
      timeline.fromTo(windowRef.current, 
        {
          width: "50vw", // Initial width: 50% of viewport
          height: "70vh", // Initial height: 70% of viewport
          borderRadius: "16px" // rounded-2xl
        },
        {
          width: "100vw",
          height: "100vh",
          borderRadius: 0,
          ease: "power2.inOut",
          duration: 2
        }, 
        0
      );

      // 2. Rotate the inner grid/content
      timeline.to(gridRef.current, {
        rotation: 135,
        scale: 1.5, // Zoom in slightly while rotating
        ease: "none", // Linear rotation feels more mechanical/smooth
        duration: 2
      }, 0);

      // 3. Counter-rotate text to keep it upright (optional, but good for readability)
      timeline.to(textRef.current, {
        rotation: -135,
        ease: "none",
        duration: 2
      }, 0);

    }, containerRef);

    return () => ctx.revert();
  }, []);

  // Generate spiral positions
  const displayImages = [...MEMORY_IMAGES, ...MEMORY_IMAGES, ...MEMORY_IMAGES].map((img, i) => {
     const angle = i * 0.6; // Angle step
     const radius = 280 + i * 40; // Start radius and growth
     const x = Math.cos(angle) * radius;
     const y = Math.sin(angle) * radius;
     const rotation = (angle * 180 / Math.PI) - 90; // Rotate to face center/tangent
     
     return {
       ...img,
       uniqueId: `${img.id}-${i}`,
       x,
       y,
       rotation
     };
  });

  return (
    <div 
      ref={containerRef} 
      id="expanding-gallery-container"
      className="relative w-full h-screen overflow-hidden bg-black z-20"
    >
      
      {/* Wrapper that gets pinned */}
      <div ref={wrapperRef} className="w-full h-full flex items-center justify-center">
        
        {/* The Expanding Window */}
        {/* We use inline styles as a fallback, but GSAP takes over immediately */}
        <div 
            ref={windowRef}
            className="relative overflow-hidden border-4 border-white/20 shadow-[0_0_50px_rgba(255,255,255,0.1)] bg-slate-900"
            style={{ width: '50vw', height: '70vh', borderRadius: '16px' }}
        >
            {/* Inner Rotating Spiral */}
            <div 
                ref={gridRef}
                className="absolute top-1/2 left-1/2 w-0 h-0 flex items-center justify-center origin-center"
            >
                {/* Center Text */}
                <div 
                    ref={textRef}
                    className="absolute z-30 text-center w-[600px]"
                > 
                     <h2 className="text-5xl md:text-7xl font-black text-white tracking-tighter mb-4 drop-shadow-2xl">
                        A whole new universe
                    </h2>
                    <p className="text-xl md:text-2xl text-gray-400 font-light tracking-widest uppercase">
                        A Fundamental One
                    </p>
                </div>

                {displayImages.map((img) => (
                    <div 
                        key={img.uniqueId} 
                        className="absolute w-48 h-48 md:w-64 md:h-64 rounded-xl overflow-hidden shadow-2xl transition-all duration-500 hover:scale-110 hover:z-50 group"
                        style={{
                            transform: `translate(${img.x}px, ${img.y}px) rotate(${img.rotation}deg)`,
                        }}
                    >
                        <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors z-10" />
                        <img 
                            src={img.url} 
                            alt={img.alt} 
                            className="w-full h-full object-cover"
                        />
                    </div>
                ))}
            </div>
        </div>

      </div>

    </div>
  );
};

export default ExpandingGallerySection;
