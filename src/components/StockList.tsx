import React, { useState } from 'react';
import * as ReactWindow from 'react-window';
import { Stock } from '../types';
import { formatNumber } from '../utils/simulationUtils';
import { useElementSize } from '../hooks/useElementSize';

interface StockListProps {
  stocks: Stock[];
  onSelectStock: (stock: Stock) => void;
}

export const StockList: React.FC<StockListProps> = ({ stocks, onSelectStock }) => {
  const [filter, setFilter] = useState('');
  const { ref, width, height } = useElementSize();

  // 過濾股票邏輯
  const filteredStocks = stocks.filter(s => 
    s.code.includes(filter) || s.name.includes(filter)
  );

  // 虛擬列表的行組件
  const Row = ({ index, style }: { index: number; style: React.CSSProperties }) => {
    const stock = filteredStocks[index];
    return (
      <div 
        style={style} 
        onClick={() => onSelectStock(stock)}
        className="flex items-center hover:bg-white/5 cursor-pointer transition-colors border-b border-white/5 text-sm"
      >
        <div className="w-[10%] p-3 font-mono text-blue-400">{stock.code}</div>
        <div className="w-[20%] p-3 text-white flex items-center gap-2">
          {stock.name}
          {stock.isWeighted && <span className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.8)]" title="權值股"></span>}
        </div>
        <div className={`w-[15%] p-3 text-right font-mono font-bold ${stock.change >= 0 ? 'text-red-500' : 'text-green-500'}`}>
          {stock.currentPrice.toFixed(2)}
        </div>
        <div className={`w-[15%] p-3 text-right font-mono ${stock.change >= 0 ? 'text-red-500' : 'text-green-500'}`}>
          {stock.change >= 0 ? '+' : ''}{stock.change.toFixed(2)}
        </div>
        <div className={`w-[15%] p-3 text-right font-mono ${stock.change >= 0 ? 'text-red-500' : 'text-green-500'}`}>
          {stock.changePercent.toFixed(2)}%
        </div>
        <div className="w-[15%] p-3 text-right font-mono text-slate-300">
          {formatNumber(stock.volume)}
        </div>
        <div className="w-[10%] p-3 text-center flex justify-center gap-1">
          {stock.status === 'Attention' && (
            <span className="text-[10px] bg-yellow-500/20 text-yellow-500 px-2 py-0.5 rounded border border-yellow-500/30">注意</span>
          )}
          {stock.status === 'Discarded' && (
            <span className="text-[10px] bg-slate-500/20 text-slate-500 px-2 py-0.5 rounded border border-slate-500/30">丟棄</span>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="flex-1 flex flex-col bg-slate-900/80 backdrop-blur-md border-r border-white/10 overflow-hidden">
      {/* 搜尋欄 */}
      <div className="p-4 border-b border-white/10 bg-slate-900/50">
        <input
          type="text"
          placeholder="搜尋代碼或名稱..."
          className="w-full bg-slate-800/50 text-white px-4 py-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 border border-white/5 placeholder-slate-500 transition-all"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        />
      </div>
      
      {/* 表頭 */}
      <div className="flex bg-slate-800/80 text-slate-400 text-xs font-medium border-b border-white/10">
        <div className="w-[10%] p-3">代碼</div>
        <div className="w-[20%] p-3">名稱</div>
        <div className="w-[15%] p-3 text-right">成交價</div>
        <div className="w-[15%] p-3 text-right">漲跌</div>
        <div className="w-[15%] p-3 text-right">漲跌幅</div>
        <div className="w-[15%] p-3 text-right">成交量</div>
        <div className="w-[10%] p-3 text-center">狀態</div>
      </div>

      {/* 虛擬化列表 */}
      <div className="flex-1" ref={ref}>
        {width > 0 && height > 0 && (
          <ReactWindow.FixedSizeList
            height={height}
            itemCount={filteredStocks.length}
            itemSize={50} // 每行高度
            width={width}
          >
            {Row}
          </ReactWindow.FixedSizeList>
        )}
      </div>
    </div>
  );
};
