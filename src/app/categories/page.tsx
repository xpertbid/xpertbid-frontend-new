'use client';

import React, { useEffect, useState } from 'react';
import Layout from '@/components/Layout';
import { apiService } from '@/services/api';
import Link from 'next/link';
import Image from 'next/image';

interface Category {
  id: number;
  name: string;
  slug: string;
  description: string;
  image: string;
  icon: string;
  color: string;
  product_count?: number;
}

const CategoriesPage: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await apiService.getCategories();
        if (response.success) {
          setCategories(response.data);
        } else {
          setError(response.message || 'Failed to fetch categories.');
        }
      } catch (err) {
        setError('An unexpected error occurred while fetching categories.');
        console.error('Error fetching categories:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  if (loading) {
    return (
      <Layout>
        <div className="container py-5 text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading categories...</span>
          </div>
          <p className="mt-3">Loading categories...</p>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="container py-5 text-center">
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container py-5">
        {/* Page Header */}
        <div className="row mb-5">
          <div className="col-12 text-center">
            <h1 className="display-4 mb-3">All Categories</h1>
            <p className="lead text-muted">
              Explore our wide range of product categories and find exactly what you&apos;re looking for.
            </p>
          </div>
        </div>

        {/* Categories Grid */}
        {categories.length === 0 ? (
          <div className="alert alert-info text-center" role="alert">
            No categories found.
          </div>
        ) : (
          <div className="row g-4">
            {categories.map((category) => (
              <div className="col-lg-4 col-md-6 col-sm-6" key={category.id}>
                <div className="category-card h-100">
                  <Link href={`/categories/${category.slug}`} className="text-decoration-none">
                    <div className="category-image-wrapper">
                      <Image
                        src={category.image || '/images/placeholder-category.jpg'}
                        alt={category.name}
                        width={400}
                        height={300}
                        className="category-image"
                      />
                      <div className="category-overlay">
                        <div className="category-icon">
                          <i className={category.icon} style={{ color: category.color }}></i>
                        </div>
                      </div>
                    </div>
                    <div className="category-content">
                      <h3 className="category-title">{category.name}</h3>
                      <p className="category-description">{category.description}</p>
                      <div className="category-meta">
                        <span className="category-count">
                          <i className="fas fa-box me-2"></i>
                          {category.product_count || 0} Products
                        </span>
                      </div>
                    </div>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Additional Links */}
        <div className="row mt-5">
          <div className="col-12 text-center">
            <div className="additional-links">
              <h4 className="mb-4">Looking for something specific?</h4>
              <div className="d-flex flex-wrap justify-content-center gap-3">
                <Link href="/properties" className="btn btn-outline-primary">
                  <i className="fas fa-home me-2"></i>
                  Browse Properties
                </Link>
                <Link href="/vehicles" className="btn btn-outline-primary">
                  <i className="fas fa-car me-2"></i>
                  Browse Vehicles
                </Link>
                <Link href="/auctions" className="btn btn-outline-primary">
                  <i className="fas fa-gavel me-2"></i>
                  Browse Auctions
                </Link>
                <Link href="/shop" className="btn btn-outline-primary">
                  <i className="fas fa-shopping-bag me-2"></i>
                  Browse All Products
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .category-card {
          background: white;
          border-radius: 12px;
          overflow: hidden;
          transition: all 0.3s ease;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
          border: 1px solid #f0f0f0;
        }

        .category-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 12px 30px rgba(0, 0, 0, 0.15);
        }

        .category-image-wrapper {
          position: relative;
          height: 250px;
          overflow: hidden;
        }

        .category-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.3s ease;
        }

        .category-card:hover .category-image {
          transform: scale(1.05);
        }

        .category-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(135deg, rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.1));
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .category-card:hover .category-overlay {
          opacity: 1;
        }

        .category-icon {
          font-size: 3rem;
          color: white;
          text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
        }

        .category-content {
          padding: 25px;
        }

        .category-title {
          font-family: var(--font-family-heading);
          font-size: 1.5rem;
          font-weight: 700;
          color: var(--secondary-color);
          margin-bottom: 12px;
          transition: color 0.3s ease;
        }

        .category-card:hover .category-title {
          color: var(--primary-color);
        }

        .category-description {
          color: var(--gray-600);
          font-size: 0.95rem;
          line-height: 1.6;
          margin-bottom: 15px;
        }

        .category-meta {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .category-count {
          font-size: 0.9rem;
          color: var(--gray-500);
          font-weight: 500;
        }

        .additional-links {
          background: var(--light-color);
          padding: 40px;
          border-radius: 12px;
          border: 1px solid #e9ecef;
        }

        .additional-links h4 {
          font-family: var(--font-family-heading);
          color: var(--secondary-color);
          font-weight: 600;
        }

        .btn {
          padding: 12px 24px;
          border-radius: 8px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          transition: all 0.3s ease;
        }

        .btn-outline-primary {
          border: 2px solid var(--primary-color);
          color: var(--primary-color);
        }

        .btn-outline-primary:hover {
          background: var(--primary-color);
          color: white;
          transform: translateY(-2px);
        }

        /* Responsive Design */
        @media (max-width: 768px) {
          .category-image-wrapper {
            height: 200px;
          }

          .category-content {
            padding: 20px;
          }

          .category-title {
            font-size: 1.3rem;
          }

          .additional-links {
            padding: 30px 20px;
          }

          .btn {
            padding: 10px 20px;
            font-size: 0.9rem;
          }
        }
      `}</style>
    </Layout>
  );
};

export default CategoriesPage;
