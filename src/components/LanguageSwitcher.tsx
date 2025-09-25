'use client';

import React, { useState } from 'react';
import { useLanguage } from '@/contexts/CurrencyLanguageContext';
// import { Language } from '@/types';
import Image from 'next/image';

interface LanguageSwitcherProps {
  className?: string;
  showLabel?: boolean;
}

const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({ 
  className = '', 
  showLabel = true 
}) => {
  const { languages, currentLanguage, setCurrentLanguage, loading } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);

  if (loading || !currentLanguage) {
    return (
      <div className={`language-switcher ${className}`}>
        <div className="language-button">
          <span className="language-flag">🇺🇸</span>
          <span className="language-code">EN</span>
        </div>
      </div>
    );
  }

  return (
    <div className={`language-switcher ${className}`}>
      {showLabel && <span className="language-label">Language:</span>}
      
      <div className="language-dropdown">
        <button 
          className="language-button"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Select language"
        >
          <span className="language-flag">
            {currentLanguage.flag_url ? (
              <Image 
                src={currentLanguage.flag_url} 
                alt={currentLanguage.name}
                width={20}
                height={15}
                className="flag-image"
              />
            ) : (
              <span className="flag-emoji">🌐</span>
            )}
          </span>
          <span className="language-code">{currentLanguage.code.toUpperCase()}</span>
          <i className={`fas fa-chevron-${isOpen ? 'up' : 'down'}`}></i>
        </button>

        {isOpen && (
          <div className="language-dropdown-menu">
            {languages.map((language) => (
              <button
                key={language.id}
                className={`language-option ${language.id === currentLanguage.id ? 'active' : ''}`}
                onClick={() => {
                  setCurrentLanguage(language);
                  setIsOpen(false);
                }}
              >
                <span className="language-flag">
                  {language.flag_url ? (
                    <Image 
                      src={language.flag_url} 
                      alt={language.name}
                      width={20}
                      height={15}
                      className="flag-image"
                    />
                  ) : (
                    <span className="flag-emoji">🌐</span>
                  )}
                </span>
                <span className="language-name">{language.native_name}</span>
                <span className="language-code">({language.code.toUpperCase()})</span>
                {language.is_default && <span className="default-badge">Default</span>}
              </button>
            ))}
          </div>
        )}
      </div>

      <style jsx>{`
        .language-switcher {
          position: relative;
          display: inline-block;
        }

        .language-label {
          font-size: 14px;
          color: var(--gray-600);
          margin-right: 8px;
        }

        .language-dropdown {
          position: relative;
        }

        .language-button {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 8px 12px;
          background: white;
          border: 1px solid var(--gray-300);
          border-radius: var(--border-radius-lg);
          cursor: pointer;
          transition: all 0.3s ease;
          font-size: 14px;
          font-weight: 500;
        }

        .language-button:hover {
          border-color: var(--primary-color);
          box-shadow: 0 2px 8px rgba(67, 172, 233, 0.15);
        }

        .language-flag {
          display: flex;
          align-items: center;
        }

        .flag-image {
          border-radius: 2px;
          object-fit: cover;
        }

        .flag-emoji {
          font-size: 16px;
        }

        .language-code {
          font-weight: 500;
          color: var(--secondary-color);
        }

        .language-dropdown-menu {
          position: absolute;
          top: 100%;
          left: 0;
          right: 0;
          background: white;
          border: 1px solid var(--gray-300);
          border-radius: var(--border-radius-lg);
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
          z-index: 1000;
          max-height: 300px;
          overflow-y: auto;
          margin-top: 4px;
          min-width: 200px;
        }

        .language-option {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 12px 16px;
          width: 100%;
          background: none;
          border: none;
          cursor: pointer;
          transition: background-color 0.2s ease;
          text-align: left;
          font-size: 14px;
        }

        .language-option:hover {
          background-color: var(--gray-100);
        }

        .language-option.active {
          background-color: var(--primary-color);
          color: white;
        }

        .language-name {
          flex: 1;
          font-weight: 500;
        }

        .default-badge {
          font-size: 10px;
          background: var(--success-color);
          color: white;
          padding: 2px 6px;
          border-radius: var(--border-radius-sm);
          font-weight: 600;
          text-transform: uppercase;
        }

        .language-option.active .default-badge {
          background: rgba(255, 255, 255, 0.2);
        }

        @media (max-width: 768px) {
          .language-button {
            padding: 6px 10px;
            font-size: 13px;
          }

          .language-option {
            padding: 10px 12px;
            font-size: 13px;
          }

          .language-dropdown-menu {
            min-width: 180px;
          }
        }
      `}</style>
    </div>
  );
};

export default LanguageSwitcher;
