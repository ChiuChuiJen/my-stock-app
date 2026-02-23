import React from 'react';
import { useMarketStore } from '../store/useMarketStore';
import { X } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

export const StockDetailModal = () => {
  const { selectedStock, setSelectedStock } = useMarketStore();

  if (!selectedStock) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900 w-full max-w-4xl rounded-2xl border border-slate-700 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-4 border-b border-slate-700 flex justify-between items-start bg-slate-800">
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-2xl font-bold text-white">{selectedStock.name}</h2>
              <span className="font-mono text-slate-400 text-lg">{selectedStock.id}</span>
              <span className="text-xs px-2 py-1 bg-slate-700 rounded text-slate-300">{selectedStock.category}</span>
            </div>
            <div className="mt-1 flex gap-4 text-sm">
              <span className="text-slate-400">Capital: {selectedStock.capital}M</span>
              <span className="text-slate-400">Shares: {selectedStock.totalShares.toLocaleString()}</span>
            </div>
          </div>
          <button 
            onClick={() => setSelectedStock(null)}
            className="p-2 hover:bg-slate-700 rounded-full text-slate-400 hover:text-white"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left: Chart */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            <div className="h-[300px] bg-slate-800/50 rounded-xl p-4 border border-slate-700">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={selectedStock.history}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis dataKey="time" stroke="#94a3b8" fontSize={12} tick={{fill: '#94a3b8'}} />
                  <YAxis domain={['auto', 'auto']} stroke="#94a3b8" fontSize={12} tick={{fill: '#94a3b8'}} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#fff' }}
                    itemStyle={{ color: '#fff' }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="price" 
                    stroke="#3b82f6" 
                    strokeWidth={2} 
                    dot={false} 
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            
            <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
              <h3 className="text-sm font-bold text-slate-300 mb-2 uppercase">Company Profile</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                {selectedStock.description || "No description available."}
              </p>
            </div>
          </div>

          {/* Right: Stats */}
          <div className="flex flex-col gap-4">
            <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
              <div className="text-4xl font-mono font-bold mb-1 text-white">
                {selectedStock.currentPrice.toFixed(2)}
              </div>
              <div className={`text-lg font-mono ${selectedStock.change >= 0 ? 'text-red-400' : 'text-green-400'}`}>
                {selectedStock.change > 0 ? '+' : ''}{selectedStock.change.toFixed(2)} ({selectedStock.changePercent.toFixed(2)}%)
              </div>
            </div>

            <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700 space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Open</span>
                <span className="font-mono text-white">{selectedStock.openPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">High</span>
                <span className="font-mono text-red-300">{selectedStock.highPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Low</span>
                <span className="font-mono text-green-300">{selectedStock.lowPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Prev Close</span>
                <span className="font-mono text-slate-300">{selectedStock.previousClose.toFixed(2)}</span>
              </div>
              <div className="h-px bg-slate-700 my-2" />
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Volume</span>
                <span className="font-mono text-white">{selectedStock.volume.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">P/E Ratio</span>
                <span className="font-mono text-white">{selectedStock.peRatio}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Yield</span>
                <span className="font-mono text-white">{selectedStock.yieldRate}%</span>
              </div>
            </div>

            <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
              <h3 className="text-xs font-bold text-slate-400 uppercase mb-3">Chip Distribution</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-400">Foreign</span>
                  <span className="font-mono text-white">{selectedStock.foreignBuy}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Dealer</span>
                  <span className="font-mono text-white">{selectedStock.dealerBuy}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Inv. Trust</span>
                  <span className="font-mono text-white">{selectedStock.investmentTrustBuy}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Retail</span>
                  <span className="font-mono text-white">{selectedStock.retailBuy}</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
