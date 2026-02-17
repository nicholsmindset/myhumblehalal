import React, { Component, type ErrorInfo, type ReactNode } from 'react';

interface Props {
    children: ReactNode;
}

interface State {
    hasError: boolean;
}

class ErrorBoundary extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(): State {
        return { hasError: true };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error('Application error:', error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen flex items-center justify-center bg-offwhite px-4">
                    <div className="text-center space-y-4 max-w-md">
                        <span className="material-symbols-outlined text-6xl text-primary-dark">error</span>
                        <h1 className="text-2xl font-bold text-charcoal">Something went wrong</h1>
                        <p className="text-gray-600">
                            We're sorry for the inconvenience. Please try refreshing the page.
                        </p>
                        <button
                            onClick={() => window.location.reload()}
                            className="bg-primary-dark text-white px-6 py-3 rounded-md font-semibold hover:opacity-90 transition-opacity"
                        >
                            Refresh Page
                        </button>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
