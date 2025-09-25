'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Layout from '@/components/Layout';
import Image from 'next/image';
import Link from 'next/link';
import { apiService } from '@/services/api';
import { useCurrency } from '@/contexts/CurrencyLanguageContext';
import PriceDisplay from '@/components/PriceDisplay';

export default function PropertyDetailPage() {
  const params = useParams();
  const { formatPrice } = useCurrency();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [relatedProperties, setRelatedProperties] = useState([]);

  useEffect(() => {
    if (params.slug) {
      fetchProperty();
    }
  }, [params.slug]);

  const fetchProperty = async () => {
    try {
      setLoading(true);
      // Extract property ID from slug (e.g., "5-penthouse-with-city-views" -> 5)
      const propertyId = params.slug.split('-')[0];
      
      const response = await apiService.getProperty(propertyId);
      if (response.success) {
        setProperty(response.data);
        // Fetch related properties
        fetchRelatedProperties(response.data);
      } else {
        setError('Property not found');
      }
    } catch (err) {
      console.error('Error fetching property:', err);
      setError('Failed to load property details');
    } finally {
      setLoading(false);
    }
  };

  const fetchRelatedProperties = async (currentProperty) => {
    try {
      const response = await apiService.getProperties();
      if (response.success) {
        // Filter out current property and get 3 related ones
        const related = response.data
          .filter(p => p.id !== currentProperty.id)
          .slice(0, 3);
        setRelatedProperties(related);
      }
    } catch (error) {
      console.error('Error fetching related properties:', error);
    }
  };

  const getImagesArray = (images) => {
    if (!images) return [];
    if (Array.isArray(images)) return images;
    if (typeof images === 'string') {
      try {
        const parsed = JSON.parse(images);
        return Array.isArray(parsed) ? parsed : [];
      } catch {
        return [images];
      }
    }
    return [];
  };

  if (loading) {
    return (
      <Layout>
        <div className="container py-5">
          <div className="text-center">
            <div className="spinner-border" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-3">Loading property details...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (error || !property) {
    return (
      <Layout>
        <div className="container py-5">
          <div className="text-center">
            <div className="alert alert-danger" role="alert">
              <h4 className="alert-heading">Property Not Found</h4>
              <p>{error || 'The property you are looking for does not exist.'}</p>
              <hr />
              <Link href="/properties" className="btn btn-primary">
                Browse All Properties
              </Link>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  const images = getImagesArray(property.images);
  const hasImages = images.length > 0;

  return (
    <Layout>
      <div className="property-detail-page">
        {/* Breadcrumb */}
        <div className="breadcrumb-section bg-light py-3">
          <div className="container">
            <nav aria-label="breadcrumb">
              <ol className="breadcrumb mb-0">
                <li className="breadcrumb-item">
                  <Link href="/">Home</Link>
                </li>
                <li className="breadcrumb-item">
                  <Link href="/properties">Properties</Link>
                </li>
                <li className="breadcrumb-item active" aria-current="page">
                  {property.title || 'Property Details'}
                </li>
              </ol>
            </nav>
          </div>
        </div>

        {/* Property Header */}
        <div className="property-header bg-light py-4">
          <div className="container">
            <div className="row align-items-center">
              <div className="col-lg-8">
                <h1 className="property-title mb-2">{property.title || 'Property'}</h1>
                <p className="property-location text-muted mb-0">
                  <i className="fas fa-map-marker-alt me-2"></i>
                  {property.address || 'Location not specified'}
                </p>
              </div>
              <div className="col-lg-4 text-end">
                <div className="property-price-display">
                  <PriceDisplay 
                    amount={property.price || 0}
                    className="price-large"
                  />
                  {property.property_type && (
                    <span className="badge bg-primary ms-2">{property.property_type}</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Property Content */}
        <div className="container py-5">
          <div className="row">
            {/* Main Content */}
            <div className="col-lg-8">
              {/* Image Gallery */}
              {hasImages && (
                <div className="property-gallery mb-5">
                  <div className="main-image mb-3">
                    <Image
                      src={images[selectedImage]}
                      alt={property.title || 'Property'}
                      width={800}
                      height={500}
                      className="img-fluid rounded"
                      style={{ objectFit: 'cover' }}
                    />
                  </div>
                  {images.length > 1 && (
                    <div className="thumbnail-gallery">
                      <div className="row g-2">
                        {images.map((image, index) => (
                          <div key={index} className="col-3">
                            <Image
                              src={image}
                              alt={`${property.title} - Image ${index + 1}`}
                              width={200}
                              height={150}
                              className={`img-fluid rounded cursor-pointer ${
                                selectedImage === index ? 'border border-primary' : ''
                              }`}
                              style={{ objectFit: 'cover' }}
                              onClick={() => setSelectedImage(index)}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Property Description */}
              <div className="property-description mb-5">
                <h3 className="mb-3">Description</h3>
                <p className="text-muted">
                  {property.description || 'No description available for this property.'}
                </p>
              </div>

              {/* Property Features */}
              <div className="property-features mb-5">
                <h3 className="mb-3">Property Features</h3>
                <div className="row">
                  <div className="col-md-6">
                    <div className="feature-list">
                      {property.bedrooms && (
                        <div className="feature-item d-flex align-items-center mb-2">
                          <i className="fas fa-bed text-primary me-3"></i>
                          <span>{property.bedrooms} Bedrooms</span>
                        </div>
                      )}
                      {property.bathrooms && (
                        <div className="feature-item d-flex align-items-center mb-2">
                          <i className="fas fa-bath text-primary me-3"></i>
                          <span>{property.bathrooms} Bathrooms</span>
                        </div>
                      )}
                      {property.area_sqft && (
                        <div className="feature-item d-flex align-items-center mb-2">
                          <i className="fas fa-ruler-combined text-primary me-3"></i>
                          <span>{property.area_sqft.toLocaleString()} sq ft</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="feature-list">
                      {property.year_built && (
                        <div className="feature-item d-flex align-items-center mb-2">
                          <i className="fas fa-calendar text-primary me-3"></i>
                          <span>Built in {property.year_built}</span>
                        </div>
                      )}
                      {property.property_type && (
                        <div className="feature-item d-flex align-items-center mb-2">
                          <i className="fas fa-home text-primary me-3"></i>
                          <span>{property.property_type}</span>
                        </div>
                      )}
                      {property.garage && (
                        <div className="feature-item d-flex align-items-center mb-2">
                          <i className="fas fa-car text-primary me-3"></i>
                          <span>{property.garage} Garage</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="col-lg-4">
              <div className="property-sidebar">
                {/* Contact Form */}
                <div className="contact-form-card bg-light p-4 rounded mb-4">
                  <h4 className="mb-3">Contact Agent</h4>
                  <form>
                    <div className="mb-3">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Your Name"
                        required
                      />
                    </div>
                    <div className="mb-3">
                      <input
                        type="email"
                        className="form-control"
                        placeholder="Your Email"
                        required
                      />
                    </div>
                    <div className="mb-3">
                      <input
                        type="tel"
                        className="form-control"
                        placeholder="Your Phone"
                      />
                    </div>
                    <div className="mb-3">
                      <textarea
                        className="form-control"
                        rows="4"
                        placeholder="Your Message"
                      ></textarea>
                    </div>
                    <button type="submit" className="btn btn-primary w-100">
                      Send Message
                    </button>
                  </form>
                </div>

                {/* Property Details */}
                <div className="property-details-card bg-light p-4 rounded">
                  <h4 className="mb-3">Property Details</h4>
                  <div className="detail-list">
                    <div className="detail-item d-flex justify-content-between py-2 border-bottom">
                      <span>Property ID:</span>
                      <span className="fw-bold">#{property.id}</span>
                    </div>
                    <div className="detail-item d-flex justify-content-between py-2 border-bottom">
                      <span>Type:</span>
                      <span className="fw-bold">{property.property_type || 'N/A'}</span>
                    </div>
                    <div className="detail-item d-flex justify-content-between py-2 border-bottom">
                      <span>Price:</span>
                      <span className="fw-bold">{formatPrice(property.price || 0)}</span>
                    </div>
                    <div className="detail-item d-flex justify-content-between py-2 border-bottom">
                      <span>Area:</span>
                      <span className="fw-bold">{property.area_sqft?.toLocaleString() || 'N/A'} sq ft</span>
                    </div>
                    <div className="detail-item d-flex justify-content-between py-2">
                      <span>Status:</span>
                      <span className="badge bg-success">Available</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Related Properties */}
          {relatedProperties.length > 0 && (
            <div className="related-properties mt-5">
              <h3 className="mb-4">Related Properties</h3>
              <div className="row g-4">
                {relatedProperties.map((relatedProperty) => (
                  <div key={relatedProperty.id} className="col-md-4">
                    <div className="property-card h-100">
                      <div className="property-image">
                        <Image
                          src={getImagesArray(relatedProperty.images)[0] || '/images/placeholder.svg'}
                          alt={relatedProperty.title || 'Property'}
                          width={300}
                          height={200}
                          className="img-fluid"
                          style={{ objectFit: 'cover' }}
                        />
                        <div className="property-price">
                          <PriceDisplay 
                            amount={relatedProperty.price || 0}
                            className="price-small"
                          />
                        </div>
                      </div>
                      <div className="property-content">
                        <h5 className="property-title">
                          <Link href={`/properties/${relatedProperty.id}-${relatedProperty.title?.toLowerCase().replace(/\s+/g, '-')}`}>
                            {relatedProperty.title || 'Property'}
                          </Link>
                        </h5>
                        <p className="property-location text-muted">
                          <i className="fas fa-map-marker-alt me-1"></i>
                          {relatedProperty.address || 'Location not specified'}
                        </p>
                        <div className="property-features">
                          <div className="feature-item">
                            <i className="fas fa-bed me-1"></i>
                            {relatedProperty.bedrooms || 'N/A'} beds
                          </div>
                          <div className="feature-item">
                            <i className="fas fa-bath me-1"></i>
                            {relatedProperty.bathrooms || 'N/A'} baths
                          </div>
                          <div className="feature-item">
                            <i className="fas fa-ruler-combined me-1"></i>
                            {relatedProperty.area_sqft?.toLocaleString() || 'N/A'} sq ft
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <style jsx>{`
          .property-detail-page {
            min-height: 100vh;
          }

          .property-title {
            font-family: 'Poppins', sans-serif;
            font-weight: 600;
            color: #000;
            font-size: 2rem;
          }

          .property-location {
            font-size: 1.1rem;
          }

          .property-price-display {
            font-size: 1.5rem;
            font-weight: 600;
          }

          .property-gallery .main-image {
            height: 500px;
            overflow: hidden;
            border-radius: 8px;
          }

          .thumbnail-gallery img {
            cursor: pointer;
            transition: opacity 0.3s ease;
          }

          .thumbnail-gallery img:hover {
            opacity: 0.8;
          }

          .property-card {
            background: #fff;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
            transition: transform 0.3s ease, box-shadow 0.3s ease;
          }

          .property-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 5px 20px rgba(0, 0, 0, 0.15);
          }

          .property-image {
            position: relative;
            height: 200px;
            overflow: hidden;
          }

          .property-image img {
            width: 100%;
            height: 100%;
            object-fit: cover;
          }

          .property-price {
            position: absolute;
            bottom: 10px;
            left: 10px;
            background: rgba(0, 0, 0, 0.8);
            color: #fff;
            padding: 0.5rem 1rem;
            border-radius: 4px;
            font-weight: 600;
          }

          .property-content {
            padding: 1.5rem;
          }

          .property-title {
            font-family: 'Poppins', sans-serif;
            font-weight: 600;
            margin-bottom: 0.5rem;
          }

          .property-title a {
            color: #000;
            text-decoration: none;
          }

          .property-title a:hover {
            color: var(--primary-color);
          }

          .property-features {
            display: flex;
            gap: 1rem;
            margin-bottom: 1rem;
          }

          .feature-item {
            display: flex;
            align-items: center;
            font-size: 0.85rem;
            color: #666;
          }

          .feature-item i {
            color: var(--primary-color);
          }

          .detail-item {
            font-size: 0.9rem;
          }

          .contact-form-card,
          .property-details-card {
            border: 1px solid #e9ecef;
          }

          .breadcrumb-section {
            border-bottom: 1px solid #e9ecef;
          }

          .breadcrumb-item a {
            color: var(--primary-color);
            text-decoration: none;
          }

          .breadcrumb-item a:hover {
            text-decoration: underline;
          }
        `}</style>
      </div>
    </Layout>
  );
}
