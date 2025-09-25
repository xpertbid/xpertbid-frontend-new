'use client';

import React, { useEffect, useState } from 'react';
import Layout from '@/components/Layout';
import Image from 'next/image';
import Link from 'next/link';
import { apiService } from '@/services/api';
import { useCurrency } from '@/contexts/CurrencyLanguageContext';
import PriceDisplay from '@/components/PriceDisplay';



export default function ShopPage() {
  const { formatPrice } = useCurrency();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(12);

  const [filters, setFilters] = useState({
    priceRange: [0, 10000],
    colors: [],
    sizes: [],
    brands: [],
    productStatus: [],
    categories: [],
    topRated: false,
    sortBy: 'default',
    viewMode: 'grid'
  });

  // Get filter options from actual product data with fallbacks
  const getFilterOptions = () => {
    const allColors = new Set();
    const allBrands = new Set();
    
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
        
        if (response.success && response.data) {
          setProducts(response.data);
          setFilteredProducts(response.data);
        } else {
          // Fallback to mock data if API fails
          console.warn('API failed, using mock data:', response.error);
          const mockProducts = [
            {
              id: 1,
              name: 'Modern Wooden Dining Table',
              slug: 'modern-wooden-dining-table',
              price: 899.99,
              sale_price: 799.99,
              sku: 'PROD-TABLE-001',
              stock_quantity: 15,
              weight: '45 lbs',
              dimensions: '72 x 36 x 30 inches',
              description: 'Beautiful modern dining table made from premium oak wood.',
              category: 'Furniture',
              is_featured: true,
              is_new: false,
              rating: 4.8,
              reviews_count: 124,
              images: ['https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=400&fit=crop'],
              brand: 'WoodCraft',
              color: 'Oak',
              material: 'Solid Oak Wood'
            },
            {
              id: 2,
              name: 'Comfortable Sectional Sofa',
              slug: 'comfortable-sectional-sofa',
              price: 1299.99,
              sale_price: null,
              sku: 'PROD-SOFA-002',
              stock_quantity: 8,
              weight: '120 lbs',
              dimensions: '120 x 80 x 36 inches',
              description: 'Luxurious sectional sofa perfect for large living rooms.',
              category: 'Furniture',
              is_featured: true,
              is_new: true,
              rating: 4.9,
              reviews_count: 89,
              images: ['https://images.unsplash.com/photo-1555041469-a586c61ea4bc?w=400&h=400&fit=crop'],
              brand: 'ComfortPlus',
              color: 'Gray',
              material: 'Premium Fabric'
            },
            {
              id: 3,
              name: 'Elegant Bedroom Set',
              slug: 'elegant-bedroom-set',
              price: 1599.99,
              sale_price: 1399.99,
              sku: 'PROD-BEDROOM-003',
              stock_quantity: 5,
              weight: '200 lbs',
              dimensions: '80 x 60 x 40 inches',
              description: 'Complete bedroom set including bed, dresser, and nightstands.',
              category: 'Furniture',
              is_featured: false,
              is_new: true,
              rating: 4.7,
              reviews_count: 67,
              images: ['https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=400&fit=crop'],
              brand: 'ElegantHome',
              color: 'White',
              material: 'Engineered Wood'
            },
            {
              id: 4,
              name: 'Modern Office Chair',
              slug: 'modern-office-chair',
              price: 299.99,
              sale_price: 249.99,
              sku: 'PROD-CHAIR-004',
              stock_quantity: 25,
              weight: '35 lbs',
              dimensions: '26 x 26 x 42 inches',
              description: 'Ergonomic office chair with lumbar support and adjustable height.',
              category: 'Office',
              is_featured: false,
              is_new: false,
              rating: 4.6,
              reviews_count: 45,
              images: ['https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&h=400&fit=crop'],
              brand: 'ErgoPro',
              color: 'Black',
              material: 'Mesh & Plastic'
            },
            {
              id: 5,
              name: 'Kitchen Storage Cabinet',
              slug: 'kitchen-storage-cabinet',
              price: 599.99,
              sale_price: null,
              sku: 'PROD-CABINET-005',
              stock_quantity: 12,
              weight: '80 lbs',
              dimensions: '36 x 18 x 72 inches',
              description: 'Spacious kitchen cabinet with multiple shelves and drawers.',
              category: 'Kitchen',
              is_featured: true,
              is_new: false,
              rating: 4.5,
              reviews_count: 32,
              images: ['https://images.unsplash.com/photo-1555041469-a586c61ea4bc?w=400&h=400&fit=crop'],
              brand: 'KitchenPro',
              color: 'White',
              material: 'MDF with Laminate'
            },
            {
              id: 6,
              name: 'Outdoor Patio Set',
              slug: 'outdoor-patio-set',
              price: 799.99,
              sale_price: 699.99,
              sku: 'PROD-PATIO-006',
              stock_quantity: 7,
              weight: '150 lbs',
              dimensions: '60 x 60 x 30 inches',
              description: 'Weather-resistant patio set perfect for outdoor dining.',
              category: 'Outdoor',
              is_featured: false,
              is_new: true,
              rating: 4.7,
              reviews_count: 28,
              images: ['https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=400&fit=crop'],
              brand: 'OutdoorLiving',
              color: 'Brown',
              material: 'Teak Wood'
            },
            {
              id: 7,
              name: 'Smart Home Security Camera',
              slug: 'smart-home-security-camera',
              price: 199.99,
              sale_price: 149.99,
              sku: 'PROD-CAMERA-007',
              stock_quantity: 30,
              weight: '1.5 lbs',
              dimensions: '4 x 4 x 6 inches',
              description: 'WiFi-enabled security camera with night vision and mobile app.',
              category: 'Electronics',
              is_featured: true,
              is_new: true,
              rating: 4.8,
              reviews_count: 156,
              images: ['https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=400&fit=crop'],
              brand: 'SecureHome',
              color: 'White',
              material: 'Plastic & Metal'
            },
            {
              id: 8,
              name: 'Nike Air Max 270',
              slug: 'nike-air-max-270',
              price: 150.00,
              sale_price: 120.00,
              sku: 'PROD-SHOES-008',
              stock_quantity: 50,
              weight: '1.2 lbs',
              dimensions: '12 x 8 x 4 inches',
              description: 'Comfortable running shoes with Air Max technology.',
              category: 'Shoes',
              is_featured: false,
              is_new: false,
              rating: 4.6,
              reviews_count: 89,
              images: ['https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop'],
              brand: 'Nike',
              color: 'Black/White',
              material: 'Mesh & Rubber'
            }
          ];
          
          setProducts(mockProducts);
          setFilteredProducts(mockProducts);
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

    // Color filtering removed since Product 

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

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  const handleColorToggle = (color) => {
    setFilters(prev => ({
      ...prev,
      colors: prev.colors.includes(color)
        ? prev.colors.filter(c => c !== color)
        : [...prev.colors, color]
    }));
  };

  const handleBrandToggle = (brand) => {
    setFilters(prev => ({
      ...prev,
      brands: prev.brands.includes(brand)
        ? prev.brands.filter(b => b !== brand)
        : [...prev.brands, brand]
    }));
  };

  const handleStatusToggle = (status) => {
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
      categories: [],
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

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top, behavior: 'smooth' });
  };

  const getProductImage = (product) => {
    let imageUrl = 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400&h=400&fit=crop';
    
    try {
      // First try featured_image
      if (product.featured_image) {
        imageUrl = product.featured_image;
      }
      // Then try thumbnail_image
      else if (product.thumbnail_image) {
        imageUrl = product.thumbnail_image;
      }
      // Finally try images array
      else if (product.images) {
        if (typeof product.images === 'string') {
          const imagesArray = JSON.parse(product.images);
          if (Array.isArray(imagesArray) && imagesArray.length > 0 && imagesArray[0]) {
            imageUrl = imagesArray[0];
          }
        } else if (Array.isArray(product.images) && product.images.length > 0 && product.images[0]) {
          imageUrl = product.images[0];
        }
      }
    } catch (error) {
      console.warn('Error parsing product images:', error);
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
                      <i className="f-th"></i>
                    </button>
                    <button 
                      className={`btn btn-outline-secondary ${filters.viewMode === 'list' ? 'active' : ''}`}
                      onClick={() => handleFilterChange('viewMode', 'list')}
                    >
                      <i className="f-list"></i>
                    </button>
                  </div>
                  <button 
                    className="btn btn-primary d-lg-none"
                    onClick={() => setShowFilters(!showFilters)}
                  >
                    <i className="f-filter me-2"></i>Filters
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
                      <span>{formatPrice(filters.priceRange[0])}</span>
                      <span>{formatPrice(filters.priceRange[1])}</span>
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
                                <span className="spec-value">{product.stock_quantity || 0}</span>
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
                            {product.is_featured && <span className="badge badge-featured">
                              <i className="fas fa-crown"></i>
                              Featured
                            </span>}
                            {product.sale_price && <span className="badge badge-sale">
                              <i className="fas fa-percentage"></i>
                              Sale
                            </span>}
                            {product.is_new && <span className="badge badge-new">
                              <i className="fas fa-star"></i>
                              New
                            </span>}
                            {product.category && <span className="badge badge-category">
                              <i className="fas fa-tag"></i>
                              {product.category}
                            </span>}
                          </div>
                          
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
                                  className={`fas fa-star ${i < 4 ? 'text-warning' : 'text-muted'}`}
                                />
                              ))}
                            </div>
                            <span className="reviews-count">(4.5)</span>
                          </div>

                          {/* Stock Status */}
                          <div className="product-stock">
                            <span className={`badge ${(product.stock_quantity || 0) > 0 ? 'bg-success' : 'bg-danger'}`}>
                              <i className={`fas ${(product.stock_quantity || 0) > 0 ? 'fa-check-circle' : 'fa-times-circle'}`}></i>
                              {(product.stock_quantity || 0) > 0 ? 'In Stock' : 'Out of Stock'}
                            </span>
                          </div>

                          {/* Action Buttons */}
                          <div className="product-actions">
                            <button className="btn btn-primary btn-sm">
                              <i className="fas fa-shopping-cart"></i>
                              Add to Cart
                            </button>
                            <button className="btn btn-outline-secondary btn-sm">
                              <i className="fas fa-heart"></i>
                              Wishlist
                            </button>
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
                            <i className="f-chevron-left"></i>
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
                            <i className="f-chevron-right"></i>
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
          padding: 24px;
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
          margin-bottom: 12px;
          font-size: 14px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .price-range {
          margin-top: 12px;
        }

        .price-values {
          font-size: 12px;
          color: var(--gray-600);
          margin-top: 8px;
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
          padding: 8px 12px;
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
          height: auto;
          flex-direction: row;
        }

        .products-grid.list-view .product-image-wrapper {
          flex: 0 0 200px;
          margin-right: 20px;
          height: 150px;
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
          top: 12px;
          left: 12px;
          z-index: 2;
        }

        .badge {
          display: inline-block;
          padding: 4px 8px;
          font-size: 10px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          border-radius: var(--border-radius-sm);
          margin-right: 4px;
          margin-bottom: 4px;
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
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }

        .product-title {
          margin-bottom: 12px;
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
          gap: 8px;
          margin-bottom: 12px;
        }

        .product-price .current-price {
          font-family: var(--font-family-heading);
          font-size: 18px;
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
          margin-bottom: 12px;
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
          padding: 4px 8px;
        }

        .product-specs {
          margin-bottom: 12px;
        }

        .spec-row {
          display: flex;
          justify-content: space-between;
          margin-bottom: 6px;
        }

        .spec-item {
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: 12px;
          color: var(--gray-600);
        }

        .spec-item i {
          font-size: 10px;
          color: var(--primary-color);
        }

        .spec-label {
          font-weight: 500;
        }

        .spec-value {
          font-weight: 600;
          color: var(--secondary-color);
        }

        .product-status-badges {
          display: flex;
          flex-wrap: wrap;
          gap: 4px;
          margin-bottom: 12px;
        }

        .product-status-badges .badge {
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: 9px;
          padding: 3px 6px;
        }

        .badge-new {
          background: var(--success-color);
          color: white;
        }

        .badge-category {
          background: var(--info-color);
          color: white;
        }

        .product-actions {
          display: flex;
          gap: 8px;
          margin-top: 12px;
        }

        .product-actions .btn {
          flex: 1;
          font-size: 12px;
          padding: 6px 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 4px;
        }

        .product-actions .btn i {
          font-size: 10px;
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
            margin-bottom: 20px;
          }
          
          .page-header {
            flex-direction: column;
            align-items: flex-start !important;
            gap: 15px;
          }
          
          .shop-controls {
            width: 100%;
            justify-content: space-between;
          }

          .product-specs {
            margin-bottom: 8px;
          }

          .spec-row {
            flex-direction: column;
            gap: 4px;
            margin-bottom: 8px;
          }

          .spec-item {
            font-size: 11px;
          }

          .product-status-badges {
            margin-bottom: 8px;
          }

          .product-status-badges .badge {
            font-size: 8px;
            padding: 2px 4px;
          }

          .product-actions {
            flex-direction: column;
            gap: 6px;
            margin-top: 8px;
          }

          .product-actions .btn {
            font-size: 11px;
            padding: 8px 12px;
          }
        }
      `}</style>
    </Layout>
  );
}
