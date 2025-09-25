'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/contexts/CartContext';

const CartPage: React.FC = () => {
  const { items, subtotal, shipping, tax, total, itemCount, removeFromCart, updateQuantity, clearCart, getItemTotal } = useCart();

  const handleQuantityChange = (itemId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(itemId);
    } else {
      updateQuantity(itemId, newQuantity);
    }
  };

  if (items.length === 0) {
    return (
      <div className="cart-page">
        <div className="container py-5">
          <div className="row justify-content-center">
            <div className="col-lg-8">
              {/* Breadcrumb */}
              <nav aria-label="breadcrumb" className="mb-4">
                <ol className="breadcrumb">
                  <li className="breadcrumb-item">
                    <Link href="/">Home</Link>
                  </li>
                  <li className="breadcrumb-item active" aria-current="page">
                    Shopping Cart
                  </li>
                </ol>
              </nav>

              {/* Empty Cart */}
              <div className="empty-cart text-center py-5">
                <div className="empty-cart-icon mb-4">
                  <i className="f-shopping-cart" style={{ fontSize: '80px', color: '#dee2e6' }}></i>
                </div>
                <h3 className="mb-3" style={{ fontFamily: 'Poppins, sans-serif', fontWeight: '600' }}>
                  Your cart is empty
                </h3>
                <p className="text-muted mb-4">
                  Looks like you haven&apos;t added any items to your cart yet.
                </p>
                <Link href="/shop" className="btn btn-primary btn-lg">
                  <i className="f-shopping-bag me-2"></i>
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="container py-4">
        {/* Breadcrumb */}
        <nav aria-label="breadcrumb" className="mb-4">
          <ol className="breadcrumb">
            <li className="breadcrumb-item">
              <Link href="/">Home</Link>
            </li>
            <li className="breadcrumb-item active" aria-current="page">
              Shopping Cart
            </li>
          </ol>
        </nav>

        <div className="row">
          {/* Cart Items */}
          <div className="col-lg-8">
            <div className="cart-header d-flex justify-content-between align-items-center mb-4">
              <h2 className="cart-title mb-0" style={{ 
                fontFamily: 'Poppins, sans-serif', 
                fontSize: '28px', 
                fontWeight: '600',
                color: '#000'
              }}>
                Shopping Cart ({itemCount} {itemCount === 1 ? 'item' : 'items'})
              </h2>
              <button 
                className="btn btn-outline-danger btn-sm"
                onClick={clearCart}
              >
                <i className="f-trash me-1"></i>
                Clear Cart
              </button>
            </div>

            <div className="cart-items">
              {items.map((item) => (
                <div key={item.id} className="cart-item border rounded p-4 mb-3">
                  <div className="row align-items-center">
                    {/* Product Image */}
                    <div className="col-md-2">
                      <Image
                        src={item.image}
                        alt={item.name}
                        width={100}
                        height={100}
                        className="img-fluid rounded"
                        style={{ objectFit: 'cover' }}
                      />
                    </div>

                    {/* Product Details */}
                    <div className="col-md-4">
                      <h5 className="product-name mb-2" style={{ 
                        fontFamily: 'Poppins, sans-serif', 
                        fontWeight: '500',
                        fontSize: '16px'
                      }}>
                        <Link href={`/products/${item.productId}`} className="text-decoration-none text-dark">
                          {item.name}
                        </Link>
                      </h5>
                      <div className="product-details">
                        <div className="text-muted small mb-1">SKU: {item.sku}</div>
                        <div className="text-muted small mb-1">Vendor: {item.vendor}</div>
                        {item.variations && (
                          <div className="variations">
                            {item.variations.size && (
                              <span className="badge bg-light text-dark me-1">
                                Size: {item.variations.size}
                              </span>
                            )}
                            {item.variations.color && (
                              <span className="badge bg-light text-dark">
                                Color: {item.variations.color}
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Price */}
                    <div className="col-md-2 text-center">
                      <div className="product-price">
                        {item.salePrice ? (
                          <div>
                            <div className="sale-price fw-bold text-primary">
                              ${item.salePrice.toFixed(2)}
                            </div>
                            <div className="original-price text-muted text-decoration-line-through small">
                              ${item.price.toFixed(2)}
                            </div>
                          </div>
                        ) : (
                          <div className="price fw-bold text-primary">
                            ${item.price.toFixed(2)}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Quantity */}
                    <div className="col-md-2">
                      <div className="quantity-controls d-flex align-items-center justify-content-center">
                        <button
                          className="btn btn-outline-secondary btn-sm"
                          onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                          style={{ width: '35px', height: '35px' }}
                        >
                          <i className="f-minus"></i>
                        </button>
                        <input
                          type="number"
                          className="form-control text-center mx-2"
                          style={{ width: '60px' }}
                          value={item.quantity}
                          onChange={(e) => handleQuantityChange(item.id, parseInt(e.target.value) || 1)}
                          min="1"
                        />
                        <button
                          className="btn btn-outline-secondary btn-sm"
                          onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                          style={{ width: '35px', height: '35px' }}
                        >
                          <i className="f-plus"></i>
                        </button>
                      </div>
                    </div>

                    {/* Total */}
                    <div className="col-md-2 text-center">
                      <div className="item-total fw-bold text-primary" style={{ fontSize: '18px' }}>
                        ${getItemTotal(item).toFixed(2)}
                      </div>
                    </div>
                  </div>

                  {/* Remove Button */}
                  <div className="row mt-3">
                    <div className="col-12 text-end">
                      <button
                        className="btn btn-outline-danger btn-sm"
                        onClick={() => removeFromCart(item.id)}
                      >
                        <i className="f-trash me-1"></i>
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Continue Shopping */}
            <div className="continue-shopping text-center mt-4">
              <Link href="/shop" className="btn btn-outline-primary">
                <i className="f-arrow-left me-2"></i>
                Continue Shopping
              </Link>
            </div>
          </div>

          {/* Cart Summary */}
          <div className="col-lg-4">
            <div className="cart-summary">
              <div className="summary-card border rounded p-4">
                <h5 className="summary-title mb-4" style={{ 
                  fontFamily: 'Poppins, sans-serif', 
                  fontWeight: '600',
                  textTransform: 'uppercase'
                }}>
                  Order Summary
                </h5>

                <div className="summary-details">
                  <div className="summary-row d-flex justify-content-between mb-2">
                    <span>Subtotal ({itemCount} items)</span>
                    <span className="fw-bold">${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="summary-row d-flex justify-content-between mb-2">
                    <span>Shipping</span>
                    <span className="fw-bold">
                      {shipping === 0 ? (
                        <span className="text-success">FREE</span>
                      ) : (
                        `$${shipping.toFixed(2)}`
                      )}
                    </span>
                  </div>
                  <div className="summary-row d-flex justify-content-between mb-2">
                    <span>Tax</span>
                    <span className="fw-bold">${tax.toFixed(2)}</span>
                  </div>
                  <hr />
                  <div className="summary-row d-flex justify-content-between mb-4">
                    <span className="h5 mb-0">Total</span>
                    <span className="h5 mb-0 text-primary fw-bold">${total.toFixed(2)}</span>
                  </div>
                </div>

                {/* Shipping Notice */}
                {shipping > 0 && (
                  <div className="shipping-notice alert alert-info mb-3">
                    <small>
                      <i className="f-info-circle me-1"></i>
                      Add ${(150 - subtotal).toFixed(2)} more to get FREE shipping!
                    </small>
                  </div>
                )}

                {/* Checkout Button */}
                <Link href="/checkout" className="btn btn-primary w-100 btn-lg mb-3" style={{
                  padding: '15px',
                  fontSize: '16px',
                  fontWeight: '600',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}>
                  <i className="f-lock me-2"></i>
                  Proceed to Checkout
                </Link>

                {/* Security Notice */}
                <div className="security-notice text-center">
                  <small className="text-muted">
                    <i className="f-shield-alt me-1"></i>
                    Secure checkout with SSL encryption
                  </small>
                </div>
              </div>

              {/* Promo Code */}
              <div className="promo-code mt-4">
                <div className="card">
                  <div className="card-body">
                    <h6 className="card-title">Promo Code</h6>
                    <div className="input-group">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Enter promo code"
                      />
                      <button className="btn btn-outline-primary" type="button">
                        Apply
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Trust Badges */}
              <div className="trust-badges mt-4 text-center">
                <h6 className="mb-3">We Accept</h6>
                <div className="payment-methods">
                  <i className="fab fa-cc-visa text-primary me-2" style={{ fontSize: '24px' }}></i>
                  <i className="fab fa-cc-mastercard text-primary me-2" style={{ fontSize: '24px' }}></i>
                  <i className="fab fa-cc-amex text-primary me-2" style={{ fontSize: '24px' }}></i>
                  <i className="fab fa-cc-paypal text-primary me-2" style={{ fontSize: '24px' }}></i>
                  <i className="fab fa-apple-pay text-primary" style={{ fontSize: '24px' }}></i>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;

