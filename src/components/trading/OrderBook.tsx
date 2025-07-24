
import React, { useMemo } from 'react';
import { OrderBook as OrderBookType, OrderBookLevel } from '@/types/trading';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface OrderBookProps {
  orderbook: OrderBookType;
  venue: string;
  symbol: string;
  simulatedOrder?: {
    side: 'Buy' | 'Sell';
    price: number;
    quantity: number;
    position?: number;
  };
}

const OrderBookRow: React.FC<{
  level: OrderBookLevel;
  side: 'bid' | 'ask';
  index: number;
  maxSize: number;
  isSimulated?: boolean;
}> = ({ level, side, index, maxSize, isSimulated }) => {
  const percentage = (level.size / maxSize) * 100;
  const isBid = side === 'bid';
  
  return (
    <div
      className={cn(
        'orderbook-row relative flex items-center justify-between px-3 py-1 text-sm',
        'border-l-2 transition-all duration-200',
        isSimulated && 'ring-2 ring-gold-accent animate-pulse',
        isBid ? 'border-l-buy-primary' : 'border-l-sell-primary'
      )}
    >
      {/* Background bar showing relative size */}
      <div
        className={cn(
          'absolute inset-0 opacity-20',
          isBid ? 'bg-buy-primary' : 'bg-sell-primary'
        )}
        style={{
          width: `${percentage}%`,
          right: isBid ? 'auto' : '0',
          left: isBid ? '0' : 'auto'
        }}
      />
      
      {/* Content */}
      <div className="relative z-10 flex items-center justify-between w-full">
        <span
          className={cn(
            'font-mono font-medium text-xs sm:text-sm',
            isBid ? 'text-buy-primary' : 'text-sell-primary'
          )}
        >
          {Number(level.price).toFixed(2)}
        </span>
        
        <span className="quantity-display text-xs sm:text-sm">
          {Number(level.size).toFixed(4)}
        </span>
        
        {level.total && (
          <span className="quantity-display text-xs hidden md:inline">
            {Number(level.total).toFixed(4)}
          </span>
        )}
      </div>
      
      {isSimulated && (
        <Badge
          variant="secondary"
          className="absolute -right-2 bg-gold-accent text-gold-accent-foreground text-xs"
        >
          SIM
        </Badge>
      )}
    </div>
  );
};

export const OrderBook: React.FC<OrderBookProps> = ({
  orderbook,
  venue,
  symbol,
  simulatedOrder
}) => {
  const { processedBids, processedAsks, maxSize } = useMemo(() => {
    // Calculate running totals
    let bidTotal = 0;
    const bidsWithTotal = orderbook.bids.slice(0, 15).map(bid => {
      bidTotal += bid.size;
      return { ...bid, total: bidTotal };
    });
    
    let askTotal = 0;
    const asksWithTotal = orderbook.asks.slice(0, 15).map(ask => {
      askTotal += ask.size;
      return { ...ask, total: askTotal };
    });
    
    // Find max size for visualization
    const allSizes = [...bidsWithTotal, ...asksWithTotal].map(level => level.size);
    const maxSize = Math.max(...allSizes);
    
    return {
      processedBids: bidsWithTotal,
      processedAsks: asksWithTotal.reverse(), // Reverse asks to show highest first
      maxSize
    };
  }, [orderbook]);

  const bestBid = Number(processedBids[0]?.price) || 0;
  const bestAsk = Number(processedAsks[processedAsks.length - 1]?.price) || 0;
  const spread = bestAsk - bestBid;
  const spreadPercent = ((spread / bestBid) * 100) || 0;

  return (
    <Card className="bg-trading-surface border-trading-border h-fit">
      <CardHeader className="pb-3 flex-shrink-0">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold">
            Order Book
          </CardTitle>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs hidden sm:inline-flex">
              {venue}
            </Badge>
            <Badge variant="outline" className="text-xs hidden sm:inline-flex">
              {symbol}
            </Badge>
          </div>
        </div>
        
        {/* Spread Info */}
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span className="truncate">Spread: {spread.toFixed(2)}</span>
          <span>({spreadPercent.toFixed(3)}%)</span>
        </div>
      </CardHeader>
      
      <CardContent className="p-0 flex flex-col" style={{ height: 'calc(100vh - 400px)', minHeight: '600px', maxHeight: '800px' }}>
        {/* Header */}
        <div className="flex items-center justify-between px-3 py-2 border-b border-trading-border text-xs text-muted-foreground font-medium flex-shrink-0">
          <span>Price</span>
          <span className="hidden sm:inline">Size</span>
          <span className="sm:hidden">Qty</span>
          <span className="hidden md:inline">Total</span>
        </div>
        
        {/* Asks (Sell Orders) */}
        <div className="flex-1 overflow-y-auto" style={{ maxHeight: 'calc(50% - 40px)' }}>
          {processedAsks.map((ask, index) => (
            <OrderBookRow
              key={`ask-${index}`}
              level={ask}
              side="ask"
              index={index}
              maxSize={maxSize}
              isSimulated={
                simulatedOrder?.side === 'Sell' &&
                simulatedOrder.position === (processedAsks.length - 1 - index)
              }
            />
          ))}
        </div>
        
        {/* Spread Indicator */}
        <div className="flex items-center justify-center py-3 bg-trading-hover border-y border-trading-border flex-shrink-0">
          <div className="text-center">
            <div className="text-sm sm:text-lg font-mono font-bold">
              <span className="text-buy-primary">{bestBid.toFixed(2)}</span>
              <span className="text-muted-foreground mx-1 sm:mx-2">|</span>
              <span className="text-sell-primary">{bestAsk.toFixed(2)}</span>
            </div>
            <div className="text-xs text-muted-foreground">
              Best Bid | Best Ask
            </div>
          </div>
        </div>
        
        {/* Bids (Buy Orders) */}
        <div className="flex-1 overflow-y-auto" style={{ maxHeight: 'calc(50% - 40px)' }}>
          {processedBids.map((bid, index) => (
            <OrderBookRow
              key={`bid-${index}`}
              level={bid}
              side="bid"
              index={index}
              maxSize={maxSize}
              isSimulated={
                simulatedOrder?.side === 'Buy' &&
                simulatedOrder.position === index
              }
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
