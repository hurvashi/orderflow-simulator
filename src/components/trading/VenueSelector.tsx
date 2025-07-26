import React from 'react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { VenueType } from '@/types/trading';
import { cn } from '@/lib/utils';
import { Wifi, WifiOff } from 'lucide-react';

interface VenueSelectorProps {
  activeVenue: VenueType;
  onVenueChange: (venue: VenueType) => void;
  connectionStatus: Record<VenueType, boolean>;
  className?: string;
}

export const VenueSelector: React.FC<VenueSelectorProps> = ({
  activeVenue,
  onVenueChange,
  connectionStatus,
  className
}) => {
  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-muted-foreground">Exchange Venues</h3>
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <Wifi className="w-3 h-3" />
          <span>Live Data</span>
        </div>
      </div>
      
      <Tabs value={activeVenue} onValueChange={(value) => onVenueChange(value as VenueType)}>
        <TabsList className="grid w-full grid-cols-3 bg-trading-surface border border-trading-border">
          <TabsTrigger 
            value="OKX" 
            className="data-[state=active]:bg-blue-accent data-[state=active]:text-white hover:bg-trading-hover transition-all duration-200 border-r border-trading-border"
          >
            <div className="flex items-center gap-2">
              <div className={cn(
                "w-2 h-2 rounded-full",
                connectionStatus.OKX ? "bg-buy-primary" : "bg-sell-primary"
              )} />
              <span className="font-medium">OKX</span>
            </div>
          </TabsTrigger>
          
          <TabsTrigger 
            value="Bybit"
            className="data-[state=active]:bg-blue-accent data-[state=active]:text-white hover:bg-trading-hover transition-all duration-200 border-r border-trading-border"
          >
            <div className="flex items-center gap-2">
              <div className={cn(
                "w-2 h-2 rounded-full",
                connectionStatus.Bybit ? "bg-buy-primary" : "bg-sell-primary"
              )} />
              <span className="font-medium">Bybit</span>
            </div>
          </TabsTrigger>
          
          <TabsTrigger 
            value="Deribit"
            className="data-[state=active]:bg-blue-accent data-[state=active]:text-white hover:bg-trading-hover transition-all duration-200"
          >
            <div className="flex items-center gap-2">
              <div className={cn(
                "w-2 h-2 rounded-full",
                connectionStatus.Deribit ? "bg-buy-primary" : "bg-sell-primary"
              )} />
              <span className="font-medium">Deribit</span>
            </div>
          </TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Connection Status Details */}
      <div className="grid grid-cols-3 gap-2 text-xs">
        {(['OKX', 'Bybit', 'Deribit'] as VenueType[]).map((venue) => (
          <div 
            key={venue}
            className={cn(
              "flex items-center justify-between p-2 rounded border",
              venue === activeVenue ? "bg-trading-hover border-blue-accent" : "bg-trading-surface border-trading-border"
            )}
          >
            <span className={cn(
              "font-medium",
              venue === activeVenue ? "text-foreground" : "text-muted-foreground"
            )}>
              {venue}
            </span>
            {connectionStatus[venue] ? (
              <Wifi className="w-3 h-3 text-buy-primary" />
            ) : (
              <WifiOff className="w-3 h-3 text-sell-primary" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};