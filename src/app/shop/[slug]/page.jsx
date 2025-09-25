'use client';

import React, { useEffect, useState } from 'react';
import Layout from '@/components/Layout';
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { apiService } from '@/services/api';
import PriceDisplay from '@/components/PriceDisplay';

export default function ProductDetailPage() {
  const params = useParams();
  const slug = params.slug;
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        
        // Try to fetch from API first
        const response = await apiService.getProductBySlug(slug);
        
        if (response.success && response.data) {
          // Transform API data to match our component structure
          const apiProduct = response.data;
          const transformedProduct = {
            id: apiProduct.id,
            slug: apiProduct.slug || slug,
            name: apiProduct.name || apiProduct.title || slug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
            price: parseFloat(apiProduct.price || 0),
            sale_price: apiProduct.sale_price ? parseFloat(apiProduct.sale_price) : null,
            sku: apiProduct.sku || 'PROD-' + Math.random().toString(36).substr(2, 9).toUpperCase(),
            stock_quantity: apiProduct.stock_quantity || apiProduct.stock || 0,
            weight: apiProduct.weight || 'N/A',
            dimensions: apiProduct.dimensions || 'N/A',
            description: apiProduct.description || apiProduct.short_description || `This is a detailed description of the ${slug.replace(/-/g, ' ')}.`,
            long_description: apiProduct.long_description || apiProduct.description || `The ${slug.replace(/-/g, ' ')} is a premium product designed to meet the highest standards of quality and performance.`,
            images: apiProduct.images ? 
              (Array.isArray(apiProduct.images) ? apiProduct.images : [apiProduct.images]) :
              [
                'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=600&h=600&fit=crop&crop=center',
                'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&h=600&fit=crop&crop=center',
                'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&h=600&fit=crop&crop=center',
                'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&h=600&fit=crop&crop=center'
              ],
            category: apiProduct.category?.name || apiProduct.category || 'General',
            is_featured: apiProduct.is_featured || false,
            is_new: apiProduct.is_new || false,
            rating: apiProduct.rating || 4.5,
            reviews_count: apiProduct.reviews_count || apiProduct.reviews?.length || Math.floor(Math.random() * 100) + 20,
            specifications: apiProduct.specifications || {
              'Brand': apiProduct.brand || 'Premium Brand',
              'Model': apiProduct.model || slug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
              'Color': apiProduct.color || 'Black',
              'Material': apiProduct.material || 'Premium Materials',
              'Warranty': apiProduct.warranty || '1 Year',
              'Origin': apiProduct.origin || 'USA'
            }
          };
          
          setProduct(transformedProduct);
        } else {
          // Fallback to mock data if API fails
          console.warn('API failed, using mock data:', response.error);
          const mockProduct = {
            id: 1,
            slug: slug,
            name: slug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
            price: 999.99,
            sale_price: 899.99,
            sku: 'PROD-' + Math.random().toString(36).substr(2, 9).toUpperCase(),
            stock_quantity: Math.floor(Math.random() * 50) + 10,
            weight: '0.5 lbs',
            dimensions: '6.1 x 2.8 x 0.3 inches',
            description: `This is a detailed description of the ${slug.replace(/-/g, ' ')}. It features premium quality materials, excellent performance, and comes with a comprehensive warranty. Perfect for both personal and professional use.`,
            long_description: `The ${slug.replace(/-/g, ' ')} is a premium product designed to meet the highest standards of quality and performance. 

Key Features:
• Premium materials and construction
• Advanced technology integration
• User-friendly design
• Comprehensive warranty coverage
• Excellent customer support

This product has been carefully crafted to provide exceptional value and performance. Whether you're using it for personal or professional purposes, you'll appreciate the attention to detail and quality that went into its creation.

Specifications:
• Material: High-grade components
• Dimensions: 6.1 x 2.8 x 0.3 inches
• Weight: 0.5 lbs
• Warranty: 1 year manufacturer warranty
• Support: 24/7 customer service`,
            images: [
              'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=600&h=600&fit=crop&crop=center',
              'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&h=600&fit=crop&crop=center',
              'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&h=600&fit=crop&crop=center',
              'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&h=600&fit=crop&crop=center'
            ],
            category: 'Electronics',
            is_featured: Math.random() > 0.5,
            is_new: Math.random() > 0.7,
            rating: 4.5,
            reviews_count: Math.floor(Math.random() * 100) + 20,
            specifications: {
              'Brand': 'Premium Brand',
              'Model': slug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
              'Color': 'Black',
              'Material': 'Premium Materials',
              'Warranty': '1 Year',
              'Origin': 'USA'
            }
          };
          
          setProduct(mockProduct);
        }
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching product:', error);
        setError('Product not found');
        setLoading(false);
      }
    };

    if (slug) {
      fetchProduct();
    }
  }, [slug]);

  const handleQuantityChange = (change) => {
    setQuantity(prev => {
      const newQuantity = prev + change;
      return Math.max(1, Math.min(newQuantity, product?.stock_quantity || 1));
    });
  };

  const handleAddToCart = async () => {
    try {
      const response = await apiService.addToCart(product.id, quantity);
      if (response.success) {
        // Show success message or update cart state
        console.log('Added to cart successfully');
        // You can add a toast notification here
      } else {
        console.error('Failed to add to cart:', response.error);
        // You can add an error notification here
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      // You can add an error notification here
    }
  };

  const handleAddToWishlist = async () => {
    try {
      const response = await apiService.addToWishlist(product.id);
      if (response.success) {
        // Show success message or update wishlist state
        console.log('Added to wishlist successfully');
        // You can add a toast notification here
      } else {
        console.error('Failed to add to wishlist:', response.error);
        // You can add an error notification here
      }
    } catch (error) {
      console.error('Error adding to wishlist:', error);
      // You can add an error notification here
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="container py-5 text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3">Loading product...</p>
        </div>
      </Layout>
    );
  }

  if (error || !product) {
    return (
      <Layout>
        <div className="container py-5 text-center">
          <div className="alert alert-danger" role="alert">
            <h4 className="alert-heading">Product Not Found!</h4>
            <p>The product you're looking for doesn't exist or has been removed.</p>
            <hr />
            <Link href="/shop" className="btn btn-primary">
              <i className="fas fa-arrow-left me-2"></i>
              Back to Shop
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="product-detail-page py-5">
        <div className="container">
          {/* Breadcrumb */}
          <nav aria-label="breadcrumb" className="mb-4">
            <ol className="breadcrumb">
              <li className="breadcrumb-item"><Link href="/">Home</Link></li>
              <li className="breadcrumb-item"><Link href="/shop">Shop</Link></li>
              <li className="breadcrumb-item active" aria-current="page">{product.name}</li>
            </ol>
          </nav>

          <div className="row">
            {/* Product Images */}
            <div className="col-lg-6">
              <div className="product-images">
                <div className="main-image mb-3">
                  <Image
                    src={product.images[selectedImage]}
                    alt={product.name}
                    width={600}
                    height={600}
                    className="img-fluid rounded"
                  />
                </div>
                <div className="thumbnail-images d-flex gap-2">
                  {product.images.map((image, index) => (
                    <button
                      key={index}
                      className={`thumbnail ${selectedImage === index ? 'active' : ''}`}
                      onClick={() => setSelectedImage(index)}
                    >
                      <Image
                        src={image}
                        alt={`${product.name} ${index + 1}`}
                        width={80}
                        height={80}
                        className="img-fluid rounded"
                      />
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Product Info */}
            <div className="col-lg-6">
              <div className="product-info">
                <h1 className="product-title">{product.name}</h1>
                
                {/* Product Status Badges */}
                <div className="product-badges mb-3">
                  {product.is_featured && (
                    <span className="badge badge-featured me-2">
                      <i className="fas fa-crown"></i>
                      Featured
                    </span>
                  )}
                  {product.sale_price && (
                    <span className="badge badge-sale me-2">
                      <i className="fas fa-percentage"></i>
                      Sale
                    </span>
                  )}
                  {product.is_new && (
                    <span className="badge badge-new me-2">
                      <i className="fas fa-star"></i>
                      New
                    </span>
                  )}
                  <span className="badge badge-category">
                    <i className="fas fa-tag"></i>
                    {product.category}
                  </span>
                </div>

                {/* Rating */}
                <div className="product-rating mb-3">
                  <div className="stars">
                    {[...Array(5)].map((_, i) => (
                      <i
                        key={i}
                        className={`fas fa-star ${i < Math.floor(product.rating) ? 'text-warning' : 'text-muted'}`}
                      />
                    ))}
                  </div>
                  <span className="rating-text ms-2">
                    {product.rating} ({product.reviews_count} reviews)
                  </span>
                </div>

                {/* Price */}
                <div className="product-price mb-4">
                  <PriceDisplay 
                    amount={product.sale_price || product.price} 
                    className="current-price h3 text-primary"
                    fromCurrency="USD"
                  />
                  {product.sale_price && (
                    <span className="compare-price ms-2">
                      <del>
                        <PriceDisplay 
                          amount={product.price} 
                          fromCurrency="USD"
                        />
                      </del>
                    </span>
                  )}
                </div>

                {/* Description */}
                <div className="product-description mb-4">
                  <p>{product.description}</p>
                </div>

                {/* Specifications */}
                <div className="product-specifications mb-4">
                  <h5>Specifications</h5>
                  <div className="specs-grid">
                    {Object.entries(product.specifications).map(([key, value]) => (
                      <div key={key} className="spec-item">
                        <span className="spec-label">{key}:</span>
                        <span className="spec-value">{value}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Stock Status */}
                <div className="stock-status mb-4">
                  <span className={`badge ${product.stock_quantity > 0 ? 'bg-success' : 'bg-danger'}`}>
                    <i className={`fas ${product.stock_quantity > 0 ? 'fa-check-circle' : 'fa-times-circle'}`}></i>
                    {product.stock_quantity > 0 ? `${product.stock_quantity} in stock` : 'Out of stock'}
                  </span>
                </div>

                {/* Quantity and Actions */}
                <div className="product-actions">
                  <div className="quantity-selector mb-3">
                    <label className="form-label">Quantity:</label>
                    <div className="input-group" style={{ width: '150px' }}>
                      <button 
                        className="btn btn-outline-secondary" 
                        onClick={() => handleQuantityChange(-1)}
                        disabled={quantity <= 1}
                      >
                        <i className="fas fa-minus"></i>
                      </button>
                      <input 
                        type="number" 
                        className="form-control text-center" 
                        value={quantity}
                        onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                        min="1"
                        max={product.stock_quantity}
                      />
                      <button 
                        className="btn btn-outline-secondary" 
                        onClick={() => handleQuantityChange(1)}
                        disabled={quantity >= product.stock_quantity}
                      >
                        <i className="fas fa-plus"></i>
                      </button>
                    </div>
                  </div>

                  <div className="action-buttons d-flex gap-3">
                    <button 
                      className="btn btn-primary btn-lg flex-fill"
                      onClick={handleAddToCart}
                      disabled={product.stock_quantity === 0}
                    >
                      <i className="fas fa-shopping-cart me-2"></i>
                      Add to Cart
                    </button>
                    <button 
                      className="btn btn-outline-secondary btn-lg"
                      onClick={handleAddToWishlist}
                    >
                      <i className="fas fa-heart"></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Product Details Tabs */}
          <div className="row mt-5">
            <div className="col-12">
              <div className="product-tabs">
                <ul className="nav nav-tabs" id="productTabs" role="tablist">
                  <li className="nav-item" role="presentation">
                    <button className="nav-link active" id="description-tab" data-bs-toggle="tab" data-bs-target="#description" type="button" role="tab">
                      Description
                    </button>
                  </li>
                  <li className="nav-item" role="presentation">
                    <button className="nav-link" id="specifications-tab" data-bs-toggle="tab" data-bs-target="#specifications" type="button" role="tab">
                      Specifications
                    </button>
                  </li>
                  <li className="nav-item" role="presentation">
                    <button className="nav-link" id="reviews-tab" data-bs-toggle="tab" data-bs-target="#reviews" type="button" role="tab">
                      Reviews ({product.reviews_count})
                    </button>
                  </li>
                </ul>
                <div className="tab-content" id="productTabsContent">
                  <div className="tab-pane fade show active" id="description" role="tabpanel">
                    <div className="p-4">
                      <p>{product.long_description}</p>
                    </div>
                  </div>
                  <div className="tab-pane fade" id="specifications" role="tabpanel">
                    <div className="p-4">
                      <div className="specs-grid">
                        {Object.entries(product.specifications).map(([key, value]) => (
                          <div key={key} className="spec-item">
                            <span className="spec-label">{key}:</span>
                            <span className="spec-value">{value}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="tab-pane fade" id="reviews" role="tabpanel">
                    <div className="p-4">
                      <p>Reviews will be displayed here. This is a placeholder for the reviews section.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .product-detail-page {
          background-color: var(--light-color);
        }

        .product-title {
          font-family: var(--font-family-heading);
          font-size: 2.5rem;
          font-weight: 700;
          color: var(--secondary-color);
          margin-bottom: 1rem;
        }

        .product-badges .badge {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          font-size: 12px;
          padding: 6px 12px;
        }

        .badge-featured {
          background: var(--primary-color);
          color: white;
        }

        .badge-sale {
          background: var(--danger-color);
          color: white;
        }

        .badge-new {
          background: var(--success-color);
          color: white;
        }

        .badge-category {
          background: var(--info-color);
          color: white;
        }

        .product-rating {
          display: flex;
          align-items: center;
        }

        .product-rating .stars {
          display: flex;
          gap: 2px;
        }

        .product-rating .stars i {
          font-size: 16px;
        }

        .rating-text {
          color: var(--gray-600);
          font-size: 14px;
        }

        .product-price .current-price {
          font-family: var(--font-family-heading);
          font-weight: 700;
        }

        .product-price .compare-price {
          color: var(--gray-600);
          font-size: 1.2rem;
        }

        .product-description {
          font-size: 16px;
          line-height: 1.6;
          color: var(--gray-700);
        }

        .product-specifications h5 {
          font-family: var(--font-family-heading);
          font-weight: 600;
          color: var(--secondary-color);
          margin-bottom: 1rem;
        }

        .specs-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 12px;
        }

        .spec-item {
          display: flex;
          justify-content: space-between;
          padding: 8px 0;
          border-bottom: 1px solid var(--gray-200);
        }

        .spec-label {
          font-weight: 500;
          color: var(--gray-600);
        }

        .spec-value {
          font-weight: 600;
          color: var(--secondary-color);
        }

        .stock-status .badge {
          font-size: 14px;
          padding: 8px 16px;
          display: inline-flex;
          align-items: center;
          gap: 6px;
        }

        .quantity-selector .form-label {
          font-weight: 500;
          color: var(--secondary-color);
        }

        .action-buttons .btn {
          font-weight: 600;
        }

        .thumbnail {
          border: 2px solid transparent;
          border-radius: 8px;
          overflow: hidden;
          transition: border-color 0.3s ease;
        }

        .thumbnail.active {
          border-color: var(--primary-color);
        }

        .thumbnail:hover {
          border-color: var(--primary-light);
        }

        .product-tabs .nav-tabs {
          border-bottom: 2px solid var(--gray-200);
        }

        .product-tabs .nav-link {
          font-weight: 500;
          color: var(--gray-600);
          border: none;
          padding: 12px 24px;
        }

        .product-tabs .nav-link.active {
          color: var(--primary-color);
          border-bottom: 2px solid var(--primary-color);
          background: none;
        }

        .product-tabs .tab-content {
          background: white;
          border-radius: 0 0 8px 8px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
        }

        @media (max-width: 768px) {
          .product-title {
            font-size: 2rem;
          }

          .specs-grid {
            grid-template-columns: 1fr;
          }

          .action-buttons {
            flex-direction: column;
          }

          .action-buttons .btn {
            width: 100%;
          }
        }
      `}</style>
    </Layout>
  );
}
