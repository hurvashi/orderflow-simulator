export interface OrderBookLevel {
  price: number;
  size: number;
  total?: number;
}

export interface OrderBook {
  bids: OrderBookLevel[];
  asks: OrderBookLevel[];
  timestamp: number;
}

export interface Ticker {
  symbol: string;
  lastPrice: number;
  change24h: number;
  changePercent24h: number;
  volume24h: number;
  high24h: number;
  low24h: number;
}

export interface OrderFormData {
  venue: 'OKX' | 'Bybit' | 'Deribit';
  symbol: string;
  orderType: 'Market' | 'Limit';
  side: 'Buy' | 'Sell';
  price?: number;
  quantity: number;
  timing: 'immediate' | '5s' | '10s' | '30s';
}

export interface OrderSimulation {
  orderId: string;
  estimatedFillPercentage: number;
  marketImpact: number;
  slippage: number;
  timeToFill?: number;
  position?: number; // Position in orderbook
}

export interface MarketData {
  symbol: string;
  venue: string;
  orderbook: OrderBook;
  ticker: Ticker;
  lastUpdate: number;
}

export type VenueType = 'OKX' | 'Bybit' | 'Deribit';

export interface WebSocketMessage {
  type: 'orderbook' | 'ticker' | 'trade';
  data: any;
  venue: VenueType;
  timestamp: number;
}