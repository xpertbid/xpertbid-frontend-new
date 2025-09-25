'use client';

import React, { useState } from 'react';

const CurrencySwitcher = ({ className = '', showLabel = true }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentCurrency, setCurrentCurrency] = useState('USD');

  const currencies = [
    { code: 'USD', name: 'US Dollar', symbol: '$' },
    { code: 'EUR', name: 'Euro', symbol: '€' },
    { code: 'GBP', name: 'British Pound', symbol: '£' },
    { code: 'JPY', name: 'Japanese Yen', symbol: '¥' },
    { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$' }
  ];

  const currentCurr = currencies.find(curr => curr.code === currentCurrency) || currencies[0];

  return (
    <div className={`currency-switcher dropdown ${className}`}>
      <button
        className="btn btn-outline-secondary dropdown-toggle"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="symbol">{currentCurr.symbol}</span>
        {showLabel && <span className="ms-1">{currentCurr.code}</span>}
      </button>

      {isOpen && (
        <div className="dropdown-menu show">
          {currencies.map((currency) => (
            <button
              key={currency.code}
              className={`dropdown-item ${currentCurrency === currency.code ? 'active' : ''}`}
              onClick={() => {
                setCurrentCurrency(currency.code);
                setIsOpen(false);
              }}
            >
              <span className="symbol me-2">{currency.symbol}</span>
              {currency.name}
            </button>
          ))}
        </div>
      )}

      <style jsx>{`
        .currency-switcher {
          position: relative;
        }

        .dropdown-menu {
          position: absolute;
          top: 100%;
          right: 0;
          min-width: 180px;
          background: white;
          border: 1px solid #ddd;
          border-radius: 4px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
          z-index: 1000;
        }

        .dropdown-item {
          display: flex;
          align-items: center;
          width: 100%;
          padding: 8px 12px;
          border: none;
          background: none;
          text-align: left;
          cursor: pointer;
          transition: background-color 0.2s;
        }

        .dropdown-item:hover {
          background-color: #f8f9fa;
        }

        .dropdown-item.active {
          background-color: #e3f2fd;
          color: #1976d2;
        }

        .symbol {
          font-weight: bold;
          min-width: 20px;
        }
      `}</style>
    </div>
  );
};

export default CurrencySwitcher;