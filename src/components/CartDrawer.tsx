'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/contexts/CartContext';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

const CartDrawer: React.FC<CartDrawerProps> = ({ isOpen, onClose }) => {
  const { items, updateQuantity, removeItem, itemCount, totalPrice } = useCart();

  const subtotal = totalPrice;
  const freeShippingThreshold = 1500;
  const remainingForFreeShipping = Math.max(0, freeShippingThreshold - subtotal);

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div className="cart-drawer-backdrop" onClick={onClose}></div>
      )}

      {/* Drawer */}
      <div className={`cart-drawer ${isOpen ? 'open' : ''}`}>
        <div className="cart-drawer-header">
          <h3 className="cart-title">Shopping cart</h3>
          <button className="cart-close" onClick={onClose}>
            X Close
          </button>
        </div>

        <div className="cart-drawer-content">
          {items.length === 0 ? (
            <div className="empty-cart">
              <p>Your cart is empty</p>
              <Link href="/shop" className="btn btn-primary" onClick={onClose}>
                Start Shopping
              </Link>
            </div>
          ) : (
            <>
              <div className="cart-items">
                {items.map((item) => (
                  <div key={item.id} className="cart-item">
                    <div className="item-image">
                      <Image
                        src={item.image || '/images/placeholder.svg'}
                        alt={item.name}
                        width={80}
                        height={80}
                        className="img-fluid"
                      />
                    </div>
                    
                    <div className="item-details">
                      <div className="item-header">
                        <h4 className="item-name">{item.name}</h4>
                        <button 
                          className="remove-btn"
                          onClick={() => removeItem(item.id)}
                          title="Remove item"
                        >
                          <i className="fas fa-times"></i>
                        </button>
                      </div>
                      
                      <div className="quantity-controls">
                        <button
                          className="quantity-btn"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        >
                          -
                        </button>
                        <input
                          type="number"
                          value={item.quantity}
                          onChange={(e) => updateQuantity(item.id, parseInt(e.target.value) || 1)}
                          className="quantity-input"
                          min="1"
                        />
                        <button
                          className="quantity-btn"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        >
                          +
                        </button>
                      </div>
                      
                      <div className="item-price">
                        <span className="price">
                          {item.quantity} x ${item.price.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="cart-summary">
                <div className="subtotal-row">
                  <span className="subtotal-label">Subtotal:</span>
                  <span className="subtotal-price">${subtotal.toFixed(2)}</span>
                </div>

                {remainingForFreeShipping > 0 && (
                  <div className="free-shipping-notice">
                    <p>
                      Add <span className="highlight">${remainingForFreeShipping.toFixed(2)}</span> to cart and get <span className="highlight">free shipping!</span>
                    </p>
                    <div className="progress-bar">
                      <div 
                        className="progress-fill"
                        style={{ width: `${(subtotal / freeShippingThreshold) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                )}

                <div className="cart-actions">
                  <Link href="/cart" className="btn btn-secondary" onClick={onClose}>
                    VIEW CART
                  </Link>
                  <Link href="/checkout" className="btn btn-primary" onClick={onClose}>
                    CHECKOUT
                  </Link>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      <style jsx>{`
        .cart-drawer-backdrop {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.5);
          z-index: 1000;
          opacity: 1;
          transition: opacity 0.3s ease;
        }

        .cart-drawer {
          position: fixed;
          top: 0;
          right: 0;
          width: 400px;
          height: 100vh;
          background: white;
          box-shadow: -5px 0 15px rgba(0, 0, 0, 0.1);
          z-index: 1001;
          transform: translateX(100%);
          transition: transform 0.3s ease;
          display: flex;
          flex-direction: column;
        }

        .cart-drawer.open {
          transform: translateX(0);
        }

        .cart-drawer-header {
          padding: 20px;
          border-bottom: 1px solid #e9ecef;
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: white;
        }

        .cart-title {
          font-family: var(--font-family-heading);
          font-size: 18px;
          font-weight: 700;
          color: var(--secondary-color);
          margin: 0;
        }

        .cart-close {
          background: none;
          border: none;
          color: var(--gray-600);
          font-size: 14px;
          cursor: pointer;
          padding: 5px;
          transition: color 0.3s ease;
        }

        .cart-close:hover {
          color: var(--secondary-color);
        }

        .cart-drawer-content {
          flex: 1;
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }

        .cart-items {
          flex: 1;
          overflow-y: auto;
          padding: 20px;
        }

        .cart-item {
          display: flex;
          gap: 15px;
          margin-bottom: 20px;
          padding-bottom: 20px;
          border-bottom: 1px solid #f8f9fa;
        }

        .cart-item:last-child {
          border-bottom: none;
          margin-bottom: 0;
        }

        .item-image {
          flex-shrink: 0;
          width: 80px;
          height: 80px;
          border-radius: var(--border-radius-sm);
          overflow: hidden;
          background: #f8f9fa;
        }

        .item-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .item-details {
          flex: 1;
          min-width: 0;
        }

        .item-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 10px;
        }

        .item-name {
          font-family: var(--font-family-heading);
          font-size: 14px;
          font-weight: 600;
          color: var(--secondary-color);
          margin: 0;
          line-height: 1.4;
          flex: 1;
          margin-right: 10px;
        }

        .remove-btn {
          background: none;
          border: none;
          color: var(--gray-500);
          cursor: pointer;
          padding: 2px;
          font-size: 12px;
          transition: color 0.3s ease;
        }

        .remove-btn:hover {
          color: var(--danger-color);
        }

        .quantity-controls {
          display: flex;
          align-items: center;
          gap: 5px;
          margin-bottom: 8px;
        }

        .quantity-btn {
          width: 24px;
          height: 24px;
          border: 1px solid #e9ecef;
          background: white;
          border-radius: var(--border-radius-sm);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 12px;
          color: var(--gray-600);
          transition: all 0.3s ease;
        }

        .quantity-btn:hover {
          border-color: var(--primary-color);
          color: var(--primary-color);
        }

        .quantity-input {
          width: 40px;
          height: 24px;
          border: 1px solid #e9ecef;
          border-radius: var(--border-radius-sm);
          text-align: center;
          font-size: 12px;
          font-weight: 600;
        }

        .quantity-input:focus {
          outline: none;
          border-color: var(--primary-color);
        }

        .item-price {
          margin-top: 5px;
        }

        .price {
          font-family: var(--font-family-heading);
          font-size: 14px;
          font-weight: 600;
          color: var(--primary-color);
        }

        .cart-summary {
          padding: 20px;
          border-top: 1px solid #e9ecef;
          background: #f8f9fa;
        }

        .subtotal-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 15px;
        }

        .subtotal-label {
          font-family: var(--font-family-heading);
          font-size: 16px;
          font-weight: 600;
          color: var(--secondary-color);
        }

        .subtotal-price {
          font-family: var(--font-family-heading);
          font-size: 16px;
          font-weight: 700;
          color: var(--primary-color);
        }

        .free-shipping-notice {
          margin-bottom: 20px;
        }

        .free-shipping-notice p {
          font-size: 12px;
          color: var(--gray-600);
          margin-bottom: 8px;
          line-height: 1.4;
        }

        .highlight {
          color: var(--primary-color);
          font-weight: 600;
        }

        .progress-bar {
          width: 100%;
          height: 6px;
          background: #e9ecef;
          border-radius: 3px;
          overflow: hidden;
        }

        .progress-fill {
          height: 100%;
          background: linear-gradient(45deg, var(--primary-color) 25%, transparent 25%), 
                      linear-gradient(-45deg, var(--primary-color) 25%, transparent 25%), 
                      linear-gradient(45deg, transparent 75%, var(--primary-color) 75%), 
                      linear-gradient(-45deg, transparent 75%, var(--primary-color) 75%);
          background-size: 8px 8px;
          background-position: 0 0, 0 4px, 4px -4px, -4px 0px;
          transition: width 0.3s ease;
        }

        .cart-actions {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .btn {
          padding: 12px 20px;
          border-radius: var(--border-radius-sm);
          font-family: var(--font-family-heading);
          font-size: 14px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          text-decoration: none;
          text-align: center;
          transition: all 0.3s ease;
          border: none;
          cursor: pointer;
        }

        .btn-secondary {
          background: #f8f9fa;
          color: var(--secondary-color);
          border: 1px solid #e9ecef;
        }

        .btn-secondary:hover {
          background: #e9ecef;
          color: var(--secondary-color);
        }

        .btn-primary {
          background: var(--primary-color);
          color: white;
        }

        .btn-primary:hover {
          background: var(--primary-hover);
          color: white;
        }

        .empty-cart {
          padding: 40px 20px;
          text-align: center;
          color: var(--gray-600);
        }

        .empty-cart p {
          margin-bottom: 20px;
          font-size: 16px;
        }

        /* Responsive Design */
        @media (max-width: 480px) {
          .cart-drawer {
            width: 100%;
          }
        }
      `}</style>
    </>
  );
};

export default CartDrawer;
