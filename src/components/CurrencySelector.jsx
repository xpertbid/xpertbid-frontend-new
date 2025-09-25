'use client';

import React, { useState } from 'react';
import { useCurrency } from '@/contexts/CurrencyLanguageContext';

const CurrencySelector = ({ 
  className = '', 
  showLabel = true, 
  size = 'md',
  variant = 'dropdown' // 'dropdown' or 'buttons'
}) => {
  const { currencies, currentCurrency, changeCurrency, loading } = useCurrency();
  const [isOpen, setIsOpen] = useState(false);

  const handleCurrencyChange = (currency) => {
    changeCurrency(currency);
    setIsOpen(false);
  };

  const sizeClasses = {
    sm: 'btn-sm',
    md: '',
    lg: 'btn-lg'
  };

  if (loading) {
    return (
      <div className={`currency-selector ${className}`}>
        <div className="spinner-border spinner-border-sm" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (variant === 'buttons') {
    return (
      <div className={`currency-selector currency-buttons ${className}`}>
        {showLabel && <span className="me-2">Currency:</span>}
        <div className="btn-group" role="group">
          {currencies.map((currency) => (
            <button
              key={currency.code}
              type="button"
              className={`btn ${currentCurrency?.code === currency.code ? 'btn-primary' : 'btn-outline-primary'} ${sizeClasses[size]}`}
              onClick={() => handleCurrencyChange(currency)}
            >
              {currency.symbol} {currency.code}
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={`currency-selector currency-dropdown ${className}`}>
      {showLabel && <label className="form-label me-2">Currency:</label>}
      <div className="dropdown">
        <button
          className={`btn btn-outline-secondary dropdown-toggle ${sizeClasses[size]}`}
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          aria-expanded={isOpen}
        >
          {currentCurrency ? (
            <>
              <span className="me-1">{currentCurrency.symbol}</span>
              {currentCurrency.code}
            </>
          ) : (
            'Select Currency'
          )}
        </button>
        
        {isOpen && (
          <div className="dropdown-menu show" style={{ display: 'block' }}>
            {currencies.map((currency) => (
              <button
                key={currency.code}
                className={`dropdown-item ${currentCurrency?.code === currency.code ? 'active' : ''}`}
                onClick={() => handleCurrencyChange(currency)}
              >
                <span className="me-2">{currency.symbol}</span>
                <span className="me-2">{currency.code}</span>
                <small className="text-muted">{currency.name}</small>
              </button>
            ))}
          </div>
        )}
      </div>
      
      {/* Click outside to close */}
      {isOpen && (
        <div 
          className="position-fixed top-0 start-0 w-100 h-100" 
          style={{ zIndex: 1040 }}
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
};

export default CurrencySelector;
