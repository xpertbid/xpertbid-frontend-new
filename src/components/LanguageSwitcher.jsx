'use client';

import React, { useState } from 'react';
import { useLanguage } from '@/contexts/CurrencyLanguageContext';

const LanguageSwitcher = ({ className = '', showLabel = true, variant = 'default' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { languages, currentLanguage, changeLanguage, loading } = useLanguage();

  const handleLanguageChange = (language) => {
    changeLanguage(language);
    setIsOpen(false);
  };

  if (loading) {
    return (
      <div className={`language-switcher ${className}`}>
        <div className="spinner-border spinner-border-sm" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  // Fallback if no languages are available
  if (!languages || languages.length === 0) {
    return (
      <div className={`language-switcher ${className}`}>
        <button className="btn btn-outline-secondary" disabled>
          <span className="flag">🇺🇸</span>
          {showLabel && <span className="ms-1">EN</span>}
        </button>
      </div>
    );
  }

  const buttonClass = variant === 'header' 
    ? "btn btn-link text-white p-0 border-0" 
    : "btn btn-outline-secondary dropdown-toggle";

  const buttonStyle = variant === 'header' 
    ? {fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.5px'}
    : {};

  return (
    <div className={`language-switcher dropdown ${className}`}>
      <button
        className={buttonClass}
        onClick={() => setIsOpen(!isOpen)}
        style={buttonStyle}
      >
        <span className="flag">{currentLanguage?.flag || '🇺🇸'}</span>
        {showLabel && <span className="ms-1">{(currentLanguage?.code || 'EN').toUpperCase()}</span>}
        {variant === 'header' && <i className="fas fa-chevron-down ms-1" style={{fontSize: '10px'}}></i>}
      </button>

      {isOpen && (
        <div className="dropdown-menu show" style={{ position: 'absolute', top: '100%', right: '0', zIndex: 1050 }}>
          {languages.map((language) => (
            <button
              key={language.code}
              className={`dropdown-item ${currentLanguage?.code === language.code ? 'active' : ''}`}
              onClick={() => handleLanguageChange(language)}
            >
              <span className="flag me-2">{language.flag}</span>
              {language.name}
            </button>
          ))}
        </div>
      )}

      {/* Click outside to close */}
      {isOpen && (
        <div 
          className="position-fixed top-0 start-0 w-100 h-100" 
          style={{ zIndex: 1040 }}
          onClick={() => setIsOpen(false)}
        />
      )}

      <style jsx>{`
        .language-switcher {
          position: relative;
        }

        .dropdown-menu {
          position: absolute;
          top: 100%;
          right: 0;
          min-width: 150px;
          background: white;
          border: 1px solid #ddd;
          border-radius: 4px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
          z-index: 1000;
        }

        .dropdown-item {
          display: flex;
          align-items: center;
          width: 100%;
          padding: 8px 12px;
          border: none;
          background: none;
          text-align: left;
          cursor: pointer;
          transition: background-color 0.2s;
        }

        .dropdown-item:hover {
          background-color: #f8f9fa;
        }

        .dropdown-item.active {
          background-color: #e3f2fd;
          color: #1976d2;
        }

        .flag {
          font-size: 16px;
        }
      `}</style>
    </div>
  );
};

export default LanguageSwitcher;