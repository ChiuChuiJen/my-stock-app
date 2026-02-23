import React from 'react';
import { useMarketStore } from '../store/useMarketStore';

export const MarketStats = () => {
  const { 
    limitUpCount, 
    limitDownCount, 
    attentionCount, 
    dispositionCount,
    stocks,
    nextAdjustmentDate
  } = useMarketStore();

  const upCount = stocks.filter(s => s.change > 0).length;
  const downCount = stocks.filter(s => s.change < 0).length;
  const flatCount = stocks.length - upCount - downCount;

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      <div className="bg-slate-800 p-3 rounded-xl border border-slate-700 flex flex-col items-center">
        <div className="text-xs text-slate-400 uppercase">Limit Up</div>
        <div className="text-xl font-bold text-red-400">{limitUpCount}</div>
      </div>
      <div className="bg-slate-800 p-3 rounded-xl border border-slate-700 flex flex-col items-center">
        <div className="text-xs text-slate-400 uppercase">Limit Down</div>
        <div className="text-xl font-bold text-green-400">{limitDownCount}</div>
      </div>
      <div className="bg-slate-800 p-3 rounded-xl border border-slate-700 flex flex-col items-center">
        <div className="text-xs text-slate-400 uppercase">Attention</div>
        <div className="text-xl font-bold text-yellow-400">{attentionCount}</div>
      </div>
      <div className="bg-slate-800 p-3 rounded-xl border border-slate-700 flex flex-col items-center">
        <div className="text-xs text-slate-400 uppercase">Disposition</div>
        <div className="text-xl font-bold text-orange-400">{dispositionCount}</div>
      </div>

      <div className="col-span-2 md:col-span-4 bg-slate-800 p-3 rounded-xl border border-slate-700 flex justify-between items-center px-6">
        <div className="flex gap-4 text-sm">
          <span className="text-red-400">Up: {upCount}</span>
          <span className="text-green-400">Down: {downCount}</span>
          <span className="text-slate-400">Flat: {flatCount}</span>
        </div>
        <div className="text-xs text-slate-500">
          Next Weight Adj: {nextAdjustmentDate.toLocaleDateString()}
        </div>
      </div>
    </div>
  );
};
