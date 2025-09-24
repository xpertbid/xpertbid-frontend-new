'use client';

import React, { ReactNode } from 'react';
import Header from './Header';
import Footer from './Footer';
import CartDrawer from './CartDrawer';
import { useCart } from '@/contexts/CartContext';
import ApiStatusIndicator from './ApiStatusIndicator';

interface LayoutProps {
  children: ReactNode;
  className?: string;
}

const LayoutContent: React.FC<{ children: ReactNode; className: string }> = ({ children, className }) => {
  const { isDrawerOpen, closeDrawer } = useCart();
  
  return (
    <div className={`layout ${className}`}>
      <ApiStatusIndicator />
      <Header />
      <main className="main-content">
        {children}
      </main>
      <Footer />
      <CartDrawer isOpen={isDrawerOpen} onClose={closeDrawer} />
      
      <style jsx>{`
        .layout {
          display: flex;
          flex-direction: column;
          min-height: 100vh;
        }

        .main-content {
          flex: 1;
          padding-top: 0;
        }

        /* Adjust header position when API status banner is shown */
        .layout:has(.api-status-indicator) .header {
          top: 40px;
        }

        /* Smooth scrolling */
        html {
          scroll-behavior: smooth;
        }

        /* Custom scrollbar */
        ::-webkit-scrollbar {
          width: 8px;
        }

        ::-webkit-scrollbar-track {
          background: var(--gray-100);
        }

        ::-webkit-scrollbar-thumb {
          background: var(--gray-400);
          border-radius: 4px;
        }

        ::-webkit-scrollbar-thumb:hover {
          background: var(--gray-500);
        }
      `}</style>
    </div>
  );
};

const Layout: React.FC<LayoutProps> = ({ children, className = '' }) => {
  return (
    <LayoutContent className={className}>
      {children}
    </LayoutContent>
  );
};

export default Layout;
