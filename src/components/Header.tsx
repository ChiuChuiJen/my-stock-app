import React from 'react';
import { Play, Pause, FastForward, SkipForward, RefreshCw } from 'lucide-react';
import { MarketState } from '../types';
import { formatNumber } from '../utils/simulationUtils';
import { APP_VERSION } from '../version';

interface HeaderProps {
  marketState: MarketState;
  onToggle: () => void;
  onSpeedChange: (speed: number) => void;
  onNextDay: () => void;
  onAutoToggle: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  marketState,
  onToggle,
  onSpeedChange,
  onNextDay,
  onAutoToggle
}) => {
  return (
    <div className="bg-slate-900 text-white p-4 shadow-md flex flex-col md:flex-row justify-between items-center gap-4">
      <div className="flex items-center gap-6">
        <div className="flex flex-col">
          <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-emerald-400">
            CR 證券交易所
          </h1>
          <span className="text-[10px] text-slate-500 font-mono">{APP_VERSION}</span>
        </div>
        <div className="flex flex-col">
          <div className="text-xs text-slate-400">加權指數</div>
          <div className={`text-2xl font-mono font-bold ${marketState.change >= 0 ? 'text-red-500' : 'text-green-500'}`}>
            {formatNumber(marketState.index)}
            <span className="text-sm ml-2">
              {marketState.change >= 0 ? '▲' : '▼'} {Math.abs(marketState.change).toFixed(2)} ({Math.abs(marketState.changePercent).toFixed(2)}%)
            </span>
          </div>
        </div>
        <div className="flex flex-col">
          <div className="text-xs text-slate-400">時間</div>
          <div className="text-xl font-mono flex items-center gap-2">
            {marketState.date} <span className="text-yellow-400">{marketState.time}</span>
            {(marketState.time < '09:00' || marketState.time > '13:30') && (
              <span className="text-xs bg-slate-700 text-slate-300 px-1.5 py-0.5 rounded">收盤</span>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={onToggle}
          className={`p-2 rounded-full ${marketState.isRunning ? 'bg-red-600 hover:bg-red-700' : 'bg-emerald-600 hover:bg-emerald-700'} transition-colors`}
          title={marketState.isRunning ? "暫停" : "開始模擬"}
        >
          {marketState.isRunning ? <Pause size={20} /> : <Play size={20} />}
        </button>
        
        <div className="flex bg-slate-800 rounded-lg p-1">
          {[1, 2, 5, 10].map(speed => (
            <button
              key={speed}
              onClick={() => onSpeedChange(speed)}
              className={`px-3 py-1 text-xs rounded ${marketState.speed === speed ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'}`}
            >
              {speed}x
            </button>
          ))}
        </div>

        <button
          onClick={onNextDay}
          className="p-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-slate-200"
          title="下一日"
        >
          <SkipForward size={20} />
        </button>

        <button
          onClick={onAutoToggle}
          className={`p-2 rounded-lg transition-colors ${marketState.autoProcess ? 'bg-purple-600 text-white' : 'bg-slate-700 text-slate-400'}`}
          title="自動進程"
        >
          <RefreshCw size={20} className={marketState.autoProcess ? 'animate-spin' : ''} />
        </button>
        
        <div className="ml-2 px-3 py-1 bg-slate-800 rounded text-xs text-slate-400">
          中文
        </div>
      </div>
    </div>
  );
};
