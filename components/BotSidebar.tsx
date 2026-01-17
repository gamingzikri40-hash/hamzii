
import React, { useState, useEffect, useMemo } from 'react';
import { GameState, Bot } from '../types';
import { INDO_NAMES, AVATARS, MAX_BOTS, sensorName, formatIDR } from '../constants';

interface BotSidebarProps {
  gameState: GameState;
  multiplier: number;
}

const BotSidebar: React.FC<BotSidebarProps> = ({ gameState, multiplier }) => {
  const [bots, setBots] = useState<Bot[]>([]);
  const [initialTotalBet, setInitialTotalBet] = useState(0);

  // Initialize bots
  useEffect(() => {
    const initialBots: Bot[] = [];
    for (let i = 0; i < 50; i++) {
      const name = INDO_NAMES[Math.floor(Math.random() * INDO_NAMES.length)];
      const suffix = Math.floor(Math.random() * 9999);
      initialBots.push({
        id: i,
        name: `${name}${suffix}`,
        avatar: AVATARS[Math.floor(Math.random() * AVATARS.length)],
        isCashedOut: false,
        betAmount: Math.floor(Math.random() * 500000) + 10000,
        cashOutAt: parseFloat((Math.random() * 5 + 1.1).toFixed(2))
      });
    }
    setBots(initialBots);
  }, []);

  // Round Logic for Bots
  useEffect(() => {
    if (gameState === GameState.WAITING) {
      const newInitialTotal = Math.floor(Math.random() * 50000000) + 100000000;
      setInitialTotalBet(newInitialTotal);
      setBots(prev => prev.map(b => ({
        ...b,
        isCashedOut: false,
        betAmount: Math.floor(Math.random() * 2000000) + 5000,
        cashOutAt: parseFloat((Math.random() * 10 + 1.1).toFixed(2))
      })));
    }
  }, [gameState]);

  // Cash out bots as multiplier grows
  useEffect(() => {
    if (gameState === GameState.FLYING) {
      setBots(prev => prev.map(b => {
        if (!b.isCashedOut && b.cashOutAt && multiplier >= b.cashOutAt) {
          return { ...b, isCashedOut: true };
        }
        return b;
      }));
    }
  }, [gameState, multiplier]);

  // Calculate dynamic values
  const currentTotalPot = useMemo(() => {
    if (gameState === GameState.WAITING) return initialTotalBet;
    if (gameState === GameState.CRASHED) return initialTotalBet * multiplier;
    // Pot grows proportionally with the multiplier for those still in
    return initialTotalBet * multiplier;
  }, [gameState, initialTotalBet, multiplier]);

  const activeCount = useMemo(() => {
    if (gameState === GameState.WAITING) return MAX_BOTS;
    const cashedCount = bots.filter(b => b.isCashedOut).length;
    const ratio = 1 - (cashedCount / bots.length);
    return Math.max(0, Math.floor(MAX_BOTS * ratio));
  }, [gameState, bots]);

  return (
    <div className="w-80 bg-[#161331] border-r border-white/5 flex flex-col">
      <div className="p-4 bg-[#1a1635] border-b border-white/10 shadow-lg relative z-10">
        <div className="flex justify-between items-center mb-1">
          <span className="text-xs text-gray-400 uppercase font-bold">Total Pemain</span>
          <span className="text-sm font-bold text-green-400">{activeCount.toLocaleString()} / {MAX_BOTS}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-xs text-gray-400 uppercase font-bold">Total Taruhan</span>
          <span className="text-lg font-orbitron font-bold text-yellow-500 transition-all duration-75">
            {formatIDR(currentTotalPot)}
          </span>
        </div>
        {gameState === GameState.FLYING && (
          <div className="mt-2 h-1 bg-white/5 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-yellow-500 to-orange-500 transition-all duration-500" 
              style={{ width: `${Math.min(100, (multiplier / 5) * 100)}%` }}
            ></div>
          </div>
        )}
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar p-2 space-y-2">
        {bots.map((bot) => {
          // Dynamic display: if not cashed out, show current potential value
          const currentDisplayAmount = bot.isCashedOut 
            ? bot.betAmount * (bot.cashOutAt || 1) 
            : bot.betAmount * multiplier;

          return (
            <div 
              key={bot.id} 
              className={`flex items-center justify-between p-2 rounded transition-colors duration-150 ${
                bot.isCashedOut 
                  ? 'bg-green-500/10 border border-green-500/30' 
                  : 'bg-[#0c0a1f]/50 border border-white/5'
              }`}
            >
              <div className="flex items-center gap-2">
                <img src={bot.avatar} className="w-8 h-8 rounded-full border border-white/10" alt="av" />
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-gray-200">{sensorName(bot.name)}</span>
                  <span className={`text-[9px] uppercase font-bold ${bot.isCashedOut ? 'text-green-400' : 'text-purple-400'}`}>
                    {bot.isCashedOut ? 'SUDAH BERHENTI' : 'SEDANG TERBANG'}
                  </span>
                </div>
              </div>
              <div className="flex flex-col items-end">
                <span className={`text-xs font-bold transition-all duration-75 ${bot.isCashedOut ? 'text-green-400' : 'text-white'}`}>
                  {Math.floor(currentDisplayAmount).toLocaleString()}
                </span>
                {bot.isCashedOut && (
                  <span className="text-[10px] text-green-400 font-bold bg-green-500/20 px-1 rounded">{bot.cashOutAt}x</span>
                )}
                {!bot.isCashedOut && gameState === GameState.FLYING && (
                  <span className="text-[10px] text-purple-400 font-bold animate-pulse">+{formatIDR(currentDisplayAmount - bot.betAmount)}</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default BotSidebar;
