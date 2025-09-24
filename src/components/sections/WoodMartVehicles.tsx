'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface Vehicle {
  id: number;
  name: string;
  slug: string;
  price: number;
  comparePrice?: number;
  image: string;
  rating: number;
  reviewsCount: number;
  isNew?: boolean;
  isFeatured?: boolean;
  isSale?: boolean;
  badge?: string;
  year?: number;
  mileage?: number;
  fuelType?: string;
  transmission?: string;
}

interface WoodMartVehiclesProps {
  title?: string;
  subtitle?: string;
  vehicles: Vehicle[];
  columns?: number;
  showViewAll?: boolean;
  viewAllLink?: string;
}

const WoodMartVehicles: React.FC<WoodMartVehiclesProps> = ({
  title = "Featured Vehicles",
  subtitle = "Find your perfect ride",
  vehicles,
  columns = 4,
  showViewAll = true,
  viewAllLink = "/vehicles"
}) => {
  const gridClass = `col-lg-${12 / columns} col-md-6 col-sm-6 col-12`;

  return (
    <section className="woodmart-vehicles py-5 bg-light">
      <div className="container">
        {/* Section Header */}
        <div className="section-header text-center mb-5">
          <span className="section-subtitle">{subtitle}</span>
          <h2 className="section-title">{title}</h2>
        </div>

        {/* Vehicles Grid */}
        <div className="row g-4">
          {vehicles.map((vehicle) => (
            <div key={vehicle.id} className={gridClass}>
              <div className="vehicle-card" onClick={() => window.location.href = `/vehicles/${vehicle.slug}`} style={{ cursor: 'pointer' }}>
                <div className="vehicle-link">
                  <div className="vehicle-image-wrapper">
                    <div className="vehicle-image">
                      <Image
                        src={vehicle.image}
                        alt={vehicle.name}
                        width={300}
                        height={200}
                        className="img-fluid"
                      />
                    </div>
                    
                    {/* Vehicle Badges */}
                    <div className="vehicle-badges">
                      {vehicle.isNew && <span className="badge badge-new">New</span>}
                      {vehicle.isSale && <span className="badge badge-sale">Sale</span>}
                      {vehicle.isFeatured && <span className="badge badge-featured">Featured</span>}
                      {vehicle.badge && <span className="badge badge-custom">{vehicle.badge}</span>}
                    </div>

                    {/* Vehicle Overlay */}
                    <div className="vehicle-overlay">
                      <div className="vehicle-actions">
                        <button className="btn-action btn-wishlist" title="Add to Wishlist">
                          <i className="far fa-heart"></i>
                        </button>
                        <button className="btn-action btn-compare" title="Add to Compare">
                          <i className="fas fa-balance-scale"></i>
                        </button>
                        <button className="btn-action btn-quick-view" title="Quick View">
                          <i className="fas fa-eye"></i>
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="vehicle-content">
                    <h3 className="vehicle-name">{vehicle.name}</h3>
                    
                    {/* Vehicle Specs */}
                    <div className="vehicle-specs">
                      {vehicle.year && (
                        <span className="spec-item">
                          <i className="fas fa-calendar"></i>
                          {vehicle.year}
                        </span>
                      )}
                      {vehicle.mileage && (
                        <span className="spec-item">
                          <i className="fas fa-tachometer-alt"></i>
                          {vehicle.mileage.toLocaleString()} km
                        </span>
                      )}
                      {vehicle.fuelType && (
                        <span className="spec-item">
                          <i className="fas fa-gas-pump"></i>
                          {vehicle.fuelType}
                        </span>
                      )}
                      {vehicle.transmission && (
                        <span className="spec-item">
                          <i className="fas fa-cogs"></i>
                          {vehicle.transmission}
                        </span>
                      )}
                    </div>

                    {/* Rating */}
                    <div className="vehicle-rating">
                      <div className="stars">
                        {[...Array(5)].map((_, i) => (
                          <i
                            key={i}
                            className={`fas fa-star ${i < Math.floor(vehicle.rating) ? 'active' : ''}`}
                          />
                        ))}
                      </div>
                      <span className="rating-text">
                        ({vehicle.reviewsCount} reviews)
                      </span>
                    </div>

                    {/* Price */}
                    <div className="vehicle-price">
                      <span className="current-price">${vehicle.price.toLocaleString()}</span>
                      {vehicle.comparePrice && (
                        <span className="compare-price">${vehicle.comparePrice.toLocaleString()}</span>
                      )}
                    </div>

                    {/* Action Button */}
                    <div className="vehicle-actions-bottom">
                      <Link href={`/vehicles/${vehicle.slug}`} className="btn btn-primary btn-block" onClick={(e) => e.stopPropagation()}>
                        View Details
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* View All Button */}
        {showViewAll && (
          <div className="text-center mt-5">
            <Link href={viewAllLink} className="btn btn-outline-primary btn-lg">
              View All Vehicles
              <i className="fas fa-arrow-right ms-2"></i>
            </Link>
          </div>
        )}
      </div>

      <style jsx>{`
        .woodmart-vehicles {
          background: var(--gray-100);
        }

        .section-header {
          margin-bottom: 60px;
        }

        .section-subtitle {
          display: inline-block;
          font-family: var(--font-family-heading);
          font-size: 14px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 2px;
          color: var(--primary-color);
          margin-bottom: 15px;
        }

        .section-title {
          font-family: var(--font-family-heading);
          font-size: 36px;
          font-weight: 700;
          color: var(--secondary-color);
          margin-bottom: 0;
        }

        .vehicle-card {
          background: white;
          border-radius: var(--border-radius-lg);
          overflow: hidden;
          transition: all 0.3s ease;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
          height: 100%;
        }

        .vehicle-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
        }

        .vehicle-link {
          display: block;
          text-decoration: none;
          color: inherit;
          height: 100%;
        }

        .vehicle-link:hover {
          text-decoration: none;
          color: inherit;
        }

        .vehicle-image-wrapper {
          position: relative;
          overflow: hidden;
          padding-top: 66.66%; /* 3:2 aspect ratio */
        }

        .vehicle-image {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
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
          top: 15px;
          left: 15px;
          z-index: 3;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .badge {
          font-size: 11px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          padding: 4px 8px;
          border-radius: var(--border-radius-sm);
        }

        .badge-new {
          background: var(--success-color);
          color: white;
        }

        .badge-sale {
          background: var(--accent-color);
          color: white;
        }

        .badge-featured {
          background: var(--primary-color);
          color: white;
        }

        .badge-custom {
          background: var(--warning-color);
          color: white;
        }

        .vehicle-overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.7);
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0;
          transition: opacity 0.3s ease;
          z-index: 2;
        }

        .vehicle-card:hover .vehicle-overlay {
          opacity: 1;
        }

        .vehicle-actions {
          display: flex;
          gap: 15px;
        }

        .btn-action {
          width: 45px;
          height: 45px;
          border-radius: 50%;
          border: none;
          background: white;
          color: var(--secondary-color);
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s ease;
          cursor: pointer;
        }

        .btn-action:hover {
          background: var(--primary-color);
          color: white;
          transform: scale(1.1);
        }

        .vehicle-content {
          padding: 20px;
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
          display: flex;
          flex-wrap: wrap;
          gap: 15px;
          margin-bottom: 15px;
        }

        .spec-item {
          display: flex;
          align-items: center;
          gap: 5px;
          font-size: 12px;
          color: var(--gray-600);
        }

        .spec-item i {
          color: var(--primary-color);
          width: 12px;
        }

        .vehicle-rating {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 15px;
        }

        .stars {
          display: flex;
          gap: 2px;
        }

        .stars i {
          font-size: 12px;
          color: var(--gray-300);
        }

        .stars i.active {
          color: var(--warning-color);
        }

        .rating-text {
          font-size: 12px;
          color: var(--gray-600);
        }

        .vehicle-price {
          margin-bottom: 15px;
        }

        .current-price {
          font-family: var(--font-family-heading);
          font-size: 20px;
          font-weight: 700;
          color: var(--primary-color);
        }

        .compare-price {
          font-size: 14px;
          color: var(--gray-500);
          text-decoration: line-through;
          margin-left: 10px;
        }

        .vehicle-actions-bottom .btn {
          width: 100%;
          font-size: 14px;
          font-weight: 600;
          padding: 10px 20px;
        }

        /* Responsive Design */
        @media (max-width: 768px) {
          .section-title {
            font-size: 28px;
          }

          .vehicle-name {
            font-size: 16px;
          }

          .vehicle-content {
            padding: 15px;
          }

          .vehicle-specs {
            gap: 10px;
          }

          .spec-item {
            font-size: 11px;
          }
        }

        @media (max-width: 480px) {
          .vehicle-specs {
            flex-direction: column;
            gap: 5px;
          }
        }
      `}</style>
    </section>
  );
};

export default WoodMartVehicles;
