'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { apiService } from '@/services/api';
import { useAuth } from '@/contexts/AuthContext';

;
  badges;
  is_featured;
}

const ProductGrid: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [viewMode] = useState<'grid' | 'list'>('grid');
  const [wishlistItems, setWishlistItems] = useState<Set<number>>(new Set());
  const [wishlistLoading, setWishlistLoading] = useState<boolean>(false);

  // Mock data - replace with API call
  const mockProducts= [
    {
      id,
      name: 'Premium Wireless Headphones',
      slug: 'premium-wireless-headphones',
      price: 299.99,
      sale_price: 199.99,
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop',
      rating: 4.8,
      review_count,
      vendor: { name: 'TechStore', slug: 'techstore' },
      badges: ['sale', 'featured'],
      is_featured: true
    },
    {
      id,
      name: 'Smart Fitness Watch',
      slug: 'smart-fitness-watch',
      price: 249.99,
      image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop',
      rating: 4.6,
      review_count,
      vendor: { name: 'FitTech', slug: 'fittech' },
      badges: ['new'],
      is_featured: true
    },
    {
      id,
      name: 'Organic Cotton T-Shirt',
      slug: 'organic-cotton-t-shirt',
      price: 39.99,
      sale_price: 29.99,
      image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop',
      rating: 4.7,
      review_count,
      vendor: { name: 'EcoFashion', slug: 'ecofashion' },
      badges: ['sale', 'eco-friendly'],
      is_featured: true
    },
    {
      id,
      name: 'Professional Camera Lens',
      slug: 'professional-camera-lens',
      price: 899.99,
      image: 'https://images.unsplash.com/photo-1606983340126-99ab4feaa64a?w=400&h=400&fit=crop',
      rating: 4.9,
      review_count,
      vendor: { name: 'PhotoPro', slug: 'photopro' },
      badges: ['premium'],
      is_featured: true
    },
    {
      id,
      name: 'Bluetooth Speaker',
      slug: 'bluetooth-speaker',
      price: 129.99,
      sale_price: 99.99,
      image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400&h=400&fit=crop',
      rating: 4.5,
      review_count,
      vendor: { name: 'AudioMax', slug: 'audiomax' },
      badges: ['sale', 'trending'],
      is_featured: true
    },
    {
      id,
      name: 'Gaming Mechanical Keyboard',
      slug: 'gaming-mechanical-keyboard',
      price: 179.99,
      image: 'https://images.unsplash.com/photo-1541140532154-b024d705b90a?w=400&h=400&fit=crop',
      rating: 4.7,
      review_count,
      vendor: { name: 'GameGear', slug: 'gamegear' },
      badges: ['gaming'],
      is_featured: true
    },
    {
      id,
      name: 'Yoga Mat Premium',
      slug: 'yoga-mat-premium',
      price: 79.99,
      sale_price: 59.99,
      image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=400&fit=crop',
      rating: 4.6,
      review_count,
      vendor: { name: 'WellnessStore', slug: 'wellnessstore' },
      badges: ['sale', 'wellness'],
      is_featured: true
    },
    {
      id,
      name: 'Portable Phone Charger',
      slug: 'portable-phone-charger',
      price: 49.99,
      image: 'https://images.unsplash.com/photo-1609592807432-db8b8e9e8b8b?w=400&h=400&fit=crop',
      rating: 4.4,
      review_count,
      vendor: { name: 'PowerTech', slug: 'powertech' },
      badges: ['best-seller'],
      is_featured: true
    }
  ];

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        // Try to fetch from API first
        const apiProducts = await apiService.getProducts({
          limit: 12
        });
        
        // Check if API returned valid data
        if (apiProducts && Array.isArray(apiProducts) && apiProducts.length > 0) {
          setProducts(apiProducts);
          setTotalPages(Math.ceil(apiProducts.length / 12));
        } else {
          // API returned null/empty, use mock data
          console.log('API products not available, using mock data');
          setProducts(mockProducts);
          setTotalPages(1);
        }
      } catch (error) {
        console.error('Error fetching products:', error);
        // Fallback to mock data
        console.log('Using mock products due to error');
        setProducts(mockProducts);
        setTotalPages(1);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [currentPage]);

  const loadWishlistStatus = async () => {
    try {
      setWishlistLoading(true);
      const promises = products.map(product => 
        apiService.checkWishlistStatus(product.id.toString())
      );
      const responses = await Promise.all(promises);
      
      const wishlistSet = new Set<number>();
      responses.forEach((response, index) => {
        if (response.success && response.data.in_wishlist) {
          wishlistSet.add(products[index].id);
        }
      });
      
      setWishlistItems(wishlistSet);
    } catch (error) {
      console.error('Error loading wishlist status:', error);
    } finally {
      setWishlistLoading(false);
    }
  };

  // Load wishlist status for all products
  useEffect(() => {
    if (isAuthenticated && products.length > 0) {
      loadWishlistStatus();
    }
  }, [isAuthenticated, products, loadWishlistStatus]);

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
    const badgeClasses: { [key: string]: string } = {
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
      <div className="product-grid">
        <div className="row">
          {[...Array(12)].map((_, index) => (
            <div key={index} className="col-lg-4 col-md-6 mb-4">
              <div className="product-card loading">
                <div className="product-image loading-shimmer"></div>
                <div className="product-content">
                  <div className="product-name loading-shimmer"></div>
                  <div className="product-price loading-shimmer"></div>
                  <div className="product-rating loading-shimmer"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="product-grid">
      <div className={`row ${viewMode === 'list' ? 'list-view' : ''}`}>
        {products.map((product) => (
          <div key={product.id} className={`${viewMode === 'list' ? 'col-12' : 'col-lg-4 col-md-6'} mb-4`}>
            <Link href={`/products/${product.slug}`} className="product-link">
              <div className={`product-card ${viewMode === 'list' ? 'list-card' : ''}`}>
                <div className="product-image">
                  <img 
                    src={product.image} 
                    alt={product.name}
                    onError={(e) => {
                      const target = e.target ;
                      target.src = 'https://via.placeholder.com/400x400/83b735/ffffff?text=Product';
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
                    <button 
                      className={`product-action-btn ${wishlistItems.has(product.id) ? 'active' : ''}`}
                      title={wishlistItems.has(product.id) ? "Remove from Wishlist" : "Add to Wishlist"}
                      onClick={() => handleWishlistToggle(product)}
                      disabled={wishlistLoading}
                    >
                      <i className={`${wishlistItems.has(product.id) ? 'fas' : 'far'} fa-heart`}></i>
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

      {/* Pagination */}
      <div className="pagination-section mt-5">
        <nav aria-label="Product pagination">
          <ul className="pagination justify-content-center">
            <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
              <button 
                className="page-link" 
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={currentPage === 1}
              >
                <i className="f-chevron-left"></i>
              </button>
            </li>
            
            {[...Array(totalPages)].map((_, index) => (
              <li key={index} className={`page-item ${currentPage === index + 1 ? 'active' : ''}`}>
                <button 
                  className="page-link" 
                  onClick={() => setCurrentPage(index + 1)}
                >
                  {index + 1}
                </button>
              </li>
            ))}
            
            <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
              <button 
                className="page-link" 
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                <i className="f-chevron-right"></i>
              </button>
            </li>
          </ul>
        </nav>
      </div>

      <style jsx>{`
        .product-grid {
          min-height;
        }

        .product-link {
          text-decoration;
          color;
          display;
          height: 100%;
        }

        .product-card {
          background;
          border-radius;
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

        .product-card.list-card {
          flex-direction;
          height;
        }

        .product-image {
          position;
          height;
          overflow;
        }

        .list-card .product-image {
          height;
          width;
          flex-shrink;
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
          border-radius;
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

        .product-action-btn.active {
          background: var(--danger-color);
          color;
        }

        .product-action-btn.active:hover {
          background: var(--danger-color);
          color;
        }

        .product-content {
          padding: 1.5rem;
          flex;
          display;
          flex-direction;
        }

        .list-card .product-content {
          padding;
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

        /* Pagination */
        .pagination {
          margin;
        }

        .page-link {
          color: var(--primary-color);
          border: 1px solid var(--gray-300);
          border-radius;
          padding: 0.5rem 0.75rem;
          margin;
        }

        .page-link:hover {
          color: var(--primary-hover);
          background-color: var(--gray-100);
          border-color: var(--primary-color);
        }

        .page-item.active .page-link {
          background-color: var(--primary-color);
          border-color: var(--primary-color);
          color;
        }

        .page-item.disabled .page-link {
          color: var(--gray-400);
          background-color: var(--gray-100);
          border-color: var(--gray-300);
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
          .product-image {
            height;
          }

          .product-content {
            padding;
          }

          .product-name {
            font-size;
          }

          .list-card .product-image {
            width: 100%;
            height;
          }

          .list-card .product-content {
            padding;
          }
        }
      `}</style>
    </div>
  );
};

export default ProductGrid;

