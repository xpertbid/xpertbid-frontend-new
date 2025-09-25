'use client';

import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/CurrencyLanguageContext';



const TranslatedText = ({
  text,
  fromLanguage = 'en',
  className = '',
  fallback,
  loadingClassName = ''
}) => {
  const { currentLanguage, translateText, t } = useLanguage();
  const [translatedText, setTranslatedText] = useState(text);
  const [loading, setLoading] = useState(true);

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

export default TranslatedText;

