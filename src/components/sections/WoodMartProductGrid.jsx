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
          background: #ffffff;
          padding: 80px 0;
        }

        .section-header {
          text-align: center;
          margin-bottom: 60px;
        }

        .section-subtitle {
          display: inline-block;
          font-family: 'Poppins', sans-serif;
          font-size: 14px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 2px;
          color: #83B735;
          margin-bottom: 20px;
          background: rgba(131, 183, 53, 0.1);
          padding: 10px 20px;
          border-radius: 25px;
        }

        .section-title {
          font-family: 'Poppins', sans-serif;
          font-size: 2.8rem;
          font-weight: 700;
          color: #1A1A1A;
          margin-bottom: 0;
          line-height: 1.2;
        }

        .product-card {
          background: #ffffff;
          border-radius: 12px;
          overflow: hidden;
          transition: all 0.3s ease;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
          height: 100%;
          display: flex;
          flex-direction: column;
        }

        .product-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
        }

        .product-image-wrapper {
          position: relative;
          overflow: hidden;
          height: 250px;
          flex-shrink: 0;
        }

        .product-image {
          position: relative;
          height: 100%;
          overflow: hidden;
        }

        .product-image img {
          position: absolute;
          top: 0;
          left: 0;
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
          z-index: 2;
        }

        .badge {
          display: inline-block;
          padding: 6px 12px;
          font-size: 11px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          border-radius: 4px;
          margin-right: 8px;
          margin-bottom: 8px;
        }

        .badge-new {
          background: #27AE60;
          color: #ffffff;
        }

        .badge-sale {
          background: #E74C3C;
          color: #ffffff;
        }

        .badge-featured {
          background: #83B735;
          color: #ffffff;
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
          z-index: 2;
        }

        .product-card:hover .product-actions {
          opacity: 1;
          transform: translateX(0);
        }

        .action-btn {
          width: 40px;
          height: 40px;
          background: #ffffff;
          border: none;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          color: #374151;
        }

        .action-btn:hover {
          background: #83B735;
          color: #ffffff;
          transform: scale(1.1);
        }

        .wishlist-btn.active {
          background: #E74C3C;
          color: #ffffff;
        }

        .wishlist-btn.active:hover {
          background: #C0392B;
          color: #ffffff;
        }

        .product-add-to-cart {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          background: #ffffff;
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
          background: #1A1A1A;
          color: #ffffff;
          border: none;
          padding: 12px 20px;
          border-radius: 6px;
          font-family: 'Poppins', sans-serif;
          font-size: 14px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .btn-add-to-cart:hover {
          background: #83B735;
          transform: translateY(-1px);
        }

        .product-info {
          padding: 20px;
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }

        .product-rating {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 10px;
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
          color: #6c757d;
        }

        .product-title {
          margin-bottom: 10px;
        }

        .product-title a {
          font-family: 'Poppins', sans-serif;
          font-size: 16px;
          font-weight: 600;
          color: #1A1A1A;
          text-decoration: none;
          transition: color 0.3s ease;
        }

        .product-title a:hover {
          color: #83B735;
        }

        .product-price {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .current-price {
          font-family: 'Poppins', sans-serif;
          font-size: 18px;
          font-weight: 700;
          color: #1A1A1A;
        }

        .compare-price {
          font-family: 'Poppins', sans-serif;
          font-size: 14px;
          font-weight: 500;
          color: #6c757d;
          text-decoration: line-through;
        }

        .btn-view-all {
          display: inline-flex;
          align-items: center;
          font-family: 'Poppins', sans-serif;
          font-size: 14px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 1px;
          color: #1A1A1A;
          background: transparent;
          padding: 15px 30px;
          border: 2px solid #e5e7eb;
          border-radius: 6px;
          text-decoration: none;
          transition: all 0.3s ease;
        }

        .btn-view-all:hover {
          background: #83B735;
          color: #ffffff;
          border-color: #83B735;
          transform: translateY(-2px);
        }

        /* Responsive Design */
        @media (max-width: 768px) {
          .section-title {
            font-size: 2.2rem;
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
            margin-top: 10px;
          }

          .product-card:hover .product-add-to-cart {
            transform: none;
          }
        }

        @media (max-width: 576px) {
          .woodmart-product-grid {
            padding: 60px 0;
          }

          .section-title {
            font-size: 1.8rem;
          }

          .product-image-wrapper {
            height: 200px;
          }
        }
      `}</style>
    </section>
  );
};

export default WoodMartProductGrid;

