import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MarketData } from '@/types/trading';
import { cn } from '@/lib/utils';
import { TrendingUp, TrendingDown, Activity, Volume2 } from 'lucide-react';

interface MarketInfoProps {
  marketData: MarketData | null;
  isConnected: boolean;
  className?: string;
}

export const MarketInfo: React.FC<MarketInfoProps> = ({ 
  marketData, 
  isConnected, 
  className 
}) => {
  if (!marketData) {
    return (
      <Card className={cn("bg-trading-surface border-trading-border", className)}>
        <CardContent className="p-4">
          <div className="flex items-center justify-center h-20">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Activity className="w-4 h-4 animate-pulse" />
              <span>Connecting to market data...</span>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const { ticker } = marketData;
  const isPositive = ticker.changePercent24h >= 0;
  
  return (
    <Card className={cn("bg-trading-surface border-trading-border", className)}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-semibold">{ticker.symbol}</h3>
            <Badge 
              variant={isConnected ? "default" : "destructive"}
              className="text-xs"
            >
              {isConnected ? 'LIVE' : 'DISCONNECTED'}
            </Badge>
          </div>
          <Badge variant="outline" className="text-xs">
            {marketData.venue}
          </Badge>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {/* Last Price */}
          <div className="space-y-1">
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              {isPositive ? (
                <TrendingUp className="w-3 h-3 text-buy-primary" />
              ) : (
                <TrendingDown className="w-3 h-3 text-sell-primary" />
              )}
              <span>Last Price</span>
            </div>
            <div className="text-xl font-mono font-bold">
              ${ticker.lastPrice.toFixed(2)}
            </div>
          </div>

          {/* 24h Change */}
          <div className="space-y-1">
            <div className="text-sm text-muted-foreground">24h Change</div>
            <div className={cn(
              "font-mono font-semibold",
              isPositive ? "text-buy-primary" : "text-sell-primary"
            )}>
              <div>${ticker.change24h.toFixed(2)}</div>
              <div className="text-sm">
                {isPositive ? '+' : ''}{ticker.changePercent24h.toFixed(2)}%
              </div>
            </div>
          </div>

          {/* 24h Volume */}
          <div className="space-y-1">
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <Volume2 className="w-3 h-3" />
              <span>24h Volume</span>
            </div>
            <div className="font-mono font-semibold">
              ${(ticker.volume24h / 1000000).toFixed(2)}M
            </div>
          </div>

          {/* 24h High/Low */}
          <div className="space-y-1">
            <div className="text-sm text-muted-foreground">24h Range</div>
            <div className="space-y-1">
              <div className="text-sm font-mono">
                <span className="text-sell-primary">L</span>: ${ticker.low24h.toFixed(2)}
              </div>
              <div className="text-sm font-mono">
                <span className="text-buy-primary">H</span>: ${ticker.high24h.toFixed(2)}
              </div>
            </div>
          </div>
        </div>

        {/* Spread Info */}
        {marketData.orderbook && (
          <div className="mt-4 pt-3 border-t border-trading-border">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Spread</span>
              <span className="font-mono">
                {(marketData.orderbook.asks[0]?.price - marketData.orderbook.bids[0]?.price).toFixed(2)}
                <span className="text-muted-foreground ml-1">
                  ({(((marketData.orderbook.asks[0]?.price - marketData.orderbook.bids[0]?.price) / marketData.orderbook.bids[0]?.price) * 100).toFixed(3)}%)
                </span>
              </span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};