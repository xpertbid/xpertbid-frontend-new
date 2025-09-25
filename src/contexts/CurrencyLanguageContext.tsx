'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Currency, Language, Translation } from '@/types';
import { apiService } from '@/services/api';

interface CurrencyContextType {
  currencies: Currency[];
  currentCurrency: Currency | null;
  setCurrentCurrency: (currency: Currency) => void;
  formatPrice: (price: number, currency?: Currency) => string;
  formatPriceWithConversion: (price: number, fromCurrency?: string) => Promise<string>;
  convertPrice: (price: number, fromCurrency: string, toCurrency: string) => Promise<number>;
  loading: boolean;
  error: string | null;
}

interface LanguageContextType {
  languages: Language[];
  currentLanguage: Language | null;
  setCurrentLanguage: (language: Language) => void;
  translations: Translation;
  t: (key: string, fallback?: string) => string;
  translateText: (text: string, fromLanguage?: string) => Promise<string>;
  loading: boolean;
  error: string | null;
  isRTL: boolean;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);
const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Currency Provider
export const CurrencyProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currencies, setCurrencies] = useState<Currency[]>([]);
  const [currentCurrency, setCurrentCurrency] = useState<Currency | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadCurrencies = async () => {
      try {
        setLoading(true);
        const response = await apiService.getCurrencies();
        
        if (response.success) {
          setCurrencies(response.data);
          
          // Try to get saved currency from localStorage
          const savedCurrencyCode = localStorage.getItem('selected_currency');
          if (savedCurrencyCode) {
            const savedCurrency = response.data.find(c => c.code === savedCurrencyCode);
            if (savedCurrency) {
              setCurrentCurrency(savedCurrency);
            } else {
              // Fallback to default currency
              const defaultCurrency = response.data.find(c => c.is_default);
              if (defaultCurrency) {
                setCurrentCurrency(defaultCurrency);
              }
            }
          } else {
            // Get default currency
            const defaultResponse = await apiService.getDefaultCurrency();
            if (defaultResponse.success) {
              setCurrentCurrency(defaultResponse.data);
            }
          }
        } else {
          setError('Failed to load currencies');
        }
      } catch (err) {
        setError('Error loading currencies');
        console.error('Error loading currencies:', err);
      } finally {
        setLoading(false);
      }
    };

    loadCurrencies();
  }, []);

  const handleSetCurrentCurrency = (currency: Currency) => {
    setCurrentCurrency(currency);
    localStorage.setItem('selected_currency', currency.code);
  };

  const formatPrice = (price: number, currency?: Currency): string => {
    const curr = currency || currentCurrency;
    if (!curr) return `$${price.toFixed(2)}`;

    const formattedPrice = price.toFixed(curr.decimal_places);
    
    if (curr.symbol_position === 'before') {
      return `${curr.symbol}${formattedPrice}`;
    } else {
      return `${formattedPrice} ${curr.symbol}`;
    }
  };

  const formatPriceWithConversion = async (price: number, fromCurrency: string = 'USD'): Promise<string> => {
    if (!currentCurrency) {
      return `$${price.toFixed(2)}`;
    }

    try {
      const response = await apiService.convertCurrency(price, fromCurrency, currentCurrency.code);
      if (response.success) {
        const convertedAmount = response.data.converted_amount;
        const formattedAmount = convertedAmount.toFixed(currentCurrency.decimal_places);
        
        if (currentCurrency.symbol_position === 'before') {
          return `${currentCurrency.symbol}${formattedAmount}`;
        } else {
          return `${formattedAmount} ${currentCurrency.symbol}`;
        }
      }
    } catch (error) {
      console.error('Currency conversion error:', error);
    }

    // Fallback to local formatting
    return formatPrice(price);
  };

  const convertPrice = async (price: number, fromCurrency: string, toCurrency: string): Promise<number> => {
    try {
      const response = await apiService.convertCurrency(price, fromCurrency, toCurrency);
      if (response.success) {
        return response.data.converted_amount;
      }
      return price; // Fallback to original price
    } catch (err) {
      console.error('Error converting currency:', err);
      return price; // Fallback to original price
    }
  };

  return (
    <CurrencyContext.Provider
      value={{
        currencies,
        currentCurrency,
        setCurrentCurrency: handleSetCurrentCurrency,
        formatPrice,
        formatPriceWithConversion,
        convertPrice,
        loading,
        error
      }}
    >
      {children}
    </CurrencyContext.Provider>
  );
};

// Language Provider
export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [languages, setLanguages] = useState<Language[]>([]);
  const [currentLanguage, setCurrentLanguage] = useState<Language | null>(null);
  const [translations, setTranslations] = useState<Translation>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadLanguages = async () => {
      try {
        setLoading(true);
        const response = await apiService.getLanguages();
        
        if (response.success) {
          setLanguages(response.data);
          
          // Try to get saved language from localStorage
          const savedLanguageCode = localStorage.getItem('selected_language');
          if (savedLanguageCode) {
            const savedLanguage = response.data.find(l => l.code === savedLanguageCode);
            if (savedLanguage) {
              setCurrentLanguage(savedLanguage);
              await loadTranslations(savedLanguage.code);
            } else {
              // Fallback to default language
              const defaultLanguage = response.data.find(l => l.is_default);
              if (defaultLanguage) {
                setCurrentLanguage(defaultLanguage);
                await loadTranslations(defaultLanguage.code);
              }
            }
          } else {
            // Get default language
            const defaultResponse = await apiService.getDefaultLanguage();
            if (defaultResponse.success) {
              setCurrentLanguage(defaultResponse.data);
              await loadTranslations(defaultResponse.data.code);
            }
          }
        } else {
          setError('Failed to load languages');
        }
      } catch (err) {
        setError('Error loading languages');
        console.error('Error loading languages:', err);
      } finally {
        setLoading(false);
      }
    };

    loadLanguages();
  }, []);

  const loadTranslations = async (languageCode: string) => {
    try {
      const response = await apiService.getTranslations(languageCode);
      if (response.success) {
        setTranslations(response.data);
      }
    } catch {
      console.warn('No translations available for language:', languageCode);
      // Don't fail if translations are not available
      setTranslations({});
    }
  };

  const handleSetCurrentLanguage = async (language: Language) => {
    setCurrentLanguage(language);
    localStorage.setItem('selected_language', language.code);
    await loadTranslations(language.code);
    
    // Update document direction
    document.documentElement.dir = language.direction;
    document.documentElement.lang = language.code;
  };

  const t = (key: string, fallback?: string): string => {
    return translations[key] || fallback || key;
  };

  const translateText = async (text: string, fromLanguage: string = 'en'): Promise<string> => {
    if (!currentLanguage || currentLanguage.code === fromLanguage) {
      return text;
    }

    try {
      // First try to get translation from the translation key
      const translationKey = text.toLowerCase().replace(/[^a-z0-9\s]/g, '').replace(/\s+/g, '_');
      const keyTranslation = translations[translationKey];
      
      if (keyTranslation) {
        return keyTranslation;
      }

      // Try API translation
      const response = await apiService.translateText(text, fromLanguage, currentLanguage.code);
      if (response.success) {
        return response.data.translated_text;
      }
      
      // Fallback to original text if no translation found
      return text;
    } catch (error) {
      console.error('Translation error:', error);
      return text;
    }
  };

  const isRTL = currentLanguage?.direction === 'rtl';

  return (
    <LanguageContext.Provider
      value={{
        languages,
        currentLanguage,
        setCurrentLanguage: handleSetCurrentLanguage,
        translations,
        t,
        translateText,
        loading,
        error,
        isRTL
      }}
    >
      {children}
    </LanguageContext.Provider>
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
