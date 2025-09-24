'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/contexts/CartContext';

interface Product {
  id: number;
  name: string;
  slug: string;
  price: number;
  comparePrice?: number;
  image: string;
  badge?: string;
  badgeColor?: string;
  rating?: number;
  reviewsCount?: number;
  isNew?: boolean;
  isSale?: boolean;
  isFeatured?: boolean;
}

interface WoodMartProductGridProps {
  title?: string;
  subtitle?: string;
  products: Product[];
  columns?: number;
  showViewAll?: boolean;
  viewAllLink?: string;
}

const WoodMartProductGrid: React.FC<WoodMartProductGridProps> = ({
  title = "Featured Products",
  subtitle = "Discover our curated selection",
  products,
  columns = 4,
  showViewAll = true,
  viewAllLink = "/shop"
}) => {
  const { addToCart } = useCart();
  const gridClass = `col-lg-${12 / columns} col-md-6 col-sm-6 col-12`;

  const handleAddToCart = (product: Product) => {
    addToCart({
      productId: product.id.toString(),
      name: product.name,
      price: product.price,
      quantity: 1,
      image: product.image,
      vendor: 'WoodMart',
      sku: `WM-${product.id}`,
    });
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
                  {/* Rating */}
                  {product.rating && (
                    <div className="product-rating mb-2">
                      <div className="stars">
                        {[...Array(5)].map((_, index) => (
                          <i
                            key={index}
                            className={`fas fa-star ${index < product.rating! ? 'active' : ''}`}
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
                    <span className="current-price">${product.price}</span>
                    {product.comparePrice && (
                      <span className="compare-price">${product.comparePrice}</span>
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
          padding-top: 100%;
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
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .current-price {
          font-family: var(--font-family-heading);
          font-size: 18px;
          font-weight: 700;
          color: var(--secondary-color);
        }

        .compare-price {
          font-family: var(--font-family-heading);
          font-size: 14px;
          font-weight: 500;
          color: var(--gray-600);
          text-decoration: line-through;
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
        }
      `}</style>
    </section>
  );
};

export default WoodMartProductGrid;
