import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { OrderFormData, OrderSimulation, MarketData } from '@/types/trading';
import { cn } from '@/lib/utils';
import { Calculator, TrendingUp, Clock, AlertTriangle } from 'lucide-react';

interface OrderFormProps {
  marketData: MarketData | null;
  onSimulateOrder: (order: OrderFormData) => OrderSimulation;
  activeVenue: string;
  activeSymbol: string;
  onVenueChange: (venue: string) => void;
  onSymbolChange: (symbol: string) => void;
  className?: string;
}

export const OrderForm: React.FC<OrderFormProps> = ({
  marketData,
  onSimulateOrder,
  activeVenue,
  activeSymbol,
  onVenueChange,
  onSymbolChange,
  className
}) => {
  const [formData, setFormData] = useState<OrderFormData>({
    venue: activeVenue as any,
    symbol: activeSymbol,
    orderType: 'Limit',
    side: 'Buy',
    price: undefined,
    quantity: 0,
    timing: 'immediate'
  });

  // Update form data when active venue/symbol changes
  React.useEffect(() => {
    setFormData(prev => ({
      ...prev,
      venue: activeVenue as any,
      symbol: activeSymbol
    }));
  }, [activeVenue, activeSymbol]);

  const [simulation, setSimulation] = useState<OrderSimulation | null>(null);
  const [isSimulating, setIsSimulating] = useState(false);

  const updateFormData = useCallback((field: keyof OrderFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setSimulation(null); // Clear simulation when form changes
  }, []);

  const handleSimulate = useCallback(() => {
    if (!marketData || formData.quantity <= 0) return;
    
    setIsSimulating(true);
    
    // Add slight delay to simulate processing
    setTimeout(() => {
      const result = onSimulateOrder(formData);
      setSimulation(result);
      setIsSimulating(false);
    }, 300);
  }, [formData, marketData, onSimulateOrder]);

  const bestBid = marketData?.orderbook.bids[0]?.price || 0;
  const bestAsk = marketData?.orderbook.asks[0]?.price || 0;
  const midPrice = (bestBid + bestAsk) / 2;

  // Auto-fill price for limit orders
  React.useEffect(() => {
    if (formData.orderType === 'Limit' && formData.price === undefined && midPrice > 0) {
      const defaultPrice = formData.side === 'Buy' ? bestBid : bestAsk;
      setFormData(prev => ({ ...prev, price: defaultPrice }));
    }
  }, [formData.orderType, formData.side, bestBid, bestAsk, midPrice, formData.price]);

  const isFormValid = formData.quantity > 0 && 
    (formData.orderType === 'Market' || (formData.price && formData.price > 0));

  return (
    <Card className={cn("bg-trading-surface border-trading-border", className)}>
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2">
          <Calculator className="w-5 h-5 text-blue-accent" />
          Order Simulation
        </CardTitle>
        {marketData && (
          <div className="flex items-center gap-2 text-sm">
            <Badge variant="outline">{marketData.venue}</Badge>
            <Badge variant="outline">{marketData.symbol}</Badge>
            <span className="text-muted-foreground">
              ${midPrice.toFixed(2)}
            </span>
          </div>
        )}
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Venue & Symbol */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Venue</Label>
            <Select 
              value={formData.venue} 
              onValueChange={(value: any) => {
                updateFormData('venue', value);
                onVenueChange(value);
              }}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="OKX">OKX</SelectItem>
                <SelectItem value="Bybit">Bybit</SelectItem>
                <SelectItem value="Deribit">Deribit</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Symbol</Label>
            <Input
              value={formData.symbol}
              onChange={(e) => {
                updateFormData('symbol', e.target.value);
                onSymbolChange(e.target.value);
              }}
              placeholder="BTC-USDT"
            />
          </div>
        </div>

        {/* Order Type & Side */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Order Type</Label>
            <Select 
              value={formData.orderType} 
              onValueChange={(value: any) => updateFormData('orderType', value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Market">Market</SelectItem>
                <SelectItem value="Limit">Limit</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Side</Label>
            <Select 
              value={formData.side} 
              onValueChange={(value: any) => updateFormData('side', value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Buy">
                  <span className="text-buy-primary">Buy</span>
                </SelectItem>
                <SelectItem value="Sell">
                  <span className="text-sell-primary">Sell</span>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Price & Quantity */}
        <div className="grid grid-cols-2 gap-4">
          {formData.orderType === 'Limit' && (
            <div className="space-y-2">
              <Label>Price ($)</Label>
              <Input
                type="number"
                value={formData.price || ''}
                onChange={(e) => updateFormData('price', parseFloat(e.target.value))}
                placeholder="0.00"
                step="0.01"
                className="font-mono"
              />
            </div>
          )}

          <div className={cn("space-y-2", formData.orderType === 'Market' && "col-span-2")}>
            <Label>Quantity</Label>
            <Input
              type="number"
              value={formData.quantity || ''}
              onChange={(e) => updateFormData('quantity', parseFloat(e.target.value))}
              placeholder="0.000000"
              step="0.000001"
              className="font-mono"
            />
          </div>
        </div>

        {/* Timing */}
        <div className="space-y-2">
          <Label>Execution Timing</Label>
          <Select 
            value={formData.timing} 
            onValueChange={(value: any) => updateFormData('timing', value)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="immediate">Immediate</SelectItem>
              <SelectItem value="5s">5 seconds delay</SelectItem>
              <SelectItem value="10s">10 seconds delay</SelectItem>
              <SelectItem value="30s">30 seconds delay</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Simulate Button */}
        <Button
          onClick={handleSimulate}
          disabled={!isFormValid || isSimulating || !marketData}
          className={cn(
            "w-full transition-all duration-200",
            formData.side === 'Buy' 
              ? "bg-gradient-buy hover:shadow-glow-buy" 
              : "bg-gradient-sell hover:shadow-glow-sell"
          )}
        >
          {isSimulating ? (
            "Simulating..."
          ) : (
            <>
              <TrendingUp className="w-4 h-4 mr-2" />
              Simulate {formData.side} Order
            </>
          )}
        </Button>

        {/* Simulation Results */}
        {simulation && (
          <div className="mt-6 space-y-3 p-4 bg-trading-hover rounded-lg border border-trading-border">
            <h4 className="font-semibold text-sm flex items-center gap-2">
              <Calculator className="w-4 h-4" />
              Simulation Results
            </h4>
            
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Fill %:</span>
                <span className="ml-2 font-mono text-buy-primary">
                  {simulation.estimatedFillPercentage.toFixed(2)}%
                </span>
              </div>
              
              <div>
                <span className="text-muted-foreground">Slippage:</span>
                <span className="ml-2 font-mono text-sell-primary">
                  {simulation.slippage.toFixed(4)}%
                </span>
              </div>
              
              <div>
                <span className="text-muted-foreground">Impact:</span>
                <span className="ml-2 font-mono">
                  ${simulation.marketImpact.toFixed(2)}
                </span>
              </div>
              
              {simulation.timeToFill && (
                <div>
                  <span className="text-muted-foreground">Est. Time:</span>
                  <span className="ml-2 font-mono flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {simulation.timeToFill}s
                  </span>
                </div>
              )}
            </div>

            {simulation.slippage > 0.5 && (
              <div className="flex items-center gap-2 text-xs text-sell-primary bg-sell-primary/10 p-2 rounded">
                <AlertTriangle className="w-4 h-4" />
                High slippage warning: This order may experience significant price impact
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};