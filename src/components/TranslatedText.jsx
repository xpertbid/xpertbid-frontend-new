'use client';

import React, { useState, useEffect, useContext } from 'react';
import { useLanguage } from '@/contexts/CurrencyLanguageContext';

// Create a context to track if we're inside an option element
const OptionContext = React.createContext(false);

const TranslatedText = ({
  text,
  fromLanguage = 'en',
  className = '',
  fallback,
  loadingClassName = '',
  asOption = false // New prop to indicate if this is being used inside an option
}) => {
  const { currentLanguage, translateText, t } = useLanguage();
  const [translatedText, setTranslatedText] = useState(text);
  const [loading, setLoading] = useState(true);
  const isInsideOption = useContext(OptionContext);

  useEffect(() => {
    const translate = async () => {
      if (!currentLanguage || currentLanguage.code === fromLanguage) {
        setTranslatedText(text);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        
        // First try to get translation from the translation key
        const translationKey = text.toLowerCase().replace(/[^a-z0-9\s]/g, '').replace(/\s+/g, '_');
        const keyTranslation = t(translationKey, fallback);
        
        if (keyTranslation && keyTranslation !== translationKey) {
          setTranslatedText(keyTranslation);
        } else {
          // Try to translate the actual text
          const translated = await translateText(text, fromLanguage);
          setTranslatedText(translated);
        }
      } catch (error) {
        console.error('Translation error:', error);
        setTranslatedText(fallback || text);
      } finally {
        setLoading(false);
      }
    };

    translate();
  }, [text, fromLanguage, currentLanguage, translateText, t, fallback]);

  // If this is being used inside an option element (either via prop or context), render plain text
  if (asOption || isInsideOption) {
    return loading ? text : translatedText;
  }

  if (loading) {
    return (
      <span className={`translation-loading ${loadingClassName}`}>
        <span className="spinner-border spinner-border-sm me-1" role="status"></span>
        {text}
      </span>
    );
  }

  return (
    <span className={`translated-text ${className}`}>
      {translatedText}
    </span>
  );
};

// Export a wrapper component for option elements
export const TranslatedOption = ({ text, fromLanguage = 'en', fallback }) => {
  return (
    <OptionContext.Provider value={true}>
      <TranslatedText text={text} fromLanguage={fromLanguage} fallback={fallback} />
    </OptionContext.Provider>
  );
};

export default TranslatedText;

