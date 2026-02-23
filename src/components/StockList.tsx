import React from 'react';
import { useMarketStore } from '../store/useMarketStore';
import { Stock } from '../types';
import clsx from 'clsx';

export const StockList = () => {
  const { stocks, setSelectedStock, weightedStocks } = useMarketStore();

  const handleRowClick = (stock: Stock) => {
    setSelectedStock(stock);
  };

  return (
    <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden flex flex-col h-full">
      <div className="p-4 border-b border-slate-700 flex justify-between items-center bg-slate-900/50">
        <h2 className="text-lg font-bold text-white">Market Watch</h2>
        <div className="text-xs text-slate-400">Total: {stocks.length}</div>
      </div>
      
      <div className="overflow-auto flex-1">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-900 text-slate-400 sticky top-0 z-10">
            <tr>
              <th className="p-3 font-medium">Code</th>
              <th className="p-3 font-medium">Name</th>
              <th className="p-3 font-medium text-right">Price</th>
              <th className="p-3 font-medium text-right">Chg</th>
              <th className="p-3 font-medium text-right">Chg%</th>
              <th className="p-3 font-medium text-right">Vol</th>
              <th className="p-3 font-medium text-center">Flags</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700">
            {stocks.map((stock) => {
              const isUp = stock.change > 0;
              const isDown = stock.change < 0;
              const isLimitUp = stock.isLimitUp;
              const isLimitDown = stock.isLimitDown;
              const isWeighted = weightedStocks.includes(stock.id);

              return (
                <tr 
                  key={stock.id}
                  onClick={() => handleRowClick(stock)}
                  className="hover:bg-slate-700/50 cursor-pointer transition-colors"
                >
                  <td className="p-3 font-mono text-slate-300">
                    {stock.id}
                    {isWeighted && <span className="ml-1 text-[10px] text-yellow-500 border border-yellow-500/30 px-1 rounded">W</span>}
                  </td>
                  <td className="p-3 text-white font-medium">{stock.name}</td>
                  <td className={clsx("p-3 text-right font-mono font-bold", {
                    'text-red-400': isUp,
                    'text-green-400': isDown,
                    'text-white': !isUp && !isDown,
                    'bg-red-900/20': isLimitUp,
                    'bg-green-900/20': isLimitDown
                  })}>
                    {stock.currentPrice.toFixed(2)}
                  </td>
                  <td className={clsx("p-3 text-right font-mono", {
                    'text-red-400': isUp,
                    'text-green-400': isDown,
                    'text-slate-400': !isUp && !isDown
                  })}>
                    {stock.change > 0 ? '+' : ''}{stock.change.toFixed(2)}
                  </td>
                  <td className={clsx("p-3 text-right font-mono", {
                    'text-red-400': isUp,
                    'text-green-400': isDown,
                    'text-slate-400': !isUp && !isDown
                  })}>
                    {stock.changePercent > 0 ? '+' : ''}{stock.changePercent.toFixed(2)}%
                  </td>
                  <td className="p-3 text-right font-mono text-slate-300">
                    {stock.volume.toLocaleString()}
                  </td>
                  <td className="p-3 text-center flex justify-center gap-1">
                    {stock.isAttention && (
                      <span className="px-1.5 py-0.5 text-[10px] bg-yellow-500/20 text-yellow-400 rounded border border-yellow-500/30">
                        ATTN
                      </span>
                    )}
                    {stock.isDisposition && (
                      <span className="px-1.5 py-0.5 text-[10px] bg-orange-500/20 text-orange-400 rounded border border-orange-500/30">
                        DISP
                      </span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div className="p-2 bg-slate-900 border-t border-slate-700 text-center text-xs text-slate-500">
        Displaying simulated market data. Full dataset available in source code.
      </div>
    </div>
  );
};
