'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import PriceDisplay from '@/components/PriceDisplay';
import TranslatedText from '@/components/TranslatedText';





const WoodMartVehicles = ({
  title = "Featured Vehicles",
  subtitle = "Find your perfect ride",
  vehicles,
  columns = 4,
  showViewAll = true,
  viewAllLink = "/vehicles"
}) => {
  const gridClass = `col-lg-${12 / columns} col-md-6 col-sm-6 col-12`;

  // Helper function to safely get first image
  const getFirstImage = (images)=> {
    if (!images) return 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=300&h=200&fit=crop';
    if (Array.isArray(images)) return images[0] || 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=300&h=200&fit=crop';
    if (typeof images === 'string') {
      try {
        const parsed = JSON.parse(images);
        return Array.isArray(parsed) && parsed.length > 0 ? parsed[0] : 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=300&h=200&fit=crop';
      } catch {
        return images; // If it's not JSON, treat }
    }
    return 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=300&h=200&fit=crop';
  };

  return (
    <section className="woodmart-vehicles py-5 bg-light">
      <div className="container">
        {/* Section Header */}
        <div className="section-header text-center mb-5">
          <span className="section-subtitle">
            <TranslatedText text={subtitle} />
          </span>
          <h2 className="section-title">
            <TranslatedText text={title} />
          </h2>
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
                        src={getFirstImage(vehicle.image)}
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
                          <i className="f-balance-scale"></i>
                        </button>
                        <button className="btn-action btn-quick-view" title="Quick View">
                          <i className="f-eye"></i>
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
                          <i className="f-calendar"></i>
                          {vehicle.year}
                        </span>
                      )}
                      {vehicle.mileage && (
                        <span className="spec-item">
                          <i className="f-tachometer-alt"></i>
                          {vehicle.mileage.toLocaleString()} km
                        </span>
                      )}
                      {vehicle.fuelType && (
                        <span className="spec-item">
                          <i className="f-gas-pump"></i>
                          {vehicle.fuelType}
                        </span>
                      )}
                      {vehicle.transmission && (
                        <span className="spec-item">
                          <i className="f-cogs"></i>
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
                            className={`f-star ${i < Math.floor(vehicle.rating) ? 'active' : ''}`}
                          />
                        ))}
                      </div>
                      <span className="rating-text">
                        ({vehicle.reviewsCount} reviews)
                      </span>
                    </div>

                    {/* Price */}
                    <div className="vehicle-price">
                      <PriceDisplay 
                        amount={vehicle.price} 
                        className="current-price"
                        fromCurrency="USD"
                      />
                      {vehicle.comparePrice && (
                        <span className="compare-price">
                          <PriceDisplay 
                            amount={vehicle.comparePrice} 
                            fromCurrency="USD"
                          />
                        </span>
                      )}
                    </div>

                    {/* Action Button */}
                    <div className="vehicle-actions-bottom">
                      <Link href={`/vehicles/${vehicle.slug}`} className="btn btn-primary btn-block" onClick={(e) => e.stopPropagation()}>
                        <TranslatedText text="View Details" />
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
              <i className="f-arrow-right ms-2"></i>
            </Link>
          </div>
        )}
      </div>

      <style jsx>{`
        .woodmart-vehicles {
          background: var(--gray-100);
        }

        .section-header {
          margin-bottom;
        }

        .section-subtitle {
          display: inline-block;
          font-family: var(--font-family-heading);
          font-size;
          font-weight;
          text-transform;
          letter-spacing;
          color: var(--primary-color);
          margin-bottom;
        }

        .section-title {
          font-family: var(--font-family-heading);
          font-size;
          font-weight;
          color: var(--secondary-color);
          margin-bottom;
        }

        .vehicle-card {
          background;
          border-radius: var(--border-radius-lg);
          overflow;
          transition: all 0.3s ease;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
          height: 100%;
        }

        .vehicle-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
        }

        .vehicle-link {
          display;
          text-decoration;
          color;
          height: 100%;
        }

        .vehicle-link:hover {
          text-decoration;
          color;
        }

        .vehicle-image-wrapper {
          position;
          overflow;
          padding-top: 66.66%; /* 3:2 aspect ratio */
        }

        .vehicle-image {
          position;
          top;
          left;
          width: 100%;
          height: 100%;
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

        .vehicle-badges {
          position;
          top;
          left;
          z-index;
          display;
          flex-direction;
          gap;
        }

        .badge {
          font-size;
          font-weight;
          text-transform;
          letter-spacing: 0.5px;
          padding;
          border-radius: var(--border-radius-sm);
        }

        .badge-new {
          background: var(--success-color);
          color;
        }

        .badge-sale {
          background: var(--accent-color);
          color;
        }

        .badge-featured {
          background: var(--primary-color);
          color;
        }

        .badge-custom {
          background: var(--warning-color);
          color;
        }

        .vehicle-overlay {
          position;
          top;
          left;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.7);
          display;
          align-items;
          justify-content;
          opacity;
          transition: opacity 0.3s ease;
          z-index;
        }

        .vehicle-card:hover .vehicle-overlay {
          opacity;
        }

        .vehicle-actions {
          display;
          gap;
        }

        .btn-action {
          width;
          height;
          border-radius: 50%;
          border;
          background;
          color: var(--secondary-color);
          display;
          align-items;
          justify-content;
          transition: all 0.3s ease;
          cursor;
        }

        .btn-action:hover {
          background: var(--primary-color);
          color;
          transform: scale(1.1);
        }

        .vehicle-content {
          padding;
        }

        .vehicle-name {
          font-family: var(--font-family-heading);
          font-size;
          font-weight;
          color: var(--secondary-color);
          margin-bottom;
          line-height: 1.3;
        }

        .vehicle-specs {
          display;
          flex-wrap;
          gap;
          margin-bottom;
        }

        .spec-item {
          display;
          align-items;
          gap;
          font-size;
          color: var(--gray-600);
        }

        .spec-item i {
          color: var(--primary-color);
          width;
        }

        .vehicle-rating {
          display;
          align-items;
          gap;
          margin-bottom;
        }

        .stars {
          display;
          gap;
        }

        .stars i {
          font-size;
          color: var(--gray-300);
        }

        .stars i.active {
          color: var(--warning-color);
        }

        .rating-text {
          font-size;
          color: var(--gray-600);
        }

        .vehicle-price {
          margin-bottom;
        }

        .current-price {
          font-family: var(--font-family-heading);
          font-size;
          font-weight;
          color: var(--primary-color);
        }

        .compare-price {
          font-size;
          color: var(--gray-500);
          text-decoration: line-through;
          margin-left;
        }

        .vehicle-actions-bottom .btn {
          width: 100%;
          font-size;
          font-weight;
          padding;
        }

        /* Responsive Design */
        @media (max-width) {
          .section-title {
            font-size;
          }

          .vehicle-name {
            font-size;
          }

          .vehicle-content {
            padding;
          }

          .vehicle-specs {
            gap;
          }

          .spec-item {
            font-size;
          }
        }

        @media (max-width) {
          .vehicle-specs {
            flex-direction;
            gap;
          }
        }
      `}</style>
    </section>
  );
};
}
export default WoodMartVehicles;

