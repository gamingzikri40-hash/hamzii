
import React, { useState } from 'react';
import { formatIDR } from '../constants';

interface ModalProps {
  type: 'deposit' | 'withdraw';
  onClose: () => void;
  onConfirm: (amount: number) => void;
}

const DepositWithdrawModal: React.FC<ModalProps> = ({ type, onClose, onConfirm }) => {
  const [amount, setAmount] = useState<number>(50000);

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
      <div className="bg-[#1a1635] w-full max-w-md rounded-3xl border border-white/10 shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="p-6 border-b border-white/10 flex justify-between items-center">
          <h2 className="text-2xl font-orbitron font-bold uppercase tracking-tighter">
            {type === 'deposit' ? 'Top Up Saldo' : 'Tarik Dana'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white text-2xl">&times;</button>
        </div>
        
        <div className="p-8 space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-400 uppercase">Jumlah (IDR)</label>
            <input 
              type="number"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              className="w-full bg-[#0c0a1f] border border-white/10 rounded-xl p-4 text-2xl font-bold focus:border-purple-500 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-3 gap-2">
            {[50000, 100000, 500000, 1000000, 2000000, 5000000].map(val => (
              <button 
                key={val}
                onClick={() => setAmount(val)}
                className="bg-white/5 hover:bg-purple-600/30 border border-white/5 rounded-lg py-2 text-xs font-bold transition"
              >
                {formatIDR(val)}
              </button>
            ))}
          </div>

          <button 
            onClick={() => onConfirm(amount)}
            className={`w-full py-4 rounded-xl font-bold text-xl uppercase transition shadow-lg
              ${type === 'deposit' ? 'bg-green-600 hover:bg-green-500' : 'bg-blue-600 hover:bg-blue-500'}
            `}
          >
            Confirm {type}
          </button>
          
          <p className="text-[10px] text-gray-500 text-center uppercase tracking-widest font-bold">
            Metode Pembayaran: Bank Transfer, E-Wallet (OVO/DANA/GOPAY)
          </p>
        </div>
      </div>
    </div>
  );
};

export default DepositWithdrawModal;
