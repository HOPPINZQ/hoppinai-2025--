import React, { useLayoutEffect, useRef } from 'react';
import { Globe, Box, Video, Github, ArrowRight, Bot, User, Sparkles } from 'lucide-react';

const CHAT_MESSAGES = [
  { id: 1, role: 'user', text: "Hey, I want to build an interactive annual review for 2025." },
  { id: 2, role: 'ai', text: "That sounds epic! We can use React, GSAP for scroll animations, and Gemini for real-time insights." },
  { id: 3, role: 'user', text: "Let's make it immersive. 3D transitions and a neural aesthetic." },
  { id: 4, role: 'ai', text: "Understood. Initializing `2025_memory_core` module..." }
];

const AIPipelineSection: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const leftContentRef = useRef<HTMLDivElement>(null);
  const rightColumnRef = useRef<HTMLDivElement>(null);
  
  // Containers for the three states of the right column
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const editorContainerRef = useRef<HTMLDivElement>(null);
  const roadmapRef = useRef<HTMLDivElement>(null);
  
  const codeContentRef = useRef<HTMLDivElement>(null);
  const popupRef = useRef<HTMLDivElement>(null);
  const bgParticlesRef = useRef<HTMLDivElement>(null);

  // References for the pipeline animation
  const barBlueRef = useRef<HTMLDivElement>(null);
  const barOrangeRef = useRef<HTMLDivElement>(null);
  const barMainRef = useRef<HTMLDivElement>(null);
  const starRef = useRef<HTMLDivElement>(null);
  const stepsRef = useRef<(HTMLDivElement | null)[]>([]);
  const chatBubblesRef = useRef<(HTMLDivElement | null)[]>([]);

  // Generate stable random particles to prevent hydration mismatch and re-render jumps
  const particles = React.useMemo(() => {
     return [...Array(40)].map((_, i) => ({
        id: i,
        className: `absolute rounded-[1px] backdrop-blur-[1px] ${
           i % 3 === 0 ? 'bg-purple-500/40' : i % 3 === 1 ? 'bg-blue-500/40' : 'bg-emerald-500/40'
        }`,
        style: {
           width: Math.random() * 20 + 2 + 'px',
           height: Math.random() * 20 + 2 + 'px',
           left: Math.random() * 100 + '%',
           top: Math.random() * 100 + '%',
           border: Math.random() > 0.7 ? '1px solid rgba(255,255,255,0.15)' : 'none',
           boxShadow: Math.random() > 0.8 ? '0 0 10px rgba(255,255,255,0.2)' : 'none',
           opacity: Math.random() * 0.5 + 0.3
        }
     }));
  }, []);

  useLayoutEffect(() => {
    const ctx = window.gsap.context(() => {
      window.gsap.registerPlugin(window.ScrollTrigger);
      
      const mm = window.gsap.matchMedia();

      // --- CONFIGURATION ---
      // Common setup for initial states
      const setupCommon = () => {
         // Explicitly hide popup
         if (popupRef.current) {
            window.gsap.set(popupRef.current, { autoAlpha: 0, scale: 0.5, filter: "blur(10px)" });
         }
         // Hide Chat Bubbles
         if (chatBubblesRef.current) {
            window.gsap.set(chatBubblesRef.current, { y: 20, opacity: 0, scale: 0.9 });
         }
         // Code lines init
         if (codeContentRef.current) {
            const lines = Array.from(codeContentRef.current.children);
            window.gsap.set(lines, { width: 0, borderRight: "2px solid transparent" });
         }
      };

      // ===========================================
      // 1. DESKTOP ANIMATION (Original Logic)
      // ===========================================
      mm.add("(min-width: 769px)", () => {
         setupCommon();
         
         // Init Layout
         window.gsap.set(editorContainerRef.current, { opacity: 0, scale: 0.95, pointerEvents: 'none' });
         window.gsap.set(roadmapRef.current, { opacity: 0, scale: 0.95, pointerEvents: 'none' });
         
         // Left Content: Desktop Positioning (Left aligned)
         window.gsap.set(leftContentRef.current, { 
             left: "6rem", // equivalent to md:left-24
             top: "50%", 
             xPercent: 0, 
             yPercent: -50,
             x: -50, // Start slightly left
             opacity: 0,
             position: 'absolute'
         });

         // Right Column: Desktop Positioning (Offset right)
         window.gsap.set(rightColumnRef.current, {
             xPercent: 15,
             y: 100,
             opacity: 0
         });
         
         const tl = window.gsap.timeline({
            scrollTrigger: {
               trigger: containerRef.current,
               start: "top top",
               end: "+=800%",
               pin: true,
               scrub: 1,
               anticipatePin: 1,
            }
         });

         // Phase 1: Reveal Left & Chat
         tl.to(leftContentRef.current, { opacity: 1, x: 0, duration: 1, ease: "power2.out" }, 0);
         tl.to(rightColumnRef.current, { y: 0, opacity: 1, duration: 1, ease: "power2.out" }, 0);

         chatBubblesRef.current.forEach((bubble, i) => {
            if (bubble) tl.to(bubble, { y: 0, opacity: 1, scale: 1, duration: 0.5, ease: "back.out(1.5)" }, 0.5 + (i * 0.5));
         });

         // Phase 2: Chat -> Editor
         const editorStartTime = 3.5;
         tl.to(chatContainerRef.current, { opacity: 0, scale: 1.05, filter: "blur(10px)", duration: 1 }, editorStartTime);
         tl.to(editorContainerRef.current, { opacity: 1, scale: 1, filter: "blur(0px)", duration: 1 }, editorStartTime + 0.5);

         // Phase 3: Typing
         let typingStartTime = editorStartTime + 1.5;
         let typingDuration = 0;
         if (codeContentRef.current) {
            const lines = Array.from(codeContentRef.current.children);
            lines.forEach((line: any, index: number) => {
               const text = line.innerText || "";
               const duration = Math.max(0.1, text.length * 0.03); 
               tl.to(line, { width: "auto", duration: duration, ease: "none" }, typingStartTime + typingDuration);
               typingDuration += duration;
            });
         }

         // Phase 4: Pipeline Bars
         const pipelineStart = typingStartTime + typingDuration + 0.5;
         const barDuration = 3;
         tl.to(barBlueRef.current, { height: "315px", duration: barDuration, ease: "none" }, pipelineStart);
         tl.to(barOrangeRef.current, { height: "315px", duration: barDuration, ease: "none" }, pipelineStart);
         tl.to(barMainRef.current, { height: "315px", duration: barDuration, ease: "none" }, pipelineStart);
         tl.to(starRef.current, { top: "301px", duration: barDuration, ease: "none" }, pipelineStart);
         
         stepsRef.current.forEach((step, index) => {
            if (!step) return;
            const stepTime = pipelineStart + (index * (barDuration / 3));
            tl.to(step, { opacity: 1, duration: 0.5 }, stepTime);
            if (index > 0 && stepsRef.current[index - 1]) tl.to(stepsRef.current[index - 1], { opacity: 0.3, duration: 0.5 }, stepTime);
         });

         // Phase 5: Popup
         const popupStart = pipelineStart + barDuration;
         tl.to(popupRef.current, { autoAlpha: 1, scale: 1, filter: "blur(0px)", duration: 2, ease: "elastic.out(1, 0.75)" }, popupStart);

         // Phase 6: Roadmap
         const roadmapStart = popupStart + 2;
         tl.to(editorContainerRef.current, { opacity: 0, scale: 0.95, filter: "blur(10px)", duration: 1.5 }, roadmapStart);
         tl.to(roadmapRef.current, { opacity: 1, scale: 1, filter: "blur(0px)", duration: 1.5 }, roadmapStart + 0.5);

         const roadmapItems = roadmapRef.current?.querySelectorAll('.roadmap-item');
         if (roadmapItems) {
             tl.fromTo(roadmapItems, { opacity: 0, x: 50 }, { opacity: 1, x: 0, stagger: 0.2, duration: 1 }, roadmapStart + 1);
         }
      });

      // ===========================================
      // 2. MOBILE ANIMATION (Sequential Logic)
      // ===========================================
      mm.add("(max-width: 768px)", () => {
         setupCommon();
         
         // Left Content: Mobile Positioning (Center)
         // We use xPercent/yPercent: -50 to center it perfectly regardless of width
         window.gsap.set(leftContentRef.current, { 
             left: "50%", 
             top: "50%", 
             xPercent: -50, 
             yPercent: -50,
             y: 50, // Start slightly lower for entrance
             opacity: 0,
             position: 'absolute'
         });

         // Right Column: Mobile Positioning (Center)
         window.gsap.set(rightColumnRef.current, {
             xPercent: 0, 
             y: 0,
             opacity: 1
         });

         // Mobile Init states
         window.gsap.set(editorContainerRef.current, { opacity: 0, scale: 0.9 });
         window.gsap.set(roadmapRef.current, { opacity: 0, scale: 0.9 });

         const tl = window.gsap.timeline({
            scrollTrigger: {
               trigger: containerRef.current,
               start: "top top",
               end: "+=1000%", // Longer scroll for sequential flow
               pin: true,
               scrub: 1,
               anticipatePin: 1,
            }
         });

         // --- STEP 1: CHAT SEQUENCE ---
         chatBubblesRef.current.forEach((bubble, i) => {
            if (bubble) tl.to(bubble, { y: 0, opacity: 1, scale: 1, duration: 0.5, ease: "back.out(1.5)" }, i * 0.5);
         });
         
         // Chat finishes, pause briefly then hide
         tl.to(chatContainerRef.current, { opacity: 0, scale: 1.05, filter: "blur(10px)", duration: 1 }, ">1");

         // --- STEP 2: EDITOR SEQUENCE ---
         // Show Editor
         tl.to(editorContainerRef.current, { opacity: 1, scale: 1, filter: "blur(0px)", duration: 1 }, "<0.5");
         
         // Type Code
         if (codeContentRef.current) {
            const lines = Array.from(codeContentRef.current.children);
            lines.forEach((line: any) => {
               tl.to(line, { width: "auto", duration: 0.2, ease: "none" }); // Faster typing on mobile
            });
         }

         // Show Popup
         tl.to(popupRef.current, { autoAlpha: 1, scale: 1, filter: "blur(0px)", duration: 1, ease: "elastic.out(1, 0.75)" }, ">0.5");

         // Hide Editor to make room for Pipeline Text
         tl.to(editorContainerRef.current, { opacity: 0, scale: 0.95, filter: "blur(10px)", duration: 1 }, ">2");

         // --- STEP 3: PIPELINE TEXT (LEFT CONTENT) ---
         // Now we show the "Left Content" which was hidden
         // Animate y from 50 (set in init) to 0 (which aligns with center due to yPercent: -50)
         tl.to(leftContentRef.current, { opacity: 1, y: 0, duration: 1 }, "<0.5");
         
         // Animate Bars (Faster)
         tl.to([barBlueRef.current, barOrangeRef.current, barMainRef.current], { height: "315px", duration: 2, ease: "none" }, "<");
         tl.to(starRef.current, { top: "301px", duration: 2, ease: "none" }, "<");

         // Fade Steps
         stepsRef.current.forEach((step, index) => {
            if (!step) return;
            tl.to(step, { opacity: 1, duration: 0.5 });
            if (index > 0 && stepsRef.current[index - 1]) tl.to(stepsRef.current[index - 1], { opacity: 0.3, duration: 0.5 });
         });

         // Hide Pipeline Text
         tl.to(leftContentRef.current, { opacity: 0, y: -50, duration: 1 }, ">1");

         // --- STEP 4: ROADMAP (NEURAL CORE) ---
         tl.to(roadmapRef.current, { opacity: 1, scale: 1, filter: "blur(0px)", duration: 1 }, "<0.5");
         
         const roadmapItems = roadmapRef.current?.querySelectorAll('.roadmap-item');
         if (roadmapItems) {
             tl.fromTo(roadmapItems, { opacity: 0, x: 20 }, { opacity: 1, x: 0, stagger: 0.2, duration: 1 }, "<0.5");
         }

         // --- STEP 5: BOTTOM TRANSITION ---
         // Fade in the bottom gradient to smooth transition to next section
         tl.to('.bottom-gradient', { opacity: 1, duration: 1 }, ">-1");
      });

    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="relative w-full h-screen overflow-hidden bg-slate-950/50 backdrop-blur-sm z-20">
      
      {/* Coherence Line */}
      <div className="absolute top-0 left-6 md:left-10 w-px h-32 bg-gradient-to-b from-white/0 via-white/20 to-white/0 z-50"></div>

      {/* Section Header */}
      <div className="absolute top-0 left-0 w-full z-40 px-6 md:px-10 pt-24 pb-4 pointer-events-none">
         <div className="flex justify-between items-end">
            <div>
               <h2 className="text-3xl md:text-5xl font-display font-bold text-white">
                  Section 2: <span className="text-purple-400">Neural Core</span>
               </h2>
               <p className="text-slate-400 mt-2 text-sm md:text-base">AI Processing • 2025</p>
            </div>
         </div>
      </div>

      {/* Decorative Background Glows */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-[100px] pointer-events-none"></div>
      
      {/* Background Particles Container */}
      <div ref={bgParticlesRef} className="absolute inset-0 pointer-events-none z-10 overflow-hidden">
         {particles.map((p) => (
            <div 
               key={p.id} 
               className={p.className}
               style={p.style}
            />
         ))}
      </div>

      <div ref={wrapperRef} className="relative w-full h-full max-w-[1440px] mx-auto flex items-center justify-center">
        
        {/* --- LEFT CONTENT (Pipeline Steps) --- */}
        {/* Removed Tailwind transform classes (-translate-x-1/2, etc) to prevent GSAP conflict. Positioning handled in matchMedia. */}
        <div 
          ref={leftContentRef} 
          className="absolute w-[90%] md:w-[450px] z-30 pointer-events-none md:pointer-events-auto flex flex-col items-center md:items-start text-center md:text-left"
        >
          {/* Header */}
          <div className="mb-[8px] md:mb-[16px] text-[16px] md:text-[24px] font-semibold leading-[25px] md:leading-[28px] text-[#FF7F41] font-poppins">
            AI Pipeline
          </div>
          <div className="mb-[40px] text-[36px] md:text-[48px] font-semibold leading-[43px] md:leading-[58px] text-white font-poppins">
            Building 2025,<br/> end-to-end.
          </div>

          <div className="flex flex-row justify-center md:justify-start">
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
             <div className="flex flex-col gap-[48px] pt-2 items-center md:items-start">
                <div ref={(el) => { stepsRef.current[0] = el }} className="flex flex-col opacity-20 transition-opacity duration-300">
                   <div className="font-poppins text-[20px] md:text-[24px] font-semibold leading-[28px] text-white">
                      Analyzing memories...
                   </div>
                   <div className="mt-[4px] font-poppins text-[14px] md:text-[16px] font-normal leading-[24px] text-white/50">
                      AI scans your calendar and photos.
                   </div>
                </div>

                <div ref={(el) => { stepsRef.current[1] = el }} className="flex flex-col opacity-20 transition-opacity duration-300">
                   <div className="font-poppins text-[20px] md:text-[24px] font-semibold leading-[28px] text-white">
                      Crafting narrative...
                   </div>
                   <div className="mt-[4px] font-poppins text-[14px] md:text-[16px] font-normal leading-[24px] text-white/50">
                      Weaving events into a story.
                   </div>
                </div>

                <div ref={(el) => { stepsRef.current[2] = el }} className="flex flex-col opacity-20 transition-opacity duration-300">
                   <div className="font-poppins text-[20px] md:text-[24px] font-semibold leading-[28px] text-white">
                      Tweak, iterate, publish!
                   </div>
                   <div className="mt-[4px] font-poppins text-[14px] md:text-[16px] font-normal leading-[24px] text-white/50">
                      Your turn to share your 2025 story.
                   </div>
                </div>
             </div>
          </div>
        </div>

        {/* --- RIGHT COLUMN CONTAINER (Holds Chat -> Editor -> Roadmap) --- */}
        {/* Removed Tailwind transform classes. Positioning handled in matchMedia. */}
        <div 
          ref={rightColumnRef}
          className="relative z-20 w-[95vw] md:w-[800px] min-h-[60vh] md:aspect-[16/10]"
        >
          
          {/* 1. CHAT INTERFACE */}
          <div ref={chatContainerRef} className="absolute inset-0 w-full h-full flex items-center justify-center">
             <div className="w-full h-full max-h-[70vh] md:max-h-[600px] bg-[#050505]/90 backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl flex flex-col overflow-hidden relative">
                {/* Chat Header */}
                <div className="h-14 border-b border-white/10 flex items-center px-6 justify-between bg-white/5">
                   <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-indigo-500 flex items-center justify-center">
                         <Sparkles size={16} className="text-white" />
                      </div>
                      <div>
                         <div className="text-sm font-bold text-white">Gemini Pro 2.5</div>
                         <div className="text-[10px] text-green-400 flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"></span> Online
                         </div>
                      </div>
                   </div>
                   <div className="flex gap-2">
                      <div className="w-3 h-3 rounded-full bg-[#ff5f56]"></div>
                      <div className="w-3 h-3 rounded-full bg-[#ffbd2e]"></div>
                      <div className="w-3 h-3 rounded-full bg-[#27c93f]"></div>
                   </div>
                </div>

                {/* Chat Messages Area */}
                <div className="flex-1 p-4 md:p-8 flex flex-col gap-4 md:gap-6 overflow-hidden justify-center md:justify-start">
                   {CHAT_MESSAGES.map((msg, i) => (
                      <div 
                        key={msg.id}
                        ref={(el) => { chatBubblesRef.current[i] = el }}
                        className={`flex gap-3 md:gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'} opacity-0`}
                      >
                         {/* Avatar */}
                         <div className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center flex-shrink-0 ${msg.role === 'user' ? 'bg-slate-700' : 'bg-purple-600'}`}>
                            {msg.role === 'user' ? <User size={16} className="text-white" /> : <Bot size={16} className="text-white" />}
                         </div>

                         {/* Bubble */}
                         <div className={`max-w-[80%] p-3 md:p-4 rounded-2xl text-xs md:text-base leading-relaxed ${
                            msg.role === 'user' 
                               ? 'bg-slate-800 text-slate-200 rounded-tr-sm border border-slate-700' 
                               : 'bg-purple-900/30 text-purple-100 rounded-tl-sm border border-purple-500/30'
                         }`}>
                            {msg.text}
                         </div>
                      </div>
                   ))}
                </div>

                {/* Chat Input Simulation */}
                <div className="h-14 md:h-16 border-t border-white/10 flex items-center px-4 md:px-6 gap-4 bg-black/40">
                   <div className="flex-1 h-9 md:h-10 bg-white/5 rounded-full flex items-center px-4 text-xs md:text-sm text-slate-500">
                      Type a message...
                   </div>
                   <div className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-purple-600 flex items-center justify-center opacity-50">
                      <ArrowRight size={16} className="text-white" />
                   </div>
                </div>
             </div>
          </div>

          {/* 2. EDITOR CONTAINER */}
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
                <div className="flex-1 p-4 md:p-8 font-mono text-xs md:text-base text-slate-300 leading-relaxed overflow-hidden bg-[url('https://cdn-www.dora.run/__dora__/morpheus/static/images/ai/editor-bg.webp')] bg-cover bg-center relative">
                   {/* CODE CONTENT: Typing Animation */}
                   <div ref={codeContentRef} className="flex flex-col gap-1 min-h-[300px]">
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
                         <div key={i} className={`whitespace-nowrap overflow-hidden w-fit ${line.color} min-h-[1.5em] box-border`}>
                            {line.text}
                         </div>
                      ))}
                   </div>
                </div>

                {/* Popup Card inside Editor - Inline Centered */}
                <div 
                  ref={popupRef}
                  style={{
                     position: 'absolute',
                     top: '50%',
                     left: '50%',
                     transform: 'translate(-50%, -50%)',
                     zIndex: 50
                  }}
                >
                   <div className="transform scale-[0.6] md:scale-[0.85]">
                     <div 
                       className="w-[320px] md:w-[494px] h-[450px] md:h-[615px] flex flex-row justify-center items-center shadow-[0_0_50px_rgba(0,0,0,0.5)] rounded-[20px]" 
                       style={{
                          backgroundImage: 'url("https://cdn-www.dora.run/__dora__/morpheus/static/images/ai/editor-popup.webp")',
                          backgroundSize: 'cover',
                          backgroundRepeat: 'no-repeat'
                       }}
                     >
                       <div className="pt-[10px] md:pt-[27px]">
                         <div 
                           className="z-10 w-[280px] md:w-[360px] h-[380px] md:h-[445px] flex flex-col" 
                           style={{
                             borderRadius: '14px',
                             border: '1px solid rgba(255, 255, 255, 0.20)',
                             background: 'linear-gradient(85deg, rgba(255, 255, 255, 0.04) 2.96%, rgba(255, 255, 255, 0.04) 96.14%)',
                             boxShadow: '0px 0px 10px 0px rgba(255, 255, 255, 0.10)'
                           }}
                         >
                           <div className="flex flex-row justify-between items-center h-[40px] md:h-[50px] bg-white/5 rounded-t-[14px]">
                              <div className="flex gap-2 ml-4">
                                 <div className="w-2 h-2 rounded-full bg-white/20"></div>
                                 <div className="w-2 h-2 rounded-full bg-white/20"></div>
                              </div>
                           </div>
                           <div className="mt-[10px] md:mt-[16px] flex flex-col items-center">
                             <div className="mb-[4px] md:mb-[8px] w-[260px] md:w-[300px] font-inter text-[10px] md:text-[12px] text-white/50">Subject</div>
                             <div className="w-[260px] md:w-[300px] h-[100px] md:h-[140px] text-white p-2.5 bg-black/20 border border-white/10 rounded-lg text-sm">
                                <span>VR Headset, Vision Pro</span><span className="animate-blink">|</span>
                             </div>
                           </div>
                           <div className="mt-[10px] md:mt-[16px] flex flex-col items-center">
                             <div className="mb-[4px] md:mb-[8px] w-[260px] md:w-[300px] font-inter text-[10px] md:text-[12px] text-white/50">Style</div>
                             <div className="w-[260px] md:w-[300px] h-[60px] md:h-[80px] text-white p-2.5 bg-black/20 border border-white/10 rounded-lg text-sm">
                                <span>Minimalist, 3D, Hyper realistic</span>
                             </div>
                           </div>
                           <div className="mt-[20px] md:mt-[30px] flex flex-col items-center">
                             <button className="w-[260px] md:w-[300px] h-[36px] bg-white text-black font-bold rounded-lg hover:scale-105 transition-transform text-sm md:text-base">Generate</button>
                           </div>
                         </div>
                       </div>
                     </div>
                   </div>
                </div>
             </div>
          </div>

          {/* 3. ROADMAP CONTAINER */}
          <div 
             ref={roadmapRef}
             className="absolute inset-0 w-full h-full flex flex-col justify-center opacity-0 pointer-events-none scale-95 blur-sm"
          >
             <div className="w-full max-w-[600px] mx-auto pl-0 md:pl-10 relative px-4">
                {/* Vertical Line */}
                <div className="absolute left-[20px] md:left-[59px] top-0 bottom-0 w-[2px] bg-gradient-to-b from-purple-500/50 via-slate-700 to-transparent hidden md:block"></div>
                
                {/* Content Items */}
                <div className="flex flex-col gap-6 md:gap-8 relative z-10">
                   
                   {/* Header: Shipped */}
                   <div className="roadmap-item flex items-center justify-center md:justify-start">
                      <div className="bg-white text-black text-xs md:text-sm font-bold px-3 py-1 rounded-lg shadow-lg mr-4">
                         Shipped
                      </div>
                      <div className="text-white/50 text-xs md:text-sm font-medium">in Beta</div>
                   </div>

                   {/* Card 1 */}
                   <div className="roadmap-item bg-slate-900/40 backdrop-blur-md border border-white/10 rounded-2xl p-4 flex items-center hover:bg-slate-800/60 transition-colors cursor-pointer group">
                      <div className="w-10 h-10 md:w-12 md:h-12 bg-white/10 rounded-full flex items-center justify-center mr-4 group-hover:bg-purple-500/20 transition-colors shrink-0">
                         <Globe className="text-white group-hover:text-purple-400" size={20} />
                      </div>
                      <div className="flex-1 min-w-0 text-left">
                         <h4 className="text-lg md:text-xl font-bold text-white mb-1">Core Engine</h4>
                         <p className="text-xs md:text-sm text-white/50 truncate">The memory processing unit.</p>
                      </div>
                      <Github className="text-white/20 group-hover:text-white shrink-0" />
                   </div>

                   {/* Header: In Progress */}
                   <div className="roadmap-item flex items-center mt-2 md:mt-4 justify-center md:justify-start">
                      <div className="bg-white/10 text-white text-xs md:text-sm font-bold px-3 py-1 rounded-lg border border-white/10 mr-4">
                         In Progress
                      </div>
                      <div className="text-white/50 text-xs md:text-sm font-medium">for v1.0</div>
                   </div>

                   {/* Card 2 */}
                   <div className="roadmap-item bg-slate-900/40 backdrop-blur-md border border-white/10 rounded-2xl p-4 flex items-center hover:bg-slate-800/60 transition-colors cursor-pointer group">
                      <div className="w-10 h-10 md:w-12 md:h-12 bg-white/10 rounded-full flex items-center justify-center mr-4 group-hover:bg-blue-500/20 transition-colors shrink-0">
                         <Box className="text-white group-hover:text-blue-400" size={20} />
                      </div>
                      <div className="flex-1 min-w-0 text-left">
                         <h4 className="text-lg md:text-xl font-bold text-white mb-1">3D Generator</h4>
                         <p className="text-xs md:text-sm text-white/50 truncate">Generate 3D timeline assets.</p>
                      </div>
                      <ArrowRight className="text-white/20 group-hover:text-white shrink-0" />
                   </div>

                   {/* Card 3 */}
                   <div className="roadmap-item bg-slate-900/40 backdrop-blur-md border border-white/10 rounded-2xl p-4 flex items-center hover:bg-slate-800/60 transition-colors cursor-pointer group">
                      <div className="w-10 h-10 md:w-12 md:h-12 bg-white/10 rounded-full flex items-center justify-center mr-4 group-hover:bg-pink-500/20 transition-colors shrink-0">
                         <Video className="text-white group-hover:text-pink-400" size={20} />
                      </div>
                      <div className="flex-1 min-w-0 text-left">
                         <h4 className="text-lg md:text-xl font-bold text-white mb-1">Auto-Animation</h4>
                         <p className="text-xs md:text-sm text-white/50 truncate">Procedural motion for memories.</p>
                      </div>
                      <ArrowRight className="text-white/20 group-hover:text-white shrink-0" />
                   </div>

                </div>
             </div>
          </div>

        </div>

      </div>

      {/* Bottom Gradient for Mobile Transition */}
      <div className="bottom-gradient absolute bottom-0 left-0 w-full h-40 bg-gradient-to-t from-slate-950 to-transparent z-40 opacity-0 pointer-events-none md:hidden"></div>
    </div>
  );
};

export default AIPipelineSection;
