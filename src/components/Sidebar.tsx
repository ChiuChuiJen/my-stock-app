import React from 'react';
import { Stock } from '../types';

interface SidebarProps {
  stocks: Stock[];
}

export const Sidebar: React.FC<SidebarProps> = ({ stocks }) => {
  const upLimit = stocks.filter(s => s.changePercent >= 9.9).length;
  const downLimit = stocks.filter(s => s.changePercent <= -9.9).length;
  const upCount = stocks.filter(s => s.change > 0).length;
  const downCount = stocks.filter(s => s.change < 0).length;
  const flatCount = stocks.filter(s => s.change === 0).length;
  const attentionCount = stocks.filter(s => s.status === 'Attention').length;
  const discardedCount = stocks.filter(s => s.status === 'Discarded').length;

  return (
    <div className="w-full h-full bg-slate-900/80 backdrop-blur-md p-4 flex flex-col gap-4 overflow-y-auto border-l border-white/10">
      <div className="bg-white/5 p-4 rounded-2xl border border-white/5 shadow-lg">
        <h3 className="text-slate-400 text-xs uppercase mb-3 font-bold tracking-wider">市場統計</h3>
        <div className="grid grid-cols-2 gap-3">
          <StatBox label="漲停" value={upLimit} color="text-red-500" bg="bg-red-500/10" />
          <StatBox label="跌停" value={downLimit} color="text-green-500" bg="bg-green-500/10" />
          <StatBox label="上漲" value={upCount} color="text-red-400" bg="bg-red-400/5" />
          <StatBox label="下跌" value={downCount} color="text-green-400" bg="bg-green-400/5" />
          <StatBox label="平盤" value={flatCount} color="text-slate-200" bg="bg-slate-200/5" />
          <StatBox label="總量" value={stocks.length} color="text-blue-400" bg="bg-blue-400/5" />
        </div>
      </div>

      <div className="bg-white/5 p-4 rounded-2xl border border-white/5 shadow-lg">
        <h3 className="text-slate-400 text-xs uppercase mb-3 font-bold tracking-wider">監控名單</h3>
        <div className="flex flex-col gap-2">
          <div className="flex justify-between items-center p-3 bg-white/5 rounded-xl border border-white/5">
            <span className="text-sm text-yellow-400 font-medium">注意股</span>
            <span className="font-mono font-bold text-yellow-400 text-lg">{attentionCount}</span>
          </div>
          <div className="flex justify-between items-center p-3 bg-white/5 rounded-xl border border-white/5">
            <span className="text-sm text-slate-400 font-medium">丟棄股</span>
            <span className="font-mono font-bold text-slate-400 text-lg">{discardedCount}</span>
          </div>
        </div>
      </div>

      <div className="bg-white/5 p-4 rounded-2xl border border-white/5 shadow-lg flex-1 flex flex-col">
        <h3 className="text-slate-400 text-xs uppercase mb-3 font-bold tracking-wider">權值股 Top 5</h3>
        <div className="flex flex-col gap-2 flex-1">
          {stocks
            .filter(s => s.isWeighted)
            .sort((a, b) => b.marketCap - a.marketCap)
            .slice(0, 5)
            .map((stock, index) => (
              <div key={stock.code} className="flex justify-between items-center text-xs border-b border-white/5 pb-2 mb-1 last:border-0">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-slate-500 w-3">{index + 1}</span>
                  <span className="text-slate-200 font-medium">{stock.name}</span>
                </div>
                <span className="font-mono text-blue-400">{(stock.weight * 100).toFixed(2)}%</span>
              </div>
            ))}
        </div>
        <div className="mt-4 text-[10px] text-slate-500 text-center bg-black/20 py-1 rounded">
          下次調整: 30日後
        </div>
      </div>
    </div>
  );
};

const StatBox = ({ label, value, color, bg }: { label: string, value: number, color: string, bg: string }) => (
  <div className={`${bg} p-2 rounded-xl flex flex-col items-center justify-center border border-white/5`}>
    <span className="text-[10px] text-slate-400 mb-0.5">{label}</span>
    <span className={`text-lg font-mono font-bold ${color}`}>{value}</span>
  </div>
);
