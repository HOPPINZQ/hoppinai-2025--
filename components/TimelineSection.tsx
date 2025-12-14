import React, { useState, useRef, useLayoutEffect, useEffect } from 'react';
import { 
  ChevronLeft, 
  Play, 
  Maximize, 
  Video, 
  Calendar, 
  Tag, 
  Quote, 
  Grid3X3,
  ArrowRight
} from 'lucide-react';

// --- TYPES ---
type MemoryType = 'image' | 'video' | 'audio' | 'text';

interface Memory {
  id: string;
  type: MemoryType;
  date: string;
  title: string;
  description: string;
  src?: string;
  tags: string[];
  meta?: {
    views?: string;
    duration?: string;
    location?: string;
  };
}

interface MonthGroup {
  id: string;
  month: string;
  year: string;
  title: string;
  coverImage: string;
  memoryCount: number;
  memories: Memory[];
  colorTheme: string; // Tailwind border/bg colors
}

// --- MOCK DATA ---
const MONTH_DATA: MonthGroup[] = [
  {
    id: 'dec-2025',
    month: 'DEC',
    year: '2025',
    title: 'The Grand Finale',
    coverImage: 'https://picsum.photos/600/900?random=10',
    memoryCount: 4,
    colorTheme: 'border-purple-500/50 hover:shadow-purple-500/20',
    memories: [
      {
        id: 'mem-1',
        type: 'image',
        date: '2025-12-24',
        title: 'Whispers of the Imperishable Moon',
        description: '"Bathed in the mystical glow of a checkered purple moon, a silhouette stands vigilant against a backdrop of intricate, golden-hued patterns. The air was thick with the scent of ozone and ancient magic."',
        src: 'https://picsum.photos/800/1000?random=1', // Vertical image to test adaptive height
        tags: ['#Fantasy', '#Moon', '#Night', '#Mystery'],
        meta: { views: 'View 1' }
      },
      {
        id: 'mem-2',
        type: 'video',
        date: '2025-12-14',
        title: 'Rocky Descent to Tranquil Waters',
        description: 'A rugged path of ancient stones leads to a hidden stream, its gentle murmurs filling the air, before opening up to the serene expanse of a distant lake. We sat there for hours, just listening to the water and watching the clouds drift by.',
        src: 'https://picsum.photos/800/450?random=2',
        tags: ['#nature', '#stream', '#rocks'],
        meta: { duration: '0:04' }
      },
      {
        id: 'mem-3',
        type: 'audio',
        date: '2025-12-10',
        title: 'A New Voice Emerges',
        description: "The crisp, clear sound of an introduction, a gentle unveiling of identity. It's the quiet certainty of a name spoken aloud.",
        tags: ['introduction', 'voice', 'identity'],
        meta: { duration: '0:01' }
      },
      {
        id: 'mem-4',
        type: 'text',
        date: '2025-12-01',
        title: 'Welcome to 2025',
        description: 'This is the start of your journey. Upload photos or write your thoughts to see the timeline grow. This entry marks the beginning of our digital chronicle, a space where time bends and memories solidify into digital artifacts.',
        tags: ['Welcome', 'Start'],
      }
    ]
  },
  {
    id: 'nov-2025',
    month: 'NOV',
    year: '2025',
    title: 'Autumn Reflections',
    coverImage: 'https://picsum.photos/600/900?random=11',
    memoryCount: 2,
    colorTheme: 'border-orange-500/50 hover:shadow-orange-500/20',
    memories: [
      {
        id: 'mem-nov-1',
        type: 'image',
        date: '2025-11-15',
        title: 'Autumn in Kyoto',
        description: 'The maples turned a brilliant crimson today. Walking through Arashiyama felt like stepping into a painting. Every corner revealed a new shade of red or gold, contrasting beautifully with the grey temple stones.',
        src: 'https://picsum.photos/800/600?random=3',
        tags: ['#Travel', '#Japan', '#Autumn'],
      },
       {
        id: 'mem-nov-2',
        type: 'text',
        date: '2025-11-05',
        title: 'Project Alpha Milestone',
        description: 'Finally shipped the core engine rewrite. 40% performance boost across the board.',
        tags: ['#Work', '#Achievement'],
      }
    ]
  },
  {
    id: 'oct-2025',
    month: 'OCT',
    year: '2025',
    title: 'Code & Coffee',
    coverImage: 'https://picsum.photos/600/900?random=12',
    memoryCount: 3,
    colorTheme: 'border-blue-500/50 hover:shadow-blue-500/20',
    memories: [
       {
        id: 'mem-oct-1',
        type: 'text',
        date: '2025-10-12',
        title: 'Hackathon Win',
        description: '48 hours of no sleep, but we took home the gold prize for our AI accessibility tool. The energy in the room was electric as we demoed the final build.',
        tags: ['#Hackathon', '#Win'],
      }
    ]
  },
  {
    id: 'sep-2025',
    month: 'SEP',
    year: '2025',
    title: 'Late Summer Days',
    coverImage: 'https://picsum.photos/600/900?random=13',
    memoryCount: 1,
    colorTheme: 'border-yellow-500/50 hover:shadow-yellow-500/20',
    memories: []
  },
  {
    id: 'aug-2025',
    month: 'AUG',
    year: '2025',
    title: 'Deep Focus',
    coverImage: 'https://picsum.photos/600/900?random=14',
    memoryCount: 5,
    colorTheme: 'border-emerald-500/50 hover:shadow-emerald-500/20',
    memories: []
  }
];

// --- RICH MEDIA CARDS ---

// VIDEO CARD (Keeps aspect-video for player container, but adapts text height)
const VideoCard: React.FC<{ memory: Memory }> = ({ memory }) => (
  <div className="flex flex-col w-full relative group bg-slate-900 border border-white/10 rounded-2xl overflow-hidden">
    {/* Video Thumbnail Area - Standard 16:9 for video */}
    <div className="relative w-full aspect-video bg-black overflow-hidden z-10">
        <div className="absolute inset-0 transition-transform duration-700 group-hover:scale-105">
           <img src={memory.src} alt={memory.title} className="w-full h-full object-cover opacity-80 group-hover:opacity-60 transition-opacity" />
        </div>
        
        {/* Play Overlay */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30 shadow-[0_0_30px_rgba(59,130,246,0.3)] transition-transform group-hover:scale-110">
            <Play className="text-white ml-1" fill="white" size={32} />
          </div>
        </div>

        {/* Video Controls (Fake) */}
        <div className="absolute bottom-0 left-0 right-0 p-4 pt-12 bg-gradient-to-t from-black/90 via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="flex flex-col gap-2">
            <div className="relative w-full h-1 bg-white/20 rounded-full overflow-hidden">
                <div className="h-full bg-blue-500 relative" style={{ width: '30%' }}></div>
            </div>
            <div className="flex items-center justify-between mt-1">
              <span className="text-xs font-mono text-slate-300">0:00 / {memory.meta?.duration || '0:00'}</span>
              <Maximize size={16} className="text-white" />
            </div>
          </div>
        </div>
        
        {/* Badge */}
        <div className="absolute top-4 right-4 z-10 pointer-events-none">
          <span className="text-[10px] px-2 py-1 bg-black/60 rounded-full text-purple-300 backdrop-blur-sm border border-purple-500/20 flex items-center gap-1 shadow-lg">
            <Video size={10} /> Video
          </span>
        </div>
    </div>

    {/* Content Area - Adaptive Height */}
    <div className="p-6 flex flex-col bg-slate-900/40 relative z-20">
      <div className="flex items-center gap-2 mb-3">
         <span className="px-2 py-0.5 bg-amber-500 text-slate-900 text-[10px] font-bold uppercase tracking-widest rounded-sm">{memory.tags[0] || 'Memory'}</span>
         <span className="text-slate-400 text-xs flex items-center gap-1"><Calendar size={12} /> {memory.date}</span>
      </div>
      <h3 className="text-2xl font-bold text-white mb-3 leading-tight">{memory.title}</h3>
      <p className="text-slate-300 text-sm leading-relaxed mb-4">{memory.description}</p>
    </div>
  </div>
);

// AUDIO CARD
const AudioCard: React.FC<{ memory: Memory }> = ({ memory }) => (
  <div className="flex flex-col w-full bg-slate-900/40 border border-white/10 rounded-2xl overflow-hidden">
    <div className="relative w-full h-32 overflow-hidden bg-slate-800 flex items-center justify-center group">
        <div className="absolute inset-0 bg-[url('https://upload.wikimedia.org/wikipedia/commons/c/c2/Beat_pattern_example.png')] bg-cover bg-center opacity-30 mix-blend-overlay transition-transform duration-1000 group-hover:scale-105"></div>
        <div className="relative z-10 flex items-center gap-4 px-6 w-full">
          <button className="w-12 h-12 flex-shrink-0 rounded-full flex items-center justify-center bg-slate-700/80 text-white hover:bg-emerald-500 hover:text-black border border-white/10 transition-all shadow-lg group-hover:scale-110">
             <Play size={20} className="ml-1" fill="currentColor" />
          </button>
          <div className="flex-1 min-w-0 flex flex-col gap-1">
             <div className="h-1 w-full bg-slate-600 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-400 w-1/3"></div>
             </div>
             <div className="flex justify-between text-[10px] text-slate-300 font-mono">
                <span>0:00</span>
                <span>{memory.meta?.duration || '1:20'}</span>
             </div>
          </div>
        </div>
    </div>
    <div className="p-6 relative z-10">
      <Quote className="absolute top-4 right-4 text-emerald-500/20" size={40} />
      <h3 className="text-xl font-serif text-white font-bold mb-2">{memory.title}</h3>
      <div className="flex items-center gap-2 text-emerald-300 text-xs mb-4 opacity-80"><Calendar size={12} /> {memory.date}</div>
      <p className="text-slate-300 leading-relaxed text-sm border-l-2 border-emerald-500/30 pl-3">{memory.description}</p>
    </div>
  </div>
);

// IMAGE CARD (Fully Adaptive)
const ImageCard: React.FC<{ memory: Memory }> = ({ memory }) => (
  <div className="flex flex-col w-full group bg-slate-800/20 backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden">
    {/* Image Container: Height adjusts to image content (max-height constrained) */}
    <div className="relative w-full bg-slate-900">
      <img 
        alt={memory.title} 
        className="w-full h-auto max-h-[600px] object-cover transition-transform duration-700 ease-in-out group-hover:scale-105" 
        src={memory.src} 
      />
      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent opacity-60 pointer-events-none"></div>
      
      {/* View Badge */}
      <div className="absolute top-4 left-4 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full flex items-center gap-2 text-white border border-white/10 opacity-80 group-hover:opacity-100 transition-opacity">
         <Grid3X3 size={14} /> 
         <span className="text-xs font-medium">{memory.meta?.views || 'View'}</span>
      </div>
    </div>
    
    {/* Content Container - No fixed height, grows with text */}
    <div className="p-6 flex flex-col">
       <div className="flex items-center justify-between mb-3">
          <div className="flex items-baseline gap-2">
             <span className="text-2xl font-serif font-bold text-white/90">{memory.date.split('-')[2]}</span>
             <span className="text-xs font-bold text-white/40 uppercase tracking-widest">{memory.date.substring(0, 7)}</span>
          </div>
       </div>
       
       <h3 className="text-2xl font-bold text-white mb-3 leading-tight group-hover:text-purple-300 transition-colors">{memory.title}</h3>
       
       <p className="text-slate-300 text-sm leading-7 relative z-10 mb-6">
         {memory.description}
       </p>
       
       <div className="mt-auto flex gap-2 flex-wrap">
          {memory.tags.map(tag => (
             <span key={tag} className="text-[10px] bg-white/5 border border-white/10 px-2 py-1 rounded text-slate-400 hover:bg-white/10 hover:text-white transition-colors cursor-default">
                {tag}
             </span>
          ))}
       </div>
    </div>
  </div>
);

// TEXT CARD (Adaptive, removed min-h restriction)
const TextCard: React.FC<{ memory: Memory }> = ({ memory }) => (
  <div className="p-8 relative z-10 flex flex-col justify-center w-full bg-slate-900/40 border border-white/10 rounded-2xl overflow-hidden">
    <Quote className="absolute top-6 left-6 text-amber-500/10 transform scale-150" size={48} />
    <div className="relative z-10">
        <h3 className="text-2xl font-serif text-white font-bold drop-shadow-md mb-2">{memory.title}</h3>
        <div className="flex items-center gap-2 text-blue-300 text-xs mb-6 opacity-80"><Calendar size={12} /> {memory.date}</div>
        <p className="text-slate-300 leading-relaxed text-sm md:text-base whitespace-pre-wrap">{memory.description}</p>
    </div>
    <div className="mt-6 pt-6 border-t border-white/5 flex flex-wrap gap-2">
      {memory.tags.map(tag => <span key={tag} className="flex items-center gap-1 text-[10px] uppercase tracking-wider px-2 py-1 rounded-sm bg-blue-500/10 text-blue-400 border border-blue-500/20"><Tag size={10} /> {tag}</span>)}
    </div>
  </div>
);

// --- TIMELINE OVERLAY (The Vertical Detail View) ---
const TimelineOverlay: React.FC<{ month: MonthGroup; onClose: () => void }> = ({ month, onClose }) => {
  // Prevent background scroll when open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = 'unset'; };
  }, []);

  return (
    <div className="fixed inset-0 z-[100] bg-slate-950/98 backdrop-blur-xl flex flex-col animate-fade-in overflow-hidden">
      
      {/* Overlay Header */}
      <div className="absolute top-0 left-0 w-full z-50 pointer-events-none pt-24 pb-4 px-6 md:px-12">
         <div className="flex items-start justify-between pointer-events-auto">
            {/* Prominent Back Button */}
            <button 
               onClick={onClose}
               className="group flex items-center gap-3 px-6 py-3 bg-white text-slate-900 rounded-full font-bold shadow-[0_0_20px_rgba(255,255,255,0.2)] hover:scale-105 hover:shadow-[0_0_30px_rgba(255,255,255,0.4)] transition-all duration-300"
            >
               <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
               <span className="uppercase tracking-widest text-xs">Back</span>
            </button>

            {/* Month Title */}
            <div className="text-right hidden md:block">
               <h2 className="text-4xl font-display font-bold text-white">{month.month} {month.year}</h2>
               <p className="text-sm text-slate-500 uppercase tracking-widest mt-1">{month.title}</p>
            </div>
         </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto relative pt-40 pb-20">
        <div className="md:hidden text-center mb-12 px-6">
           <h2 className="text-4xl font-display font-bold text-white">{month.month} {month.year}</h2>
           <p className="text-sm text-slate-500 uppercase tracking-widest mt-1">{month.title}</p>
        </div>

        <div className="container mx-auto px-4 relative min-h-screen max-w-5xl">
            {/* Central Line */}
            <div className="absolute top-0 bottom-0 left-6 md:left-1/2 md:-translate-x-1/2 w-px border-l-2 border-dashed border-slate-700/50 z-0"></div>

            {month.memories.length === 0 ? (
               <div className="flex flex-col items-center justify-center h-[30vh] text-slate-500">
                  <p>No memories recorded for this month.</p>
               </div>
            ) : (
               month.memories.map((memory, index) => {
                  const isLeft = index % 2 === 0;
                  const alignmentClass = isLeft ? 'md:mr-auto' : 'md:ml-auto';
                  const marginClass = index === month.memories.length - 1 ? 'mb-0' : 'mb-16 md:mb-24';
                  
                  return (
                     <div key={memory.id} className={`relative w-full md:w-[45%] ${marginClass} pl-12 md:pl-0 z-10 ${alignmentClass}`}>
                        
                        {/* Dot on Line */}
                        <div className={`absolute top-8 w-4 h-4 rounded-full bg-slate-900 border-2 border-white/20 z-20 shadow-[0_0_10px_rgba(255,255,255,0.2)] ${isLeft ? 'md:-right-[calc(5%+9px)] -left-[19px]' : 'md:-left-[calc(5%+9px)] -left-[19px]'}`}>
                           <div className="absolute inset-0 rounded-full bg-white/50 animate-ping opacity-20"></div>
                        </div>

                        {/* Card Component Injected Directly - No Extra Wrapper with Heights */}
                        <div className="hover:-translate-y-1 transition-transform duration-500 shadow-2xl hover:shadow-blue-500/10">
                           {memory.type === 'image' && <ImageCard memory={memory} />}
                           {memory.type === 'video' && <VideoCard memory={memory} />}
                           {memory.type === 'audio' && <AudioCard memory={memory} />}
                           {memory.type === 'text' && <TextCard memory={memory} />}
                        </div>
                     </div>
                  );
               })
            )}

            <div className="relative z-20 text-center pt-12 pb-24">
               <div className="inline-block px-4 py-2 bg-slate-800 rounded-full border border-white/10 text-slate-500 text-sm">
                  End of {month.month}
               </div>
            </div>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// MAIN COMPONENT: HORIZONTAL SCROLL + CARDS
// ==========================================

const TimelineSection: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [selectedMonth, setSelectedMonth] = useState<MonthGroup | null>(null);

  useLayoutEffect(() => {
    const ctx = window.gsap.context(() => {
      window.gsap.registerPlugin(window.ScrollTrigger);

      const track = trackRef.current;
      const container = containerRef.current;

      if (!track || !container) return;

      const getScrollAmount = () => {
         return -(track.scrollWidth - window.innerWidth + 100); 
      };

      const tween = window.gsap.to(track, {
        x: getScrollAmount,
        ease: "none",
        scrollTrigger: {
          trigger: container,
          start: "top top",
          end: () => `+=${track.scrollWidth - window.innerWidth}`,
          pin: true,
          scrub: 1,
          invalidateOnRefresh: true,
        }
      });
      
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <>
      <div ref={containerRef} className="relative w-full h-screen overflow-hidden bg-slate-950 flex flex-col justify-center">
        
        {/* Background Ambient */}
        <div className="absolute top-[-20%] left-[-10%] w-[60vw] h-[60vw] bg-purple-900/10 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="absolute bottom-[-20%] right-[-10%] w-[60vw] h-[60vw] bg-blue-900/10 rounded-full blur-[120px] pointer-events-none"></div>

        {/* Header (Fixed within section) */}
        <div className="absolute top-10 left-6 md:left-20 z-10 pointer-events-none">
           <h2 className="text-5xl md:text-8xl font-display font-bold text-white/10 tracking-tighter">TIMELINE</h2>
           <div className="absolute top-1/2 left-2 text-xl md:text-2xl text-white font-bold tracking-widest">2025 CHRONICLES</div>
        </div>

        {/* Horizontal Track */}
        <div ref={trackRef} className="flex gap-10 px-10 md:px-20 items-center h-[70vh] w-max">
           
           {/* Intro Card */}
           <div className="w-[300px] md:w-[400px] flex-shrink-0 flex flex-col justify-center text-slate-300 mr-10">
              <p className="text-xl md:text-2xl leading-relaxed font-serif italic mb-6 border-l-2 border-purple-500 pl-6">
                 "Time is a river, and these are the stones we stepped on."
              </p>
              <div className="flex items-center gap-2 text-purple-400 font-bold uppercase tracking-widest text-sm animate-pulse">
                 <ArrowRight size={20} /> Scroll to explore
              </div>
           </div>

           {/* Month Cards */}
           {MONTH_DATA.map((month) => (
              <div 
                 key={month.id}
                 onClick={() => setSelectedMonth(month)}
                 className={`group relative w-[280px] md:w-[360px] h-[500px] md:h-[600px] flex-shrink-0 rounded-[30px] overflow-hidden cursor-pointer transition-transform duration-500 hover:-translate-y-4 hover:shadow-[0_20px_50px_rgba(0,0,0,0.5)] border-2 border-transparent ${month.colorTheme}`}
              >
                 <img src={month.coverImage} alt={month.month} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-60 group-hover:opacity-80" />
                 <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/20 to-black/90"></div>
                 <div className="absolute inset-0 p-8 flex flex-col justify-between">
                    <div className="flex justify-between items-start">
                       <span className="text-6xl md:text-8xl font-display font-bold text-white/20 group-hover:text-white/40 transition-colors">{month.month}</span>
                       <div className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20 group-hover:scale-110 transition-transform">
                          <ArrowRight size={20} className="text-white -rotate-45 group-hover:rotate-0 transition-transform duration-300" />
                       </div>
                    </div>
                    <div>
                       <div className="text-sm font-bold uppercase tracking-widest text-purple-300 mb-2">{month.year}</div>
                       <h3 className="text-2xl md:text-3xl font-bold text-white mb-2 leading-tight">{month.title}</h3>
                       <div className="flex items-center gap-2 text-slate-400 text-sm">
                          <Grid3X3 size={14} />
                          <span>{month.memoryCount} Memories</span>
                       </div>
                    </div>
                 </div>
              </div>
           ))}

           <div className="w-[100px] flex-shrink-0"></div>
        </div>
      </div>

      {selectedMonth && (
        <TimelineOverlay 
           month={selectedMonth} 
           onClose={() => setSelectedMonth(null)} 
        />
      )}
    </>
  );
};

export default TimelineSection;
