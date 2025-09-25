'use client';

import React, { useState, useEffect } from 'react';

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

  useEffect(() => {
    const convertPrice = async () => {
      try {
        setLoading(true);
        // Simulate API call for currency conversion
        // In a real app, you would call your currency conversion API
        const converted = amount * 1.1; // Mock conversion rate
        setConvertedPrice(converted.toFixed(2));
      } catch (error) {
        console.error('Currency conversion error:', error);
        setConvertedPrice(amount.toFixed(2));
      } finally {
        setLoading(false);
      }
    };

    convertPrice();
  }, [amount, fromCurrency]);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };

  return (
    <div className={`price-display ${className}`}>
      {showOriginal && (
        <div className={`original-price ${originalClassName}`}>
          {formatPrice(amount)}
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