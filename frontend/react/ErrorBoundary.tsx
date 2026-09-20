import { Component, type ReactNode, type ErrorInfo } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

/**
 * ErrorBoundary — catches render errors in child islands and shows a
 * fallback UI with a retry button instead of crashing the whole page.
 *
 * Wrap each island independently so one failing component never
 * takes down siblings or the parent page.
 */
export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  override componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error('[ErrorBoundary] Caught render error:', error, errorInfo);
    this.props.onError?.(error, errorInfo);
  }

  private handleRetry = () => {
    this.setState({ hasError: false, error: null });
  };

  override render(): ReactNode {
    if (this.state.hasError) {
      return (
        this.props.fallback ?? (
          <div
            role="alert"
            className="flex flex-col items-center justify-center p-6 bg-red-50 border border-red-200 rounded-lg text-center"
          >
            <span className="text-3xl mb-2" aria-hidden="true">
              ⚠️
            </span>
            <h3 className="font-bold text-red-800 mb-1">Algo salió mal</h3>
            <p className="text-sm text-red-700 mb-4">
              {this.state.error?.message ?? 'Error desconocido'}
            </p>
            <button
              type="button"
              onClick={this.handleRetry}
              className="px-4 py-2 bg-red-600 text-white text-sm font-semibold rounded hover:bg-red-700 transition-colors"
            >
              Reintentar
            </button>
          </div>
        )
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
