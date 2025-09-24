'use client';

import React, { useState } from 'react';

const ShopHeader: React.FC = () => {
  const [sortBy, setSortBy] = useState('featured');
  const [viewMode, setViewMode] = useState('grid');

  const sortOptions = [
    { value: 'featured', label: 'Featured' },
    { value: 'newest', label: 'Newest' },
    { value: 'price-low', label: 'Price: Low to High' },
    { value: 'price-high', label: 'Price: High to Low' },
    { value: 'rating', label: 'Customer Rating' },
    { value: 'popularity', label: 'Popularity' }
  ];

  return (
    <div className="shop-header bg-light py-4">
      <div className="container">
        <div className="row align-items-center">
          <div className="col-md-6">
            <div className="breadcrumb-nav">
              <nav aria-label="breadcrumb">
                <ol className="breadcrumb mb-0">
                  <li className="breadcrumb-item"><a href="/">Home</a></li>
                  <li className="breadcrumb-item active">Shop</li>
                </ol>
              </nav>
            </div>
          </div>
          
          <div className="col-md-6">
            <div className="shop-controls d-flex justify-content-md-end align-items-center gap-3">
              {/* View Mode Toggle */}
              <div className="view-mode-toggle">
                <button 
                  className={`btn btn-sm ${viewMode === 'grid' ? 'btn-primary' : 'btn-outline-secondary'}`}
                  onClick={() => setViewMode('grid')}
                  title="Grid View"
                >
                  <i className="fas fa-th"></i>
                </button>
                <button 
                  className={`btn btn-sm ${viewMode === 'list' ? 'btn-primary' : 'btn-outline-secondary'}`}
                  onClick={() => setViewMode('list')}
                  title="List View"
                >
                  <i className="fas fa-list"></i>
                </button>
              </div>

              {/* Sort Dropdown */}
              <div className="sort-dropdown">
                <select 
                  className="form-select form-select-sm" 
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  {sortOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Results Count */}
              <div className="results-count text-muted">
                <small>Showing 1-12 of 156 products</small>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .shop-header {
          border-bottom: 1px solid var(--gray-200);
        }

        .breadcrumb {
          background: none;
          padding: 0;
        }

        .breadcrumb-item a {
          color: var(--gray-600);
          text-decoration: none;
        }

        .breadcrumb-item a:hover {
          color: var(--primary-color);
        }

        .breadcrumb-item.active {
          color: var(--secondary-color);
        }

        .view-mode-toggle {
          display: flex;
          gap: 2px;
        }

        .view-mode-toggle .btn {
          padding: 6px 10px;
          border-radius: 0;
        }

        .sort-dropdown select {
          min-width: 150px;
          border-radius: 0;
        }

        .shop-controls {
          flex-wrap: wrap;
          gap: 1rem;
        }

        @media (max-width: 768px) {
          .shop-controls {
            justify-content: flex-start !important;
            margin-top: 1rem;
          }
          
          .results-count {
            order: -1;
            width: 100%;
            margin-bottom: 0.5rem;
          }
        }
      `}</style>
    </div>
  );
};

export default ShopHeader;
