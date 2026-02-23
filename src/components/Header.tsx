import React from 'react';
import { useMarketStore } from '../store/useMarketStore';
import { Play, Pause, FastForward, SkipForward, Globe } from 'lucide-react';

export const Header = () => {
  const { 
    index, 
    currentTime, 
    isPlaying, 
    speed, 
    togglePlay, 
    setSpeed, 
    nextDay,
    initMarket
  } = useMarketStore();

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('zh-TW', { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('zh-TW');
  };

  const indexChange = index - 5000;
  const indexChangePct = (indexChange / 5000) * 100;
  const isPositive = indexChange >= 0;

  return (
    <header className="bg-slate-900 text-white p-4 shadow-md">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
        
        {/* Left: Logo & Index */}
        <div className="flex items-center gap-6">
          <div className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
            CR Stock Exchange
          </div>
          
          <div className="flex flex-col">
            <div className="text-3xl font-mono font-bold">
              {index.toFixed(2)}
            </div>
            <div className={`text-sm font-mono flex gap-2 ${isPositive ? 'text-red-400' : 'text-green-400'}`}>
              <span>{isPositive ? '▲' : '▼'} {Math.abs(indexChange).toFixed(2)}</span>
              <span>({Math.abs(indexChangePct).toFixed(2)}%)</span>
            </div>
          </div>
        </div>

        {/* Center: Time & Status */}
        <div className="flex flex-col items-center bg-slate-800 px-6 py-2 rounded-xl border border-slate-700">
          <div className="text-xs text-slate-400 uppercase tracking-wider">Market Time</div>
          <div className="text-xl font-mono font-bold text-white">
            {formatDate(currentTime)} {formatTime(currentTime)}
          </div>
        </div>

        {/* Right: Controls */}
        <div className="flex items-center gap-3">
          <button 
            onClick={togglePlay}
            className={`p-3 rounded-full transition-all ${
              isPlaying ? 'bg-yellow-500 hover:bg-yellow-600' : 'bg-emerald-500 hover:bg-emerald-600'
            }`}
          >
            {isPlaying ? <Pause size={20} /> : <Play size={20} />}
          </button>

          <div className="flex bg-slate-800 rounded-lg p-1 border border-slate-700">
            {[1, 2, 5, 10].map((s) => (
              <button
                key={s}
                onClick={() => setSpeed(s)}
                className={`px-3 py-1 text-xs font-bold rounded ${
                  speed === s ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                {s}x
              </button>
            ))}
          </div>

          <button 
            onClick={nextDay}
            className="p-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-slate-200"
            title="Next Day"
          >
            <SkipForward size={20} />
          </button>

          <button className="p-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-slate-200">
            <Globe size={20} />
          </button>
        </div>
      </div>
    </header>
  );
};
