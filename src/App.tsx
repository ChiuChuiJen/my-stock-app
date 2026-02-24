import { useState } from 'react';
import { useMarketSimulation } from './hooks/useMarketSimulation';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { StockList } from './components/StockList';
import { NewsTicker } from './components/NewsTicker';
import { StockModal } from './components/StockModal';
import { Stock } from './types';

export default function App() {
  const {
    stocks,
    marketState,
    toggleSimulation,
    setSpeed,
    nextDay,
    toggleAutoProcess
  } = useMarketSimulation();

  const [selectedStock, setSelectedStock] = useState<Stock | null>(null);

  return (
    <div className="h-screen w-full bg-slate-950 flex flex-col overflow-hidden font-sans text-slate-200 selection:bg-blue-500/30">
      {/* Background Gradient */}
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-900/20 via-slate-950 to-slate-950 pointer-events-none z-0"></div>
      
      <div className="relative z-10 flex flex-col h-full">
        <Header 
          marketState={marketState}
          onToggle={toggleSimulation}
          onSpeedChange={setSpeed}
          onNextDay={nextDay}
          onAutoToggle={toggleAutoProcess}
        />
        
        <NewsTicker logs={marketState.logs} />
        
        <div className="flex-1 flex overflow-hidden">
          <StockList stocks={stocks} onSelectStock={setSelectedStock} />
          <div className="hidden md:block h-full w-80 shrink-0">
            <Sidebar stocks={stocks} />
          </div>
        </div>
      </div>

      {selectedStock && (
        <StockModal 
          stock={stocks.find(s => s.code === selectedStock.code) || null} 
          onClose={() => setSelectedStock(null)} 
        />
      )}
    </div>
  );
}
