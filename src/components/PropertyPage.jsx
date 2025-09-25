'use client';

import React, { useState } from 'react';
import Link from 'next/link';

const PropertyPage = ({ property }) => {
  const [selectedImage, setSelectedImage] = useState(0);
  const [activeTab, setActiveTab] = useState('overview');

  const images = property?.images || ['/images/placeholder.svg'];
  const specifications = property?.specifications || {};
  const nearbyAmenities = property?.nearbyAmenities || [];

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'specifications', label: 'Specifications' },
    { id: 'amenities', label: 'Amenities' },
    { id: 'location', label: 'Location' }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'specifications':
        return (
          <div className="specifications-content">
            <div className="row">
              {Object.entries(specifications).map(([key, value]) => (
                <div key={key} className="col-md-6 mb-3">
                  <div className="spec-item">
                    <span className="spec-label">{key.replace(/_/g, ' ').toUpperCase()}:</span>
                    <span className="spec-value">{String(value)}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'amenities':
        return (
          <div className="amenities-content">
            <div className="row">
              {nearbyAmenities.map((amenity, index) => (
                <div key={index} className="col-md-6 mb-3">
                  <div className="amenity-item">
                    <i className="fas fa-map-marker-alt"></i>
                    <div className="amenity-info">
                      <h6>{amenity.name}</h6>
                      <p>{amenity.distance} - {amenity.type}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'location':
        return (
          <div className="location-content">
            <div className="map-placeholder">
              <i className="fas fa-map-marked-alt fa-3x"></i>
              <p>Interactive map would be displayed here</p>
            </div>
            <div className="location-details">
              <h5>Address</h5>
              <p>{property?.address || 'Address not available'}</p>
              <p>{property?.city}, {property?.state} {property?.postal_code}</p>
              <p>{property?.country}</p>
            </div>
          </div>
        );

      default:
        return (
          <div className="overview-content">
            <div className="property-highlights">
              <div className="row">
                <div className="col-md-3 col-sm-6 mb-3">
                  <div className="highlight-item">
                    <i className="fas fa-bed"></i>
                    <span>{property?.bedrooms || 'N/A'} Bedrooms</span>
                  </div>
                </div>
                <div className="col-md-3 col-sm-6 mb-3">
                  <div className="highlight-item">
                    <i className="fas fa-bath"></i>
                    <span>{property?.bathrooms || 'N/A'} Bathrooms</span>
                  </div>
                </div>
                <div className="col-md-3 col-sm-6 mb-3">
                  <div className="highlight-item">
                    <i className="fas fa-ruler-combined"></i>
                    <span>{property?.area_sqft || 'N/A'} sq ft</span>
                  </div>
                </div>
                <div className="col-md-3 col-sm-6 mb-3">
                  <div className="highlight-item">
                    <i className="fas fa-calendar"></i>
                    <span>Built {property?.year_built || 'N/A'}</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="property-description">
              <h5>Description</h5>
              <p>{property?.description || 'No description available'}</p>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="property-page">
      <div className="container py-4">
        <div className="row">
          {/* Property Images */}
          <div className="col-lg-7">
            <div className="property-images">
              <div className="main-image">
                <img 
                  src={images[selectedImage]} 
                  alt={property?.title || 'Property'}
                  className="img-fluid"
                />
                {property?.is_featured && (
                  <div className="featured-badge">Featured</div>
                )}
              </div>
              <div className="thumbnail-images">
                {images.map((image, index) => (
                  <img
                    key={index}
                    src={image}
                    alt={`${property?.title || 'Property'} ${index + 1}`}
                    className={`thumbnail ${selectedImage === index ? 'active' : ''}`}
                    onClick={() => setSelectedImage(index)}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Property Details */}
          <div className="col-lg-5">
            <div className="property-details">
              <h1 className="property-title">{property?.title || 'Property'}</h1>
              
              <div className="property-meta">
                <div className="property-type">
                  <span className="label">Type:</span>
                  <span className="value">{property?.property_type || 'N/A'}</span>
                </div>
                <div className="listing-type">
                  <span className="label">Listing:</span>
                  <span className="value">{property?.listing_type || 'N/A'}</span>
                </div>
                <div className="status">
                  <span className="label">Status:</span>
                  <span className={`status-badge ${property?.property_status}`}>
                    {property?.property_status || 'Unknown'}
                  </span>
                </div>
              </div>

              <div className="property-price">
                <div className="price-section">
                  <span className="price">${property?.price?.toLocaleString() || 'N/A'}</span>
                  {property?.rent_price && (
                    <span className="rent-price">Rent: ${property.rent_price}/month</span>
                  )}
                </div>
                <div className="price-details">
                  {property?.show_price ? (
                    <p className="price-info">Price is negotiable</p>
                  ) : (
                    <p className="price-info">Contact for price</p>
                  )}
                </div>
              </div>

              <div className="property-actions">
                <button className="btn btn-primary btn-lg w-100 mb-2">
                  <i className="fas fa-phone me-2"></i>
                  Contact Agent
                </button>
                <button className="btn btn-outline-primary w-100 mb-2">
                  <i className="fas fa-heart me-2"></i>
                  Add to Favorites
                </button>
                <button className="btn btn-outline-secondary w-100">
                  <i className="fas fa-share me-2"></i>
                  Share Property
                </button>
              </div>

              <div className="property-info">
                <div className="info-item">
                  <span className="label">Agent:</span>
                  <span className="value">{property?.agent_name || 'N/A'}</span>
                </div>
                <div className="info-item">
                  <span className="label">Vendor:</span>
                  <span className="value">{property?.vendor_name || 'N/A'}</span>
                </div>
                <div className="info-item">
                  <span className="label">Commission:</span>
                  <span className="value">{property?.commission_rate || 0}%</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Property Details Tabs */}
        <div className="property-tabs mt-5">
          <div className="tab-navigation">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="tab-content">
            {renderTabContent()}
          </div>
        </div>
      </div>

      <style jsx>{`
        .property-page {
          min-height: 100vh;
        }

        .property-images {
          margin-bottom: 30px;
        }

        .main-image {
          position: relative;
          margin-bottom: 15px;
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        }

        .main-image img {
          width: 100%;
          height: 400px;
          object-fit: cover;
        }

        .featured-badge {
          position: absolute;
          top: 15px;
          left: 15px;
          background: #28a745;
          color: white;
          padding: 5px 10px;
          border-radius: 4px;
          font-size: 0.8rem;
          font-weight: 600;
        }

        .thumbnail-images {
          display: flex;
          gap: 10px;
          overflow-x: auto;
        }

        .thumbnail {
          width: 80px;
          height: 80px;
          object-fit: cover;
          border-radius: 4px;
          cursor: pointer;
          border: 2px solid transparent;
          transition: border-color 0.2s;
        }

        .thumbnail.active {
          border-color: #007bff;
        }

        .property-title {
          font-size: 2rem;
          font-weight: 700;
          margin-bottom: 15px;
          color: #333;
        }

        .property-meta {
          margin-bottom: 20px;
        }

        .property-meta > div {
          margin-bottom: 8px;
        }

        .label {
          font-weight: 600;
          color: #666;
          margin-right: 8px;
        }

        .value {
          color: #333;
        }

        .status-badge {
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 0.8rem;
          font-weight: 600;
        }

        .status-badge.active {
          background: #28a745;
          color: white;
        }

        .status-badge.pending {
          background: #ffc107;
          color: #333;
        }

        .status-badge.sold {
          background: #dc3545;
          color: white;
        }

        .property-price {
          margin-bottom: 30px;
          padding: 20px;
          background: #f8f9fa;
          border-radius: 8px;
        }

        .price {
          font-size: 2rem;
          font-weight: 700;
          color: #28a745;
          display: block;
        }

        .rent-price {
          font-size: 1rem;
          color: #666;
        }

        .price-info {
          margin: 10px 0 0 0;
          color: #666;
          font-style: italic;
        }

        .property-actions {
          margin-bottom: 30px;
        }

        .property-info {
          background: #f8f9fa;
          padding: 20px;
          border-radius: 8px;
        }

        .info-item {
          display: flex;
          justify-content: space-between;
          margin-bottom: 10px;
        }

        .info-item:last-child {
          margin-bottom: 0;
        }

        .tab-navigation {
          display: flex;
          border-bottom: 2px solid #eee;
          margin-bottom: 30px;
        }

        .tab-button {
          padding: 15px 25px;
          border: none;
          background: none;
          cursor: pointer;
          border-bottom: 2px solid transparent;
          transition: all 0.2s;
          font-weight: 600;
        }

        .tab-button:hover {
          color: #007bff;
        }

        .tab-button.active {
          color: #007bff;
          border-bottom-color: #007bff;
        }

        .tab-content {
          min-height: 300px;
        }

        .highlight-item {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 15px;
          background: white;
          border-radius: 8px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }

        .highlight-item i {
          color: #007bff;
          font-size: 1.2rem;
        }

        .spec-item {
          display: flex;
          justify-content: space-between;
          padding: 10px 0;
          border-bottom: 1px solid #eee;
        }

        .spec-item:last-child {
          border-bottom: none;
        }

        .amenity-item {
          display: flex;
          align-items: center;
          gap: 15px;
          padding: 15px;
          background: white;
          border-radius: 8px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }

        .amenity-item i {
          color: #007bff;
          font-size: 1.2rem;
        }

        .map-placeholder {
          text-align: center;
          padding: 60px 20px;
          background: #f8f9fa;
          border-radius: 8px;
          margin-bottom: 20px;
        }

        .map-placeholder i {
          color: #007bff;
          margin-bottom: 15px;
        }

        @media (max-width: 768px) {
          .property-title {
            font-size: 1.5rem;
          }

          .price {
            font-size: 1.5rem;
          }

          .tab-navigation {
            overflow-x: auto;
          }

          .tab-button {
            white-space: nowrap;
            min-width: 120px;
          }
        }
      `}</style>
    </div>
  );
};

export default PropertyPage;
