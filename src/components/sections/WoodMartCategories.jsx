'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';





const WoodMartCategories = ({
  title = "Shop by Category",
  subtitle = "Browse our product categories",
  categories,
  columns = 4,
  showCount = true
}) => {
  const gridClass = `col-lg-${12 / columns} col-md-6 col-sm-6 col-12`;

  return (
    <section className="woodmart-categories py-5">
      <div className="container">
        {/* Section Header */}
        <div className="section-header text-center mb-5">
          <span className="section-subtitle">{subtitle}</span>
          <h2 className="section-title">{title}</h2>
        </div>

        {/* Categories Grid */}
        <div className="row g-4">
          {categories.map((category) => (
            <div key={category.id} className={gridClass}>
              <Link href={`/categories/${category.slug}`} className="category-card">
                <div className="category-image-wrapper">
                  <div className="category-image">
                    <Image
                      src={category.image}
                      alt={category.name}
                      width={300}
                      height={200}
                      className="img-fluid"
                    />
                  </div>
                  <div className="category-overlay">
                    <div className="category-content">
                      <h3 className="category-name">{category.name}</h3>
                      {category.description && (
                        <p className="category-description">{category.description}</p>
                      )}
                      {showCount && (
                        <span className="category-count">{category.productCount} Products</span>
                      )}
                      <div className="category-arrow">
                        <i className="f-arrow-right"></i>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        .woodmart-categories {
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

        .category-card {
          display;
          text-decoration;
          height: 100%;
          border-radius: var(--border-radius-lg);
          overflow;
          transition: all 0.3s ease;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
        }

        .category-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
          text-decoration;
        }

        .category-image-wrapper {
          position;
          overflow;
          padding-top: 66.66%; /* 3:2 aspect ratio */
        }

        .category-image {
          position;
          top;
          left;
          width: 100%;
          height: 100%;
        }

        .category-image img {
          width: 100%;
          height: 100%;
          object-fit;
          transition: transform 0.3s ease;
        }

        .category-card:hover .category-image img {
          transform: scale(1.05);
        }

        .category-overlay {
          position;
          top;
          left;
          width: 100%;
          height: 100%;
          background: linear-gradient(
            135deg,
            rgba(0, 0, 0, 0.8) 0%,
            rgba(51, 51, 51, 0.6) 50%,
            rgba(67, 172, 233, 0.8) 100%
          );
          display;
          align-items;
          justify-content;
          opacity;
          transition: opacity 0.3s ease;
        }

        .category-card:hover .category-overlay {
          opacity;
        }

        .category-content {
          text-align;
          color;
          padding;
        }

        .category-name {
          font-family: var(--font-family-heading);
          font-size;
          font-weight;
          margin-bottom;
          text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
        }

        .category-description {
          font-family: var(--font-family);
          font-size;
          line-height: 1.5;
          margin-bottom;
          opacity: 0.9;
        }

        .category-count {
          display: inline-block;
          font-family: var(--font-family);
          font-size;
          font-weight;
          text-transform;
          letter-spacing;
          background: rgba(255, 255, 255, 0.2);
          padding;
          border-radius: var(--border-radius-round);
          margin-bottom;
          backdrop-filter: blur(10px);
        }

        .category-arrow {
          display: inline-flex;
          align-items;
          justify-content;
          width;
          height;
          background: rgba(255, 255, 255, 0.2);
          border-radius: 50%;
          transition: all 0.3s ease;
          backdrop-filter: blur(10px);
        }

        .category-card:hover .category-arrow {
          background;
          color: var(--primary-color);
          transform: translateX(5px);
        }

        /* Alternative Style for Categories with Text Below */
        .category-card.alternative {
          background;
        }

        .category-card.alternative .category-image-wrapper {
          padding-top: 75%; /* 4:3 aspect ratio */
        }

        .category-card.alternative .category-overlay {
          background;
          opacity;
          position;
          padding;
          color: var(--secondary-color);
        }

        .category-card.alternative .category-name {
          color: var(--secondary-color);
          text-shadow;
          font-size;
          margin-bottom;
        }

        .category-card.alternative .category-description {
          color: var(--gray-600);
          opacity;
          margin-bottom;
        }

        .category-card.alternative .category-count {
          background: var(--primary-color);
          color;
          margin-bottom;
        }

        .category-card.alternative .category-arrow {
          display;
        }

        /* Responsive Design */
        @media (max-width) {
          .section-title {
            font-size;
          }

          .category-name {
            font-size;
          }

          .category-content {
            padding;
          }
        }

        @media (max-width) {
          .category-name {
            font-size;
          }

          .category-description {
            font-size;
          }
        }
      `}</style>
    </section>
  );
};

export default WoodMartCategories;

