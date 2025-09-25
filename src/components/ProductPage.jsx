'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useCart } from '@/contexts/CartContext';

const ProductPage = ({ product }) => {
  const { addToCart } = useCart();
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');

  const handleAddToCart = () => {
    const cartItem = {
      id: product.id,
      productId: product.id,
      name: product.name,
      price: product.sale_price || product.price,
      image: product.images?.[0] || '/images/placeholder.svg',
      slug: product.slug,
      variations: {
        size: selectedSize,
        color: selectedColor
      },
      vendor: product.business_name || 'Unknown',
      sku: product.sku || ''
    };

    addToCart(cartItem);
  };

  const images = product?.images || ['/images/placeholder.svg'];
  const currentPrice = product?.sale_price || product?.price || 0;
  const originalPrice = product?.sale_price ? product?.price : null;

  return (
    <div className="product-page">
      <div className="container py-4">
        <div className="row">
          {/* Product Images */}
          <div className="col-lg-6">
            <div className="product-images">
              <div className="main-image">
                <img 
                  src={images[selectedImage]} 
                  alt={product?.name || 'Product'}
                  className="img-fluid"
                />
                {product?.is_featured && (
                  <div className="featured-badge">Featured</div>
                )}
              </div>
              <div className="thumbnail-images">
                {images.map((image, index) => (
                  <img
                    key={index}
                    src={image}
                    alt={`${product?.name || 'Product'} ${index + 1}`}
                    className={`thumbnail ${selectedImage === index ? 'active' : ''}`}
                    onClick={() => setSelectedImage(index)}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Product Details */}
          <div className="col-lg-6">
            <div className="product-details">
              <h1 className="product-title">{product?.name || 'Product'}</h1>
              
              <div className="product-meta">
                <div className="vendor">
                  <span className="label">Sold by:</span>
                  <span className="value">{product?.business_name || 'Unknown Vendor'}</span>
                </div>
                <div className="sku">
                  <span className="label">SKU:</span>
                  <span className="value">{product?.sku || 'N/A'}</span>
                </div>
              </div>

              <div className="product-price">
                <span className="current-price">${currentPrice}</span>
                {originalPrice && (
                  <span className="original-price">${originalPrice}</span>
                )}
              </div>

              <div className="product-description">
                <p>{product?.description || 'No description available'}</p>
              </div>

              {/* Variations */}
              <div className="product-variations">
                {/* Size Selection */}
                <div className="variation-group">
                  <label>Size:</label>
                  <div className="size-options">
                    {['S', 'M', 'L', 'XL'].map((size) => (
                      <button
                        key={size}
                        className={`size-option ${selectedSize === size ? 'selected' : ''}`}
                        onClick={() => setSelectedSize(size)}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Color Selection */}
                <div className="variation-group">
                  <label>Color:</label>
                  <div className="color-options">
                    {['Red', 'Blue', 'Green', 'Black'].map((color) => (
                      <button
                        key={color}
                        className={`color-option ${selectedColor === color ? 'selected' : ''}`}
                        onClick={() => setSelectedColor(color)}
                        style={{ backgroundColor: color.toLowerCase() }}
                      >
                        {color}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Quantity */}
              <div className="quantity-selector">
                <label htmlFor="quantity">Quantity:</label>
                <div className="quantity-controls">
                  <button 
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                  >
                    -
                  </button>
                  <input
                    type="number"
                    id="quantity"
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                    min="1"
                  />
                  <button onClick={() => setQuantity(quantity + 1)}>+</button>
                </div>
              </div>

              {/* Add to Cart */}
              <div className="add-to-cart">
                <button 
                  className="btn btn-primary btn-lg w-100"
                  onClick={handleAddToCart}
                  disabled={product?.stock_status !== 'in_stock'}
                >
                  {product?.stock_status === 'in_stock' ? 'Add to Cart' : 'Out of Stock'}
                </button>
              </div>

              {/* Product Info */}
              <div className="product-info">
                <div className="info-item">
                  <span className="label">Stock Status:</span>
                  <span className={`status ${product?.stock_status}`}>
                    {product?.stock_status === 'in_stock' ? 'In Stock' : 'Out of Stock'}
                  </span>
                </div>
                <div className="info-item">
                  <span className="label">Stock Quantity:</span>
                  <span className="value">{product?.stock_quantity || 0}</span>
                </div>
                <div className="info-item">
                  <span className="label">Category:</span>
                  <span className="value">{product?.category_name || 'Uncategorized'}</span>
                </div>
                {product?.brand_name && (
                  <div className="info-item">
                    <span className="label">Brand:</span>
                    <span className="value">{product.brand_name}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .product-page {
          min-height: 100vh;
        }

        .product-images {
          margin-bottom: 30px;
        }

        .main-image {
          position: relative;
          margin-bottom: 15px;
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        }

        .main-image img {
          width: 100%;
          height: 400px;
          object-fit: cover;
        }

        .featured-badge {
          position: absolute;
          top: 15px;
          left: 15px;
          background: #28a745;
          color: white;
          padding: 5px 10px;
          border-radius: 4px;
          font-size: 0.8rem;
          font-weight: 600;
        }

        .thumbnail-images {
          display: flex;
          gap: 10px;
          overflow-x: auto;
        }

        .thumbnail {
          width: 80px;
          height: 80px;
          object-fit: cover;
          border-radius: 4px;
          cursor: pointer;
          border: 2px solid transparent;
          transition: border-color 0.2s;
        }

        .thumbnail.active {
          border-color: #007bff;
        }

        .product-title {
          font-size: 2rem;
          font-weight: 700;
          margin-bottom: 15px;
          color: #333;
        }

        .product-meta {
          margin-bottom: 20px;
        }

        .product-meta > div {
          margin-bottom: 8px;
        }

        .label {
          font-weight: 600;
          color: #666;
          margin-right: 8px;
        }

        .value {
          color: #333;
        }

        .product-price {
          margin-bottom: 20px;
        }

        .current-price {
          font-size: 1.8rem;
          font-weight: 700;
          color: #28a745;
          margin-right: 10px;
        }

        .original-price {
          font-size: 1.2rem;
          color: #999;
          text-decoration: line-through;
        }

        .product-description {
          margin-bottom: 30px;
          color: #666;
          line-height: 1.6;
        }

        .variation-group {
          margin-bottom: 20px;
        }

        .variation-group label {
          display: block;
          margin-bottom: 10px;
          font-weight: 600;
          color: #333;
        }

        .size-options, .color-options {
          display: flex;
          gap: 10px;
        }

        .size-option, .color-option {
          padding: 8px 16px;
          border: 2px solid #ddd;
          background: white;
          border-radius: 4px;
          cursor: pointer;
          transition: all 0.2s;
        }

        .size-option:hover, .color-option:hover {
          border-color: #007bff;
        }

        .size-option.selected, .color-option.selected {
          border-color: #007bff;
          background: #007bff;
          color: white;
        }

        .color-option {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          padding: 0;
          position: relative;
        }

        .color-option::after {
          content: attr(style);
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          color: white;
          font-size: 0.7rem;
          font-weight: bold;
          text-shadow: 1px 1px 2px rgba(0,0,0,0.5);
        }

        .quantity-selector {
          margin-bottom: 30px;
        }

        .quantity-selector label {
          display: block;
          margin-bottom: 10px;
          font-weight: 600;
          color: #333;
        }

        .quantity-controls {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .quantity-controls button {
          width: 40px;
          height: 40px;
          border: 1px solid #ddd;
          background: white;
          border-radius: 4px;
          cursor: pointer;
          font-size: 1.2rem;
          font-weight: bold;
        }

        .quantity-controls button:hover {
          background: #f8f9fa;
        }

        .quantity-controls button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .quantity-controls input {
          width: 80px;
          height: 40px;
          text-align: center;
          border: 1px solid #ddd;
          border-radius: 4px;
        }

        .add-to-cart {
          margin-bottom: 30px;
        }

        .product-info {
          background: #f8f9fa;
          padding: 20px;
          border-radius: 8px;
        }

        .info-item {
          display: flex;
          justify-content: space-between;
          margin-bottom: 10px;
        }

        .info-item:last-child {
          margin-bottom: 0;
        }

        .status.in_stock {
          color: #28a745;
          font-weight: 600;
        }

        .status.out_of_stock {
          color: #dc3545;
          font-weight: 600;
        }

        @media (max-width: 768px) {
          .product-title {
            font-size: 1.5rem;
          }

          .current-price {
            font-size: 1.5rem;
          }

          .size-options, .color-options {
            flex-wrap: wrap;
          }
        }
      `}</style>
    </div>
  );
};

export default ProductPage;