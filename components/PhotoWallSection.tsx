import React, { useLayoutEffect, useRef, useState } from 'react';
import { Aperture, X, Info, ArrowUpRight } from 'lucide-react';

// --- DATA: COMPARATOR STAGES (PART 1) ---
const STAGES = [
  {
    id: 1,
    image: 'https://picsum.photos/1600/900?random=10',
    label: 'Q1: The Quiet Stone',
    title: 'Foundation',
    subtitle: '— Heat and stillness',
    color: 'bg-orange-500',
    description: "The year began with grounding. Like a stone sitting quietly in the sun, Q1 was about building the base. I focused on core skills, established a new morning routine, and laid the groundwork for the projects to come."
  },
  {
    id: 2,
    image: 'https://picsum.photos/1600/900?random=20',
    label: 'Q2: Storm Break',
    title: 'Turbulence',
    subtitle: '— Cracks under pressure',
    color: 'bg-blue-500',
    description: "April brought unexpected challenges. Project deadlines tightened and personal commitments piled up. It was a storm, but cracks let the light in. I learned resilience and the art of saying 'no'."
  },
  {
    id: 3,
    image: 'https://picsum.photos/1600/900?random=30',
    label: 'Q3: Snow Keep',
    title: 'Clarity',
    subtitle: '— Silence taking over',
    color: 'bg-white',
    description: "After the storm, silence. Q3 was a period of deep focus and clarity. I traveled to Kyoto, disconnected from social media, and found a new sense of purpose in simplicity."
  },
  {
    id: 4,
    image: 'https://picsum.photos/1600/900?random=40',
    label: 'Q4: Root Hold',
    title: 'Regrowth',
    subtitle: '— Time growing back',
    color: 'bg-emerald-500',
    description: "The final stretch. Like roots taking hold after a long winter, Q4 was about growth. The seeds planted in Q1 and tended through the storm finally bloomed. Promotion, stability, and peace."
  }
];

// --- DATA: GALLERY ITEMS (PART 2) ---
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

// ==========================================
// SUB-COMPONENT: COMPARATOR (The "Slider")
// ==========================================
const TimeShiftComparator: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const dividerRef = useRef<HTMLDivElement>(null);
  const layersRef = useRef<(HTMLDivElement | null)[]>([]);
  const [percentage, setPercentage] = useState(0);
  const [activeStage, setActiveStage] = useState(1);
  const [selectedStage, setSelectedStage] = useState<typeof STAGES[0] | null>(null);

  useLayoutEffect(() => {
    const ctx = window.gsap.context(() => {
      window.gsap.registerPlugin(window.ScrollTrigger);

      const totalTransitions = STAGES.length - 1; 

      const tl = window.gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: `+=${totalTransitions * 150}%`,
          pin: true,
          scrub: 0.5,
          anticipatePin: 1,
          onUpdate: (self: any) => {
            setPercentage(Math.round(self.progress * 100));
            const currentStage = Math.floor(self.progress * totalTransitions) + 1;
            setActiveStage(Math.min(currentStage, STAGES.length));
          }
        }
      });

      STAGES.slice(1).forEach((stage, index) => {
        const layerIndex = index + 1;
        const layer = layersRef.current[layerIndex];
        const divider = dividerRef.current;

        tl.set(divider, { left: '0%' });

        tl.to([layer, divider], {
          ease: "none",
          duration: 1,
          onUpdate: function() {
             if (layer) {
                const progress = this.progress();
                const clipVal = (1 - progress) * 100;
                layer.style.clipPath = `inset(0 ${clipVal}% 0 0)`;
                if (divider) divider.style.left = `${progress * 100}%`;
             }
          }
        });
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <>
      <div ref={containerRef} className="relative w-full h-screen overflow-hidden bg-[#050505] text-white">
        
        {/* Coherence Line */}
        <div className="absolute top-0 left-6 md:left-10 w-px h-32 bg-gradient-to-b from-white/0 via-white/20 to-white/0 z-50"></div>

        {/* Section Header */}
        <div className="absolute top-0 left-0 w-full z-40 px-6 md:px-10 pt-24 pb-4 pointer-events-none">
            <div className="flex justify-between items-end">
                <div>
                <h2 className="text-3xl md:text-5xl font-display font-bold text-white">
                    Section 4: <span className="text-orange-500">Visual Chronicles</span>
                </h2>
                <p className="text-slate-400 mt-2 text-sm md:text-base">Part I: Time Shift • Quarterly Comparison</p>
                </div>
                {/* Percentage Indicator */}
                <div className="hidden md:flex flex-col items-end pointer-events-auto">
                    <div className="text-4xl font-display font-bold text-white/20">{percentage}%</div>
                </div>
            </div>
        </div>

        <div className="relative w-full h-full cursor-pointer group">
           {/* Layers */}
           {STAGES.map((stage, index) => (
              <div 
                 key={stage.id}
                 ref={(el) => { layersRef.current[index] = el }}
                 className="absolute inset-0 w-full h-full"
                 style={{ 
                    zIndex: 10 + index,
                    clipPath: index === 0 ? 'inset(0 0% 0 0)' : 'inset(0 100% 0 0)' 
                 }}
                 onClick={() => setSelectedStage(stage)}
              >
                 <img src={stage.image} alt={stage.title} className="w-full h-full object-cover brightness-[0.8] transition-transform duration-700 group-hover:scale-105" />
                 <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40 pointer-events-none"></div>
                 
                 {/* Text Content */}
                 <div className="absolute bottom-20 left-6 md:left-20 max-w-lg pointer-events-none">
                    <div className={`inline-block px-3 py-1 rounded-full ${stage.color} text-white text-xs font-bold uppercase tracking-widest mb-4 shadow-lg`}>
                       {stage.label}
                    </div>
                    <h2 className="text-5xl md:text-7xl font-display font-bold text-white leading-none mb-2 drop-shadow-2xl">{stage.title}</h2>
                    <h3 className="text-xl md:text-2xl font-serif italic text-slate-300">{stage.subtitle}</h3>
                    
                    <div className="mt-4 flex items-center text-white/50 text-sm gap-2 opacity-0 group-hover:opacity-100 transition-opacity delay-300">
                        <Info size={16} /> Click to expand thought
                    </div>
                 </div>
              </div>
           ))}

           {/* Divider */}
           <div 
              ref={dividerRef}
              className="absolute top-0 bottom-0 w-0.5 bg-white z-50 pointer-events-none shadow-[0_0_20px_rgba(255,255,255,0.5)]"
              style={{ left: '0%' }}
           >
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-white/10 backdrop-blur-md border border-white rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(255,255,255,0.3)]">
                 <Aperture size={18} className="text-white animate-spin-slow" />
              </div>
           </div>

           {/* Indicators */}
           <div className="absolute bottom-10 right-10 z-50 flex gap-2 pointer-events-none">
              {STAGES.map((stage) => (
                 <div 
                    key={stage.id}
                    className={`w-8 h-1 transition-all duration-300 ${activeStage === stage.id ? 'bg-white shadow-[0_0_10px_white]' : 'bg-white/20'}`}
                 />
              ))}
           </div>
        </div>
      </div>

      {/* POPUP MODAL */}
      {selectedStage && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
           {/* Backdrop */}
           <div 
             className="absolute inset-0 bg-black/80 backdrop-blur-sm animate-fade-in" 
             onClick={() => setSelectedStage(null)}
           ></div>
           
           {/* Modal Card */}
           <div className="relative w-full max-w-4xl bg-[#111] rounded-2xl overflow-hidden shadow-2xl flex flex-col md:flex-row border border-white/10 animate-scale-up">
              <button 
                 onClick={() => setSelectedStage(null)}
                 className="absolute top-4 right-4 z-50 p-2 bg-black/50 rounded-full text-white hover:bg-white hover:text-black transition-colors"
              >
                 <X size={20} />
              </button>

              {/* Image Side */}
              <div className="w-full md:w-1/2 h-64 md:h-auto relative">
                 <img src={selectedStage.image} alt={selectedStage.title} className="w-full h-full object-cover" />
                 <div className="absolute inset-0 bg-gradient-to-t from-[#111] via-transparent to-transparent md:bg-gradient-to-r"></div>
              </div>

              {/* Content Side */}
              <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
                 <div className={`self-start px-3 py-1 rounded-full ${selectedStage.color} text-white text-xs font-bold uppercase tracking-widest mb-6`}>
                    {selectedStage.label}
                 </div>
                 <h2 className="text-4xl md:text-5xl font-display font-bold text-white mb-2">{selectedStage.title}</h2>
                 <h3 className="text-xl font-serif italic text-slate-400 mb-6">{selectedStage.subtitle}</h3>
                 
                 <div className="w-12 h-0.5 bg-white/20 mb-6"></div>
                 
                 <p className="text-slate-300 leading-relaxed text-lg">
                    {selectedStage.description}
                 </p>
              </div>
           </div>
        </div>
      )}

      <style>{`
         .animate-fade-in {
            animation: fadeIn 0.3s ease-out forwards;
         }
         .animate-scale-up {
            animation: scaleUp 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
         }
         @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
         }
         @keyframes scaleUp {
            from { opacity: 0; transform: scale(0.95) translateY(20px); }
            to { opacity: 1; transform: scale(1) translateY(0); }
         }
      `}</style>
    </>
  );
};

// ==========================================
// SUB-COMPONENT: MOUSE GALLERY (Part 2)
// ==========================================
const MouseGallerySubSection: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const galleryRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const ctx = window.gsap.context(() => {
      const handleMouseMove = (e: MouseEvent) => {
        if (!galleryRef.current) return;
        const xPercent = (e.clientX / window.innerWidth) - 0.5;
        const yPercent = (e.clientY / window.innerHeight) - 0.5;

        window.gsap.to(galleryRef.current, {
          x: xPercent * -100,
          y: yPercent * -100,
          rotationY: xPercent * 5,
          rotationX: -yPercent * 5,
          duration: 1.2,
          ease: "power2.out"
        });
      };
      window.addEventListener('mousemove', handleMouseMove);
      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
      };
    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="relative w-full h-screen overflow-hidden bg-[#111] z-30 border-t border-white/10">
      
      {/* Header (Absolute) */}
      <div className="absolute top-0 left-0 w-full z-40 px-6 md:px-10 pt-24 pb-4 pointer-events-none">
        <div>
           <div className="text-yellow-400 text-sm font-bold uppercase tracking-widest mb-1">Part II</div>
           <h2 className="text-3xl md:text-5xl font-display font-bold text-white">
              The Showcase
           </h2>
           <p className="text-slate-400 mt-2 text-sm md:text-base">Interactive Pan • Move mouse to explore</p>
        </div>
      </div>

      {/* Gallery Container */}
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
                 <img 
                   src={item.src} 
                   alt={item.title} 
                   className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                 />
                 <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                 <div className="absolute bottom-6 left-6 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 delay-75">
                    <div className="text-amber-400 text-xs font-bold uppercase tracking-widest mb-1">{item.cat}</div>
                    <h3 className="text-white text-xl md:text-2xl font-display font-bold leading-tight flex items-center gap-2">
                      {item.title} <ArrowUpRight size={18} className="text-white/50" />
                    </h3>
                 </div>
                 <div className="absolute inset-4 border border-white/20 scale-95 opacity-0 group-hover:scale-100 group-hover:opacity-100 transition-all duration-500"></div>
              </div>
           ))}
        </div>
      </div>
      <style>{` .perspective-1000 { perspective: 1000px; } `}</style>
    </div>
  );
};

// ==========================================
// MAIN COMPONENT EXPORT
// ==========================================
const PhotoWallSection: React.FC = () => {
  return (
    <div className="relative z-30 bg-[#050505]">
      <TimeShiftComparator />
      <MouseGallerySubSection />
    </div>
  );
};

export default PhotoWallSection;