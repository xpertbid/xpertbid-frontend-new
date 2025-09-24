'use client';

import React, { useEffect, useState } from 'react';
import Layout from '@/components/Layout';
import Image from 'next/image';
import Link from 'next/link';
import { apiService } from '@/services/api';
import { Product } from '@/types';

interface FilterState {
  priceRange: [number, number];
  colors: string[];
  sizes: string[];
  brands: string[];
  productStatus: string[];
  topRated: boolean;
  sortBy: string;
  viewMode: 'grid' | 'list';
}

export default function ShopPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(12);

  const [filters, setFilters] = useState<FilterState>({
    priceRange: [0, 10000],
    colors: [],
    sizes: [],
    brands: [],
    productStatus: [],
    topRated: false,
    sortBy: 'default',
    viewMode: 'grid'
  });

  // Get filter options from actual product data with fallbacks
  const getFilterOptions = () => {
    const allColors = new Set<string>();
    const allBrands = new Set<string>();
    
    products.forEach(product => {
      if (product.business_name) allBrands.add(product.business_name);
      // Also extract potential brands from product names
      if (product.name) {
        const nameWords = product.name.split(' ');
        nameWords.forEach(word => {
          if (word.length > 2) allBrands.add(word);
        });
      }
    });

    // Fallback options if no data is available
    const fallbackColors = ['Black', 'White', 'Red', 'Blue', 'Green', 'Yellow', 'Gray', 'Brown'];
    const fallbackBrands = ['Apple', 'Samsung', 'Sony', 'Nike', 'Adidas', 'Canon', 'Dell', 'HP'];

    return {
      colors: allColors.size > 0 ? Array.from(allColors).slice(0, 8) : fallbackColors,
      sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
      brands: allBrands.size > 0 ? Array.from(allBrands).slice(0, 10) : fallbackBrands,
      productStatuses: ['In Stock', 'On Sale', 'New Arrival', 'Featured']
    };
  };

  const filterOptions = getFilterOptions();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await apiService.getProducts();
        
        if (response.success) {
          setProducts(response.data);
          setFilteredProducts(response.data);
        } else {
          setError('Failed to fetch products');
        }
      } catch (err) {
        console.error('Error fetching products:', err);
        setError('Failed to fetch products');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Filter products based on current filters
  useEffect(() => {
    let filtered = [...products];

    // Filter by price range
    filtered = filtered.filter(product => {
      const price = parseFloat(product.price?.toString() || '0');
      return price >= filters.priceRange[0] && price <= filters.priceRange[1];
    });

    // Color filtering removed since Product interface doesn't have color field

    // Filter by brands
    if (filters.brands.length > 0) {
      filtered = filtered.filter(product => 
        filters.brands.some(brand => 
          product.business_name?.toLowerCase().includes(brand.toLowerCase()) ||
          product.name?.toLowerCase().includes(brand.toLowerCase())
        )
      );
    }

    // Filter by product status
    if (filters.productStatus.includes('In Stock')) {
      filtered = filtered.filter(product => (product.stock_quantity || 0) > 0);
    }
    if (filters.productStatus.includes('On Sale')) {
      filtered = filtered.filter(product => product.sale_price);
    }
    if (filters.productStatus.includes('New Arrival')) {
      filtered = filtered.filter(product => product.is_featured);
    }
    if (filters.productStatus.includes('Featured')) {
      filtered = filtered.filter(product => product.is_featured);
    }

    // Filter top rated (mock - assuming products with rating > 4)
    if (filters.topRated) {
      filtered = filtered.filter(product => Math.random() > 0.3); // Mock top rated
    }

    // Sort products
    switch (filters.sortBy) {
      case 'price-low':
        filtered.sort((a, b) => parseFloat(a.price?.toString() || '0') - parseFloat(b.price?.toString() || '0'));
        break;
      case 'price-high':
        filtered.sort((a, b) => parseFloat(b.price?.toString() || '0') - parseFloat(a.price?.toString() || '0'));
        break;
      case 'name':
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'newest':
        filtered.sort((a, b) => new Date(b.created_at || '').getTime() - new Date(a.created_at || '').getTime());
        break;
      default:
        break;
    }

    setFilteredProducts(filtered);
    setCurrentPage(1); // Reset to first page when filters change
  }, [products, filters]);

  const handleFilterChange = (filterType: keyof FilterState, value: string | boolean | number[] | string[]) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  const handleColorToggle = (color: string) => {
    setFilters(prev => ({
      ...prev,
      colors: prev.colors.includes(color)
        ? prev.colors.filter(c => c !== color)
        : [...prev.colors, color]
    }));
  };

  const handleBrandToggle = (brand: string) => {
    setFilters(prev => ({
      ...prev,
      brands: prev.brands.includes(brand)
        ? prev.brands.filter(b => b !== brand)
        : [...prev.brands, brand]
    }));
  };

  const handleStatusToggle = (status: string) => {
    setFilters(prev => ({
      ...prev,
      productStatus: prev.productStatus.includes(status)
        ? prev.productStatus.filter(s => s !== status)
        : [...prev.productStatus, status]
    }));
  };

  const clearFilters = () => {
    setFilters({
      priceRange: [0, 10000],
      colors: [],
      sizes: [],
      brands: [],
      productStatus: [],
      topRated: false,
      sortBy: 'default',
      viewMode: 'grid'
    });
  };

  // Pagination
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  const paginate = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const getProductImage = (product: Product) => {
    let imageUrl = 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400&h=400&fit=crop';
    
    try {
      if (product.gallery) {
        if (typeof product.gallery === 'string') {
          const galleryArray = JSON.parse(product.gallery);
          if (Array.isArray(galleryArray) && galleryArray.length > 0 && galleryArray[0]) {
            imageUrl = galleryArray[0];
          }
        } else if (Array.isArray(product.gallery) && product.gallery.length > 0 && product.gallery[0]) {
          imageUrl = product.gallery[0];
        }
      }
    } catch (error) {
      console.warn('Error parsing product gallery:', error);
    }
    
    return imageUrl;
  };

  if (loading) {
    return (
      <Layout>
        <div className="container py-5 text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3">Loading products...</p>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="container py-5 text-center">
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="shop-page py-5">
        <div className="container">
          {/* Breadcrumb */}
          <nav aria-label="breadcrumb" className="mb-4">
            <ol className="breadcrumb">
              <li className="breadcrumb-item"><Link href="/">Home</Link></li>
              <li className="breadcrumb-item active" aria-current="page">Shop</li>
            </ol>
          </nav>

          {/* Page Header */}
          <div className="row mb-4">
            <div className="col-12">
              <div className="page-header d-flex justify-content-between align-items-center">
                <div>
                  <h1 className="page-title">Shop</h1>
                  <p className="page-subtitle">
                    Showing {indexOfFirstProduct + 1}-{Math.min(indexOfLastProduct, filteredProducts.length)} of {filteredProducts.length} products
                  </p>
                </div>
                <div className="shop-controls d-flex align-items-center gap-3">
                  <div className="sort-controls">
                    <select 
                      className="form-select" 
                      value={filters.sortBy}
                      onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                    >
                      <option value="default">Default sorting</option>
                      <option value="price-low">Sort by price: low to high</option>
                      <option value="price-high">Sort by price: high to low</option>
                      <option value="name">Sort by name</option>
                      <option value="newest">Sort by newest</option>
                    </select>
                  </div>
                  <div className="view-mode">
                    <button 
                      className={`btn btn-outline-secondary ${filters.viewMode === 'grid' ? 'active' : ''}`}
                      onClick={() => handleFilterChange('viewMode', 'grid')}
                    >
                      <i className="fas fa-th"></i>
                    </button>
                    <button 
                      className={`btn btn-outline-secondary ${filters.viewMode === 'list' ? 'active' : ''}`}
                      onClick={() => handleFilterChange('viewMode', 'list')}
                    >
                      <i className="fas fa-list"></i>
                    </button>
                  </div>
                  <button 
                    className="btn btn-primary d-lg-none"
                    onClick={() => setShowFilters(!showFilters)}
                  >
                    <i className="fas fa-filter me-2"></i>Filters
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="row">
            {/* Sidebar Filters */}
            <div className={`col-lg-3 ${showFilters ? 'd-block' : 'd-none d-lg-block'}`}>
              <div className="shop-sidebar">
                <div className="sidebar-header d-flex justify-content-between align-items-center mb-3">
                  <h5>Filters</h5>
                  <button className="btn btn-sm btn-outline-secondary" onClick={clearFilters}>
                    Clear All
                  </button>
                </div>

                {/* Price Range Filter */}
                <div className="filter-section mb-4">
                  <h6 className="filter-title">Price Range</h6>
                  <div className="price-range">
                    <input
                      type="range"
                      className="form-range"
                      min="0"
                      max="10000"
                      step="100"
                      value={filters.priceRange[1]}
                      onChange={(e) => handleFilterChange('priceRange', [filters.priceRange[0], parseInt(e.target.value)])}
                    />
                    <div className="price-values d-flex justify-content-between">
                      <span>${filters.priceRange[0]}</span>
                      <span>${filters.priceRange[1]}</span>
                    </div>
                  </div>
                </div>

                {/* Color Filter */}
                <div className="filter-section mb-4">
                  <h6 className="filter-title">Color</h6>
                  <div className="color-options">
                    {filterOptions.colors.map(color => (
                      <label key={color} className="color-option">
                        <input
                          type="checkbox"
                          checked={filters.colors.includes(color)}
                          onChange={() => handleColorToggle(color)}
                        />
                        <span className="color-name">{color}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Size Filter */}
                <div className="filter-section mb-4">
                  <h6 className="filter-title">Size</h6>
                  <div className="size-options">
                    {filterOptions.sizes.map(size => (
                      <button
                        key={size}
                        className={`btn btn-outline-secondary btn-sm ${filters.sizes.includes(size) ? 'active' : ''}`}
                        onClick={() => handleFilterChange('sizes', 
                          filters.sizes.includes(size)
                            ? filters.sizes.filter(s => s !== size)
                            : [...filters.sizes, size]
                        )}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Brand Filter */}
                <div className="filter-section mb-4">
                  <h6 className="filter-title">Brand</h6>
                  <div className="brand-options">
                    {filterOptions.brands.map(brand => (
                      <label key={brand} className="brand-option">
                        <input
                          type="checkbox"
                          checked={filters.brands.includes(brand)}
                          onChange={() => handleBrandToggle(brand)}
                        />
                        <span className="brand-name">{brand}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Product Status Filter */}
                <div className="filter-section mb-4">
                  <h6 className="filter-title">Product Status</h6>
                  <div className="status-options">
                    {filterOptions.productStatuses.map(status => (
                      <label key={status} className="status-option">
                        <input
                          type="checkbox"
                          checked={filters.productStatus.includes(status)}
                          onChange={() => handleStatusToggle(status)}
                        />
                        <span className="status-name">{status}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Top Rated Filter */}
                <div className="filter-section mb-4">
                  <label className="top-rated-option">
                    <input
                      type="checkbox"
                      checked={filters.topRated}
                      onChange={(e) => handleFilterChange('topRated', e.target.checked)}
                    />
                    <span className="top-rated-name">Top Rated Products</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Products Grid */}
            <div className="col-lg-9">
              <div className={`products-grid ${filters.viewMode === 'list' ? 'list-view' : 'grid-view'}`}>
                <div className="row g-4">
                  {currentProducts.map((product) => (
                    <div key={product.id} className={filters.viewMode === 'list' ? 'col-12' : 'col-lg-4 col-md-6 col-sm-6 col-12'}>
                      <div className="product-card">
                        <div className="product-image-wrapper">
                          <Link href={`/shop/${product.slug}`}>
                            <div className="product-image">
                              <Image
                                src={getProductImage(product)}
                                alt={product.name}
                                width={filters.viewMode === 'list' ? 200 : 300}
                                height={filters.viewMode === 'list' ? 200 : 300}
                                className="img-fluid"
                              />
                            </div>
                          </Link>
                          
                          {/* Product Badges */}
                          <div className="product-badges">
                            {product.is_featured && (
                              <span className="badge badge-featured">Featured</span>
                            )}
                            {product.sale_price && (
                              <span className="badge badge-sale">Sale</span>
                            )}
                          </div>
                        </div>

                        <div className="product-info">
                          <h4 className="product-title">
                            <Link href={`/shop/${product.slug}`}>{product.name}</Link>
                          </h4>
                          
                          <div className="product-price">
                            <span className="current-price">${parseFloat(product.price?.toString() || '0').toLocaleString()}</span>
                            {product.sale_price && (
                              <span className="compare-price">
                                <del>${parseFloat(product.sale_price.toString()).toLocaleString()}</del>
                              </span>
                            )}
                          </div>

                          {/* Rating */}
                          <div className="product-rating">
                            <div className="stars">
                              {[...Array(5)].map((_, i) => (
                                <i
                                  key={i}
                                  className={`fas fa-star ${i < 4 ? 'text-warning' : 'text-muted'}`}
                                />
                              ))}
                            </div>
                            <span className="reviews-count">(4.5)</span>
                          </div>

                          {/* Stock Status */}
                          <div className="product-stock">
                            <span className={`badge ${(product.stock_quantity || 0) > 0 ? 'bg-success' : 'bg-danger'}`}>
                              {(product.stock_quantity || 0) > 0 ? 'In Stock' : 'Out of Stock'}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="pagination-wrapper mt-5">
                    <nav aria-label="Products pagination">
                      <ul className="pagination justify-content-center">
                        <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                          <button 
                            className="page-link" 
                            onClick={() => paginate(currentPage - 1)}
                            disabled={currentPage === 1}
                          >
                            <i className="fas fa-chevron-left"></i>
                          </button>
                        </li>
                        
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                          <li key={page} className={`page-item ${currentPage === page ? 'active' : ''}`}>
                            <button 
                              className="page-link" 
                              onClick={() => paginate(page)}
                            >
                              {page}
                            </button>
                          </li>
                        ))}
                        
                        <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                          <button 
                            className="page-link" 
                            onClick={() => paginate(currentPage + 1)}
                            disabled={currentPage === totalPages}
                          >
                            <i className="fas fa-chevron-right"></i>
                          </button>
                        </li>
                      </ul>
                    </nav>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .page-title {
          font-family: var(--font-family-heading);
          font-size: 2.5rem;
          font-weight: 700;
          color: var(--secondary-color);
          margin-bottom: 0.5rem;
        }

        .page-subtitle {
          font-size: 1rem;
          color: var(--gray-600);
          margin-bottom: 0;
        }

        .shop-controls {
          flex-wrap: wrap;
        }

        .sort-controls .form-select {
          min-width: 200px;
        }

        .view-mode .btn {
          padding: 8px 12px;
        }

        .view-mode .btn.active {
          background-color: var(--primary-color);
          border-color: var(--primary-color);
          color: white;
        }

        .shop-sidebar {
          background: white;
          padding: 20px;
          border-radius: var(--border-radius-lg);
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
          position: sticky;
          top: 20px;
        }

        .sidebar-header h5 {
          font-family: var(--font-family-heading);
          font-weight: 600;
          color: var(--secondary-color);
          margin: 0;
        }

        .filter-section {
          border-bottom: 1px solid #e9ecef;
          padding-bottom: 20px;
        }

        .filter-section:last-child {
          border-bottom: none;
          padding-bottom: 0;
        }

        .filter-title {
          font-family: var(--font-family-heading);
          font-weight: 600;
          color: var(--secondary-color);
          margin-bottom: 15px;
          font-size: 14px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .price-range {
          margin-top: 15px;
        }

        .price-values {
          font-size: 12px;
          color: var(--gray-600);
          margin-top: 10px;
        }

        .color-options, .brand-options, .status-options {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .color-option, .brand-option, .status-option, .top-rated-option {
          display: flex;
          align-items: center;
          cursor: pointer;
          font-size: 14px;
        }

        .color-option input, .brand-option input, .status-option input, .top-rated-option input {
          margin-right: 8px;
          accent-color: var(--primary-color);
        }

        .color-name, .brand-name, .status-name, .top-rated-name {
          color: var(--gray-700);
        }

        .size-options {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }

        .size-options .btn {
          min-width: 40px;
          padding: 6px 12px;
        }

        .size-options .btn.active {
          background-color: var(--primary-color);
          border-color: var(--primary-color);
          color: white;
        }

        .products-grid.list-view .product-card {
          display: flex;
          align-items: center;
          padding: 20px;
        }

        .products-grid.list-view .product-image-wrapper {
          flex: 0 0 200px;
          margin-right: 20px;
        }

        .products-grid.list-view .product-info {
          flex: 1;
          padding: 0;
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

        .products-grid.list-view .product-image {
          padding-top: 0;
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

        .badge-featured {
          background: var(--primary-color);
          color: white;
        }

        .badge-sale {
          background: var(--danger-color);
          color: white;
        }

        .product-info {
          padding: 20px;
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
          margin-bottom: 10px;
        }

        .product-price .current-price {
          font-family: var(--font-family-heading);
          font-size: 16px;
          font-weight: 700;
          color: var(--secondary-color);
        }

        .product-price .compare-price {
          font-family: var(--font-family-heading);
          font-size: 14px;
          font-weight: 500;
          color: var(--gray-600);
          text-decoration: line-through;
        }

        .product-rating {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 10px;
        }

        .product-rating .stars {
          display: flex;
          gap: 2px;
        }

        .product-rating .stars i {
          font-size: 12px;
        }

        .product-rating .reviews-count {
          font-size: 12px;
          color: var(--gray-600);
        }

        .product-stock .badge {
          font-size: 10px;
          padding: 3px 6px;
        }

        .pagination-wrapper {
          margin-top: 40px;
        }

        .pagination .page-link {
          color: var(--primary-color);
          border-color: #dee2e6;
          padding: 8px 12px;
        }

        .pagination .page-item.active .page-link {
          background-color: var(--primary-color);
          border-color: var(--primary-color);
        }

        .pagination .page-link:hover {
          color: var(--primary-hover);
          background-color: #f8f9fa;
        }

        .pagination .page-item.disabled .page-link {
          color: #6c757d;
          background-color: #fff;
          border-color: #dee2e6;
        }

        @media (max-width: 991.98px) {
          .shop-sidebar {
            position: static;
            margin-bottom: 30px;
          }
          
          .page-header {
            flex-direction: column;
            align-items: flex-start !important;
            gap: 20px;
          }
          
          .shop-controls {
            width: 100%;
            justify-content: space-between;
          }
        }
      `}</style>
    </Layout>
  );
}