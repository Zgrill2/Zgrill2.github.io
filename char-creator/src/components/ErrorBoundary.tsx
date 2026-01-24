import { Component, ReactNode } from 'react';
import { AlertTriangle } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallbackMessage?: string;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="panel">
          <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
            <div className="w-20 h-20 rounded-full bg-error bg-opacity-20 flex items-center justify-center mb-6">
              <AlertTriangle size={40} className="text-error" />
            </div>

            <h2 className="text-2xl font-bold text-cosmic-white mb-3">
              Oops! Something went wrong
            </h2>

            <p className="text-cosmic-grey mb-6 max-w-lg leading-relaxed">
              {this.props.fallbackMessage ||
                'An unexpected error occurred while rendering this section. The rest of your character sheet should still work fine.'}
            </p>

            {this.state.error && (
              <details className="mb-6 text-left max-w-2xl w-full">
                <summary className="cursor-pointer text-sm font-semibold text-cyan-bright hover:text-cyan-electric mb-2">
                  View error details
                </summary>
                <pre className="text-xs bg-navy-deep p-4 rounded-lg border border-navy-light overflow-auto text-cosmic-grey">
                  {this.state.error.toString()}
                  {this.state.error.stack && `\n\n${this.state.error.stack}`}
                </pre>
              </details>
            )}

            <div className="flex gap-3">
              <button
                onClick={this.handleReset}
                className="btn-primary bg-cyan-electric hover:bg-cyan-bright text-navy-deep"
              >
                Try Again
              </button>
              <a
                href="https://github.com/anthropics/claude-code/issues"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary bg-navy-light hover:bg-navy-deep text-cosmic-white"
              >
                Report Issue
              </a>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
