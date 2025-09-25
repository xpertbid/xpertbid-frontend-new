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
                      style={{ width: 'auto', height: 'auto' }}
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
          background: #ffffff;
        }

        .section-header {
          margin-bottom: 3rem;
        }

        .section-subtitle {
          display: inline-block;
          font-family: var(--font-family-heading);
          font-size: 14px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 2px;
          color: #83B735;
          margin-bottom: 15px;
        }

        .section-title {
          font-family: var(--font-family-heading);
          font-size: 2.5rem;
          font-weight: 700;
          color: #1A1A1A;
          margin-bottom: 0;
        }

        .category-card {
          display: block;
          text-decoration: none;
          height: 100%;
          border-radius: 12px;
          overflow: hidden;
          transition: all 0.3s ease;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
        }

        .category-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
          text-decoration: none;
        }

        .category-image-wrapper {
          position: relative;
          overflow: hidden;
          padding-top: 66.66%; /* 3:2 aspect ratio */
        }

        .category-image {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
        }

        .category-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.3s ease;
        }

        .category-card:hover .category-image img {
          transform: scale(1.05);
        }

        .category-overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(
            135deg,
            rgba(0, 0, 0, 0.8) 0%,
            rgba(51, 51, 51, 0.6) 50%,
            rgba(131, 183, 53, 0.8) 100%
          );
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .category-card:hover .category-overlay {
          opacity: 1;
        }

        .category-content {
          text-align: center;
          color: white;
          padding: 2rem;
        }

        .category-name {
          font-family: var(--font-family-heading);
          font-size: 1.5rem;
          font-weight: 700;
          margin-bottom: 1rem;
          text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
        }

        .category-description {
          font-family: var(--font-family);
          font-size: 1rem;
          line-height: 1.5;
          margin-bottom: 1rem;
          opacity: 0.9;
        }

        .category-count {
          display: inline-block;
          font-family: var(--font-family);
          font-size: 12px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 1px;
          background: rgba(255, 255, 255, 0.2);
          padding: 8px 16px;
          border-radius: 20px;
          margin-bottom: 1rem;
          backdrop-filter: blur(10px);
        }

        .category-arrow {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 40px;
          height: 40px;
          background: rgba(255, 255, 255, 0.2);
          border-radius: 50%;
          transition: all 0.3s ease;
          backdrop-filter: blur(10px);
        }

        .category-card:hover .category-arrow {
          background: rgba(255, 255, 255, 0.9);
          color: #83B735;
          transform: translateX(5px);
        }

        /* Responsive Design */
        @media (max-width: 768px) {
          .section-title {
            font-size: 2rem;
          }

          .category-name {
            font-size: 1.25rem;
          }

          .category-content {
            padding: 1.5rem;
          }
        }

        @media (max-width: 576px) {
          .category-name {
            font-size: 1.125rem;
          }

          .category-description {
            font-size: 0.9rem;
          }
        }
      `}</style>
    </section>
  );
};

export default WoodMartCategories;

