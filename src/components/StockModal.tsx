import React, { useState } from 'react';
import { X, TrendingUp, Activity, PieChart } from 'lucide-react';
import { Stock } from '../types';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { formatMoney } from '../utils/simulationUtils';

interface StockModalProps {
  stock: Stock | null;
  onClose: () => void;
}

export const StockModal: React.FC<StockModalProps> = ({ stock, onClose }) => {
  const [chartType, setChartType] = useState<'intraday' | 'daily'>('intraday');

  if (!stock) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-slate-900 w-full max-w-4xl rounded-2xl shadow-2xl border border-slate-700 overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-6 border-b border-slate-700 flex justify-between items-start bg-slate-800/50">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h2 className="text-3xl font-bold text-white">{stock.name}</h2>
              <span className="text-xl font-mono text-slate-400">{stock.code}</span>
              {stock.isWeighted && <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded">權值股</span>}
              {stock.status === 'Attention' && <span className="bg-yellow-600 text-white text-xs px-2 py-1 rounded">注意股</span>}
              {stock.status === 'Discarded' && <span className="bg-slate-600 text-white text-xs px-2 py-1 rounded">丟棄股</span>}
            </div>
            <div className="text-slate-400 text-sm">{stock.sector} | 資本額: {formatMoney(stock.capital)}</div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="bg-slate-800 p-4 rounded-xl">
              <div className="text-slate-400 text-xs mb-1">成交價</div>
              <div className={`text-3xl font-mono font-bold ${stock.change >= 0 ? 'text-red-500' : 'text-green-500'}`}>
                {stock.currentPrice.toFixed(2)}
              </div>
              <div className={`text-sm font-mono ${stock.change >= 0 ? 'text-red-400' : 'text-green-400'}`}>
                {stock.change >= 0 ? '+' : ''}{stock.change.toFixed(2)} ({stock.changePercent.toFixed(2)}%)
              </div>
            </div>
            <div className="bg-slate-800 p-4 rounded-xl grid grid-cols-2 gap-4">
              <div>
                <div className="text-slate-400 text-xs">開盤</div>
                <div className="font-mono text-white">{stock.openPrice.toFixed(2)}</div>
              </div>
              <div>
                <div className="text-slate-400 text-xs">昨收</div>
                <div className="font-mono text-white">{stock.initialPrice.toFixed(2)}</div>
              </div>
              <div>
                <div className="text-slate-400 text-xs">最高</div>
                <div className="font-mono text-red-400">{stock.highPrice.toFixed(2)}</div>
              </div>
              <div>
                <div className="text-slate-400 text-xs">最低</div>
                <div className="font-mono text-green-400">{stock.lowPrice.toFixed(2)}</div>
              </div>
            </div>
            <div className="bg-slate-800 p-4 rounded-xl grid grid-cols-2 gap-4">
              <div>
                <div className="text-slate-400 text-xs">成交量</div>
                <div className="font-mono text-white">{stock.volume}</div>
              </div>
              <div>
                <div className="text-slate-400 text-xs">本益比</div>
                <div className="font-mono text-white">{stock.pe}</div>
              </div>
              <div>
                <div className="text-slate-400 text-xs">殖利率</div>
                <div className="font-mono text-white">{stock.yield}%</div>
              </div>
              <div>
                <div className="text-slate-400 text-xs">EPS</div>
                <div className="font-mono text-white">{stock.eps}</div>
              </div>
            </div>
          </div>

          {/* Chart */}
          <div className="bg-slate-800 p-4 rounded-xl mb-6 h-64 flex flex-col">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-slate-400 text-xs uppercase flex items-center gap-2">
                <TrendingUp size={14} /> 走勢圖 ({chartType === 'intraday' ? '分時' : '日線'})
              </h3>
              <div className="flex bg-slate-700 rounded p-0.5">
                <button 
                  className={`px-3 py-1 text-xs rounded ${chartType === 'intraday' ? 'bg-blue-600 text-white' : 'text-slate-300 hover:text-white'}`}
                  onClick={() => setChartType('intraday')}
                >
                  分時
                </button>
                <button 
                  className={`px-3 py-1 text-xs rounded ${chartType === 'daily' ? 'bg-blue-600 text-white' : 'text-slate-300 hover:text-white'}`}
                  onClick={() => setChartType('daily')}
                >
                  日線
                </button>
              </div>
            </div>
            <div className="flex-1 min-h-0">
              <ResponsiveContainer width="100%" height="100%">
                {chartType === 'intraday' ? (
                  <AreaChart data={stock.history}>
                    <defs>
                      <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={stock.change >= 0 ? "#ef4444" : "#22c55e"} stopOpacity={0.3}/>
                        <stop offset="95%" stopColor={stock.change >= 0 ? "#ef4444" : "#22c55e"} stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                    <XAxis dataKey="time" stroke="#94a3b8" fontSize={10} minTickGap={30} />
                    <YAxis domain={['auto', 'auto']} stroke="#94a3b8" fontSize={10} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155' }}
                      itemStyle={{ color: '#fff' }}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="price" 
                      stroke={stock.change >= 0 ? "#ef4444" : "#22c55e"} 
                      fillOpacity={1} 
                      fill="url(#colorPrice)" 
                    />
                  </AreaChart>
                ) : (
                  <AreaChart data={stock.dailyHistory.length > 0 ? stock.dailyHistory : [{ date: '今日', close: stock.currentPrice }]}>
                    <defs>
                      <linearGradient id="colorDaily" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                    <XAxis dataKey="date" stroke="#94a3b8" fontSize={10} />
                    <YAxis domain={['auto', 'auto']} stroke="#94a3b8" fontSize={10} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155' }}
                      itemStyle={{ color: '#fff' }}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="close" 
                      stroke="#3b82f6" 
                      fillOpacity={1} 
                      fill="url(#colorDaily)" 
                    />
                  </AreaChart>
                )}
              </ResponsiveContainer>
            </div>
          </div>

          {/* Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-slate-800 p-4 rounded-xl">
              <h3 className="text-slate-400 text-xs uppercase mb-4 flex items-center gap-2">
                <Activity size={14} /> 公司簡介
              </h3>
              <p className="text-slate-300 text-sm leading-relaxed">
                {stock.description}
              </p>
            </div>
            <div className="bg-slate-800 p-4 rounded-xl">
              <h3 className="text-slate-400 text-xs uppercase mb-4 flex items-center gap-2">
                <PieChart size={14} /> 籌碼分佈 (模擬)
              </h3>
              <div className="space-y-3">
                <DistributionBar label="外資" percent={Math.floor(Math.random() * 30) + 10} color="bg-blue-500" />
                <DistributionBar label="投信" percent={Math.floor(Math.random() * 15) + 5} color="bg-purple-500" />
                <DistributionBar label="自營商" percent={Math.floor(Math.random() * 10) + 1} color="bg-orange-500" />
                <DistributionBar label="散戶" percent={Math.floor(Math.random() * 40) + 20} color="bg-slate-500" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const DistributionBar = ({ label, percent, color }: { label: string, percent: number, color: string }) => (
  <div className="flex items-center gap-3 text-xs">
    <span className="w-12 text-slate-400">{label}</span>
    <div className="flex-1 bg-slate-700 h-2 rounded-full overflow-hidden">
      <div className={`h-full ${color}`} style={{ width: `${percent}%` }}></div>
    </div>
    <span className="w-8 text-right font-mono text-slate-300">{percent}%</span>
  </div>
);
