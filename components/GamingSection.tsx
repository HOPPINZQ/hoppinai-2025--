import React, { useLayoutEffect, useRef, useState } from 'react';
import { Smartphone, Laptop, Trophy, Activity, Target, Sword, Crosshair, Box, Hexagon, Wifi, Camera, Aperture, Zap, Maximize2, Clock, ShoppingCart, Star, Gamepad2, ArrowRight, Check, Send, Users, MousePointer2 } from 'lucide-react';

// --- DATA: DASHBOARD ---
const GAMES = [
  {
    id: 'lolm',
    title: 'League of Legends: Wild Rift',
    platform: 'Mobile',
    icon: <Smartphone size={18} />,
    rank: 'Grandmaster',
    hours: '420h',
    spent: '$120',
    tags: ['MOBA', 'Strategy'],
    image: 'https://picsum.photos/800/600?random=501' 
  },
  {
    id: 'lol',
    title: 'League of Legends',
    platform: 'PC',
    icon: <Laptop size={18} />,
    rank: 'Diamond II',
    hours: '8,400h',
    spent: '$1,500',
    tags: ['Competitive', 'Esports'],
    image: 'https://picsum.photos/800/600?random=502'
  },
  {
    id: 'dota2',
    title: 'DOTA 2',
    platform: 'PC',
    icon: <Laptop size={18} />,
    rank: 'Ancient 4',
    hours: '2,100h',
    spent: '$850',
    tags: ['Strategy', 'Hardcore'],
    image: 'https://picsum.photos/800/600?random=503'
  },
  {
    id: 'csgo2',
    title: 'CS:GO 2',
    platform: 'PC',
    icon: <Laptop size={18} />,
    rank: 'Global Elite',
    hours: '1,500h',
    spent: '$3,200',
    tags: ['FPS', 'Tactical'],
    image: 'https://picsum.photos/800/600?random=504'
  }
];

// --- DATA: GALLERY SLIDES ---
const SLIDES = [
  {
    id: 1,
    image: "https://picsum.photos/1600/2000?random=901",
    title: "The Perfect Frame",
    subtitle: "Aperture Mode",
    meta: "f/1.4 • ISO 100",
    icon: <Aperture size={20} />,
    description: "Capturing the stillness before the battle. The lighting engine in Cyberpunk 2077 creates moments that rival reality."
  },
  {
    id: 2,
    image: "https://picsum.photos/1600/2000?random=902",
    title: "High Velocity",
    subtitle: "Shutter Mode",
    meta: "1/2000s • ISO 800",
    icon: <Zap size={20} />,
    description: "Freezing the chaos of a drift turn in Forza Horizon. Speed is just a number when time stands still."
  },
  {
    id: 3,
    image: "https://picsum.photos/1600/2000?random=903",
    title: "Virtual Photographer",
    subtitle: "Manual Control",
    meta: "RAW • 4K Capture",
    icon: <Camera size={20} />,
    description: "Using the in-game photo mode to compose art. From framing to post-processing, every shot tells a story of the virtual world."
  }
];

// --- DATA: STEAM ---
const STEAM_PLAYTIME = [
  { id: '1', title: 'Elden Ring', hours: 450, span: 'md:col-span-2 md:row-span-2', image: 'https://picsum.photos/800/800?random=601' },
  { id: '2', title: 'Baldur\'s Gate 3', hours: 320, span: 'md:col-span-1 md:row-span-2', image: 'https://picsum.photos/400/800?random=602' },
  { id: '3', title: 'Hollow Knight', hours: 120, span: 'md:col-span-1 md:row-span-1', image: 'https://picsum.photos/400/400?random=603' },
  { id: '4', title: 'Stardew Valley', hours: 200, span: 'md:col-span-1 md:row-span-1', image: 'https://picsum.photos/400/400?random=604' },
  { id: '5', title: 'Cyberpunk 2077', hours: 180, span: 'md:col-span-2 md:row-span-1', image: 'https://picsum.photos/800/400?random=605' },
];

const STEAM_PURCHASED = [
  { id: 'p1', title: 'God of War Ragnarok', image: 'https://picsum.photos/300/400?random=701' },
  { id: 'p2', title: 'Starfield', image: 'https://picsum.photos/300/400?random=702' },
  { id: 'p3', title: 'Armored Core VI', image: 'https://picsum.photos/300/400?random=703' },
  { id: 'p4', title: 'Sea of Stars', image: 'https://picsum.photos/300/400?random=704' },
  { id: 'p5', title: 'Final Fantasy XVI', image: 'https://picsum.photos/300/400?random=705' },
];

const STEAM_WISHLIST = [
  { id: 'w1', title: 'GTA VI', release: '2026', image: 'https://picsum.photos/300/200?random=801' },
  { id: 'w2', title: 'Hades II', release: 'Early Access', image: 'https://picsum.photos/300/200?random=802' },
  { id: 'w3', title: 'Silksong', release: 'TBA', image: 'https://picsum.photos/300/200?random=803' },
];

// --- DATA: COMPETITIVE MODULES (Fixed Order: DOTA2 -> CSGO -> LOLM -> 王者荣耀 -> LOL) ---
const COMPETITIVE_GAMES = [
  { 
    id: 'dota2', 
    navLabel: 'DOTA2',
    title: 'DOTA 2', 
    subtitle: 'The Strategic Masterpiece',
    desc: 'Defense of the Ancients. Where map control equals victory.', 
    image: 'https://picsum.photos/1920/1080?random=dota2' 
  },
  { 
    id: 'csgo', 
    navLabel: 'CSGO',
    title: 'CS:GO 2', 
    subtitle: 'Tactical Precision',
    desc: 'Counter-Strike. Pure aim, smoke lineups, and clutch defusals.', 
    image: 'https://picsum.photos/1920/1080?random=csgo' 
  },
  { 
    id: 'lolm', 
    navLabel: 'LOLM',
    title: 'Wild Rift', 
    subtitle: 'League Mobile',
    desc: 'The Rift in your pocket. Intense 15-minute battles.', 
    image: 'https://picsum.photos/1920/1080?random=wildrift' 
  },
  { 
    id: 'kog', 
    navLabel: '王者荣耀',
    title: 'Honor of Kings', 
    subtitle: '王者荣耀',
    desc: 'The giant of mobile MOBA. Fast-paced teamfights.', 
    image: 'https://picsum.photos/1920/1080?random=kog' 
  },
  { 
    id: 'lol', 
    navLabel: 'LOL',
    title: 'League of Legends', 
    subtitle: 'Summoner\'s Rift',
    desc: 'The global phenomenon. A decade of dominance.', 
    image: 'https://picsum.photos/1920/1080?random=lolpc' 
  },
];

// ==========================================
// SUB-COMPONENT: DASHBOARD (Top Part)
// ==========================================
const DashboardSubSection: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const laptopRef = useRef<HTMLDivElement>(null);
  const mobileRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const ctx = window.gsap.context(() => {
      // 1. Background Geometry Animation
      window.gsap.to('.geo-shape', {
        rotation: 360,
        duration: 20,
        repeat: -1,
        ease: "none"
      });

      window.gsap.to('.geo-float', {
        y: -20,
        duration: 3,
        yoyo: true,
        repeat: -1,
        ease: "power1.inOut",
        stagger: 0.5
      });

      // 2. Main Entry Animation
      const tl = window.gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 60%",
          end: "bottom bottom",
          toggleActions: "play none none reverse"
        }
      });

      tl.fromTo(laptopRef.current, 
        { x: -100, opacity: 0 },
        { x: 0, opacity: 1, duration: 1, ease: "power3.out" }
      );
      
      tl.fromTo(mobileRef.current,
        { x: 50, opacity: 0, y: 50 },
        { x: 0, opacity: 1, y: 0, duration: 0.8, ease: "back.out(1.7)" },
        "-=0.6"
      );

      tl.fromTo(statsRef.current?.children || [], 
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5, stagger: 0.1 },
        "-=0.4"
      );

      tl.fromTo('.game-card',
        { scale: 0.9, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.6, stagger: 0.1 },
        "-=0.2"
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="relative w-full min-h-screen flex flex-col justify-center py-24 md:py-32 font-sans z-10">
       {/* Background Decoration */}
      <div className="absolute top-20 right-20 w-64 h-64 border border-emerald-500/20 opacity-20 geo-shape geo-float pointer-events-none"></div>
      <div className="absolute bottom-40 left-10 w-32 h-32 border-2 border-emerald-400/10 rotate-45 geo-float pointer-events-none"></div>

      {/* Header */}
      <div className="absolute top-0 left-0 w-full z-40 px-6 md:px-10 pt-24 pb-4 pointer-events-none">
        <div>
           <h2 className="text-3xl md:text-5xl font-display font-bold text-white">
              Section 5: <span className="text-emerald-400">Gaming Ledger</span>
           </h2>
           <p className="text-slate-400 mt-2 text-sm md:text-base">GameFi Protocol & Steam Stats • 2025</p>
        </div>
      </div>

      <div className="relative z-10 px-6 md:px-20 mb-16 flex flex-col md:flex-row justify-between items-end border-b border-emerald-500/20 pb-8 mx-6 md:mx-20 mt-32 md:mt-10">
         <div>
            <div className="flex items-center gap-2 text-emerald-400 mb-2">
               <Hexagon size={16} fill="currentColor" className="opacity-50" />
               <span className="text-xs font-mono tracking-[0.2em] uppercase">GameFi Protocol // 2025</span>
            </div>
         </div>
         <div className="mt-4 md:mt-0 text-right">
            <div className="text-3xl font-mono font-bold text-white">$5,670<span className="text-emerald-500/50 text-xl">.00</span></div>
            <div className="text-xs text-emerald-400/60 uppercase tracking-widest">Total Value Locked (Assets)</div>
         </div>
      </div>

      <div className="relative z-10 max-w-[1600px] mx-auto px-6 md:px-20 grid grid-cols-1 lg:grid-cols-12 gap-10 w-full">
         
         {/* LEFT COLUMN: DEVICES */}
         <div className="lg:col-span-5 flex flex-col gap-8">
            <div className="relative h-[400px] w-full flex items-center justify-center">
               {/* Laptop */}
               <div ref={laptopRef} className="relative w-[340px] h-[220px] bg-emerald-950/80 rounded-lg border border-emerald-500/30 shadow-[0_0_50px_rgba(16,185,129,0.15)] flex flex-col backdrop-blur-md overflow-hidden transform hover:scale-[1.02] transition-transform duration-500">
                  <div className="h-6 bg-emerald-900/50 border-b border-emerald-500/20 flex items-center px-3 gap-1.5">
                     <div className="w-2 h-2 rounded-full bg-emerald-500/40"></div>
                     <div className="w-2 h-2 rounded-full bg-emerald-500/40"></div>
                  </div>
                  <div className="flex-1 p-4 relative">
                     <div className="absolute inset-0 bg-[url('https://picsum.photos/600/400?random=99')] bg-cover opacity-20 grayscale mix-blend-luminosity"></div>
                     <div className="relative z-10">
                        <div className="text-xs text-emerald-400 font-mono mb-1">RUNNING: STEAM_CLIENT</div>
                        <div className="text-2xl font-bold text-white">CS:GO 2</div>
                        <div className="flex items-center gap-2 mt-2">
                           <div className="px-2 py-0.5 bg-emerald-500/20 text-emerald-300 text-[10px] rounded">FPS: 240</div>
                           <div className="px-2 py-0.5 bg-emerald-500/20 text-emerald-300 text-[10px] rounded">PING: 12ms</div>
                        </div>
                     </div>
                  </div>
               </div>
               {/* Mobile */}
               <div ref={mobileRef} className="absolute bottom-0 right-10 w-[100px] h-[180px] bg-black rounded-[14px] border-2 border-emerald-500/50 shadow-2xl flex flex-col overflow-hidden transform hover:-translate-y-2 transition-transform duration-300">
                   <div className="h-full w-full bg-emerald-900 relative">
                      <img src="https://picsum.photos/200/400?random=98" className="w-full h-full object-cover opacity-40 grayscale" />
                      <div className="absolute bottom-4 left-0 w-full text-center">
                         <div className="text-[10px] font-bold text-white">WILD RIFT</div>
                         <div className="flex justify-center mt-1">
                            <Wifi size={10} className="text-emerald-400" />
                         </div>
                      </div>
                   </div>
               </div>
            </div>

            {/* Stats */}
            <div ref={statsRef} className="grid grid-cols-2 gap-4">
               <div className="bg-emerald-900/20 border border-emerald-500/20 p-4 rounded-xl backdrop-blur-sm hover:bg-emerald-800/20 transition-colors">
                  <div className="flex items-center justify-between mb-2">
                     <Activity size={18} className="text-emerald-400" />
                     <span className="text-[10px] font-mono text-emerald-500/60">METRIC_01</span>
                  </div>
                  <div className="text-2xl font-bold text-white">12,420</div>
                  <div className="text-xs text-emerald-400/60">Total Hours Played</div>
               </div>
               <div className="bg-emerald-900/20 border border-emerald-500/20 p-4 rounded-xl backdrop-blur-sm hover:bg-emerald-800/20 transition-colors">
                  <div className="flex items-center justify-between mb-2">
                     <Trophy size={18} className="text-emerald-400" />
                     <span className="text-[10px] font-mono text-emerald-500/60">METRIC_02</span>
                  </div>
                  <div className="text-2xl font-bold text-white">Top 1%</div>
                  <div className="text-xs text-emerald-400/60">Global Ranking</div>
               </div>
            </div>
         </div>

         {/* RIGHT COLUMN: GAMES */}
         <div className="lg:col-span-7 grid grid-cols-1 md:grid-cols-2 gap-6 content-start">
            {GAMES.map((game) => (
               <div key={game.id} className="game-card group relative bg-emerald-950 border border-emerald-500/20 rounded-xl overflow-hidden hover:border-emerald-400/60 hover:shadow-[0_0_30px_rgba(16,185,129,0.15)] transition-all duration-300">
                  <div className="absolute inset-0 z-0">
                     <img src={game.image} alt={game.title} className="w-full h-full object-cover opacity-20 group-hover:opacity-40 grayscale group-hover:grayscale-0 transition-all duration-500 scale-100 group-hover:scale-110" />
                     <div className="absolute inset-0 bg-gradient-to-t from-[#022c22] via-[#022c22]/80 to-transparent"></div>
                  </div>
                  <div className="relative z-10 p-6 h-full flex flex-col">
                     <div className="flex justify-between items-start mb-4">
                        <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-400 border border-emerald-500/20 group-hover:bg-emerald-400 group-hover:text-black transition-colors">
                           {game.id === 'lolm' ? <Smartphone size={20} /> : game.id === 'csgo2' ? <Crosshair size={20} /> : game.id === 'dota2' ? <Sword size={20} /> : <Target size={20} />}
                        </div>
                        <div className="flex gap-2">
                           {game.tags.map(tag => (
                              <span key={tag} className="text-[10px] font-mono uppercase px-2 py-1 border border-emerald-500/30 rounded text-emerald-300 bg-emerald-950/50">{tag}</span>
                           ))}
                        </div>
                     </div>
                     <h3 className="text-xl font-bold text-white mb-1 group-hover:text-emerald-300 transition-colors">{game.title}</h3>
                     <div className="text-xs text-emerald-500/60 font-mono mb-6">{game.platform.toUpperCase()} CLIENT</div>
                     <div className="mt-auto grid grid-cols-2 gap-4 border-t border-emerald-500/20 pt-4">
                        <div>
                           <div className="text-[10px] text-emerald-500/60 uppercase">Rank</div>
                           <div className="font-mono font-bold text-white">{game.rank}</div>
                        </div>
                        <div className="text-right">
                           <div className="text-[10px] text-emerald-500/60 uppercase">Invested</div>
                           <div className="font-mono font-bold text-emerald-400">{game.spent}</div>
                        </div>
                     </div>
                  </div>
               </div>
            ))}
         </div>
      </div>
    </div>
  );
};

// ==========================================
// SUB-COMPONENT: GALLERY (Pinned Part)
// ==========================================
const GallerySubSection: React.FC = () => {
  const triggerRef = useRef<HTMLDivElement>(null);
  const slidesRef = useRef<(HTMLDivElement | null)[]>([]);
  const finalImageRef = useRef<HTMLDivElement>(null);
  const textContentRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const ctx = window.gsap.context(() => {
      const totalSlides = SLIDES.length;
      
      const tl = window.gsap.timeline({
        scrollTrigger: {
          trigger: triggerRef.current,
          start: "top top",
          end: "+=400%", // Scroll distance
          pin: true,
          scrub: 1,
          anticipatePin: 1,
        }
      });

      // --- PHASE 1: STACK SCROLL (Peel off top cards) ---
      // We render with Z-Index: SLIDES.length - index. So Index 0 is Top.
      SLIDES.slice(0, totalSlides - 1).forEach((_, index) => {
        const slide = slidesRef.current[index];
        if (slide) {
           tl.to(slide, {
             y: -window.innerHeight,
             rotation: Math.random() * 10 - 5,
             opacity: 0, 
             duration: 1,
             ease: "power2.inOut"
           });
        }
      });

      // --- PHASE 2: FINAL IMAGE ANIMATION ---
      if (finalImageRef.current) {
          // 1. Rotate 30 degrees (User Request)
          tl.to(finalImageRef.current, {
             rotation: 30, 
             scale: 0.7, 
             duration: 1.5,
             ease: "power1.inOut"
          });

          // 2. Move to Right & Straighten slightly for split screen
          tl.to(finalImageRef.current, {
             rotation: 5, // Keep a slight tilt for style
             x: "25%", // Move to right half
             scale: 0.85, 
             duration: 1.5,
             ease: "power2.inOut"
          });
      }

      // --- PHASE 3: TEXT REVEAL ---
      if (textContentRef.current) {
         tl.fromTo(textContentRef.current, 
            { opacity: 0, x: -50, filter: "blur(10px)" },
            { opacity: 1, x: 0, filter: "blur(0px)", duration: 1.5, ease: "power2.out" },
            "<+0.5"
         );
      }
    }, triggerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={triggerRef} className="h-screen w-full relative overflow-hidden flex items-center justify-center bg-gradient-to-b from-[#022c22] to-[#020617] text-white">
       
       {/* Background Grid */}
       <div 
          className="absolute inset-0 opacity-5 pointer-events-none"
          style={{
             backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.2) 1px, transparent 1px)',
             backgroundSize: '30px 30px'
          }}
       ></div>

       {/* --- SLIDES STACK --- */}
       {SLIDES.map((slide, index) => {
          const isLast = index === SLIDES.length - 1;
          const zIndex = SLIDES.length - index; 
          
          return (
            <div 
              key={slide.id}
              ref={(el) => { 
                 if (isLast) finalImageRef.current = el; 
                 else slidesRef.current[index] = el; 
              }}
              className="absolute w-full h-full flex items-center justify-center pointer-events-none"
              style={{ zIndex: zIndex }} 
            >
               <div className="relative w-[85vw] md:w-[60vh] aspect-[3/4] p-3 bg-white shadow-2xl rounded-sm transition-transform will-change-transform">
                  {/* The Frame Content */}
                  <div className="w-full h-full relative overflow-hidden bg-gray-900 flex flex-col group">
                     {/* Image */}
                     <div className="flex-1 relative overflow-hidden">
                        <img 
                          src={slide.image} 
                          alt={slide.title} 
                          className="absolute inset-0 w-full h-full object-cover" 
                        />
                        <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md text-emerald-400 px-3 py-1 rounded-full text-xs font-mono flex items-center gap-2 border border-emerald-500/30">
                           {slide.icon} {slide.title}
                        </div>
                     </div>
                     
                     {/* Footer Meta */}
                     <div className="h-20 flex items-center justify-between px-6 bg-[#111] text-white border-t border-white/10">
                        <div>
                           <div className="text-[10px] text-emerald-500/60 uppercase tracking-widest">Mode</div>
                           <div className="text-sm font-bold">{slide.subtitle}</div>
                        </div>
                        <div className="text-right">
                           <div className="text-[10px] text-emerald-500/60 uppercase tracking-widest">Settings</div>
                           <div className="text-xs font-mono text-gray-400">{slide.meta}</div>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
          );
       })}

       {/* --- TEXT CONTENT (Left Side) --- */}
       <div 
          ref={textContentRef} 
          className="absolute left-0 top-0 bottom-0 w-full md:w-1/2 flex items-center justify-center p-8 md:p-24 z-0 pointer-events-auto"
       >
          <div className="max-w-lg">
             <div className="inline-block px-3 py-1 bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 text-xs font-bold uppercase tracking-widest mb-6 rounded-full">
                In-Game Photography
             </div>
             <h2 className="text-5xl md:text-7xl font-display font-bold text-white mb-6 leading-tight">
                Freezing <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">Time</span>
             </h2>
             <p className="text-xl text-slate-400 leading-relaxed mb-8 font-serif italic">
                "The world moves fast. Sometimes you have to pause the simulation, align the camera, and capture the ghost in the machine."
             </p>
             
             <button className="mt-10 px-8 py-3 bg-emerald-500 text-black font-bold rounded-full hover:bg-emerald-400 transition-all flex items-center gap-2 group shadow-[0_0_20px_rgba(16,185,129,0.3)]">
                <span>View Full Gallery</span> <Maximize2 size={16} className="group-hover:scale-110 transition-transform"/>
             </button>
          </div>
       </div>

    </div>
  );
}

// ==========================================
// SUB-COMPONENT: STEAM DATA (Bottom Part)
// ==========================================
const SteamSubSection: React.FC = () => {
   return (
      <div className="relative w-full py-24 px-6 md:px-20 bg-[#020617] border-t border-emerald-500/20 text-white">
         <div className="max-w-[1600px] mx-auto">
            
            <div className="flex items-center gap-3 mb-10">
               {/* MODIFIED: Changed bg-gradient to darker emerald tones to blend in (was blue-purple) */}
               <div className="p-3 bg-gradient-to-br from-emerald-900 to-teal-900 rounded-lg border border-emerald-500/20 shadow-lg">
                  <Gamepad2 size={32} className="text-emerald-400" />
               </div>
               <div>
                  <h2 className="text-3xl font-display font-bold">Steam Intelligence</h2>
                  <p className="text-slate-400">Library Analysis & Wishlist</p>
               </div>
            </div>

            {/* PART 1: PLAYTIME GRID */}
            <div className="mb-20">
               <h3 className="text-lg font-bold text-emerald-400 mb-6 flex items-center gap-2">
                  <Clock size={18} /> Most Played
               </h3>
               <div className="grid grid-cols-2 md:grid-cols-4 auto-rows-[200px] gap-4">
                  {STEAM_PLAYTIME.map((game) => (
                     <div 
                        key={game.id} 
                        className={`relative group rounded-xl overflow-hidden border border-white/10 bg-slate-900 ${game.span}`}
                     >
                        <img src={game.image} className="w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity duration-500 scale-100 group-hover:scale-105" alt={game.title} />
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent"></div>
                        <div className="absolute bottom-0 left-0 p-4 w-full">
                           <div className="text-2xl font-bold font-display leading-none mb-1">{game.hours}h</div>
                           <div className="text-sm text-slate-300 font-medium truncate">{game.title}</div>
                        </div>
                     </div>
                  ))}
               </div>
            </div>

            {/* PART 2: PURCHASED SCROLLER */}
            <div className="mb-20">
               <h3 className="text-lg font-bold text-emerald-400 mb-6 flex items-center gap-2">
                  <ShoppingCart size={18} /> Recently Acquired
               </h3>
               <div className="flex overflow-x-auto gap-4 pb-4 no-scrollbar">
                  {STEAM_PURCHASED.map((game) => (
                     <div key={game.id} className="flex-shrink-0 w-[180px] bg-slate-800 rounded-lg overflow-hidden border border-white/5 hover:border-emerald-400/50 transition-colors group cursor-pointer">
                        <div className="aspect-[3/4] overflow-hidden">
                           <img src={game.image} className="w-full h-full object-cover" alt={game.title} />
                        </div>
                        <div className="p-3">
                           <div className="text-sm font-bold truncate group-hover:text-emerald-400 transition-colors">{game.title}</div>
                           <div className="text-xs text-slate-500 mt-1">Added in 2025</div>
                        </div>
                     </div>
                  ))}
               </div>
            </div>

            {/* PART 3: WISHLIST */}
            <div>
               <h3 className="text-lg font-bold text-emerald-400 mb-6 flex items-center gap-2">
                  <Star size={18} /> Anticipated
               </h3>
               <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {STEAM_WISHLIST.map((game) => (
                     <div key={game.id} className="flex items-center gap-4 bg-white/5 p-4 rounded-xl border border-white/10 hover:bg-white/10 transition-colors">
                        <div className="w-20 h-12 rounded overflow-hidden flex-shrink-0">
                           <img src={game.image} className="w-full h-full object-cover" alt={game.title} />
                        </div>
                        <div>
                           <div className="font-bold">{game.title}</div>
                           <div className="text-xs text-emerald-400/80 bg-emerald-950/50 px-2 py-0.5 rounded inline-block mt-1 border border-emerald-500/20">{game.release}</div>
                        </div>
                     </div>
                  ))}
               </div>
            </div>

         </div>
      </div>
   );
}

// ==========================================
// SUB-COMPONENT: VERTICAL GAME SCROLL (REPLACES SLIDER)
// ==========================================
const VerticalGameScroll: React.FC = () => {
   const containerRef = useRef<HTMLDivElement>(null);
   const [activeIndex, setActiveIndex] = useState(0);

   useLayoutEffect(() => {
     const ctx = window.gsap.context(() => {
       const trigger = containerRef.current;
       if (!trigger) return;

       const totalSections = COMPETITIVE_GAMES.length;

       window.ScrollTrigger.create({
         trigger: trigger,
         start: "top top",
         end: `+=${totalSections * 100}%`, // 100vh per section
         pin: true,
         scrub: true,
         onUpdate: (self: any) => {
           // Calculate current index (0 to length-1) based on scroll progress
           const progress = self.progress;
           const newIndex = Math.min(totalSections - 1, Math.floor(progress * totalSections));
           setActiveIndex(newIndex);
         }
       });

     }, containerRef);
     return () => ctx.revert();
   }, []);

   return (
      <div ref={containerRef} className="relative w-full h-screen bg-[#020617] text-white overflow-hidden">
         
         {/* Background Title (Fixed) */}
         <div className="absolute top-10 left-10 z-10 pointer-events-none">
            <h2 className="text-4xl md:text-6xl font-display font-bold text-white/10">COMPETITIVE<br/>ARENAS</h2>
         </div>

         {/* --- SIDE NAVIGATION (l-side-nav) --- */}
         <nav className="l-side-nav absolute right-10 top-1/2 -translate-y-1/2 z-50">
            <ul className="side-nav flex flex-col gap-6 items-end">
               {COMPETITIVE_GAMES.map((game, index) => (
                  <li 
                     key={game.id} 
                     className={`transition-all duration-300 flex items-center gap-3 cursor-pointer ${
                        index === activeIndex ? 'is-active text-emerald-400 font-bold scale-110' : 'text-slate-600'
                     }`}
                     onClick={() => {
                        // Optional: Add scrollto logic here if needed
                     }}
                  >
                     <span className="uppercase tracking-widest text-sm font-display">{game.navLabel}</span>
                     <div className={`h-2 w-2 rounded-full transition-colors duration-300 ${
                        index === activeIndex ? 'bg-emerald-400' : 'bg-slate-700'
                     }`}></div>
                  </li>
               ))}
            </ul>
         </nav>

         {/* --- MAIN CONTENT (l-main-content) --- */}
         <ul className="l-main-content main-content relative w-full h-full">
            {COMPETITIVE_GAMES.map((game, index) => (
               <li 
                  key={game.id}
                  className={`l-section section absolute inset-0 w-full h-full transition-all duration-700 ease-in-out flex items-center justify-center ${
                     index === activeIndex 
                        ? 'section--is-active opacity-100 translate-y-0 z-20 pointer-events-auto' 
                        : 'opacity-0 translate-y-20 z-0 pointer-events-none'
                  }`}
               >
                  {/* Content Wrapper */}
                  <div className="relative w-full h-full">
                     
                     {/* Full Screen Background Image */}
                     <div className="absolute inset-0 z-0">
                        <img 
                           src={game.image} 
                           alt={game.title} 
                           className="w-full h-full object-cover opacity-40 transition-transform duration-[10s] ease-linear scale-105"
                           style={{ transform: index === activeIndex ? 'scale(1.1)' : 'scale(1.0)' }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-[#020617]/50 to-transparent"></div>
                     </div>

                     {/* Text Content */}
                     <div className="relative z-10 w-full h-full flex flex-col justify-center px-10 md:px-20 max-w-5xl mx-auto">
                        <div className="intro--banner">
                           <div className="text-emerald-400 font-bold uppercase tracking-[0.3em] mb-4 flex items-center gap-2">
                              <span className="w-10 h-[2px] bg-emerald-500"></span>
                              {game.subtitle}
                           </div>
                           <h1 className="text-6xl md:text-8xl font-display font-black text-white mb-6 leading-tight drop-shadow-2xl">
                              {game.title}
                           </h1>
                           <p className="text-xl md:text-2xl text-slate-300 max-w-2xl leading-relaxed mb-10 border-l-4 border-emerald-500 pl-6">
                              {game.desc}
                           </p>
                           
                           <button className="cta group px-8 py-4 bg-emerald-500 text-black font-bold rounded-full hover:bg-white transition-all flex items-center gap-3">
                              <span>View Match History</span>
                              <MousePointer2 size={18} className="group-hover:translate-x-1 transition-transform" />
                              <span className="btn-background"></span>
                           </button>
                        </div>
                     </div>
                  </div>
               </li>
            ))}
         </ul>

      </div>
   );
};

// ==========================================
// SUB-COMPONENT: SQUAD UP (Contact Form)
// ==========================================
const SquadUpSubSection: React.FC = () => {
   return (
      <div className="relative w-full py-32 bg-[#020617] border-t border-emerald-500/20">
         <div className="max-w-4xl mx-auto px-6 text-center">
            
            <div className="mb-12">
               <h2 className="text-4xl md:text-6xl font-display font-bold text-white mb-6">Need a <span className="text-emerald-400">Teammate?</span></h2>
               <p className="text-slate-400 text-lg max-w-2xl mx-auto">
                  Whether it's ranking up in Solo Queue or building a Clash team, I'm always ready for the next match. Let's squad up.
               </p>
            </div>

            {/* Selection Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-12 max-w-2xl mx-auto">
               {['Ranked Duo', 'Clash Team', 'ARAM Chill', 'Coaching', '1v1 Practice', 'Tournament'].map((opt) => (
                  <label key={opt} className="cursor-pointer group relative">
                     <input type="checkbox" className="peer sr-only" />
                     <div className="p-4 rounded-xl bg-slate-900 border border-white/10 peer-checked:border-emerald-500 peer-checked:bg-emerald-900/20 transition-all flex items-center justify-center gap-2">
                        <span className="text-slate-300 group-hover:text-white transition-colors">{opt}</span>
                        <Check size={16} className="text-emerald-500 opacity-0 peer-checked:opacity-100 transition-opacity" />
                     </div>
                  </label>
               ))}
            </div>

            {/* Input Fields */}
            <div className="flex flex-col md:flex-row gap-4 max-w-2xl mx-auto mb-8">
               <div className="flex-1 relative group">
                  <input type="text" placeholder=" " className="w-full bg-slate-900 border border-white/10 rounded-xl p-4 text-white focus:border-emerald-500 focus:outline-none transition-colors peer" />
                  <label className="absolute left-4 top-4 text-slate-500 pointer-events-none transition-all peer-focus:-top-2.5 peer-focus:text-xs peer-focus:bg-[#020617] peer-focus:px-1 peer-focus:text-emerald-400 peer-[:not(:placeholder-shown)]:-top-2.5 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:bg-[#020617] peer-[:not(:placeholder-shown)]:px-1">
                     Summoner Name / Steam ID
                  </label>
               </div>
               <div className="flex-1 relative group">
                  <input type="email" placeholder=" " className="w-full bg-slate-900 border border-white/10 rounded-xl p-4 text-white focus:border-emerald-500 focus:outline-none transition-colors peer" />
                  <label className="absolute left-4 top-4 text-slate-500 pointer-events-none transition-all peer-focus:-top-2.5 peer-focus:text-xs peer-focus:bg-[#020617] peer-focus:px-1 peer-focus:text-emerald-400 peer-[:not(:placeholder-shown)]:-top-2.5 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:bg-[#020617] peer-[:not(:placeholder-shown)]:px-1">
                     Discord / Email
                  </label>
               </div>
            </div>

            <button className="px-10 py-4 bg-emerald-500 text-black font-bold text-lg rounded-full hover:bg-white hover:scale-105 transition-all shadow-[0_0_30px_rgba(16,185,129,0.3)] flex items-center gap-3 mx-auto">
               Send Invite <Send size={20} />
            </button>

            <div className="mt-16 pt-16 border-t border-white/5 flex flex-col md:flex-row justify-between items-center text-sm text-slate-500">
               <div>&copy; 2025 hoppinzq Gaming Protocol</div>
               <div className="flex gap-6 mt-4 md:mt-0">
                  <a href="#" className="hover:text-emerald-400 transition-colors">Steam Profile</a>
                  <a href="#" className="hover:text-emerald-400 transition-colors">OP.GG</a>
                  <a href="#" className="hover:text-emerald-400 transition-colors">Dotabuff</a>
               </div>
            </div>

         </div>
      </div>
   );
};

// ==========================================
// MAIN COMPONENT EXPORT
// ==========================================
const GamingSection: React.FC = () => {
  return (
    <div className="w-full bg-[#022c22]">
      {/* 
         Structure:
         1. Dashboard (Standard Scroll)
         2. Gallery (Pinned Scroll)
         3. Steam Data (Standard Scroll)
         4. Vertical Game Scroll (Replaces Slider - 5 Major Games)
         5. Squad Up (Form Footer)
      */}
      <DashboardSubSection />
      <GallerySubSection />
      <SteamSubSection />
      <VerticalGameScroll />
      <SquadUpSubSection />
    </div>
  );
};

export default GamingSection;