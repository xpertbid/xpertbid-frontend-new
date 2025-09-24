'use client';

import React, { useState } from 'react';
import Link from 'next/link';

interface PropertyPageProps {
  property: {
    id: string;
    title: string;
    price: number;
    pricePerSqft: number;
    images: string[];
    description: string;
    location: string;
    emirate: string;
    community: string;
    bedrooms: number;
    bathrooms: number;
    area: number;
    propertyType: string;
    purpose: string;
    furnished: string;
    yearBuilt: number;
    parking: number;
    amenities: string[];
    features: string[];
    agent: {
      name: string;
      phone: string;
      email: string;
      agency: string;
      avatar: string;
    };
    specifications: Record<string, unknown>;
    nearbyAmenities: Array<{
      name: string;
      distance: string;
      type: string;
    }>;
  };
}

const PropertyPage: React.FC<PropertyPageProps> = ({ property }) => {
  const [selectedImage, setSelectedImage] = useState(0);
  const [showAllImages, setShowAllImages] = useState(false);

  const handleContactAgent = () => {
    // Contact agent logic
    console.log('Contacting agent:', property.agent.name);
  };

  const handleScheduleViewing = () => {
    // Schedule viewing logic
    console.log('Scheduling viewing for property:', property.id);
  };

  return (
    <div className="property-page">
      <div className="container py-4">
        {/* Breadcrumb */}
        <nav aria-label="breadcrumb" className="mb-4">
          <ol className="breadcrumb">
            <li className="breadcrumb-item">
              <Link href="/">Home</Link>
            </li>
            <li className="breadcrumb-item">
              <Link href="/properties">Properties</Link>
            </li>
            <li className="breadcrumb-item">
              <Link href={`/properties/${property.emirate.toLowerCase()}`}>
                {property.emirate}
              </Link>
            </li>
            <li className="breadcrumb-item active" aria-current="page">
              {property.title}
            </li>
          </ol>
        </nav>

        <div className="row">
          {/* Property Images */}
          <div className="col-lg-8">
            <div className="property-images">
              {/* Main Image */}
              <div className="main-image mb-3 position-relative">
                <img
                  src={property.images[selectedImage]}
                  alt={property.title}
                  className="img-fluid w-100"
                  style={{ borderRadius: '8px', aspectRatio: '16/9', objectFit: 'cover' }}
                />
                
                {/* Image Counter */}
                <div className="position-absolute bottom-0 end-0 m-3">
                  <span className="badge bg-dark bg-opacity-75">
                    {selectedImage + 1} / {property.images.length}
                  </span>
                </div>

                {/* View All Images Button */}
                <div className="position-absolute top-0 end-0 m-3">
                  <button
                    className="btn btn-primary"
                    onClick={() => setShowAllImages(!showAllImages)}
                  >
                    <i className="fas fa-images me-2"></i>
                    View All ({property.images.length})
                  </button>
                </div>
              </div>

              {/* Thumbnail Images */}
              <div className="thumbnail-images d-flex gap-2 flex-wrap">
                {property.images.slice(0, showAllImages ? property.images.length : 6).map((image, index) => (
                  <img
                    key={index}
                    src={image}
                    alt={`${property.title} ${index + 1}`}
                    className={`img-thumbnail ${selectedImage === index ? 'active' : ''}`}
                    style={{ 
                      width: '120px', 
                      height: '80px', 
                      objectFit: 'cover',
                      cursor: 'pointer',
                      border: selectedImage === index ? '2px solid #43ACE9' : '1px solid #dee2e6'
                    }}
                    onClick={() => setSelectedImage(index)}
                  />
                ))}
                {!showAllImages && property.images.length > 6 && (
                  <div
                    className="img-thumbnail d-flex align-items-center justify-content-center"
                    style={{ 
                      width: '120px', 
                      height: '80px',
                      backgroundColor: '#f8f9fa',
                      border: '1px solid #dee2e6',
                      cursor: 'pointer'
                    }}
                    onClick={() => setShowAllImages(true)}
                  >
                    <span className="text-muted">+{property.images.length - 6}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Property Details */}
            <div className="property-details mt-4">
              <div className="row">
                <div className="col-lg-8">
                  {/* Title */}
                  <h1 className="property-title mb-3" style={{ 
                    fontFamily: 'Poppins, sans-serif', 
                    fontSize: '28px', 
                    fontWeight: '600',
                    color: '#000'
                  }}>
                    {property.title}
                  </h1>

                  {/* Location */}
                  <div className="location mb-3">
                    <i className="fas fa-map-marker-alt text-primary me-2"></i>
                    <span style={{ color: '#606060' }}>
                      {property.location}, {property.community}, {property.emirate}
                    </span>
                  </div>

                  {/* Key Features */}
                  <div className="key-features mb-4">
                    <div className="row">
                      <div className="col-3 col-md-2">
                        <div className="feature-item text-center p-3 bg-light rounded">
                          <i className="fas fa-bed text-primary mb-2" style={{ fontSize: '24px' }}></i>
                          <div className="feature-value fw-bold">{property.bedrooms}</div>
                          <div className="feature-label text-muted small">Bedrooms</div>
                        </div>
                      </div>
                      <div className="col-3 col-md-2">
                        <div className="feature-item text-center p-3 bg-light rounded">
                          <i className="fas fa-bath text-primary mb-2" style={{ fontSize: '24px' }}></i>
                          <div className="feature-value fw-bold">{property.bathrooms}</div>
                          <div className="feature-label text-muted small">Bathrooms</div>
                        </div>
                      </div>
                      <div className="col-3 col-md-2">
                        <div className="feature-item text-center p-3 bg-light rounded">
                          <i className="fas fa-ruler-combined text-primary mb-2" style={{ fontSize: '24px' }}></i>
                          <div className="feature-value fw-bold">{property.area}</div>
                          <div className="feature-label text-muted small">Sq Ft</div>
                        </div>
                      </div>
                      <div className="col-3 col-md-2">
                        <div className="feature-item text-center p-3 bg-light rounded">
                          <i className="fas fa-car text-primary mb-2" style={{ fontSize: '24px' }}></i>
                          <div className="feature-value fw-bold">{property.parking}</div>
                          <div className="feature-label text-muted small">Parking</div>
                        </div>
                      </div>
                      <div className="col-6 col-md-2">
                        <div className="feature-item text-center p-3 bg-light rounded">
                          <i className="fas fa-home text-primary mb-2" style={{ fontSize: '24px' }}></i>
                          <div className="feature-value fw-bold">{property.yearBuilt}</div>
                          <div className="feature-label text-muted small">Year Built</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Description */}
                  <div className="description mb-4">
                    <h5 className="mb-3">Description</h5>
                    <p style={{ color: '#606060', lineHeight: '1.6' }}>
                      {property.description}
                    </p>
                  </div>

                  {/* Features */}
                  <div className="features mb-4">
                    <h5 className="mb-3">Features</h5>
                    <div className="row">
                      {property.features.map((feature, index) => (
                        <div key={index} className="col-md-6">
                          <div className="d-flex align-items-center mb-2">
                            <i className="fas fa-check text-success me-2"></i>
                            <span>{feature}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Amenities */}
                  <div className="amenities mb-4">
                    <h5 className="mb-3">Amenities</h5>
                    <div className="row">
                      {property.amenities.map((amenity, index) => (
                        <div key={index} className="col-md-4">
                          <div className="d-flex align-items-center mb-2">
                            <i className="fas fa-check-circle text-primary me-2"></i>
                            <span>{amenity}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Nearby Amenities */}
                  <div className="nearby-amenities mb-4">
                    <h5 className="mb-3">Nearby Amenities</h5>
                    <div className="row">
                      {property.nearbyAmenities.map((amenity, index) => (
                        <div key={index} className="col-md-6 mb-3">
                          <div className="d-flex justify-content-between align-items-center p-3 border rounded">
                            <div>
                              <div className="fw-bold">{amenity.name}</div>
                              <div className="text-muted small">{amenity.type}</div>
                            </div>
                            <div className="text-primary fw-bold">{amenity.distance}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Sidebar */}
                <div className="col-lg-4">
                  <div className="property-sidebar">
                    {/* Price Card */}
                    <div className="price-card bg-light p-4 rounded mb-4">
                      <div className="price mb-3">
                        <div className="main-price" style={{ 
                          fontSize: '32px', 
                          fontWeight: '700', 
                          color: '#43ACE9',
                          fontFamily: 'Poppins, sans-serif'
                        }}>
                          AED {property.price.toLocaleString()}
                        </div>
                        <div className="price-per-sqft text-muted">
                          AED {property.pricePerSqft.toLocaleString()} per sq ft
                        </div>
                      </div>

                      <div className="property-info mb-4">
                        <div className="row">
                          <div className="col-6">
                            <div className="info-item">
                              <div className="info-label text-muted small">Property Type</div>
                              <div className="info-value fw-bold">{property.propertyType}</div>
                            </div>
                          </div>
                          <div className="col-6">
                            <div className="info-item">
                              <div className="info-label text-muted small">Purpose</div>
                              <div className="info-value fw-bold">{property.purpose}</div>
                            </div>
                          </div>
                          <div className="col-6">
                            <div className="info-item">
                              <div className="info-label text-muted small">Furnished</div>
                              <div className="info-value fw-bold">{property.furnished}</div>
                            </div>
                          </div>
                          <div className="col-6">
                            <div className="info-item">
                              <div className="info-label text-muted small">Area</div>
                              <div className="info-value fw-bold">{property.area} sq ft</div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="action-buttons d-grid gap-2">
                        <button
                          className="btn btn-primary"
                          onClick={handleContactAgent}
                          style={{
                            padding: '12px',
                            fontSize: '16px',
                            fontWeight: '600',
                            textTransform: 'uppercase',
                            letterSpacing: '0.5px'
                          }}
                        >
                          <i className="fas fa-phone me-2"></i>
                          Contact Agent
                        </button>
                        <button
                          className="btn btn-outline-primary"
                          onClick={handleScheduleViewing}
                          style={{
                            padding: '12px',
                            fontSize: '16px',
                            fontWeight: '600',
                            textTransform: 'uppercase',
                            letterSpacing: '0.5px'
                          }}
                        >
                          <i className="fas fa-calendar me-2"></i>
                          Schedule Viewing
                        </button>
                        <button
                          className="btn btn-outline-secondary"
                          style={{
                            padding: '12px',
                            fontSize: '16px',
                            fontWeight: '600',
                            textTransform: 'uppercase',
                            letterSpacing: '0.5px'
                          }}
                        >
                          <i className="fas fa-share me-2"></i>
                          Share Property
                        </button>
                      </div>
                    </div>

                    {/* Agent Card */}
                    <div className="agent-card border p-4 rounded mb-4">
                      <h6 className="mb-3">Listed by</h6>
                      <div className="agent-info d-flex align-items-center mb-3">
                        <img
                          src={property.agent.avatar}
                          alt={property.agent.name}
                          className="rounded-circle me-3"
                          style={{ width: '60px', height: '60px', objectFit: 'cover' }}
                        />
                        <div>
                          <div className="agent-name fw-bold">{property.agent.name}</div>
                          <div className="agent-agency text-muted small">{property.agent.agency}</div>
                        </div>
                      </div>
                      <div className="agent-contact">
                        <a href={`tel:${property.agent.phone}`} className="btn btn-outline-primary w-100 mb-2">
                          <i className="fas fa-phone me-2"></i>
                          {property.agent.phone}
                        </a>
                        <a href={`mailto:${property.agent.email}`} className="btn btn-outline-secondary w-100">
                          <i className="fas fa-envelope me-2"></i>
                          Send Email
                        </a>
                      </div>
                    </div>

                    {/* Quick Stats */}
                    <div className="quick-stats border p-4 rounded">
                      <h6 className="mb-3">Quick Stats</h6>
                      <div className="stats-list">
                        <div className="stat-item d-flex justify-content-between mb-2">
                          <span>Property ID</span>
                          <span className="fw-bold">#{property.id}</span>
                        </div>
                        <div className="stat-item d-flex justify-content-between mb-2">
                          <span>Listed</span>
                          <span className="fw-bold">2 days ago</span>
                        </div>
                        <div className="stat-item d-flex justify-content-between mb-2">
                          <span>Views</span>
                          <span className="fw-bold">1,234</span>
                        </div>
                        <div className="stat-item d-flex justify-content-between">
                          <span>Favorites</span>
                          <span className="fw-bold">45</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyPage;
