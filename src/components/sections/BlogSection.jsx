'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { apiService } from '@/services/api';
import { BlogPost } from '@/types';

const BlogSection = () => {
  const [blogPosts, setBlogPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlogPosts = async () => {
      try {
        const response = await apiService.getBlogPosts();
        
        if (response.success) {
          // Transform the API response to match our BlogPost interface
          const transformedPosts = response.data.map(post => ({
            id: post.id,
            title: post.title,
            slug: post.slug,
            excerpt: post.excerpt || post.description,
            featured_image: post.featured_image || '/images/no-image.png',
            category: post.category || 'General',
            author: post.author || 'Admin',
            published_at: post.created_at || post.published_at
          }));
          
          // Take only the first 3 posts for the home page
          setBlogPosts(transformedPosts.slice(0, 3));
        }
      } catch (error) {
        console.error('Error fetching blog posts:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogPosts();
  }, []);

  // const formatDate = (dateString) => {
  //   return new Date(dateString).toLocaleDateString('en-US', {
  //     month: 'short',
  //     day: 'numeric',
  //     year: 'numeric'
  //   });
  // };

  if (loading) {
    return (
      <section className="blog-section py-5">
        <div className="container">
          <div className="row">
            <div className="col-12">
              <div className="text-center py-5">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
                <p className="mt-3">Loading blog posts...</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (blogPosts.length === 0) {
    return null; // Don't show section if no blog posts
  }

  return (
    <section className="blog-section py-5">
      <div className="container">
        {/* Section Header */}
        <div className="row mb-5">
          <div className="col-lg-6 mx-auto text-center">
            <div className="section-badge mb-3">
              <span className="badge-text">From Our Blog</span>
            </div>
            <h2 className="section-title mb-4">Latest Stories & Insights</h2>
            <p className="section-subtitle">
              Discover valuable insights, industry trends, and expert tips to help you 
              succeed in the world of online marketplaces and e-commerce.
            </p>
          </div>
        </div>

        {/* Blog Posts Grid */}
        <div className="row g-4">
          {blogPosts.map((post, _index) => (
            <div key={post.id} className="col-lg-4 col-md-6">
              <article className="blog-post-card">
                <div className="post-image-container">
                  <Link href={`/blog/${post.slug}`}>
                    <img
                      src={post.featured_image}
                      alt={post.title}
                      className="post-image"
                    />
                  </Link>
                  <div className="post-category-overlay">
                    <span className="category-badge">{post.category}</span>
                  </div>
                  <div className="post-date-overlay">
                    <div className="date-badge">
                      <span className="date-day">{new Date(post.published_at).getDate()}</span>
                      <span className="date-month">{new Date(post.published_at).toLocaleDateString('en-US', { month: 'short' })}</span>
                    </div>
                  </div>
                </div>
                
                <div className="post-content">
                  <div className="post-meta">
                    <div className="meta-item">
                      <i className="f-user"></i>
                      <span>{post.author}</span>
                    </div>
                    <div className="meta-item">
                      <i className="f-clock"></i>
                      <span>3 min read</span>
                    </div>
                  </div>
                  
                  <h3 className="post-title">
                    <Link href={`/blog/${post.slug}`}>
                      {post.title}
                    </Link>
                  </h3>
                  
                  <p className="post-excerpt">{post.excerpt}</p>
                  
                  <div className="post-footer">
                    <Link href={`/blog/${post.slug}`} className="read-more-link">
                      <span>Read Article</span>
                      <i className="f-arrow-right"></i>
                    </Link>
                  </div>
                </div>
              </article>
            </div>
          ))}
        </div>

        {/* View All Button */}
        <div className="row mt-5">
          <div className="col-12 text-center">
            <Link href="/blog" className="view-all-btn">
              <span>Explore All Articles</span>
              <i className="f-arrow-right"></i>
            </Link>
          </div>
        </div>
      </div>

      <style jsx>{`
        /* Blog Section - WoodMart Inspired */
        .blog-section {
          background: #ffffff;
          position: relative;
          overflow: hidden;
        }

        .blog-section::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(135deg, #f8f9fa 0%, rgba(248, 249, 250, 0.5) 100%);
          z-index: -1;
        }

        /* Section Header */
        .section-badge {
          display: inline-block;
          position: relative;
        }

        .badge-text {
          background: linear-gradient(135deg, var(--primary-color), var(--primary-hover));
          color: #ffffff;
          padding: 0.5rem 1rem;
          border-radius: 50px;
          font-size: 0.875rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 1px;
          box-shadow: 0 4px 15px rgba(67, 172, 233, 0.3);
        }

        .section-title {
          font-size: 2.75rem;
          font-weight: 700;
          color: #2d3748;
          line-height: 1.2;
          margin-bottom: 1.5rem;
          position: relative;
        }

        .section-subtitle {
          font-size: 1.125rem;
          color: #6c757d;
          line-height: 1.6;
          font-weight: 400;
        }

        /* Blog Post Cards */
        .blog-post-card {
          background: #ffffff;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          height: 100%;
          position: relative;
        }

        .blog-post-card:hover {
          transform: translateY(-12px);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
        }

        .post-image-container {
          position: relative;
          height: 250px;
          overflow: hidden;
        }

        .post-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .blog-post-card:hover .post-image {
          transform: scale(1.08);
        }

        .post-category-overlay {
          position: absolute;
          top: 1rem;
          left: 1rem;
          z-index: 2;
        }

        .category-badge {
          background: rgba(67, 172, 233, 0.95);
          color: #ffffff;
          padding: 0.25rem 0.75rem;
          border-radius: 20px;
          font-size: 0.75rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          backdrop-filter: blur(10px);
          box-shadow: 0 4px 15px rgba(67, 172, 233, 0.4);
        }

        .post-date-overlay {
          position: absolute;
          top: 1rem;
          right: 1rem;
          z-index: 2;
        }

        .date-badge {
          background: rgba(255, 255, 255, 0.95);
          color: #2d3748;
          padding: 0.5rem;
          border-radius: 8px;
          text-align: center;
          backdrop-filter: blur(10px);
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
          min-width: 50px;
        }

        .date-day {
          display: block;
          font-size: 1.25rem;
          font-weight: 700;
          line-height: 1;
        }

        .date-month {
          display: block;
          font-size: 0.75rem;
          font-weight: 500;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          color: #6c757d;
          margin-top: 0.25rem;
        }

        /* Post Content */
        .post-content {
          padding: 2rem;
        }

        .post-meta {
          display: flex;
          gap: 1.5rem;
          margin-bottom: 1rem;
        }

        .meta-item {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.875rem;
          color: #6c757d;
          font-weight: 500;
        }

        .meta-item i {
          color: var(--primary-color);
          font-size: 0.875rem;
        }

        .post-title {
          font-size: 1.375rem;
          font-weight: 600;
          line-height: 1.3;
          margin-bottom: 1rem;
          color: #2d3748;
        }

        .post-title a {
          color: inherit;
          text-decoration: none;
          transition: color 0.3s ease;
        }

        .post-title a:hover {
          color: var(--primary-color);
        }

        .post-excerpt {
          color: #6c757d;
          line-height: 1.6;
          margin-bottom: 1.5rem;
          font-size: 1rem;
        }

        .post-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-top: 1rem;
          border-top: 1px solid #f1f3f4;
        }

        .read-more-link {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          color: var(--primary-color);
          text-decoration: none;
          font-weight: 600;
          font-size: 0.875rem;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          transition: all 0.3s ease;
          position: relative;
        }

        .read-more-link::before {
          content: '';
          position: absolute;
          bottom: -2px;
          left: 0;
          width: 0;
          height: 2px;
          background: var(--primary-color);
          transition: width 0.3s ease;
        }

        .read-more-link:hover {
          color: var(--primary-hover);
          transform: translateX(4px);
        }

        .read-more-link:hover::before {
          width: 100%;
        }

        /* View All Button */
        .view-all-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.75rem;
          background: linear-gradient(135deg, var(--primary-color), var(--primary-hover));
          color: #ffffff;
          text-decoration: none;
          padding: 1rem 2rem;
          border-radius: 50px;
          font-weight: 600;
          font-size: 1rem;
          text-transform: uppercase;
          letter-spacing: 1px;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 0 8px 25px rgba(67, 172, 233, 0.3);
          position: relative;
          overflow: hidden;
        }

        .view-all-btn::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
          transition: left 0.6s;
        }

        .view-all-btn:hover {
          color: #ffffff;
          transform: translateY(-3px);
          box-shadow: 0 15px 35px rgba(67, 172, 233, 0.4);
        }

        .view-all-btn:hover::before {
          left: 100%;
        }

        .view-all-btn i {
          transition: transform 0.3s ease;
        }

        .view-all-btn:hover i {
          transform: translateX(4px);
        }

        /* Responsive Design */
        @media (max-width: 992px) {
          .section-title {
            font-size: 2.25rem;
          }

          .post-content {
            padding: 1.5rem;
          }
        }

        @media (max-width: 768px) {
          .section-title {
            font-size: 2rem;
          }

          .section-subtitle {
            font-size: 1rem;
          }

          .post-image-container {
            height: 200px;
          }

          .post-title {
            font-size: 1.25rem;
          }

          .post-meta {
            flex-direction: column;
            gap: 0.5rem;
          }

          .post-content {
            padding: 1.25rem;
          }

          .view-all-btn {
            padding: 0.875rem 1.5rem;
            font-size: 0.875rem;
          }
        }

        @media (max-width: 576px) {
          .section-title {
            font-size: 1.75rem;
          }

          .blog-post-card {
            margin-bottom: 1.5rem;
          }

          .post-category-overlay,
          .post-date-overlay {
            position: static;
            margin-bottom: 1rem;
          }

          .date-badge {
            display: inline-block;
            margin-left: 0;
          }
        }

        /* Animation Effects */
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .blog-post-card {
          animation: fadeInUp 0.6s ease-out;
        }

        .blog-post-card:nth-child(1) {
          animation-delay: 0.1s;
        }

        .blog-post-card:nth-child(2) {
          animation-delay: 0.2s;
        }

        .blog-post-card:nth-child(3) {
          animation-delay: 0.3s;
        }

        /* Hover Effects */
        .blog-post-card:hover .category-badge {
          background: rgba(67, 172, 233, 1);
          transform: scale(1.05);
        }

        .blog-post-card:hover .date-badge {
          background: rgba(255, 255, 255, 1);
          transform: scale(1.05);
        }
      `}</style>
    </section>
  );
};

export default BlogSection;
