import React, { Component, ReactNode } from 'react';

interface ErrorBoundaryProps {
  fallback?: ReactNode;
  children: ReactNode;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

const defaultFallbackView = (
  <div>
    <h1>Something went wrong.</h1>
    <p>Sorry, something went wrong. Please try again later.</p>
  </div>
);

class ErrorBoundaryView extends Component<ErrorBoundaryProps, ErrorBoundaryState> {

  static displayName = 'ErrorBoundary';

  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(_: Error): ErrorBoundaryState {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    // You can also log the error to an error reporting service
    console.error("❌ Uncaught error:", error, errorInfo);
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return this.props.fallback || defaultFallbackView;
    }

    return this.props.children;
  }
}

export const ErrorBoundary = React.memo(ErrorBoundaryView);