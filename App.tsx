
import React, { useState, useEffect, useCallback, useRef } from 'react';
import Header from './components/Header';
import GameCanvas from './components/GameCanvas';
import BetPanel from './components/BetPanel';
import BotSidebar from './components/BotSidebar';
import { GameState, UserState, HistoryItem } from './types';
import { INITIAL_BALANCE } from './constants';
import DepositWithdrawModal from './components/DepositWithdrawModal';

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>(GameState.WAITING);
  const [multiplier, setMultiplier] = useState<number>(1.00);
  const [countdown, setCountdown] = useState<number>(10);
  const [user, setUser] = useState<UserState>({
    balance: INITIAL_BALANCE,
    currentBet: 0,
    betting: false,
    score: 0,
    history: []
  });
  const [modalOpen, setModalOpen] = useState<'deposit' | 'withdraw' | null>(null);
  
  // Game Logic Ref
  const crashPointRef = useRef<number>(1.00);
  const flightTimerRef = useRef<number | null>(null);

  const startNewRound = useCallback(() => {
    setGameState(GameState.WAITING);
    setCountdown(10);
    setMultiplier(1.00);
    crashPointRef.current = calculateCrashPoint();
  }, []);

  const calculateCrashPoint = () => {
    const r = Math.random();
    // typical crash curve: 1/(1-p) with house edge
    if (r < 0.03) return 1.00; // Instant crash 3%
    return parseFloat((1 / (1 - r * 0.97)).toFixed(2));
  };

  useEffect(() => {
    let timer: any;
    if (gameState === GameState.WAITING) {
      timer = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            setGameState(GameState.FLYING);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else if (gameState === GameState.FLYING) {
      const startTime = Date.now();
      timer = setInterval(() => {
        const elapsed = (Date.now() - startTime) / 1000;
        // Exponential growth: 1.01^(elapsed*5) or similar
        const nextMult = parseFloat(Math.pow(1.08, elapsed).toFixed(2));
        
        if (nextMult >= crashPointRef.current) {
          setMultiplier(crashPointRef.current);
          setGameState(GameState.CRASHED);
          clearInterval(timer);
          
          // Add to history
          const h: HistoryItem = {
            id: Math.random().toString(),
            multiplier: crashPointRef.current,
            time: new Date()
          };
          setUser(prev => ({ ...prev, history: [h, ...prev.history].slice(0, 20) }));
          
          // Reset after 3 seconds
          setTimeout(startNewRound, 3000);
        } else {
          setMultiplier(nextMult);
        }
      }, 50);
    }
    return () => clearInterval(timer);
  }, [gameState, startNewRound]);

  const handleBet = (amount: number) => {
    if (user.balance >= amount && !user.betting && gameState === GameState.WAITING) {
      setUser(prev => ({
        ...prev,
        balance: prev.balance - amount,
        currentBet: amount,
        betting: true
      }));
    }
  };

  const handleCashOut = () => {
    if (user.betting && gameState === GameState.FLYING) {
      const winAmount = user.currentBet * multiplier;
      setUser(prev => ({
        ...prev,
        balance: prev.balance + winAmount,
        betting: false,
        score: prev.score + Math.floor(multiplier * 100)
      }));
      // In real game you continue watching, but for user the "betting" state ends
    }
  };

  return (
    <div className="flex flex-col h-screen w-full bg-[#0c0a1f] relative overflow-hidden">
      <Header 
        balance={user.balance} 
        onOpenDeposit={() => setModalOpen('deposit')}
        onOpenWithdraw={() => setModalOpen('withdraw')}
      />
      
      <main className="flex flex-1 overflow-hidden">
        <BotSidebar gameState={gameState} multiplier={multiplier} />
        
        <div className="flex-1 flex flex-col relative">
          <GameCanvas 
            gameState={gameState} 
            multiplier={multiplier} 
            countdown={countdown} 
            history={user.history}
          />
          
          <BetPanel 
            gameState={gameState}
            multiplier={multiplier}
            user={user}
            onBet={handleBet}
            onCashOut={handleCashOut}
          />
        </div>
      </main>

      {modalOpen && (
        <DepositWithdrawModal 
          type={modalOpen} 
          onClose={() => setModalOpen(null)} 
          onConfirm={(amt) => {
            if (modalOpen === 'deposit') {
              setUser(p => ({ ...p, balance: p.balance + amt }));
            } else {
              setUser(p => ({ ...p, balance: Math.max(0, p.balance - amt) }));
            }
            setModalOpen(null);
          }}
        />
      )}
    </div>
  );
};

export default App;
