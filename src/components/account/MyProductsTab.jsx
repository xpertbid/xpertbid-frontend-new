'use client';

import React, { useState, useEffect } from 'react';
import { apiService } from '@/services/api';
import { useCurrency } from '@/contexts/CurrencyLanguageContext';

const MyProductsTab = ({ userId }) => {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { formatPrice } = useCurrency();

  useEffect(() => {
    loadProducts();
  }, [userId]);

  const loadProducts = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await apiService.getUserProducts();
      
      if (response.success) {
        setProducts(response.data || []);
      } else {
        setError(response.message || 'Failed to load products');
      }
    } catch (error) {
      console.error('Error loading products:', error);
      setError('Failed to load products. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusBadgeClass = (status) => {
    switch (status?.toLowerCase()) {
      case 'draft':
        return 'bg-secondary';
      case 'published':
        return 'bg-success';
      case 'pending':
        return 'bg-warning';
      case 'rejected':
        return 'bg-danger';
      case 'archived':
        return 'bg-dark';
      default:
        return 'bg-info';
    }
  };

  const getStockBadgeClass = (stock) => {
    if (stock === 0) {
      return 'bg-danger';
    } else if (stock < 10) {
      return 'bg-warning';
    } else {
      return 'bg-success';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (isLoading) {
    return (
      <div className="products-content">
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
          <div className="text-center">
            <div className="spinner-border text-primary mb-3" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="text-muted">Loading your products...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="products-content">
        <div className="alert alert-danger" role="alert">
          <i className="fas fa-exclamation-triangle me-2"></i>
          {error}
        </div>
        <button className="btn btn-outline-primary" onClick={loadProducts}>
          <i className="fas fa-refresh me-2"></i>
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="products-content">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4 className="mb-0">
          <i className="fas fa-box me-2 text-primary"></i>
          My Products
        </h4>
        <div className="d-flex gap-2">
          <span className="badge bg-primary">{products.length} Products</span>
          <a href="/products/create" className="btn btn-primary btn-sm">
            <i className="fas fa-plus me-1"></i>
            Add Product
          </a>
        </div>
      </div>

      {products.length === 0 ? (
        <div className="card">
          <div className="card-body text-center py-5">
            <i className="fas fa-box fa-4x text-muted mb-3"></i>
            <h5 className="text-muted">No Products Listed</h5>
            <p className="text-muted mb-4">
              You haven't listed any products yet. Start selling by adding your first product.
            </p>
            <a href="/products/create" className="btn btn-primary">
              <i className="fas fa-plus me-2"></i>
              Add Product
            </a>
          </div>
        </div>
      ) : (
        <div className="row">
          {products.map((product) => (
            <div key={product.id} className="col-12 mb-4">
              <div className="card">
                <div className="card-header d-flex justify-content-between align-items-center">
                  <div>
                    <h6 className="mb-0">{product.name}</h6>
                    <small className="text-muted">SKU: {product.sku || 'N/A'}</small>
                  </div>
                  <div className="text-end">
                    <span className={`badge ${getStatusBadgeClass(product.status)} me-2`}>
                      {product.status?.toUpperCase()}
                    </span>
                    <span className={`badge ${getStockBadgeClass(product.stock_quantity)}`}>
                      Stock: {product.stock_quantity || 0}
                    </span>
                  </div>
                </div>
                <div className="card-body">
                  <div className="row">
                    <div className="col-md-3">
                      {product.thumbnail_image || product.featured_image ? (
                        <img 
                          src={product.thumbnail_image || product.featured_image} 
                          alt={product.name}
                          className="img-fluid rounded"
                          style={{ maxHeight: '150px', objectFit: 'cover' }}
                        />
                      ) : (
                        <div className="bg-light rounded d-flex align-items-center justify-content-center" style={{ height: '150px' }}>
                          <i className="fas fa-image fa-3x text-muted"></i>
                        </div>
                      )}
                    </div>
                    <div className="col-md-9">
                      <div className="product-info">
                        <h6>Product Details:</h6>
                        <div className="row">
                          <div className="col-sm-6">
                            <p className="mb-1">
                              <strong>Price:</strong> {formatPrice(product.price)}
                              {product.sale_price && (
                                <span className="ms-2 text-success">
                                  <del className="text-muted">{formatPrice(product.sale_price)}</del>
                                </span>
                              )}
                            </p>
                            <p className="mb-1">
                              <strong>Category:</strong> {product.category || 'Uncategorized'}
                            </p>
                            <p className="mb-1">
                              <strong>Weight:</strong> {product.weight || 'N/A'}
                            </p>
                          </div>
                          <div className="col-sm-6">
                            <p className="mb-1">
                              <strong>Views:</strong> {product.views || 0}
                            </p>
                            <p className="mb-1">
                              <strong>Sales:</strong> {product.sales_count || 0}
                            </p>
                            <p className="mb-1">
                              <strong>Rating:</strong> 
                              <span className="ms-1">
                                {product.rating ? (
                                  <>
                                    {product.rating.toFixed(1)} 
                                    <i className="fas fa-star text-warning"></i>
                                    ({product.reviews_count || 0})
                                  </>
                                ) : (
                                  'No ratings yet'
                                )}
                              </span>
                            </p>
                          </div>
                        </div>
                        {product.short_description && (
                          <div className="mt-2">
                            <strong>Description:</strong>
                            <p className="text-muted small mb-0">{product.short_description}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="card-footer">
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <small className="text-muted">
                        <i className="fas fa-calendar-alt me-1"></i>
                        Created: {formatDate(product.created_at)}
                        {product.updated_at !== product.created_at && (
                          <span className="ms-2">
                            <i className="fas fa-edit me-1"></i>
                            Updated: {formatDate(product.updated_at)}
                          </span>
                        )}
                      </small>
                    </div>
                    <div>
                      <button className="btn btn-outline-primary btn-sm me-2">
                        <i className="fas fa-eye me-1"></i>
                        View
                      </button>
                      <button className="btn btn-outline-secondary btn-sm me-2">
                        <i className="fas fa-edit me-1"></i>
                        Edit
                      </button>
                      {product.status === 'draft' && (
                        <button className="btn btn-outline-success btn-sm">
                          <i className="fas fa-check me-1"></i>
                          Publish
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <style jsx>{`
        .products-content .card {
          transition: all 0.3s ease;
        }
        
        .products-content .card:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }
        
        .product-info h6 {
          color: #495057;
          margin-bottom: 1rem;
        }
      `}</style>
    </div>
  );
};

export default MyProductsTab;
