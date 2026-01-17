
import React from 'react';
import { formatIDR } from '../constants';

interface HeaderProps {
  balance: number;
  onOpenDeposit: () => void;
  onOpenWithdraw: () => void;
}

const Header: React.FC<HeaderProps> = ({ balance, onOpenDeposit, onOpenWithdraw }) => {
  return (
    <header className="h-16 bg-[#1a1635] border-b border-white/10 flex items-center justify-between px-6 z-50">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center border-2 border-purple-400">
            <span className="text-xl font-bold">S</span>
        </div>
        <h1 className="text-2xl font-orbitron font-bold tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">
          SPACEMAN
        </h1>
      </div>

      <div className="flex items-center gap-4">
        <div className="bg-[#0c0a1f] px-4 py-2 rounded-lg border border-white/20 flex flex-col items-end min-w-[150px]">
          <span className="text-[10px] text-gray-400 uppercase font-bold tracking-widest">Saldo IDR</span>
          <span className="text-lg font-bold text-yellow-400 leading-none">{formatIDR(balance)}</span>
        </div>
        <button 
          onClick={onOpenDeposit}
          className="bg-green-600 hover:bg-green-500 text-white font-bold py-2 px-6 rounded-lg transition shadow-lg shadow-green-900/20 uppercase text-sm"
        >
          Deposit
        </button>
        <button 
          onClick={onOpenWithdraw}
          className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 px-6 rounded-lg transition shadow-lg shadow-blue-900/20 uppercase text-sm"
        >
          Withdraw
        </button>
      </div>
    </header>
  );
};

export default Header;
