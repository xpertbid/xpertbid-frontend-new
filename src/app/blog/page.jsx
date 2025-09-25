'use client';

import React, { useEffect, useState } from 'react';
import Layout from '@/components/Layout';
import Link from 'next/link';
import { apiService } from '@/services/api';

export default function BlogPage() {
  const [blogPosts, setBlogPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchBlogPosts = async () => {
      try {
        setLoading(true);
        const response = await apiService.getBlogPosts();
        
        if (response.success) {
          // Transform the API response to match our BlogPost ));
          setBlogPosts(transformedPosts);
        } else {
          setError('Failed to fetch blog posts');
        }
      } catch (err) {
        console.error('Error fetching blog posts:', err);
        setError('An error occurred while fetching blog posts');
      } finally {
        setLoading(false);
      }
    };

    fetchBlogPosts();
  }, []);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getUniqueCategories = () => {
    const categories = blogPosts.map(post => post.category);
    return [...new Set(categories)];
  };

  const filteredPosts = blogPosts.filter(post => {
    const matchesCategory = selectedCategory === 'all' || post.category === selectedCategory;
    const matchesSearch = searchQuery === '' || 
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const featuredPost = blogPosts.find(post => post.id === 1) || blogPosts[0];
  const regularPosts = filteredPosts.filter(post => post.id !== featuredPost?.id);

  if (loading) {
    return (
      <Layout>
        <div className="container py-5">
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
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="container py-5">
          <div className="row">
            <div className="col-12">
              <div className="alert alert-danger" role="alert">
                <h4 className="alert-heading">Error!</h4>
                <p>{error}</p>
                <hr />
                <p className="mb-0">Please try refreshing the page or contact support if the problem persists.</p>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Breadcrumb */}
      <div className="breadcrumb-section bg-light py-3">
        <div className="container">
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb mb-0">
              <li className="breadcrumb-item">
                <Link href="/" className="text-decoration-none">Home</Link>
              </li>
              <li className="breadcrumb-item active" aria-current="page">Blog</li>
            </ol>
          </nav>
        </div>
      </div>

      {/* Blog Header */}
      <div className="blog-hero py-5">
        <div className="container">
          <div className="row">
            <div className="col-lg-8 mx-auto text-center">
              <h1 className="display-4 fw-bold mb-4">XpertBid Blog</h1>
              <p className="lead text-muted">
                Discover the latest insights, tips, and trends in e-commerce, auctions, and online marketplace strategies.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="blog-content py-5">
        <div className="container">
          {/* Filter Bar */}
          <div className="blog-filters mb-5">
            <div className="row align-items-center">
              <div className="col-md-6">
                <div className="blog-categories">
                  <button
                    className={`filter-btn ${selectedCategory === 'all' ? 'active' : ''}`}
                    onClick={() => setSelectedCategory('all')}
                  >
                    All Posts
                  </button>
                  {getUniqueCategories().map(category => (
                    <button
                      key={category}
                      className={`filter-btn ${selectedCategory === category ? 'active' : ''}`}
                      onClick={() => setSelectedCategory(category)}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>
              <div className="col-md-6">
                <div className="blog-search">
                  <div className="search-box">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Search posts..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <i className="f-search search-icon"></i>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Featured Post */}
          {featuredPost && (
            <div className="featured-post mb-5">
              <article className="blog-post-featured">
                <div className="post-image-wrapper">
                  <img
                    src={featuredPost.featured_image}
                    alt={featuredPost.title}
                    className="post-image"
                  />
                  <div className="post-category-badge">
                    <span className="badge">{featuredPost.category}</span>
                  </div>
                </div>
                <div className="post-content">
                  <div className="post-meta">
                    <span className="meta-item">
                      <i className="f-user"></i>
                      {featuredPost.author}
                    </span>
                    <span className="meta-item">
                      <i className="f-calendar"></i>
                      {formatDate(featuredPost.published_at)}
                    </span>
                    <span className="meta-item">
                      <i className="f-clock"></i>
                      5 min read
                    </span>
                  </div>
                  <h2 className="post-title">
                    <Link href={`/blog/${featuredPost.slug}`}>
                      {featuredPost.title}
                    </Link>
                  </h2>
                  <p className="post-excerpt">{featuredPost.excerpt}</p>
                  <Link href={`/blog/${featuredPost.slug}`} className="read-more-btn">
                    Read Full Article
                    <i className="f-arrow-right"></i>
                  </Link>
                </div>
              </article>
            </div>
          )}

          {/* Regular Posts Grid */}
          <div className="blog-posts-grid">
            <div className="row">
              {regularPosts.length === 0 ? (
                <div className="col-12">
                  <div className="no-posts-message text-center py-5">
                    <i className="f-search fa-3x text-muted mb-3"></i>
                    <h3>No posts found</h3>
                    <p className="text-muted">Try adjusting your search or filter criteria.</p>
                  </div>
                </div>
              ) : (
                regularPosts.map((post) => (
                  <div key={post.id} className="col-lg-4 col-md-6 mb-4">
                    <article className="blog-post-card">
                      <div className="post-image-wrapper">
                        <img
                          src={post.featured_image}
                          alt={post.title}
                          className="post-image"
                        />
                        <div className="post-category-badge">
                          <span className="badge">{post.category}</span>
                        </div>
                      </div>
                      <div className="post-content">
                        <div className="post-meta">
                          <span className="meta-item">
                            <i className="f-user"></i>
                            {post.author}
                          </span>
                          <span className="meta-item">
                            <i className="f-calendar"></i>
                            {formatDate(post.published_at)}
                          </span>
                        </div>
                        <h3 className="post-title">
                          <Link href={`/blog/${post.slug}`}>
                            {post.title}
                          </Link>
                        </h3>
                        <p className="post-excerpt">{post.excerpt}</p>
                        <Link href={`/blog/${post.slug}`} className="read-more-btn">
                          Read More
                          <i className="f-arrow-right"></i>
                        </Link>
                      </div>
                    </article>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Pagination */}
          <div className="blog-pagination mt-5">
            <nav aria-label="Blog pagination">
              <ul className="pagination justify-content-center">
                <li className="page-item disabled">
                  <span className="page-link">Previous</span>
                </li>
                <li className="page-item active">
                  <span className="page-link">1</span>
                </li>
                <li className="page-item">
                  <a className="page-link" href="#">2</a>
                </li>
                <li className="page-item">
                  <a className="page-link" href="#">3</a>
                </li>
                <li className="page-item">
                  <a className="page-link" href="#">Next</a>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </div>

      <style jsx>{`
        /* Blog Styles - WoodMart Inspired (No Sidebar) */
        .breadcrumb-section {
          border-bottom: 1px solid #e9ecef;
        }

        .breadcrumb-item a {
          color: #6c757d;
          transition: color 0.3s ease;
        }

        .breadcrumb-item a:hover {
          color: var(--primary-color);
        }

        .blog-hero {
          background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
          border-bottom: 1px solid #e9ecef;
        }

        /* Filter Bar */
        .blog-filters {
          padding;
          border-bottom: 2px solid #f8f9fa;
        }

        .filter-btn {
          background;
          border;
          padding;
          margin-right;
          color: #6c757d;
          font-weight;
          border-radius;
          transition: all 0.3s ease;
        }

        .filter-btn,
        .filter-btn.active {
          background: var(--primary-color);
          color;
        }

        .search-box {
          position;
        }

        .search-icon {
          position;
          right;
          top: 50%;
          transform: translateY(-50%);
          color: #6c757d;
        }

        /* Featured Post */
        .blog-post-featured {
          background;
          border-radius;
          overflow;
          box-shadow: 0 5px 25px rgba(0, 0, 0, 0.08);
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }

        .blog-post-featured:hover {
          transform: translateY(-5px);
          box-shadow: 0 15px 40px rgba(0, 0, 0, 0.12);
        }

        .post-image-wrapper {
          position;
          overflow;
        }

        .post-image {
          width: 100%;
          height;
          object-fit;
          transition: transform 0.3s ease;
        }

        .blog-post-featured:hover .post-image {
          transform: scale(1.05);
        }

        .post-category-badge {
          position;
          top;
          left;
        }

        .badge {
          background: var(--primary-color);
          color;
          padding;
          border-radius;
          font-size;
          font-weight;
          text-transform;
          letter-spacing: 0.5px;
        }

        .post-content {
          padding;
        }

        .post-meta {
          display;
          gap;
          margin-bottom;
          font-size;
          color: #6c757d;
        }

        .meta-item {
          display;
          align-items;
          gap;
        }

        .post-title {
          margin-bottom;
          font-size;
          font-weight;
          line-height: 1.3;
        }

        .post-title a {
          color: #212529;
          text-decoration;
          transition: color 0.3s ease;
        }

        .post-title a:hover {
          color: var(--primary-color);
        }

        .post-excerpt {
          color: #6c757d;
          line-height: 1.6;
          margin-bottom;
        }

        .read-more-btn {
          display: inline-flex;
          align-items;
          gap;
          color: var(--primary-color);
          font-weight;
          text-decoration;
          text-transform;
          letter-spacing: 0.5px;
          font-size;
          transition: all 0.3s ease;
        }

        .read-more-btn:hover {
          color: var(--primary-hover);
          transform: translateX(5px);
        }

        /* Regular Posts */
        .blog-post-card {
          background;
          border-radius;
          overflow;
          box-shadow: 0 3px 15px rgba(0, 0, 0, 0.06);
          transition: all 0.3s ease;
          height: 100%;
        }

        .blog-post-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
        }

        .blog-post-card .post-image {
          height;
        }

        .blog-post-card .post-content {
          padding;
        }

        .blog-post-card .post-title {
          font-size;
          margin-bottom;
        }

        /* Pagination */
        .pagination .page-link {
          color: #6c757d;
          border: 1px solid #dee2e6;
          padding;
          margin;
          border-radius;
          transition: all 0.3s ease;
        }

        .pagination .page-item.active .page-link {
          background: var(--primary-color);
          border-color: var(--primary-color);
          color;
        }

        .pagination .page-link:hover {
          background: var(--primary-color);
          border-color: var(--primary-color);
          color;
        }

        /* No Posts Message */
        .no-posts-message {
          padding;
        }

        /* Responsive Design */
        @media (max-width) {
          .blog-hero h1 {
            font-size: 2.5rem;
          }
          
          .blog-filters {
            text-align;
          }
          
          .blog-filters .row > div {
            margin-bottom;
          }
          
          .filter-btn {
            margin-bottom;
            display: inline-block;
          }
          
          .post-content {
            padding;
          }
          
          .post-title {
            font-size;
          }
          
          .blog-post-card .post-title {
            font-size;
          }
        }

        @media (max-width) {
          .blog-hero h1 {
            font-size;
          }
          
          .post-meta {
            flex-direction;
            gap;
          }
        }
      `}</style>
    </Layout>
  );
}
