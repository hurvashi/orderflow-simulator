import { OrderBook, Ticker, VenueType, MarketData } from '@/types/trading';

class TradingApiService {
  private wsConnections: Map<string, WebSocket> = new Map();
  private subscribers: Map<string, Set<(data: MarketData) => void>> = new Map();

  // OKX WebSocket API
  async connectOKX(symbol: string = 'BTC-USDT') {
    const ws = new WebSocket('wss://ws.okx.com:8443/ws/v5/public');
    const key = `OKX_${symbol}`;
    
    ws.onopen = () => {
      console.log('OKX WebSocket connected');
      // Subscribe to orderbook
      ws.send(JSON.stringify({
        op: 'subscribe',
        args: [{
          channel: 'books',
          instId: symbol
        }]
      }));
      
      // Subscribe to ticker
      ws.send(JSON.stringify({
        op: 'subscribe',
        args: [{
          channel: 'tickers',
          instId: symbol
        }]
      }));
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.data) {
          this.handleOKXData(data, symbol);
        }
      } catch (error) {
        console.error('Error parsing OKX data:', error);
      }
    };

    ws.onerror = (error) => {
      console.error('OKX WebSocket error:', error);
    };

    ws.onclose = () => {
      console.log('OKX WebSocket closed');
      // Attempt to reconnect after 5 seconds
      setTimeout(() => this.connectOKX(symbol), 5000);
    };

    this.wsConnections.set(key, ws);
  }

  // Bybit WebSocket API
  async connectBybit(symbol: string = 'BTCUSDT') {
    const ws = new WebSocket('wss://stream.bybit.com/v5/public/linear');
    const key = `Bybit_${symbol}`;
    
    ws.onopen = () => {
      console.log('Bybit WebSocket connected');
      // Subscribe to orderbook
      ws.send(JSON.stringify({
        op: 'subscribe',
        args: [`orderbook.1.${symbol}`]
      }));
      
      // Subscribe to ticker
      ws.send(JSON.stringify({
        op: 'subscribe',
        args: [`tickers.${symbol}`]
      }));
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.data) {
          this.handleBybitData(data, symbol);
        }
      } catch (error) {
        console.error('Error parsing Bybit data:', error);
      }
    };

    ws.onerror = (error) => {
      console.error('Bybit WebSocket error:', error);
    };

    ws.onclose = () => {
      console.log('Bybit WebSocket closed');
      setTimeout(() => this.connectBybit(symbol), 5000);
    };

    this.wsConnections.set(key, ws);
  }

  // Deribit WebSocket API
  async connectDeribit(symbol: string = 'BTC-PERPETUAL') {
    const ws = new WebSocket('wss://www.deribit.com/ws/api/v2');
    const key = `Deribit_${symbol}`;
    
    ws.onopen = () => {
      console.log('Deribit WebSocket connected');
      // Subscribe to orderbook
      ws.send(JSON.stringify({
        jsonrpc: '2.0',
        id: 1,
        method: 'public/subscribe',
        params: {
          channels: [`book.${symbol}.100ms`]
        }
      }));
      
      // Subscribe to ticker
      ws.send(JSON.stringify({
        jsonrpc: '2.0',
        id: 2,
        method: 'public/subscribe',
        params: {
          channels: [`ticker.${symbol}.100ms`]
        }
      }));
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.params) {
          this.handleDeribitData(data, symbol);
        }
      } catch (error) {
        console.error('Error parsing Deribit data:', error);
      }
    };

    this.wsConnections.set(key, ws);
  }

  private handleOKXData(data: any, symbol: string) {
    // Process OKX orderbook and ticker data
    if (data.data[0]) {
      const item = data.data[0];
      
      if (item.asks && item.bids) {
        // Orderbook data
        const orderbook: OrderBook = {
          bids: item.bids.map(([price, size]: [string, string]) => ({
            price: parseFloat(price),
            size: parseFloat(size)
          })),
          asks: item.asks.map(([price, size]: [string, string]) => ({
            price: parseFloat(price),
            size: parseFloat(size)
          })),
          timestamp: parseInt(item.ts)
        };

        this.notifySubscribers(`OKX_${symbol}`, {
          symbol,
          venue: 'OKX',
          orderbook,
          ticker: this.createMockTicker(symbol, parseFloat(item.asks[0]?.[0] || '0')),
          lastUpdate: Date.now()
        });
      }
    }
  }

  private handleBybitData(data: any, symbol: string) {
    // Process Bybit data
    if (data.data) {
      const item = data.data;
      
      if (item.b && item.a) {
        // Orderbook data
        const orderbook: OrderBook = {
          bids: item.b.map(([price, size]: [string, string]) => ({
            price: parseFloat(price),
            size: parseFloat(size)
          })),
          asks: item.a.map(([price, size]: [string, string]) => ({
            price: parseFloat(price),
            size: parseFloat(size)
          })),
          timestamp: item.ts
        };

        this.notifySubscribers(`Bybit_${symbol}`, {
          symbol,
          venue: 'Bybit',
          orderbook,
          ticker: this.createMockTicker(symbol, parseFloat(item.a[0]?.[0] || '0')),
          lastUpdate: Date.now()
        });
      }
    }
  }

  private handleDeribitData(data: any, symbol: string) {
    // Process Deribit data
    if (data.params && data.params.data) {
      const item = data.params.data;
      
      if (item.bids && item.asks) {
        const orderbook: OrderBook = {
          bids: item.bids.map(([price, size]: [number, number]) => ({
            price,
            size
          })),
          asks: item.asks.map(([price, size]: [number, number]) => ({
            price,
            size
          })),
          timestamp: item.timestamp
        };

        this.notifySubscribers(`Deribit_${symbol}`, {
          symbol,
          venue: 'Deribit',
          orderbook,
          ticker: this.createMockTicker(symbol, item.asks[0]?.[0] || 0),
          lastUpdate: Date.now()
        });
      }
    }
  }

  private createMockTicker(symbol: string, lastPrice: number): Ticker {
    // Create a mock ticker for demo purposes
    const change = (Math.random() - 0.5) * lastPrice * 0.05;
    const changePercent = (change / lastPrice) * 100;
    
    return {
      symbol,
      lastPrice,
      change24h: change,
      changePercent24h: changePercent,
      volume24h: Math.random() * 1000000,
      high24h: lastPrice * (1 + Math.random() * 0.05),
      low24h: lastPrice * (1 - Math.random() * 0.05)
    };
  }

  subscribe(venue: VenueType, symbol: string, callback: (data: MarketData) => void) {
    const key = `${venue}_${symbol}`;
    
    if (!this.subscribers.has(key)) {
      this.subscribers.set(key, new Set());
    }
    
    this.subscribers.get(key)!.add(callback);

    // Connect to the appropriate exchange
    switch (venue) {
      case 'OKX':
        this.connectOKX(symbol);
        break;
      case 'Bybit':
        this.connectBybit(symbol);
        break;
      case 'Deribit':
        this.connectDeribit(symbol);
        break;
    }

    // Return unsubscribe function
    return () => {
      this.subscribers.get(key)?.delete(callback);
    };
  }

  private notifySubscribers(key: string, data: MarketData) {
    this.subscribers.get(key)?.forEach(callback => callback(data));
  }

  disconnect(venue: VenueType, symbol: string) {
    const key = `${venue}_${symbol}`;
    const ws = this.wsConnections.get(key);
    
    if (ws) {
      ws.close();
      this.wsConnections.delete(key);
    }
    
    this.subscribers.delete(key);
  }

  disconnectAll() {
    this.wsConnections.forEach(ws => ws.close());
    this.wsConnections.clear();
    this.subscribers.clear();
  }
}

export const tradingApi = new TradingApiService();