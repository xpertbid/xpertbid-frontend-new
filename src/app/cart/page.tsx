'use client';

import React from 'react';
import Layout from '@/components/Layout';
import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/contexts/CartContext';


export default function CartPage() {
  const { items: cartItems, updateQuantity, removeItem, subtotal, total, shipping, tax, isLoaded, clearCart } = useCart();

  if (!isLoaded) {
    return (
      <Layout>
        <div className="cart-page">
          <div className="container py-5">
            <div className="text-center">
              <div className="spinner-border" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <p className="mt-3">Loading cart...</p>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (cartItems.length === 0) {
    return (
      <Layout>
        <div className="cart-page">
          <div className="container py-5">
            <div className="row justify-content-center">
              <div className="col-lg-6 text-center">
                <div className="empty-cart">
                  <i className="fas fa-shopping-cart empty-icon"></i>
                  <h2>Your cart is empty</h2>
                  <p>Looks like you haven&apos;t added any items to your cart yet.</p>
                  <Link href="/shop" className="btn btn-primary">Start Shopping</Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="cart-page">
        <div className="container py-5">
          {/* Breadcrumb */}
          <nav aria-label="breadcrumb" className="mb-4">
            <ol className="breadcrumb">
              <li className="breadcrumb-item"><Link href="/">Home</Link></li>
              <li className="breadcrumb-item active" aria-current="page">Cart</li>
            </ol>
          </nav>

          <div className="cart-header d-flex justify-content-between align-items-center mb-4">
            <h1 className="page-title">Shopping Cart</h1>
            <span className="cart-count">{cartItems.length} item{cartItems.length !== 1 ? &apos;s&apos; : &apos;&apos;}</span>
          </div>
          
          <div className="row">
            <div className="col-lg-8">
              <div className="cart-items">
                {cartItems.map((item) => (
                  <div key={item.id} className="cart-item">
                    <div className="item-image">
                      <Link href={`/shop/${item.slug}`}>
                        <Image 
                          src={item.image} 
                          alt={item.name} 
                          width={120} 
                          height={120}
                          className="img-fluid rounded"
                        />
                      </Link>
                    </div>
                    <div className="item-details">
                      <h4 className="item-title">
                        <Link href={`/shop/${item.slug}`}>{item.name}</Link>
                      </h4>
                      {item.vendor && (
                        <p className="item-vendor">Sold by: {item.vendor}</p>
                      )}
                      {item.sku && (
                        <p className="item-sku">SKU: {item.sku}</p>
                      )}
                      <p className="item-price">${parseFloat(item.price.toString()).toFixed(2)}</p>
                    </div>
                    <div className="item-quantity">
                      <div className="quantity-controls">
                        <button 
                          className="btn btn-outline-secondary btn-sm"
                          onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                          disabled={item.quantity <= 1}
                        >
                          <i className="fas fa-minus"></i>
                        </button>
                        <input 
                          type="number" 
                          className="form-control text-center"
                          value={item.quantity}
                          onChange={(e) => {
                            const newQuantity = parseInt(e.target.value) || 1;
                            updateQuantity(item.id, Math.max(1, newQuantity));
                          }}
                          min="1"
                          style={{ width: '60px' }}
                        />
                        <button 
                          className="btn btn-outline-secondary btn-sm"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        >
                          <i className="fas fa-plus"></i>
                        </button>
                      </div>
                    </div>
                    <div className="item-total">
                      <span className="total-amount">${(parseFloat(item.price.toString()) * item.quantity).toFixed(2)}</span>
                    </div>
                    <button 
                      className="remove-btn btn btn-outline-danger btn-sm" 
                      onClick={() => removeItem(item.id)}
                      title="Remove item"
                    >
                      <i className="fas fa-trash"></i>
                    </button>
                  </div>
                ))}
                
                {/* Cart Actions */}
                <div className="cart-actions mt-4">
                  <div className="row">
                    <div className="col-md-6">
                      <Link href="/shop" className="btn btn-outline-primary">
                        <i className="fas fa-arrow-left me-2"></i>Continue Shopping
                      </Link>
                    </div>
                    <div className="col-md-6 text-md-end">
                      <button 
                        className="btn btn-outline-danger"
                        onClick={clearCart}
                      >
                        <i className="fas fa-trash me-2"></i>Clear Cart
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="col-lg-4">
              <div className="cart-summary">
                <h3 className="summary-title">Order Summary</h3>
                
                <div className="summary-details">
                  <div className="summary-row">
                    <span>Subtotal ({cartItems.length} item{cartItems.length !== 1 ? &apos;s&apos; : &apos;&apos;}):</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="summary-row">
                    <span>Shipping:</span>
                    <span>${shipping.toFixed(2)}</span>
                  </div>
                  <div className="summary-row">
                    <span>Tax:</span>
                    <span>${tax.toFixed(2)}</span>
                  </div>
                  <div className="summary-total">
                    <span>Total:</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </div>

                <div className="checkout-actions">
                  <Link href="/checkout" className="btn btn-primary btn-lg w-100 mb-3">
                    <i className="fas fa-credit-card me-2"></i>Proceed to Checkout
                  </Link>
                  <Link href="/shop" className="btn btn-outline-secondary w-100">
                    <i className="fas fa-shopping-bag me-2"></i>Continue Shopping
                  </Link>
                </div>

                {/* Security Badge */}
                <div className="security-badge mt-4">
                  <div className="security-info">
                    <i className="fas fa-shield-alt text-success me-2"></i>
                    <span>Secure checkout guaranteed</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .page-title {
          font-family: var(--font-family-heading);
          font-size: 2.5rem;
          font-weight: 700;
          color: var(--secondary-color);
          margin-bottom: 0;
        }

        .cart-count {
          background: var(--primary-color);
          color: white;
          padding: 8px 16px;
          border-radius: 20px;
          font-weight: 600;
          font-size: 14px;
        }

        .cart-item {
          display: flex;
          align-items: center;
          padding: 20px;
          background: white;
          border: 1px solid #e9ecef;
          border-radius: var(--border-radius-lg);
          margin-bottom: 20px;
          transition: all 0.3s ease;
        }

        .cart-item:hover {
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          transform: translateY(-2px);
        }

        .item-image {
          flex: 0 0 120px;
          margin-right: 20px;
        }

        .item-image img {
          border-radius: var(--border-radius-sm);
        }

        .item-details {
          flex: 1;
          margin-right: 20px;
        }

        .item-title {
          margin-bottom: 8px;
        }

        .item-title a {
          color: var(--secondary-color);
          text-decoration: none;
          font-weight: 600;
          font-size: 16px;
          transition: color 0.3s ease;
        }

        .item-title a:hover {
          color: var(--primary-color);
        }

        .item-vendor, .item-sku {
          font-size: 12px;
          color: var(--gray-600);
          margin-bottom: 4px;
        }

        .item-price {
          font-size: 16px;
          font-weight: 600;
          color: var(--primary-color);
          margin-bottom: 0;
        }

        .item-quantity {
          flex: 0 0 140px;
          margin-right: 20px;
        }

        .quantity-controls {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .quantity-controls .form-control {
          border-color: var(--gray-300);
          text-align: center;
        }

        .item-total {
          flex: 0 0 100px;
          margin-right: 20px;
        }

        .total-amount {
          font-size: 18px;
          font-weight: 700;
          color: var(--secondary-color);
        }

        .remove-btn {
          flex: 0 0 40px;
          height: 40px;
          width: 40px;
          padding: 0;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .cart-actions {
          padding: 20px;
          background: #f8f9fa;
          border-radius: var(--border-radius-lg);
        }

        .cart-summary {
          background: white;
          padding: 30px;
          border-radius: var(--border-radius-lg);
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
          position: sticky;
          top: 20px;
        }

        .summary-title {
          font-family: var(--font-family-heading);
          font-weight: 600;
          color: var(--secondary-color);
          margin-bottom: 20px;
          font-size: 20px;
        }

        .summary-details {
          margin-bottom: 25px;
        }

        .summary-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 8px 0;
          border-bottom: 1px solid #f1f3f4;
          font-size: 14px;
        }

        .summary-row:last-child {
          border-bottom: none;
        }

        .summary-total {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 15px 0;
          border-top: 2px solid var(--primary-color);
          margin-top: 15px;
          font-size: 18px;
          font-weight: 700;
          color: var(--secondary-color);
        }

        .checkout-actions .btn {
          font-weight: 600;
          padding: 12px 20px;
          border-radius: var(--border-radius-lg);
        }

        .security-badge {
          padding-top: 20px;
          border-top: 1px solid #e9ecef;
        }

        .security-info {
          display: flex;
          align-items: center;
          font-size: 12px;
          color: var(--gray-600);
        }

        .empty-cart {
          padding: 60px 20px;
        }

        .empty-icon {
          font-size: 4rem;
          color: var(--gray-400);
          margin-bottom: 20px;
        }

        .empty-cart h2 {
          font-family: var(--font-family-heading);
          color: var(--secondary-color);
          margin-bottom: 15px;
        }

        .empty-cart p {
          color: var(--gray-600);
          margin-bottom: 30px;
        }

        @media (max-width: 991.98px) {
          .cart-item {
            flex-direction: column;
            align-items: flex-start;
            gap: 15px;
          }

          .item-image {
            flex: none;
            margin-right: 0;
          }

          .item-details {
            flex: none;
            margin-right: 0;
            width: 100%;
          }

          .item-quantity {
            flex: none;
            margin-right: 0;
            width: 100%;
          }

          .item-total {
            flex: none;
            margin-right: 0;
            width: 100%;
            text-align: left;
          }

          .remove-btn {
            position: absolute;
            top: 15px;
            right: 15px;
          }

          .cart-summary {
            position: static;
            margin-top: 30px;
          }
        }
      `}</style>
    </Layout>
  );
}