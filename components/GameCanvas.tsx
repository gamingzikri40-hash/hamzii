
import React from 'react';
import { GameState, HistoryItem } from '../types';

interface GameCanvasProps {
  gameState: GameState;
  multiplier: number;
  countdown: number;
  history: HistoryItem[];
}

const GameCanvas: React.FC<GameCanvasProps> = ({ gameState, multiplier, countdown, history }) => {
  const getAstronoutPosition = () => {
    if (gameState === GameState.WAITING) return 'bottom-10 left-1/2 -translate-x-1/2';
    if (gameState === GameState.CRASHED) return 'bottom-1/2 left-1/2 -translate-x-1/2 scale-150 opacity-0 transition-all duration-500';
    
    // Smooth flying up
    const progress = Math.min(multiplier, 10) / 10;
    const y = 10 + progress * 60;
    return `bottom-[${y}%] left-1/2 -translate-x-1/2`;
  };

  return (
    <div className="flex-1 relative overflow-hidden bg-gradient-to-b from-[#05040d] via-[#100d2b] to-[#1a1635]">
      {/* Background Layers */}
      <div className="star-layer" style={{ animationDuration: '40s', opacity: 0.3 }}></div>
      <div className="star-layer" style={{ animationDuration: '20s', opacity: 0.5, transform: 'scale(1.5)' }}></div>
      
      {/* Planet / Space Decorations */}
      <div className={`absolute transition-all duration-1000 ${gameState === GameState.FLYING ? 'top-[120%]' : 'top-[80%]'} left-[10%] w-48 h-48 bg-blue-900 rounded-full blur-2xl opacity-20`}></div>
      <div className={`absolute transition-all duration-5000 ${gameState === GameState.FLYING ? 'top-[-50%]' : 'top-[20%]'} right-[15%] w-32 h-32 bg-orange-600 rounded-full shadow-[0_0_50px_rgba(234,88,12,0.5)]`}></div>
      
      {/* History Bar */}
      <div className="absolute top-4 left-4 flex gap-2 overflow-x-auto max-w-[80%] pb-2 z-10">
        {history.map((h) => (
          <div 
            key={h.id} 
            className={`px-3 py-1 rounded-full text-xs font-bold border ${h.multiplier >= 2 ? 'bg-purple-600/30 border-purple-500 text-purple-300' : 'bg-blue-900/30 border-blue-500 text-blue-300'}`}
          >
            {h.multiplier.toFixed(2)}x
          </div>
        ))}
      </div>

      {/* Multiplier / Countdown Display */}
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-20">
        {gameState === GameState.WAITING && (
          <div className="flex flex-col items-center animate-bounce">
            <span className="text-xl uppercase tracking-widest text-purple-400 font-bold mb-2">Next Round In</span>
            <span className="text-8xl font-orbitron font-bold text-white shadow-lg">{countdown}s</span>
          </div>
        )}
        
        {gameState === GameState.FLYING && (
          <div className="flex flex-col items-center scale-110">
            <span className="text-9xl font-orbitron font-black text-white drop-shadow-[0_0_20px_rgba(168,85,247,0.8)]">
              {multiplier.toFixed(2)}x
            </span>
          </div>
        )}

        {gameState === GameState.CRASHED && (
          <div className="flex flex-col items-center animate-pulse">
            <span className="text-5xl font-orbitron font-bold text-red-500 mb-2 uppercase italic tracking-tighter">Crashed!</span>
            <span className="text-7xl font-orbitron font-bold text-white">{multiplier.toFixed(2)}x</span>
          </div>
        )}
      </div>

      {/* The Spaceman / Rocket */}
      <div 
        className={`absolute transition-all duration-100 ease-linear ${getAstronoutPosition()} z-30`}
        style={{
            bottom: gameState === GameState.FLYING ? `${Math.min(10 + (multiplier - 1) * 5, 70)}%` : gameState === GameState.WAITING ? '10%' : '50%'
        }}
      >
        <div className="relative group">
            {/* Engine Glow */}
            {gameState === GameState.FLYING && (
                <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-8 h-20 bg-gradient-to-t from-transparent via-blue-500 to-white blur-md animate-pulse"></div>
            )}
            
            {/* Spaceman Cartoon Visual */}
            <div className={`w-24 h-24 animate-float`}>
                <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-2xl">
                    {/* Simplified Rocket/Astronaut Hybrid */}
                    <path d="M50 5 L30 40 L30 80 L70 80 L70 40 Z" fill="#e2e8f0" stroke="#1e293b" strokeWidth="2" />
                    <rect x="35" y="80" width="10" height="15" fill="#334155" />
                    <rect x="55" y="80" width="10" height="15" fill="#334155" />
                    <circle cx="50" cy="35" r="10" fill="#94a3b8" />
                    <path d="M30 50 L10 75 L30 75 Z" fill="#ef4444" />
                    <path d="M70 50 L90 75 L70 75 Z" fill="#ef4444" />
                </svg>
            </div>
        </div>
      </div>
      
      {/* Earth Surface (Ground) */}
      <div 
        className={`absolute bottom-0 w-full h-[15%] transition-transform duration-1000 ${gameState === GameState.FLYING ? 'translate-y-full' : 'translate-y-0'}`}
        style={{ background: 'linear-gradient(to top, #1e3a8a, #3b82f6)' }}
      >
        <div className="absolute top-0 w-full h-4 bg-white/20 blur-sm"></div>
      </div>
    </div>
  );
};

export default GameCanvas;
