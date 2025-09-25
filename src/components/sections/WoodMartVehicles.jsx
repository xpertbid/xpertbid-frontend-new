'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCurrency } from '@/contexts/CurrencyLanguageContext';

const WoodMartVehicles = ({
  title = "Featured Vehicles",
  subtitle = "Find your perfect ride",
  vehicles = [],
  columns = 4,
  showViewAll = true,
  viewAllLink = "/vehicles"
}) => {
  const [imageErrors, setImageErrors] = useState(new Set());
  const { formatPrice } = useCurrency();
  const gridClass = `col-lg-${12 / columns} col-md-6 col-sm-6 col-12`;

  const handleImageError = (vehicleId) => {
    setImageErrors(prev => new Set(prev).add(vehicleId));
  };

  const getVehicleImage = (vehicle) => {
    if (imageErrors.has(vehicle.id) || !vehicle.image) {
      return 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=300&h=200&fit=crop&crop=center';
    }
    return vehicle.image;
  };

  return (
    <section className="woodmart-vehicles py-5 bg-light">
      <div className="container">
        {/* Section Header */}
        <div className="section-header text-center mb-5">
          <span className="section-subtitle">{subtitle}</span>
          <h2 className="section-title">{title}</h2>
        </div>

        {/* Vehicles Grid */}
        <div className="row">
          {vehicles && vehicles.length > 0 ? (
            vehicles.map((vehicle, index) => (
              <div key={`vehicle-${index}`} className={gridClass}>
                <div className="vehicle-card">
                  <div className="vehicle-image">
                    <Image
                      src={getVehicleImage(vehicle)}
                      alt={vehicle.name || 'Vehicle'}
                      width={300}
                      height={200}
                      className="img-fluid"
                      onError={() => handleImageError(vehicle.id)}
                    />
                  </div>
                  <div className="vehicle-content">
                    <h3 className="vehicle-name">{vehicle.name || 'Vehicle'}</h3>
                    
                    {/* Vehicle Specifications */}
                    <div className="vehicle-specs">
                      <div className="spec-row">
                        <span className="spec-item">
                          <i className="fas fa-calendar-alt"></i>
                          <span className="spec-label">Year</span>
                          <span className="spec-value">{vehicle.year || '2023'}</span>
                        </span>
                        <span className="spec-item">
                          <i className="fas fa-tachometer-alt"></i>
                          <span className="spec-label">Mileage</span>
                          <span className="spec-value">{vehicle.mileage?.toLocaleString() || '0'} mi</span>
                        </span>
                      </div>
                      <div className="spec-row">
                        <span className="spec-item">
                          <i className="fas fa-gas-pump"></i>
                          <span className="spec-label">Fuel</span>
                          <span className="spec-value">{vehicle.fuelType || 'Gasoline'}</span>
                        </span>
                        <span className="spec-item">
                          <i className="fas fa-cogs"></i>
                          <span className="spec-label">Transmission</span>
                          <span className="spec-value">{vehicle.transmission || 'Automatic'}</span>
                        </span>
                      </div>
                    </div>

                    {/* Vehicle Status Badges */}
                    <div className="vehicle-badges">
                      {vehicle.isNew && <span className="badge badge-new">
                        <i className="fas fa-star"></i>
                        New
                      </span>}
                      {vehicle.isFeatured && <span className="badge badge-featured">
                        <i className="fas fa-crown"></i>
                        Featured
                      </span>}
                      {vehicle.badge && <span className="badge badge-custom">
                        <i className="fas fa-tag"></i>
                        {vehicle.badge}
                      </span>}
                    </div>

                    {/* Price Section */}
                    <div className="vehicle-price">
                      <div className="price-main">
                        <span className="current-price">{formatPrice(vehicle.price || 0)}</span>
                        {vehicle.comparePrice && (
                          <span className="compare-price">{formatPrice(vehicle.comparePrice)}</span>
                        )}
                      </div>
                      {vehicle.rating && (
                        <div className="vehicle-rating">
                          <div className="stars">
                            {[...Array(5)].map((_, index) => (
                              <i
                                key={index}
                                className={`fas fa-star ${index < (vehicle.rating || 0) ? 'filled' : ''}`}
                              ></i>
                            ))}
                          </div>
                          <span className="rating-text">({vehicle.reviewsCount || 0} reviews)</span>
                        </div>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="vehicle-actions">
                      <Link href={`/vehicles/${vehicle.slug || vehicle.id}`} className="btn btn-primary">
                        <i className="fas fa-eye"></i>
                        View Details
                      </Link>
                      <button className="btn btn-outline-secondary">
                        <i className="fas fa-heart"></i>
                        Save
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-12 text-center py-5">
              <div className="empty-state">
                <i className="fas fa-car fa-3x text-muted mb-3"></i>
                <h4 className="text-muted">No vehicles available</h4>
                <p className="text-muted">Check back later for new vehicle listings.</p>
              </div>
            </div>
          )}
        </div>

        {/* View All Button */}
        {showViewAll && vehicles && vehicles.length > 0 && (
          <div className="text-center mt-4">
            <Link href={viewAllLink} className="btn btn-outline-primary">
              View All Vehicles
              <i className="fas fa-arrow-right ms-2"></i>
            </Link>
          </div>
        )}
      </div>

      <style jsx>{`
        .woodmart-vehicles {
          background: var(--light-color);
        }

        .section-header {
          margin-bottom: 3rem;
        }

        .section-subtitle {
          display: block;
          font-size: 14px;
          font-weight: 600;
          color: var(--primary-color);
          text-transform: uppercase;
          letter-spacing: 1px;
          margin-bottom: 8px;
        }

        .section-title {
          font-family: var(--font-family-heading);
          font-size: 36px;
          font-weight: 700;
          color: var(--secondary-color);
          margin: 0;
          line-height: 1.2;
        }

        .vehicle-card {
          background: white;
          border-radius: var(--border-radius-lg);
          box-shadow: var(--shadow-sm);
          transition: all 0.3s ease;
          overflow: hidden;
          height: 100%;
          display: flex;
          flex-direction: column;
        }

        .vehicle-card:hover {
          transform: translateY(-4px);
          box-shadow: var(--shadow-lg);
        }

        .vehicle-image {
          position: relative;
          height: 250px;
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

        .vehicle-content {
          padding: 20px;
          flex: 1;
          display: flex;
          flex-direction: column;
        }

        .vehicle-name {
          font-family: var(--font-family-heading);
          font-size: 18px;
          font-weight: 600;
          color: var(--secondary-color);
          margin-bottom: 15px;
          line-height: 1.3;
        }

        .vehicle-specs {
          margin-bottom: 16px;
        }

        .spec-row {
          display: flex;
          justify-content: space-between;
          margin-bottom: 8px;
        }

        .spec-item {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 12px;
          color: var(--gray-600);
          flex: 1;
        }

        .spec-item i {
          color: var(--primary-color);
          width: 14px;
          text-align: center;
        }

        .spec-label {
          font-weight: 500;
          color: var(--gray-700);
        }

        .spec-value {
          font-weight: 600;
          color: var(--secondary-color);
        }

        .vehicle-badges {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
          margin-bottom: 12px;
        }

        .badge {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          padding: 4px 8px;
          border-radius: var(--border-radius-sm);
          font-size: 10px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .badge-new {
          background: var(--success-color);
          color: white;
        }

        .badge-featured {
          background: var(--warning-color);
          color: white;
        }

        .badge-custom {
          background: var(--primary-color);
          color: white;
        }

        .vehicle-price {
          margin-bottom: 16px;
        }

        .price-main {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 8px;
        }

        .current-price {
          font-family: var(--font-family-heading);
          font-size: 20px;
          font-weight: 700;
          color: var(--primary-color);
        }

        .compare-price {
          font-family: var(--font-family-heading);
          font-size: 14px;
          font-weight: 500;
          color: var(--gray-500);
          text-decoration: line-through;
        }

        .vehicle-rating {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .stars {
          display: flex;
          gap: 2px;
        }

        .stars i {
          font-size: 12px;
          color: var(--gray-300);
        }

        .stars i.filled {
          color: var(--warning-color);
        }

        .rating-text {
          font-size: 11px;
          color: var(--gray-500);
        }

        .vehicle-actions {
          margin-top: auto;
        }

        .btn {
          padding: 10px 16px;
          font-family: var(--font-family-heading);
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          border-radius: var(--border-radius);
          transition: all 0.3s ease;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          border: 2px solid transparent;
          cursor: pointer;
          font-size: 12px;
        }

        .btn-primary {
          background: var(--primary-color);
          border-color: var(--primary-color);
          color: white;
          flex: 1;
        }

        .btn-primary:hover {
          background: var(--primary-hover);
          border-color: var(--primary-hover);
          color: white;
          transform: translateY(-1px);
        }

        .btn-outline-secondary {
          background: white;
          border: 2px solid var(--gray-300);
          color: var(--gray-600);
          padding: 10px 12px;
        }

        .btn-outline-secondary:hover {
          background: var(--danger-color);
          border-color: var(--danger-color);
          color: white;
          transform: translateY(-1px);
        }

        .empty-state {
          padding: 3rem 1rem;
        }

        .empty-state i {
          color: var(--gray-400);
        }

        .empty-state h4 {
          margin-bottom: 1rem;
          font-family: var(--font-family-heading);
        }

        @media (max-width: 768px) {
          .section-title {
            font-size: 28px;
          }

          .vehicle-content {
            padding: 15px;
          }

          .vehicle-name {
            font-size: 16px;
          }

          .spec-row {
            flex-direction: column;
            gap: 6px;
          }

          .vehicle-actions {
            flex-direction: column;
          }

          .btn {
            justify-content: center;
          }
        }

        @media (max-width: 576px) {
          .section-title {
            font-size: 24px;
          }

          .vehicle-badges {
            justify-content: center;
          }

          .price-main {
            justify-content: center;
          }

          .vehicle-rating {
            justify-content: center;
          }
        }
      `}</style>
    </section>
  );
};

export default WoodMartVehicles;