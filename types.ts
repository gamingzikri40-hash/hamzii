
export enum GameState {
  WAITING = 'WAITING',
  FLYING = 'FLYING',
  CRASHED = 'CRASHED'
}

export interface Bot {
  id: number;
  name: string;
  avatar: string;
  isCashedOut: boolean;
  betAmount: number;
  cashOutAt?: number;
}

export interface HistoryItem {
  id: string;
  multiplier: number;
  time: Date;
}

export interface UserState {
  balance: number;
  currentBet: number;
  betting: boolean;
  score: number;
  history: HistoryItem[];
}
