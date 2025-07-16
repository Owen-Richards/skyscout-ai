/**
 * Price Alerts Component
 * Price monitoring and alerts for flight routes
 */

'use client';

import { useState } from 'react';
import { Card, Button, Badge, Input } from '@skyscout/ui';
import {
  Bell,
  TrendingDown,
  TrendingUp,
  DollarSign,
  Settings,
  Plus,
  Trash2,
  Plane,
  Calendar,
  Target,
  AlertTriangle,
  CheckCircle,
  X,
} from 'lucide-react';
import { cn } from '@skyscout/ui';

interface PriceAlert {
  id: string;
  route: {
    origin: string;
    destination: string;
  };
  targetPrice: number;
  currentPrice: number;
  priceChange: number;
  priceChangePercent: number;
  dateRange: {
    departure: string;
    return?: string;
  };
  passengers: number;
  alertType: 'price-drop' | 'specific-price' | 'deal-finder';
  isActive: boolean;
  createdAt: string;
  lastTriggered?: string;
  frequency: 'instant' | 'daily' | 'weekly';
}

interface NewAlertForm {
  origin: string;
  destination: string;
  targetPrice: string;
  departureDate: string;
  returnDate: string;
  passengers: number;
  alertType: PriceAlert['alertType'];
  frequency: PriceAlert['frequency'];
}

export function PriceAlerts({ className }: { className?: string }) {
  const [alerts, setAlerts] = useState<PriceAlert[]>([
    {
      id: '1',
      route: { origin: 'NYC', destination: 'London' },
      targetPrice: 450,
      currentPrice: 520,
      priceChange: -25,
      priceChangePercent: -4.6,
      dateRange: { departure: '2024-06-15', return: '2024-06-22' },
      passengers: 2,
      alertType: 'specific-price',
      isActive: true,
      createdAt: '2024-01-10',
      frequency: 'daily',
    },
    {
      id: '2',
      route: { origin: 'LAX', destination: 'Tokyo' },
      targetPrice: 600,
      currentPrice: 580,
      priceChange: 12,
      priceChangePercent: 2.1,
      dateRange: { departure: '2024-09-01' },
      passengers: 1,
      alertType: 'price-drop',
      isActive: true,
      createdAt: '2024-01-12',
      lastTriggered: '2024-01-14',
      frequency: 'instant',
    },
    {
      id: '3',
      route: { origin: 'Chicago', destination: 'Barcelona' },
      targetPrice: 400,
      currentPrice: 485,
      priceChange: 8,
      priceChangePercent: 1.7,
      dateRange: { departure: '2024-07-10', return: '2024-07-18' },
      passengers: 1,
      alertType: 'deal-finder',
      isActive: false,
      createdAt: '2024-01-08',
      frequency: 'weekly',
    },
  ]);

  const [showNewAlert, setShowNewAlert] = useState(false);
  const [newAlert, setNewAlert] = useState<NewAlertForm>({
    origin: '',
    destination: '',
    targetPrice: '',
    departureDate: '',
    returnDate: '',
    passengers: 1,
    alertType: 'price-drop',
    frequency: 'daily',
  });

  const toggleAlert = (id: string) => {
    setAlerts(
      alerts.map(alert =>
        alert.id === id ? { ...alert, isActive: !alert.isActive } : alert
      )
    );
  };

  const deleteAlert = (id: string) => {
    setAlerts(alerts.filter(alert => alert.id !== id));
  };

  const createAlert = () => {
    if (!newAlert.origin || !newAlert.destination || !newAlert.targetPrice)
      return;

    const alert: PriceAlert = {
      id: Date.now().toString(),
      route: {
        origin: newAlert.origin,
        destination: newAlert.destination,
      },
      targetPrice: parseInt(newAlert.targetPrice),
      currentPrice: parseInt(newAlert.targetPrice) + 50, // Mock current price
      priceChange: 0,
      priceChangePercent: 0,
      dateRange: {
        departure: newAlert.departureDate,
        return: newAlert.returnDate || undefined,
      },
      passengers: newAlert.passengers,
      alertType: newAlert.alertType,
      isActive: true,
      createdAt: new Date().toISOString().split('T')[0],
      frequency: newAlert.frequency,
    };

    setAlerts([alert, ...alerts]);
    setNewAlert({
      origin: '',
      destination: '',
      targetPrice: '',
      departureDate: '',
      returnDate: '',
      passengers: 1,
      alertType: 'price-drop',
      frequency: 'daily',
    });
    setShowNewAlert(false);
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const getAlertTypeInfo = (type: PriceAlert['alertType']) => {
    switch (type) {
      case 'price-drop':
        return {
          label: 'Price Drop Alert',
          description: 'Get notified when prices decrease',
          icon: TrendingDown,
          color: 'text-green-600',
        };
      case 'specific-price':
        return {
          label: 'Target Price Alert',
          description: 'Alert when price hits your target',
          icon: Target,
          color: 'text-blue-600',
        };
      case 'deal-finder':
        return {
          label: 'Deal Finder',
          description: 'Find the best deals on this route',
          icon: DollarSign,
          color: 'text-purple-600',
        };
    }
  };

  const getStatusInfo = (alert: PriceAlert) => {
    if (!alert.isActive) return { color: 'text-gray-500', text: 'Paused' };

    if (alert.currentPrice <= alert.targetPrice) {
      return { color: 'text-green-600', text: 'Target Met!' };
    }

    if (alert.priceChange < 0) {
      return { color: 'text-orange-600', text: 'Price Dropped' };
    }

    return { color: 'text-blue-600', text: 'Monitoring' };
  };

  return (
    <div className={cn('space-y-6', className)}>
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Bell className="h-6 w-6 text-primary" />
            Price Alerts
          </h2>
          <p className="text-muted-foreground mt-1">
            Track flight prices and get notified when they drop
          </p>
        </div>

        <Button
          onClick={() => setShowNewAlert(true)}
          className="bg-gradient-to-r from-primary to-primary/80"
        >
          <Plus className="h-4 w-4 mr-2" />
          Create Alert
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircle className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Active Alerts</p>
              <p className="text-2xl font-bold">
                {alerts.filter(a => a.isActive).length}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Target className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Targets Met</p>
              <p className="text-2xl font-bold">
                {alerts.filter(a => a.currentPrice <= a.targetPrice).length}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-100 rounded-lg">
              <TrendingDown className="h-5 w-5 text-orange-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Avg. Savings</p>
              <p className="text-2xl font-bold">$67</p>
            </div>
          </div>
        </Card>
      </div>

      {/* New Alert Form */}
      {showNewAlert && (
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Create New Price Alert</h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowNewAlert(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">From</label>
              <Input
                placeholder="Origin city"
                value={newAlert.origin}
                onChange={e =>
                  setNewAlert({ ...newAlert, origin: e.target.value })
                }
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">To</label>
              <Input
                placeholder="Destination city"
                value={newAlert.destination}
                onChange={e =>
                  setNewAlert({ ...newAlert, destination: e.target.value })
                }
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">
                Target Price
              </label>
              <Input
                type="number"
                placeholder="$400"
                value={newAlert.targetPrice}
                onChange={e =>
                  setNewAlert({ ...newAlert, targetPrice: e.target.value })
                }
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">
                Departure Date
              </label>
              <Input
                type="date"
                value={newAlert.departureDate}
                onChange={e =>
                  setNewAlert({ ...newAlert, departureDate: e.target.value })
                }
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">
                Return Date (Optional)
              </label>
              <Input
                type="date"
                value={newAlert.returnDate}
                onChange={e =>
                  setNewAlert({ ...newAlert, returnDate: e.target.value })
                }
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">
                Alert Type
              </label>
              <select
                className="w-full px-3 py-2 border border-input rounded-lg bg-background"
                value={newAlert.alertType}
                onChange={e =>
                  setNewAlert({
                    ...newAlert,
                    alertType: e.target.value as PriceAlert['alertType'],
                  })
                }
              >
                <option value="price-drop">Price Drop Alert</option>
                <option value="specific-price">Target Price Alert</option>
                <option value="deal-finder">Deal Finder</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <Button variant="outline" onClick={() => setShowNewAlert(false)}>
              Cancel
            </Button>
            <Button onClick={createAlert}>Create Alert</Button>
          </div>
        </Card>
      )}

      {/* Alerts List */}
      <div className="space-y-4">
        {alerts.length === 0 ? (
          <Card className="p-8 text-center">
            <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Price Alerts Yet</h3>
            <p className="text-muted-foreground mb-4">
              Create your first price alert to start tracking flight prices
            </p>
            <Button onClick={() => setShowNewAlert(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Create First Alert
            </Button>
          </Card>
        ) : (
          alerts.map(alert => {
            const alertTypeInfo = getAlertTypeInfo(alert.alertType);
            const statusInfo = getStatusInfo(alert);
            const Icon = alertTypeInfo.icon;

            return (
              <Card
                key={alert.id}
                className={cn(
                  'p-6 transition-all duration-200',
                  !alert.isActive && 'opacity-60',
                  alert.currentPrice <= alert.targetPrice &&
                    'ring-2 ring-green-500 ring-opacity-30'
                )}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    {/* Header */}
                    <div className="flex items-center gap-3 mb-3">
                      <div
                        className={cn(
                          'p-2 rounded-lg bg-muted',
                          alertTypeInfo.color
                        )}
                      >
                        <Icon className="h-4 w-4" />
                      </div>

                      <div>
                        <div className="flex items-center gap-2">
                          <Plane className="h-4 w-4 text-muted-foreground" />
                          <span className="font-semibold text-lg">
                            {alert.route.origin} → {alert.route.destination}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {alertTypeInfo.label}
                        </p>
                      </div>

                      <Badge variant={alert.isActive ? 'default' : 'secondary'}>
                        {statusInfo.text}
                      </Badge>
                    </div>

                    {/* Price Info */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div>
                        <p className="text-sm text-muted-foreground">
                          Target Price
                        </p>
                        <p className="text-xl font-bold text-primary">
                          ${alert.targetPrice}
                        </p>
                      </div>

                      <div>
                        <p className="text-sm text-muted-foreground">
                          Current Price
                        </p>
                        <div className="flex items-center gap-2">
                          <span className="text-xl font-bold">
                            ${alert.currentPrice}
                          </span>
                          {alert.priceChange !== 0 && (
                            <div
                              className={cn(
                                'flex items-center gap-1 text-sm',
                                alert.priceChange < 0
                                  ? 'text-green-600'
                                  : 'text-red-600'
                              )}
                            >
                              {alert.priceChange < 0 ? (
                                <TrendingDown className="h-3 w-3" />
                              ) : (
                                <TrendingUp className="h-3 w-3" />
                              )}
                              <span>
                                {alert.priceChange > 0 ? '+' : ''}$
                                {alert.priceChange}(
                                {alert.priceChangePercent > 0 ? '+' : ''}
                                {alert.priceChangePercent}%)
                              </span>
                            </div>
                          )}
                        </div>
                      </div>

                      <div>
                        <p className="text-sm text-muted-foreground">
                          Potential Savings
                        </p>
                        <p
                          className={cn(
                            'text-xl font-bold',
                            alert.currentPrice <= alert.targetPrice
                              ? 'text-green-600'
                              : 'text-muted-foreground'
                          )}
                        >
                          ${Math.max(0, alert.currentPrice - alert.targetPrice)}
                        </p>
                      </div>
                    </div>

                    {/* Travel Details */}
                    <div className="flex items-center gap-6 text-sm text-muted-foreground mb-4">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        <span>
                          Depart: {formatDate(alert.dateRange.departure)}
                        </span>
                      </div>
                      {alert.dateRange.return && (
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          <span>
                            Return: {formatDate(alert.dateRange.return)}
                          </span>
                        </div>
                      )}
                      <span>
                        {alert.passengers} passenger
                        {alert.passengers > 1 ? 's' : ''}
                      </span>
                      <span>Notify: {alert.frequency}</span>
                    </div>

                    {/* Alert triggered info */}
                    {alert.lastTriggered && (
                      <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg">
                        <AlertTriangle className="h-4 w-4 text-green-600" />
                        <span className="text-sm text-green-700">
                          Last alert triggered on{' '}
                          {formatDate(alert.lastTriggered)}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 ml-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => toggleAlert(alert.id)}
                    >
                      {alert.isActive ? 'Pause' : 'Resume'}
                    </Button>

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => console.log('Edit alert:', alert)}
                    >
                      <Settings className="h-4 w-4" />
                    </Button>

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteAlert(alert.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}
