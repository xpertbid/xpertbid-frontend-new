'use client';

import React, { useState } from 'react';

const SidebarFilters: React.FC = () => {
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedRatings, setSelectedRatings] = useState<number[]>([]);

  const categories = [
    { id: 'electronics', name: 'Electronics', count: 1250 },
    { id: 'fashion', name: 'Fashion', count: 890 },
    { id: 'home-garden', name: 'Home & Garden', count: 650 },
    { id: 'sports', name: 'Sports', count: 420 },
    { id: 'books', name: 'Books', count: 780 },
    { id: 'automotive', name: 'Automotive', count: 320 }
  ];

  const brands = [
    { id: 'apple', name: 'Apple', count: 45 },
    { id: 'samsung', name: 'Samsung', count: 32 },
    { id: 'sony', name: 'Sony', count: 28 },
    { id: 'nike', name: 'Nike', count: 156 },
    { id: 'adidas', name: 'Adidas', count: 142 },
    { id: 'canon', name: 'Canon', count: 67 }
  ];

  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategories(prev => 
      prev.includes(categoryId) 
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const handleBrandChange = (brandId: string) => {
    setSelectedBrands(prev => 
      prev.includes(brandId) 
        ? prev.filter(id => id !== brandId)
        : [...prev, brandId]
    );
  };

  const handleRatingChange = (rating: number) => {
    setSelectedRatings(prev => 
      prev.includes(rating) 
        ? prev.filter(r => r !== rating)
        : [...prev, rating]
    );
  };

  const clearAllFilters = () => {
    setPriceRange([0, 1000]);
    setSelectedCategories([]);
    setSelectedBrands([]);
    setSelectedRatings([]);
  };

  return (
    <div className="sidebar-filters">
      <div className="filter-section">
        <div className="filter-header d-flex justify-content-between align-items-center mb-3">
          <h5 className="filter-title mb-0">Filters</h5>
          <button 
            className="btn btn-link btn-sm p-0 text-primary"
            onClick={clearAllFilters}
          >
            Clear All
          </button>
        </div>

        {/* Price Range */}
        <div className="filter-group mb-4">
          <h6 className="filter-group-title">Price Range</h6>
          <div className="price-range">
            <div className="d-flex justify-content-between mb-2">
              <span className="price-label">${priceRange[0]}</span>
              <span className="price-label">${priceRange[1]}</span>
            </div>
            <input
              type="range"
              className="form-range"
              min="0"
              max="1000"
              step="10"
              value={priceRange[0]}
              onChange={(e) => setPriceRange([parseInt(e.target.value), priceRange[1]])}
            />
            <input
              type="range"
              className="form-range"
              min="0"
              max="1000"
              step="10"
              value={priceRange[1]}
              onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
            />
          </div>
        </div>

        {/* Categories */}
        <div className="filter-group mb-4">
          <h6 className="filter-group-title">Categories</h6>
          <div className="filter-options">
            {categories.map((category) => (
              <div key={category.id} className="form-check">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id={`category-${category.id}`}
                  checked={selectedCategories.includes(category.id)}
                  onChange={() => handleCategoryChange(category.id)}
                />
                <label className="form-check-label d-flex justify-content-between w-100" htmlFor={`category-${category.id}`}>
                  <span>{category.name}</span>
                  <span className="text-muted">({category.count})</span>
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Brands */}
        <div className="filter-group mb-4">
          <h6 className="filter-group-title">Brands</h6>
          <div className="filter-options">
            {brands.map((brand) => (
              <div key={brand.id} className="form-check">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id={`brand-${brand.id}`}
                  checked={selectedBrands.includes(brand.id)}
                  onChange={() => handleBrandChange(brand.id)}
                />
                <label className="form-check-label d-flex justify-content-between w-100" htmlFor={`brand-${brand.id}`}>
                  <span>{brand.name}</span>
                  <span className="text-muted">({brand.count})</span>
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Rating */}
        <div className="filter-group mb-4">
          <h6 className="filter-group-title">Customer Rating</h6>
          <div className="filter-options">
            {[5, 4, 3, 2, 1].map((rating) => (
              <div key={rating} className="form-check">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id={`rating-${rating}`}
                  checked={selectedRatings.includes(rating)}
                  onChange={() => handleRatingChange(rating)}
                />
                <label className="form-check-label d-flex align-items-center" htmlFor={`rating-${rating}`}>
                  <div className="stars me-2">
                    {[...Array(5)].map((_, index) => (
                      <i 
                        key={index} 
                        className={`fa-star ${index < rating ? 'fas' : 'far'}`}
                        style={{ color: index < rating ? '#ffc107' : '#ddd' }}
                      />
                    ))}
                  </div>
                  <span>& Up</span>
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Availability */}
        <div className="filter-group mb-4">
          <h6 className="filter-group-title">Availability</h6>
          <div className="filter-options">
            <div className="form-check">
              <input className="form-check-input" type="checkbox" id="in-stock" />
              <label className="form-check-label" htmlFor="in-stock">
                In Stock
              </label>
            </div>
            <div className="form-check">
              <input className="form-check-input" type="checkbox" id="on-sale" />
              <label className="form-check-label" htmlFor="on-sale">
                On Sale
              </label>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .sidebar-filters {
          background: white;
          padding: 1.5rem;
          box-shadow: var(--shadow-sm);
          border-radius: 0;
          position: sticky;
          top: 100px;
        }

        .filter-title {
          font-size: 1.1rem;
          font-weight: 600;
          color: var(--secondary-color);
        }

        .filter-group-title {
          font-size: 0.95rem;
          font-weight: 600;
          color: var(--secondary-color);
          margin-bottom: 1rem;
        }

        .filter-options {
          max-height: 200px;
          overflow-y: auto;
        }

        .filter-options .form-check {
          margin-bottom: 0.75rem;
        }

        .filter-options .form-check-input {
          margin-top: 0.125rem;
        }

        .filter-options .form-check-label {
          font-size: 0.9rem;
          color: var(--gray-700);
          cursor: pointer;
        }

        .price-range {
          padding: 0.5rem 0;
        }

        .price-label {
          font-size: 0.85rem;
          color: var(--gray-600);
          font-weight: 500;
        }

        .form-range {
          height: 6px;
        }

        .form-range::-webkit-slider-thumb {
          background: var(--primary-color);
          border: none;
          width: 18px;
          height: 18px;
        }

        .form-range::-moz-range-thumb {
          background: var(--primary-color);
          border: none;
          width: 18px;
          height: 18px;
          border-radius: 50%;
        }

        .stars {
          font-size: 0.8rem;
        }

        @media (max-width: 991px) {
          .sidebar-filters {
            position: static;
            margin-bottom: 2rem;
          }
        }
      `}</style>
    </div>
  );
};

export default SidebarFilters;
