import React, { useLayoutEffect, useRef } from 'react';

const SnakeBackground: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const snakeHeadRef = useRef<SVGGElement>(null);
  const snakeBodyRef = useRef<SVGPathElement>(null);
  const nodesRef = useRef<SVGGElement>(null);

  useLayoutEffect(() => {
    const ctx = window.gsap.context(() => {
      window.gsap.registerPlugin(window.ScrollTrigger, window.MotionPathPlugin);

      const path = pathRef.current;
      const head = snakeHeadRef.current;
      const body = snakeBodyRef.current;
      const nodes = nodesRef.current;

      if (!path || !head || !body) return;

      // 1. Calculate Path Logic
      const totalPathLen = path.getTotalLength();
      const snakeLen = totalPathLen * 0.15; // Slightly longer snake
      
      window.gsap.set(body, {
        strokeDasharray: `${snakeLen} ${totalPathLen}`,
        strokeDashoffset: snakeLen, 
      });

      // 2. Main Scroll Animation
      const tl = window.gsap.timeline({
        scrollTrigger: {
          trigger: document.body,
          start: "top top",
          end: "bottom bottom",
          scrub: 0, // Instant synchronization with scroll (changed from 1)
          onUpdate: (self: any) => {
             const velocity = Math.abs(self.getVelocity());
             const scaleY = 1 + Math.min(velocity / 3000, 0.3);
             const scaleX = 1 - Math.min(velocity / 5000, 0.2);
             
             window.gsap.to(head, { 
                scaleX: scaleX, 
                scaleY: scaleY,
                duration: 0.1,
                overwrite: 'auto'
             });
          }
        }
      });

      tl.fromTo(body, 
        { strokeDashoffset: snakeLen }, 
        { strokeDashoffset: -totalPathLen, ease: "none" }, 
        0
      );

      tl.to(head, {
        motionPath: {
          path: path,
          align: path,
          autoRotate: true,
          alignOrigin: [0.5, 0.5],
          start: 0,
          end: 1,
        },
        ease: "none",
      }, 0);

      // 3. Node Lighting
      if (nodes) {
        Array.from(nodes.children).forEach((node, i) => {
           window.gsap.to(node, {
              opacity: 1,
              scale: 2,
              duration: 0.5,
              repeat: 1,
              yoyo: true,
              scrollTrigger: {
                 trigger: document.body,
                 start: `${10 + (i * 15)}% top`,
                 toggleActions: "play none none reverse"
              }
           });
        });
      }

      // 4. Idle Eye
      const idleTl = window.gsap.timeline({ repeat: -1, yoyo: true });
      idleTl.to(snakeHeadRef.current?.querySelector('#eye-glow'), {
        attr: { r: 0.8 },
        opacity: 1,
        duration: 0.8,
        ease: "power1.inOut"
      });

    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    // Added bg-slate-950 here to serve as the main dark background for the app
    <div ref={containerRef} className="fixed inset-0 pointer-events-none z-0 bg-slate-950">
      {/* Decorative Grid Background */}
      <div className="absolute inset-0 opacity-10" 
           style={{ 
             backgroundImage: 'linear-gradient(#6366f1 1px, transparent 1px), linear-gradient(90deg, #6366f1 1px, transparent 1px)',
             backgroundSize: '50px 50px'
           }}>
      </div>
      
      {/* Vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#020617_100%)] opacity-80"></div>

      <svg 
        className="w-full h-full relative z-10" 
        viewBox="0 0 100 400" 
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="snakeGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#6366f1" stopOpacity="0" />
            <stop offset="20%" stopColor="#a855f7" stopOpacity="1" />
            <stop offset="80%" stopColor="#ec4899" stopOpacity="1" />
            <stop offset="100%" stopColor="#6366f1" stopOpacity="0" />
          </linearGradient>
          
          <linearGradient id="textGradStart" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#94a3b8" />
            <stop offset="50%" stopColor="#e2e8f0" />
            <stop offset="100%" stopColor="#64748b" />
          </linearGradient>

          <linearGradient id="textGradEnd" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#f472b6" />
            <stop offset="50%" stopColor="#c084fc" />
            <stop offset="100%" stopColor="#818cf8" />
          </linearGradient>
          
          <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="1.5" result="coloredBlur"/>
            <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>

          <filter id="text-3d" x="-20%" y="-20%" width="140%" height="140%">
             {/* Create a dark offset shadow for depth */}
             <feDropShadow dx="0.5" dy="0.5" stdDeviation="0.2" floodColor="#000" floodOpacity="0.8"/>
             {/* Create a colored glow */}
             <feDropShadow dx="0" dy="0" stdDeviation="1.5" floodColor="#a855f7" floodOpacity="0.4"/>
             {/* Brighten the source slightly */}
             <feComponentTransfer>
                <feFuncR type="linear" slope="1.1"/>
                <feFuncG type="linear" slope="1.1"/>
                <feFuncB type="linear" slope="1.1"/>
             </feComponentTransfer>
          </filter>

          <filter id="text-3d-end" x="-20%" y="-20%" width="140%" height="140%">
             <feDropShadow dx="0.5" dy="0.5" stdDeviation="0.2" floodColor="#000" floodOpacity="0.8"/>
             <feDropShadow dx="0" dy="0" stdDeviation="2" floodColor="#ec4899" floodOpacity="0.6"/>
          </filter>
        </defs>

        <text 
          x="50" y="15" 
          textAnchor="middle" 
          fontSize="8" 
          fill="url(#textGradStart)" 
          filter="url(#text-3d)" 
          className="font-display font-black tracking-[0.2em] opacity-80"
          style={{ textShadow: '0px 0px 5px rgba(255,255,255,0.2)' }}
        >
          START 2025
        </text>

        <text 
          x="50" y="390" 
          textAnchor="middle" 
          fontSize="14" 
          fill="url(#textGradEnd)" 
          filter="url(#text-3d-end)" 
          className="font-display font-black tracking-[0.15em] opacity-90"
        >
          2026
        </text>

        <g ref={nodesRef} fill="#fff" opacity="0.3">
           <circle cx="20" cy="50" r="1" />
           <circle cx="80" cy="110" r="1" />
           <circle cx="20" cy="170" r="1" />
           <circle cx="80" cy="230" r="1" />
           <circle cx="50" cy="300" r="1.5" />
        </g>

        {/* Path Track - Extended from 0 to 400 to match viewport height mapping */}
        <path
          ref={pathRef}
          d="M 50 0 
             C 40 10, 10 40, 20 60 
             S 80 80, 80 110 
             S 20 140, 20 170 
             S 80 200, 80 230
             S 40 280, 20 310
             S 50 360, 50 400"
          fill="none"
          stroke="rgba(255, 255, 255, 0.05)"
          strokeWidth="0.5"
          vectorEffect="non-scaling-stroke"
        />

        {/* Snake Body */}
        <path
          ref={snakeBodyRef}
          d="M 50 0 
             C 40 10, 10 40, 20 60 
             S 80 80, 80 110 
             S 20 140, 20 170 
             S 80 200, 80 230
             S 40 280, 20 310
             S 50 360, 50 400"
          fill="none"
          stroke="url(#snakeGradient)"
          strokeWidth="2"
          strokeLinecap="round"
          filter="url(#glow)"
        />

        {/* Snake Head */}
        <g ref={snakeHeadRef} id="snake-head">
           <path 
             d="M -3 -2 L 4 0 L -3 2 L -1 0 Z" 
             fill="#fff" 
             stroke="#fff" 
             strokeWidth="0.5"
             filter="url(#glow)"
           />
           <circle id="eye-glow" cx="1" cy="0" r="0.4" fill="#ec4899" />
        </g>
      </svg>
    </div>
  );
};

export default SnakeBackground;