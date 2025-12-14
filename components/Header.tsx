import React, { useState } from 'react';
import { Search, Menu, X } from 'lucide-react';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const scrollToSection = (id: string) => {
    setIsMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const navItems = [
    { name: 'Timeline', id: 'timeline' },
    { name: 'AI Pipeline', id: 'ai-pipeline' },
    { name: 'Music', id: 'music' },
    { name: 'Visual Chronicles', id: 'visuals' },
    { name: 'Gaming', id: 'gaming' },
    { name: 'Strange Loop', id: 'loop' },
  ];

  return (
    <>
      {/* Fixed Header Bar - mix-blend-difference for visibility over light/dark areas, though usually simpler to just use dark bg or blur */}
      <header className="fixed top-0 left-0 w-full z-50 px-6 py-4 flex items-center justify-between pointer-events-none">
        
        {/* 1. Logo (Top Left) */}
        <div className="pointer-events-auto">
          <h1 
            className="text-2xl md:text-3xl font-bold font-display tracking-tighter cursor-pointer select-none transition-all duration-300 text-white hover:text-purple-400 active:scale-95 animate-bob hover:animate-shake"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            style={{ textShadow: '0 0 20px rgba(168, 85, 247, 0.5)' }}
          >
            hoppinzq
          </h1>
        </div>

        {/* 2. Menu Button (Top Center) */}
        <div className="absolute left-1/2 -translate-x-1/2 pointer-events-auto">
           <button 
             onClick={() => setIsMenuOpen(!isMenuOpen)}
             className="flex items-center gap-2 px-4 py-2 bg-white/5 backdrop-blur-md rounded-full border border-white/10 hover:bg-white/20 hover:border-white/30 transition-all group shadow-lg"
           >
              <span className="text-xs font-bold uppercase tracking-widest hidden md:block text-slate-200 group-hover:text-white">Menu</span>
              <Menu size={16} className={`text-slate-200 group-hover:text-white transition-transform duration-300 ${isMenuOpen ? 'rotate-90' : ''}`} />
           </button>
        </div>

        {/* 3. Search (Top Right) */}
        <div className="pointer-events-auto">
           <button 
             onClick={() => setIsSearchOpen(true)}
             className="p-2 bg-white/5 backdrop-blur-md rounded-full border border-white/10 hover:bg-white/20 hover:border-white/30 transition-all hover:rotate-12 group shadow-lg"
           >
              <Search size={20} className="text-slate-200 group-hover:text-white" />
           </button>
        </div>
      </header>

      {/* Dropdown Menu */}
      <div 
        className={`fixed inset-x-0 top-0 bg-slate-950/95 backdrop-blur-2xl transition-all duration-500 z-40 flex flex-col items-center justify-center border-b border-white/10 overflow-hidden
          ${isMenuOpen ? 'h-[400px] opacity-100 pointer-events-auto shadow-[0_20px_50px_rgba(0,0,0,0.5)]' : 'h-0 opacity-0 pointer-events-none'}`}
      >
          <div className="flex flex-col gap-6 text-center pt-10">
             {navItems.map((item, idx) => (
               <button 
                 key={item.id}
                 onClick={() => scrollToSection(item.id)}
                 className={`text-3xl font-display font-bold text-white/60 hover:text-white hover:scale-110 transition-all transform duration-300 ${isMenuOpen ? 'translate-y-0 opacity-100' : '-translate-y-10 opacity-0'}`}
                 style={{ transitionDelay: `${100 + idx * 100}ms` }}
               >
                 {item.name}
               </button>
             ))}
          </div>
          <button 
            onClick={() => setIsMenuOpen(false)} 
            className="absolute top-6 right-6 p-2 rounded-full hover:bg-white/10 text-white/50 hover:text-white transition-colors"
          >
             <X size={24} />
          </button>
      </div>

      {/* Search Modal */}
      {isSearchOpen && (
        <div className="fixed inset-0 z-[60] flex items-start justify-center pt-[15vh] px-4">
           {/* Backdrop */}
           <div className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fade-in" onClick={() => setIsSearchOpen(false)}></div>
           
           {/* Modal Content */}
           <div className="relative bg-slate-900 border border-purple-500/30 p-8 rounded-2xl shadow-[0_0_50px_rgba(168,85,247,0.2)] max-w-md w-full text-center transform animate-pop-in">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
                 <Search size={32} className="text-purple-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Search Unavailable</h3>
              <p className="text-slate-400 mb-6 leading-relaxed">搜索还没有内容，联系我反馈我</p>
              
              <button 
                onClick={() => setIsSearchOpen(false)}
                className="w-full py-3 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-lg text-white font-bold hover:opacity-90 hover:scale-[1.02] transition-all shadow-lg"
              >
                Close
              </button>
           </div>
        </div>
      )}

      <style>{`
        @keyframes bob {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
        .animate-bob {
          animation: bob 3s ease-in-out infinite;
        }
        @keyframes shake {
          0%, 100% { transform: rotate(0deg); }
          25% { transform: rotate(-5deg); }
          75% { transform: rotate(5deg); }
        }
        .hover\\:animate-shake:hover {
          animation: shake 0.5s ease-in-out;
        }
        .animate-pop-in {
           animation: popIn 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
        }
        @keyframes popIn {
           from { opacity: 0; transform: scale(0.9) translateY(20px); }
           to { opacity: 1; transform: scale(1) translateY(0); }
        }
        .animate-fade-in {
           animation: fadeIn 0.3s ease-out forwards;
        }
      `}</style>
    </>
  );
};

export default Header;