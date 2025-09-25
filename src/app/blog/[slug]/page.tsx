'use client';

import React, { useEffect, useState } from 'react';
import Layout from '@/components/Layout';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { apiService } from '@/services/api';
import { BlogPost } from '@/types';

export default function SingleBlogPost() {
  const params = useParams();
  const slug = params?.slug as string;
  
  const [post, setPost] = useState<BlogPost | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<BlogPost[]>([]);
  const [allPosts, setAllPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBlogPost = async () => {
      try {
        setLoading(true);
        
        // Fetch all blog posts and find the one with matching slug
        const response = await apiService.getBlogPosts();
        
        if (response.success) {
          const transformedPosts = response.data.map((post: BlogPost) => ({
            id: post.id,
            title: post.title,
            slug: post.slug,
            content: post.content,
            excerpt: post.excerpt || post.content?.substring(0, 150) + '...',
            featured_image: post.featured_image || 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=800&h=400&fit=crop',
            author: post.author || 'Admin',
            category: post.category || 'General',
            tags: Array.isArray(post.tags) ? post.tags : (post.tags ? JSON.parse(post.tags) : []),
            status: post.status,
            published_at: post.published_at || post.created_at,
            created_at: post.created_at,
            updated_at: post.updated_at,
          }));

          setAllPosts(transformedPosts);

          // Find the current post
          const currentPost = transformedPosts.find((p: BlogPost) => p.slug === slug);
          
          if (currentPost) {
            setPost(currentPost);
            
            // Get related posts (same category, excluding current post)
            const related = transformedPosts
              .filter((p: BlogPost) => p.category === currentPost.category && p.id !== currentPost.id)
              .slice(0, 4);
            setRelatedPosts(related);
          } else {
            setError('Blog post not found');
          }
        } else {
          setError('Failed to fetch blog post');
        }
      } catch (err) {
        console.error('Error fetching blog post:', err);
        setError('An error occurred while fetching the blog post');
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchBlogPost();
    }
  }, [slug]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getUniqueCategories = () => {
    const categories = allPosts.map(post => post.category);
    return [...new Set(categories)];
  };

  const recentPosts = allPosts.slice(0, 5);

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
                <p className="mt-3">Loading blog post...</p>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (error || !post) {
    return (
      <Layout>
        <div className="container py-5">
          <div className="row">
            <div className="col-12">
              <div className="text-center py-5">
                <i className="fas fa-exclamation-triangle fa-3x text-warning mb-3"></i>
                <h2 className="text-muted">Blog Post Not Found</h2>
                <p className="text-muted mb-4">
                  {error || 'The blog post you are looking for does not exist.'}
                </p>
                <Link href="/blog" className="btn btn-primary">
                  <i className="fas fa-arrow-left me-2"></i>
                  Back to Blog
                </Link>
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
              <li className="breadcrumb-item">
                <Link href="/blog" className="text-decoration-none">Blog</Link>
              </li>
              <li className="breadcrumb-item active" aria-current="page">
                {post.title}
              </li>
            </ol>
          </nav>
        </div>
      </div>

      {/* Blog Post Header */}
      <div className="blog-post-header py-5">
        <div className="container">
          <div className="row">
            <div className="col-lg-8 mx-auto text-center">
              <div className="post-category mb-3">
                <span className="category-badge">{post.category}</span>
              </div>
              <h1 className="post-title mb-4">{post.title}</h1>
              <div className="post-meta">
                <div className="meta-item">
                  <img 
                    src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face" 
                    alt={post.author}
                    className="author-avatar"
                  />
                  <span className="author-name">By {post.author}</span>
                </div>
                <div className="meta-item">
                  <i className="fas fa-calendar"></i>
                  <span>{formatDate(post.published_at)}</span>
                </div>
                <div className="meta-item">
                  <i className="fas fa-clock"></i>
                  <span>5 min read</span>
                </div>
                <div className="meta-item">
                  <i className="fas fa-eye"></i>
                  <span>1,234 views</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Image */}
      <div className="featured-image-section">
        <div className="container">
          <div className="row">
            <div className="col-lg-10 mx-auto">
              <div className="featured-image-wrapper">
                <img
                  src={post.featured_image}
                  alt={post.title}
                  className="featured-image"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="blog-post-content py-5">
        <div className="container">
          <div className="row">
            {/* Main Article */}
            <div className="col-lg-8">
              <article className="blog-article">
                {/* Post Content */}
                <div className="article-content">
                  <div 
                    dangerouslySetInnerHTML={{ __html: post.content }}
                    className="blog-content-text"
                  />
                </div>

                {/* Tags */}
                {post.tags && post.tags.length > 0 && (
                  <div className="article-tags">
                    <h6 className="tags-title">Tags:</h6>
                    <div className="tags-list">
                      {post.tags.map((tag, index) => (
                        <span key={index} className="tag-item">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Author Bio */}
                <div className="author-bio-section">
                  <div className="author-bio-card">
                    <div className="author-info">
                      <img 
                        src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop&crop=face" 
                        alt={post.author}
                        className="author-bio-avatar"
                      />
                      <div className="author-details">
                        <h5 className="author-bio-name">{post.author}</h5>
                        <p className="author-bio-title">Content Writer & SEO Specialist</p>
                        <p className="author-bio-description">
                          Passionate about creating engaging content that helps businesses grow online. 
                          With over 5 years of experience in digital marketing and e-commerce.
                        </p>
                        <div className="author-social-links">
                          <a href="#" className="social-link"><i className="fab fa-twitter"></i></a>
                          <a href="#" className="social-link"><i className="fab fa-linkedin-in"></i></a>
                          <a href="#" className="social-link"><i className="fab fa-instagram"></i></a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Share Section */}
                <div className="article-share">
                  <h6 className="share-title">Share this article:</h6>
                  <div className="share-buttons">
                    <a 
                      href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(typeof window !== 'undefined' ? window.location.href : '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="share-btn facebook"
                    >
                      <i className="fab fa-facebook-f"></i>
                      Facebook
                    </a>
                    <a 
                      href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(typeof window !== 'undefined' ? window.location.href : '')}&text=${encodeURIComponent(post.title)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="share-btn twitter"
                    >
                      <i className="fab fa-twitter"></i>
                      Twitter
                    </a>
                    <a 
                      href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(typeof window !== 'undefined' ? window.location.href : '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="share-btn linkedin"
                    >
                      <i className="fab fa-linkedin-in"></i>
                      LinkedIn
                    </a>
                    <button 
                      className="share-btn copy"
                      onClick={() => {
                        if (typeof window !== 'undefined') {
                          navigator.clipboard.writeText(window.location.href);
                        }
                      }}
                    >
                      <i className="fas fa-link"></i>
                      Copy Link
                    </button>
                  </div>
                </div>

                {/* Navigation */}
                <div className="article-navigation">
                  <Link href="/blog" className="nav-btn back-to-blog">
                    <i className="fas fa-arrow-left"></i>
                    Back to Blog
                  </Link>
                </div>
              </article>
            </div>

            {/* Sidebar */}
            <div className="col-lg-4">
              <div className="blog-sidebar">
                {/* Search Widget */}
                <div className="sidebar-widget search-widget">
                  <h4 className="widget-title">Search Blog</h4>
                  <div className="search-form">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Search articles..."
                    />
                    <button className="search-btn">
                      <i className="fas fa-search"></i>
                    </button>
                  </div>
                </div>

                {/* Categories Widget */}
                <div className="sidebar-widget categories-widget">
                  <h4 className="widget-title">Categories</h4>
                  <ul className="category-list">
                    {getUniqueCategories().map(category => {
                      const count = allPosts.filter(p => p.category === category).length;
                      return (
                        <li key={category}>
                          <Link href={`/blog?category=${category}`} className="category-link">
                            {category} <span className="count">({count})</span>
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </div>

                {/* Recent Posts Widget */}
                <div className="sidebar-widget recent-posts-widget">
                  <h4 className="widget-title">Recent Posts</h4>
                  <div className="recent-posts-list">
                    {recentPosts.slice(0, 4).map(recentPost => (
                      <div key={recentPost.id} className="recent-post-item">
                        <div className="recent-post-image">
                          <img src={recentPost.featured_image} alt={recentPost.title} />
                        </div>
                        <div className="recent-post-content">
                          <h6 className="recent-post-title">
                            <Link href={`/blog/${recentPost.slug}`}>{recentPost.title}</Link>
                          </h6>
                          <div className="recent-post-meta">
                            <span><i className="fas fa-calendar"></i> {formatDate(recentPost.published_at)}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Newsletter Widget */}
                <div className="sidebar-widget newsletter-widget">
                  <h4 className="widget-title">Stay Updated</h4>
                  <p>Subscribe to our newsletter to get the latest posts delivered to your inbox.</p>
                  <form className="newsletter-form">
                    <input
                      type="email"
                      className="form-control"
                      placeholder="Your email address"
                    />
                    <button type="submit" className="btn btn-primary w-100 mt-2">
                      Subscribe
                    </button>
                  </form>
                </div>

                {/* Tags Widget */}
                <div className="sidebar-widget tags-widget">
                  <h4 className="widget-title">Popular Tags</h4>
                  <div className="tags-cloud">
                    <span className="tag">E-commerce</span>
                    <span className="tag">Auctions</span>
                    <span className="tag">Marketplace</span>
                    <span className="tag">Business</span>
                    <span className="tag">Technology</span>
                    <span className="tag">Tips</span>
                    <span className="tag">Trends</span>
                    <span className="tag">Shopping</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Related Posts Section */}
      {relatedPosts.length > 0 && (
        <div className="related-posts-section py-5 bg-light">
          <div className="container">
            <div className="row">
              <div className="col-12">
                <h3 className="section-title text-center mb-5">Related Articles</h3>
              </div>
            </div>
            <div className="row">
              {relatedPosts.map((relatedPost) => (
                <div key={relatedPost.id} className="col-md-6 col-lg-3 mb-4">
                  <article className="related-post-card">
                    <div className="related-post-image">
                      <img
                        src={relatedPost.featured_image}
                        alt={relatedPost.title}
                      />
                      <div className="related-post-category">
                        <span className="badge">{relatedPost.category}</span>
                      </div>
                    </div>
                    <div className="related-post-content">
                      <h5 className="related-post-title">
                        <Link href={`/blog/${relatedPost.slug}`}>
                          {relatedPost.title}
                        </Link>
                      </h5>
                      <div className="related-post-meta">
                        <span><i className="fas fa-calendar"></i> {formatDate(relatedPost.published_at)}</span>
                      </div>
                      <p className="related-post-excerpt">{relatedPost.excerpt}</p>
                      <Link href={`/blog/${relatedPost.slug}`} className="read-more-link">
                        Read More <i className="fas fa-arrow-right"></i>
                      </Link>
                    </div>
                  </article>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        /* Blog Single Post Styles - WoodMart Inspired */
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

        /* Blog Post Header */
        .blog-post-header {
          background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
          border-bottom: 1px solid #e9ecef;
        }

        .category-badge {
          background: var(--primary-color);
          color: white;
          padding: 8px 16px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .post-title {
          font-size: 3rem;
          font-weight: 800;
          line-height: 1.2;
          color: #212529;
          margin-bottom: 2rem;
        }

        .post-meta {
          display: flex;
          justify-content: center;
          gap: 30px;
          flex-wrap: wrap;
        }

        .meta-item {
          display: flex;
          align-items: center;
          gap: 8px;
          color: #6c757d;
          font-size: 14px;
          font-weight: 500;
        }

        .author-avatar {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          object-fit: cover;
        }

        /* Featured Image */
        .featured-image-section {
          padding: 3rem 0;
        }

        .featured-image-wrapper {
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.1);
        }

        .featured-image {
          width: 100%;
          height: 500px;
          object-fit: cover;
        }

        /* Article Content */
        .blog-article {
          background: white;
          border-radius: 16px;
          padding: 3rem;
          box-shadow: 0 5px 25px rgba(0, 0, 0, 0.05);
        }

        .article-content {
          margin-bottom: 3rem;
        }

        .blog-content-text {
          font-size: 18px;
          line-height: 1.8;
          color: #4a5568;
        }

        .blog-content-text h1,
        .blog-content-text h2,
        .blog-content-text h3 {
          color: #2d3748;
          font-weight: 700;
          margin: 2.5rem 0 1.5rem 0;
        }

        .blog-content-text h2 {
          font-size: 2rem;
        }

        .blog-content-text h3 {
          font-size: 1.5rem;
        }

        .blog-content-text p {
          margin-bottom: 1.8rem;
        }

        .blog-content-text ul,
        .blog-content-text ol {
          margin: 1.5rem 0;
          padding-left: 2rem;
        }

        .blog-content-text li {
          margin-bottom: 0.8rem;
        }

        .blog-content-text blockquote {
          border-left: 4px solid var(--primary-color);
          padding: 1.5rem 2rem;
          margin: 2.5rem 0;
          background: #f8f9fa;
          border-radius: 0 8px 8px 0;
          font-style: italic;
          color: #6c757d;
        }

        /* Article Tags */
        .article-tags {
          padding: 2rem 0;
          border-top: 1px solid #e9ecef;
          border-bottom: 1px solid #e9ecef;
          margin-bottom: 3rem;
        }

        .tags-title {
          font-weight: 600;
          color: #2d3748;
          margin-bottom: 1rem;
        }

        .tags-list {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
        }

        .tag-item {
          background: #f8f9fa;
          color: #6c757d;
          padding: 8px 16px;
          border-radius: 20px;
          font-size: 14px;
          font-weight: 500;
          text-decoration: none;
          transition: all 0.3s ease;
          cursor: pointer;
        }

        .tag-item:hover {
          background: var(--primary-color);
          color: white;
        }

        /* Author Bio */
        .author-bio-section {
          margin-bottom: 3rem;
        }

        .author-bio-card {
          background: #f8f9fa;
          border-radius: 12px;
          padding: 2rem;
        }

        .author-info {
          display: flex;
          gap: 1.5rem;
          align-items: flex-start;
        }

        .author-bio-avatar {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          object-fit: cover;
          flex-shrink: 0;
        }

        .author-bio-name {
          font-size: 1.25rem;
          font-weight: 700;
          color: #2d3748;
          margin-bottom: 0.5rem;
        }

        .author-bio-title {
          color: var(--primary-color);
          font-weight: 600;
          margin-bottom: 1rem;
        }

        .author-bio-description {
          color: #6c757d;
          line-height: 1.6;
          margin-bottom: 1rem;
        }

        .author-social-links {
          display: flex;
          gap: 10px;
        }

        .social-link {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 36px;
          height: 36px;
          background: white;
          color: #6c757d;
          border-radius: 50%;
          text-decoration: none;
          transition: all 0.3s ease;
        }

        .social-link:hover {
          background: var(--primary-color);
          color: white;
          transform: translateY(-2px);
        }

        /* Share Section */
        .article-share {
          margin-bottom: 3rem;
        }

        .share-title {
          font-weight: 600;
          color: #2d3748;
          margin-bottom: 1rem;
        }

        .share-buttons {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
        }

        .share-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 20px;
          border-radius: 25px;
          text-decoration: none;
          font-weight: 500;
          font-size: 14px;
          border: none;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .share-btn.facebook {
          background: #3b5998;
          color: white;
        }

        .share-btn.twitter {
          background: #1da1f2;
          color: white;
        }

        .share-btn.linkedin {
          background: #0077b5;
          color: white;
        }

        .share-btn.copy {
          background: #6c757d;
          color: white;
        }

        .share-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
        }

        /* Navigation */
        .article-navigation {
          text-align: center;
        }

        .nav-btn {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          padding: 12px 30px;
          background: var(--primary-color);
          color: white;
          text-decoration: none;
          border-radius: 25px;
          font-weight: 600;
          transition: all 0.3s ease;
        }

        .nav-btn:hover {
          background: var(--primary-hover);
          color: white;
          transform: translateY(-2px);
        }

        /* Sidebar Styles */
        .blog-sidebar {
          padding-left: 2rem;
        }

        .sidebar-widget {
          background: white;
          padding: 2rem;
          border-radius: 12px;
          box-shadow: 0 3px 15px rgba(0, 0, 0, 0.06);
          margin-bottom: 2rem;
        }

        .widget-title {
          font-size: 1.25rem;
          font-weight: 700;
          color: #2d3748;
          margin-bottom: 1.5rem;
          position: relative;
          padding-bottom: 10px;
        }

        .widget-title::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          width: 40px;
          height: 2px;
          background: var(--primary-color);
        }

        /* Search Widget */
        .search-form {
          position: relative;
        }

        .search-btn {
          position: absolute;
          right: 5px;
          top: 5px;
          bottom: 5px;
          background: var(--primary-color);
          border: none;
          color: white;
          border-radius: 6px;
          padding: 0 15px;
          transition: background 0.3s ease;
        }

        .search-btn:hover {
          background: var(--primary-hover);
        }

        /* Categories Widget */
        .category-list {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .category-list li {
          border-bottom: 1px solid #f0f0f0;
          padding: 12px 0;
        }

        .category-list li:last-child {
          border-bottom: none;
        }

        .category-link {
          display: flex;
          justify-content: space-between;
          align-items: center;
          color: #6c757d;
          text-decoration: none;
          font-weight: 500;
          transition: color 0.3s ease;
        }

        .category-link:hover {
          color: var(--primary-color);
        }

        .count {
          font-size: 12px;
          color: #adb5bd;
        }

        /* Recent Posts Widget */
        .recent-post-item {
          display: flex;
          gap: 12px;
          padding: 15px 0;
          border-bottom: 1px solid #f0f0f0;
        }

        .recent-post-item:last-child {
          border-bottom: none;
        }

        .recent-post-image {
          flex-shrink: 0;
          width: 70px;
          height: 70px;
          border-radius: 8px;
          overflow: hidden;
        }

        .recent-post-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .recent-post-title {
          font-size: 14px;
          line-height: 1.4;
          margin-bottom: 8px;
        }

        .recent-post-title a {
          color: #2d3748;
          text-decoration: none;
          transition: color 0.3s ease;
        }

        .recent-post-title a:hover {
          color: var(--primary-color);
        }

        .recent-post-meta {
          font-size: 12px;
          color: #6c757d;
        }

        /* Newsletter Widget */
        .newsletter-widget p {
          color: #6c757d;
          font-size: 14px;
          margin-bottom: 1.5rem;
        }

        /* Tags Widget */
        .tags-cloud {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }

        .tag {
          background: #f8f9fa;
          color: #6c757d;
          padding: 6px 12px;
          border-radius: 20px;
          font-size: 12px;
          text-decoration: none;
          transition: all 0.3s ease;
          cursor: pointer;
        }

        .tag:hover {
          background: var(--primary-color);
          color: white;
        }

        /* Related Posts Section */
        .related-posts-section {
          background: #f8f9fa;
        }

        .section-title {
          font-size: 2.5rem;
          font-weight: 700;
          color: #2d3748;
        }

        .related-post-card {
          background: white;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 3px 15px rgba(0, 0, 0, 0.06);
          transition: all 0.3s ease;
          height: 100%;
        }

        .related-post-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
        }

        .related-post-image {
          position: relative;
          height: 200px;
          overflow: hidden;
        }

        .related-post-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.3s ease;
        }

        .related-post-card:hover .related-post-image img {
          transform: scale(1.05);
        }

        .related-post-category {
          position: absolute;
          top: 15px;
          left: 15px;
        }

        .related-post-category .badge {
          background: var(--primary-color);
          color: white;
          padding: 6px 12px;
          border-radius: 20px;
          font-size: 11px;
          font-weight: 600;
          text-transform: uppercase;
        }

        .related-post-content {
          padding: 1.5rem;
        }

        .related-post-title {
          font-size: 1.1rem;
          font-weight: 600;
          margin-bottom: 10px;
          line-height: 1.3;
        }

        .related-post-title a {
          color: #2d3748;
          text-decoration: none;
          transition: color 0.3s ease;
        }

        .related-post-title a:hover {
          color: var(--primary-color);
        }

        .related-post-meta {
          font-size: 12px;
          color: #6c757d;
          margin-bottom: 1rem;
        }

        .related-post-excerpt {
          color: #6c757d;
          font-size: 14px;
          line-height: 1.5;
          margin-bottom: 1rem;
        }

        .read-more-link {
          color: var(--primary-color);
          text-decoration: none;
          font-weight: 600;
          font-size: 14px;
          transition: all 0.3s ease;
        }

        .read-more-link:hover {
          color: var(--primary-hover);
          transform: translateX(5px);
        }

        /* Responsive Design */
        @media (max-width: 991px) {
          .blog-sidebar {
            padding-left: 0;
            margin-top: 3rem;
          }
        }

        @media (max-width: 768px) {
          .post-title {
            font-size: 2rem;
          }

          .post-meta {
            flex-direction: column;
            gap: 15px;
          }

          .featured-image {
            height: 300px;
          }

          .blog-article {
            padding: 2rem 1.5rem;
          }

          .blog-content-text {
            font-size: 16px;
          }

          .author-info {
            flex-direction: column;
            text-align: center;
          }

          .share-buttons {
            justify-content: center;
          }

          .sidebar-widget {
            padding: 1.5rem;
          }
        }

        @media (max-width: 576px) {
          .post-title {
            font-size: 1.75rem;
          }

          .blog-content-text h2 {
            font-size: 1.5rem;
          }

          .blog-content-text h3 {
            font-size: 1.25rem;
          }

          .share-btn {
            font-size: 12px;
            padding: 8px 16px;
          }
        }
      `}</style>
    </Layout>
  );
}