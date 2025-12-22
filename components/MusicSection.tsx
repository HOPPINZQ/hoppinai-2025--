import React, { useLayoutEffect, useRef, useState, useEffect } from 'react';
import { Headphones, Music, Play, Pause, Disc, Volume2, SkipBack, SkipForward, List, Heart, Share2, MoreHorizontal } from 'lucide-react';

const TRACKS = [
  { id: 1, title: "Memory Lane 2025", artist: "Neural Beats", duration: "3:42", cover: "https://picsum.photos/400/400?random=101", color: "from-purple-500 to-indigo-500" },
  { id: 2, title: "Deep Work Flow", artist: "Focus AI", duration: "4:15", cover: "https://picsum.photos/400/400?random=102", color: "from-blue-500 to-cyan-500" },
  { id: 3, title: "Late Night Syntax", artist: "Dev Mode", duration: "2:50", cover: "https://picsum.photos/400/400?random=103", color: "from-emerald-500 to-teal-500" },
  { id: 4, title: "Tokyo Drift", artist: "Travel Logs", duration: "3:20", cover: "https://picsum.photos/400/400?random=104", color: "from-rose-500 to-pink-500" },
  { id: 5, title: "Sunrise Yoga", artist: "Zen Mind", duration: "5:10", cover: "https://picsum.photos/400/400?random=105", color: "from-orange-400 to-amber-500" },
];

const LOOP_ITEMS = [
  { id: 1, logic: 'G', note: '♩', angle: 0 },
  { id: 2, logic: '⊃', note: '♪', angle: 51.4 },
  { id: 3, logic: '∀', note: '♫', angle: 102.8 },
  { id: 4, logic: '∃', note: '♭', angle: 154.2 },
  { id: 5, logic: '~', note: '♮', angle: 205.6 },
  { id: 6, logic: 'a', note: '♯', angle: 257 },
  { id: 7, logic: 'S', note: 'ø', angle: 308.4 }
];

const MusicSection: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const headphoneWrapperRef = useRef<HTMLDivElement>(null);
  const mainContentRef = useRef<HTMLDivElement>(null);
  
  // Strange Loop Refs
  const strangeLoopWrapperRef = useRef<HTMLDivElement>(null);
  const textRef1 = useRef<HTMLSpanElement>(null);
  const textRef2 = useRef<HTMLSpanElement>(null);
  const textRef3 = useRef<HTMLSpanElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const linearContainerRef = useRef<HTMLDivElement>(null);
  const quoteRef = useRef<HTMLDivElement>(null);
  
  // State for Music Player
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);

  // Playback Simulation
  useEffect(() => {
    let interval: any;
    if (isPlaying) {
      interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            setIsPlaying(false);
            return 0;
          }
          return prev + 0.2; // Simulate progress
        });
      }, 50);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  const handlePlayPause = () => setIsPlaying(!isPlaying);
  
  const changeTrack = (index: number) => {
    setActiveIndex(index);
    setProgress(0);
    setIsPlaying(true);
  };

  const nextTrack = () => {
    setActiveIndex((prev) => (prev + 1) % TRACKS.length);
    setProgress(0);
    setIsPlaying(true);
  };

  const prevTrack = () => {
    setActiveIndex((prev) => (prev - 1 + TRACKS.length) % TRACKS.length);
    setProgress(0);
    setIsPlaying(true);
  };

  // Derived indices for carousel
  const prevIndex = (activeIndex - 1 + TRACKS.length) % TRACKS.length;
  const nextIndex = (activeIndex + 1) % TRACKS.length;

  const currentTrack = TRACKS[activeIndex];

  // Mouse Interaction Logic
  const handleMouseMove = (e: React.MouseEvent) => {
    if (bgRef.current) {
        const rect = bgRef.current.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width;
        const y = (e.clientY - rect.top) / rect.height;
        bgRef.current.style.setProperty('--mouse-x', `${x}`);
        bgRef.current.style.setProperty('--mouse-y', `${y}`);
    }
  };

  useLayoutEffect(() => {
    const ctx = window.gsap.context(() => {
      window.gsap.registerPlugin(window.ScrollTrigger);

      const tl = window.gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "+=800%", // 增加滚动距离以容纳三个阶段
          pin: true,
          scrub: 1,
          anticipatePin: 1,
        }
      });
      
      const q = window.gsap.utils.selector(strangeLoopWrapperRef);

      // --- Init States ---
      // 调整顺序：Strange Loop 先展示 (Phase 1)
      window.gsap.set(strangeLoopWrapperRef.current, { zIndex: 40, opacity: 1 });
      window.gsap.set(headphoneWrapperRef.current, { zIndex: 30, opacity: 0, scale: 0.5 });
      window.gsap.set(mainContentRef.current, { zIndex: 20, opacity: 0, scale: 0.9, y: 50 });

      // --- PHASE 1: Strange Loop Internal Sequence (0% - 50%) ---
      
      // Text 1 -> Text 2
      tl.to(textRef1.current, { opacity: 0, duration: 1 }, "+=0.5");
      tl.to(textRef2.current, { opacity: 1, duration: 1 }, "<+0.5");
      
      // Rotate Ring
      tl.to(ringRef.current, { rotation: 360, duration: 8, ease: "none" }, 0);

      // Morph Logic -> Geometry
      tl.to(q('.layer-logic'), { opacity: 0, duration: 2 }, 2);
      tl.to(q('.layer-geo'), { opacity: 1, duration: 2 }, "<");

      // Text 2 -> Text 3
      tl.to(textRef2.current, { opacity: 0, duration: 1 }, 4);
      tl.to(textRef3.current, { opacity: 1, duration: 1 }, "<+0.5");

      // Morph Geometry -> Music
      tl.to(q('.layer-geo'), { opacity: 0, duration: 2 }, 6);
      tl.to(q('.layer-music'), { opacity: 1, duration: 2 }, "<");

      // Break the Loop
      tl.to(ringRef.current, { opacity: 0, scale: 0.5, duration: 2 }, 8);
      
      // Fade in linear equation
      tl.fromTo(linearContainerRef.current, 
        { opacity: 0, scale: 1.2 },
        { opacity: 1, scale: 1, duration: 2 }, 
        "<+0.5"
      );

      // Reveal Quote
      tl.to(quoteRef.current, { opacity: 1, y: 0, duration: 2 }, "+=1");

      // --- PHASE 1 Exit (50% - 60%) ---
      tl.to(strangeLoopWrapperRef.current, { 
         opacity: 0, 
         scale: 1.1, 
         filter: "blur(10px)",
         duration: 2 
      }, "+=2");

      // --- PHASE 2: Music Player Enter (60% - 70%) ---
      tl.to(mainContentRef.current, {
        y: 0, 
        opacity: 1, 
        scale: 1, 
        duration: 2, 
        ease: "back.out(1.2)" 
      }, "-=1");

      // --- PHASE 2 Hold (70% - 100%) ---
      tl.to({}, { duration: 4 });

    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div 
        ref={containerRef} 
        onMouseMove={handleMouseMove}
        className="relative w-full h-screen overflow-hidden bg-slate-950 text-white z-20"
    >
      
      {/* Coherence Line */}
      <div className="absolute top-0 left-6 md:left-10 w-px h-32 bg-gradient-to-b from-white/0 via-white/20 to-white/0 z-50"></div>

      {/* Section Header */}
      <div className="absolute top-0 left-0 w-full z-40 px-6 md:px-10 pt-24 pb-4 pointer-events-none">
         <div className="flex justify-between items-end">
            <div>
               <h2 className="text-3xl md:text-5xl font-display font-bold text-white">
                  Section 3: <span className="text-purple-400">Sonic Scapes</span>
               </h2>
               <p className="text-slate-400 mt-2 text-sm md:text-base">Audio Rhythm • 2025</p>
            </div>
         </div>
      </div>

      {/* Top Gradient for Smooth Transition */}
      <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-slate-950 to-transparent z-10 pointer-events-none"></div>

      {/* --- Interactive Sonic Boom Background --- */}
      <div ref={bgRef} className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Dynamic Mouse Glow */}
        <div 
            className="absolute inset-0 opacity-40 transition-opacity duration-300"
            style={{
                background: `radial-gradient(circle 800px at calc(var(--mouse-x, 0.5) * 100%) calc(var(--mouse-y, 0.5) * 100%), rgba(168,85,247,0.2), transparent 70%)`
            }}
        ></div>

        {/* Shockwave Rings (Fixed Center) */}
        <div className="absolute inset-0 flex items-center justify-center opacity-20">
            <div className="absolute w-[40vw] h-[40vw] border border-purple-500/30 rounded-full animate-ping [animation-duration:3s]"></div>
            <div className="absolute w-[60vw] h-[60vw] border border-blue-500/20 rounded-full animate-ping [animation-duration:4s] [animation-delay:1s]"></div>
        </div>

        {/* Floating Particles */}
        {[...Array(15)].map((_, i) => (
          <div 
            key={i}
            className="absolute text-white/10 animate-float blur-[1px]"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              fontSize: `${Math.random() * 20 + 10}px`,
              animationDuration: `${Math.random() * 10 + 10}s`,
              animationDelay: `-${Math.random() * 5}s`
            }}
          >
            {['♪', '♫', '●', '✦'][i % 4]}
          </div>
        ))}
      </div>

      <div className="relative w-full h-full max-w-[1440px] mx-auto flex flex-col items-center justify-center px-4 md:px-10">
        
        {/* --- Phase 1: Headphone Intro (Centered) --- */}
        <div 
          ref={headphoneWrapperRef}
          className="absolute z-30 flex flex-col items-center justify-center pointer-events-none"
        >
          <div className="relative w-32 h-32 md:w-48 md:h-48 bg-white/5 rounded-full backdrop-blur-md border border-white/10 flex items-center justify-center shadow-[0_0_80px_rgba(168,85,247,0.4)] animate-pulse">
             <Headphones className="w-16 h-16 md:w-24 md:h-24 text-white" />
             <div className="absolute -top-4 right-0 text-pink-400 animate-bounce">
                <Music size={32} />
             </div>
          </div>
          <h2 className="mt-8 text-2xl md:text-4xl font-display font-bold text-center drop-shadow-[0_0_15px_rgba(168,85,247,0.5)]">Your 2025 Soundscape</h2>
        </div>


        {/* --- Phase 2: Split View (Playlist + Carousel) --- */}
        <div 
           ref={mainContentRef}
           className="absolute w-full max-w-6xl flex flex-col md:flex-row gap-8 items-center justify-center z-20 opacity-0"
        >
            
            {/* --- LEFT: Playlist Panel (Hidden on Mobile) --- */}
            <div className="hidden md:flex w-full md:w-1/3 h-[500px] flex-col bg-slate-900/40 backdrop-blur-xl border border-white/10 rounded-[32px] overflow-hidden shadow-2xl">
               {/* Header */}
               <div className="p-6 border-b border-white/5 bg-white/5">
                  <div className="flex items-center gap-2 text-purple-400 mb-1">
                     <List size={16} />
                     <span className="text-xs font-bold uppercase tracking-widest">Top Tracks 2025</span>
                  </div>
                  <h3 className="text-2xl font-bold text-white">Your Heavy Rotation</h3>
               </div>

               {/* List */}
               <div className="flex-1 overflow-y-auto p-4 space-y-2 no-scrollbar">
                  {TRACKS.map((track, i) => (
                     <div 
                        key={track.id}
                        onClick={() => changeTrack(i)}
                        className={`group flex items-center gap-4 p-3 rounded-xl transition-all cursor-pointer border ${
                           activeIndex === i 
                           ? 'bg-white/10 border-purple-500/30 shadow-[0_0_15px_rgba(168,85,247,0.1)]' 
                           : 'bg-transparent border-transparent hover:bg-white/5'
                        }`}
                     >
                        <div className="relative w-10 h-10 rounded overflow-hidden flex-shrink-0">
                           <img src={track.cover} className="w-full h-full object-cover" alt="cover" />
                           {activeIndex === i && isPlaying && (
                              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                                 <div className="w-1 h-3 bg-purple-400 mx-[1px] animate-bounce"></div>
                                 <div className="w-1 h-5 bg-purple-400 mx-[1px] animate-bounce [animation-delay:0.1s]"></div>
                                 <div className="w-1 h-2 bg-purple-400 mx-[1px] animate-bounce [animation-delay:0.2s]"></div>
                              </div>
                           )}
                        </div>
                        <div className="flex-1 min-w-0">
                           <div className={`text-sm font-bold truncate ${activeIndex === i ? 'text-purple-300' : 'text-slate-300'}`}>{track.title}</div>
                           <div className="text-xs text-slate-500 truncate">{track.artist}</div>
                        </div>
                        <div className="text-xs text-slate-600 font-mono">{track.duration}</div>
                     </div>
                  ))}
               </div>
            </div>

            {/* --- RIGHT: 3D Player / Vinyl (Centered on Mobile) --- */}
            <div className="w-full md:w-2/3 flex flex-col items-center">
               
               {/* Now Playing Card */}
               <div className="relative w-full max-w-md aspect-square bg-slate-900/60 backdrop-blur-2xl border border-white/10 rounded-[40px] shadow-[0_20px_60px_rgba(0,0,0,0.5)] flex flex-col items-center justify-center overflow-hidden p-8">
                  
                  {/* Vinyl Record Animation */}
                  <div className={`relative w-48 h-48 md:w-64 md:h-64 rounded-full shadow-[0_10px_30px_rgba(0,0,0,0.6)] flex items-center justify-center transition-transform duration-[5s] ease-linear ${isPlaying ? 'animate-[spin_4s_linear_infinite]' : ''}`}>
                     {/* Vinyl Texture */}
                     <div className="absolute inset-0 rounded-full bg-black border-4 border-slate-800"
                        style={{ background: 'repeating-radial-gradient(#111 0, #111 2px, #222 3px, #222 4px)' }}>
                     </div>
                     {/* Album Art */}
                     <div className="absolute w-28 h-28 md:w-36 md:h-36 rounded-full overflow-hidden border-4 border-black">
                        <img src={currentTrack.cover} className="w-full h-full object-cover" alt="album" />
                     </div>
                     {/* Center Hole */}
                     <div className="absolute w-4 h-4 bg-slate-200 rounded-full z-10 border border-slate-400"></div>
                  </div>

                  {/* Info */}
                  <div className="mt-8 text-center z-10 w-full">
                     <h2 className="text-2xl md:text-3xl font-bold text-white mb-2 truncate px-4">{currentTrack.title}</h2>
                     <p className="text-purple-400 text-lg">{currentTrack.artist}</p>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full mt-6 flex items-center gap-3">
                     <span className="text-xs text-slate-500 font-mono">1:20</span>
                     <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-purple-500 to-pink-500 w-[35%]"></div>
                     </div>
                     <span className="text-xs text-slate-500 font-mono">{currentTrack.duration}</span>
                  </div>

                  {/* Controls */}
                  <div className="mt-6 flex items-center gap-8">
                     <button onClick={prevTrack} className="p-3 text-slate-400 hover:text-white transition-colors hover:scale-110"><SkipBack size={24} /></button>
                     <button 
                        onClick={handlePlayPause}
                        className="w-16 h-16 rounded-full bg-white text-black flex items-center justify-center hover:scale-105 transition-transform shadow-[0_0_20px_rgba(255,255,255,0.3)]"
                     >
                        {isPlaying ? <Pause size={28} fill="black" /> : <Play size={28} fill="black" className="ml-1" />}
                     </button>
                     <button onClick={nextTrack} className="p-3 text-slate-400 hover:text-white transition-colors hover:scale-110"><SkipForward size={24} /></button>
                  </div>

                  {/* Background Blur derived from cover */}
                  <div className="absolute inset-0 -z-10 opacity-30 blur-3xl saturate-200 transition-colors duration-1000 bg-gradient-to-br"
                       style={{ backgroundImage: `linear-gradient(to bottom right, var(--tw-gradient-stops))` }}
                  >
                     <div className={`w-full h-full bg-gradient-to-br ${currentTrack.color}`}></div>
                  </div>
               </div>
            </div>
        </div>
        
        {/* --- Phase 3: Strange Loop (Hidden initially) --- */}
        <div 
          ref={strangeLoopWrapperRef}
          className="absolute inset-0 z-40 flex flex-col items-center justify-center pointer-events-none text-white font-serif"
        >
            {/* Top Gradient for Smooth Transition (internal to this layer) */}
            <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-[#022c22] to-transparent z-10 pointer-events-none"></div>

            {/* --- TITLE SECTION --- */}
            <div className="absolute top-24 md:top-32 text-center z-30 mix-blend-difference text-white pointer-events-none">
              <h2 className="text-4xl md:text-6xl font-bold tracking-[0.5em] uppercase font-display">Strange Loop</h2>
              <div className="mt-4 text-lg md:text-xl italic opacity-90 h-8 relative w-[80vw] mx-auto">
                 <span ref={textRef1} className="absolute left-0 right-0 top-0 transition-opacity text-slate-200">“In the beginning was the Word...”</span>
                 <span ref={textRef2} className="absolute left-0 right-0 top-0 opacity-0 transition-opacity text-slate-200">“...and the Word was made flesh...”</span>
                 <span ref={textRef3} className="absolute left-0 right-0 top-0 opacity-0 transition-opacity text-slate-200">“...and the flesh sang the Word.”</span>
              </div>
            </div>

            {/* --- CIRCULAR RING (The Loop) --- */}
            <div ref={ringRef} className="relative w-[300px] h-[300px] md:w-[500px] md:h-[500px] flex items-center justify-center ring-container">
               {LOOP_ITEMS.map((item, i) => (
                  <div 
                    key={item.id}
                    className="absolute left-1/2 top-1/2 w-24 h-24 -ml-12 -mt-12 flex items-center justify-center"
                    style={{ 
                       transform: `rotate(${item.angle}deg) translateY(calc(var(--loop-radius) * -1)) rotate(${-item.angle}deg)` 
                    }}
                  >
                     <div className="relative w-full h-full flex items-center justify-center">
                        {/* Layer 1: Logic */}
                        <div className="layer-logic absolute inset-0 flex items-center justify-center text-4xl md:text-5xl font-mono font-bold text-white">
                           {item.logic}
                        </div>
                        
                        {/* Layer 2: Geometry (Escher-esque Diamond) */}
                        <div className="layer-geo absolute inset-0 flex items-center justify-center opacity-0">
                           <svg viewBox="0 0 100 100" className="w-16 h-16 md:w-20 md:h-20 fill-white">
                              <path d="M50 0 L75 25 L100 50 L75 75 L50 100 L25 75 L0 50 L25 25 Z" />
                              <circle cx="35" cy="40" r="4" fill="#020617" /> 
                           </svg>
                        </div>

                        {/* Layer 3: Music */}
                        <div className="layer-music absolute inset-0 flex items-center justify-center opacity-0 text-5xl md:text-6xl text-white">
                           {item.note}
                        </div>
                     </div>
                  </div>
               ))}
               {/* Center Decoration */}
               <div className="absolute text-sm font-mono tracking-widest opacity-20 text-white">G E B</div>
            </div>

            {/* --- LINEAR FORM (The Proof) --- */}
            <div ref={linearContainerRef} className="absolute inset-0 flex items-center justify-center opacity-0 pointer-events-none">
               <div className="flex flex-col items-center gap-8">
                  {/* The "Formula" */}
                  <div className="flex items-center gap-4 md:gap-8 text-3xl md:text-5xl font-mono font-bold text-white">
                     <span>~</span>
                     <span>∃</span>
                     <span>a</span>
                     <span>:</span>
                     <span className="bg-white text-slate-950 px-2">Proof</span>
                     <span>(a)</span>
                  </div>
                  
                  {/* Music Staff visual */}
                  <div className="w-[80vw] max-w-lg h-24 border-y border-white/10 flex items-center justify-around relative">
                     <div className="absolute inset-x-0 top-1/3 h-px bg-white/10"></div>
                     <div className="absolute inset-x-0 bottom-1/3 h-px bg-white/10"></div>
                     
                     {LOOP_ITEMS.map((item, i) => (
                        <span key={i} className="text-3xl md:text-4xl relative text-white" style={{ top: Math.sin(i) * 10 }}>
                           {item.note}
                        </span>
                     ))}
                  </div>
               </div>
            </div>

            {/* --- FOOTER QUOTE --- */}
            <div ref={quoteRef} className="absolute bottom-12 md:bottom-20 px-6 text-center opacity-0 transform translate-y-10">
               <p className="text-xl md:text-2xl font-serif italic max-w-3xl mx-auto leading-relaxed text-slate-300">
                 "Gödel, Escher, and Bach were only shadows cast in different directions by some central solid essence."
               </p>
               <div className="mt-6 font-mono text-xs md:text-sm tracking-[0.2em] text-slate-500 uppercase">
                 — Douglas Hofstadter
               </div>
            </div>
        </div>
      </div>

      <style>{`
         @keyframes float {
            0%, 100% { transform: translateY(0) rotate(0deg); opacity: 0; }
            50% { opacity: 0.5; }
            100% { transform: translateY(-100px) rotate(20deg); opacity: 0; }
         }
         .animate-float {
            animation-name: float;
            animation-timing-function: linear;
            animation-iteration-count: infinite;
         }
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

export default MusicSection;