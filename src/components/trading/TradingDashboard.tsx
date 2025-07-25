import React, { useState } from 'react';
import { OrderBook } from './OrderBook';
import { OrderBookChart } from './OrderBookChart';
import { VolumeChart } from './VolumeChart';
import { OrderForm } from './OrderForm';
import { MarketInfo } from './MarketInfo';
import { VenueSelector } from './VenueSelector';
import { useMultiVenueData } from '@/hooks/useMarketData';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { OrderFormData } from '@/types/trading';
import { cn } from '@/lib/utils';
import { BarChart3, Settings, RefreshCw, TrendingUp, Activity } from 'lucide-react';

export const TradingDashboard: React.FC = () => {
  const {
    activeVenue,
    setActiveVenue,
    activeSymbol,
    setActiveSymbol,
    activeData,
    allVenueData
  } = useMultiVenueData();

  const [simulatedOrder, setSimulatedOrder] = useState<any>(null);

  const connectionStatus = {
    OKX: allVenueData.OKX.isConnected,
    Bybit: allVenueData.Bybit.isConnected,
    Deribit: allVenueData.Deribit.isConnected
  };

  const handleOrderSimulation = (orderData: OrderFormData) => {
    try {
      const simulation = activeData.simulateOrder(orderData);
      
      // Create simulated order visualization data
      const simulatedOrderViz = {
        side: orderData.side,
        price: orderData.price || (orderData.side === 'Buy' 
          ? activeData.marketData?.orderbook.bids[0]?.price 
          : activeData.marketData?.orderbook.asks[0]?.price) || 0,
        quantity: orderData.quantity,
        position: simulation.position
      };
      
      setSimulatedOrder(simulatedOrderViz);
      
      return simulation;
    } catch (error) {
      console.error('Order simulation error:', error);
      throw error;
    }
  };

  const handleSymbolChange = (symbol: string) => {
    setActiveSymbol(symbol);
    setSimulatedOrder(null); // Clear simulation when symbol changes
  };

  const handleRefresh = () => {
    // Force reconnection
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-background p-2 sm:p-4 lg:p-6 space-y-4 lg:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-6 h-6 sm:w-8 sm:h-8 text-blue-accent" />
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold">OrderBook Pro</h1>
          </div>
          <Badge variant="outline" className="text-xs hidden sm:inline-flex">
            Real-Time Trading Simulator
          </Badge>
        </div>
        
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Button variant="outline" size="sm" onClick={handleRefresh} className="flex-1 sm:flex-none">
            <RefreshCw className="w-4 h-4 sm:mr-2" />
            <span className="hidden sm:inline">Refresh</span>
          </Button>
          <Button variant="outline" size="sm" className="flex-1 sm:flex-none">
            <Settings className="w-4 h-4 sm:mr-2" />
            <span className="hidden sm:inline">Settings</span>
          </Button>
        </div>
      </div>

      {/* Symbol Input & Status */}
      <Card className="bg-trading-surface border-trading-border">
        <CardContent className="p-3 sm:p-4">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 mb-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full lg:w-auto">
              <div className="space-y-1 w-full sm:w-auto">
                <Label htmlFor="symbol" className="text-sm">Trading Symbol</Label>
                <Input
                  id="symbol"
                  value={activeSymbol}
                  onChange={(e) => handleSymbolChange(e.target.value)}
                  placeholder="BTC-USDT"
                  className="w-full sm:w-32 font-mono"
                />
              </div>
              
              <div className="flex flex-wrap items-center gap-2 text-sm">
                <Activity className="w-4 h-4 text-blue-accent" />
                <span className="text-muted-foreground">Active:</span>
                <Badge variant="outline">{activeVenue}</Badge>
                <Badge 
                  variant={activeData.isConnected ? "default" : "destructive"}
                  className="text-xs"
                >
                  {activeData.isConnected ? 'CONNECTED' : 'DISCONNECTED'}
                </Badge>
              </div>
            </div>
            
            {activeData.error && (
              <div className="text-sm text-sell-primary bg-sell-primary/10 px-3 py-1 rounded max-w-full overflow-hidden">
                <div className="truncate">{activeData.error}</div>
              </div>
            )}
          </div>

          <VenueSelector
            activeVenue={activeVenue}
            onVenueChange={setActiveVenue}
            connectionStatus={connectionStatus}
          />
        </CardContent>
      </Card>

      {/* Market Info */}
      <MarketInfo 
        marketData={activeData.marketData}
        isConnected={activeData.isConnected}
      />

      {/* Main Trading Interface */}
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-4 lg:gap-6">
        {/* Order Form */}
        <div className="order-1">
          <OrderForm
            marketData={activeData.marketData}
            onSimulateOrder={handleOrderSimulation}
          />
        </div>

        {/* Order Book Table */}
        <div className="order-2">
          {activeData.marketData ? (
            <OrderBook
              orderbook={activeData.marketData.orderbook}
              venue={activeData.marketData.venue}
              symbol={activeData.marketData.symbol}
              simulatedOrder={simulatedOrder}
            />
          ) : (
            <Card className="bg-trading-surface border-trading-border h-fit">
              <CardHeader>
                <CardTitle>Order Book</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-center h-64">
                  <div className="text-center space-y-2">
                    <Activity className="w-8 h-8 text-blue-accent mx-auto animate-pulse" />
                    <p className="text-muted-foreground text-sm">
                      Waiting for market data...
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Charts */}
        <div className="xl:col-span-2 order-3 grid grid-cols-1 lg:grid-cols-2 gap-4">
          {activeData.marketData ? (
            <>
              <OrderBookChart
                orderbook={activeData.marketData.orderbook}
                venue={activeData.marketData.venue}
                symbol={activeData.marketData.symbol}
              />
              <VolumeChart
                orderbook={activeData.marketData.orderbook}
                venue={activeData.marketData.venue}
                symbol={activeData.marketData.symbol}
              />
            </>
          ) : (
            <>
              <Card className="bg-trading-surface border-trading-border h-fit">
                <CardHeader>
                  <CardTitle>Depth Chart</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-center h-64">
                    <div className="text-center space-y-2">
                      <Activity className="w-8 h-8 text-blue-accent mx-auto animate-pulse" />
                      <p className="text-muted-foreground text-sm">Loading chart...</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-trading-surface border-trading-border h-fit">
                <CardHeader>
                  <CardTitle>Volume Chart</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-center h-64">
                    <div className="text-center space-y-2">
                      <Activity className="w-8 h-8 text-blue-accent mx-auto animate-pulse" />
                      <p className="text-muted-foreground text-sm">Loading chart...</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </div>
      </div>

      {/* Multi-Venue Comparison */}
      <Card className="bg-trading-surface border-trading-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-blue-accent" />
            Multi-Venue Comparison
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 lg:gap-4">
            {(['OKX', 'Bybit', 'Deribit'] as const).map((venue) => {
              const data = allVenueData[venue];
              const bestBid = Number(data.marketData?.orderbook.bids[0]?.price) || 0;
              const bestAsk = Number(data.marketData?.orderbook.asks[0]?.price) || 0;
              const spread = bestAsk - bestBid;
              
              return (
                <div
                  key={venue}
                  className={cn(
                    "p-3 lg:p-4 rounded border transition-colors",
                    venue === activeVenue 
                      ? "bg-blue-accent/10 border-blue-accent" 
                      : "bg-trading-hover border-trading-border"
                  )}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-sm lg:text-base">{venue}</h4>
                    <div className={cn(
                      "w-2 h-2 rounded-full flex-shrink-0",
                      data.isConnected ? "bg-buy-primary" : "bg-sell-primary"
                    )} />
                  </div>
                  
                  {data.marketData ? (
                    <div className="space-y-1 text-xs lg:text-sm">
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Bid:</span>
                        <span className="font-mono text-buy-primary truncate ml-2">
                          ${bestBid.toFixed(2)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Ask:</span>
                        <span className="font-mono text-sell-primary truncate ml-2">
                          ${bestAsk.toFixed(2)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Spread:</span>
                        <span className="font-mono truncate ml-2">
                          ${spread.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="text-xs lg:text-sm text-muted-foreground">
                      {data.isConnected ? 'Loading...' : 'Disconnected'}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};