'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiService } from '@/services/api';

const CurrencyContext = createContext(undefined);
const LanguageContext = createContext(undefined);

// Currency Provider
export const CurrencyProvider = ({ children }) => {
  const [currencies, setCurrencies] = useState([]);
  const [currentCurrency, setCurrentCurrency] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCurrencies = async () => {
      try {
        const response = await apiService.getCurrencies();
        if (response.success) {
          setCurrencies(response.data || []);
          // Set default currency
          if (response.data && response.data.length > 0) {
            setCurrentCurrency(response.data[0]);
          }
        }
      } catch (error) {
        console.error('Failed to load currencies:', error);
      } finally {
        setLoading(false);
      }
    };

    loadCurrencies();
  }, []);

  const changeCurrency = (currency) => {
    setCurrentCurrency(currency);
    localStorage.setItem('selectedCurrency', JSON.stringify(currency));
  };

  const formatPrice = (price, currency = currentCurrency) => {
    if (!currency || !price) return '$0.00';
    
    const formattedPrice = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency.code || 'USD',
      minimumFractionDigits: 2,
    }).format(price);
    
    return formattedPrice;
  };

  const value = {
    currencies,
    currentCurrency,
    loading,
    changeCurrency,
    formatPrice,
  };

  return (
    <CurrencyContext.Provider value={value}>
      {children}
    </CurrencyContext.Provider>
  );
};

// Language Provider
export const LanguageProvider = ({ children }) => {
  const [languages, setLanguages] = useState([]);
  const [currentLanguage, setCurrentLanguage] = useState(null);
  const [translations, setTranslations] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadLanguages = async () => {
      try {
        const response = await apiService.getLanguages();
        if (response.success) {
          setLanguages(response.data || []);
          // Set default language
          if (response.data && response.data.length > 0) {
            setCurrentLanguage(response.data[0]);
          }
        }
      } catch (error) {
        console.error('Failed to load languages:', error);
      } finally {
        setLoading(false);
      }
    };

    loadLanguages();
  }, []);

  const changeLanguage = async (language) => {
    setCurrentLanguage(language);
    localStorage.setItem('selectedLanguage', JSON.stringify(language));
    
    // Load translations for the selected language
    try {
      const response = await apiService.getTranslations(language.code);
      if (response.success) {
        setTranslations(response.data || {});
      }
    } catch (error) {
      console.error('Failed to load translations:', error);
    }
  };

  const translate = (key, fallback = key) => {
    return translations[key] || fallback;
  };

  const value = {
    languages,
    currentLanguage,
    translations,
    loading,
    changeLanguage,
    translate,
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

// Combined Provider
export const CurrencyLanguageProvider = ({ children }) => {
  return (
    <CurrencyProvider>
      <LanguageProvider>
        {children}
      </LanguageProvider>
    </CurrencyProvider>
  );
};

// Hooks
export const useCurrency = () => {
  const context = useContext(CurrencyContext);
  if (context === undefined) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};