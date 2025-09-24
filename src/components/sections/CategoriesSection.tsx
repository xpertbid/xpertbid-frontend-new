'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { imageService } from '@/services/imageService';
import { apiService } from '@/services/api';

interface Category {
  id: number;
  name: string;
  slug: string;
  icon: string;
  image: string;
  product_count: number;
  description: string;
}

const CategoriesSection: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  // Mock data - replace with API call
  const mockCategories: Category[] = [
    {
      id: 1,
      name: 'Electronics',
      slug: 'electronics',
      icon: 'fas fa-laptop',
      image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400&h=300&fit=crop',
      product_count: 1250,
      description: 'Latest gadgets and electronic devices'
    },
    {
      id: 2,
      name: 'Fashion',
      slug: 'fashion',
      icon: 'fas fa-tshirt',
      image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=300&fit=crop',
      product_count: 890,
      description: 'Trendy clothing and accessories'
    },
    {
      id: 3,
      name: 'Home & Garden',
      slug: 'home-garden',
      icon: 'fas fa-home',
      image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop',
      product_count: 650,
      description: 'Everything for your home and garden'
    },
    {
      id: 4,
      name: 'Sports',
      slug: 'sports',
      icon: 'fas fa-dumbbell',
      image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop',
      product_count: 420,
      description: 'Sports equipment and fitness gear'
    },
    {
      id: 5,
      name: 'Books',
      slug: 'books',
      icon: 'fas fa-book',
      image: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=300&fit=crop',
      product_count: 780,
      description: 'Books for all ages and interests'
    },
    {
      id: 6,
      name: 'Automotive',
      slug: 'automotive',
      icon: 'fas fa-car',
      image: 'https://images.unsplash.com/photo-1494905998402-395d579af36f?w=400&h=300&fit=crop',
      product_count: 320,
      description: 'Car parts and automotive accessories'
    },
    {
      id: 7,
      name: 'Health & Beauty',
      slug: 'health-beauty',
      icon: 'fas fa-heart',
      image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&h=300&fit=crop',
      product_count: 540,
      description: 'Health and beauty products'
    },
    {
      id: 8,
      name: 'Toys & Games',
      slug: 'toys-games',
      icon: 'fas fa-gamepad',
      image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop',
      product_count: 380,
      description: 'Fun toys and games for all ages'
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
            apiCategories.map(async (category: any, index: number) => {
              const images = await imageService.getCategoryImages(category.slug || category.name.toLowerCase());
              return {
                ...category,
                image: images[0] || mockCategories[index % mockCategories.length].image,
                icon: mockCategories[index % mockCategories.length].icon,
                description: category.description || mockCategories[index % mockCategories.length].description,
                product_count: category.product_count || Math.floor(Math.random() * 1000) + 100
              };
            })
          );
          setCategories(categoriesWithImages);
        } else {
          // API returned null/empty, use mock data
          console.log('API categories not available, using mock data');
          setCategories(mockCategories);
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
        // Fallback to mock data with real images
        console.log('Using mock categories due to error');
        setCategories(mockCategories);
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
                        const target = e.target as HTMLImageElement;
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
                      {category.product_count} products
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
          margin-bottom: 3rem;
        }

        .section-title {
          font-size: 2.5rem;
          font-weight: 700;
          color: var(--secondary-color);
          margin-bottom: 1rem;
        }

        .section-subtitle {
          font-size: 1.1rem;
          color: var(--gray-600);
          margin-bottom: 0;
        }

        .category-link {
          text-decoration: none;
          color: inherit;
          display: block;
          height: 100%;
        }

        .category-card {
          background: white;
          border-radius: var(--border-radius-xl);
          overflow: hidden;
          box-shadow: var(--shadow-sm);
          transition: var(--transition);
          height: 100%;
          display: flex;
          flex-direction: column;
        }

        .category-card:hover {
          transform: translateY(-5px);
          box-shadow: var(--shadow-lg);
        }

        .category-image {
          position: relative;
          height: 200px;
          overflow: hidden;
        }

        .category-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: var(--transition);
        }

        .category-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(135deg, rgba(131, 183, 53, 0.8) 0%, rgba(131, 183, 53, 0.6) 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0;
          transition: var(--transition);
        }

        .category-card:hover .category-overlay {
          opacity: 1;
        }

        .category-card:hover .category-image img {
          transform: scale(1.1);
        }

        .category-icon {
          color: white;
          font-size: 3rem;
          text-align: center;
        }

        .category-content {
          padding: 1.5rem;
          flex: 1;
          display: flex;
          flex-direction: column;
        }

        .category-name {
          font-size: 1.25rem;
          font-weight: 600;
          color: var(--secondary-color);
          margin-bottom: 0.5rem;
        }

        .category-description {
          font-size: 0.9rem;
          color: var(--gray-600);
          margin-bottom: 1rem;
          flex: 1;
        }

        .category-count {
          font-size: 0.85rem;
          color: var(--primary-color);
          font-weight: 500;
          margin-top: auto;
        }

        /* Loading States */
        .loading-shimmer {
          background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
          background-size: 200% 100%;
          animation: shimmer 1.5s infinite;
          border-radius: 4px;
        }

        .category-card.loading .category-image {
          background: #f0f0f0;
        }

        .category-card.loading .category-content {
          padding: 1.5rem;
        }

        .category-card.loading .category-icon {
          width: 60px;
          height: 60px;
          margin: 0 auto 1rem;
        }

        .category-card.loading .category-name {
          width: 80%;
          height: 20px;
          margin-bottom: 0.5rem;
        }

        .category-card.loading .category-count {
          width: 60%;
          height: 16px;
          margin-top: 1rem;
        }

        @keyframes shimmer {
          0% {
            background-position: -200% 0;
          }
          100% {
            background-position: 200% 0;
          }
        }

        @media (max-width: 768px) {
          .section-title {
            font-size: 2rem;
          }

          .category-image {
            height: 150px;
          }

          .category-content {
            padding: 1rem;
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
