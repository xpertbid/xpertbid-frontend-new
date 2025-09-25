'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { imageService } from '@/services/imageService';
import { apiService } from '@/services/api';
import { Category } from '@/types';


const CategoriesSection = () => {
  const [categories, setCategories] = useState<Array<Category>>([]);
  const [loading, setLoading] = useState(true);

  // Mock data - replace with API call
  const mockCategories = [
    {
      id,
      tenant_id,
      parent_id,
      level,
      path: 'electronics',
      name: 'Electronics',
      slug: 'electronics',
      description: 'Latest gadgets and electronic devices',
      image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400&h=300&fit=crop',
      banner_image,
      icon: 'f-laptop',
      color: '#3B82F6',
      sort_order,
      is_active,
      is_featured,
      status,
      language: 'en',
      translation_group,
      seo_meta,
      seo_title,
      seo_description,
      seo_keywords,
      canonical_url,
      commission_rate,
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z'
    },
    {
      id,
      tenant_id,
      parent_id,
      level,
      path: 'fashion',
      name: 'Fashion',
      slug: 'fashion',
      description: 'Trendy clothing and accessories',
      image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=300&fit=crop',
      banner_image,
      icon: 'f-tshirt',
      color: '#EF4444',
      sort_order,
      is_active,
      is_featured,
      status,
      language: 'en',
      translation_group,
      seo_meta,
      seo_title,
      seo_description,
      seo_keywords,
      canonical_url,
      commission_rate,
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z'
    },
    {
      id,
      tenant_id,
      parent_id,
      level,
      path: 'home-garden',
      name: 'Home & Garden',
      slug: 'home-garden',
      description: 'Everything for your home and garden',
      image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop',
      banner_image,
      icon: 'f-home',
      color: '#10B981',
      sort_order,
      is_active,
      is_featured,
      status,
      language: 'en',
      translation_group,
      seo_meta,
      seo_title,
      seo_description,
      seo_keywords,
      canonical_url,
      commission_rate,
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z'
    },
    {
      id,
      tenant_id,
      parent_id,
      level,
      path: 'sports',
      name: 'Sports',
      slug: 'sports',
      description: 'Sports equipment and fitness gear',
      image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop',
      banner_image,
      icon: 'f-dumbbell',
      color: '#F59E0B',
      sort_order,
      is_active,
      is_featured,
      status,
      language: 'en',
      translation_group,
      seo_meta,
      seo_title,
      seo_description,
      seo_keywords,
      canonical_url,
      commission_rate,
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z'
    }
  ];

  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true);
      try {
        // Try to fetch from API first
        const apiCategories = await apiService.getCategories();
        
        // Check if API returned valid data
        if (apiCategories && Array.isArray(apiCategories) && apiCategories.length > 0) {
          // Add images to API data
          const categoriesWithImages = await Promise.all(
            apiCategories.map(async (category, index) => {
              const images = await imageService.getCategoryImages(category.slug || category.name.toLowerCase());
              return {
                ...category,
                image: images[0] || mockCategories[index % mockCategories.length].image,
                icon: mockCategories[index % mockCategories.length].icon,
                description: category.description || mockCategories[index % mockCategories.length].description,
                product_count: Math.floor(Math.random() * 1000) + 100
              };
            })
          );
          setCategories(categoriesWithImages );
        } else {
          // API returned null/empty, use mock data
          console.log('API categories not available, using mock data');
          setCategories(mockCategories );
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
        // Fallback to mock data with real images
        console.log('Using mock categories due to error');
        setCategories(mockCategories );
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  if (loading) {
    return (
      <section className="categories-section py-5">
        <div className="container">
          <div className="row">
            <div className="col-12">
              <div className="section-header text-center mb-5">
                <h2 className="section-title">Browse Categories</h2>
                <p className="section-subtitle">Discover products by category</p>
              </div>
              <div className="row">
                {[...Array(8)].map((_, index) => (
                  <div key={index} className="col-lg-3 col-md-4 col-sm-6 mb-4">
                    <div className="category-card loading">
                      <div className="category-image loading-shimmer"></div>
                      <div className="category-content">
                        <div className="category-icon loading-shimmer"></div>
                        <div className="category-name loading-shimmer"></div>
                        <div className="category-count loading-shimmer"></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="categories-section py-5">
      <div className="container">
        <div className="row">
          <div className="col-12">
            <div className="section-header text-center mb-5">
              <h2 className="section-title">Browse Categories</h2>
              <p className="section-subtitle">Discover products by category</p>
            </div>
          </div>
        </div>
        
        <div className="row">
          {categories.map((category) => (
            <div key={category.id} className="col-lg-3 col-md-4 col-sm-6 mb-4">
              <Link href={`/categories/${category.slug}`} className="category-link">
                <div className="category-card">
                  <div className="category-image">
                    <img 
                      src={category.image} 
                      alt={category.name}
                      onError={(e) => {
                        const target = e.target ;
                        target.src = '/images/placeholder-category.jpg';
                      }}
                    />
                    <div className="category-overlay">
                      <div className="category-icon">
                        <i className={category.icon}></i>
                      </div>
                    </div>
                  </div>
                  <div className="category-content">
                    <h4 className="category-name">{category.name}</h4>
                    <p className="category-description">{category.description}</p>
                    <div className="category-count">
                      {Math.floor(Math.random() * 1000) + 100} products
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>

        <div className="row mt-5">
          <div className="col-12 text-center">
            <Link href="/categories" className="btn btn-outline-primary btn-lg">
              View All Categories
            </Link>
          </div>
        </div>
      </div>

      <style jsx>{`
        .categories-section {
          background-color: var(--gray-100);
        }

        .section-header {
          margin-bottom;
        }

        .section-title {
          font-size: 2.5rem;
          font-weight;
          color: var(--secondary-color);
          margin-bottom;
        }

        .section-subtitle {
          font-size: 1.1rem;
          color: var(--gray-600);
          margin-bottom;
        }

        .category-link {
          text-decoration;
          color;
          display;
          height: 100%;
        }

        .category-card {
          background;
          border-radius: var(--border-radius-xl);
          overflow;
          box-shadow: var(--shadow-sm);
          transition: var(--transition);
          height: 100%;
          display;
          flex-direction;
        }

        .category-card:hover {
          transform: translateY(-5px);
          box-shadow: var(--shadow-lg);
        }

        .category-image {
          position;
          height;
          overflow;
        }

        .category-image img {
          width: 100%;
          height: 100%;
          object-fit;
          transition: var(--transition);
        }

        .category-overlay {
          position;
          top;
          left;
          right;
          bottom;
          background: linear-gradient(135deg, rgba(131, 183, 53, 0.8) 0%, rgba(131, 183, 53, 0.6) 100%);
          display;
          align-items;
          justify-content;
          opacity;
          transition: var(--transition);
        }

        .category-card:hover .category-overlay {
          opacity;
        }

        .category-card:hover .category-image img {
          transform: scale(1.1);
        }

        .category-icon {
          color;
          font-size;
          text-align;
        }

        .category-content {
          padding: 1.5rem;
          flex;
          display;
          flex-direction;
        }

        .category-name {
          font-size: 1.25rem;
          font-weight;
          color: var(--secondary-color);
          margin-bottom: 0.5rem;
        }

        .category-description {
          font-size: 0.9rem;
          color: var(--gray-600);
          margin-bottom;
          flex;
        }

        .category-count {
          font-size: 0.85rem;
          color: var(--primary-color);
          font-weight;
          margin-top;
        }

        /* Loading States */
        .loading-shimmer {
          background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
          background-size: 200% 100%;
          animation: shimmer 1.5s infinite;
          border-radius;
        }

        .category-card.loading .category-image {
          background: #f0f0f0;
        }

        .category-card.loading .category-content {
          padding: 1.5rem;
        }

        .category-card.loading .category-icon {
          width;
          height;
          margin;
        }

        .category-card.loading .category-name {
          width: 80%;
          height;
          margin-bottom: 0.5rem;
        }

        .category-card.loading .category-count {
          width: 60%;
          height;
          margin-top;
        }

        @keyframes shimmer {
          0% {
            background-position: -200% 0;
          }
          100% {
            background-position: 200% 0;
          }
        }

        @media (max-width) {
          .section-title {
            font-size;
          }

          .category-image {
            height;
          }

          .category-content {
            padding;
          }

          .category-name {
            font-size: 1.1rem;
          }
        }
      `}</style>
    </section>
  );
};

export default CategoriesSection;

