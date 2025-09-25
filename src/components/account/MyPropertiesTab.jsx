'use client';

import React, { useState, useEffect } from 'react';
import { apiService } from '@/services/api';

const MyPropertiesTab = ({ userId }) => {
  const [properties, setProperties] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadProperties();
  }, [userId]);

  const loadProperties = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await apiService.getUserProperties();
      
      if (response.success) {
        setProperties(response.data || []);
      } else {
        setError(response.message || 'Failed to load properties');
      }
    } catch (error) {
      console.error('Error loading properties:', error);
      setError('Failed to load properties. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusBadgeClass = (status) => {
    switch (status?.toLowerCase()) {
      case 'draft':
        return 'bg-secondary';
      case 'active':
        return 'bg-success';
      case 'pending':
        return 'bg-warning';
      case 'sold':
        return 'bg-primary';
      case 'cancelled':
        return 'bg-danger';
      case 'archived':
        return 'bg-dark';
      default:
        return 'bg-info';
    }
  };

  const getTypeBadgeClass = (type) => {
    switch (type?.toLowerCase()) {
      case 'house':
        return 'bg-primary';
      case 'apartment':
        return 'bg-info';
      case 'condo':
        return 'bg-success';
      case 'townhouse':
        return 'bg-warning';
      case 'land':
        return 'bg-secondary';
      default:
        return 'bg-dark';
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

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
  };

  if (isLoading) {
    return (
      <div className="properties-content">
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
          <div className="text-center">
            <div className="spinner-border text-primary mb-3" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="text-muted">Loading your properties...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="properties-content">
        <div className="alert alert-danger" role="alert">
          <i className="fas fa-exclamation-triangle me-2"></i>
          {error}
        </div>
        <button className="btn btn-outline-primary" onClick={loadProperties}>
          <i className="fas fa-refresh me-2"></i>
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="properties-content">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4 className="mb-0">
          <i className="fas fa-home me-2 text-primary"></i>
          My Properties
        </h4>
        <div className="d-flex gap-2">
          <span className="badge bg-primary">{properties.length} Properties</span>
          <a href="/properties/create" className="btn btn-primary btn-sm">
            <i className="fas fa-plus me-1"></i>
            Add Property
          </a>
        </div>
      </div>

      {properties.length === 0 ? (
        <div className="card">
          <div className="card-body text-center py-5">
            <i className="fas fa-home fa-4x text-muted mb-3"></i>
            <h5 className="text-muted">No Properties Listed</h5>
            <p className="text-muted mb-4">
              You haven't listed any properties yet. Start selling real estate by adding your first property.
            </p>
            <a href="/properties/create" className="btn btn-primary">
              <i className="fas fa-plus me-2"></i>
              Add Property
            </a>
          </div>
        </div>
      ) : (
        <div className="row">
          {properties.map((property) => (
            <div key={property.id} className="col-12 mb-4">
              <div className="card">
                <div className="card-header d-flex justify-content-between align-items-center">
                  <div>
                    <h6 className="mb-0">{property.title}</h6>
                    <small className="text-muted">Property ID: {property.id}</small>
                  </div>
                  <div className="text-end">
                    <span className={`badge ${getStatusBadgeClass(property.status)} me-2`}>
                      {property.status?.toUpperCase()}
                    </span>
                    <span className={`badge ${getTypeBadgeClass(property.type)}`}>
                      {property.type?.toUpperCase()}
                    </span>
                  </div>
                </div>
                <div className="card-body">
                  <div className="row">
                    <div className="col-md-4">
                      {property.featured_image || property.thumbnail_image ? (
                        <img 
                          src={property.featured_image || property.thumbnail_image} 
                          alt={property.title}
                          className="img-fluid rounded"
                          style={{ maxHeight: '200px', objectFit: 'cover', width: '100%' }}
                        />
                      ) : (
                        <div className="bg-light rounded d-flex align-items-center justify-content-center" style={{ height: '200px' }}>
                          <i className="fas fa-home fa-4x text-muted"></i>
                        </div>
                      )}
                    </div>
                    <div className="col-md-8">
                      <div className="property-info">
                        <h6>Property Details:</h6>
                        <div className="row">
                          <div className="col-sm-6">
                            <p className="mb-1">
                              <strong>Price:</strong> {formatPrice(property.price)}
                            </p>
                            <p className="mb-1">
                              <strong>Size:</strong> {property.size ? `${property.size} sq ft` : 'N/A'}
                            </p>
                            <p className="mb-1">
                              <strong>Bedrooms:</strong> {property.bedrooms || 'N/A'}
                            </p>
                            <p className="mb-1">
                              <strong>Bathrooms:</strong> {property.bathrooms || 'N/A'}
                            </p>
                          </div>
                          <div className="col-sm-6">
                            <p className="mb-1">
                              <strong>Location:</strong> {property.location || 'N/A'}
                            </p>
                            <p className="mb-1">
                              <strong>Year Built:</strong> {property.year_built || 'N/A'}
                            </p>
                            <p className="mb-1">
                              <strong>Views:</strong> {property.views || 0}
                            </p>
                            <p className="mb-1">
                              <strong>Inquiries:</strong> {property.inquiries || 0}
                            </p>
                          </div>
                        </div>
                        {property.description && (
                          <div className="mt-2">
                            <strong>Description:</strong>
                            <p className="text-muted small mb-0">
                              {property.description.length > 150 
                                ? `${property.description.substring(0, 150)}...` 
                                : property.description
                              }
                            </p>
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
                        Listed: {formatDate(property.created_at)}
                        {property.updated_at !== property.created_at && (
                          <span className="ms-2">
                            <i className="fas fa-edit me-1"></i>
                            Updated: {formatDate(property.updated_at)}
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
                      {property.status === 'draft' && (
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
        .properties-content .card {
          transition: all 0.3s ease;
        }
        
        .properties-content .card:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }
        
        .property-info h6 {
          color: #495057;
          margin-bottom: 1rem;
        }
      `}</style>
    </div>
  );
};

export default MyPropertiesTab;
