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
  const gridClass = `col-lg-${12 / columns} col-md-6 col-sm-6 col-12`;

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
      vendor: 'WoodMart',
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
          <span className="section-subtitle">
            <TranslatedText text={subtitle} />
          </span>
          <h2 className="section-title">
            <TranslatedText text={title} />
          </h2>
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
                        src={product.image || '/images/placeholder.svg'}
                        alt={product.name}
                        width={300}
                        height={300}
                        className="img-fluid"
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
                    <button 
                      className={`action-btn wishlist-btn ${wishlistItems.has(product.id) ? 'active' : ''}`}
                      title={wishlistItems.has(product.id) ? "Remove from Wishlist" : "Add to Wishlist"}
                      onClick={() => handleWishlistToggle(product)}
                      disabled={loading}
                    >
                      <i className={`${wishlistItems.has(product.id) ? 'fas' : 'far'} fa-heart`}></i>
                    </button>
                    <button className="action-btn quick-view-btn" title="Quick View">
                      <i className="f-eye"></i>
                    </button>
                    <button className="action-btn compare-btn" title="Compare">
                      <i className="f-balance-scale"></i>
                    </button>
                  </div>

                  {/* Add to Cart Button */}
                  <div className="product-add-to-cart">
                    <button 
                      className="btn-add-to-cart"
                      onClick={() => handleAddToCart(product)}
                    >
                      <i className="f-shopping-cart me-2"></i>
                      <TranslatedText text="Add to Cart" />
                    </button>
                  </div>
                </div>

                <div className="product-info">
                  {/* Rating */}
                  {product.rating && (
                    <div className="product-rating mb-2">
                      <div className="stars">
                        {[...Array(5)].map((_, index) => (
                          <i
                            key={index}
                            className={`f-star ${product.rating && index < product.rating ? 'active' : ''}`}
                          />
                        ))}
                      </div>
                      {product.reviewsCount && (
                        <span className="reviews-count">({product.reviewsCount})</span>
                      )}
                    </div>
                  )}

                  {/* Product Title */}
                  <h3 className="product-title">
                    <Link href={`/shop/${product.slug}`}>{product.name}</Link>
                  </h3>

                  {/* Product Price */}
                  <div className="product-price">
                    <PriceDisplay 
                      amount={product.price} 
                      className="current-price"
                      fromCurrency="USD"
                    />
                    {product.comparePrice && (
                      <span className="compare-price">
                        <PriceDisplay 
                          amount={product.comparePrice} 
                          fromCurrency="USD"
                        />
                      </span>
                    )}
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
              <TranslatedText text="View All" />
              <i className="f-arrow-right ms-2"></i>
            </Link>
          </div>
        )}
      </div>

      <style jsx>{`
        .woodmart-product-grid {
          background: var(--light-color);
        }

        .section-header {
          margin-bottom;
        }

        .section-subtitle {
          display: inline-block;
          font-family: var(--font-family-heading);
          font-size;
          font-weight;
          text-transform;
          letter-spacing;
          color: var(--primary-color);
          margin-bottom;
        }

        .section-title {
          font-family: var(--font-family-heading);
          font-size;
          font-weight;
          color: var(--secondary-color);
          margin-bottom;
        }

        .product-card {
          background;
          border-radius: var(--border-radius-lg);
          overflow;
          transition: all 0.3s ease;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
          height;
          display;
          flex-direction;
        }

        .product-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
        }

        .product-image-wrapper {
          position;
          overflow;
          height;
          flex-shrink;
        }

        .product-image {
          position;
          height: 100%;
          overflow;
        }

        .product-image img {
          position;
          top;
          left;
          width: 100%;
          height: 100%;
          object-fit;
          transition: transform 0.3s ease;
        }

        .product-card:hover .product-image img {
          transform: scale(1.05);
        }

        .product-badges {
          position;
          top;
          left;
          z-index;
        }

        .badge {
          display: inline-block;
          padding;
          font-size;
          font-weight;
          text-transform;
          letter-spacing: 0.5px;
          border-radius: var(--border-radius-sm);
          margin-right;
          margin-bottom;
        }

        .badge-new {
          background: var(--success-color);
          color;
        }

        .badge-sale {
          background: var(--danger-color);
          color;
        }

        .badge-featured {
          background: var(--primary-color);
          color;
        }

        .product-actions {
          position;
          top;
          right;
          display;
          flex-direction;
          gap;
          opacity;
          transform: translateX(10px);
          transition: all 0.3s ease;
          z-index;
        }

        .product-card:hover .product-actions {
          opacity;
          transform: translateX(0);
        }

        .action-btn {
          width;
          height;
          background;
          border;
          border-radius: 50%;
          display;
          align-items;
          justify-content;
          cursor;
          transition: all 0.3s ease;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }

        .action-btn:hover {
          background: var(--primary-color);
          color;
          transform: scale(1.1);
        }

        .wishlist-btn.active {
          background: var(--danger-color);
          color;
        }

        .wishlist-btn.active:hover {
          background: var(--danger-color);
          color;
        }

        .product-add-to-cart {
          position;
          bottom;
          left;
          right;
          background;
          padding;
          transform: translateY(100%);
          transition: transform 0.3s ease;
          z-index;
        }

        .product-card:hover .product-add-to-cart {
          transform: translateY(0);
        }

        .btn-add-to-cart {
          width: 100%;
          background: var(--secondary-color);
          color;
          border;
          padding;
          border-radius: var(--border-radius);
          font-family: var(--font-family-heading);
          font-size;
          font-weight;
          text-transform;
          letter-spacing: 0.5px;
          cursor;
          transition: all 0.3s ease;
        }

        .btn-add-to-cart:hover {
          background: var(--primary-color);
          transform: translateY(-1px);
        }

        .product-info {
          padding;
          flex;
          display;
          flex-direction;
          justify-content: space-between;
        }

        .product-rating {
          display;
          align-items;
          gap;
        }

        .stars {
          display;
          gap;
        }

        .stars i {
          color: #ddd;
          font-size;
        }

        .stars i.active {
          color: #ffc107;
        }

        .reviews-count {
          font-size;
          color: var(--gray-600);
        }

        .product-title {
          margin-bottom;
        }

        .product-title a {
          font-family: var(--font-family-heading);
          font-size;
          font-weight;
          color: var(--secondary-color);
          text-decoration;
          transition: color 0.3s ease;
        }

        .product-title a:hover {
          color: var(--primary-color);
        }

        .product-price {
          display;
          align-items;
          gap;
        }

        .current-price {
          font-family: var(--font-family-heading);
          font-size;
          font-weight;
          color: var(--secondary-color);
        }

        .compare-price {
          font-family: var(--font-family-heading);
          font-size;
          font-weight;
          color: var(--gray-600);
          text-decoration: line-through;
        }

        .btn-view-all {
          display: inline-flex;
          align-items;
          font-family: var(--font-family-heading);
          font-size;
          font-weight;
          text-transform;
          letter-spacing;
          color: var(--secondary-color);
          background;
          padding;
          border: 2px solid var(--gray-300);
          border-radius: var(--border-radius);
          text-decoration;
          transition: all 0.3s ease;
        }

        .btn-view-all:hover {
          background: var(--primary-color);
          color;
          border-color: var(--primary-color);
          transform: translateY(-2px);
        }

        /* Responsive Design */
        @media (max-width) {
          .section-title {
            font-size;
          }

          .product-actions {
            opacity;
            transform: translateX(0);
            flex-direction;
            bottom;
            top;
          }

          .product-add-to-cart {
            position;
            transform;
            margin-top;
          }

          .product-card:hover .product-add-to-cart {
            transform;
          }
        }
      `}</style>
    </section>
  );
};

export default WoodMartProductGrid;

