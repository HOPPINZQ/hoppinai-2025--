import React from 'react';
import IntroAnimation from './components/IntroAnimation';
import TimelineSection from './components/TimelineSection';
import AIPipelineSection from './components/AIPipelineSection';
import MusicSection from './components/MusicSection';
import GamingSection from './components/GamingSection';
import PhotoWallSection from './components/PhotoWallSection'; 
import StrangeLoopSection from './components/StrangeLoopSection'; 
import SnakeBackground from './components/SnakeBackground';
import ScrollProgress from './components/ScrollProgress';
import Header from './components/Header';
import { MEMORY_IMAGES, STAT_CARDS, TIMELINE_EVENTS } from './data';

const App: React.FC = () => {
  return (
    <div className="w-full min-h-screen text-slate-50 relative overflow-x-hidden font-inter">
      
      {/* Global Navigation Header */}
      <Header />

      {/* Background Layer: Fixed Z-0 */}
      <SnakeBackground />
      
      {/* Floating UI: Z-50 */}
      <ScrollProgress />

      {/* Main Content: Z-10 */}
      <div className="relative z-10">
        
        <IntroAnimation 
          images={MEMORY_IMAGES} 
          stats={STAT_CARDS} 
          onComplete={() => {}} 
        />
        
        <div id="timeline" className="relative">
          <TimelineSection events={TIMELINE_EVENTS} />
        </div>

        {/* AI Pipeline Section */}
        <div id="ai-pipeline" className="relative">
           <AIPipelineSection />
        </div>

        {/* Music Section */}
        <div id="music" className="relative">
           <MusicSection />
        </div>

        {/* Visual Chronicles Section (Combines Time Shift & Showcase) */}
        <div id="visuals" className="relative">
           <PhotoWallSection />
        </div>

        {/* Gaming Section */}
        <div id="gaming" className="relative">
           <GamingSection />
        </div>

        {/* Strange Loop Section */}
        <div id="loop" className="relative">
           <StrangeLoopSection />
        </div>

      </div>

      <style>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob {
          animation: blob 10s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        .animate-fade-in {
            animation: fadeIn 0.5s ease-out forwards;
        }
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default App;