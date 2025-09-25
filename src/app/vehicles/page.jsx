'use client';

import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import Image from 'next/image';
import Link from 'next/link';
import { apiService } from '@/services/api';
import PriceDisplay from '@/components/PriceDisplay';

export default function VehiclesPage() {
  const [vehicles, setVehicles] = useState([]);
  const [filteredVehicles, setFilteredVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [vehiclesPerPage] = useState(12);

  const [filters, setFilters] = useState({
    priceRange: [0, 100000],
    makes: [],
    years: [],
    fuelTypes: [],
    transmissions: [],
    bodyTypes: [],
    sortBy: 'newest',
    viewMode: 'grid'
  });

  useEffect(() => {
    fetchVehicles();
  }, []);

  const fetchVehicles = async () => {
    try {
      setLoading(true);
      const response = await apiService.getVehicles();
      
      if (response.success && response.data) {
        setVehicles(response.data);
        setFilteredVehicles(response.data);
      } else {
        // Fallback to mock data if API fails
        console.warn('API failed, using mock data:', response.error);
        const mockVehicles = [
          {
            id: 1,
            title: '2023 BMW X5',
            slug: '2023-bmw-x5',
            price: 65000,
            year: 2023,
            mileage: 15000,
            fuel_type: 'Gasoline',
            transmission: 'Automatic',
            make: 'BMW',
            model: 'X5',
            body_type: 'SUV',
            color: 'Black',
            images: ['https://images.unsplash.com/photo-1555215695-3004980ad54e?w=400&h=300&fit=crop'],
            description: 'Luxury SUV with premium features and excellent performance.',
            is_featured: true,
            is_new: true,
            location: 'New York, NY',
            seller: 'Premium Motors'
          },
          {
            id: 2,
            title: '2022 Tesla Model 3',
            slug: '2022-tesla-model-3',
            price: 45000,
            year: 2022,
            mileage: 25000,
            fuel_type: 'Electric',
            transmission: 'Automatic',
            make: 'Tesla',
            model: 'Model 3',
            body_type: 'Sedan',
            color: 'White',
            images: ['https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=400&h=300&fit=crop'],
            description: 'Electric sedan with autopilot and premium interior.',
            is_featured: true,
            is_new: false,
            location: 'Los Angeles, CA',
            seller: 'Tesla Certified'
          },
          {
            id: 3,
            title: '2021 Ford F-150',
            slug: '2021-ford-f150',
            price: 35000,
            year: 2021,
            mileage: 45000,
            fuel_type: 'Gasoline',
            transmission: 'Automatic',
            make: 'Ford',
            model: 'F-150',
            body_type: 'Truck',
            color: 'Blue',
            images: ['https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=400&h=300&fit=crop'],
            description: 'Reliable pickup truck perfect for work and recreation.',
            is_featured: false,
            is_new: false,
            location: 'Houston, TX',
            seller: 'Ford Dealer'
          },
          {
            id: 4,
            title: '2023 Honda Civic',
            slug: '2023-honda-civic',
            price: 28000,
            year: 2023,
            mileage: 8000,
            fuel_type: 'Gasoline',
            transmission: 'Manual',
            make: 'Honda',
            model: 'Civic',
            body_type: 'Sedan',
            color: 'Silver',
            images: ['https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=400&h=300&fit=crop'],
            description: 'Compact sedan with excellent fuel economy and reliability.',
            is_featured: false,
            is_new: true,
            location: 'Chicago, IL',
            seller: 'Honda Certified'
          },
          {
            id: 5,
            title: '2022 Mercedes-Benz C-Class',
            slug: '2022-mercedes-benz-c-class',
            price: 55000,
            year: 2022,
            mileage: 18000,
            fuel_type: 'Gasoline',
            transmission: 'Automatic',
            make: 'Mercedes-Benz',
            model: 'C-Class',
            body_type: 'Sedan',
            color: 'Gray',
            images: ['https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=400&h=300&fit=crop'],
            description: 'Luxury sedan with advanced technology and comfort features.',
            is_featured: true,
            is_new: false,
            location: 'Miami, FL',
            seller: 'Mercedes Dealer'
          },
          {
            id: 6,
            title: '2023 Toyota Camry',
            slug: '2023-toyota-camry',
            price: 32000,
            year: 2023,
            mileage: 12000,
            fuel_type: 'Hybrid',
            transmission: 'Automatic',
            make: 'Toyota',
            model: 'Camry',
            body_type: 'Sedan',
            color: 'Red',
            images: ['https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=400&h=300&fit=crop'],
            description: 'Hybrid sedan with excellent fuel efficiency and reliability.',
            is_featured: false,
            is_new: true,
            location: 'Seattle, WA',
            seller: 'Toyota Certified'
          }
        ];
        
        setVehicles(mockVehicles);
        setFilteredVehicles(mockVehicles);
      }
    } catch (err) {
      setError('Error loading vehicles');
      console.error('Error fetching vehicles:', err);
    } finally {
      setLoading(false);
    }
  };

  // Get filter options from actual vehicle data
  const getFilterOptions = () => {
    const allMakes = new Set();
    const allYears = new Set();
    const allFuelTypes = new Set();
    const allTransmissions = new Set();
    const allBodyTypes = new Set();
    
    vehicles.forEach(vehicle => {
      if (vehicle.make) allMakes.add(vehicle.make);
      if (vehicle.year) allYears.add(vehicle.year);
      if (vehicle.fuel_type) allFuelTypes.add(vehicle.fuel_type);
      if (vehicle.transmission) allTransmissions.add(vehicle.transmission);
      if (vehicle.body_type) allBodyTypes.add(vehicle.body_type);
    });

    return {
      makes: Array.from(allMakes).sort(),
      years: Array.from(allYears).sort((a, b) => b - a),
      fuelTypes: Array.from(allFuelTypes).sort(),
      transmissions: Array.from(allTransmissions).sort(),
      bodyTypes: Array.from(allBodyTypes).sort()
    };
  };

  const filterOptions = getFilterOptions();

  // Helper function to safely get vehicle image
  const getVehicleImage = (vehicle) => {
    const fallbackImage = 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=300&h=200&fit=crop&crop=center';
    
    if (!vehicle.images) {
      return fallbackImage;
    }

    // If it's already a valid URL string, return it
    if (typeof vehicle.images === 'string') {
      try {
        new URL(vehicle.images);
        return vehicle.images;
      } catch {
        return fallbackImage;
      }
    }

    // If it's an array, get the first valid image
    if (Array.isArray(vehicle.images)) {
      for (const image of vehicle.images) {
        if (typeof image === 'string') {
          try {
            new URL(image);
            return image;
          } catch {
            continue;
          }
        }
      }
    }

    return fallbackImage;
  };

  // Filter vehicles based on current filters
  useEffect(() => {
    let filtered = [...vehicles];

    // Filter by price range
    filtered = filtered.filter(vehicle => {
      const price = parseFloat(vehicle.price || 0);
      return price >= filters.priceRange[0] && price <= filters.priceRange[1];
    });

    // Filter by makes
    if (filters.makes.length > 0) {
      filtered = filtered.filter(vehicle => filters.makes.includes(vehicle.make));
    }

    // Filter by years
    if (filters.years.length > 0) {
      filtered = filtered.filter(vehicle => filters.years.includes(vehicle.year));
    }

    // Filter by fuel types
    if (filters.fuelTypes.length > 0) {
      filtered = filtered.filter(vehicle => filters.fuelTypes.includes(vehicle.fuel_type));
    }

    // Filter by transmissions
    if (filters.transmissions.length > 0) {
      filtered = filtered.filter(vehicle => filters.transmissions.includes(vehicle.transmission));
    }

    // Filter by body types
    if (filters.bodyTypes.length > 0) {
      filtered = filtered.filter(vehicle => filters.bodyTypes.includes(vehicle.body_type));
    }

    // Sort vehicles
    filtered.sort((a, b) => {
      switch (filters.sortBy) {
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'year-new':
          return b.year - a.year;
        case 'year-old':
          return a.year - b.year;
        case 'mileage-low':
          return a.mileage - b.mileage;
        case 'mileage-high':
          return b.mileage - a.mileage;
        default:
          return b.id - a.id;
      }
    });

    setFilteredVehicles(filtered);
    setCurrentPage(1);
  }, [vehicles, filters]);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleCheckboxChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: prev[key].includes(value)
        ? prev[key].filter(item => item !== value)
        : [...prev[key], value]
    }));
  };

  const clearFilters = () => {
    setFilters({
      priceRange: [0, 100000],
      makes: [],
      years: [],
      fuelTypes: [],
      transmissions: [],
      bodyTypes: [],
      sortBy: 'newest',
      viewMode: 'grid'
    });
  };

  // Pagination
  const indexOfLastVehicle = currentPage * vehiclesPerPage;
  const indexOfFirstVehicle = indexOfLastVehicle - vehiclesPerPage;
  const currentVehicles = filteredVehicles.slice(indexOfFirstVehicle, indexOfLastVehicle);
  const totalPages = Math.ceil(filteredVehicles.length / vehiclesPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  if (loading) {
    return (
      <Layout>
        <div className="container py-5 text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3">Loading vehicles...</p>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="container py-5 text-center">
          <div className="alert alert-danger" role="alert">
            <h4 className="alert-heading">Error!</h4>
            <p>{error}</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="vehicles-page py-5">
        <div className="container">
          {/* Breadcrumb */}
          <nav aria-label="breadcrumb" className="mb-4">
            <ol className="breadcrumb">
              <li className="breadcrumb-item"><Link href="/">Home</Link></li>
              <li className="breadcrumb-item active" aria-current="page">Vehicles</li>
            </ol>
          </nav>

          {/* Page Header */}
          <div className="row mb-4">
            <div className="col-12">
              <div className="page-header d-flex justify-content-between align-items-center">
                <div>
                  <h1 className="page-title">Vehicles</h1>
                  <p className="page-subtitle">
                    Showing {indexOfFirstVehicle + 1}-{Math.min(indexOfLastVehicle, filteredVehicles.length)} of {filteredVehicles.length} vehicles
                  </p>
                </div>
                <div className="shop-controls d-flex align-items-center gap-3">
                  <div className="sort-controls">
                    <select 
                      className="form-select" 
                      value={filters.sortBy}
                      onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                    >
                      <option value="newest">Newest First</option>
                      <option value="price-low">Price: Low to High</option>
                      <option value="price-high">Price: High to Low</option>
                      <option value="year-new">Year: Newest</option>
                      <option value="year-old">Year: Oldest</option>
                      <option value="mileage-low">Mileage: Low to High</option>
                      <option value="mileage-high">Mileage: High to Low</option>
                    </select>
                  </div>
                  <div className="view-mode">
                    <button 
                      className={`btn btn-outline-secondary ${filters.viewMode === 'grid' ? 'active' : ''}`}
                      onClick={() => handleFilterChange('viewMode', 'grid')}
                    >
                      <i className="fas fa-th"></i>
                    </button>
                    <button 
                      className={`btn btn-outline-secondary ${filters.viewMode === 'list' ? 'active' : ''}`}
                      onClick={() => handleFilterChange('viewMode', 'list')}
                    >
                      <i className="fas fa-list"></i>
                    </button>
                  </div>
                  <button 
                    className="btn btn-primary d-lg-none"
                    onClick={() => setShowFilters(!showFilters)}
                  >
                    <i className="fas fa-filter me-2"></i>Filters
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="row">
            {/* Sidebar Filters */}
            <div className={`col-lg-3 ${showFilters ? 'd-block' : 'd-none d-lg-block'}`}>
              <div className="vehicles-sidebar">
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
                      max="100000"
                      step="1000"
                      value={filters.priceRange[1]}
                      onChange={(e) => handleFilterChange('priceRange', [filters.priceRange[0], parseInt(e.target.value)])}
                    />
                    <div className="price-values d-flex justify-content-between">
                      <span>${filters.priceRange[0].toLocaleString()}</span>
                      <span>${filters.priceRange[1].toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                {/* Make Filter */}
                <div className="filter-section mb-4">
                  <h6 className="filter-title">Make</h6>
                  <div className="make-options">
                    {filterOptions.makes.map(make => (
                      <label key={make} className="make-option">
                        <input
                          type="checkbox"
                          checked={filters.makes.includes(make)}
                          onChange={() => handleCheckboxChange('makes', make)}
                        />
                        <span className="make-name">{make}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Year Filter */}
                <div className="filter-section mb-4">
                  <h6 className="filter-title">Year</h6>
                  <div className="year-options">
                    {filterOptions.years.map(year => (
                      <label key={year} className="year-option">
                        <input
                          type="checkbox"
                          checked={filters.years.includes(year)}
                          onChange={() => handleCheckboxChange('years', year)}
                        />
                        <span className="year-name">{year}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Fuel Type Filter */}
                <div className="filter-section mb-4">
                  <h6 className="filter-title">Fuel Type</h6>
                  <div className="fuel-options">
                    {filterOptions.fuelTypes.map(fuelType => (
                      <label key={fuelType} className="fuel-option">
                        <input
                          type="checkbox"
                          checked={filters.fuelTypes.includes(fuelType)}
                          onChange={() => handleCheckboxChange('fuelTypes', fuelType)}
                        />
                        <span className="fuel-name">{fuelType}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Transmission Filter */}
                <div className="filter-section mb-4">
                  <h6 className="filter-title">Transmission</h6>
                  <div className="transmission-options">
                    {filterOptions.transmissions.map(transmission => (
                      <label key={transmission} className="transmission-option">
                        <input
                          type="checkbox"
                          checked={filters.transmissions.includes(transmission)}
                          onChange={() => handleCheckboxChange('transmissions', transmission)}
                        />
                        <span className="transmission-name">{transmission}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Body Type Filter */}
                <div className="filter-section mb-4">
                  <h6 className="filter-title">Body Type</h6>
                  <div className="bodytype-options">
                    {filterOptions.bodyTypes.map(bodyType => (
                      <label key={bodyType} className="bodytype-option">
                        <input
                          type="checkbox"
                          checked={filters.bodyTypes.includes(bodyType)}
                          onChange={() => handleCheckboxChange('bodyTypes', bodyType)}
                        />
                        <span className="bodytype-name">{bodyType}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Vehicles Grid */}
            <div className="col-lg-9">
              <div className={`vehicles-grid ${filters.viewMode === 'list' ? 'list-view' : 'grid-view'}`}>
                <div className="row g-4">
                  {currentVehicles.map((vehicle) => (
                    <div key={vehicle.id} className={filters.viewMode === 'list' ? 'col-12' : 'col-lg-4 col-md-6 col-sm-6 col-12'}>
                      <div className="vehicle-card">
                        <div className="vehicle-image-wrapper">
                          <Link href={`/vehicles/${vehicle.slug}`}>
                            <div className="vehicle-image">
                              <Image
                                src={getVehicleImage(vehicle)}
                                alt={vehicle.title}
                                width={filters.viewMode === 'list' ? 200 : 300}
                                height={filters.viewMode === 'list' ? 200 : 200}
                                className="img-fluid"
                              />
                            </div>
                          </Link>
                          
                          {/* Vehicle Badges */}
                          <div className="vehicle-badges">
                            {vehicle.is_featured && (
                              <span className="badge badge-featured">
                                <i className="fas fa-crown"></i>
                                Featured
                              </span>
                            )}
                            {vehicle.is_new && (
                              <span className="badge badge-new">
                                <i className="fas fa-star"></i>
                                New
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="vehicle-info">
                          <h4 className="vehicle-title">
                            <Link href={`/vehicles/${vehicle.slug}`}>{vehicle.title}</Link>
                          </h4>

                          {/* Vehicle Specs */}
                          <div className="vehicle-specs">
                            <div className="spec-row">
                              <span className="spec-item">
                                <i className="fas fa-calendar"></i>
                                <span className="spec-value">{vehicle.year}</span>
                              </span>
                              <span className="spec-item">
                                <i className="fas fa-tachometer-alt"></i>
                                <span className="spec-value">{vehicle.mileage?.toLocaleString()} mi</span>
                              </span>
                            </div>
                            <div className="spec-row">
                              <span className="spec-item">
                                <i className="fas fa-gas-pump"></i>
                                <span className="spec-value">{vehicle.fuel_type}</span>
                              </span>
                              <span className="spec-item">
                                <i className="fas fa-cogs"></i>
                                <span className="spec-value">{vehicle.transmission}</span>
                              </span>
                            </div>
                          </div>
                          
                          <div className="vehicle-price">
                            <PriceDisplay 
                              amount={parseFloat(vehicle.price?.toString() || '0')} 
                              className="current-price"
                              fromCurrency="USD"
                            />
                          </div>

                          {/* Location and Seller */}
                          <div className="vehicle-meta">
                            <div className="location">
                              <i className="fas fa-map-marker-alt"></i>
                              <span>{vehicle.location || 'N/A'}</span>
                            </div>
                            <div className="seller">
                              <i className="fas fa-user"></i>
                              <span>{vehicle.seller || 'Dealer'}</span>
                            </div>
                          </div>

                          {/* Action Buttons */}
                          <div className="vehicle-actions">
                            <Link href={`/vehicles/${vehicle.slug}`} className="btn btn-primary btn-sm">
                              <i className="fas fa-eye"></i>
                              View Details
                            </Link>
                            <button className="btn btn-outline-secondary btn-sm">
                              <i className="fas fa-heart"></i>
                              Save
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
                    <nav aria-label="Vehicles pagination">
                      <ul className="pagination justify-content-center">
                        <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                          <button 
                            className="page-link" 
                            onClick={() => paginate(currentPage - 1)}
                            disabled={currentPage === 1}
                          >
                            <i className="fas fa-chevron-left"></i>
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
                            <i className="fas fa-chevron-right"></i>
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
        .vehicles-page {
          background-color: var(--light-color);
        }

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

        .vehicles-sidebar {
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

        .make-options, .year-options, .fuel-options, .transmission-options, .bodytype-options {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .make-option, .year-option, .fuel-option, .transmission-option, .bodytype-option {
          display: flex;
          align-items: center;
          cursor: pointer;
          font-size: 14px;
        }

        .make-option input, .year-option input, .fuel-option input, .transmission-option input, .bodytype-option input {
          margin-right: 8px;
          accent-color: var(--primary-color);
        }

        .make-name, .year-name, .fuel-name, .transmission-name, .bodytype-name {
          color: var(--gray-700);
        }

        .vehicle-card {
          background: white;
          border-radius: var(--border-radius-lg);
          overflow: hidden;
          transition: all 0.3s ease;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
          height: 100%;
          display: flex;
          flex-direction: column;
        }

        .vehicle-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
        }

        .vehicle-image-wrapper {
          position: relative;
          overflow: hidden;
          height: 200px;
          flex-shrink: 0;
        }

        .vehicle-image {
          position: relative;
          height: 100%;
          overflow: hidden;
        }

        .vehicle-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.3s ease;
        }

        .vehicle-card:hover .vehicle-image img {
          transform: scale(1.05);
        }

        .vehicle-badges {
          position: absolute;
          top: 12px;
          left: 12px;
          z-index: 2;
        }

        .badge {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          font-size: 10px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          border-radius: var(--border-radius-sm);
          margin-right: 4px;
          margin-bottom: 4px;
          padding: 4px 8px;
        }

        .badge-featured {
          background: var(--primary-color);
          color: white;
        }

        .badge-new {
          background: var(--success-color);
          color: white;
        }

        .vehicle-info {
          padding: 20px;
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }

        .vehicle-title {
          margin-bottom: 12px;
        }

        .vehicle-title a {
          font-family: var(--font-family-heading);
          font-size: 16px;
          font-weight: 600;
          color: var(--secondary-color);
          text-decoration: none;
          transition: color 0.3s ease;
        }

        .vehicle-title a:hover {
          color: var(--primary-color);
        }

        .vehicle-specs {
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

        .spec-value {
          font-weight: 500;
          color: var(--secondary-color);
        }

        .vehicle-price {
          margin-bottom: 12px;
        }

        .vehicle-price .current-price {
          font-family: var(--font-family-heading);
          font-size: 18px;
          font-weight: 700;
          color: var(--primary-color);
        }

        .vehicle-meta {
          margin-bottom: 12px;
        }

        .location, .seller {
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: 12px;
          color: var(--gray-600);
          margin-bottom: 4px;
        }

        .location i, .seller i {
          font-size: 10px;
          color: var(--primary-color);
        }

        .vehicle-actions {
          display: flex;
          gap: 8px;
          margin-top: auto;
        }

        .vehicle-actions .btn {
          flex: 1;
          font-size: 12px;
          padding: 6px 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 4px;
        }

        .vehicle-actions .btn i {
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

        .vehicles-grid.list-view .vehicle-card {
          display: flex;
          align-items: center;
          padding: 20px;
          height: auto;
          flex-direction: row;
        }

        .vehicles-grid.list-view .vehicle-image-wrapper {
          flex: 0 0 200px;
          margin-right: 20px;
          height: 150px;
        }

        .vehicles-grid.list-view .vehicle-info {
          flex: 1;
          padding: 0;
        }

        @media (max-width: 991.98px) {
          .vehicles-sidebar {
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

          .vehicle-specs {
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

          .vehicle-actions {
            flex-direction: column;
            gap: 6px;
            margin-top: 8px;
          }

          .vehicle-actions .btn {
            font-size: 11px;
            padding: 8px 12px;
          }
        }
      `}</style>
    </Layout>
  );
}