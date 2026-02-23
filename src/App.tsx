import React, { useEffect } from 'react';
import { useMarketStore } from './store/useMarketStore';
import { Header } from './components/Header';
import { StockList } from './components/StockList';
import { NewsFeed } from './components/NewsFeed';
import { MarketStats } from './components/MarketStats';
import { StockDetailModal } from './components/StockDetailModal';

export default function App() {
  const { initMarket, isPlaying, speed, tick } = useMarketStore();

  useEffect(() => {
    initMarket();
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying) {
      interval = setInterval(() => {
        tick();
      }, 1000 / speed); // Base speed 1 sec per tick, divided by speed multiplier
    }
    return () => clearInterval(interval);
  }, [isPlaying, speed, tick]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans flex flex-col">
      <Header />
      
      <main className="flex-1 container mx-auto p-4 flex flex-col lg:flex-row gap-4 overflow-hidden h-[calc(100vh-80px)]">
        
        {/* Left: Stock List */}
        <div className="flex-1 lg:flex-[2] h-full overflow-hidden">
          <StockList />
        </div>

        {/* Right: Info Panel */}
        <div className="flex-1 lg:flex-[1] flex flex-col gap-4 h-full overflow-hidden">
          <div className="flex-none">
            <MarketStats />
          </div>
          <div className="flex-1 overflow-hidden">
            <NewsFeed />
          </div>
        </div>

      </main>

      <StockDetailModal />
    </div>
  );
}
