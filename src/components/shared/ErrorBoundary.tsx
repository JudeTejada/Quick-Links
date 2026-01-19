'use client';

import type { ReactNode } from 'react';
import React from 'react';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode | ((error: Error, reset: () => void) => ReactNode);
}

interface ErrorBoundaryState {
  error: Error | null;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { error: null };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { error };
  }

  reset = () => {
    this.setState({ error: null });
  };

  render() {
    if (this.state.error) {
      const fallback =
        typeof this.props.fallback === 'function'
          ? this.props.fallback(this.state.error, this.reset)
          : this.props.fallback;
      return fallback ?? <div>Something went wrong</div>;
    }
    return this.props.children;
  }
}
