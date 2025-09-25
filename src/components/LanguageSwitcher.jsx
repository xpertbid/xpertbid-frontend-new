'use client';

import React, { useState } from 'react';

const LanguageSwitcher = ({ className = '', showLabel = true }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState('en');

  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'es', name: 'Español', flag: '🇪🇸' },
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
    { code: 'de', name: 'Deutsch', flag: '🇩🇪' }
  ];

  const currentLang = languages.find(lang => lang.code === currentLanguage) || languages[0];

  return (
    <div className={`language-switcher dropdown ${className}`}>
      <button
        className="btn btn-outline-secondary dropdown-toggle"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="flag">{currentLang.flag}</span>
        {showLabel && <span className="ms-1">{currentLang.code.toUpperCase()}</span>}
      </button>

      {isOpen && (
        <div className="dropdown-menu show">
          {languages.map((language) => (
            <button
              key={language.code}
              className={`dropdown-item ${currentLanguage === language.code ? 'active' : ''}`}
              onClick={() => {
                setCurrentLanguage(language.code);
                setIsOpen(false);
              }}
            >
              <span className="flag me-2">{language.flag}</span>
              {language.name}
            </button>
          ))}
        </div>
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