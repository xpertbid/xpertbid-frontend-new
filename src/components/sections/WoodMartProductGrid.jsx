'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { apiService } from '@/services/api';
import PriceDisplay from '@/components/PriceDisplay';
import TranslatedText from '@/components/TranslatedText';





const WoodMartProductGrid = ({
  title = "Featured Products",
  subtitle = "Discover our curated selection",
  products,
  columns = 4,
  showViewAll = true,
  viewAllLink = "/shop"
}) => {
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();
  const [wishlistItems, setWishlistItems] = useState(new Set());
  const [loading, setLoading] = useState(false);
  const [imageErrors, setImageErrors] = useState(new Set());
  const gridClass = `col-lg-${12 / columns} col-md-6 col-sm-6 col-12`;

  const handleImageError = (productId) => {
    setImageErrors(prev => new Set(prev).add(productId));
  };

  const getProductImage = (product) => {
    if (imageErrors.has(product.id) || !product.image) {
      return 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=300&h=300&fit=crop&crop=center';
    }
    return product.image;
  };

  const loadWishlistStatus = async () => {
    try {
      setLoading(true);
      const promises = products.map(product => 
        apiService.checkWishlistStatus(product.id.toString())
      );
      const responses = await Promise.all(promises);
      
      const wishlistSet = new Set();
      responses.forEach((response, index) => {
        if (response.success && response.data.in_wishlist) {
          wishlistSet.add(products[index].id);
        }
      });
      
      setWishlistItems(wishlistSet);
    } catch (error) {
      console.error('Error loading wishlist status:', error);
    } finally {
      setLoading(false);
    }
  };

  // Load wishlist status for all products
  useEffect(() => {
    if (isAuthenticated && products.length > 0) {
      loadWishlistStatus();
    }
  }, [isAuthenticated, products, loadWishlistStatus]);

  const handleAddToCart = (product) => {
    addToCart({
      productId: product.id.toString(),
      name: product.name,
      price: product.price,
      quantity,
      image: product.image,
      vendor: 'XpertBid',
      sku: `WM-${product.id}`,
      slug: product.slug || '',
    });
  };

  const handleWishlistToggle = async (product) => {
    if (!isAuthenticated) {
      // Redirect to login or show login modal
      window.location.href = '/login';
      return;
    }

    try {
      const isInWishlist = wishlistItems.has(product.id);
      
      if (isInWishlist) {
        // Remove from wishlist
        const response = await apiService.removeFromWishlist(product.id.toString());
        if (response.success) {
          setWishlistItems(prev => {
            const newSet = new Set(prev);
            newSet.delete(product.id);
            return newSet;
          });
        }
      } else {
        // Add to wishlist
        const response = await apiService.addToWishlist(product.id.toString());
        if (response.success) {
          setWishlistItems(prev => new Set(prev).add(product.id));
        }
      }
    } catch (error) {
      console.error('Error toggling wishlist:', error);
    }
  };

  return (
    <section className="woodmart-product-grid py-5">
      <div className="container">
        {/* Section Header */}
        <div className="section-header text-center mb-5">
          <span className="section-subtitle">{subtitle}</span>
          <h2 className="section-title">{title}</h2>
        </div>

        {/* Product Grid */}
        <div className="row g-4">
          {products.map((product) => (
            <div key={product.id} className={gridClass}>
              <div className="product-card">
                <div className="product-image-wrapper">
                  <Link href={`/shop/${product.slug}`}>
                    <div className="product-image">
                      <Image
                        src={getProductImage(product)}
                        alt={product.name}
                        width={300}
                        height={300}
                        className="img-fluid"
                        onError={() => handleImageError(product.id)}
                      />
                    </div>
                  </Link>
                  
                  {/* Product Badges */}
                  <div className="product-badges">
                    {product.isNew && (
                      <span className="badge badge-new">New</span>
                    )}
                    {product.isSale && (
                      <span className="badge badge-sale">Sale</span>
                    )}
                    {product.isFeatured && (
                      <span className="badge badge-featured">Featured</span>
                    )}
                    {product.badge && (
                      <span className={`badge badge-custom ${product.badgeColor || ''}`}>
                        {product.badge}
                      </span>
                    )}
                  </div>

                  {/* Quick Actions */}
                  <div className="product-actions">
                    <button className="action-btn wishlist-btn" title="Add to Wishlist">
                      <i className="far fa-heart"></i>
                    </button>
                    <button className="action-btn quick-view-btn" title="Quick View">
                      <i className="fas fa-eye"></i>
                    </button>
                    <button className="action-btn compare-btn" title="Compare">
                      <i className="fas fa-balance-scale"></i>
                    </button>
                  </div>

                  {/* Add to Cart Button */}
                  <div className="product-add-to-cart">
                    <button 
                      className="btn-add-to-cart"
                      onClick={() => handleAddToCart(product)}
                    >
                      <i className="fas fa-shopping-cart me-2"></i>
                      Add to Cart
                    </button>
                  </div>
                </div>

                <div className="product-info">
                  {/* Product Title */}
                  <h3 className="product-title">
                    <Link href={`/shop/${product.slug}`}>{product.name}</Link>
                  </h3>

                  {/* Product Specifications */}
                  <div className="product-specs">
                    <div className="spec-row">
                      <span className="spec-item">
                        <i className="fas fa-tag"></i>
                        <span className="spec-label">SKU</span>
                        <span className="spec-value">{product.sku || 'N/A'}</span>
                      </span>
                      <span className="spec-item">
                        <i className="fas fa-box"></i>
                        <span className="spec-label">Stock</span>
                        <span className="spec-value">{product.stock || 'In Stock'}</span>
                      </span>
                    </div>
                    <div className="spec-row">
                      <span className="spec-item">
                        <i className="fas fa-weight"></i>
                        <span className="spec-label">Weight</span>
                        <span className="spec-value">{product.weight || 'N/A'}</span>
                      </span>
                      <span className="spec-item">
                        <i className="fas fa-ruler"></i>
                        <span className="spec-label">Dimensions</span>
                        <span className="spec-value">{product.dimensions || 'N/A'}</span>
                      </span>
                    </div>
                  </div>

                  {/* Product Status Badges */}
                  <div className="product-status-badges">
                    {product.isNew && <span className="badge badge-new">
                      <i className="fas fa-star"></i>
                      New
                    </span>}
                    {product.isSale && <span className="badge badge-sale">
                      <i className="fas fa-percentage"></i>
                      Sale
                    </span>}
                    {product.isFeatured && <span className="badge badge-featured">
                      <i className="fas fa-crown"></i>
                      Featured
                    </span>}
                    {product.badge && <span className="badge badge-custom">
                      <i className="fas fa-tag"></i>
                      {product.badge}
                    </span>}
                  </div>

                  {/* Product Price */}
                  <div className="product-price">
                    <div className="price-main">
                      <span className="current-price">${product.price?.toLocaleString() || '0'}</span>
                      {product.comparePrice && (
                        <span className="compare-price">${product.comparePrice.toLocaleString()}</span>
                      )}
                    </div>
                    {product.rating && (
                      <div className="product-rating">
                        <div className="stars">
                          {[...Array(5)].map((_, index) => (
                            <i 
                              key={index} 
                              className={`fas fa-star ${index < (product.rating || 0) ? 'filled' : ''}`}
                            ></i>
                          ))}
                        </div>
                        <span className="rating-text">({product.reviewsCount || 0} reviews)</span>
                      </div>
                    )}
                  </div>

                  {/* Product Actions */}
                  <div className="product-actions-bottom">
                    <button 
                      className="btn btn-primary"
                      onClick={() => handleAddToCart(product)}
                    >
                      <i className="fas fa-shopping-cart"></i>
                      Add to Cart
                    </button>
                    <button className="btn btn-outline-secondary">
                      <i className="fas fa-heart"></i>
                      Wishlist
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* View All Button */}
        {showViewAll && (
          <div className="text-center mt-5">
            <Link href={viewAllLink} className="btn-view-all">
              View All Products
              <i className="fas fa-arrow-right ms-2"></i>
            </Link>
          </div>
        )}
      </div>

      <style jsx>{`
        .woodmart-product-grid {
          background: var(--light-color);
        }

        .section-header {
          margin-bottom: 60px;
        }

        .section-subtitle {
          display: inline-block;
          font-family: var(--font-family-heading);
          font-size: 14px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 2px;
          color: var(--primary-color);
          margin-bottom: 15px;
        }

        .section-title {
          font-family: var(--font-family-heading);
          font-size: 36px;
          font-weight: 700;
          color: var(--secondary-color);
          margin-bottom: 0;
        }

        .product-card {
          background: white;
          border-radius: var(--border-radius-lg);
          overflow: hidden;
          transition: all 0.3s ease;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
          height: 100%;
        }

        .product-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
        }

        .product-image-wrapper {
          position: relative;
          overflow: hidden;
        }

        .product-image {
          position: relative;
          overflow: hidden;
          height: 250px;
        }

        .product-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.3s ease;
        }

        .product-card:hover .product-image img {
          transform: scale(1.05);
        }

        .product-badges {
          position: absolute;
          top: 15px;
          left: 15px;
          z-index: 3;
        }

        .badge {
          display: inline-block;
          padding: 4px 8px;
          font-size: 11px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          border-radius: var(--border-radius-sm);
          margin-right: 5px;
          margin-bottom: 5px;
        }

        .badge-new {
          background: var(--success-color);
          color: white;
        }

        .badge-sale {
          background: var(--danger-color);
          color: white;
        }

        .badge-featured {
          background: var(--primary-color);
          color: white;
        }

        .product-actions {
          position: absolute;
          top: 15px;
          right: 15px;
          display: flex;
          flex-direction: column;
          gap: 8px;
          opacity: 0;
          transform: translateX(10px);
          transition: all 0.3s ease;
          z-index: 3;
        }

        .product-card:hover .product-actions {
          opacity: 1;
          transform: translateX(0);
        }

        .action-btn {
          width: 40px;
          height: 40px;
          background: white;
          border: none;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }

        .action-btn:hover {
          background: var(--primary-color);
          color: white;
          transform: scale(1.1);
        }

        .product-add-to-cart {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          background: white;
          padding: 15px;
          transform: translateY(100%);
          transition: transform 0.3s ease;
          z-index: 3;
        }

        .product-card:hover .product-add-to-cart {
          transform: translateY(0);
        }

        .btn-add-to-cart {
          width: 100%;
          background: var(--secondary-color);
          color: white;
          border: none;
          padding: 12px;
          border-radius: var(--border-radius);
          font-family: var(--font-family-heading);
          font-size: 14px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .btn-add-to-cart:hover {
          background: var(--primary-color);
          transform: translateY(-1px);
        }

        .product-info {
          padding: 20px;
        }

        .product-specs {
          margin-bottom: 16px;
        }

        .spec-row {
          display: flex;
          justify-content: space-between;
          margin-bottom: 8px;
        }

        .spec-item {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 12px;
          color: var(--gray-600);
          flex: 1;
        }

        .spec-item i {
          color: var(--primary-color);
          width: 14px;
          text-align: center;
        }

        .spec-label {
          font-weight: 500;
          color: var(--gray-700);
        }

        .spec-value {
          font-weight: 600;
          color: var(--secondary-color);
        }

        .product-status-badges {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
          margin-bottom: 12px;
        }

        .product-status-badges .badge {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          padding: 4px 8px;
          border-radius: var(--border-radius-sm);
          font-size: 10px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin: 0;
        }

        .badge-sale {
          background: var(--danger-color);
          color: white;
        }

        .badge-featured {
          background: var(--warning-color);
          color: white;
        }

        .badge-custom {
          background: var(--primary-color);
          color: white;
        }

        .product-rating {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .stars {
          display: flex;
          gap: 2px;
        }

        .stars i {
          color: #ddd;
          font-size: 12px;
        }

        .stars i.active {
          color: #ffc107;
        }

        .reviews-count {
          font-size: 12px;
          color: var(--gray-600);
        }

        .product-title {
          margin-bottom: 10px;
        }

        .product-title a {
          font-family: var(--font-family-heading);
          font-size: 16px;
          font-weight: 600;
          color: var(--secondary-color);
          text-decoration: none;
          transition: color 0.3s ease;
        }

        .product-title a:hover {
          color: var(--primary-color);
        }

        .product-price {
          margin-bottom: 16px;
        }

        .price-main {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 8px;
        }

        .current-price {
          font-family: var(--font-family-heading);
          font-size: 20px;
          font-weight: 700;
          color: var(--primary-color);
        }

        .compare-price {
          font-family: var(--font-family-heading);
          font-size: 14px;
          font-weight: 500;
          color: var(--gray-500);
          text-decoration: line-through;
        }

        .product-rating {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .stars i.filled {
          color: var(--warning-color);
        }

        .rating-text {
          font-size: 11px;
          color: var(--gray-500);
        }

        .product-actions-bottom {
          display: flex;
          gap: 8px;
          margin-top: auto;
        }

        .btn {
          padding: 10px 16px;
          font-family: var(--font-family-heading);
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          border-radius: var(--border-radius);
          transition: all 0.3s ease;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          border: 2px solid transparent;
          cursor: pointer;
          font-size: 12px;
        }

        .btn-primary {
          background: var(--primary-color);
          border-color: var(--primary-color);
          color: white;
          flex: 1;
        }

        .btn-primary:hover {
          background: var(--primary-hover);
          border-color: var(--primary-hover);
          color: white;
          transform: translateY(-1px);
        }

        .btn-outline-secondary {
          background: white;
          border: 2px solid var(--gray-300);
          color: var(--gray-600);
          padding: 10px 12px;
        }

        .btn-outline-secondary:hover {
          background: var(--danger-color);
          border-color: var(--danger-color);
          color: white;
          transform: translateY(-1px);
        }

        .btn-view-all {
          display: inline-flex;
          align-items: center;
          font-family: var(--font-family-heading);
          font-size: 14px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 1px;
          color: var(--secondary-color);
          background: white;
          padding: 15px 30px;
          border: 2px solid var(--gray-300);
          border-radius: var(--border-radius);
          text-decoration: none;
          transition: all 0.3s ease;
        }

        .btn-view-all:hover {
          background: var(--primary-color);
          color: white;
          border-color: var(--primary-color);
          transform: translateY(-2px);
        }

        /* Responsive Design */
        @media (max-width: 768px) {
          .section-title {
            font-size: 28px;
          }

          .product-actions {
            opacity: 1;
            transform: translateX(0);
            flex-direction: row;
            bottom: 15px;
            top: auto;
          }

          .product-add-to-cart {
            position: static;
            transform: none;
            margin-top: 15px;
          }

          .product-card:hover .product-add-to-cart {
            transform: none;
          }

          .spec-row {
            flex-direction: column;
            gap: 6px;
          }

          .product-actions-bottom {
            flex-direction: column;
          }

          .btn {
            justify-content: center;
          }
        }

        @media (max-width: 576px) {
          .section-title {
            font-size: 24px;
          }

          .product-status-badges {
            justify-content: center;
          }

          .price-main {
            justify-content: center;
          }

          .product-rating {
            justify-content: center;
          }
        }
      `}</style>
    </section>
  );
};

export default WoodMartProductGrid;

