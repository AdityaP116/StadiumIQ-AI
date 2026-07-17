/**
 * StadiumIQ — ErrorBoundary (Organism)
 *
 * React Class Component to catch JS errors anywhere in the child component tree
 * and display a fallback UI instead of crashing the whole app.
 * Crucial for AI-generated text/markdown renderers that might throw on malformed data.
 */

import { Component } from 'react';
import ErrorState from '../ui/ErrorState';
import DashboardCard from '../molecules/DashboardCard';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('[ErrorBoundary caught error]:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    this.props.onReset?.();
  };

  render() {
    if (this.state.hasError) {
      // If a custom fallback is provided, use it
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default fallback
      return (
        <DashboardCard className="border-red-500/20">
          <ErrorState
            title="Component Error"
            message={this.state.error?.message || 'A render error occurred.'}
            onRetry={this.handleReset}
          />
        </DashboardCard>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
