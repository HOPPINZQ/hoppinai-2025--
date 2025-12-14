import React, { useLayoutEffect, useRef, useState } from 'react';
import { TimelineEvent } from '../types';
import { Calendar, Briefcase, Heart, Trophy, Plane, ArrowRight, Loader2 } from 'lucide-react';
import { generateYearlySummary } from '../services/geminiService';

interface TimelineSectionProps {
  events: TimelineEvent[];
}

const TimelineSection: React.FC<TimelineSectionProps> = ({ events }) => {
  const [summary, setSummary] = useState<string>("");
  const [loadingSummary, setLoadingSummary] = useState(false);
  
  const sectionRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const ctx = window.gsap.context(() => {
      window.gsap.registerPlugin(window.ScrollTrigger);

      const track = trackRef.current;
      const section = sectionRef.current;
      const trigger = triggerRef.current;

      if (!track || !section || !trigger) return;

      const getScrollAmount = () => {
        let trackWidth = track.scrollWidth;
        return -(trackWidth - window.innerWidth);
      };

      const scrollTween = window.gsap.to(track, {
        x: getScrollAmount,
        ease: "none",
        scrollTrigger: {
          trigger: trigger,
          start: "top top",
          end: () => `+=${track.scrollWidth - window.innerWidth}`,
          pin: true,
          scrub: 1,
          invalidateOnRefresh: true,
          anticipatePin: 1,
        }
      });

      const cards = window.gsap.utils.toArray('.timeline-card-image');
      cards.forEach((card: any) => {
        window.gsap.to(card, {
          backgroundPosition: "100% 50%",
          ease: "none",
          scrollTrigger: {
            trigger: card,
            containerAnimation: scrollTween,
            start: "left right",
            end: "right left",
            scrub: true,
          }
        });
      });

    }, sectionRef);

    return () => ctx.revert();
  }, [events]);

  const handleGenerateSummary = async () => {
    setLoadingSummary(true);
    const result = await generateYearlySummary();
    setSummary(result);
    setLoadingSummary(false);
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'work': return <Briefcase size={20} />;
      case 'travel': return <Plane size={20} />;
      case 'achievement': return <Trophy size={20} />;
      case 'personal': default: return <Heart size={20} />;
    }
  };

  return (
    <div ref={sectionRef} className="relative w-full z-10">
      {/* 
         Trigger Wrapper: 
         Dark glass effect to let snake show through but provide readability 
      */}
      <div ref={triggerRef} className="h-screen w-full overflow-hidden flex flex-col bg-slate-950/30 backdrop-blur-sm relative border-t border-white/10">
        
        {/* Header Section */}
        <div className="absolute top-0 left-0 w-full z-20 px-6 md:px-10 pt-6 md:pt-10 pb-4 bg-gradient-to-b from-slate-950/80 to-transparent">
          <div className="flex justify-between items-end">
             <div>
                <h2 className="text-3xl md:text-5xl font-display font-bold text-white">
                   Section 1: <span className="text-purple-400">The Journey</span>
                </h2>
                <p className="text-slate-400 mt-2 text-sm md:text-base">Horizontal Timeline • 2025</p>
             </div>
             
             <div className="hidden md:block">
               {!summary && (
                  <button 
                    onClick={handleGenerateSummary}
                    disabled={loadingSummary}
                    className="flex items-center space-x-2 text-purple-300 hover:text-purple-100 transition-colors font-medium border border-purple-500/30 px-4 py-2 rounded-full hover:bg-purple-500/20 backdrop-blur-md"
                  >
                    {loadingSummary ? <Loader2 className="animate-spin w-4 h-4" /> : <span className="text-sm">Generate AI Insight</span>}
                  </button>
               )}
             </div>
          </div>
          
          {summary && (
             <div className="mt-4 p-4 bg-purple-900/30 rounded-xl border border-purple-500/30 animate-fade-in max-w-3xl backdrop-blur-md">
                <p className="text-sm text-purple-200 italic">"{summary}"</p>
             </div>
          )}
        </div>

        {/* Horizontal Track */}
        <div 
          ref={trackRef} 
          className="flex flex-row items-center h-full px-6 md:px-20 gap-6 md:gap-20 w-max pt-20"
        >
          {/* Intro Card */}
          <div className="w-[80vw] md:w-[400px] flex-shrink-0 flex flex-col justify-center">
            <h3 className="text-5xl md:text-6xl font-black text-white/10 leading-none mb-4 font-display">2025</h3>
            <p className="text-lg md:text-xl text-slate-300 leading-relaxed">
              "A year defined not just by the milestones we reached, but by the moments that happened in between."
            </p>
            <div className="mt-8 flex items-center text-purple-400 animate-pulse">
               <ArrowRight className="mr-2" /> Scroll right
            </div>
          </div>

          {/* Event Cards */}
          {events.map((event, index) => (
            <div 
              key={event.id} 
              className="relative w-[85vw] md:w-[600px] flex-shrink-0 group"
            >
              <div className="absolute top-1/2 -left-20 w-20 h-px bg-slate-700 hidden md:block"></div>
              
              {/* Card Container - Dark Theme - Increased Height on Mobile */}
              <div className="bg-slate-900/80 rounded-3xl overflow-hidden border border-slate-700 hover:border-purple-500/50 hover:shadow-[0_0_30px_rgba(168,85,247,0.15)] transition-all duration-500 transform hover:-translate-y-2 h-[75vh] md:h-[500px] flex flex-col backdrop-blur-xl">
                
                {/* Image Area */}
                <div className="h-[45%] md:h-1/2 w-full overflow-hidden relative">
                   {event.imageUrl ? (
                     <div 
                        className="timeline-card-image w-full h-full bg-cover bg-center transition-transform duration-700 hover:scale-105"
                        style={{ backgroundImage: `url(${event.imageUrl})` }}
                     />
                   ) : (
                     <div className={`w-full h-full ${event.color || 'bg-slate-800'} flex items-center justify-center`}>
                        <span className="text-white opacity-20 text-9xl font-bold">#{(index + 1).toString().padStart(2, '0')}</span>
                     </div>
                   )}
                   
                   <div className="absolute top-6 left-6 bg-black/50 backdrop-blur-md px-4 py-2 rounded-full text-sm font-bold text-white border border-white/10 flex items-center">
                      <Calendar size={14} className="mr-2 text-purple-400" />
                      {new Date(event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                   </div>

                   <div className={`absolute -bottom-6 right-8 w-12 h-12 rounded-full flex items-center justify-center text-white shadow-lg z-10 ${event.color || 'bg-indigo-600'} ring-4 ring-slate-900`}>
                      {getIcon(event.type)}
                   </div>
                </div>

                {/* Content Area */}
                <div className="h-[55%] md:h-1/2 p-6 md:p-8 flex flex-col relative">
                   <div className="flex-1 overflow-y-auto no-scrollbar">
                      <div className="text-xs font-bold tracking-widest text-slate-500 uppercase mb-2">{event.type}</div>
                      <h3 className="text-2xl md:text-3xl font-bold text-white mb-3 md:mb-4 leading-tight">{event.title}</h3>
                      <p className="text-slate-400 text-base md:text-lg leading-relaxed">{event.description}</p>
                   </div>
                   
                   {event.metrics && (
                     <div className="mt-4 pt-4 border-t border-slate-800 flex items-center justify-between shrink-0">
                        <span className="text-sm text-slate-500">Key Result</span>
                        <span className="text-xl font-bold text-purple-400">
                           {event.metrics.value} <span className="text-sm font-normal text-slate-500">{event.metrics.unit}</span>
                        </span>
                     </div>
                   )}
                </div>
              </div>

              <div className="absolute -bottom-10 -left-4 text-[120px] font-black text-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10 pointer-events-none font-display">
                {(index + 1).toString().padStart(2, '0')}
              </div>
            </div>
          ))}

          {/* End Card */}
          <div className="w-[80vw] md:w-[300px] flex-shrink-0 flex flex-col justify-center items-center pl-10 pr-20">
             <div className="w-20 h-20 bg-purple-600 rounded-full flex items-center justify-center text-white mb-6 animate-bounce">
                <ArrowRight size={32} className="rotate-90 md:rotate-0" />
             </div>
             <h3 className="text-2xl font-bold text-white text-center">Section Complete</h3>
             <p className="text-center text-slate-500 mt-2">Continue your journey...</p>
          </div>

        </div>
      </div>
    </div>
  );
};

export default TimelineSection;