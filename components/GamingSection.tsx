import React, { useLayoutEffect, useRef, useState } from 'react';
import { Gamepad2, Trophy, Coins, Cpu, Laptop, Smartphone, Activity, Box, Lock, Zap, MousePointer2, Crosshair, Sword, Smartphone as MobileIcon, Clock, ShoppingBag, Star, Calendar } from 'lucide-react';

// --- DATA: Web3 Games (Existing) ---
const GAMES = [
  {
    id: 'lol',
    title: 'League of Legends',
    genre: 'MOBA',
    subGenre: 'Strategy',
    stats: { hours: 842, metric: 'Rank', value: 'Emerald II' },
    icon: <Sword size={24} />,
    description: "Summoner's Rift awaits."
  },
  {
    id: 'dota2',
    title: 'Dota 2',
    genre: 'MOBA',
    subGenre: 'Hardcore',
    stats: { hours: 1205, metric: 'MMR', value: '4.2k' },
    icon: <Gamepad2 size={24} />,
    description: "Defense of the Ancients."
  },
  {
    id: 'csgo2',
    title: 'CS:GO 2',
    genre: 'FPS',
    subGenre: 'Tactical',
    stats: { hours: 450, metric: 'Rating', value: '15,000' },
    icon: <Crosshair size={24} />,
    description: "Rush B. Don't stop."
  }
];

// --- DATA: Steam Playtime (New) ---
const STEAM_PLAYTIME = [
  { id: 1, title: "Elden Ring", hours: 320, img: "https://picsum.photos/400/400?random=201" },
  { id: 2, title: "Baldur's Gate 3", hours: 210, img: "https://picsum.photos/400/400?random=202" },
  { id: 3, title: "Cyberpunk 2077", hours: 150, img: "https://picsum.photos/400/400?random=203" },
  { id: 4, title: "Hades", hours: 90, img: "https://picsum.photos/400/400?random=204" },
  { id: 5, title: "Stardew Valley", hours: 400, img: "https://picsum.photos/400/400?random=205" },
  { id: 6, title: "Hollow Knight", hours: 85, img: "https://picsum.photos/400/400?random=206" },
  { id: 7, title: "Vampire Survivors", hours: 45, img: "https://picsum.photos/400/400?random=207" },
];

// --- DATA: Purchased Games (New) ---
const PURCHASED_GAMES = [
   "The Witcher 3", "Red Dead Redemption 2", "God of War", "Celeste", 
   "Terraria", "Portal 2", "Half-Life: Alyx", "Disco Elysium", 
   "Outer Wilds", "Slay the Spire", "Factorio", "RimWorld"
];

// --- DATA: Wishlist (New) ---
const WISHLIST = [
   { title: "GTA VI", date: "Fall 2025", img: "https://picsum.photos/600/300?random=210" },
   { title: "Hollow Knight: Silksong", date: "TBA", img: "https://picsum.photos/600/300?random=211" },
   { title: "Monster Hunter Wilds", date: "2025", img: "https://picsum.photos/600/300?random=212" },
];

const GamingSection: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const web3WrapperRef = useRef<HTMLDivElement>(null);
  const laptopRef = useRef<HTMLDivElement>(null);
  const mobileRef = useRef<HTMLDivElement>(null);
  const bgShapesRef = useRef<HTMLDivElement>(null);
  
  // Steam Refs
  const steamContainerRef = useRef<HTMLDivElement>(null);
  const steamContentInnerRef = useRef<HTMLDivElement>(null); // New ref for scrolling content
  const steamGridRef = useRef<HTMLDivElement>(null);
  const steamListRef = useRef<HTMLDivElement>(null);
  const steamWishlistRef = useRef<HTMLDivElement>(null);

  const [selectedGameIndex, setSelectedGameIndex] = useState(0);
  const activeGame = GAMES[selectedGameIndex];

  useLayoutEffect(() => {
    const ctx = window.gsap.context(() => {
      window.gsap.registerPlugin(window.ScrollTrigger);

      const tl = window.gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "+=500%",
          pin: true,
          scrub: 1,
          anticipatePin: 1,
        }
      });

      // --- SCENE 1: Web3 Devices (0% - 20%) ---
      
      // Background Parallax
      if (bgShapesRef.current) {
         Array.from(bgShapesRef.current.children).forEach((shape, i) => {
            tl.to(shape, {
               y: (i + 1) * -50,
               rotation: 360,
               opacity: 0.5,
               duration: 2
            }, 0);
         });
      }

      // Laptop slides up
      tl.fromTo(laptopRef.current, 
        { y: 200, opacity: 0, scale: 0.9, rotateX: 20 },
        { y: 0, opacity: 1, scale: 1, rotateX: 0, duration: 1.5, ease: "power2.out" },
        0
      );

      // Mobile slides in
      tl.fromTo(mobileRef.current,
         { x: 100, y: 50, opacity: 0 },
         { x: 0, y: 0, opacity: 1, duration: 1.5, ease: "power2.out" },
         0.5
      );

      // Counters
      tl.from(".stat-value", { textContent: 0, duration: 2, snap: { textContent: 1 }, stagger: 0.2 }, 0.5);
      tl.to(".neon-glow", { boxShadow: "0 0 40px rgba(16, 185, 129, 0.4)", duration: 2 }, 0);

      // --- TRANSITION: Web3 Out, Steam In (30% - 40%) ---
      
      tl.to(web3WrapperRef.current, {
         y: -1000,
         opacity: 0,
         scale: 0.8,
         filter: "blur(10px)",
         duration: 2,
         ease: "power2.in"
      }, 3);

      tl.fromTo(steamContainerRef.current,
         { y: 1000, opacity: 0 },
         { y: 0, opacity: 1, duration: 2, ease: "power2.out" },
         3.5
      );

      // --- SCENE 2: Steam Content Animations (40% - 60%) ---
      
      // 1. Reveal Playtime Grid
      if (steamGridRef.current) {
         tl.from(steamGridRef.current.children, {
            y: 100,
            opacity: 0,
            scale: 0.8,
            stagger: 0.1,
            duration: 1.5,
            ease: "back.out(1.7)"
         }, 5);
      }

      // 2. Reveal Purchased List
      tl.from(steamListRef.current, {
         x: -100,
         opacity: 0,
         duration: 1.5
      }, 6.5);

      // 3. Reveal Wishlist
      if (steamWishlistRef.current) {
         tl.from(steamWishlistRef.current.children, {
            x: 100,
            opacity: 0,
            stagger: 0.2,
            duration: 1.5
         }, 7.5);
      }

      // --- SCENE 3: Auto-Scroll Content on Mobile/Overflow (60% - 100%) ---
      // This solves the issue where content is cut off on mobile because it's pinned.
      // We translate the inner content up as the user scrolls further down the pin.
      tl.to(steamContentInnerRef.current, {
         y: "-50%", // Scroll up by 50% of its height to reveal bottom
         ease: "none",
         duration: 5
      }, 9);

    }, containerRef);

    return () => ctx.revert();
  }, []);

  // Helper to determine grid span based on hours
  const getGridClass = (hours: number) => {
     if (hours > 300) return "md:col-span-2 md:row-span-2";
     if (hours > 100) return "md:col-span-2 md:row-span-1";
     return "md:col-span-1 md:row-span-1";
  };

  return (
    <div ref={containerRef} className="relative w-full h-screen overflow-hidden bg-[#022c22] text-emerald-50 z-20 font-mono">
      
      {/* --- Top Gradient for Smooth Transition from Music Section --- */}
      <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-[#022c22] to-transparent z-30 pointer-events-none"></div>

      {/* --- Background: Geometric Tech Matrix (Shared) --- */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
         <div className="absolute inset-0" 
              style={{ backgroundImage: 'linear-gradient(rgba(16, 185, 129, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(16, 185, 129, 0.1) 1px, transparent 1px)', backgroundSize: '40px 40px' }}>
         </div>
         <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#022c22_90%)]"></div>
      </div>

      {/* Floating Geometric Cubes */}
      <div ref={bgShapesRef} className="absolute inset-0 pointer-events-none overflow-hidden z-0">
         {[...Array(6)].map((_, i) => (
            <div 
               key={i}
               className="absolute border border-emerald-500/30 bg-emerald-900/10 backdrop-blur-sm"
               style={{
                  width: `${Math.random() * 100 + 50}px`,
                  height: `${Math.random() * 100 + 50}px`,
                  left: `${Math.random() * 90}%`,
                  top: `${Math.random() * 90}%`,
                  transform: `rotate(${Math.random() * 45}deg)`,
               }}
            >
               <div className="absolute inset-2 border border-emerald-500/10"></div>
            </div>
         ))}
      </div>

      {/* =========================================================================
          SCENE 1: WEB3 DEVICES (Initial View)
         ========================================================================= */}
      <div ref={web3WrapperRef} className="absolute inset-0 w-full h-full max-w-[1440px] mx-auto flex flex-col items-center justify-center p-4 z-10">
        
        {/* Header */}
        <div className="text-center mb-10 z-10">
           <div className="flex items-center justify-center gap-2 text-emerald-400 mb-2">
              <Cpu size={20} className="animate-pulse" />
              <span className="text-sm tracking-[0.3em] uppercase font-bold">Web3 Gaming Ecosystem</span>
           </div>
           <h2 className="text-4xl md:text-6xl font-display font-bold text-white drop-shadow-[0_0_15px_rgba(16,185,129,0.5)]">
              Play. Earn. <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-green-300">Own.</span>
           </h2>
        </div>

        {/* --- DEVICE MOCKUPS --- */}
        <div className="relative w-full max-w-5xl h-[60vh] flex items-center justify-center perspective-1000">
           
           {/* LAPTOP */}
           <div 
              ref={laptopRef}
              className="relative w-[70vw] md:w-[800px] aspect-[16/10] bg-emerald-950 rounded-xl border border-emerald-500/30 shadow-[0_20px_60px_rgba(0,0,0,0.6)] neon-glow z-10 flex flex-col overflow-hidden"
           >
              {/* Bezel */}
              <div className="h-6 bg-emerald-950 border-b border-emerald-500/20 flex justify-center items-center">
                 <div className="w-1.5 h-1.5 rounded-full bg-emerald-700"></div>
              </div>
              
              {/* Screen */}
              <div className="flex-1 bg-[#064e3b] p-6 grid grid-cols-12 grid-rows-6 gap-4 overflow-hidden relative">
                 <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-emerald-500/10 rounded-full blur-[80px] pointer-events-none"></div>

                 {/* Active Zone */}
                 <div className="col-span-8 row-span-4 bg-emerald-900/40 border border-emerald-500/20 rounded-lg p-6 flex flex-col justify-between backdrop-blur-md relative overflow-hidden group transition-all duration-500">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                       {activeGame.icon}
                    </div>
                    <div>
                       <div className="text-xs text-emerald-400 uppercase tracking-widest mb-1 flex items-center gap-2">
                          <Activity size={12} className="animate-pulse" /> Active Zone
                       </div>
                       <h3 className="text-3xl font-bold text-white transition-all duration-300">{activeGame.title}</h3>
                       <div className="flex gap-2 mt-2">
                          <span className="px-2 py-1 bg-emerald-500/20 rounded text-xs text-emerald-300 border border-emerald-500/20">{activeGame.genre}</span>
                          <span className="px-2 py-1 bg-emerald-500/20 rounded text-xs text-emerald-300 border border-emerald-500/20">{activeGame.subGenre}</span>
                       </div>
                       <p className="text-xs text-emerald-400/50 mt-2 italic">"{activeGame.description}"</p>
                    </div>
                    <div className="flex gap-8 items-end">
                       <div>
                          <div className="text-xs text-emerald-400/70">Total Hours</div>
                          <div className="text-2xl font-mono font-bold text-white stat-value">{activeGame.stats.hours}<span className="text-sm">h</span></div>
                       </div>
                       <div>
                          <div className="text-xs text-emerald-400/70">{activeGame.stats.metric}</div>
                          <div className="text-2xl font-mono font-bold text-white">{activeGame.stats.value}</div>
                       </div>
                    </div>
                 </div>

                 {/* Staking */}
                 <div className="col-span-4 row-span-3 bg-gradient-to-br from-emerald-900/60 to-emerald-950/80 border border-emerald-500/20 rounded-lg p-5 flex flex-col relative">
                    <div className="flex justify-between items-start mb-4">
                       <div className="p-2 bg-emerald-500/20 rounded-full"><Lock size={16} className="text-emerald-400"/></div>
                       <div className="text-xs text-emerald-500 font-bold">+12.4% APY</div>
                    </div>
                    <div className="text-xs text-emerald-400/70">Total Staked</div>
                    <div className="text-2xl font-bold text-white tracking-tight flex items-center gap-1">
                       <span className="text-emerald-400">$</span>12,450
                    </div>
                 </div>

                 {/* Selector */}
                 <div className="col-span-5 row-span-2 bg-emerald-900/30 border border-emerald-500/20 rounded-lg p-2 flex items-center gap-2 overflow-x-auto no-scrollbar">
                     {GAMES.map((game, index) => (
                        <button
                           key={game.id}
                           onClick={() => setSelectedGameIndex(index)}
                           className={`flex-1 h-full rounded-md flex flex-col items-center justify-center gap-1 transition-all duration-300 ${
                              selectedGameIndex === index 
                              ? 'bg-emerald-500/20 border border-emerald-500/50 text-white shadow-lg' 
                              : 'bg-emerald-900/20 border border-transparent text-emerald-500/50 hover:bg-emerald-500/10 hover:text-emerald-300'
                           }`}
                        >
                           <div className="scale-75">{game.icon}</div>
                           <span className="text-[10px] font-bold whitespace-nowrap">{game.id.toUpperCase()}</span>
                        </button>
                     ))}
                 </div>

                 {/* Trophy */}
                 <div className="col-span-3 row-span-2 bg-emerald-900/30 border border-emerald-500/20 rounded-lg p-4 flex flex-col items-center justify-center text-center">
                     <Trophy size={24} className="text-yellow-500 mb-1 drop-shadow-md" />
                     <div className="text-lg font-bold text-white">15</div>
                 </div>

                 {/* Rewards */}
                 <div className="col-span-4 row-span-3 bg-emerald-800/20 border border-emerald-500/20 rounded-lg p-4 flex items-center justify-between">
                     <div>
                        <div className="text-xs text-emerald-400/70">Rewards</div>
                        <div className="text-xl font-bold text-white flex items-center gap-1">
                           <Coins size={16} className="text-yellow-400" /> 450.5
                        </div>
                     </div>
                     <button className="px-3 py-1.5 bg-emerald-600 text-white text-xs font-bold rounded">Claim</button>
                 </div>
              </div>
              <div className="h-[20px] bg-[#021c17] perspective-origin-bottom transform origin-top skew-x-12"></div>
           </div>

           {/* MOBILE */}
           <div 
              ref={mobileRef}
              className="absolute -right-4 md:-right-12 bottom-0 md:bottom-12 w-[120px] md:w-[220px] aspect-[9/18] bg-emerald-950 rounded-[2rem] border-4 border-emerald-800 shadow-[0_10px_40px_rgba(0,0,0,0.8)] z-20 flex flex-col overflow-hidden"
           >  
              <div className="absolute top-2 left-1/2 -translate-x-1/2 w-16 h-4 bg-black rounded-full z-30"></div>
              <div className="flex-1 bg-gradient-to-b from-[#064e3b] to-[#022c22] p-4 flex flex-col gap-3 pt-10">
                 <div className="flex justify-between items-center">
                    <div className="w-8 h-8 rounded-full bg-emerald-500/20 border border-emerald-500/50 flex items-center justify-center"><Zap size={14} className="text-emerald-300" /></div>
                    <div className="text-[10px] text-emerald-400 font-mono">Connected</div>
                 </div>
                 <div className="bg-emerald-900/40 border border-emerald-500/20 rounded-xl p-3">
                    <div className="text-[10px] text-emerald-400/60 uppercase mb-2 flex items-center gap-1"><MobileIcon size={10} /> Wild Rift Zone</div>
                    <div className="aspect-video bg-emerald-800/50 rounded-lg border border-emerald-500/30 flex flex-col items-center justify-center p-2 mb-2 relative overflow-hidden">
                       <div className="absolute inset-0 bg-gradient-to-br from-blue-900/50 to-emerald-900/50 z-0"></div>
                       <Sword size={24} className="text-white z-10 mb-1" />
                       <span className="text-xs font-bold text-white z-10 text-center leading-tight">LOL: Wild Rift</span>
                    </div>
                 </div>
              </div>
           </div>
        </div>
        
        {/* Sync Status */}
        <div className="absolute bottom-8 text-center md:text-left md:left-20 w-full md:w-auto">
           <div className="flex items-center gap-4 text-emerald-500/50 text-xs font-mono">
              <div className="flex items-center gap-1"><Laptop size={14} /> <span>Desktop</span></div>
              <div className="flex items-center gap-1"><Smartphone size={14} /> <span>Mobile</span></div>
              <div>Sync: <span className="text-emerald-400">Active</span></div>
           </div>
        </div>
      </div>

      {/* =========================================================================
          SCENE 2: STEAM DATA (Scroll Reveal)
         ========================================================================= */}
      <div 
         ref={steamContainerRef} 
         className="absolute inset-0 w-full h-full max-w-[1440px] mx-auto flex flex-col pt-24 px-6 md:px-20 z-10 opacity-0"
      >
         <div ref={steamContentInnerRef} className="w-full flex flex-col">
            {/* Steam Header */}
            <div className="flex items-center gap-4 mb-8">
               <div className="p-3 bg-gradient-to-br from-[#1b2838] to-[#2a475e] rounded-xl border border-white/10 shadow-lg">
                  <Gamepad2 size={32} className="text-[#66c0f4]" />
               </div>
               <div>
                  <h2 className="text-3xl md:text-5xl font-bold text-white font-display">Steam Archives</h2>
                  <div className="text-sm text-[#66c0f4] font-mono mt-1">ID: HOPPINZQ • LEVEL 42</div>
               </div>
            </div>

            {/* 1. Playtime Grid (Bento) */}
            <div className="flex-1 flex flex-col gap-12 pb-24">
               
               <div>
                  <div className="flex items-center gap-2 text-white/50 text-xs uppercase tracking-widest mb-4">
                     <Clock size={14} /> Most Played 2025
                  </div>
                  <div ref={steamGridRef} className="grid grid-cols-2 md:grid-cols-4 grid-rows-2 gap-4 h-[400px]">
                     {STEAM_PLAYTIME.map((game) => (
                        <div 
                           key={game.id} 
                           className={`relative group rounded-xl overflow-hidden border border-white/10 bg-[#171a21] ${getGridClass(game.hours)} shadow-xl`}
                        >
                           <img src={game.img} alt={game.title} className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-40 transition-opacity duration-500" />
                           <div className="absolute inset-0 bg-gradient-to-t from-[#171a21] via-transparent to-transparent"></div>
                           
                           <div className="absolute bottom-0 left-0 w-full p-4">
                              <h4 className="text-white font-bold text-lg md:text-xl leading-tight mb-1 truncate">{game.title}</h4>
                              <div className="flex items-center gap-2">
                                 <div className="h-1 flex-1 bg-white/20 rounded-full overflow-hidden">
                                    <div className="h-full bg-[#66c0f4] w-[80%]"></div>
                                 </div>
                                 <span className="text-[#66c0f4] font-mono text-xs font-bold">{game.hours}h</span>
                              </div>
                           </div>
                        </div>
                     ))}
                  </div>
               </div>

               {/* 2. Purchased Games (Simple Marquee/Strip) */}
               <div>
                  <div className="flex items-center gap-2 text-white/50 text-xs uppercase tracking-widest mb-3">
                     <ShoppingBag size={14} /> Library Additions
                  </div>
                  <div 
                     ref={steamListRef}
                     className="w-full bg-[#171a21]/50 border-y border-white/5 p-4 overflow-hidden whitespace-nowrap mask-gradient"
                  >
                     <div className="inline-flex gap-8 animate-marquee">
                        {PURCHASED_GAMES.concat(PURCHASED_GAMES).map((game, i) => (
                           <span key={i} className="text-slate-400 font-mono hover:text-[#66c0f4] cursor-default transition-colors">
                              {game}
                           </span>
                        ))}
                     </div>
                  </div>
               </div>

               {/* 3. Wishlist (Anticipated) */}
               <div>
                  <div className="flex items-center gap-2 text-white/50 text-xs uppercase tracking-widest mb-4">
                     <Star size={14} /> Anticipated 2026
                  </div>
                  <div ref={steamWishlistRef} className="grid grid-cols-1 md:grid-cols-3 gap-6">
                     {WISHLIST.map((item, i) => (
                        <div key={i} className="flex items-center gap-4 bg-[#1b2838] border border-white/5 p-3 rounded-lg hover:border-[#66c0f4]/50 transition-colors group">
                           <div className="w-16 h-16 bg-black rounded-md overflow-hidden flex-shrink-0">
                              <img src={item.img} alt={item.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
                           </div>
                           <div>
                              <div className="text-white font-bold text-sm">{item.title}</div>
                              <div className="text-[#66c0f4] text-xs flex items-center gap-1 mt-1">
                                 <Calendar size={10} /> {item.date}
                              </div>
                           </div>
                        </div>
                     ))}
                  </div>
               </div>
            </div>
         </div>
      </div>

      <style>{`
        .perspective-1000 {
           perspective: 1200px;
        }
        .neon-glow {
           box-shadow: 0 0 20px rgba(16, 185, 129, 0.2);
           transition: box-shadow 0.5s ease;
        }
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .mask-gradient {
           mask-image: linear-gradient(to right, transparent, black 10%, black 90%, transparent);
        }
        @keyframes marquee {
           0% { transform: translateX(0); }
           100% { transform: translateX(-50%); }
        }
        .animate-marquee {
           animation: marquee 20s linear infinite;
        }
      `}</style>
    </div>
  );
};

// Simple Arrow Component for internal use
const ArrowRightIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-white"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
);

export default GamingSection;