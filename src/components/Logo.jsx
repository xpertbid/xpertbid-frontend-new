'use client';

import React from 'react';
import Link from 'next/link';

const Logo = ({ className = '', size = 'medium', showText = true, href = '/' }) => {
  const sizeClasses = {
    small: 'h-8',
    medium: 'h-12',
    large: 'h-16'
  };

  const textSizes = {
    small: 'text-lg',
    medium: 'text-2xl',
    large: 'text-4xl'
  };

  return (
    <Link href={href} className={`logo ${className}`}>
      <div className="logo-container">
        <div className="logo-icon">
          <i className="fas fa-home"></i>
        </div>
        {showText && (
          <div className={`logo-text ${textSizes[size]}`}>
            WoodMart
          </div>
        )}
      </div>

      <style jsx>{`
        .logo {
          text-decoration: none;
          color: inherit;
        }

        .logo-container {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .logo-icon {
          background: linear-gradient(135deg, #83B735 0%, #6B9B2A 100%);
          color: white;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 40px;
          height: 40px;
        }

        .logo-text {
          font-weight: 700;
          color: #333;
          font-family: 'Poppins', sans-serif;
        }

        .logo:hover .logo-text {
          color: #83B735;
        }
      `}</style>
    </Link>
  );
};

export default Logo;