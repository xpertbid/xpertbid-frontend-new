'use client';

import React, { useState } from 'react';

const VehiclePage = ({ vehicle }) => {
  const [selectedImage, setSelectedImage] = useState(0);

  const images = vehicle?.images || ['/images/placeholder.svg'];

  return (
    <div className="vehicle-page">
      <div className="container py-4">
        {/* Breadcrumb */}
        <nav aria-label="breadcrumb" className="mb-4">
          <ol className="breadcrumb">
            <li className="breadcrumb-item">
              <Link href="/">Home</Link>
            </li>
            <li className="breadcrumb-item">
              <Link href="/vehicles">Vehicles</Link>
            </li>
            <li className="breadcrumb-item">
              <Link href={`/vehicles/${vehicle.make.toLowerCase()}`}>
                {vehicle.make}
              </Link>
            </li>
            <li className="breadcrumb-item active" aria-current="page">
              {vehicle.title}
            </li>
          </ol>
        </nav>

        <div className="row">
          {/* Vehicle Images */}
          <div className="col-lg-8">
            <div className="vehicle-images">
              {/* Main Image */}
              <div className="main-image mb-3 position-relative">
                <img
                  src={vehicle.images[selectedImage]}
                  alt={vehicle.title}
                  className="img-fluid w-100"
                  style={{ borderRadius: '8px', aspectRatio: '16/9', objectFit: 'cover' }}
                />
                
                {/* Image Counter */}
                <div className="position-absolute bottom-0 end-0 m-3">
                  <span className="badge bg-dark bg-opacity-75">
                    {selectedImage + 1} / {vehicle.images.length}
                  </span>
                </div>

                {/* View All Images Button */}
                <div className="position-absolute top-0 end-0 m-3">
                  <button
                    className="btn btn-primary"
                    onClick={() => setShowAllImages(!showAllImages)}
                  >
                    <i className="fas fa-images me-2"></i>
                    View All ({vehicle.images.length})
                  </button>
                </div>
              </div>

              {/* Thumbnail Images */}
              <div className="thumbnail-images d-flex gap-2 flex-wrap">
                {vehicle.images.slice(0, showAllImages ? vehicle.images.length : 6).map((image, index) => (
                  <img
                    key={index}
                    src={image}
                    alt={`${vehicle.title} ${index + 1}`}
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
                {!showAllImages && vehicle.images.length > 6 && (
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
                    <span className="text-muted">+{vehicle.images.length - 6}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Vehicle Details */}
            <div className="vehicle-details mt-4">
              {/* Title */}
              <h1 className="vehicle-title mb-3" style={{ 
                fontFamily: 'Poppins, sans-serif', 
                fontSize: '28px', 
                fontWeight: '600',
                color: '#000'
              }}>
                {vehicle.title}
              </h1>

              {/* Key Specs */}
              <div className="key-specs mb-4">
                <div className="row">
                  <div className="col-6 col-md-3">
                    <div className="spec-item text-center p-3 bg-light rounded">
                      <i className="fas fa-calendar text-primary mb-2" style={{ fontSize: '24px' }}></i>
                      <div className="spec-value fw-bold">{vehicle.year}</div>
                      <div className="spec-label text-muted small">Year</div>
                    </div>
                  </div>
                  <div className="col-6 col-md-3">
                    <div className="spec-item text-center p-3 bg-light rounded">
                      <i className="fas fa-tachometer-alt text-primary mb-2" style={{ fontSize: '24px' }}></i>
                      <div className="spec-value fw-bold">{vehicle.mileage.toLocaleString()} km</div>
                      <div className="spec-label text-muted small">Mileage</div>
                    </div>
                  </div>
                  <div className="col-6 col-md-3">
                    <div className="spec-item text-center p-3 bg-light rounded">
                      <i className="fas fa-gas-pump text-primary mb-2" style={{ fontSize: '24px' }}></i>
                      <div className="spec-value fw-bold">{vehicle.fuelType}</div>
                      <div className="spec-label text-muted small">Fuel Type</div>
                    </div>
                  </div>
                  <div className="col-6 col-md-3">
                    <div className="spec-item text-center p-3 bg-light rounded">
                      <i className="fas fa-cogs text-primary mb-2" style={{ fontSize: '24px' }}></i>
                      <div className="spec-value fw-bold">{vehicle.transmission}</div>
                      <div className="spec-label text-muted small">Transmission</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="description mb-4">
                <h5 className="mb-3">Description</h5>
                <p style={{ color: '#606060', lineHeight: '1.6' }}>
                  {vehicle.description}
                </p>
              </div>

              {/* Features */}
              <div className="features mb-4">
                <h5 className="mb-3">Features</h5>
                <div className="row">
                  {vehicle.features.map((feature, index) => (
                    <div key={index} className="col-md-6">
                      <div className="d-flex align-items-center mb-2">
                        <i className="fas fa-check text-success me-2"></i>
                        <span>{feature}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Specifications */}
              <div className="specifications mb-4">
                <h5 className="mb-3">Specifications</h5>
                <div className="row">
                  <div className="col-md-6">
                    <table className="table table-borderless">
                      <tbody>
                        <tr>
                          <td><strong>Engine Size:</strong></td>
                          <td>{vehicle.engineSize}</td>
                        </tr>
                        <tr>
                          <td><strong>Cylinders:</strong></td>
                          <td>{vehicle.cylinders}</td>
                        </tr>
                        <tr>
                          <td><strong>Horsepower:</strong></td>
                          <td>{vehicle.horsepower} HP</td>
                        </tr>
                        <tr>
                          <td><strong>Drivetrain:</strong></td>
                          <td>{vehicle.drivetrain}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <div className="col-md-6">
                    <table className="table table-borderless">
                      <tbody>
                        <tr>
                          <td><strong>Body Type:</strong></td>
                          <td>{vehicle.bodyType}</td>
                        </tr>
                        <tr>
                          <td><strong>Doors:</strong></td>
                          <td>{vehicle.doors}</td>
                        </tr>
                        <tr>
                          <td><strong>Seats:</strong></td>
                          <td>{vehicle.seats}</td>
                        </tr>
                        <tr>
                          <td><strong>Steering:</strong></td>
                          <td>{vehicle.steeringSide}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="col-lg-4">
            <div className="vehicle-sidebar">
              {/* Price Card */}
              <div className="price-card bg-light p-4 rounded mb-4">
                <div className="price mb-3">
                  <div className="main-price" style={{ 
                    fontSize: '32px', 
                    fontWeight: '700', 
                    color: '#43ACE9',
                    fontFamily: 'Poppins, sans-serif'
                  }}>
                    AED {vehicle.price.toLocaleString()}
                  </div>
                </div>

                <div className="vehicle-info mb-4">
                  <div className="row">
                    <div className="col-6">
                      <div className="info-item">
                        <div className="info-label text-muted small">Condition</div>
                        <div className="info-value fw-bold">{vehicle.condition}</div>
                      </div>
                    </div>
                    <div className="col-6">
                      <div className="info-item">
                        <div className="info-label text-muted small">Warranty</div>
                        <div className="info-value fw-bold">{vehicle.warranty}</div>
                      </div>
                    </div>
                    <div className="col-6">
                      <div className="info-item">
                        <div className="info-label text-muted small">Color</div>
                        <div className="info-value fw-bold">{vehicle.color}</div>
                      </div>
                    </div>
                    <div className="col-6">
                      <div className="info-item">
                        <div className="info-label text-muted small">Interior</div>
                        <div className="info-value fw-bold">{vehicle.interiorColor}</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="action-buttons d-grid gap-2">
                  <button
                    className="btn btn-primary"
                    onClick={handleContactDealer}
                    style={{
                      padding: '12px',
                      fontSize: '16px',
                      fontWeight: '600',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px'
                    }}
                  >
                    <i className="fas fa-phone me-2"></i>
                    Contact Dealer
                  </button>
                  <button
                    className="btn btn-outline-primary"
                    onClick={handleTestDrive}
                    style={{
                      padding: '12px',
                      fontSize: '16px',
                      fontWeight: '600',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px'
                    }}
                  >
                    <i className="fas fa-car me-2"></i>
                    Schedule Test Drive
                  </button>
                  <button
                    className="btn btn-outline-secondary"
                    onClick={() => setShowFinanceCalculator(!showFinanceCalculator)}
                    style={{
                      padding: '12px',
                      fontSize: '16px',
                      fontWeight: '600',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px'
                    }}
                  >
                    <i className="fas fa-calculator me-2"></i>
                    Finance Calculator
                  </button>
                </div>
              </div>

              {/* Finance Calculator */}
              {showFinanceCalculator && (
                <div className="finance-calculator border p-4 rounded mb-4">
                  <h6 className="mb-3">Finance Calculator</h6>
                  <div className="finance-options">
                    <div className="mb-3">
                      <label className="form-label">Down Payment</label>
                      <input
                        type="number"
                        className="form-control"
                        defaultValue={vehicle.financeOptions.downPayment}
                        placeholder="Enter amount"
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Loan Period (months)</label>
                      <select className="form-select">
                        <option value="12">12 months</option>
                        <option value="24">24 months</option>
                        <option value="36">36 months</option>
                        <option value="48">48 months</option>
                        <option value="60">60 months</option>
                      </select>
                    </div>
                    <div className="calculated-payment p-3 bg-light rounded">
                      <div className="text-muted small">Estimated Monthly Payment</div>
                      <div className="h4 text-primary mb-0">
                        AED {vehicle.financeOptions.monthlyPayment.toLocaleString()}
                      </div>
                    </div>
                    <button
                      className="btn btn-primary w-100 mt-3"
                      onClick={handleFinanceInquiry}
                    >
                      Apply for Finance
                    </button>
                  </div>
                </div>
              )}

              {/* Dealer Card */}
              <div className="dealer-card border p-4 rounded mb-4">
                <h6 className="mb-3">Sold by</h6>
                <div className="dealer-info mb-3">
                  <div className="dealer-name fw-bold">{vehicle.dealer.name}</div>
                  <div className="dealer-rating mb-2">
                    <div className="stars d-flex align-items-center">
                      {[...Array(5)].map((_, i) => (
                        <i
                          key={i}
                          className={`fas fa-star ${i < vehicle.dealer.rating ? 'text-warning' : 'text-muted'}`}
                        ></i>
                      ))}
                      <span className="ms-2 text-muted">({vehicle.dealer.reviews} reviews)</span>
                    </div>
                  </div>
                  <div className="dealer-address text-muted small">
                    <i className="fas fa-map-marker-alt me-1"></i>
                    {vehicle.dealer.address}
                  </div>
                </div>
                <div className="dealer-contact">
                  <a href={`tel:${vehicle.dealer.phone}`} className="btn btn-outline-primary w-100 mb-2">
                    <i className="fas fa-phone me-2"></i>
                    {vehicle.dealer.phone}
                  </a>
                  <a href={`mailto:${vehicle.dealer.email}`} className="btn btn-outline-secondary w-100">
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
                    <span>Vehicle ID</span>
                    <span className="fw-bold">#{vehicle.id}</span>
                  </div>
                  <div className="stat-item d-flex justify-content-between mb-2">
                    <span>Listed</span>
                    <span className="fw-bold">3 days ago</span>
                  </div>
                  <div className="stat-item d-flex justify-content-between mb-2">
                    <span>Views</span>
                    <span className="fw-bold">2,456</span>
                  </div>
                  <div className="stat-item d-flex justify-content-between">
                    <span>Favorites</span>
                    <span className="fw-bold">78</span>
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

export default VehiclePage;
