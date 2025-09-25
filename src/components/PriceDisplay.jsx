'use client';

import React, { useState, useEffect } from 'react';
import { apiService } from '@/services/api';
import { useCurrency } from '@/contexts/CurrencyLanguageContext';

const PriceDisplay = ({
  amount,
  fromCurrency = 'USD',
  className = '',
  showOriginal = false,
  originalClassName = '',
  convertedClassName = ''
}) => {
  const [convertedPrice, setConvertedPrice] = useState('');
  const [loading, setLoading] = useState(true);
  const { currentCurrency, formatPrice } = useCurrency();

  useEffect(() => {
    const convertPrice = async () => {
      try {
        setLoading(true);
        
        // If currencies are the same, no conversion needed
        if (fromCurrency === currentCurrency?.code) {
          setConvertedPrice(amount);
          setLoading(false);
          return;
        }
        
        // Call the backend conversion API
        const response = await apiService.convertPrice(amount, fromCurrency, currentCurrency?.code);
        
        if (response.success) {
          setConvertedPrice(response.data.converted_amount);
        } else {
          // Fallback to original amount if conversion fails
          setConvertedPrice(amount);
        }
      } catch (error) {
        console.error('Currency conversion error:', error);
        // Fallback to original amount
        setConvertedPrice(amount);
      } finally {
        setLoading(false);
      }
    };

    if (amount && currentCurrency) {
      convertPrice();
    }
  }, [amount, fromCurrency, currentCurrency]);

  return (
    <div className={`price-display ${className}`}>
      {showOriginal && (
        <div className={`original-price ${originalClassName}`}>
          {formatPrice(amount, { code: fromCurrency })}
        </div>
      )}
      
      <div className={`converted-price ${convertedClassName}`}>
        {loading ? (
          <span className="price-loading">Loading...</span>
        ) : (
          formatPrice(convertedPrice)
        )}
      </div>

      <style jsx>{`
        .price-display {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .original-price {
          text-decoration: line-through;
          color: #999;
          font-size: 0.9em;
        }

        .converted-price {
          font-weight: bold;
          color: #333;
        }

        .price-loading {
          color: #999;
          font-style: italic;
        }
      `}</style>
    </div>
  );
};

export default PriceDisplay;