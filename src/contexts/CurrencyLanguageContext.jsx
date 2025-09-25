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
        // First, try to load saved currency from localStorage
        const savedCurrency = localStorage.getItem('selectedCurrency');
        if (savedCurrency) {
          try {
            const parsedCurrency = JSON.parse(savedCurrency);
            setCurrentCurrency(parsedCurrency);
          } catch (error) {
            console.warn('Failed to parse saved currency:', error);
          }
        }

        const response = await apiService.getCurrencies();
        if (response.success) {
          const currenciesData = response.data || [];
          setCurrencies(currenciesData);
          
          // Set default currency if none is saved or saved currency is not in the list
          if (!savedCurrency || !currenciesData.find(c => c.code === JSON.parse(savedCurrency || '{}').code)) {
            if (currenciesData.length > 0) {
              const defaultCurrency = currenciesData[0];
              setCurrentCurrency(defaultCurrency);
              localStorage.setItem('selectedCurrency', JSON.stringify(defaultCurrency));
            }
          }
        } else {
          // Fallback to default currencies if API fails
          const fallbackCurrencies = [
            { id: 1, code: 'USD', name: 'US Dollar', symbol: '$', rate: 1.0 },
            { id: 2, code: 'EUR', name: 'Euro', symbol: '€', rate: 0.85 },
            { id: 3, code: 'GBP', name: 'British Pound', symbol: '£', rate: 0.73 }
          ];
          setCurrencies(fallbackCurrencies);
          
          if (!savedCurrency) {
            setCurrentCurrency(fallbackCurrencies[0]);
            localStorage.setItem('selectedCurrency', JSON.stringify(fallbackCurrencies[0]));
          }
        }
      } catch (error) {
        console.error('Failed to load currencies:', error);
        // Fallback currencies
        const fallbackCurrencies = [
          { id: 1, code: 'USD', name: 'US Dollar', symbol: '$', rate: 1.0 },
          { id: 2, code: 'EUR', name: 'Euro', symbol: '€', rate: 0.85 },
          { id: 3, code: 'GBP', name: 'British Pound', symbol: '£', rate: 0.73 }
        ];
        setCurrencies(fallbackCurrencies);
        
        const savedCurrency = localStorage.getItem('selectedCurrency');
        if (savedCurrency) {
          try {
            setCurrentCurrency(JSON.parse(savedCurrency));
          } catch {
            setCurrentCurrency(fallbackCurrencies[0]);
          }
        } else {
          setCurrentCurrency(fallbackCurrencies[0]);
        }
      } finally {
        setLoading(false);
      }
    };

    loadCurrencies();
  }, []);

  const changeCurrency = (currency) => {
    console.log('Changing currency to:', currency);
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
        // First, try to load saved language from localStorage
        const savedLanguage = localStorage.getItem('selectedLanguage');
        if (savedLanguage) {
          try {
            const parsedLanguage = JSON.parse(savedLanguage);
            setCurrentLanguage(parsedLanguage);
          } catch (error) {
            console.warn('Failed to parse saved language:', error);
          }
        }

        const response = await apiService.getLanguages();
        if (response.success) {
          const languagesData = response.data || [];
          setLanguages(languagesData);
          
          // Set default language if none is saved or saved language is not in the list
          if (!savedLanguage || !languagesData.find(l => l.code === JSON.parse(savedLanguage || '{}').code)) {
            if (languagesData.length > 0) {
              const defaultLanguage = languagesData[0];
              setCurrentLanguage(defaultLanguage);
              localStorage.setItem('selectedLanguage', JSON.stringify(defaultLanguage));
            }
          }
        } else {
          // Fallback to default languages if API fails
          const fallbackLanguages = [
            { id: 1, code: 'en', name: 'English', flag: '🇺🇸' },
            { id: 2, code: 'es', name: 'Español', flag: '🇪🇸' },
            { id: 3, code: 'fr', name: 'Français', flag: '🇫🇷' }
          ];
          setLanguages(fallbackLanguages);
          
          if (!savedLanguage) {
            setCurrentLanguage(fallbackLanguages[0]);
            localStorage.setItem('selectedLanguage', JSON.stringify(fallbackLanguages[0]));
          }
        }
      } catch (error) {
        console.error('Failed to load languages:', error);
        // Fallback languages
        const fallbackLanguages = [
          { id: 1, code: 'en', name: 'English', flag: '🇺🇸' },
          { id: 2, code: 'es', name: 'Español', flag: '🇪🇸' },
          { id: 3, code: 'fr', name: 'Français', flag: '🇫🇷' }
        ];
        setLanguages(fallbackLanguages);
        
        const savedLanguage = localStorage.getItem('selectedLanguage');
        if (savedLanguage) {
          try {
            setCurrentLanguage(JSON.parse(savedLanguage));
          } catch {
            setCurrentLanguage(fallbackLanguages[0]);
          }
        } else {
          setCurrentLanguage(fallbackLanguages[0]);
        }
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