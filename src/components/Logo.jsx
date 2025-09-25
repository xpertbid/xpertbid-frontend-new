'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

const Logo = ({ className = '', size = 'medium', showText = true, href = '/' }) => {
  const sizeClasses = {
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
        <div className="logo-image">
          <Image
            src="/images/xpertbid-logo.png"
            alt="XpertBid Logo"
            width={138}
            height={36}
            className="logo-img"
            priority
          />
        </div>
        
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

        .logo-image {
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .logo-img {
          object-fit: contain;
          border-radius: 4px;
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