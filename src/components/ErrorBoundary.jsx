'use client';

import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary">
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-md-6 text-center">
                <h2>Something went wrong</h2>
                <p>We're working to fix this issue. Please try refreshing the page.</p>
                <button 
                  className="btn btn-primary"
                  onClick={() => window.location.reload()}
                >
                  Refresh Page
                </button>
              </div>
            </div>
          </div>
          
          <style jsx>{`
            .error-boundary {
              padding: 60px 0;
              background-color: #f8f9fa;
              min-height: 400px;
              display: flex;
              align-items: center;
            }
            
            .error-boundary h2 {
              color: #83B735;
              margin-bottom: 20px;
            }
            
            .error-boundary p {
              color: #6c757d;
              margin-bottom: 30px;
            }
            
            .btn-primary {
              background-color: #83B735;
              border-color: #83B735;
            }
            
            .btn-primary:hover {
              background-color: #6B9B2A;
              border-color: #6B9B2A;
            }
          `}</style>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
