'use client';

import { useEffect, useState } from 'react';
import { initPerformanceMonitoring } from '../../lib/performance/simple-monitor';
import PerformanceDashboard from '../components/performance-dashboard';

export default function PerformancePage() {
  const [monitoringEnabled, setMonitoringEnabled] = useState(false);

  useEffect(() => {
    // Initialize performance monitoring
    const monitor = initPerformanceMonitoring();
    setMonitoringEnabled(!!monitor);

    // Simulate some performance-intensive operations for testing
    if (typeof window !== 'undefined') {
      // Add some artificial delay to test performance metrics
      setTimeout(() => {
        // Trigger a layout shift for testing
        const testElement = document.createElement('div');
        testElement.style.height = '100px';
        testElement.style.backgroundColor = 'red';
        document.body.appendChild(testElement);

        setTimeout(() => {
          document.body.removeChild(testElement);
        }, 100);
      }, 2000);
    }
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4">Performance Monitoring</h1>
          <p className="text-lg text-muted-foreground mb-4">
            Real-time performance metrics and monitoring for the SkyScout AI
            application.
          </p>

          <div className="flex items-center space-x-4 mb-6">
            <div
              className={`inline-flex items-center px-3 py-1 rounded-full text-sm ${
                monitoringEnabled
                  ? 'bg-green-100 text-green-800 border border-green-200'
                  : 'bg-red-100 text-red-800 border border-red-200'
              }`}
            >
              <div
                className={`w-2 h-2 rounded-full mr-2 ${
                  monitoringEnabled ? 'bg-green-500' : 'bg-red-500'
                }`}
              />
              {monitoringEnabled ? 'Monitoring Active' : 'Monitoring Inactive'}
            </div>

            <div className="text-sm text-muted-foreground">
              Core Web Vitals: LCP, FID, CLS, FCP, TTFB
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="p-4 border rounded-lg">
              <h3 className="font-semibold mb-2">Real-time Monitoring</h3>
              <p className="text-sm text-muted-foreground">
                Automatic collection of Core Web Vitals and performance metrics
              </p>
            </div>

            <div className="p-4 border rounded-lg">
              <h3 className="font-semibold mb-2">Alert System</h3>
              <p className="text-sm text-muted-foreground">
                Immediate notifications for critical performance issues
              </p>
            </div>

            <div className="p-4 border rounded-lg">
              <h3 className="font-semibold mb-2">Analytics Dashboard</h3>
              <p className="text-sm text-muted-foreground">
                Comprehensive view of performance trends and metrics
              </p>
            </div>
          </div>
        </div>

        <PerformanceDashboard />
      </div>
    </div>
  );
}
