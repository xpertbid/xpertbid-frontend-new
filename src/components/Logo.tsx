'use client';

import React from 'react';
import Link from 'next/link';

interface LogoProps {
  className?: string;
  size?: 'small' | 'medium' | 'large';
  showText?: boolean;
  href?: string;
}

const Logo: React.FC<LogoProps> = ({ 
  className = '', 
  size = 'medium', 
  showText = true,
  href = '/'
}) => {
  const sizeClasses = {
    small: 'h-8',
    medium: 'h-12',
    large: 'h-16'
  };

  const textSizes = {
    small: 'text-xl',
    medium: 'text-2xl',
    large: 'text-4xl'
  };

  return (
    <Link href={href} className={`logo-link ${className}`}>
      <div className="logo-container d-flex align-items-center">
        {/* Logo Icon */}
        <div className={`logo-icon ${sizeClasses[size]} me-2`}>
          <svg 
            viewBox="0 0 100 100" 
            className="w-100 h-100"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Background Circle */}
            <circle 
              cx="50" 
              cy="50" 
              r="45" 
              fill="#000000"
            />
            
            {/* X Shape */}
            <path 
              d="M30 30 L70 70 M70 30 L30 70" 
              stroke="#6c757d" 
              strokeWidth="8" 
              strokeLinecap="round"
            />
            
            {/* Arrow */}
            <path 
              d="M25 75 L45 55 L35 45 L55 65 L75 45" 
              stroke="#43ace9" 
              strokeWidth="6" 
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
          </svg>
        </div>
        
        {/* Logo Text */}
        {showText && (
          <div className="logo-text">
            <span className={`logo-text-pert ${textSizes[size]} fw-bold text-primary`}>
              pert
            </span>
            <span className={`logo-text-bid ${textSizes[size]} fw-bold text-dark`}>
              bid
            </span>
          </div>
        )}
      </div>

      <style jsx>{`
        .logo-link {
          text-decoration: none;
          transition: all 0.3s ease;
        }

        .logo-link:hover {
          transform: scale(1.05);
        }

        .logo-container {
          transition: all 0.3s ease;
        }

        .logo-icon {
          transition: all 0.3s ease;
        }

        .logo-text {
          display: flex;
          align-items: baseline;
          line-height: 1;
        }

        .logo-text-pert {
          color: #43ace9 !important;
          font-family: 'Poppins', sans-serif;
          font-weight: 700;
          letter-spacing: -0.02em;
        }

        .logo-text-bid {
          color: #6c757d !important;
          font-family: 'Poppins', sans-serif;
          font-weight: 700;
          letter-spacing: -0.02em;
        }

        /* Dark mode adjustments for footer */
        .footer .logo-text-pert {
          color: #43ace9 !important;
        }

        .footer .logo-text-bid {
          color: #ffffff !important;
        }

        /* Hover effects */
        .logo-link:hover .logo-icon {
          transform: rotate(5deg);
        }

        .logo-link:hover .logo-text-pert {
          color: #2c8bc7 !important;
        }

        .logo-link:hover .logo-text-bid {
          color: #495057 !important;
        }

        .footer .logo-link:hover .logo-text-bid {
          color: #e9ecef !important;
        }

        /* Responsive adjustments */
        @media (max-width: 768px) {
          .logo-text {
            font-size: 0.8em;
          }
        }

        @media (max-width: 576px) {
          .logo-text {
            font-size: 0.7em;
          }
        }
      `}</style>
    </Link>
  );
};

export default Logo;
