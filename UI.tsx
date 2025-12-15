import React from 'react';
import { useStore } from '../store';
import { Sparkles, Trees, RotateCcw } from 'lucide-react';

export const UI: React.FC = () => {
  const { mode, toggleMode } = useStore();

  return (
    <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-8 z-10">
      
      {/* Header */}
      <div className="flex flex-col items-center pt-8">
        <h1 className="font-cinzel text-5xl text-transparent bg-clip-text bg-gradient-to-b from-[#FFF5D6] to-[#C5A059] drop-shadow-[0_2px_10px_rgba(255,215,0,0.5)] tracking-widest uppercase">
          Arix
        </h1>
        <div className="h-[1px] w-24 bg-gradient-to-r from-transparent via-[#C5A059] to-transparent mt-4 mb-2"></div>
        <p className="font-serif-display text-[#E0BFB8] text-sm tracking-[0.3em] uppercase opacity-80">
          Signature Collection
        </p>
      </div>

      {/* Bottom Controls */}
      <div className="flex flex-col items-center pb-12 gap-6 pointer-events-auto">
        <p className="text-[#8FBC8F] font-serif-display italic text-lg opacity-80 max-w-md text-center">
            {mode === 'TREE_SHAPE' 
                ? "The convergence of elegance." 
                : "Chaos awaits structure."}
        </p>

        <button 
          onClick={toggleMode}
          className="group relative px-8 py-3 bg-[#022112]/80 backdrop-blur-sm border border-[#C5A059]/30 rounded-full transition-all duration-700 hover:bg-[#046307]/50 hover:border-[#C5A059] hover:shadow-[0_0_30px_rgba(197,160,89,0.3)] overflow-hidden"
        >
            {/* Button Shine Effect */}
            <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-[#C5A059]/10 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
            
            <div className="flex items-center gap-3 text-[#FFF5D6]">
                {mode === 'SCATTERED' ? (
                    <>
                        <Trees className="w-5 h-5 text-[#C5A059]" />
                        <span className="font-cinzel tracking-widest text-sm">Assemble</span>
                    </>
                ) : (
                    <>
                        <Sparkles className="w-5 h-5 text-[#C5A059]" />
                        <span className="font-cinzel tracking-widest text-sm">Disperse</span>
                    </>
                )}
            </div>
        </button>
      </div>

      {/* Decorative Corners */}
      <div className="absolute top-0 left-0 p-8">
         <div className="w-16 h-16 border-t border-l border-[#C5A059]/20"></div>
      </div>
      <div className="absolute top-0 right-0 p-8">
         <div className="w-16 h-16 border-t border-r border-[#C5A059]/20"></div>
      </div>
      <div className="absolute bottom-0 left-0 p-8">
         <div className="w-16 h-16 border-b border-l border-[#C5A059]/20"></div>
      </div>
      <div className="absolute bottom-0 right-0 p-8">
         <div className="w-16 h-16 border-b border-r border-[#C5A059]/20"></div>
      </div>
    </div>
  );
};

// Add shimmer animation to tailwind config dynamically in a real setup, 
// but for this snippet we assume standard tailwind. 
// We can simulate shimmer with css directly in index.html if needed, 
// or rely on standard transitions.
