'use client';

import React, { useState, useEffect } from 'react';
import { useCurrency } from '@/contexts/CurrencyLanguageContext';

const ConvertedPrice = ({ 
  amount, 
  fromCurrency = 'USD', 
  className = '',
  showOriginal = false,
  originalClassName = '',
  convertedClassName = ''
}) => {
  const [convertedAmount, setConvertedAmount] = useState(amount);
  const [loading, setLoading] = useState(false);
  const { currentCurrency, convertPrice, formatPrice } = useCurrency();

  useEffect(() => {
    const performConversion = async () => {
      if (!amount || !currentCurrency) {
        setConvertedAmount(amount);
        return;
      }

      // If currencies are the same, no conversion needed
      if (fromCurrency === currentCurrency.code) {
        setConvertedAmount(amount);
        return;
      }

      try {
        setLoading(true);
        const converted = await convertPrice(amount, fromCurrency, currentCurrency.code);
        setConvertedAmount(converted);
      } catch (error) {
        console.error('Price conversion error:', error);
        setConvertedAmount(amount);
      } finally {
        setLoading(false);
      }
    };

    performConversion();
  }, [amount, fromCurrency, currentCurrency, convertPrice]);

  return (
    <div className={`converted-price ${className}`}>
      {showOriginal && (
        <div className={`original-price ${originalClassName}`}>
          {formatPrice(amount, { code: fromCurrency, symbol: '$', decimal_places: 2, symbol_position: 'before' })}
        </div>
      )}

      <div className={`converted-price ${convertedClassName}`}>
        {loading ? (
          <span className="price-loading">Loading...</span>
        ) : (
          formatPrice(convertedAmount)
        )}
      </div>

      <style jsx>{`
        .converted-price {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .original-price {
          font-size: 0.8em;
          color: #666;
          text-decoration: line-through;
        }

        .price-loading {
          color: #999;
          font-style: italic;
        }
      `}</style>
    </div>
  );
};

export default ConvertedPrice;
