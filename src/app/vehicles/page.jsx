'use client';

import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import { apiService } from '@/services/api';
import Link from 'next/link';
import { useCurrency } from '@/contexts/CurrencyLanguageContext';
import PriceDisplay from '@/components/PriceDisplay';
import { generateVehicleSlug } from '@/utils/slug';



export default function VehiclesPage() {
  // const { formatPrice } = useCurrency();
  const [vehicles, setVehicles] = useState([]);
  const [filteredVehicles, setFilteredVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    priceMin: '',
    priceMax: '',
    make: '',
    model: '',
    yearMin: '',
    yearMax: '',
    mileageMax: '',
    fuelType: '',
    transmission: '',
    bodyType: '',
    sortBy: 'newest'
  });
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchVehicles();
  }, []);

  const applyFilters = () => {
    let filtered = [...vehicles];

    // Price filter
    if (filters.priceMin) {
      filtered = filtered.filter(v => v.price >= parseFloat(filters.priceMin));
    }
    if (filters.priceMax) {
      filtered = filtered.filter(v => v.price <= parseFloat(filters.priceMax));
    }

    // Make filter
    if (filters.make) {
      filtered = filtered.filter(v => v.make.toLowerCase().includes(filters.make.toLowerCase()));
    }

    // Model filter
    if (filters.model) {
      filtered = filtered.filter(v => v.model.toLowerCase().includes(filters.model.toLowerCase()));
    }

    // Year filter
    if (filters.yearMin) {
      filtered = filtered.filter(v => v.year >= parseInt(filters.yearMin));
    }
    if (filters.yearMax) {
      filtered = filtered.filter(v => v.year <= parseInt(filters.yearMax));
    }

    // Body type filter
    if (filters.bodyType) {
      filtered = filtered.filter(v => v.body_type === filters.bodyType);
    }

    // Sort
    switch (filters.sortBy) {
      case 'price_low':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price_high':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'year_newest':
        filtered.sort((a, b) => b.year - a.year);
        break;
      case 'year_oldest':
        filtered.sort((a, b) => a.year - b.year);
        break;
      case 'mileage_low':
        filtered.sort((a, b) => (a.mileage || 0) - (b.mileage || 0));
        break;
      case 'mileage_high':
        filtered.sort((a, b) => (b.mileage || 0) - (a.mileage || 0));
        break;
      case 'newest':
        filtered.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        break;
      case 'oldest':
        filtered.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
        break;
    }

    setFilteredVehicles(filtered);
  };

  useEffect(() => {
    applyFilters();
  }, [vehicles, filters, applyFilters]);

    const fetchVehicles = async () => {
      try {
        setLoading(true);
      const response = await apiService.getVehicles();
      if (response.success) {
        setVehicles(response.data);
      } else {
        setError('Failed to fetch vehicles');
        }
      } catch (err) {
      setError('Error loading vehicles');
        console.error('Error fetching vehicles:', err);
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
      make: '',
      model: '',
      yearMin: '',
      yearMax: '',
      mileageMax: '',
      fuelType: '',
      transmission: '',
      bodyType: '',
      sortBy: 'newest'
    });
  };

  const formatMileage = (mileage) => {
    if (!mileage) return 'N/A';
    return mileage.toLocaleString() + ' miles';
  };

  const getFirstVehicleImage = (images)=> {
    if (!images) return '/images/placeholder-vehicle.jpg';
    if (Array.isArray(images)) return images[0] || '/images/placeholder-vehicle.jpg';
    if (typeof images === 'string') {
      try {
        const parsed = JSON.parse(images);
        return Array.isArray(parsed) && parsed.length > 0 ? parsed[0] : '/images/placeholder-vehicle.jpg';
      } catch {
        return images; // If it's not JSON, treat }
    }
    return '/images/placeholder-vehicle.jpg';
  };

  if (loading) {
    return (
      <Layout>
        <div className="container py-5">
          <div className="text-center">
            <div className="spinner-border" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-3">Loading vehicles...</p>
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
      <div className="vehicles-page">
        {/* Hero Section */}
        <div className="page-hero bg-light py-5">
          <div className="container">
            <div className="row align-items-center">
              <div className="col-lg-8">
                <h1 className="page-title mb-3">Vehicles for Sale</h1>
                <p className="page-subtitle text-muted mb-0">
                  Find your perfect car from our extensive collection of quality vehicles
                </p>
              </div>
              <div className="col-lg-4 text-end">
                <div className="results-count">
                  <span className="badge bg-primary fs-6">
                    {filteredVehicles.length} Vehicles Found
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

                  {/* Make */}
                  <div className="filter-group mb-4">
                    <h6 className="filter-title">Make</h6>
                    <input
                      type="text"
                      className="form-control form-control-sm"
                      placeholder="e.g., Toyota, BMW"
                      value={filters.make}
                      onChange={(e) => handleFilterChange('make', e.target.value)}
                    />
                  </div>

                  {/* Model */}
                  <div className="filter-group mb-4">
                    <h6 className="filter-title">Model</h6>
                    <input
                      type="text"
                      className="form-control form-control-sm"
                      placeholder="e.g., Camry, X5"
                      value={filters.model}
                      onChange={(e) => handleFilterChange('model', e.target.value)}
                    />
                  </div>

                  {/* Year Range */}
                  <div className="filter-group mb-4">
                    <h6 className="filter-title">Year Range</h6>
                    <div className="row g-2">
                      <div className="col-6">
                        <input
                          type="number"
                          className="form-control form-control-sm"
                          placeholder="Min Year"
                          value={filters.yearMin}
                          onChange={(e) => handleFilterChange('yearMin', e.target.value)}
                        />
                      </div>
                      <div className="col-6">
                        <input
                          type="number"
                          className="form-control form-control-sm"
                          placeholder="Max Year"
                          value={filters.yearMax}
                          onChange={(e) => handleFilterChange('yearMax', e.target.value)}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Mileage */}
                  <div className="filter-group mb-4">
                    <h6 className="filter-title">Max Mileage</h6>
                    <input
                      type="number"
                      className="form-control form-control-sm"
                      placeholder="e.g., 50000"
                      value={filters.mileageMax}
                      onChange={(e) => handleFilterChange('mileageMax', e.target.value)}
                    />
                  </div>

                  {/* Fuel Type */}
                  <div className="filter-group mb-4">
                    <h6 className="filter-title">Fuel Type</h6>
                    <select
                      className="form-select form-select-sm"
                      value={filters.fuelType}
                      onChange={(e) => handleFilterChange('fuelType', e.target.value)}
                    >
                      <option value="">All Types</option>
                      <option value="gasoline">Gasoline</option>
                      <option value="diesel">Diesel</option>
                      <option value="hybrid">Hybrid</option>
                      <option value="electric">Electric</option>
                    </select>
                  </div>

                  {/* Transmission */}
                  <div className="filter-group mb-4">
                    <h6 className="filter-title">Transmission</h6>
                    <select
                      className="form-select form-select-sm"
                      value={filters.transmission}
                      onChange={(e) => handleFilterChange('transmission', e.target.value)}
                    >
                      <option value="">All Types</option>
                      <option value="automatic">Automatic</option>
                      <option value="manual">Manual</option>
                      <option value="cvt">CVT</option>
                    </select>
                  </div>

                  {/* Body Type */}
                  <div className="filter-group mb-4">
                    <h6 className="filter-title">Body Type</h6>
                    <select
                      className="form-select form-select-sm"
                      value={filters.bodyType}
                      onChange={(e) => handleFilterChange('bodyType', e.target.value)}
                    >
                      <option value="">All Types</option>
                      <option value="sedan">Sedan</option>
                      <option value="suv">SUV</option>
                      <option value="truck">Truck</option>
                      <option value="coupe">Coupe</option>
                      <option value="convertible">Convertible</option>
                      <option value="hatchback">Hatchback</option>
                      <option value="wagon">Wagon</option>
                    </select>
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
                      <option value="price_low">Price: Low to High</option>
                      <option value="price_high">Price: High to Low</option>
                      <option value="year_new">Year: Newest</option>
                      <option value="year_old">Year: Oldest</option>
                      <option value="mileage_low">Mileage: Low to High</option>
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

            {/* Vehicles Grid */}
            <div className="col-lg-9">
              <div className="vehicles-grid">
                {filteredVehicles.length === 0 ? (
                  <div className="text-center py-5">
                    <i className="f-car fa-3x text-muted mb-3"></i>
                    <h5 className="text-muted">No vehicles found</h5>
                    <p className="text-muted">Try adjusting your filters to see more results.</p>
                  </div>
                ) : (
                  <div className="row g-4">
                    {filteredVehicles.map((vehicle) => (
                      <div key={vehicle.id} className="col-md-6 col-xl-4">
                        <div className="vehicle-card h-100">
                          <div className="vehicle-image">
                            <Link href={`/vehicles/${generateVehicleSlug(vehicle.id, vehicle.make, vehicle.model, vehicle.year)}`}>
                              <img
                                src={getFirstVehicleImage(vehicle.images)}
                                alt={`${vehicle.year} ${vehicle.make} ${vehicle.model}`}
                                className="img-fluid"
                              />
                            </Link>
                            <div className="vehicle-badge">
                              <span className="badge bg-primary">{vehicle.body_type}</span>
                            </div>
                            <div className="vehicle-price">
                              <PriceDisplay 
                                amount={vehicle.price} 
                                className="price-amount"
                                fromCurrency="USD"
                              />
                            </div>
                          </div>
                          <div className="vehicle-content">
                            <h5 className="vehicle-title">
                              <Link href={`/vehicles/${generateVehicleSlug(vehicle.id, vehicle.make, vehicle.model, vehicle.year)}`}>
                                {vehicle.year} {vehicle.make} {vehicle.model}
                              </Link>
                            </h5>
                            <p className="vehicle-location text-muted">
                              <i className="f-map-marker-alt me-1"></i>
                              {vehicle.vendor_name || 'Dealer'}
                            </p>
                            <div className="vehicle-features">
                              <div className="feature-item">
                                <i className="f-tachometer-alt me-1"></i>
                                <span>{formatMileage(vehicle.mileage)}</span>
                              </div>
                              <div className="feature-item">
                                <i className="f-gas-pump me-1"></i>
                                <span>{vehicle.fuel_type}</span>
                              </div>
                              <div className="feature-item">
                                <i className="f-cog me-1"></i>
                                <span>{vehicle.transmission}</span>
                              </div>
                            </div>
                            <div className="vehicle-meta">
                              <small className="text-muted">
                                Listed {new Date(vehicle.created_at).toLocaleDateString()}
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
          
          .vehicle-card {
            background: #fff;
            border-radius;
            overflow;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
            transition: transform 0.3s ease, box-shadow 0.3s ease;
          }
          
          .vehicle-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 5px 20px rgba(0, 0, 0, 0.15);
          }
          
          .vehicle-image {
            position;
            overflow;
            height;
          }
          
          .vehicle-image img {
            width: 100%;
            height: 100%;
            object-fit;
            transition: transform 0.3s ease;
          }
          
          .vehicle-card:hover .vehicle-image img {
            transform: scale(1.05);
          }
          
          .vehicle-badge {
            position;
            top;
            left;
          }
          
          .vehicle-price {
            position;
            bottom;
            left;
            background: rgba(0, 0, 0, 0.8);
            color;
            padding: 0.5rem 1rem;
            border-radius;
            font-weight;
          }
          
          .vehicle-content {
            padding: 1.5rem;
          }
          
          .vehicle-title {
            font-family: 'Poppins', sans-serif;
            font-weight;
            margin-bottom: 0.5rem;
          }
          
          .vehicle-title a {
            color: #000;
            text-decoration;
          }
          
          .vehicle-title a:hover {
            color: var(--primary-color);
          }
          
          .vehicle-location {
            font-size: 0.9rem;
            margin-bottom;
          }
          
          .vehicle-features {
            display;
            gap;
            margin-bottom;
            flex-wrap;
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
          
          .vehicle-meta {
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
}}
