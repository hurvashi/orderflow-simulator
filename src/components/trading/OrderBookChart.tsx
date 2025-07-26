import React, { useMemo } from 'react';
import { OrderBook as OrderBookType } from '@/types/trading';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer, ReferenceLine } from 'recharts';
import { cn } from '@/lib/utils';

interface OrderBookChartProps {
  orderbook: OrderBookType;
  venue: string;
  symbol: string;
  className?: string;
}

interface ChartDataPoint {
  price: number;
  bidDepth: number;
  askDepth: number;
  cumulativeBidSize: number;
  cumulativeAskSize: number;
  side: 'bid' | 'ask' | 'spread';
}

const chartConfig = {
  bidDepth: {
    label: "Bid Depth",
    color: "hsl(var(--buy-primary))",
  },
  askDepth: {
    label: "Ask Depth", 
    color: "hsl(var(--sell-primary))",
  },
};

export const OrderBookChart: React.FC<OrderBookChartProps> = ({
  orderbook,
  venue,
  symbol,
  className
}) => {
  const chartData = useMemo(() => {
    if (!orderbook.bids.length || !orderbook.asks.length) return [];

    // Take top 20 levels for better visualization
    const topBids = orderbook.bids.slice(0, 20);
    const topAsks = orderbook.asks.slice(0, 20);

    // Calculate cumulative sizes for depth visualization
    let cumulativeBidSize = 0;
    const bidData: ChartDataPoint[] = topBids.map(bid => {
      cumulativeBidSize += Number(bid.size);
      return {
        price: Number(bid.price),
        bidDepth: cumulativeBidSize,
        askDepth: 0,
        cumulativeBidSize,
        cumulativeAskSize: 0,
        side: 'bid' as const
      };
    }).reverse(); // Reverse to show lowest prices first

    let cumulativeAskSize = 0;
    const askData: ChartDataPoint[] = topAsks.map(ask => {
      cumulativeAskSize += Number(ask.size);
      return {
        price: Number(ask.price),
        bidDepth: 0,
        askDepth: cumulativeAskSize,
        cumulativeBidSize: 0,
        cumulativeAskSize,
        side: 'ask' as const
      };
    });

    // Combine and sort by price
    const combined = [...bidData, ...askData].sort((a, b) => a.price - b.price);
    
    // Add spread marker
    const bestBid = Number(topBids[0]?.price) || 0;
    const bestAsk = Number(topAsks[0]?.price) || 0;
    const spreadPrice = (bestBid + bestAsk) / 2;
    
    combined.push({
      price: spreadPrice,
      bidDepth: 0,
      askDepth: 0,
      cumulativeBidSize: 0,
      cumulativeAskSize: 0,
      side: 'spread' as const
    });

    return combined.sort((a, b) => a.price - b.price);
  }, [orderbook]);

  const bestBid = Number(orderbook.bids[0]?.price) || 0;
  const bestAsk = Number(orderbook.asks[0]?.price) || 0;
  const spread = bestAsk - bestBid;
  const spreadPercent = ((spread / bestBid) * 100) || 0;

  if (!chartData.length) {
    return (
      <Card className={cn("bg-trading-surface border-trading-border", className)}>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Depth Chart</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-64 text-muted-foreground">
            No orderbook data available
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={cn("bg-trading-surface border-trading-border", className)}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold">
            Depth Chart
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
      
      <CardContent className="p-0">
        <div className="h-[400px] w-full">
          <ChartContainer config={chartConfig} className="w-full h-full">
            <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
              <defs>
                <linearGradient id="bidGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--buy-primary))" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="hsl(var(--buy-primary))" stopOpacity={0.05}/>
                </linearGradient>
                <linearGradient id="askGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--sell-primary))" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="hsl(var(--sell-primary))" stopOpacity={0.05}/>
                </linearGradient>
              </defs>
              
              <XAxis 
                dataKey="price"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }}
                tickFormatter={(value) => Number(value).toFixed(1)}
              />
              <YAxis 
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }}
                tickFormatter={(value) => Number(value).toFixed(2)}
              />
              
              {/* Spread reference line */}
              <ReferenceLine 
                x={(bestBid + bestAsk) / 2} 
                stroke="hsl(var(--gold-accent))" 
                strokeDasharray="2 2"
                strokeWidth={1}
              />
              
              <Area
                type="stepAfter"
                dataKey="bidDepth"
                stroke="hsl(var(--buy-primary))"
                strokeWidth={2}
                fill="url(#bidGradient)"
                fillOpacity={1}
              />
              
              <Area
                type="stepBefore"
                dataKey="askDepth"
                stroke="hsl(var(--sell-primary))"
                strokeWidth={2}
                fill="url(#askGradient)"
                fillOpacity={1}
              />
              
              <ChartTooltip
                content={<ChartTooltipContent 
                  formatter={(value, name) => [
                    Number(value).toFixed(4),
                    name === 'bidDepth' ? 'Cumulative Bids' : 'Cumulative Asks'
                  ]}
                  labelFormatter={(value) => `Price: $${Number(value).toFixed(2)}`}
                />}
              />
            </AreaChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>
        
        {/* Legend */}
        <div className="flex items-center justify-center gap-6 p-4 border-t border-trading-border">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-buy-primary rounded"></div>
            <span className="text-sm text-muted-foreground">Bids (Buy Orders)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-sell-primary rounded"></div>
            <span className="text-sm text-muted-foreground">Asks (Sell Orders)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-2 border-b-2 border-dashed border-gold-accent"></div>
            <span className="text-sm text-muted-foreground">Spread</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};