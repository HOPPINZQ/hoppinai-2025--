import React, { useLayoutEffect, useRef } from 'react';
import { Sparkles, Globe, Box, Video, Github, ArrowRight, Layers, Cpu } from 'lucide-react';

const AIPipelineSection: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const leftContentRef = useRef<HTMLDivElement>(null);
  const rightColumnRef = useRef<HTMLDivElement>(null); // Renamed from editorRef for clarity
  const editorContainerRef = useRef<HTMLDivElement>(null);
  const codeContentRef = useRef<HTMLDivElement>(null);
  const popupRef = useRef<HTMLDivElement>(null);
  const roadmapRef = useRef<HTMLDivElement>(null);

  // References for the new specific animations
  const barBlueRef = useRef<HTMLDivElement>(null);
  const barOrangeRef = useRef<HTMLDivElement>(null);
  const barMainRef = useRef<HTMLDivElement>(null);
  const starRef = useRef<HTMLDivElement>(null);
  const stepsRef = useRef<(HTMLDivElement | null)[]>([]);

  useLayoutEffect(() => {
    const ctx = window.gsap.context(() => {
      window.gsap.registerPlugin(window.ScrollTrigger);
      
      const tl = window.gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "+=600%", // Extended for the new phase
          pin: true,
          scrub: 1,
          anticipatePin: 1,
        }
      });

      // --- Sequence ---

      // 1. Code "Typing" Effect (Scroll 0% -> 15%)
      if (codeContentRef.current) {
        const lines = window.gsap.utils.toArray(codeContentRef.current.children);
        tl.to(lines, {
          opacity: 1,
          x: 0,
          stagger: 0.1,
          duration: 2,
          ease: "power2.out"
        }, 0);
      }

      // 2. Shift Right Column & Reveal Left Container (Scroll 15% -> 30%)
      tl.to(rightColumnRef.current, {
        x: "25%", 
        scale: 0.9, 
        duration: 2,
        ease: "power2.inOut"
      }, 2);

      tl.fromTo(leftContentRef.current, 
        { opacity: 0, x: -50 },
        { opacity: 1, x: 0, duration: 2, ease: "power2.out" },
        2.5 
      );

      // 3. Animate The Pipeline (Progress Bar & Steps) (Scroll 30% -> 60%)
      
      // Grow the bars
      const barDuration = 4;
      const barStart = 3.5;
      
      tl.to(barBlueRef.current, { height: "315px", duration: barDuration, ease: "none" }, barStart);
      tl.to(barOrangeRef.current, { height: "315px", duration: barDuration, ease: "none" }, barStart);
      tl.to(barMainRef.current, { height: "315px", duration: barDuration, ease: "none" }, barStart);
      
      // Move the star
      tl.to(starRef.current, { top: "301px", duration: barDuration, ease: "none" }, barStart);

      // Highlight steps sequentially
      stepsRef.current.forEach((step, index) => {
        if (!step) return;
        const stepTime = barStart + (index * (barDuration / 3));
        
        tl.to(step, { opacity: 1, duration: 0.5 }, stepTime);
        if (index > 0 && stepsRef.current[index - 1]) {
           tl.to(stepsRef.current[index - 1], { opacity: 0.3, duration: 0.5 }, stepTime);
        }
      });

      // 4. Popup Reveal (Scroll 60% -> 80%)
      tl.to(popupRef.current, {
        scale: 1,
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
        duration: 2,
        ease: "elastic.out(1, 0.75)"
      }, 7.5);

      // 5. Crossfade Editor to Roadmap (Scroll 80% -> 100%)
      // Hide Editor Container
      tl.to(editorContainerRef.current, {
        opacity: 0,
        scale: 0.95,
        filter: "blur(10px)",
        duration: 1.5,
        pointerEvents: "none"
      }, 9.5);

      // Show Roadmap
      tl.to(roadmapRef.current, {
        opacity: 1,
        scale: 1,
        filter: "blur(0px)",
        duration: 1.5,
        pointerEvents: "auto"
      }, 10); // Overlap slightly

      // Stagger Roadmap Items
      const roadmapItems = roadmapRef.current?.querySelectorAll('.roadmap-item');
      if (roadmapItems && roadmapItems.length > 0) {
          tl.fromTo(roadmapItems,
             { opacity: 0, x: 50 },
             { opacity: 1, x: 0, stagger: 0.2, duration: 1, ease: "back.out(1.2)" },
             10.5
          );
      }

    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="relative w-full h-screen overflow-hidden bg-slate-950/50 backdrop-blur-sm z-20">
      
      {/* Decorative Background Glows */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-[100px] pointer-events-none"></div>

      <div ref={wrapperRef} className="relative w-full h-full max-w-[1440px] mx-auto flex items-center justify-center">
        
        {/* --- LEFT CONTENT --- */}
        <div 
          ref={leftContentRef} 
          className="absolute left-6 md:left-24 top-1/2 -translate-y-1/2 w-full md:w-[450px] z-10 opacity-0 pointer-events-none md:pointer-events-auto"
        >
          {/* Header */}
          <div className="mb-[8px] md:mb-[16px] text-[16px] md:text-[24px] font-semibold leading-[25px] md:leading-[28px] text-[#FF7F41] font-poppins">
            AI Pipeline
          </div>
          <div className="mb-[40px] text-[36px] md:text-[48px] font-semibold leading-[43px] md:leading-[58px] text-white font-poppins">
            Building 2025,<br/> end-to-end.
          </div>

          <div className="flex flex-row">
             {/* Progress Bar Container */}
             <div className="relative w-[29px] h-[315px] hidden md:block mr-[40px] flex-shrink-0">
                <div className="absolute left-[13px] top-0 w-[2px] h-full bg-[#1F1F1F]"></div>
                
                <div 
                  ref={barBlueRef}
                  className="absolute top-0 left-[9px] w-[10px] h-0"
                  style={{ 
                    background: 'linear-gradient(0deg, rgb(20, 123, 255) 0%, rgba(0, 0, 0, 0) 101.59%)',
                    filter: 'blur(30px)',
                  }}
                ></div>

                <div 
                   ref={barOrangeRef}
                   className="absolute top-0 left-[9px] w-[10px] h-0"
                   style={{
                      background: 'linear-gradient(0deg, rgba(255, 127, 65, 0.8) 0.03%, rgba(0, 0, 0, 0) 100%)',
                      filter: 'blur(5px)',
                   }}
                ></div>

                <div 
                   ref={barMainRef}
                   className="absolute top-0 left-[13px] w-[2px] h-0"
                   style={{
                      background: 'linear-gradient(rgb(26, 29, 32) 0%, rgb(42, 129, 238) 58.85%, rgb(219, 177, 213) 79.17%, rgb(253, 214, 119) 100%)'
                   }}
                ></div>

                <div 
                   ref={starRef}
                   className="absolute left-0 w-[29px] h-[29px]"
                   style={{ top: '0px' }}
                >
                   <img 
                     src="https://cdn-www.dora.run/__dora__/morpheus/static/images/ai/input-star.png" 
                     alt="star" 
                     width="29" 
                     height="29" 
                   />
                </div>
             </div>

             {/* Steps Text Container */}
             <div className="flex flex-col gap-[48px] pt-2">
                <div ref={(el) => { stepsRef.current[0] = el }} className="flex flex-col opacity-20 transition-opacity duration-300">
                   <div className="font-poppins text-[20px] md:text-[24px] font-semibold leading-[28px] text-white">
                      Analyzing memories...
                   </div>
                   <div className="mt-[4px] font-poppins text-[14px] md:text-[16px] font-normal leading-[24px] text-white/50">
                      AI scans your calendar and photos to determine the year's theme.
                   </div>
                </div>

                <div ref={(el) => { stepsRef.current[1] = el }} className="flex flex-col opacity-20 transition-opacity duration-300">
                   <div className="font-poppins text-[20px] md:text-[24px] font-semibold leading-[28px] text-white">
                      Crafting narrative...
                   </div>
                   <div className="mt-[4px] font-poppins text-[14px] md:text-[16px] font-normal leading-[24px] text-white/50">
                      Next, it weaves isolated events into a cohesive story of growth.
                   </div>
                </div>

                <div ref={(el) => { stepsRef.current[2] = el }} className="flex flex-col opacity-20 transition-opacity duration-300">
                   <div className="font-poppins text-[20px] md:text-[24px] font-semibold leading-[28px] text-white">
                      Tweak, iterate, publish!
                   </div>
                   <div className="mt-[4px] font-poppins text-[14px] md:text-[16px] font-normal leading-[24px] text-white/50">
                      The summary is generated — your turn to share your 2025 story.
                   </div>
                </div>
             </div>
          </div>
        </div>

        {/* --- RIGHT COLUMN (Wraps Editor + Roadmap) --- */}
        <div 
          ref={rightColumnRef}
          className="relative z-20 w-[90vw] md:w-[800px] aspect-[16/10] transform translate-x-0"
        >
          
          {/* 1. EDITOR CONTAINER */}
          <div ref={editorContainerRef} className="absolute inset-0 w-full h-full flex items-center justify-center">
             <div className="w-full h-full bg-[#050505] rounded-xl border border-white/10 shadow-2xl overflow-hidden flex flex-col relative">
                {/* Editor Header */}
                <div className="h-10 bg-[#1a1a1a] border-b border-white/5 flex items-center px-4 gap-2">
                   <div className="flex gap-2">
                      <div className="w-3 h-3 rounded-full bg-[#ff5f56]"></div>
                      <div className="w-3 h-3 rounded-full bg-[#ffbd2e]"></div>
                      <div className="w-3 h-3 rounded-full bg-[#27c93f]"></div>
                   </div>
                   <div className="mx-auto text-xs text-white/30 font-mono">2025_memory_processor.py</div>
                </div>

                {/* Editor Body */}
                <div className="flex-1 p-6 md:p-8 font-mono text-sm md:text-base text-slate-300 leading-relaxed overflow-hidden bg-[url('https://cdn-www.dora.run/__dora__/morpheus/static/images/ai/editor-bg.webp')] bg-cover bg-center">
                   <div ref={codeContentRef} className="flex flex-col gap-1">
                      {[
                         { text: 'import memory_core as mc', color: 'text-purple-400' },
                         { text: 'import emotion_engine as ee', color: 'text-purple-400' },
                         { text: '', color: '' },
                         { text: '# Initialize 2025 Review Sequence', color: 'text-slate-500' },
                         { text: 'async function generateReview(user_id) {', color: 'text-blue-400' },
                         { text: '  const memories = await mc.fetch(2025);', color: 'text-white ml-4' },
                         { text: '  const highlights = ee.analyze(memories);', color: 'text-white ml-4' },
                         { text: '', color: '' },
                         { text: '  // Synthesis Pattern', color: 'text-slate-500 ml-4' },
                         { text: '  const prompt = `Create a cinematic summary', color: 'text-green-300 ml-4' },
                         { text: '    Style: Minimalist, 3D, High Quality', color: 'text-orange-300 ml-6' },
                         { text: '    Subject: ${highlights.top_event}`;', color: 'text-green-300 ml-6' },
                         { text: '', color: '' },
                         { text: '  return await ai.generate(prompt);', color: 'text-blue-300 ml-4' },
                         { text: '}', color: 'text-blue-400' },
                      ].map((line, i) => (
                         <div key={i} className={`opacity-0 transform translate-x-4 ${line.color} min-h-[1.5em]`}>
                            {line.text}
                         </div>
                      ))}
                      <div className="ml-4 mt-2 w-2 h-5 bg-white animate-pulse"></div>
                   </div>
                </div>

                {/* Popup Card inside Editor */}
                <div 
                  ref={popupRef}
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 opacity-0 scale-50 blur-sm origin-center"
                >
                   <div className="transform scale-[0.6] md:scale-[0.85]">
                     <div 
                       className="w-[494px] h-[615px] flex flex-row justify-center items-center shadow-[0_0_50px_rgba(0,0,0,0.5)] rounded-[20px]" 
                       style={{
                          backgroundImage: 'url("https://cdn-www.dora.run/__dora__/morpheus/static/images/ai/editor-popup.webp")',
                          backgroundSize: 'cover',
                          backgroundRepeat: 'no-repeat'
                       }}
                     >
                       <div className="pt-[27px]">
                         <div 
                           className="z-10 w-[360px] h-[445px] flex flex-col" 
                           style={{
                             borderRadius: '14px',
                             border: '1px solid rgba(255, 255, 255, 0.20)',
                             background: 'linear-gradient(85deg, rgba(255, 255, 255, 0.04) 2.96%, rgba(255, 255, 255, 0.04) 96.14%)',
                             boxShadow: '0px 0px 10px 0px rgba(255, 255, 255, 0.10)'
                           }}
                         >
                           <div className="flex flex-row justify-between items-center h-[50px] bg-white/5 rounded-t-[14px]">
                              <div className="flex gap-2 ml-4">
                                 <div className="w-2 h-2 rounded-full bg-white/20"></div>
                                 <div className="w-2 h-2 rounded-full bg-white/20"></div>
                              </div>
                           </div>
                           <div className="mt-[16px] flex flex-col items-center">
                             <div className="mb-[8px] w-[300px] font-inter text-[12px] text-white/50">Subject</div>
                             <div className="w-[300px] h-[140px] text-white p-2.5 bg-black/20 border border-white/10 rounded-lg">
                                <span>VR Headset, Vision Pro</span><span className="animate-blink">|</span>
                             </div>
                           </div>
                           <div className="mt-[16px] flex flex-col items-center">
                             <div className="mb-[8px] w-[300px] font-inter text-[12px] text-white/50">Style</div>
                             <div className="w-[300px] h-[80px] text-white p-2.5 bg-black/20 border border-white/10 rounded-lg">
                                <span>Minimalist, 3D, Hyper realistic</span>
                             </div>
                           </div>
                           <div className="mt-[30px] flex flex-col items-center">
                             <button className="w-[300px] h-[36px] bg-white text-black font-bold rounded-lg hover:scale-105 transition-transform">Generate</button>
                           </div>
                         </div>
                       </div>
                     </div>
                   </div>
                </div>
             </div>
          </div>

          {/* 2. ROADMAP CONTAINER (New Open Source Section) */}
          <div 
             ref={roadmapRef}
             className="absolute inset-0 w-full h-full flex flex-col justify-center opacity-0 pointer-events-none scale-95 blur-sm"
          >
             <div className="w-full max-w-[600px] mx-auto pl-4 md:pl-10 relative">
                {/* Vertical Line */}
                <div className="absolute left-[20px] md:left-[59px] top-0 bottom-0 w-[2px] bg-gradient-to-b from-purple-500/50 via-slate-700 to-transparent"></div>
                
                {/* Content Items */}
                <div className="flex flex-col gap-8 relative z-10">
                   
                   {/* Header: Shipped */}
                   <div className="roadmap-item flex items-center">
                      <div className="bg-white text-black text-sm font-bold px-3 py-1 rounded-lg shadow-lg mr-4">
                         Shipped
                      </div>
                      <div className="text-white/50 text-sm font-medium">in Beta</div>
                   </div>

                   {/* Card 1 */}
                   <div className="roadmap-item bg-slate-900/40 backdrop-blur-md border border-white/10 rounded-2xl p-4 flex items-center hover:bg-slate-800/60 transition-colors cursor-pointer group">
                      <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center mr-4 group-hover:bg-purple-500/20 transition-colors">
                         <Globe className="text-white group-hover:text-purple-400" size={20} />
                      </div>
                      <div className="flex-1">
                         <h4 className="text-xl font-bold text-white mb-1">Core Engine</h4>
                         <p className="text-sm text-white/50">The memory processing unit. Open sourced.</p>
                      </div>
                      <Github className="text-white/20 group-hover:text-white" />
                   </div>

                   {/* Header: In Progress */}
                   <div className="roadmap-item flex items-center mt-4">
                      <div className="bg-white/10 text-white text-sm font-bold px-3 py-1 rounded-lg border border-white/10 mr-4">
                         In Progress
                      </div>
                      <div className="text-white/50 text-sm font-medium">for v1.0</div>
                   </div>

                   {/* Card 2 */}
                   <div className="roadmap-item bg-slate-900/40 backdrop-blur-md border border-white/10 rounded-2xl p-4 flex items-center hover:bg-slate-800/60 transition-colors cursor-pointer group">
                      <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center mr-4 group-hover:bg-blue-500/20 transition-colors">
                         <Box className="text-white group-hover:text-blue-400" size={20} />
                      </div>
                      <div className="flex-1">
                         <h4 className="text-xl font-bold text-white mb-1">3D Generator</h4>
                         <p className="text-sm text-white/50">Generate true 3D timeline assets from text.</p>
                      </div>
                      <ArrowRight className="text-white/20 group-hover:text-white" />
                   </div>

                   {/* Card 3 */}
                   <div className="roadmap-item bg-slate-900/40 backdrop-blur-md border border-white/10 rounded-2xl p-4 flex items-center hover:bg-slate-800/60 transition-colors cursor-pointer group">
                      <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center mr-4 group-hover:bg-pink-500/20 transition-colors">
                         <Video className="text-white group-hover:text-pink-400" size={20} />
                      </div>
                      <div className="flex-1">
                         <h4 className="text-xl font-bold text-white mb-1">Auto-Animation</h4>
                         <p className="text-sm text-white/50">Procedural motion for static memories.</p>
                      </div>
                      <ArrowRight className="text-white/20 group-hover:text-white" />
                   </div>

                   {/* Footer Link */}
                   <div className="roadmap-item pl-4 pt-2">
                      <a href="#" className="text-white/40 hover:text-white text-sm flex items-center gap-2 transition-colors">
                         ...and much more <ArrowRight size={14} />
                      </a>
                   </div>

                </div>
             </div>
          </div>

        </div>

      </div>
    </div>
  );
};

export default AIPipelineSection;