import React from 'react';
import { useMarketStore } from '../store/useMarketStore';

export const NewsFeed = () => {
  const { news } = useMarketStore();

  return (
    <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden flex flex-col h-full">
      <div className="p-4 border-b border-slate-700 bg-slate-900/50">
        <h2 className="text-lg font-bold text-white">News & Events</h2>
      </div>
      
      <div className="overflow-auto flex-1 p-4 space-y-3">
        {news.length === 0 ? (
          <div className="text-slate-500 text-center py-8 text-sm">No news yet...</div>
        ) : (
          news.map((item) => (
            <div key={item.id} className="bg-slate-700/30 p-3 rounded-lg border border-slate-700/50">
              <div className="flex justify-between items-start mb-1">
                <span className="text-xs font-mono text-slate-400">{item.time}</span>
                <span className="text-[10px] px-1.5 py-0.5 bg-blue-500/20 text-blue-300 rounded uppercase">
                  {item.type}
                </span>
              </div>
              <h3 className="text-sm font-bold text-white mb-1">{item.title}</h3>
              <p className="text-xs text-slate-300">{item.content}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
