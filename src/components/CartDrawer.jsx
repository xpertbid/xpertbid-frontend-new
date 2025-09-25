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
          transition: right 0.3s ease;
          box-shadow: -2px 0 10px rgba(0,0,0,0.1);
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
          background: rgba(0,0,0,0.5);
          z-index: -1;
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .cart-drawer.open .cart-drawer-overlay {
          opacity: 1;
        }

        .cart-drawer-content {
          display: flex;
          flex-direction: column;
          height: 100%;
        }

        .cart-drawer-header {
          padding: 20px;
          border-bottom: 1px solid #eee;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .cart-drawer-body {
          flex: 1;
          overflow-y: auto;
          padding: 20px;
        }

        .cart-item {
          display: flex;
          align-items: center;
          padding: 15px 0;
          border-bottom: 1px solid #f0f0f0;
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
          margin: 0 0 5px 0;
          font-size: 14px;
        }

        .item-price {
          margin: 0 0 10px 0;
          font-weight: bold;
          color: #333;
        }

        .quantity-controls {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .quantity-controls button {
          width: 25px;
          height: 25px;
          border: 1px solid #ddd;
          background: white;
          border-radius: 3px;
          cursor: pointer;
        }

        .remove-item {
          background: none;
          border: none;
          color: #999;
          cursor: pointer;
          padding: 5px;
        }

        .cart-drawer-footer {
          padding: 20px;
          border-top: 1px solid #eee;
        }

        .cart-total {
          margin-bottom: 15px;
          text-align: center;
          font-size: 18px;
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