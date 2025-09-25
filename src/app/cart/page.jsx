'use client';

import React from 'react';
import Layout from '@/components/Layout';
import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/contexts/CartContext';
import PriceDisplay from '@/components/PriceDisplay';


export default function CartPage() {
  const { items, updateQuantity, removeItem, subtotal, total, shipping, tax, isLoaded, clearCart } = useCart();

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
                  <i className="f-shopping-cart empty-icon"></i>
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
            <span className="cart-count">{cartItems.length} item{cartItems.length !== 1 ? 's' : ''}</span>
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
                      <p className="item-price">
                        <PriceDisplay amount={parseFloat(item.price?.toString() || '0')} fromCurrency="USD" />
                      </p>
                    </div>
                    <div className="item-quantity">
                      <div className="quantity-controls">
                        <button 
                          className="btn btn-outline-secondary btn-sm"
                          onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                          disabled={item.quantity <= 1}
                        >
                          <i className="f-minus"></i>
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
                          <i className="f-plus"></i>
                        </button>
                      </div>
                    </div>
                    <div className="item-total">
                      <span className="total-amount">
                        <PriceDisplay amount={parseFloat(item.price?.toString() || '0') * item.quantity} fromCurrency="USD" />
                      </span>
                    </div>
                    <button 
                      className="remove-btn btn btn-outline-danger btn-sm" 
                      onClick={() => removeItem(item.id)}
                      title="Remove item"
                    >
                      <i className="f-trash"></i>
                    </button>
                  </div>
                ))}
                
                {/* Cart Actions */}
                <div className="cart-actions mt-4">
                  <div className="row">
                    <div className="col-md-6">
                      <Link href="/shop" className="btn btn-outline-primary">
                        <i className="f-arrow-left me-2"></i>Continue Shopping
                      </Link>
                    </div>
                    <div className="col-md-6 text-md-end">
                      <button 
                        className="btn btn-outline-danger"
                        onClick={clearCart}
                      >
                        <i className="f-trash me-2"></i>Clear Cart
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
                    <span>Subtotal ({cartItems.length} item{cartItems.length !== 1 ? 's' : ''}):</span>
                    <span>
                      <PriceDisplay amount={parseFloat(subtotal?.toString() || '0')} fromCurrency="USD" />
                    </span>
                  </div>
                  <div className="summary-row">
                    <span>Shipping:</span>
                    <span>
                      <PriceDisplay amount={parseFloat(shipping?.toString() || '0')} fromCurrency="USD" />
                    </span>
                  </div>
                  <div className="summary-row">
                    <span>Tax:</span>
                    <span>
                      <PriceDisplay amount={parseFloat(tax?.toString() || '0')} fromCurrency="USD" />
                    </span>
                  </div>
                  <div className="summary-total">
                    <span>Total:</span>
                    <span>
                      <PriceDisplay amount={parseFloat(total?.toString() || '0')} fromCurrency="USD" />
                    </span>
                  </div>
                </div>

                <div className="checkout-actions">
                  <Link href="/checkout" className="btn btn-primary btn-lg w-100 mb-3">
                    <i className="f-credit-card me-2"></i>Proceed to Checkout
                  </Link>
                  <Link href="/shop" className="btn btn-outline-secondary w-100">
                    <i className="f-shopping-bag me-2"></i>Continue Shopping
                  </Link>
                </div>

                {/* Security Badge */}
                <div className="security-badge mt-4">
                  <div className="security-info">
                    <i className="f-shield-alt text-success me-2"></i>
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
          font-weight;
          color: var(--secondary-color);
          margin-bottom;
        }

        .cart-count {
          background: var(--primary-color);
          color;
          padding;
          border-radius;
          font-weight;
          font-size;
        }

        .cart-item {
          display;
          align-items;
          padding;
          background;
          border: 1px solid #e9ecef;
          border-radius: var(--border-radius-lg);
          margin-bottom;
          transition: all 0.3s ease;
        }

        .cart-item:hover {
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          transform: translateY(-2px);
        }

        .item-image {
          flex;
          margin-right;
        }

        .item-image img {
          border-radius: var(--border-radius-sm);
        }

        .item-details {
          flex;
          margin-right;
        }

        .item-title {
          margin-bottom;
        }

        .item-title a {
          color: var(--secondary-color);
          text-decoration;
          font-weight;
          font-size;
          transition: color 0.3s ease;
        }

        .item-title a:hover {
          color: var(--primary-color);
        }

        .item-vendor, .item-sku {
          font-size;
          color: var(--gray-600);
          margin-bottom;
        }

        .item-price {
          font-size;
          font-weight;
          color: var(--primary-color);
          margin-bottom;
        }

        .item-quantity {
          flex;
          margin-right;
        }

        .quantity-controls {
          display;
          align-items;
          gap;
        }

        .quantity-controls .form-control {
          border-color: var(--gray-300);
          text-align;
        }

        .item-total {
          flex;
          margin-right;
        }

        .total-amount {
          font-size;
          font-weight;
          color: var(--secondary-color);
        }

        .remove-btn {
          flex;
          height;
          width;
          padding;
          display;
          align-items;
          justify-content;
        }

        .cart-actions {
          padding;
          background: #f8f9fa;
          border-radius: var(--border-radius-lg);
        }

        .cart-summary {
          background;
          padding;
          border-radius: var(--border-radius-lg);
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
          position;
          top;
        }

        .summary-title {
          font-family: var(--font-family-heading);
          font-weight;
          color: var(--secondary-color);
          margin-bottom;
          font-size;
        }

        .summary-details {
          margin-bottom;
        }

        .summary-row {
          display;
          justify-content: space-between;
          align-items;
          padding;
          border-bottom: 1px solid #f1f3f4;
          font-size;
        }

        .summary-row:last-child {
          border-bottom;
        }

        .summary-total {
          display;
          justify-content: space-between;
          align-items;
          padding;
          border-top: 2px solid var(--primary-color);
          margin-top;
          font-size;
          font-weight;
          color: var(--secondary-color);
        }

        .checkout-actions .btn {
          font-weight;
          padding;
          border-radius: var(--border-radius-lg);
        }

        .security-badge {
          padding-top;
          border-top: 1px solid #e9ecef;
        }

        .security-info {
          display;
          align-items;
          font-size;
          color: var(--gray-600);
        }

        .empty-cart {
          padding;
        }

        .empty-icon {
          font-size;
          color: var(--gray-400);
          margin-bottom;
        }

        .empty-cart h2 {
          font-family: var(--font-family-heading);
          color: var(--secondary-color);
          margin-bottom;
        }

        .empty-cart p {
          color: var(--gray-600);
          margin-bottom;
        }

        @media (max-width: 991.98px) {
          .cart-item {
            flex-direction;
            align-items: flex-start;
            gap;
          }

          .item-image {
            flex;
            margin-right;
          }

          .item-details {
            flex;
            margin-right;
            width: 100%;
          }

          .item-quantity {
            flex;
            margin-right;
            width: 100%;
          }

          .item-total {
            flex;
            margin-right;
            width: 100%;
            text-align;
          }

          .remove-btn {
            position;
            top;
            right;
          }

          .cart-summary {
            position;
            margin-top;
          }
        }
      `}</style>
    </Layout>
  );
}
