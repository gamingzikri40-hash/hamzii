
import React, { useState, useMemo } from 'react';
import { GameState, UserState } from '../types';
import { MIN_BET, MAX_BET, formatIDR } from '../constants';

interface BetPanelProps {
  gameState: GameState;
  multiplier: number;
  user: UserState;
  onBet: (amount: number) => void;
  onCashOut: () => void;
}

const BetPanel: React.FC<BetPanelProps> = ({ gameState, multiplier, user, onBet, onCashOut }) => {
  const [betInput, setBetInput] = useState<number>(10000);

  const adjustBet = (amt: number) => {
    setBetInput(prev => Math.min(MAX_BET, Math.max(MIN_BET, prev + amt)));
  };

  const isWait = gameState === GameState.WAITING;
  const isFlying = gameState === GameState.FLYING;
  
  const currentStakeValue = useMemo(() => {
    return user.currentBet * multiplier;
  }, [user.currentBet, multiplier]);

  const currentProfit = useMemo(() => {
    return currentStakeValue - user.currentBet;
  }, [currentStakeValue, user.currentBet]);

  return (
    <div className="h-56 bg-[#1a1635] border-t border-white/10 flex items-center justify-center p-6 gap-8 z-40 relative">
      {/* Dynamic Background Pulse when Flying */}
      {user.betting && isFlying && (
        <div className="absolute inset-0 bg-purple-600/5 animate-pulse pointer-events-none"></div>
      )}

      <div className="flex flex-col gap-2 z-10">
        <span className="text-xs text-gray-400 font-bold uppercase tracking-widest">Jumlah Taruhan</span>
        <div className="flex items-center bg-[#0c0a1f] p-1 rounded-xl border border-white/10 shadow-inner">
          <button 
            onClick={() => adjustBet(-10000)}
            disabled={user.betting}
            className="w-10 h-10 flex items-center justify-center text-xl font-bold hover:text-purple-400 disabled:opacity-50 transition-colors"
          >
            -
          </button>
          <input 
            type="number"
            value={betInput}
            onChange={(e) => setBetInput(Number(e.target.value))}
            disabled={user.betting}
            className="w-32 bg-transparent text-center font-bold text-lg focus:outline-none"
          />
          <button 
            onClick={() => adjustBet(10000)}
            disabled={user.betting}
            className="w-10 h-10 flex items-center justify-center text-xl font-bold hover:text-purple-400 disabled:opacity-50 transition-colors"
          >
            +
          </button>
        </div>
        <div className="grid grid-cols-3 gap-2">
            {[10000, 50000, 100000].map(amt => (
                <button 
                    key={amt}
                    onClick={() => setBetInput(amt)}
                    disabled={user.betting}
                    className="text-[10px] bg-white/5 hover:bg-white/10 p-2 rounded font-bold uppercase transition-colors"
                >
                    {amt/1000}k
                </button>
            ))}
        </div>
      </div>

      <div className="h-24 w-[2px] bg-white/5"></div>

      <div className="flex-1 max-w-lg z-10">
        {!user.betting ? (
          <div className="flex flex-col gap-3">
            <button 
              onClick={() => onBet(betInput)}
              disabled={!isWait || user.balance < betInput}
              className={`w-full h-24 rounded-2xl font-orbitron text-2xl font-black uppercase transition-all shadow-2xl 
                ${isWait 
                  ? 'bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 bg-[length:200%_auto] animate-gradient-x hover:scale-[1.02] active:scale-95 text-white shadow-purple-500/20' 
                  : 'bg-gray-800 cursor-not-allowed opacity-50 text-gray-400'}
              `}
            >
              {isWait ? 'Pasang Taruhan' : 'Tunggu Putaran Berikutnya'}
            </button>
            <div className="text-center text-[10px] text-gray-500 font-bold uppercase tracking-widest">
              Taruhan akan dipasang otomatis saat putaran dimulai
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            <button 
              onClick={onCashOut}
              disabled={!isFlying}
              className={`w-full h-24 rounded-2xl font-orbitron text-2xl font-black uppercase transition-all shadow-2xl relative overflow-hidden group
                ${isFlying 
                  ? 'bg-gradient-to-r from-yellow-400 via-orange-500 to-yellow-400 bg-[length:200%_auto] animate-gradient-x hover:scale-[1.02] active:scale-95 text-black shadow-orange-500/40' 
                  : 'bg-blue-900/50 cursor-not-allowed text-white/50 border border-white/10'}
              `}
            >
              <div className="flex flex-col items-center relative z-10">
                <span className="text-sm opacity-80 mb-1">BERHENTI SEKARANG</span>
                {isFlying ? (
                  <span className="text-3xl font-black tracking-tighter">{formatIDR(currentStakeValue)}</span>
                ) : (
                  <span className="text-xl">MENUNGGU TERBANG...</span>
                )}
              </div>
              {/* Animated Inner Shine */}
              {isFlying && (
                <div className="absolute inset-0 bg-white/20 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 skew-x-12"></div>
              )}
            </button>
            
            <div className="flex justify-between px-2">
                <div className="flex flex-col">
                    <span className="text-[10px] text-gray-500 font-bold uppercase">Modal</span>
                    <span className="text-xs font-bold text-white">{formatIDR(user.currentBet)}</span>
                </div>
                {isFlying && (
                    <div className="flex flex-col items-end">
                        <span className="text-[10px] text-purple-400 font-bold uppercase">Laba Saat Ini</span>
                        <span className="text-xs font-bold text-green-400">+{formatIDR(currentProfit)}</span>
                    </div>
                )}
            </div>
          </div>
        )}
      </div>

      <div className="hidden lg:flex flex-col items-center justify-center p-4 rounded-xl bg-white/5 border border-white/10 min-w-[140px] shadow-inner z-10">
        <div className="flex items-center gap-1 mb-1">
          <div className="w-2 h-2 rounded-full bg-purple-500 animate-pulse"></div>
          <span className="text-[10px] text-gray-400 font-bold uppercase">Total Skor</span>
        </div>
        <span className="text-3xl font-orbitron font-bold text-transparent bg-clip-text bg-gradient-to-br from-white to-purple-400">
            {user.score.toLocaleString()}
        </span>
      </div>

      <style>{`
        @keyframes gradient-x {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .animate-gradient-x {
          animation: gradient-x 3s ease infinite;
        }
      `}</style>
    </div>
  );
};

export default BetPanel;
