'use client';

import React from 'react';
import { useCart } from '@/contexts/CartContext';

const CartDrawer = ({ isOpen, onClose }) => {
  const { items, updateQuantity, removeItem, totalPrice } = useCart();

  const subtotal = totalPrice;

  return (
    <div className={`cart-drawer ${isOpen ? 'open' : ''}`}>
      <div className="cart-drawer-overlay" onClick={onClose}></div>
      <div className="cart-drawer-content">
        <div className="cart-drawer-header">
          <h5>Shopping Cart</h5>
          <button className="btn-close" onClick={onClose}>
            <i className="fas fa-times"></i>
          </button>
        </div>

        <div className="cart-drawer-body">
          {items.length === 0 ? (
            <div className="empty-cart text-center py-4">
              <i className="fas fa-shopping-cart fa-3x text-muted mb-3"></i>
              <p className="text-muted">Your cart is empty</p>
            </div>
          ) : (
            <div className="cart-items">
              {items.map((item) => (
                <div key={item.id} className="cart-item">
                  <div className="item-image">
                    <img src={item.image} alt={item.name} />
                  </div>
                  <div className="item-details">
                    <h6>{item.name}</h6>
                    <p className="item-price">${item.price}</p>
                    <div className="quantity-controls">
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                      >
                        -
                      </button>
                      <span>{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>
                        +
                      </button>
                    </div>
                  </div>
                  <button 
                    className="remove-item"
                    onClick={() => removeItem(item.id)}
                  >
                    <i className="fas fa-trash"></i>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {items.length > 0 && (
          <div className="cart-drawer-footer">
            <div className="cart-total">
              <strong>Total: ${subtotal.toFixed(2)}</strong>
            </div>
            <button className="btn btn-primary w-100">
              Proceed to Checkout
            </button>
          </div>
        )}
      </div>

      <style jsx>{`
        .cart-drawer {
          position: fixed;
          top: 0;
          right: -400px;
          width: 400px;
          height: 100vh;
          background: white;
          z-index: 1000;
          transition: right 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: -4px 0 20px rgba(0, 0, 0, 0.15);
          border-left: 1px solid var(--gray-200);
        }

        .cart-drawer.open {
          right: 0;
        }

        .cart-drawer-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          background: rgba(0, 0, 0, 0.6);
          backdrop-filter: blur(4px);
          z-index: 999;
          opacity: 0;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          cursor: pointer;
        }

        .cart-drawer.open .cart-drawer-overlay {
          opacity: 1;
          pointer-events: auto;
        }

        .cart-drawer-overlay {
          pointer-events: none;
        }

        .cart-drawer-content {
          display: flex;
          flex-direction: column;
          height: 100%;
        }

        .cart-drawer-header {
          padding: 24px;
          border-bottom: 1px solid var(--gray-200);
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: var(--light-color);
        }

        .cart-drawer-header h5 {
          font-family: var(--font-family-heading);
          font-size: var(--font-size-h5);
          font-weight: 600;
          color: var(--secondary-color);
          margin: 0;
        }

        .btn-close {
          background: none;
          border: none;
          color: var(--gray-600);
          cursor: pointer;
          padding: 8px;
          border-radius: var(--border-radius);
          transition: all 0.2s ease;
        }

        .btn-close:hover {
          background: var(--gray-100);
          color: var(--secondary-color);
        }

        .cart-drawer-body {
          flex: 1;
          overflow-y: auto;
          padding: 20px;
        }

        .cart-item {
          display: flex;
          align-items: center;
          padding: 16px 0;
          border-bottom: 1px solid var(--gray-200);
          transition: background-color 0.2s ease;
        }

        .cart-item:hover {
          background-color: var(--gray-50);
          margin: 0 -20px;
          padding-left: 20px;
          padding-right: 20px;
        }

        .item-image {
          width: 60px;
          height: 60px;
          margin-right: 15px;
        }

        .item-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          border-radius: 4px;
        }

        .item-details {
          flex: 1;
        }

        .item-details h6 {
          margin: 0 0 8px 0;
          font-family: var(--font-family-heading);
          font-size: var(--font-size-base);
          font-weight: 600;
          color: var(--secondary-color);
          line-height: 1.4;
        }

        .item-price {
          margin: 0 0 12px 0;
          font-family: var(--font-family-heading);
          font-weight: 700;
          color: var(--primary-color);
          font-size: var(--font-size-lg);
        }

        .quantity-controls {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .quantity-controls button {
          width: 28px;
          height: 28px;
          border: 1px solid var(--gray-300);
          background: white;
          border-radius: var(--border-radius);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 600;
          color: var(--gray-700);
          transition: all 0.2s ease;
        }

        .quantity-controls button:hover {
          background: var(--primary-color);
          border-color: var(--primary-color);
          color: white;
        }

        .quantity-controls button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .quantity-controls span {
          font-weight: 600;
          color: var(--secondary-color);
          min-width: 20px;
          text-align: center;
        }

        .remove-item {
          background: none;
          border: none;
          color: var(--gray-500);
          cursor: pointer;
          padding: 8px;
          border-radius: var(--border-radius);
          transition: all 0.2s ease;
        }

        .remove-item:hover {
          background: var(--danger-color);
          color: white;
        }

        .cart-drawer-footer {
          padding: 24px;
          border-top: 1px solid var(--gray-200);
          background: var(--light-color);
        }

        .cart-total {
          margin-bottom: 20px;
          text-align: center;
          font-family: var(--font-family-heading);
          font-size: var(--font-size-xl);
          font-weight: 700;
          color: var(--secondary-color);
        }

        .btn {
          padding: 14px 24px;
          font-family: var(--font-family-heading);
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          border-radius: var(--border-radius);
          transition: all 0.3s ease;
          text-decoration: none;
          display: inline-block;
          border: 2px solid transparent;
          cursor: pointer;
        }

        .btn-primary {
          background: var(--primary-color);
          border-color: var(--primary-color);
          color: white;
          width: 100%;
        }

        .btn-primary:hover {
          background: var(--primary-hover);
          border-color: var(--primary-hover);
          color: white;
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(67, 172, 233, 0.3);
        }

        .empty-cart {
          padding: 40px 20px;
        }

        @media (max-width: 480px) {
          .cart-drawer {
            width: 100%;
            right: -100%;
          }
        }
      `}</style>
    </div>
  );
};

export default CartDrawer;