import React, { useMemo } from 'react';
import { OrderBook as OrderBookType } from '@/types/trading';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from 'recharts';
import { cn } from '@/lib/utils';

interface VolumeChartProps {
  orderbook: OrderBookType;
  venue: string;
  symbol: string;
  className?: string;
}

interface VolumeDataPoint {
  priceLevel: string;
  bidVolume: number;
  askVolume: number;
  price: number;
}

const chartConfig = {
  bidVolume: {
    label: "Bid Volume",
    color: "hsl(var(--buy-primary))",
  },
  askVolume: {
    label: "Ask Volume",
    color: "hsl(var(--sell-primary))",
  },
};

export const VolumeChart: React.FC<VolumeChartProps> = ({
  orderbook,
  venue,
  symbol,
  className
}) => {
  const chartData = useMemo(() => {
    if (!orderbook.bids.length || !orderbook.asks.length) return [];

    // Take top 15 levels for volume visualization
    const topBids = orderbook.bids.slice(0, 15);
    const topAsks = orderbook.asks.slice(0, 15);

    const volumeData: VolumeDataPoint[] = [];

    // Process bids (show as negative values for visual distinction)
    topBids.reverse().forEach((bid, index) => {
      volumeData.push({
        priceLevel: Number(bid.price).toFixed(2),
        bidVolume: Number(bid.size),
        askVolume: 0,
        price: Number(bid.price)
      });
    });

    // Process asks
    topAsks.forEach((ask, index) => {
      volumeData.push({
        priceLevel: Number(ask.price).toFixed(2),
        bidVolume: 0,
        askVolume: Number(ask.size),
        price: Number(ask.price)
      });
    });

    return volumeData.sort((a, b) => a.price - b.price);
  }, [orderbook]);

  const maxVolume = useMemo(() => {
    if (!chartData.length) return 0;
    return Math.max(...chartData.map(d => Math.max(d.bidVolume, d.askVolume)));
  }, [chartData]);

  if (!chartData.length) {
    return (
      <Card className={cn("bg-trading-surface border-trading-border", className)}>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Volume by Price</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-64 text-muted-foreground">
            No volume data available
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
            Volume by Price
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
        
        <div className="text-sm text-muted-foreground">
          Max Volume: {maxVolume.toFixed(4)}
        </div>
      </CardHeader>
      
      <CardContent className="p-0">
        <ChartContainer config={chartConfig} className="h-[400px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart 
              data={chartData} 
              margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
              layout="horizontal"
            >
              <XAxis 
                type="number"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }}
                tickFormatter={(value) => Number(value).toFixed(2)}
              />
              <YAxis 
                type="category"
                dataKey="priceLevel"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }}
                width={60}
              />
              
              <Bar
                dataKey="bidVolume"
                fill="hsl(var(--buy-primary))"
                opacity={0.8}
                radius={[0, 2, 2, 0]}
              />
              
              <Bar
                dataKey="askVolume"
                fill="hsl(var(--sell-primary))"
                opacity={0.8}
                radius={[0, 2, 2, 0]}
              />
              
              <ChartTooltip
                content={<ChartTooltipContent 
                  formatter={(value, name) => [
                    Number(value).toFixed(4),
                    name === 'bidVolume' ? 'Bid Volume' : 'Ask Volume'
                  ]}
                  labelFormatter={(label) => `Price: $${label}`}
                />}
              />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
        
        {/* Legend */}
        <div className="flex items-center justify-center gap-6 p-4 border-t border-trading-border">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-buy-primary rounded"></div>
            <span className="text-sm text-muted-foreground">Bid Volume</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-sell-primary rounded"></div>
            <span className="text-sm text-muted-foreground">Ask Volume</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};