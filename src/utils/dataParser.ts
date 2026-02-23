import { Stock, MarketEvent } from '../types';

export const parseStocks = (rawData: string): Stock[] => {
  const stocks: Stock[] = [];
  const items = rawData.split('----------------------------------------------------------------------').filter(i => i.trim());

  items.forEach(item => {
    const lines = item.trim().split('\n');
    const stock: any = {
      history: [],
      currentPrice: 0,
      openPrice: 0,
      highPrice: 0,
      lowPrice: 0,
      previousClose: 0,
      volume: 0,
      change: 0,
      changePercent: 0,
      isLimitUp: false,
      isLimitDown: false,
      isAttention: false,
      isDisposition: false,
      dispositionDaysLeft: 0,
      attentionDays: 0,
      foreignBuy: 0,
      dealerBuy: 0,
      investmentTrustBuy: 0,
      retailBuy: 0,
    };

    lines.forEach(line => {
      const [key, value] = line.split('：').map(s => s.trim());
      if (!key || !value) return;

      switch (key) {
        case '代碼': stock.id = value; break;
        case '股票名稱': stock.name = value; break;
        case '所屬類股': stock.category = value; break;
        case '資本額': stock.capital = parseFloat(value.replace(/[^0-9.]/g, '')); break;
        case '初始上市股價': 
          stock.initialPrice = parseFloat(value); 
          stock.currentPrice = stock.initialPrice;
          stock.previousClose = stock.initialPrice;
          stock.openPrice = stock.initialPrice;
          stock.highPrice = stock.initialPrice;
          stock.lowPrice = stock.initialPrice;
          break;
        case '總發行股數': stock.totalShares = parseInt(value.split(' ')[0]); break;
        case '市值': stock.marketCap = parseInt(value); break;
        case '本益比': stock.peRatio = parseFloat(value); break;
        case '股價淨值比': stock.pbRatio = parseFloat(value); break;
        case '每股淨值': stock.nav = parseFloat(value); break;
        case '每股盈餘': stock.eps = parseFloat(value); break;
        case '殖利率': stock.yieldRate = parseFloat(value.replace('%', '')); break;
        case '公司簡介': stock.description = value; break;
      }
    });

    if (stock.id) {
      stocks.push(stock as Stock);
    }
  });

  return stocks;
};

export const parseEvents = (rawData: string): MarketEvent[] => {
  const events: MarketEvent[] = [];
  const items = rawData.split('------------------------------------------------------------------------').filter(i => i.trim());

  items.forEach(item => {
    const lines = item.trim().split('\n');
    const event: any = {};

    lines.forEach(line => {
      const [key, value] = line.split('：').map(s => s.trim());
      if (!key || !value) return;

      switch (key) {
        case '事件編號': event.id = value; break;
        case '影響範圍': 
          if (value.includes('個股')) event.scope = 'Individual';
          else if (value.includes('類股')) event.scope = 'Sector';
          else event.scope = 'Global';
          break;
        case '事件性質': event.nature = value.includes('利多') ? 'Bullish' : 'Bearish'; break;
        case '事件來源': event.source = value.includes('國內') ? 'Domestic' : 'International'; break;
        case '事件稀有度': 
          if (value.includes('黑天鵝')) event.rarity = 'BlackSwan';
          else if (value.includes('重大')) event.rarity = 'Major';
          else event.rarity = 'Common';
          break;
        case '回合觸發': 
          if (value.includes('每日')) event.trigger = 'Daily';
          else if (value.includes('每季')) event.trigger = 'Quarterly';
          else event.trigger = 'Conditional';
          break;
        case '觸發條件': event.condition = value; break;
        case '事件類型': event.type = value; break;
        case '數值影響': event.impact = parseFloat(value.replace(/[^0-9.-]/g, '')); break;
        case '事件內容': event.description = value; break;
      }
    });

    if (event.id) {
      events.push(event as MarketEvent);
    }
  });

  return events;
};
