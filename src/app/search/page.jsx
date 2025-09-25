'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Layout from '@/components/Layout';
import Image from 'next/image';
import Link from 'next/link';
import { apiService } from '@/services/api';
import { useCurrency } from '@/contexts/CurrencyLanguageContext';
import PriceDisplay from '@/components/PriceDisplay';
import TranslatedText from '@/components/TranslatedText';

function SearchContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({});
  const [sortBy, setSortBy] = useState('relevance');
  const [sortOrder, setSortOrder] = useState('desc');

  // const { formatPrice } = useCurrency();

  const performSearch = async () => {
    if (!query.trim()) {
      setProducts([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const searchFilters = {
        ...filters,
        sortBy,
        sortOrder
      };

      const response = await apiService.searchProducts(query, searchFilters);
      
      if (response.success) {
        setProducts(response.data);
      } else {
        setError('No products found for your search');
      }
    } catch (err) {
      console.error('Search error:', err);
      setError('Error performing search. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await apiService.getCategories();
      if (response.success) {
        setCategories(response.data);
      }
    } catch (err) {
      console.error('Error fetching categories:', err);
    }
  };

  useEffect(() => {
    if (query) {
      performSearch();
    }
  }, [query, filters, sortBy, sortOrder, performSearch]);

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const clearFilters = () => {
    setFilters({});
    setSortBy('relevance');
    setSortOrder('desc');
  };

  const handleSortChange = (newSortBy) => {
    setSortBy(newSortBy);
  };

  return (
    <Layout>
      <div className="search-page py-5">
        <div className="container">
          {/* Search Header */}
          <div className="search-header mb-5">
            <div className="row">
              <div className="col-md-8">
                <h1 className="search-title mb-3">
                  <TranslatedText text="Search Results" />
                </h1>
                {query && (
                  <p className="search-query text-muted">
                    <TranslatedText text="Results for" />: <strong>&quot;{query}&quot;</strong>
                  </p>
                )}
                {products.length > 0 && (
                  <p className="search-count text-muted">
                    {products.length} <TranslatedText text="products found" />
                  </p>
                )}
              </div>
              <div className="col-md-4">
                <div className="search-actions d-flex justify-content-end">
                  <div className="sort-dropdown me-3">
                    <select 
                      className="form-select" 
                      value={sortBy}
                      onChange={(e) => handleSortChange(e.target.value)}
                    >
                      <option value="relevance">
                        <TranslatedText text="Relevance" />
                      </option>
                      <option value="price">
                        <TranslatedText text="Price" />
                      </option>
                      <option value="name">
                        <TranslatedText text="Name" />
                      </option>
                      <option value="created_at">
                        <TranslatedText text="Newest" />
                      </option>
                    </select>
                  </div>
                  <div className="sort-order">
                    <select 
                      className="form-select" 
                      value={sortOrder}
                      onChange={(e) => setSortOrder(e.target.value)}
                    >
                      <option value="desc">
                        <TranslatedText text="Descending" />
                      </option>
                      <option value="asc">
                        <TranslatedText text="Ascending" />
                      </option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="row">
            {/* Filters Sidebar */}
            <div className="col-lg-3 mb-4">
              <div className="search-filters">
                <div className="filter-card">
                  <h5 className="filter-title">
                    <TranslatedText text="Filters" />
                  </h5>
                  
                  {/* Category Filter */}
                  <div className="filter-section mb-4">
                    <h6 className="filter-section-title">
                      <TranslatedText text="Category" />
                    </h6>
                    <select 
                      className="form-select"
                      value={filters.category || ''}
                      onChange={(e) => handleFilterChange('category', e.target.value || undefined)}
                    >
                      <option value="">
                        <TranslatedText text="All Categories" />
                      </option>
                      {categories.map((category) => (
                        <option key={category.id} value={category.id.toString()}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Price Filter */}
                  <div className="filter-section mb-4">
                    <h6 className="filter-section-title">
                      <TranslatedText text="Price Range" />
                    </h6>
                    <div className="row">
                      <div className="col-6">
                        <input
                          type="number"
                          className="form-control"
                          placeholder="Min"
                          value={filters.minPrice || ''}
                          onChange={(e) => handleFilterChange('minPrice', e.target.value ? parseFloat(e.target.value) : null)}
                        />
                      </div>
                      <div className="col-6">
                        <input
                          type="number"
                          className="form-control"
                          placeholder="Max"
                          value={filters.maxPrice || ''}
                          onChange={(e) => handleFilterChange('maxPrice', e.target.value ? parseFloat(e.target.value) : null)}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Clear Filters */}
                  <button 
                    className="btn btn-outline-secondary btn-sm w-100"
                    onClick={clearFilters}
                  >
                    <TranslatedText text="Clear Filters" />
                  </button>
                </div>
              </div>
            </div>

            {/* Search Results */}
            <div className="col-lg-9">
              {loading ? (
                <div className="text-center py-5">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">
                      <TranslatedText text="Loading..." />
                    </span>
                  </div>
                  <p className="mt-3">
                    <TranslatedText text="Searching products..." />
                  </p>
                </div>
              ) : error ? (
                <div className="text-center py-5">
                  <div className="alert alert-warning">
                    <i className="f-exclamation-triangle me-2"></i>
                    {error}
                  </div>
                  <Link href="/shop" className="btn btn-primary">
                    <TranslatedText text="Browse All Products" />
                  </Link>
                </div>
              ) : products.length === 0 ? (
                <div className="text-center py-5">
                  <div className="no-results">
                    <i className="f-search fa-3x text-muted mb-3"></i>
                    <h4>
                      <TranslatedText text="No products found" />
                    </h4>
                    <p className="text-muted">
                      <TranslatedText text="Try adjusting your search terms or filters" />
                    </p>
                    <Link href="/shop" className="btn btn-primary">
                      <TranslatedText text="Browse All Products" />
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="search-results">
                  <div className="row g-4">
                    {products.map((product) => (
                      <div key={product.id} className="col-lg-4 col-md-6 col-sm-6 col-12">
                        <div className="product-card h-100">
                          <div className="product-image">
                            <Link href={`/shop/${product.slug}`}>
                              <Image
                                src={product.featured_image && typeof product.featured_image === 'string' && product.featured_image.startsWith('[') 
                                  ? JSON.parse(product.featured_image)[0] 
                                  : product.featured_image || '/images/placeholder-product.jpg'}
                                alt={product.name}
                                width={300}
                                height={300}
                                className="img-fluid"
                              />
                            </Link>
                            
                            {/* Product Badges */}
                            <div className="product-badges">
                              {product.is_featured && (
                                <span className="badge badge-featured">
                                  <TranslatedText text="Featured" />
                                </span>
                              )}
                              {product.sale_price && (
                                <span className="badge badge-sale">
                                  <TranslatedText text="Sale" />
                                </span>
                              )}
                            </div>

                            {/* Quick Actions */}
                            <div className="product-actions">
                              <button 
                                className="btn-add-to-cart"
                                onClick={() => {
                                  // Add to cart functionality
                                }}
                              >
                                <i className="f-shopping-cart me-2"></i>
                                <TranslatedText text="Add to Cart" />
                              </button>
                            </div>
                          </div>

                          <div className="product-info">
                            <h4 className="product-title">
                              <Link href={`/shop/${product.slug}`}>{product.name}</Link>
                            </h4>
                            
                            <div className="product-price">
                              <PriceDisplay 
                                amount={parseFloat(product.price?.toString() || '0')} 
                                className="current-price"
                                fromCurrency="USD"
                              />
                              {product.sale_price && (
                                <span className="compare-price">
                                  <del>
                                    <PriceDisplay 
                                      amount={parseFloat(product.sale_price.toString())} 
                                      fromCurrency="USD"
                                    />
                                  </del>
                                </span>
                              )}
                            </div>

                            {/* Rating */}
                            <div className="product-rating">
                              <div className="stars">
                                {[...Array(5)].map((_, i) => (
                                  <i 
                                    key={i} 
                                    className={`f-star ${i < 4 ? 'text-warning' : 'text-muted'}`}
                                  ></i>
                                ))}
                              </div>
                              <span className="rating-count">
                                (0)
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .search-page {
          min-height: 500px;
        }

        .search-title {
          font-size: 2.5rem;
          font-weight: 700;
          color: var(--primary-color);
        }

        .search-query {
          font-size: 1.1rem;
        }

        .search-count {
          font-size: 0.9rem;
        }

        .filter-card {
          background: #fff;
          border: 1px solid #e9ecef;
          border-radius: 8px;
          padding: 1.5rem;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }

        .filter-title {
          font-size: 1.2rem;
          font-weight: 600;
          margin-bottom: 1rem;
          color: var(--primary-color);
        }

        .filter-section-title {
          font-size: 1rem;
          font-weight: 500;
          margin-bottom: 0.5rem;
          color: var(--secondary-color);
        }

        .product-card {
          background: #fff;
          border: 1px solid #e9ecef;
          border-radius: 8px;
          overflow: hidden;
          transition: all 0.3s ease;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }

        .product-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 8px 25px rgba(0,0,0,0.15);
        }

        .product-image {
          position: relative;
          overflow: hidden;
        }

        .product-image img {
          width: 100%;
          height: 250px;
          object-fit: cover;
          transition: transform 0.3s ease;
        }

        .product-card:hover .product-image img {
          transform: scale(1.05);
        }

        .product-badges {
          position: absolute;
          top: 0.5rem;
          left: 0.5rem;
          z-index: 2;
        }

        .badge {
          display: inline-block;
          padding: 0.25rem 0.5rem;
          font-size: 0.75rem;
          font-weight: 600;
          border-radius: 4px;
          margin-right: 0.25rem;
        }

        .badge-featured {
          background-color: var(--success-color);
          color: #ffffff;
        }

        .badge-sale {
          background-color: var(--danger-color);
          color: #ffffff;
        }

        .product-actions {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .product-card:hover .product-actions {
          opacity: 1;
        }

        .btn-add-to-cart {
          width: 100%;
          background: var(--primary-color);
          color: #ffffff;
          border: none;
          padding: 0.5rem 1rem;
          border-radius: 4px;
          font-size: 0.9rem;
          font-weight: 500;
          transition: background-color 0.3s ease;
        }

        .btn-add-to-cart:hover {
          background: var(--primary-hover);
        }

        .product-info {
          padding: 1rem;
        }

        .product-title {
          font-size: 1.1rem;
          font-weight: 600;
          margin-bottom: 0.5rem;
        }

        .product-title a {
          color: var(--secondary-color);
          text-decoration: none;
        }

        .product-title a:hover {
          color: var(--primary-color);
        }

        .product-price {
          margin-bottom: 0.5rem;
        }

        .current-price {
          font-size: 1.2rem;
          font-weight: 600;
          color: var(--primary-color);
        }

        .compare-price {
          font-size: 1rem;
          color: var(--third-color);
          margin-left: 0.5rem;
        }

        .product-rating {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .stars {
          display: flex;
          gap: 0.1rem;
        }

        .rating-count {
          font-size: 0.8rem;
          color: var(--third-color);
        }

        .no-results {
          padding: 2rem;
        }

        .search-actions {
          gap: 1rem;
        }

        .sort-dropdown,
        .sort-order {
          min-width: 120px;
        }

        @media (max-width: 768px) {
          .search-title {
            font-size: 2rem;
          }
          
          .search-actions {
            flex-direction: column;
            align-items: stretch;
          }
          
          .sort-dropdown,
          .sort-order {
            min-width: 100%;
          }
        }
      `}</style>
    </Layout>
  );
}

function LoadingFallback() {
  return (
    <Layout>
      <div className="search-page py-5">
        <div className="container">
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-3">Loading search...</p>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <SearchContent />
    </Suspense>
  );
}

