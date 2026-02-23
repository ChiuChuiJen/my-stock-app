export interface Stock {
  id: string;
  name: string;
  category: string;
  capital: number; // 萬
  initialPrice: number;
  totalShares: number; // 股
  marketCap: number;
  peRatio: number;
  pbRatio: number;
  nav: number; // 每股淨值
  eps: number;
  yieldRate: number;
  description: string;
  
  // Dynamic Data
  currentPrice: number;
  openPrice: number;
  highPrice: number;
  lowPrice: number;
  previousClose: number;
  volume: number;
  change: number;
  changePercent: number;
  
  // Status
  isLimitUp: boolean;
  isLimitDown: boolean;
  isAttention: boolean; // 注意股
  isDisposition: boolean; // 處置股
  dispositionDaysLeft: number;
  attentionDays: number; // Consecutive days
  
  // Chips
  foreignBuy: number;
  dealerBuy: number;
  investmentTrustBuy: number;
  retailBuy: number;
  
  history: PricePoint[];
}

export interface PricePoint {
  time: string;
  price: number;
  volume: number;
}

export interface MarketEvent {
  id: string;
  scope: 'Individual' | 'Sector' | 'Global';
  nature: 'Bullish' | 'Bearish';
  source: 'Domestic' | 'International';
  rarity: 'Common' | 'Major' | 'BlackSwan';
  trigger: 'Daily' | 'Quarterly' | 'Conditional';
  condition?: string;
  type: string;
  impact: number; // Percentage
  description: string;
}

export interface MarketState {
  currentTime: Date;
  isPlaying: boolean;
  speed: number; // 1x, 2x, 5x, 10x
  index: number;
  baseIndex: number; // For calculation
  stocks: Stock[];
  events: MarketEvent[];
  activeEvents: MarketEvent[];
  news: NewsItem[];
  
  // Stats
  limitUpCount: number;
  limitDownCount: number;
  attentionCount: number;
  dispositionCount: number;
  selectedStock?: Stock | null;
  
  // Weighted Stocks
  weightedStocks: string[]; // IDs of top 300
  nextAdjustmentDate: Date;
}

export interface NewsItem {
  id: string;
  time: string;
  title: string;
  content: string;
  type: 'Event' | 'Announcement' | 'System';
}
