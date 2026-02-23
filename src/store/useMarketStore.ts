import { create } from 'zustand';
import { MarketState, Stock, MarketEvent, NewsItem } from '../types';
import { parseStocks, parseEvents } from '../utils/dataParser';
import { rawStocksData } from '../data/rawStocks';
import { rawEventsData } from '../data/rawEvents';

interface MarketStore extends MarketState {
  initMarket: () => void;
  togglePlay: () => void;
  setSpeed: (speed: number) => void;
  nextDay: () => void;
  tick: () => void;
  reset: () => void;
  setSelectedStock: (stock: Stock | null) => void;
}

const INITIAL_INDEX = 5000.00;
const TICK_MINUTES = 10;
const MARKET_START_HOUR = 9;
const MARKET_END_HOUR = 13;
const MARKET_END_MINUTE = 30;

const getMarketStatus = (time: Date) => {
  const hour = time.getHours();
  const minute = time.getMinutes();
  const totalMinutes = hour * 60 + minute;
  const startMinutes = MARKET_START_HOUR * 60;
  const endMinutes = MARKET_END_HOUR * 60 + MARKET_END_MINUTE;
  
  if (totalMinutes < startMinutes) return 'Pre-Market';
  if (totalMinutes > endMinutes) return 'Closed';
  return 'Open';
};

export const useMarketStore = create<MarketStore>((set, get) => ({
  currentTime: new Date(new Date().setHours(9, 0, 0, 0)),
  isPlaying: false,
  speed: 1,
  index: INITIAL_INDEX,
  baseIndex: 0, // Calculated on init
  stocks: [],
  events: [],
  activeEvents: [],
  news: [],
  limitUpCount: 0,
  limitDownCount: 0,
  attentionCount: 0,
  dispositionCount: 0,
  weightedStocks: [],
  selectedStock: null,
  nextAdjustmentDate: new Date(new Date().setDate(new Date().getDate() + 30)),

  setSelectedStock: (stock) => set({ selectedStock: stock }),

  initMarket: () => {
    const stocks = parseStocks(rawStocksData);
    const events = parseEvents(rawEventsData);
    
    // Calculate initial base index
    // Index = (Sum(Price * Shares) / BaseValue) * 5000
    // BaseValue = Sum(Price * Shares) initially
    let totalMarketValue = 0;
    stocks.forEach(s => {
      totalMarketValue += s.currentPrice * s.totalShares;
    });
    
    // Select top 300 by volume (using capital/shares as proxy for now since volume is 0)
    // Actually, prompt says "top 300 by trading volume". Initially volume is 0.
    // We'll use market cap for initial weight or just pick top 300 by market cap.
    const sortedByCap = [...stocks].sort((a, b) => b.marketCap - a.marketCap);
    const weightedStocks = sortedByCap.slice(0, 300).map(s => s.id);

    set({
      stocks,
      events,
      baseIndex: totalMarketValue,
      index: INITIAL_INDEX,
      weightedStocks,
      currentTime: new Date(new Date().setHours(9, 0, 0, 0)),
    });
  },

  togglePlay: () => set(state => ({ isPlaying: !state.isPlaying })),
  
  setSpeed: (speed) => set({ speed }),

  nextDay: () => {
    set(state => {
      const nextDate = new Date(state.currentTime);
      nextDate.setDate(nextDate.getDate() + 1);
      nextDate.setHours(9, 0, 0, 0);
      
      const newStocks = state.stocks.map(stock => {
        let attentionDays = stock.attentionDays;
        let isDisposition = stock.isDisposition;
        let dispositionDaysLeft = stock.dispositionDaysLeft;

        // Check Attention Status from previous day
        if (stock.isAttention) {
          attentionDays++;
        } else {
          attentionDays = 0;
        }

        // Check Disposition Trigger
        if (attentionDays >= 3 && !isDisposition) {
          isDisposition = true;
          dispositionDaysLeft = Math.floor(Math.random() * 3) + 3; // 3-5 days
          attentionDays = 0; // Reset attention counter? Or keep it? Usually reset.
        }

        // Handle Disposition Expiry
        if (isDisposition) {
          dispositionDaysLeft--;
          if (dispositionDaysLeft <= 0) {
            isDisposition = false;
          }
        }

        return {
          ...stock,
          openPrice: stock.currentPrice,
          highPrice: stock.currentPrice,
          lowPrice: stock.currentPrice,
          previousClose: stock.currentPrice,
          volume: 0,
          change: 0,
          changePercent: 0,
          isLimitUp: false,
          isLimitDown: false,
          isAttention: false, // Reset for new day calculation
          attentionDays,
          isDisposition,
          dispositionDaysLeft
        };
      });

      return {
        currentTime: nextDate,
        stocks: newStocks,
        isPlaying: false,
        activeEvents: [],
      };
    });
  },

  tick: () => {
    const { stocks, events, activeEvents, currentTime, baseIndex, weightedStocks, news } = get();
    
    // Advance time
    const newTime = new Date(currentTime.getTime() + TICK_MINUTES * 60000);
    
    if (getMarketStatus(newTime) === 'Closed') {
      set({ isPlaying: false, currentTime: newTime });
      return;
    }

    // Random Event Trigger (0-2 per day)
    let newActiveEvents = [...activeEvents];
    let newNews = [...news];
    
    if (activeEvents.length < 2 && Math.random() < 0.05) {
      const randomEvent = events[Math.floor(Math.random() * events.length)];
      if (randomEvent) {
        newActiveEvents.push(randomEvent);
        newNews.unshift({
          id: Date.now().toString(),
          time: newTime.toLocaleTimeString(),
          title: `[${randomEvent.type}] ${randomEvent.description}`,
          content: `${randomEvent.scope} Impact: ${randomEvent.impact}%`,
          type: 'Event'
        });
      }
    }

    // Update Stocks
    let totalWeightedValue = 0;
    let limitUp = 0;
    let limitDown = 0;
    let attention = 0;
    let disposition = 0;

    const newStocks = stocks.map(stock => {
      // 1. Base Volatility
      let change = (Math.random() - 0.5) * 0.02 * stock.currentPrice; // +/- 1% base
      
      // 2. Event Impact
      newActiveEvents.forEach(e => {
        if (e.scope === 'Global') change += (e.impact / 100) * stock.currentPrice * 0.1;
        if (e.scope === 'Sector' && e.type === stock.category) change += (e.impact / 100) * stock.currentPrice * 0.1;
        if (e.scope === 'Individual' && e.id === stock.id) change += (e.impact / 100) * stock.currentPrice * 0.2;
      });

      // 3. Apply Change
      let newPrice = stock.currentPrice + change;
      
      // 4. Limits (+/- 10%)
      const limitUpPrice = stock.previousClose * 1.10;
      const limitDownPrice = stock.previousClose * 0.90;
      
      if (newPrice >= limitUpPrice) {
        newPrice = limitUpPrice;
        stock.isLimitUp = true;
      } else {
        stock.isLimitUp = false;
      }
      
      if (newPrice <= limitDownPrice) {
        newPrice = limitDownPrice;
        stock.isLimitDown = true;
      } else {
        stock.isLimitDown = false;
      }

      // 5. Volume Simulation
      let newVolume = Math.floor(Math.random() * 100); 
      if (stock.isDisposition) {
        newVolume = Math.floor(newVolume * 0.5); // 50% reduction
      }
      
      // 6. Attention Logic (+/- 7%)
      const changePct = ((newPrice - stock.previousClose) / stock.previousClose) * 100;
      if (Math.abs(changePct) > 7) {
        stock.isAttention = true;
      } else {
        stock.isAttention = false;
      }

      // 7. Update History
      const newHistory = [...stock.history, {
        time: newTime.toLocaleTimeString(),
        price: newPrice,
        volume: newVolume
      }];

      // Stats
      if (stock.isLimitUp) limitUp++;
      if (stock.isLimitDown) limitDown++;
      if (stock.isAttention) attention++;
      if (stock.isDisposition) disposition++;

      // Weighted Calculation
      if (weightedStocks.includes(stock.id)) {
        totalWeightedValue += newPrice * stock.totalShares;
      }

      return {
        ...stock,
        currentPrice: newPrice,
        highPrice: Math.max(stock.highPrice, newPrice),
        lowPrice: Math.min(stock.lowPrice, newPrice),
        volume: stock.volume + newVolume,
        change: newPrice - stock.previousClose,
        changePercent: changePct,
        history: newHistory,
        isAttention: stock.isAttention // Ensure this is updated in state
      };
    });

    // Calculate Index
    const baseDivisor = get().baseIndex / 5000;
    const newIndex = totalWeightedValue / baseDivisor;

    set({
      currentTime: newTime,
      stocks: newStocks,
      activeEvents: newActiveEvents,
      news: newNews,
      index: newIndex,
      limitUpCount: limitUp,
      limitDownCount: limitDown,
      attentionCount: attention,
      dispositionCount: disposition
    });
  },

  reset: () => {
    get().initMarket();
  }
}));
