# CR 證券交易所模擬系統

這是一個基於 React + TypeScript + Tailwind CSS 的虛擬證券交易所模擬系統。

## 功能特色

- **24小時全時模擬**：市場持續運作，非交易時間顯示收盤狀態。
- **即時行情**：模擬股價波動、成交量、漲跌幅。
- **權值股指數**：根據前300大市值股票計算加權指數。
- **隨機事件**：每日隨機觸發市場事件，影響特定類股或全體市場。
- **監控機制**：自動標記「注意股」與「丟棄股」，並實施相應的市場機制。
- **技術分析**：提供分時走勢圖與日線圖。
- **高效能渲染**：使用虛擬化列表 (Virtualization) 處理大量股票數據。

## 技術棧

- **前端框架**: React 18
- **語言**: TypeScript
- **樣式**: Tailwind CSS (Glassmorphism 設計風格)
- **圖表**: Recharts
- **效能優化**: react-window (虛擬列表)
- **圖標**: Lucide React

## 安裝與執行

1. 安裝依賴：
   ```bash
   npm install
   ```

2. 啟動開發伺服器：
   ```bash
   npm run dev
   ```

3. 建置生產版本：
   ```bash
   npm run build
   ```

## 專案結構

- `src/components`: UI 元件 (Header, Sidebar, StockList, StockModal)
- `src/hooks`: 自定義 Hooks (useMarketSimulation, useElementSize)
- `src/utils`: 工具函式 (模擬運算, 數據解析)
- `src/data`: 初始模擬數據
- `src/types.ts`: TypeScript 類型定義

## 模擬機制說明

- **交易時間**: 09:00 - 13:30
- **漲跌幅限制**: +/- 10%
- **注意股**: 當日漲跌幅超過 +/- 7%
- **丟棄股**: 連續 3 日列為注意股，將受到流動性懲罰 (成交量減半、波動減半)
