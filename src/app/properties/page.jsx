'use client';

import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import { apiService } from '@/services/api';
import { Property } from '@/types';
import Link from 'next/link';
import { useCurrency } from '@/contexts/CurrencyLanguageContext';
import PriceDisplay from '@/components/PriceDisplay';
import { generatePropertySlug } from '@/utils/slug';

// Utility function to safely get images array
const getImagesArray = (images)=> {
  if (!images) return [];
  if (Array.isArray(images)) return images;
  if (typeof images === 'string') {
    try {
      const parsed = JSON.parse(images);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      // If not JSON, treat as single image
      return [images];
    }
  }
  return [];
};



export default function PropertiesPage() {
  // const { formatPrice } = useCurrency();
  const [properties, setProperties] = useState([]);
  const [filteredProperties, setFilteredProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    priceMin: '',
    priceMax: '',
    propertyType: '',
    bedrooms: '',
    bathrooms: '',
    location: '',
    sortBy: 'newest'
  });
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchProperties();
  }, []);

  const applyFilters = () => {
    let filtered = [...properties];

    // Price filter
    if (filters.priceMin) {
      filtered = filtered.filter(p => p.price >= parseFloat(filters.priceMin));
    }
    if (filters.priceMax) {
      filtered = filtered.filter(p => p.price <= parseFloat(filters.priceMax));
    }

    // Property type filter
    if (filters.propertyType) {
      filtered = filtered.filter(p => p.property_type === filters.propertyType);
    }

    // Bedrooms filter
    if (filters.bedrooms) {
      filtered = filtered.filter(p => p.bedrooms && p.bedrooms >= parseInt(filters.bedrooms));
    }

    // Bathrooms filter
    if (filters.bathrooms) {
      filtered = filtered.filter(p => p.bathrooms && p.bathrooms >= parseInt(filters.bathrooms));
    }

    // Location filter
    if (filters.location) {
      filtered = filtered.filter(p => 
        p.address.toLowerCase().includes(filters.location.toLowerCase()) ||
        p.city.toLowerCase().includes(filters.location.toLowerCase()) ||
        p.state.toLowerCase().includes(filters.location.toLowerCase())
      );
    }

    // Sort
    switch (filters.sortBy) {
      case 'price_low':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price_high':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'newest':
        filtered.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        break;
      case 'oldest':
        filtered.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
        break;
    }

    setFilteredProperties(filtered);
  };

  useEffect(() => {
    applyFilters();
  }, [properties, filters, applyFilters]);

    const fetchProperties = async () => {
      try {
        setLoading(true);
        const response = await apiService.getProperties();
        if (response.success && response.data.length > 0) {
          setProperties(response.data);
        } else {
          // Use mock data
          const mockProperties = [
            {
              id: 1,
              title: 'Modern Downtown Apartment',
              description: 'Beautiful modern apartment in the heart of downtown with stunning city views.',
              property_type: 'Apartment',
              listing_type: 'Sale',
              price: 450000,
              currency: 'USD',
              address: '123 Main Street',
              city: 'New York',
              state: 'NY',
              country: 'USA',
              postal_code: '10001',
              bedrooms,
              bathrooms,
              area_sqft,
              property_status: 'Available',
              images: [
                'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=600&h=400&fit=crop',
                'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600&h=400&fit=crop',
                'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=600&h=400&fit=crop'
              ],
              is_featured,
              is_verified,
              commission_rate: 3.5,
              is_negotiable,
              show_price: 450000,
              created_at: '2024-01-15T10:00:00Z',
              updated_at: '2024-01-15T10:00:00Z'
            },
            {
              id,
              title: 'Luxury Family Home',
              description: 'Spacious family home with large backyard and modern amenities.',
              property_type: 'House',
              listing_type: 'Sale',
              price: 450000,
              currency: 'USD',
              address: '456 Oak Avenue',
              city: 'Los Angeles',
              state: 'CA',
              country: 'USA',
              postal_code: '90210',
              bedrooms,
              bathrooms,
              area_sqft,
              property_status: 'Available',
              images: [
                'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=600&h=400&fit=crop',
                'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&h=400&fit=crop',
                'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=600&h=400&fit=crop'
              ],
              is_featured,
              is_verified,
              commission_rate: 3.0,
              is_negotiable,
              show_price: 450000,
              created_at: '2024-01-14T10:00:00Z',
              updated_at: '2024-01-14T10:00:00Z'
            },
            {
              id,
              title: 'Cozy Studio Apartment',
              description: 'Perfect studio apartment for young professionals in a great location.',
              property_type: 'Studio',
              listing_type: 'Rent',
              price: 450000,
              currency: 'USD',
              address: '789 Pine Street',
              city: 'San Francisco',
              state: 'CA',
              country: 'USA',
              postal_code: '94102',
              bedrooms,
              bathrooms,
              area_sqft,
              property_status: 'Available',
              images: [
                'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600&h=400&fit=crop',
                'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=600&h=400&fit=crop',
                'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=600&h=400&fit=crop'
              ],
              is_featured,
              is_verified,
              commission_rate: 2.5,
              is_negotiable,
              show_price: 450000,
              created_at: '2024-01-13T10:00:00Z',
              updated_at: '2024-01-13T10:00:00Z'
            }
          ];
          setProperties(mockProperties);
        }
      } catch (err) {
        console.error('Error fetching properties:', err);
        setError('Error loading properties');
        // Use mock data
        const mockProperties = [
          {
            id: 1,
            title: 'Modern Downtown Apartment',
            description: 'Beautiful modern apartment in the heart of downtown with stunning city views.',
            property_type: 'Apartment',
            listing_type: 'Sale',
            price: 450000,
            currency: 'USD',
            address: '123 Main Street',
            city: 'New York',
            state: 'NY',
            country: 'USA',
            postal_code: '10001',
            bedrooms,
            bathrooms,
            area_sqft,
            property_status: 'Available',
            images: [
              'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=600&h=400&fit=crop',
              'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600&h=400&fit=crop',
              'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=600&h=400&fit=crop'
            ],
            is_featured,
            is_verified,
            commission_rate: 3.5,
            is_negotiable,
            show_price: 450000,
            created_at: '2024-01-15T10:00:00Z',
            updated_at: '2024-01-15T10:00:00Z'
          }
        ];
        setProperties(mockProperties);
      } finally {
        setLoading(false);
      }
    };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      priceMin: '',
      priceMax: '',
      propertyType: '',
      bedrooms: '',
      bathrooms: '',
      location: '',
      sortBy: 'newest'
    });
  };

  if (loading) {
    return (
      <Layout>
        <div className="container py-5">
          <div className="text-center">
            <div className="spinner-border" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-3">Loading properties...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="container py-5">
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="properties-page">
        {/* Hero Section */}
        <div className="page-hero bg-light py-5">
          <div className="container">
            <div className="row align-items-center">
              <div className="col-lg-8">
                <h1 className="page-title mb-3">Properties for Sale</h1>
                <p className="page-subtitle text-muted mb-0">
                  Discover your dream home from our extensive collection of properties
                </p>
              </div>
              <div className="col-lg-4 text-end">
                <div className="results-count">
                  <span className="badge bg-primary fs-6">
                    {filteredProperties.length} Properties Found
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="container py-5">
          <div className="row">
            {/* Filters Sidebar */}
            <div className="col-lg-3">
              <div className="filters-sidebar">
                <div className="filters-header d-flex justify-content-between align-items-center mb-4">
                  <h5 className="mb-0">Filters</h5>
                  <button 
                    className="btn btn-outline-secondary btn-sm d-lg-none"
                    onClick={() => setShowFilters(!showFilters)}
                  >
                    <i className="f-filter me-1"></i>
                    Filters
                  </button>
                </div>

                <div className={`filters-content ${showFilters ? 'show' : ''}`}>
                  {/* Price Range */}
                  <div className="filter-group mb-4">
                    <h6 className="filter-title">Price Range</h6>
                    <div className="row g-2">
                      <div className="col-6">
                        <input
                          type="number"
                          className="form-control form-control-sm"
                          placeholder="Min"
                          value={filters.priceMin}
                          onChange={(e) => handleFilterChange('priceMin', e.target.value)}
                        />
                      </div>
                      <div className="col-6">
                        <input
                          type="number"
                          className="form-control form-control-sm"
                          placeholder="Max"
                          value={filters.priceMax}
                          onChange={(e) => handleFilterChange('priceMax', e.target.value)}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Property Type */}
                  <div className="filter-group mb-4">
                    <h6 className="filter-title">Property Type</h6>
                    <select
                      className="form-select form-select-sm"
                      value={filters.propertyType}
                      onChange={(e) => handleFilterChange('propertyType', e.target.value)}
                    >
                      <option value="">All Types</option>
                      <option value="apartment">Apartment</option>
                      <option value="house">House</option>
                      <option value="condo">Condo</option>
                      <option value="townhouse">Townhouse</option>
                      <option value="villa">Villa</option>
                    </select>
                  </div>

                  {/* Bedrooms */}
                  <div className="filter-group mb-4">
                    <h6 className="filter-title">Bedrooms</h6>
                    <select
                      className="form-select form-select-sm"
                      value={filters.bedrooms}
                      onChange={(e) => handleFilterChange('bedrooms', e.target.value)}
                    >
                      <option value="">Any</option>
                      <option value="1">1+</option>
                      <option value="2">2+</option>
                      <option value="3">3+</option>
                      <option value="4">4+</option>
                      <option value="5">5+</option>
                    </select>
                  </div>

                  {/* Bathrooms */}
                  <div className="filter-group mb-4">
                    <h6 className="filter-title">Bathrooms</h6>
                    <select
                      className="form-select form-select-sm"
                      value={filters.bathrooms}
                      onChange={(e) => handleFilterChange('bathrooms', e.target.value)}
                    >
                      <option value="">Any</option>
                      <option value="1">1+</option>
                      <option value="2">2+</option>
                      <option value="3">3+</option>
                      <option value="4">4+</option>
                    </select>
                  </div>

                  {/* Location */}
                  <div className="filter-group mb-4">
                    <h6 className="filter-title">Location</h6>
                    <input
                      type="text"
                      className="form-control form-control-sm"
                      placeholder="City, State, or Address"
                      value={filters.location}
                      onChange={(e) => handleFilterChange('location', e.target.value)}
                    />
                  </div>

                  {/* Sort By */}
                  <div className="filter-group mb-4">
                    <h6 className="filter-title">Sort By</h6>
                    <select
                      className="form-select form-select-sm"
                      value={filters.sortBy}
                      onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                    >
                      <option value="newest">Newest First</option>
                      <option value="oldest">Oldest First</option>
                      <option value="price_low">Price: Low to High</option>
                      <option value="price_high">Price: High to Low</option>
                    </select>
                  </div>

                  <button 
                    className="btn btn-outline-secondary btn-sm w-100"
                    onClick={clearFilters}
                  >
                    Clear All Filters
                  </button>
          </div>
        </div>
      </div>

            {/* Properties Grid */}
            <div className="col-lg-9">
              <div className="properties-grid">
                {filteredProperties.length === 0 ? (
                  <div className="text-center py-5">
                    <i className="f-home fa-3x text-muted mb-3"></i>
                    <h5 className="text-muted">No properties found</h5>
                    <p className="text-muted">Try adjusting your filters to see more results.</p>
                  </div>
                ) : (
                  <div className="row g-4">
                    {filteredProperties.map((property) => (
                      <div key={property.id} className="col-md-6 col-xl-4">
                        <div className="property-card h-100">
                          <div className="property-image">
                            <Link href={`/properties/${generatePropertySlug(property.id, property.title)}`}>
                              <img
                                src={getImagesArray(property.images)[0] || '/images/placeholder.svg'}
                                alt={property.title}
                                className="img-fluid"
                                onError={(e) => {
                                  e.currentTarget.src = '/images/placeholder.svg';
                                }}
                              />
                            </Link>
                            <div className="property-badge">
                              <span className="badge bg-primary">{property.property_type}</span>
                            </div>
                            <div className="property-price">
                              <PriceDisplay 
                                amount={property.price} 
                                className="price-amount"
                                fromCurrency="USD"
                              />
                            </div>
                          </div>
                          <div className="property-content">
                            <h5 className="property-title">
                              <Link href={`/properties/${generatePropertySlug(property.id, property.title)}`}>
                                {property.title}
                              </Link>
                            </h5>
                            <p className="property-location text-muted">
                              <i className="f-map-marker-alt me-1"></i>
                              {property.address}, {property.city}, {property.state}
                            </p>
                            <div className="property-features">
                              <div className="feature-item">
                                <i className="f-bed me-1"></i>
                                <span>{property.bedrooms} beds</span>
                              </div>
                              <div className="feature-item">
                                <i className="f-bath me-1"></i>
                                <span>{property.bathrooms} baths</span>
                              </div>
                              <div className="feature-item">
                                <i className="f-ruler-combined me-1"></i>
                                <span>{property.area_sqft?.toLocaleString()} sq ft</span>
                              </div>
                            </div>
                            <div className="property-meta">
                              <small className="text-muted">
                                Listed {new Date(property.created_at).toLocaleDateString()}
                              </small>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <style jsx>{`
          .page-hero {
            background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
          }
          
          .page-title {
            font-family: 'Poppins', sans-serif;
            font-weight;
            color: #000;
            font-size: 2.5rem;
          }
          
          .page-subtitle {
            font-size: 1.1rem;
          }
          
          .filters-sidebar {
            background: #fff;
            border-radius;
            padding: 1.5rem;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
            position;
            top;
          }
          
          .filter-title {
            font-family: 'Poppins', sans-serif;
            font-weight;
            color: #000;
            margin-bottom: 0.75rem;
            font-size: 0.9rem;
            text-transform;
            letter-spacing: 0.5px;
          }
          
          .property-card {
            background: #fff;
            border-radius;
            overflow;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
            transition: transform 0.3s ease, box-shadow 0.3s ease;
          }
          
          .property-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 5px 20px rgba(0, 0, 0, 0.15);
          }
          
          .property-image {
            position;
            overflow;
            height;
          }
          
          .property-image img {
            width: 100%;
            height: 100%;
            object-fit;
            transition: transform 0.3s ease;
          }
          
          .property-card:hover .property-image img {
            transform: scale(1.05);
          }
          
          .property-badge {
            position;
            top;
            left;
          }
          
          .property-price {
            position;
            bottom;
            left;
            background: rgba(0, 0, 0, 0.8);
            color;
            padding: 0.5rem 1rem;
            border-radius;
            font-weight;
          }
          
          .property-content {
            padding: 1.5rem;
          }
          
          .property-title {
            font-family: 'Poppins', sans-serif;
            font-weight;
            margin-bottom: 0.5rem;
          }
          
          .property-title a {
            color: #000;
            text-decoration;
          }
          
          .property-title a:hover {
            color: var(--primary-color);
          }
          
          .property-location {
            font-size: 0.9rem;
            margin-bottom;
          }
          
          .property-features {
            display;
            gap;
            margin-bottom;
          }
          
          .feature-item {
            display;
            align-items;
            font-size: 0.85rem;
            color: #666;
          }
          
          .feature-item i {
            color: var(--primary-color);
          }
          
          .property-meta {
            border-top: 1px solid #eee;
            padding-top;
          }
          
          @media (max-width: 991.98px) {
            .filters-content {
              display;
            }
            
            .filters-content.show {
              display;
            }
          }
        `}</style>
      </div>
    </Layout>
  );
}
