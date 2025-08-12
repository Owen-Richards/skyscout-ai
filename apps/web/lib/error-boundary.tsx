'use client';

import { Button } from '@skyscout/ui';
import { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
  eventId?: string;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log error to monitoring service
    this.logErrorToService(error, errorInfo);

    // Call custom error handler
    this.props.onError?.(error, errorInfo);

    this.setState({
      error,
      errorInfo,
    });
  }

  private logErrorToService(error: Error, errorInfo: ErrorInfo) {
    // Send to your error monitoring service (Sentry, LogRocket, etc.)
    const errorData = {
      message: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      timestamp: new Date().toISOString(),
      url: window.location.href,
      userAgent: navigator.userAgent,
    };

    // Example: Send to analytics endpoint
    if (navigator.sendBeacon) {
      navigator.sendBeacon('/api/analytics/errors', JSON.stringify(errorData));
    }
  }

  private handleRetry = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
  };

  render() {
    if (this.state.hasError) {
      // Custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default error UI
      return (
        <div className="min-h-screen flex items-center justify-center bg-background">
          <div className="max-w-md w-full mx-auto p-6 text-center">
            <div className="mb-4">
              <svg
                className="mx-auto h-12 w-12 text-destructive"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.962-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
            </div>
            <h1 className="text-lg font-semibold text-foreground mb-2">
              Something went wrong
            </h1>
            <p className="text-muted-foreground mb-6">
              We apologize for the inconvenience. Our team has been notified and
              is working on a fix.
            </p>
            <div className="space-y-3">
              <Button onClick={this.handleRetry} className="w-full">
                Try Again
              </Button>
              <Button
                variant="outline"
                onClick={() => window.location.reload()}
                className="w-full"
              >
                Reload Page
              </Button>
            </div>
            {process.env.NODE_ENV === 'development' && (
              <details className="mt-6 text-left">
                <summary className="cursor-pointer text-sm text-muted-foreground">
                  Error Details (Development Only)
                </summary>
                <pre className="mt-2 text-xs bg-muted p-4 rounded overflow-auto">
                  {this.state.error?.toString()}
                  {this.state.errorInfo?.componentStack}
                </pre>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
