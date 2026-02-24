import { useState, useEffect, useRef, useCallback } from 'react';
import { Stock, MarketEvent, MarketState } from '../types';
import { rawStocksData } from '../data/rawStocks';
import { rawEventsData } from '../data/rawEvents';
import { parseStocks, parseEvents } from '../utils/dataParser';
import { generateRandomNormal, addMinutes } from '../utils/simulationUtils';

const TICK_INTERVAL_MS = 1000; // 基礎時間間隔 (1秒)

/**
 * 市場模擬核心 Hook
 * 負責處理時間推進、股價波動、事件觸發及狀態管理
 */
export const useMarketSimulation = () => {
  // --- 狀態管理 ---
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [events, setEvents] = useState<MarketEvent[]>([]);
  const [marketState, setMarketState] = useState<MarketState>({
    date: new Date().toISOString().split('T')[0],
    time: '09:00',
    index: 10000,
    initialIndex: 10000,
    change: 0,
    changePercent: 0,
    volume: 0,
    isRunning: true,
    speed: 1,
    autoProcess: true,
    activeEvents: [],
    logs: [],
  });

  // 使用 Ref 避免閉包問題，確保在 setInterval 中能存取最新狀態
  const stateRef = useRef(marketState);
  const stocksRef = useRef<Stock[]>([]);
  
  // 同步 Ref 與 State
  useEffect(() => {
    stateRef.current = marketState;
  }, [marketState]);
  
  useEffect(() => {
    stocksRef.current = stocks;
  }, [stocks]);

  // --- 初始化 ---
  useEffect(() => {
    const parsedStocks = parseStocks(rawStocksData);
    const parsedEvents = parseEvents(rawEventsData);
    
    // 計算初始權值 (依資本額排序前300大)
    const sortedByCap = [...parsedStocks].sort((a, b) => b.capital - a.capital);
    const top300 = sortedByCap.slice(0, 300);
    const totalCap = top300.reduce((sum, s) => sum + s.marketCap, 0);
    
    parsedStocks.forEach(stock => {
      const inTop300 = top300.find(s => s.code === stock.code);
      if (inTop300) {
        stock.isWeighted = true;
        stock.weight = stock.marketCap / totalCap;
      }
    });

    setStocks(parsedStocks);
    setEvents(parsedEvents);
    stocksRef.current = parsedStocks;
    
    addLog('系統初始化完成', 'info');
  }, []);

  // --- 輔助函式 ---

  // 新增日誌
  const addLog = useCallback((message: string, type: 'info' | 'alert' | 'news' = 'info') => {
    setMarketState(prev => ({
      ...prev,
      logs: [{ time: prev.time, message, type }, ...prev.logs].slice(0, 50)
    }));
  }, []);

  // 計算加權指數
  const calculateIndex = useCallback((currentStocks: Stock[]) => {
    let weightedSum = 0;
    let totalWeight = 0;
    
    currentStocks.forEach(stock => {
      if (stock.isWeighted) {
        weightedSum += stock.currentPrice * stock.totalShares;
        totalWeight += stock.initialPrice * stock.totalShares;
      }
    });
    
    if (totalWeight === 0) return 10000;
    return (weightedSum / totalWeight) * 10000;
  }, []);

  // 開盤處理 (重置當日數據)
  const handleStartOfDay = useCallback((currentStocks: Stock[]) => {
    currentStocks.forEach(stock => {
      stock.openPrice = stock.currentPrice;
      stock.highPrice = stock.currentPrice;
      stock.lowPrice = stock.currentPrice;
      stock.volume = 0;
      stock.change = 0;
      stock.changePercent = 0;
      stock.history = [];
    });
  }, []);

  // 收盤處理 (結算注意股/丟棄股狀態)
  const handleEndOfDay = useCallback((currentStocks: Stock[], currentDate: string) => {
    currentStocks.forEach(stock => {
      // 判斷注意股: 漲跌幅超過 +/- 7%
      if (Math.abs(stock.changePercent) >= 7) {
        stock.attentionDays += 1;
        stock.status = 'Attention';
      } else {
        stock.attentionDays = 0;
        if (stock.status === 'Attention') stock.status = 'Normal';
      }
      
      // 判斷丟棄股: 連續3天注意股
      if (stock.attentionDays >= 3) {
        stock.status = 'Discarded';
        stock.discardedDaysLeft = Math.floor(Math.random() * 3) + 3; // 隨機 3-5 天
        stock.attentionDays = 0;
      }
      
      // 減少丟棄股天數
      if (stock.status === 'Discarded') {
        if (stock.discardedDaysLeft > 0) {
          stock.discardedDaysLeft -= 1;
        } else {
          stock.status = 'Normal';
        }
      }
      
      // 記錄日線歷史數據
      stock.dailyHistory.push({
        date: currentDate,
        open: stock.openPrice,
        high: stock.highPrice,
        low: stock.lowPrice,
        close: stock.currentPrice,
        volume: stock.volume
      });
    });
  }, []);

  // 強制切換到下一日
  const nextDay = useCallback(() => {
    // Deep copy stocks to ensure we can mutate them safely
    const currentStocks = stocksRef.current.map(s => ({
      ...s,
      history: [...s.history],
      dailyHistory: [...s.dailyHistory]
    }));
    const currentState = stateRef.current;
    
    // 日期 +1
    const nextDate = new Date(currentState.date);
    nextDate.setDate(nextDate.getDate() + 1);
    const nextDateStr = nextDate.toISOString().split('T')[0];
    
    handleStartOfDay(currentStocks);
    
    setStocks(currentStocks);
    setMarketState(prev => ({
      ...prev,
      date: nextDateStr,
      time: '00:00', // 全時段從 00:00 開始
      volume: 0,
      activeEvents: [], // 清除當日事件
      initialIndex: prev.index,
      change: 0,
      changePercent: 0,
      logs: [{ time: '00:00', message: `新日開始: ${nextDateStr}`, type: 'info' }, ...prev.logs].slice(0, 50)
    }));
  }, [handleStartOfDay]);

  // --- 核心模擬邏輯 (Tick) ---
  const processTick = useCallback(() => {
    const currentState = stateRef.current;
    // Deep copy stocks to ensure we can mutate them safely
    const currentStocks = stocksRef.current.map(s => ({
      ...s,
      history: [...s.history],
      dailyHistory: [...s.dailyHistory]
    }));
    
    const prevTime = currentState.time;
    const newTime = addMinutes(prevTime, 10);
    let newDate = currentState.date;

    // Day Rollover (23:50 -> 00:00)
    if (newTime < prevTime) {
      // 1. 結算前一日
      handleEndOfDay(currentStocks, currentState.date);
      addLog(`日結: ${currentState.date}`, 'alert');

      // 2. 更新日期
      const d = new Date(currentState.date);
      d.setDate(d.getDate() + 1);
      newDate = d.toISOString().split('T')[0];

      // 3. 開始新一日
      handleStartOfDay(currentStocks);
      addLog(`新日開始: ${newDate}`, 'info');
    }

    // 全時段交易
    const isTradingTime = true;
    let totalVolume = 0;

    if (isTradingTime) {
      // 隨機事件觸發 (每日 0-2 次)
      if (Math.random() < 0.05 && currentState.activeEvents.length < 2) {
        const randomEvent = events[Math.floor(Math.random() * events.length)];
        // 避免重複觸發相同事件
        if (randomEvent && !currentState.activeEvents.find(e => e.id === randomEvent.id)) {
          addLog(`[突發事件] ${randomEvent.content}`, 'news');
          setMarketState(prev => ({
            ...prev,
            activeEvents: [...prev.activeEvents, randomEvent]
          }));
        }
      }

      // 更新個股狀態 (使用不可變更新)
      for (let i = 0; i < currentStocks.length; i++) {
        // 淺拷貝個股物件以避免直接修改原始參考
        const stock = { ...currentStocks[i] };
        
        // 1. 基礎波動 (常態分佈)
        const volatility = 0.005; // 0.5% 標準差
        let change = generateRandomNormal(0, volatility);
        
        // 2. 事件影響
        currentState.activeEvents.forEach(event => {
          if (event.scope === '全體' || 
             (event.scope === '類股' && event.trigger === stock.sector) || 
             (event.scope === '個股' && Math.random() < 0.01)) { 
               change += (event.impact / 100) * 0.1; 
          }
        });
        
        // 3. 護盤/穩定機制 (均值回歸)
        if (Math.abs(stock.changePercent) > 5) {
          change -= stock.changePercent * 0.05; 
        }
        
        // 4. 丟棄股懲罰 (波動減半)
        if (stock.status === 'Discarded') {
          change *= 0.5; 
        }

        // 計算新價格
        let newPrice = stock.currentPrice * (1 + change);
        
        // 漲跌停限制 (+/- 10%)
        const limitUp = stock.openPrice * 1.10;
        const limitDown = stock.openPrice * 0.90;
        
        if (newPrice > limitUp) newPrice = limitUp;
        if (newPrice < limitDown) newPrice = limitDown;
        
        // 更新股價資訊
        stock.currentPrice = newPrice;
        if (newPrice > stock.highPrice) stock.highPrice = newPrice;
        if (newPrice < stock.lowPrice) stock.lowPrice = newPrice;
        
        stock.change = newPrice - stock.openPrice;
        stock.changePercent = (stock.change / stock.openPrice) * 100;
        
        // 成交量模擬
        const tickVolume = Math.floor(Math.random() * 100 * (stock.status === 'Discarded' ? 0.5 : 1));
        stock.volume += tickVolume;
        totalVolume += tickVolume;
        
        // 記錄分時走勢 (複製陣列)
        stock.history = [...stock.history, {
          time: newTime,
          price: newPrice,
          volume: tickVolume
        }];
        
        // 更新陣列中的物件
        currentStocks[i] = stock;
      }
    }

    // 更新加權指數
    const newIndex = calculateIndex(currentStocks);
    
    setStocks(currentStocks);
    setMarketState(prev => ({
      ...prev,
      date: newDate,
      time: newTime,
      index: newIndex,
      change: newIndex - prev.initialIndex,
      changePercent: ((newIndex - prev.initialIndex) / prev.initialIndex) * 100,
      volume: isTradingTime ? prev.volume + totalVolume : prev.volume,
      // 跨日清除事件
      activeEvents: newTime === '00:00' ? [] : prev.activeEvents
    }));

  }, [events, addLog, handleEndOfDay, calculateIndex, handleStartOfDay, nextDay]);

  // --- 控制函式 ---
  const toggleSimulation = () => {
    setMarketState(prev => ({ ...prev, isRunning: !prev.isRunning }));
  };

  const setSpeed = (speed: number) => {
    setMarketState(prev => ({ ...prev, speed }));
  };

  const toggleAutoProcess = () => {
    setMarketState(prev => ({ ...prev, autoProcess: !prev.autoProcess }));
  };

  // --- 定時器 Effect ---
  useEffect(() => {
    let interval: any;
    // 只有在運行中才啟動定時器
    if (marketState.isRunning) {
      interval = setInterval(processTick, TICK_INTERVAL_MS / marketState.speed);
    }
    return () => clearInterval(interval);
    // 注意：這裡移除了 marketState.time，避免每次 Tick 都重置定時器
    // processTick 內部透過 ref 獲取最新狀態
  }, [marketState.isRunning, marketState.speed, processTick]);

  return {
    stocks,
    marketState,
    toggleSimulation,
    setSpeed,
    nextDay,
    toggleAutoProcess
  };
};
