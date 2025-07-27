import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Settings as SettingsIcon, Bell, Palette, Database, Shield, Globe, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Settings = () => {
  const navigate = useNavigate();
  const [settings, setSettings] = useState({
    // Trading Settings
    defaultVenue: 'OKX',
    defaultSymbol: 'BTC-USDT',
    autoRefresh: true,
    refreshInterval: '5',
    orderConfirmation: true,
    
    // Display Settings
    theme: 'dark',
    soundEnabled: true,
    animationsEnabled: true,
    compactMode: false,
    showOrderBookDepth: '20',
    
    // Notifications
    priceAlerts: true,
    emailNotifications: false,
    pushNotifications: true,
    
    // API Settings
    reconnectAttempts: '3',
    connectionTimeout: '10',
    
    // Privacy
    analytics: true,
    dataSaving: false
  });

  const updateSetting = (key: string, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const resetToDefaults = () => {
    // Reset all settings to default values
    setSettings({
      defaultVenue: 'OKX',
      defaultSymbol: 'BTC-USDT',
      autoRefresh: true,
      refreshInterval: '5',
      orderConfirmation: true,
      theme: 'dark',
      soundEnabled: true,
      animationsEnabled: true,
      compactMode: false,
      showOrderBookDepth: '20',
      priceAlerts: true,
      emailNotifications: false,
      pushNotifications: true,
      reconnectAttempts: '3',
      connectionTimeout: '10',
      analytics: true,
      dataSaving: false
    });
  };

  return (
    <div className="min-h-screen bg-background p-2 sm:p-4 lg:p-6">
      <div className="max-w-4xl mx-auto space-y-4 lg:space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => navigate('/')}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Back</span>
            </Button>
            <div className="flex items-center gap-2">
              <SettingsIcon className="w-6 h-6 sm:w-8 sm:h-8 text-blue-accent" />
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold">Settings</h1>
            </div>
            <Badge variant="outline" className="text-xs hidden sm:inline-flex">
              Configuration
            </Badge>
          </div>
          
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={resetToDefaults}
              className="flex-1 sm:flex-none"
            >
              Reset to Defaults
            </Button>
            <Button size="sm" className="flex-1 sm:flex-none">
              Save Changes
            </Button>
          </div>
        </div>

        {/* Settings Tabs */}
        <Tabs defaultValue="trading" className="w-full">
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4">
            <TabsTrigger value="trading" className="flex items-center gap-2">
              <Zap className="w-4 h-4" />
              <span className="hidden sm:inline">Trading</span>
            </TabsTrigger>
            <TabsTrigger value="display" className="flex items-center gap-2">
              <Palette className="w-4 h-4" />
              <span className="hidden sm:inline">Display</span>
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex items-center gap-2">
              <Bell className="w-4 h-4" />
              <span className="hidden sm:inline">Alerts</span>
            </TabsTrigger>
            <TabsTrigger value="advanced" className="flex items-center gap-2">
              <Database className="w-4 h-4" />
              <span className="hidden sm:inline">Advanced</span>
            </TabsTrigger>
          </TabsList>

          {/* Trading Settings */}
          <TabsContent value="trading" className="space-y-4">
            <Card className="bg-trading-surface border-trading-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="w-5 h-5 text-blue-accent" />
                  Trading Preferences
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label>Default Exchange</Label>
                    <Select 
                      value={settings.defaultVenue} 
                      onValueChange={(value) => updateSetting('defaultVenue', value)}
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
                    <Label>Default Trading Pair</Label>
                    <Input
                      value={settings.defaultSymbol}
                      onChange={(e) => updateSetting('defaultSymbol', e.target.value)}
                      placeholder="BTC-USDT"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Auto Refresh Interval (seconds)</Label>
                    <Select 
                      value={settings.refreshInterval} 
                      onValueChange={(value) => updateSetting('refreshInterval', value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1 second</SelectItem>
                        <SelectItem value="5">5 seconds</SelectItem>
                        <SelectItem value="10">10 seconds</SelectItem>
                        <SelectItem value="30">30 seconds</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Order Book Depth</Label>
                    <Select 
                      value={settings.showOrderBookDepth} 
                      onValueChange={(value) => updateSetting('showOrderBookDepth', value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="10">10 levels</SelectItem>
                        <SelectItem value="20">20 levels</SelectItem>
                        <SelectItem value="50">50 levels</SelectItem>
                        <SelectItem value="100">100 levels</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Auto Refresh Data</Label>
                      <p className="text-sm text-muted-foreground">
                        Automatically refresh market data at set intervals
                      </p>
                    </div>
                    <Switch
                      checked={settings.autoRefresh}
                      onCheckedChange={(checked) => updateSetting('autoRefresh', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Order Confirmation</Label>
                      <p className="text-sm text-muted-foreground">
                        Show confirmation dialog before submitting orders
                      </p>
                    </div>
                    <Switch
                      checked={settings.orderConfirmation}
                      onCheckedChange={(checked) => updateSetting('orderConfirmation', checked)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Display Settings */}
          <TabsContent value="display" className="space-y-4">
            <Card className="bg-trading-surface border-trading-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Palette className="w-5 h-5 text-blue-accent" />
                  Display & Interface
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label>Theme</Label>
                    <Select 
                      value={settings.theme} 
                      onValueChange={(value) => updateSetting('theme', value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="dark">Dark</SelectItem>
                        <SelectItem value="light">Light</SelectItem>
                        <SelectItem value="system">System</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Sound Effects</Label>
                      <p className="text-sm text-muted-foreground">
                        Play sounds for order executions and alerts
                      </p>
                    </div>
                    <Switch
                      checked={settings.soundEnabled}
                      onCheckedChange={(checked) => updateSetting('soundEnabled', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Smooth Animations</Label>
                      <p className="text-sm text-muted-foreground">
                        Enable smooth transitions and animations
                      </p>
                    </div>
                    <Switch
                      checked={settings.animationsEnabled}
                      onCheckedChange={(checked) => updateSetting('animationsEnabled', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Compact Mode</Label>
                      <p className="text-sm text-muted-foreground">
                        Reduce spacing and padding for more content
                      </p>
                    </div>
                    <Switch
                      checked={settings.compactMode}
                      onCheckedChange={(checked) => updateSetting('compactMode', checked)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Notifications */}
          <TabsContent value="notifications" className="space-y-4">
            <Card className="bg-trading-surface border-trading-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="w-5 h-5 text-blue-accent" />
                  Notifications & Alerts
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Price Alerts</Label>
                      <p className="text-sm text-muted-foreground">
                        Get notified when prices reach your target levels
                      </p>
                    </div>
                    <Switch
                      checked={settings.priceAlerts}
                      onCheckedChange={(checked) => updateSetting('priceAlerts', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Email Notifications</Label>
                      <p className="text-sm text-muted-foreground">
                        Receive important updates via email
                      </p>
                    </div>
                    <Switch
                      checked={settings.emailNotifications}
                      onCheckedChange={(checked) => updateSetting('emailNotifications', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Push Notifications</Label>
                      <p className="text-sm text-muted-foreground">
                        Show browser notifications for important events
                      </p>
                    </div>
                    <Switch
                      checked={settings.pushNotifications}
                      onCheckedChange={(checked) => updateSetting('pushNotifications', checked)}
                    />
                  </div>
                </div>

                <Separator />

                <div className="p-4 bg-blue-accent/10 rounded-lg border border-blue-accent/20">
                  <h4 className="font-medium text-sm mb-2">Notification Preview</h4>
                  <p className="text-sm text-muted-foreground">
                    Test your notification settings with different alert types and timing preferences.
                  </p>
                  <Button variant="outline" size="sm" className="mt-3">
                    Send Test Notification
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Advanced Settings */}
          <TabsContent value="advanced" className="space-y-4">
            <Card className="bg-trading-surface border-trading-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="w-5 h-5 text-blue-accent" />
                  Advanced Configuration
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label>Connection Timeout (seconds)</Label>
                    <Select 
                      value={settings.connectionTimeout} 
                      onValueChange={(value) => updateSetting('connectionTimeout', value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="5">5 seconds</SelectItem>
                        <SelectItem value="10">10 seconds</SelectItem>
                        <SelectItem value="15">15 seconds</SelectItem>
                        <SelectItem value="30">30 seconds</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Reconnection Attempts</Label>
                    <Select 
                      value={settings.reconnectAttempts} 
                      onValueChange={(value) => updateSetting('reconnectAttempts', value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1 attempt</SelectItem>
                        <SelectItem value="3">3 attempts</SelectItem>
                        <SelectItem value="5">5 attempts</SelectItem>
                        <SelectItem value="10">10 attempts</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="flex items-center gap-2">
                        <Shield className="w-4 h-4" />
                        Analytics & Tracking
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        Help improve the platform by sharing usage analytics
                      </p>
                    </div>
                    <Switch
                      checked={settings.analytics}
                      onCheckedChange={(checked) => updateSetting('analytics', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="flex items-center gap-2">
                        <Globe className="w-4 h-4" />
                        Data Saving Mode
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        Reduce data usage by limiting real-time updates
                      </p>
                    </div>
                    <Switch
                      checked={settings.dataSaving}
                      onCheckedChange={(checked) => updateSetting('dataSaving', checked)}
                    />
                  </div>
                </div>

                <Separator />

                <div className="p-4 bg-yellow-500/10 rounded-lg border border-yellow-500/20">
                  <h4 className="font-medium text-sm mb-2 text-yellow-600 dark:text-yellow-400">
                    ⚠️ Advanced Settings
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Changing these settings may affect application performance and data accuracy. 
                    Only modify if you understand the implications.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Settings;