import { useState, useEffect, useCallback, useRef } from 'react';
import { MarketData, VenueType, OrderFormData, OrderSimulation } from '@/types/trading';
import { tradingApi } from '@/services/tradingApi';

export const useMarketData = (venue: VenueType, symbol: string) => {
  const [marketData, setMarketData] = useState<MarketData | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const unsubscribeRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    setIsConnected(false);
    setError(null);

    try {
      // Clean up previous subscription
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
      }

      // Subscribe to market data
      unsubscribeRef.current = tradingApi.subscribe(
        venue,
        symbol,
        (data: MarketData) => {
          setMarketData(data);
          setIsConnected(true);
          setError(null);
        }
      );

      // Set connection timeout
      const timeout = setTimeout(() => {
        if (!isConnected) {
          setError(`Failed to connect to ${venue} for ${symbol}`);
        }
      }, 10000);

      return () => {
        clearTimeout(timeout);
        if (unsubscribeRef.current) {
          unsubscribeRef.current();
        }
      };
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Connection failed');
    }
  }, [venue, symbol]);

  const simulateOrder = useCallback((orderData: OrderFormData): OrderSimulation => {
    if (!marketData) {
      throw new Error('No market data available for simulation');
    }

    const { orderbook } = marketData;
    const { side, price, quantity, orderType } = orderData;

    // For market orders, use best available price
    let executionPrice = price;
    if (orderType === 'Market') {
      executionPrice = side === 'Buy' 
        ? orderbook.asks[0]?.price 
        : orderbook.bids[0]?.price;
    }

    if (!executionPrice) {
      throw new Error('Unable to determine execution price');
    }

    // Calculate position in orderbook
    let position = 0;
    let totalAvailable = 0;
    let estimatedFillPercentage = 0;
    let marketImpact = 0;
    let slippage = 0;

    const levels = side === 'Buy' ? orderbook.asks : orderbook.bids;
    const midPrice = (orderbook.bids[0]?.price + orderbook.asks[0]?.price) / 2;

    if (orderType === 'Limit') {
      // For limit orders, find position in orderbook
      for (let i = 0; i < levels.length; i++) {
        const level = levels[i];
        const priceMatch = side === 'Buy' 
          ? level.price >= executionPrice 
          : level.price <= executionPrice;

        if (priceMatch) {
          position = i;
          totalAvailable += level.size;
          
          if (totalAvailable >= quantity) {
            estimatedFillPercentage = 100;
            break;
          }
        }
      }

      if (estimatedFillPercentage < 100) {
        estimatedFillPercentage = (totalAvailable / quantity) * 100;
      }

      // Calculate slippage for limit orders
      slippage = Math.abs((executionPrice - midPrice) / midPrice) * 100;
    } else {
      // For market orders, calculate how much of the orderbook we consume
      let remainingQuantity = quantity;
      let totalCost = 0;
      let weightedAveragePrice = 0;

      for (const level of levels) {
        if (remainingQuantity <= 0) break;

        const sizeToTake = Math.min(level.size, remainingQuantity);
        totalCost += sizeToTake * level.price;
        remainingQuantity -= sizeToTake;
        position++;
      }

      weightedAveragePrice = totalCost / (quantity - remainingQuantity);
      estimatedFillPercentage = ((quantity - remainingQuantity) / quantity) * 100;
      slippage = Math.abs((weightedAveragePrice - midPrice) / midPrice) * 100;
    }

    // Calculate market impact (simplified)
    const orderValue = quantity * executionPrice;
    const totalBookValue = levels.slice(0, 10).reduce((sum, level) => 
      sum + (level.price * level.size), 0
    );
    marketImpact = (orderValue / totalBookValue) * 100;

    // Estimate time to fill (simplified)
    let timeToFill: number | undefined;
    if (orderType === 'Limit') {
      // Simplified time estimation based on position and market activity
      const baseTime = position * 0.5; // Assume 0.5s per level ahead
      const marketVolume = marketData.ticker?.volume24h || 1000000;
      const volumeMultiplier = Math.max(0.1, 1000000 / marketVolume);
      timeToFill = Math.round(baseTime * volumeMultiplier);
    }

    return {
      orderId: `sim_${Date.now()}`,
      estimatedFillPercentage: Math.min(estimatedFillPercentage, 100),
      marketImpact,
      slippage,
      timeToFill,
      position
    };
  }, [marketData]);

  return {
    marketData,
    isConnected,
    error,
    simulateOrder
  };
};

export const useMultiVenueData = () => {
  const [activeVenue, setActiveVenue] = useState<VenueType>('OKX');
  const [activeSymbol, setActiveSymbol] = useState('BTC-USDT');
  
  const okxData = useMarketData('OKX', activeSymbol);
  const bybitData = useMarketData('Bybit', activeSymbol.replace('-', ''));
  const deribitData = useMarketData('Deribit', 'BTC-PERPETUAL');

  const allVenueData = {
    OKX: okxData,
    Bybit: bybitData,
    Deribit: deribitData
  };

  const activeData = allVenueData[activeVenue];

  return {
    activeVenue,
    setActiveVenue,
    activeSymbol,
    setActiveSymbol,
    activeData,
    allVenueData
  };
};