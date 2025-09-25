'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { apiService } from '@/services/api';

const FeaturedProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('featured');

  // Mock data - replace with API call
  const mockProducts = [
    {
      id: 1,
      name: 'Premium Wireless Headphones',
      slug: 'premium-wireless-headphones',
      price: 299.99,
      sale_price: 199.99,
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop',
      rating: 4.8,
      review_count: 128,
      vendor: { name: 'TechStore', slug: 'techstore' },
      badges: ['sale', 'featured'],
      is_featured: true
    },
    {
      id: 9,
      name: 'Smart Fitness Watch',
      slug: 'smart-fitness-watch',
      price: 249.99,
      image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop',
      rating: 4.6,
      review_count: 128,
      vendor: { name: 'FitTech', slug: 'fittech' },
      badges: ['new'],
      is_featured: true
    },
    {
      id: 9,
      name: 'Organic Cotton T-Shirt',
      slug: 'organic-cotton-t-shirt',
      price: 39.99,
      sale_price: 29.99,
      image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop',
      rating: 4.7,
      review_count: 128,
      vendor: { name: 'EcoFashion', slug: 'ecofashion' },
      badges: ['sale', 'eco-friendly'],
      is_featured: true
    },
    {
      id: 9,
      name: 'Professional Camera Lens',
      slug: 'professional-camera-lens',
      price: 899.99,
      image: 'https://images.unsplash.com/photo-1606983340126-99ab4feaa64a?w=400&h=400&fit=crop',
      rating: 4.9,
      review_count: 128,
      vendor: { name: 'PhotoPro', slug: 'photopro' },
      badges: ['premium'],
      is_featured: true
    },
    {
      id: 9,
      name: 'Bluetooth Speaker',
      slug: 'bluetooth-speaker',
      price: 129.99,
      sale_price: 99.99,
      image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400&h=400&fit=crop',
      rating: 4.5,
      review_count: 128,
      vendor: { name: 'AudioMax', slug: 'audiomax' },
      badges: ['sale', 'trending'],
      is_featured: true
    },
    {
      id: 9,
      name: 'Gaming Mechanical Keyboard',
      slug: 'gaming-mechanical-keyboard',
      price: 179.99,
      image: 'https://images.unsplash.com/photo-1541140532154-b024d705b90a?w=400&h=400&fit=crop',
      rating: 4.7,
      review_count: 128,
      vendor: { name: 'GameGear', slug: 'gamegear' },
      badges: ['gaming'],
      is_featured: true
    },
    {
      id: 9,
      name: 'Yoga Mat Premium',
      slug: 'yoga-mat-premium',
      price: 79.99,
      sale_price: 59.99,
      image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=400&fit=crop',
      rating: 4.6,
      review_count: 128,
      vendor: { name: 'WellnessStore', slug: 'wellnessstore' },
      badges: ['sale', 'wellness'],
      is_featured: true
    },
    {
      id: 9,
      name: 'Portable Phone Charger',
      slug: 'portable-phone-charger',
      price: 49.99,
      image: 'https://images.unsplash.com/photo-1609592807432-db8b8e9e8b8b?w=400&h=400&fit=crop',
      rating: 4.4,
      review_count: 128,
      vendor: { name: 'PowerTech', slug: 'powertech' },
      badges: ['best-seller'],
      is_featured: true
    }
  ];

  const tabs = [
    { key: 'featured', label: 'Featured', icon: 'f-star' },
    { key: 'trending', label: 'Trending', icon: 'f-fire' },
    { key: 'new', label: 'New Arrivals', icon: 'f-sparkles' },
    { key: 'sale', label: 'On Sale', icon: 'f-percent' }
  ];

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        let apiProducts;
        
        // Fetch based on active tab
        switch (activeTab) {
          case 'featured':
            apiProducts = await apiService.getFeaturedProducts();
            break;
          case 'trending':
            apiProducts = await apiService.getProducts();
            break;
          case 'new':
            apiProducts = await apiService.getProducts();
            break;
          case 'sale':
            apiProducts = await apiService.getProducts();
            break;
          default:
            apiProducts = await apiService.getFeaturedProducts();
        }

        // Check if API returned valid data
        if (apiProducts && Array.isArray(apiProducts) && apiProducts.length > 0) {
          setProducts(apiProducts);
        } else {
          // API returned null/empty, use mock data
          console.log(`API products (${activeTab}) not available, using mock data`);
          let filteredProducts = [...mockProducts];
          if (activeTab === 'trending') {
            filteredProducts = mockProducts.filter(p => p.badges.includes('trending'));
          } else if (activeTab === 'new') {
            filteredProducts = mockProducts.filter(p => p.badges.includes('new'));
          } else if (activeTab === 'sale') {
            filteredProducts = mockProducts.filter(p => p.badges.includes('sale'));
          }
          setProducts(filteredProducts);
        }
      } catch (error) {
        console.error('Error fetching products:', error);
        // Fallback to mock data
        console.log('Using mock products due to error');
        let filteredProducts = [...mockProducts];
        if (activeTab === 'trending') {
          filteredProducts = mockProducts.filter(p => p.badges.includes('trending'));
        } else if (activeTab === 'new') {
          filteredProducts = mockProducts.filter(p => p.badges.includes('new'));
        } else if (activeTab === 'sale') {
          filteredProducts = mockProducts.filter(p => p.badges.includes('sale'));
        }
        setProducts(filteredProducts);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [activeTab]);

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<i key={i} className="f-star"></i>);
    }

    if (hasHalfStar) {
      stars.push(<i key="half" className="f-star-half-alt"></i>);
    }

    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<i key={`empty-${i}`} className="far fa-star"></i>);
    }

    return stars;
  };

  const getBadgeClass = (badge) => {
    const badgeClasses = {
      'sale': 'badge-sale',
      'new': 'badge-new',
      'featured': 'badge-featured',
      'trending': 'badge-trending',
      'premium': 'badge-premium',
      'eco-friendly': 'badge-eco',
      'gaming': 'badge-gaming',
      'wellness': 'badge-wellness',
      'best-seller': 'badge-bestseller'
    };
    return badgeClasses[badge] || 'badge-default';
  };

  if (loading) {
    return (
      <section className="featured-products-section py-5">
        <div className="container">
          <div className="row">
            <div className="col-12">
              <div className="section-header text-center mb-5">
                <h2 className="section-title">Featured Products</h2>
                <p className="section-subtitle">Discover our most popular items</p>
              </div>
            </div>
          </div>
          
          <div className="products-loading">
            <div className="row">
              {[...Array(8)].map((_, index) => (
                <div key={index} className="col-lg-3 col-md-4 col-sm-6 mb-4">
                  <div className="product-card loading">
                    <div className="product-image loading-shimmer"></div>
                    <div className="product-content">
                      <div className="product-name loading-shimmer"></div>
                      <div className="product-vendor loading-shimmer"></div>
                      <div className="product-price loading-shimmer"></div>
                      <div className="product-rating loading-shimmer"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="featured-products-section py-5">
      <div className="container">
        <div className="row">
          <div className="col-12">
            <div className="section-header text-center mb-5">
              <h2 className="section-title">Featured Products</h2>
              <p className="section-subtitle">Discover our most popular items</p>
            </div>
          </div>
        </div>

        {/* Product Tabs */}
        <div className="row mb-4">
          <div className="col-12">
            <div className="product-tabs d-flex justify-content-center">
              {tabs.map((tab) => (
                <button
                  key={tab.key}
                  className={`product-tab ${activeTab === tab.key ? 'active' : ''}`}
                  onClick={() => setActiveTab(tab.key)}
                >
                  <i className={`${tab.icon} me-2`}></i>
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <div className="row">
          {products.map((product) => (
            <div key={product.id} className="col-lg-3 col-md-4 col-sm-6 mb-4">
              <Link href={`/products/${product.slug}`} className="product-link">
                <div className="product-card">
                  <div className="product-image">
                    <img 
                      src={product.image} 
                      alt={product.name}
                      onError={(e) => {
                        const target = e.target ;
                        target.src = '/images/placeholder-product.jpg';
                      }}
                    />
                    
                    {/* Product Badges */}
                    <div className="product-badges">
                      {product.badges.map((badge) => (
                        <span key={badge} className={`product-badge ${getBadgeClass(badge)}`}>
                          {badge.replace('-', ' ').toUpperCase()}
                        </span>
                      ))}
                    </div>

                    {/* Quick Actions */}
                    <div className="product-actions">
                      <button className="product-action-btn" title="Add to Wishlist">
                        <i className="far fa-heart"></i>
                      </button>
                      <button className="product-action-btn" title="Quick View">
                        <i className="f-eye"></i>
                      </button>
                      <button className="product-action-btn" title="Compare">
                        <i className="f-exchange-alt"></i>
                      </button>
                    </div>
                  </div>

                  <div className="product-content">
                    <div className="product-vendor">
                      <span className="vendor-name" onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        window.location.href = `/vendors/${product.vendor.slug}`;
                      }}>
                        {product.vendor.name}
                      </span>
                    </div>
                    <h4 className="product-name">{product.name}</h4>
                    
                    <div className="product-rating">
                      <div className="stars">
                        {renderStars(product.rating)}
                      </div>
                      <span className="rating-count">({product.review_count})</span>
                    </div>

                    <div className="product-price">
                      {product.sale_price ? (
                        <>
                          <span className="current-price">${product.sale_price}</span>
                          <span className="original-price">${product.price}</span>
                          <span className="discount-percent">
                            {Math.round(((product.price - product.sale_price) / product.price) * 100)}% OFF
                          </span>
                        </>
                      ) : (
                        <span className="current-price">${product.price}</span>
                      )}
                    </div>

                    <button className="btn btn-primary btn-add-cart">
                      <i className="f-shopping-cart me-2"></i>
                      Add to Cart
                    </button>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>

        <div className="row mt-5">
          <div className="col-12 text-center">
            <Link href="/shop" className="btn btn-outline-primary btn-lg">
              View All Products
            </Link>
          </div>
        </div>
      </div>

      <style jsx>{`
        .featured-products-section {
          background-color;
        }

        .section-header {
          margin-bottom;
        }

        .section-title {
          font-size: 2.5rem;
          font-weight;
          color: var(--secondary-color);
          margin-bottom;
        }

        .section-subtitle {
          font-size: 1.1rem;
          color: var(--gray-600);
          margin-bottom;
        }

        .product-tabs {
          gap;
          margin-bottom;
          flex-wrap;
        }

        .product-tab {
          background;
          border: 2px solid var(--gray-300);
          color: var(--gray-600);
          padding;
          border-radius;
          font-weight;
          transition: var(--transition);
          cursor;
          display;
          align-items;
        }

        .product-tab,
        .product-tab.active {
          background-color: var(--primary-color);
          border-color: var(--primary-color);
          color;
        }

        .product-link {
          text-decoration;
          color;
          display;
          height: 100%;
        }

        .product-card {
          background;
          border-radius: var(--border-radius-xl);
          overflow;
          box-shadow: var(--shadow-sm);
          transition: var(--transition);
          height: 100%;
          display;
          flex-direction;
        }

        .product-card:hover {
          transform: translateY(-5px);
          box-shadow: var(--shadow-lg);
        }

        .product-image {
          position;
          height;
          overflow;
        }

        .product-image img {
          width: 100%;
          height: 100%;
          object-fit;
          transition: var(--transition);
        }

        .product-card:hover .product-image img {
          transform: scale(1.1);
        }

        .product-badges {
          position;
          top;
          left;
          z-index;
        }

        .product-badge {
          display;
          padding;
          font-size;
          font-weight;
          text-transform;
          border-radius;
          margin-bottom;
          color;
        }

        .badge-sale { background-color: var(--danger-color); }
        .badge-new { background-color: var(--success-color); }
        .badge-featured { background-color: var(--primary-color); }
        .badge-trending { background-color: var(--warning-color); }
        .badge-premium { background-color: var(--info-color); }
        .badge-eco { background-color: #2ecc71; }
        .badge-gaming { background-color: #9b59b6; }
        .badge-wellness { background-color: #1abc9c; }
        .badge-bestseller { background-color: #e67e22; }

        .product-actions {
          position;
          top;
          right;
          display;
          flex-direction;
          gap;
          opacity;
          transition: var(--transition);
          z-index;
        }

        .product-card:hover .product-actions {
          opacity;
        }

        .product-action-btn {
          width;
          height;
          border-radius: 50%;
          background;
          border;
          display;
          align-items;
          justify-content;
          box-shadow: var(--shadow-sm);
          color: var(--secondary-color);
          transition: var(--transition);
          cursor;
        }

        .product-action-btn:hover {
          background: var(--primary-color);
          color;
          transform: scale(1.1);
        }

        .product-content {
          padding: 1.5rem;
          flex;
          display;
          flex-direction;
        }

        .product-vendor {
          margin-bottom: 0.5rem;
        }

        .vendor-name {
          font-size: 0.85rem;
          color: var(--gray-600);
          text-decoration;
          cursor;
          transition: var(--transition-fast);
        }

        .vendor-name:hover {
          color: var(--primary-color);
        }

        .product-name {
          font-size: 1.1rem;
          font-weight;
          color: var(--secondary-color);
          margin-bottom: 0.75rem;
          line-height: 1.4;
          display: -webkit-box;
          -webkit-line-clamp;
          -webkit-box-orient;
          overflow;
        }

        .product-rating {
          display;
          align-items;
          gap: 0.5rem;
          margin-bottom;
        }

        .stars {
          color: var(--warning-color);
        }

        .rating-count {
          font-size: 0.85rem;
          color: var(--gray-600);
        }

        .product-price {
          margin-bottom;
          margin-top;
        }

        .current-price {
          font-size: 1.25rem;
          font-weight;
          color: var(--primary-color);
        }

        .original-price {
          font-size;
          color: var(--gray-600);
          text-decoration: line-through;
          margin-left: 0.5rem;
        }

        .discount-percent {
          display;
          font-size: 0.85rem;
          color: var(--danger-color);
          font-weight;
          margin-top: 0.25rem;
        }

        .btn-add-cart {
          width: 100%;
          padding;
          font-size: 0.9rem;
          font-weight;
          border-radius;
        }

        /* Loading States */
        .loading-shimmer {
          background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
          background-size: 200% 100%;
          animation: shimmer 1.5s infinite;
          border-radius;
        }

        .product-card.loading .product-image {
          background: #f0f0f0;
        }

        .product-card.loading .product-name {
          width: 90%;
          height;
          margin-bottom: 0.75rem;
        }

        .product-card.loading .product-vendor {
          width: 60%;
          height;
          margin-bottom: 0.5rem;
        }

        .product-card.loading .product-price {
          width: 70%;
          height;
          margin-bottom;
        }

        .product-card.loading .product-rating {
          width: 50%;
          height;
          margin-bottom;
        }

        @keyframes shimmer {
          0% {
            background-position: -200% 0;
          }
          100% {
            background-position: 200% 0;
          }
        }

        @media (max-width) {
          .section-title {
            font-size;
          }

          .product-tabs {
            justify-content;
          }

          .product-tab {
            padding;
            font-size: 0.9rem;
          }

          .product-image {
            height;
          }

          .product-content {
            padding;
          }

          .product-name {
            font-size;
          }
        }
      `}</style>
    </section>
  );
};

export default FeaturedProducts;

