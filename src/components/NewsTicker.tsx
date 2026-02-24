import React, { useEffect, useRef } from 'react';
import { MarketState } from '../types';

interface NewsTickerProps {
  logs: MarketState['logs'];
}

export const NewsTicker: React.FC<NewsTickerProps> = ({ logs }) => {
  return (
    <div className="bg-slate-950 text-slate-300 text-sm py-2 px-4 border-b border-slate-800 overflow-hidden whitespace-nowrap flex items-center">
      <span className="bg-red-600 text-white text-xs px-2 py-0.5 rounded mr-4 font-bold">快訊</span>
      <div className="overflow-hidden relative w-full">
        <div className="animate-marquee inline-block">
          {logs.map((log, i) => (
            <span key={i} className="mr-8">
              <span className="text-slate-500 font-mono text-xs mr-2">[{log.time}]</span>
              <span className={log.type === 'news' ? 'text-yellow-400' : log.type === 'alert' ? 'text-red-400' : 'text-slate-300'}>
                {log.message}
              </span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};
