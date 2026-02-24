
export interface Stock {
  code: string;
  name: string;
  sector: string;
  capital: number; // 萬
  initialPrice: number;
  totalShares: number; // 股
  marketCap: number;
  pe: number;
  pb: number;
  nav: number;
  eps: number;
  yield: number; // percentage
  description: string;
  
  // Dynamic Data
  currentPrice: number;
  openPrice: number;
  highPrice: number;
  lowPrice: number;
  volume: number;
  change: number;
  changePercent: number;
  history: { time: string; price: number; volume: number }[];
  dailyHistory: { date: string; open: number; high: number; low: number; close: number; volume: number }[];
  
  // Status
  isWeighted: boolean;
  weight: number; // Weight in index
  status: 'Normal' | 'Attention' | 'Discarded';
  attentionDays: number; // Consecutive days as attention stock
  discardedDaysLeft: number;
}

export interface MarketEvent {
  id: string;
  scope: '個股' | '類股' | '全體';
  nature: '利多' | '利空';
  source: '國內事件' | '國外事件';
  rarity: '普通' | '重大' | '黑天鵝';
  trigger: string;
  type: string;
  impact: number; // percentage
  content: string;
}

export interface MarketState {
  date: string;
  time: string; // HH:mm
  index: number;
  initialIndex: number;
  change: number;
  changePercent: number;
  volume: number;
  isRunning: boolean;
  speed: number;
  autoProcess: boolean;
  activeEvents: MarketEvent[];
  logs: { time: string; message: string; type: 'info' | 'alert' | 'news' }[];
}
