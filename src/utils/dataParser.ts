import { Stock, MarketEvent } from '../types';

export const parseStocks = (rawData: string): Stock[] => {
  const lines = rawData.trim().split('\n');
  const stocks: Stock[] = [];
  
  let currentStock: Partial<Stock> = {};
  
  // The raw data format from the prompt is multi-line with keys.
  // However, for the file I'm about to create, I'll use a compact pipe-delimited format to save space.
  // If I were parsing the EXACT prompt text, I'd use regex. 
  // But I will transform the prompt text into the compact format for the data file.
  
  // Compact format: Code|Name|Sector|Capital|IPO|Shares|Cap|PE|PB|NAV|EPS|Yield|Desc
  
  lines.forEach(line => {
    if (!line.trim()) return;
    const parts = line.split('|');
    if (parts.length < 13) return;
    
    const stock: Stock = {
      code: parts[0],
      name: parts[1],
      sector: parts[2],
      capital: parseFloat(parts[3]),
      initialPrice: parseFloat(parts[4]),
      totalShares: parseFloat(parts[5]),
      marketCap: parseFloat(parts[6]),
      pe: parseFloat(parts[7]),
      pb: parseFloat(parts[8]),
      nav: parseFloat(parts[9]),
      eps: parseFloat(parts[10]),
      yield: parseFloat(parts[11].replace('%', '')),
      description: parts[12],
      
      // Defaults
      currentPrice: parseFloat(parts[4]),
      openPrice: parseFloat(parts[4]),
      highPrice: parseFloat(parts[4]),
      lowPrice: parseFloat(parts[4]),
      volume: 0,
      change: 0,
      changePercent: 0,
      history: [],
      dailyHistory: [],
      isWeighted: false,
      weight: 0,
      status: 'Normal',
      attentionDays: 0,
      discardedDaysLeft: 0,
    };
    stocks.push(stock);
  });
  
  return stocks;
};

export const parseEvents = (rawData: string): MarketEvent[] => {
  const lines = rawData.trim().split('\n');
  const events: MarketEvent[] = [];
  
  // Compact format: ID|Scope|Nature|Source|Rarity|Trigger|Type|Impact|Content
  
  lines.forEach(line => {
    if (!line.trim()) return;
    const parts = line.split('|');
    if (parts.length < 9) return;
    
    events.push({
      id: parts[0],
      scope: parts[1] as any,
      nature: parts[2] as any,
      source: parts[3] as any,
      rarity: parts[4] as any,
      trigger: parts[5],
      type: parts[6],
      impact: parseFloat(parts[7].replace('%', '')),
      content: parts[8]
    });
  });
  
  return events;
};
