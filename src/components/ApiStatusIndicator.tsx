'use client';

import React, { useState, useEffect } from 'react';

const ApiStatusIndicator: React.FC = () => {
  const [apiStatus, setApiStatus] = useState<'checking' | 'online' | 'offline'>('checking');
  const [showIndicator, setShowIndicator] = useState(false);

  useEffect(() => {
    const checkApiStatus = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'}/health`);
        if (response.ok) {
          setApiStatus('online');
          setShowIndicator(false);
        } else {
          setApiStatus('offline');
          setShowIndicator(true);
        }
      } catch (_error) {
        setApiStatus('offline');
        setShowIndicator(true);
      }
    };

    checkApiStatus();
    
    // Check every 30 seconds
    const interval = setInterval(checkApiStatus, 30000);
    
    return () => clearInterval(interval);
  }, []);

  if (!showIndicator || apiStatus === 'online') {
    return null;
  }

  return (
    <div className="api-status-indicator">
      <div className="api-status-banner">
        <div className="container">
          <div className="row align-items-center">
            <div className="col">
              <div className="d-flex align-items-center">
                <i className="fas fa-exclamation-triangle me-2"></i>
                <span>
                  <strong>API Offline:</strong> Using demo data. Backend server may be starting up.
                </span>
              </div>
            </div>
            <div className="col-auto">
              <button 
                className="btn btn-sm btn-outline-light"
                onClick={() => setShowIndicator(false)}
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .api-status-indicator {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 9999;
        }

        .api-status-banner {
          background: linear-gradient(135deg, #ff6b6b 0%, #ee5a52 100%);
          color: white;
          padding: 8px 0;
          font-size: 0.9rem;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        }

        .api-status-banner i {
          color: #fff;
        }

        .btn-outline-light {
          border-color: rgba(255, 255, 255, 0.3);
          color: white;
          padding: 4px 8px;
        }

        .btn-outline-light:hover {
          background-color: rgba(255, 255, 255, 0.1);
          border-color: rgba(255, 255, 255, 0.5);
          color: white;
        }

        @media (max-width: 768px) {
          .api-status-banner {
            font-size: 0.8rem;
            padding: 6px 0;
          }
          
          .api-status-banner span {
            font-size: 0.75rem;
          }
        }
      `}</style>
    </div>
  );
};

export default ApiStatusIndicator;
