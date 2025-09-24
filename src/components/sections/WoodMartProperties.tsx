'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface Property {
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
  bedrooms?: number;
  bathrooms?: number;
  area?: number;
  propertyType?: string;
  location?: string;
}

interface WoodMartPropertiesProps {
  title?: string;
  subtitle?: string;
  properties: Property[];
  columns?: number;
  showViewAll?: boolean;
  viewAllLink?: string;
}

const WoodMartProperties: React.FC<WoodMartPropertiesProps> = ({
  title = "Featured Properties",
  subtitle = "Find your dream home",
  properties,
  columns = 4,
  showViewAll = true,
  viewAllLink = "/properties"
}) => {
  const gridClass = `col-lg-${12 / columns} col-md-6 col-sm-6 col-12`;

  return (
    <section className="woodmart-properties py-5">
      <div className="container">
        {/* Section Header */}
        <div className="section-header text-center mb-5">
          <span className="section-subtitle">{subtitle}</span>
          <h2 className="section-title">{title}</h2>
        </div>

        {/* Properties Grid */}
        <div className="row g-4">
          {properties.map((property) => (
            <div key={property.id} className={gridClass}>
              <div className="property-card" onClick={() => window.location.href = `/properties/${property.slug}`} style={{ cursor: 'pointer' }}>
                <div className="property-link">
                  <div className="property-image-wrapper">
                    <div className="property-image">
                      <Image
                        src={property.image}
                        alt={property.name}
                        width={300}
                        height={200}
                        className="img-fluid"
                      />
                    </div>
                    
                    {/* Property Badges */}
                    <div className="property-badges">
                      {property.isNew && <span className="badge badge-new">New</span>}
                      {property.isSale && <span className="badge badge-sale">Sale</span>}
                      {property.isFeatured && <span className="badge badge-featured">Featured</span>}
                      {property.badge && <span className="badge badge-custom">{property.badge}</span>}
                    </div>

                    {/* Property Overlay */}
                    <div className="property-overlay">
                      <div className="property-actions">
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

                  <div className="property-content">
                    <h3 className="property-name">{property.name}</h3>
                    
                    {/* Location */}
                    {property.location && (
                      <div className="property-location">
                        <i className="fas fa-map-marker-alt"></i>
                        <span>{property.location}</span>
                      </div>
                    )}
                    
                    {/* Property Specs */}
                    <div className="property-specs">
                      {property.bedrooms && (
                        <span className="spec-item">
                          <i className="fas fa-bed"></i>
                          {property.bedrooms} Bed{property.bedrooms > 1 ? 's' : ''}
                        </span>
                      )}
                      {property.bathrooms && (
                        <span className="spec-item">
                          <i className="fas fa-bath"></i>
                          {property.bathrooms} Bath{property.bathrooms > 1 ? 's' : ''}
                        </span>
                      )}
                      {property.area && (
                        <span className="spec-item">
                          <i className="fas fa-expand-arrows-alt"></i>
                          {property.area} sq ft
                        </span>
                      )}
                      {property.propertyType && (
                        <span className="spec-item">
                          <i className="fas fa-home"></i>
                          {property.propertyType}
                        </span>
                      )}
                    </div>

                    {/* Rating */}
                    <div className="property-rating">
                      <div className="stars">
                        {[...Array(5)].map((_, i) => (
                          <i
                            key={i}
                            className={`fas fa-star ${i < Math.floor(property.rating) ? 'active' : ''}`}
                          />
                        ))}
                      </div>
                      <span className="rating-text">
                        ({property.reviewsCount} reviews)
                      </span>
                    </div>

                    {/* Price */}
                    <div className="property-price">
                      <span className="current-price">${property.price.toLocaleString()}</span>
                      {property.comparePrice && (
                        <span className="compare-price">${property.comparePrice.toLocaleString()}</span>
                      )}
                    </div>

                    {/* Action Button */}
                    <div className="property-actions-bottom">
                      <Link href={`/properties/${property.slug}`} className="btn btn-primary btn-block" onClick={(e) => e.stopPropagation()}>
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
              View All Properties
              <i className="fas fa-arrow-right ms-2"></i>
            </Link>
          </div>
        )}
      </div>

      <style jsx>{`
        .woodmart-properties {
          background: white;
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

        .property-card {
          background: white;
          border-radius: var(--border-radius-lg);
          overflow: hidden;
          transition: all 0.3s ease;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
          height: 100%;
        }

        .property-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
        }

        .property-link {
          display: block;
          text-decoration: none;
          color: inherit;
          height: 100%;
        }

        .property-link:hover {
          text-decoration: none;
          color: inherit;
        }

        .property-image-wrapper {
          position: relative;
          overflow: hidden;
          padding-top: 66.66%; /* 3:2 aspect ratio */
        }

        .property-image {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
        }

        .property-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.3s ease;
        }

        .property-card:hover .property-image img {
          transform: scale(1.05);
        }

        .property-badges {
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

        .property-overlay {
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

        .property-card:hover .property-overlay {
          opacity: 1;
        }

        .property-actions {
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

        .property-content {
          padding: 20px;
        }

        .property-name {
          font-family: var(--font-family-heading);
          font-size: 18px;
          font-weight: 600;
          color: var(--secondary-color);
          margin-bottom: 10px;
          line-height: 1.3;
        }

        .property-location {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 15px;
          color: var(--gray-600);
          font-size: 14px;
        }

        .property-location i {
          color: var(--primary-color);
        }

        .property-specs {
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

        .property-rating {
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

        .property-price {
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

        .property-actions-bottom .btn {
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

          .property-name {
            font-size: 16px;
          }

          .property-content {
            padding: 15px;
          }

          .property-specs {
            gap: 10px;
          }

          .spec-item {
            font-size: 11px;
          }
        }

        @media (max-width: 480px) {
          .property-specs {
            flex-direction: column;
            gap: 5px;
          }
        }
      `}</style>
    </section>
  );
};

export default WoodMartProperties;
