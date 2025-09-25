'use client';

import React, { useState, useEffect } from 'react';
import { useCurrency } from '@/contexts/CurrencyLanguageContext';

interface PriceDisplayProps {
  amount: number;
  fromCurrency?: string;
  className?: string;
  showOriginal?: boolean;
  originalClassName?: string;
  convertedClassName?: string;
}

const PriceDisplay: React.FC<PriceDisplayProps> = ({
  amount,
  fromCurrency = 'USD',
  className = '',
  showOriginal = false,
  originalClassName = '',
  convertedClassName = ''
}) => {
  const { currentCurrency, formatPriceWithConversion } = useCurrency();
  const [convertedPrice, setConvertedPrice] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const convertPrice = async () => {
      // Ensure amount is a valid number with additional safety checks
      let numericAmount = 0;
      
      if (typeof amount === 'number' && !isNaN(amount) && isFinite(amount)) {
        numericAmount = amount;
      } else if (typeof amount === 'string') {
        const parsed = parseFloat(amount);
        if (!isNaN(parsed) && isFinite(parsed)) {
          numericAmount = parsed;
        }
      } else if (amount != null) {
        // Try to convert other types to number
        const converted = Number(amount);
        if (!isNaN(converted) && isFinite(converted)) {
          numericAmount = converted;
        }
      }
      
      if (!currentCurrency) {
        setConvertedPrice(`$${numericAmount.toFixed(2)}`);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const formattedPrice = await formatPriceWithConversion(numericAmount, fromCurrency);
        setConvertedPrice(formattedPrice);
      } catch (error) {
        console.error('Price conversion error:', error);
        setConvertedPrice(`$${numericAmount.toFixed(2)}`);
      } finally {
        setLoading(false);
      }
    };

    convertPrice();
  }, [amount, fromCurrency, currentCurrency, formatPriceWithConversion]);

  if (loading) {
    return (
      <span className={`price-loading ${className}`}>
        <span className="spinner-border spinner-border-sm me-1" role="status"></span>
        Loading...
      </span>
    );
  }

  if (showOriginal && fromCurrency !== currentCurrency?.code) {
    return (
      <div className={`price-container ${className}`}>
        <span className={`converted-price ${convertedClassName}`}>
          {convertedPrice}
        </span>
        <span className={`original-price ${originalClassName}`}>
          ${(typeof amount === 'number' && !isNaN(amount) && isFinite(amount) ? amount : 0).toFixed(2)}
        </span>
      </div>
    );
  }

  return (
    <span className={`price-display ${className}`}>
      {convertedPrice}
    </span>
  );
};

export default PriceDisplay;
