'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import PriceDisplay from '@/components/PriceDisplay';
import TranslatedText from '@/components/TranslatedText';





const WoodMartProperties = ({
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
          <span className="section-subtitle">
            <TranslatedText text={subtitle} />
          </span>
          <h2 className="section-title">
            <TranslatedText text={title} />
          </h2>
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
                          <i className="f-balance-scale"></i>
                        </button>
                        <button className="btn-action btn-quick-view" title="Quick View">
                          <i className="f-eye"></i>
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="property-content">
                    <h3 className="property-name">{property.name}</h3>
                    
                    {/* Location */}
                    {property.location && (
                      <div className="property-location">
                        <i className="f-map-marker-alt"></i>
                        <span>{property.location}</span>
                      </div>
                    )}
                    
                    {/* Property Specs */}
                    <div className="property-specs">
                      {property.bedrooms && (
                        <span className="spec-item">
                          <i className="f-bed"></i>
                          {property.bedrooms} Bed{property.bedrooms > 1 ? 's' : ''}
                        </span>
                      )}
                      {property.bathrooms && (
                        <span className="spec-item">
                          <i className="f-bath"></i>
                          {property.bathrooms} Bath{property.bathrooms > 1 ? 's' : ''}
                        </span>
                      )}
                      {property.area && (
                        <span className="spec-item">
                          <i className="f-expand-arrows-alt"></i>
                          {property.area} sq ft
                        </span>
                      )}
                      {property.propertyType && (
                        <span className="spec-item">
                          <i className="f-home"></i>
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
                            className={`f-star ${i < Math.floor(property.rating) ? 'active' : ''}`}
                          />
                        ))}
                      </div>
                      <span className="rating-text">
                        ({property.reviewsCount} reviews)
                      </span>
                    </div>

                    {/* Price */}
                    <div className="property-price">
                      <PriceDisplay 
                        amount={property.price} 
                        className="current-price"
                        fromCurrency="USD"
                      />
                      {property.comparePrice && (
                        <span className="compare-price">
                          <PriceDisplay 
                            amount={property.comparePrice} 
                            fromCurrency="USD"
                          />
                        </span>
                      )}
                    </div>

                    {/* Action Button */}
                    <div className="property-actions-bottom">
                      <Link href={`/properties/${property.slug}`} className="btn btn-primary btn-block" onClick={(e) => e.stopPropagation()}>
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
              View All Properties
              <i className="f-arrow-right ms-2"></i>
            </Link>
          </div>
        )}
      </div>

      <style jsx>{`
        .woodmart-properties {
          background;
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

        .property-card {
          background;
          border-radius: var(--border-radius-lg);
          overflow;
          transition: all 0.3s ease;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
          height: 100%;
        }

        .property-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
        }

        .property-link {
          display;
          text-decoration;
          color;
          height: 100%;
        }

        .property-link:hover {
          text-decoration;
          color;
        }

        .property-image-wrapper {
          position;
          overflow;
          padding-top: 66.66%; /* 3:2 aspect ratio */
        }

        .property-image {
          position;
          top;
          left;
          width: 100%;
          height: 100%;
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

        .property-badges {
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

        .property-overlay {
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

        .property-card:hover .property-overlay {
          opacity;
        }

        .property-actions {
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

        .property-content {
          padding;
        }

        .property-name {
          font-family: var(--font-family-heading);
          font-size;
          font-weight;
          color: var(--secondary-color);
          margin-bottom;
          line-height: 1.3;
        }

        .property-location {
          display;
          align-items;
          gap;
          margin-bottom;
          color: var(--gray-600);
          font-size;
        }

        .property-location i {
          color: var(--primary-color);
        }

        .property-specs {
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

        .property-rating {
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

        .property-price {
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

        .property-actions-bottom .btn {
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

          .property-name {
            font-size;
          }

          .property-content {
            padding;
          }

          .property-specs {
            gap;
          }

          .spec-item {
            font-size;
          }
        }

        @media (max-width) {
          .property-specs {
            flex-direction;
            gap;
          }
        }
      `}</style>
    </section>
  );
};

export default WoodMartProperties;

