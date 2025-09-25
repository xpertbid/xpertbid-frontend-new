'use client';

import React, { useState } from 'react';
import { useCurrency } from '@/contexts/CurrencyLanguageContext';

interface CurrencySwitcherProps {
  className?: string;
  showLabel?: boolean;
}

const CurrencySwitcher: React.FC<CurrencySwitcherProps> = ({ 
  className = '', 
  showLabel = true 
}) => {
  const { currencies, currentCurrency, setCurrentCurrency, loading } = useCurrency();
  const [isOpen, setIsOpen] = useState(false);

  if (loading || !currentCurrency) {
    return (
      <div className={`currency-switcher ${className}`}>
        <div className="currency-button">
          <span className="currency-symbol">$</span>
          <span className="currency-code">USD</span>
        </div>
      </div>
    );
  }

  return (
    <div className={`currency-switcher ${className}`}>
      {showLabel && <span className="currency-label">Currency:</span>}
      
      <div className="currency-dropdown">
        <button 
          className="currency-button"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Select currency"
        >
          <span className="currency-symbol">{currentCurrency.symbol}</span>
          <span className="currency-code">{currentCurrency.code}</span>
          <i className={`fas fa-chevron-${isOpen ? 'up' : 'down'}`}></i>
        </button>

        {isOpen && (
          <div className="currency-dropdown-menu">
            {currencies.map((currency) => (
              <button
                key={currency.id}
                className={`currency-option ${currency.id === currentCurrency.id ? 'active' : ''}`}
                onClick={() => {
                  setCurrentCurrency(currency);
                  setIsOpen(false);
                }}
              >
                <span className="currency-symbol">{currency.symbol}</span>
                <span className="currency-name">{currency.name}</span>
                <span className="currency-code">({currency.code})</span>
                {currency.is_default && <span className="default-badge">Default</span>}
              </button>
            ))}
          </div>
        )}
      </div>

      <style jsx>{`
        .currency-switcher {
          position: relative;
          display: inline-block;
        }

        .currency-label {
          font-size: 14px;
          color: var(--gray-600);
          margin-right: 8px;
        }

        .currency-dropdown {
          position: relative;
        }

        .currency-button {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 8px 12px;
          background: white;
          border: 1px solid var(--gray-300);
          border-radius: var(--border-radius-lg);
          cursor: pointer;
          transition: all 0.3s ease;
          font-size: 14px;
          font-weight: 500;
        }

        .currency-button:hover {
          border-color: var(--primary-color);
          box-shadow: 0 2px 8px rgba(67, 172, 233, 0.15);
        }

        .currency-symbol {
          font-weight: 600;
          color: var(--primary-color);
        }

        .currency-code {
          font-weight: 500;
          color: var(--secondary-color);
        }

        .currency-dropdown-menu {
          position: absolute;
          top: 100%;
          left: 0;
          right: 0;
          background: white;
          border: 1px solid var(--gray-300);
          border-radius: var(--border-radius-lg);
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
          z-index: 1000;
          max-height: 300px;
          overflow-y: auto;
          margin-top: 4px;
        }

        .currency-option {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 12px 16px;
          width: 100%;
          background: none;
          border: none;
          cursor: pointer;
          transition: background-color 0.2s ease;
          text-align: left;
          font-size: 14px;
        }

        .currency-option:hover {
          background-color: var(--gray-100);
        }

        .currency-option.active {
          background-color: var(--primary-color);
          color: white;
        }

        .currency-option.active .currency-symbol {
          color: white;
        }

        .currency-name {
          flex: 1;
          font-weight: 500;
        }

        .default-badge {
          font-size: 10px;
          background: var(--success-color);
          color: white;
          padding: 2px 6px;
          border-radius: var(--border-radius-sm);
          font-weight: 600;
          text-transform: uppercase;
        }

        .currency-option.active .default-badge {
          background: rgba(255, 255, 255, 0.2);
        }

        @media (max-width: 768px) {
          .currency-button {
            padding: 6px 10px;
            font-size: 13px;
          }

          .currency-option {
            padding: 10px 12px;
            font-size: 13px;
          }
        }
      `}</style>
    </div>
  );
};

export default CurrencySwitcher;
