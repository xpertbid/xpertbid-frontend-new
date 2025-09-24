'use client';

import React, { useEffect, useState, use } from 'react';
import Layout from '@/components/Layout';
import Image from 'next/image';
import { apiService, Product } from '@/services/api';
import { useCart } from '@/contexts/CartContext';

interface ProductDetailPageProps {
  params: {
    slug: string;
  };
}

export default function ProductDetailPage({ params }: ProductDetailPageProps) {
  const resolvedParams = use(params);
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<string>('');
  const [quantity, setQuantity] = useState(1);
  const { addToCart, openDrawer } = useCart();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        
        // Get all products first, then find by slug
        const productsResponse = await apiService.getProducts();
        
        if (productsResponse.success) {
          const foundProduct = productsResponse.data.find(p => p.slug === resolvedParams.slug);
          
          if (foundProduct) {
            setProduct(foundProduct);
            
            // Set initial image
            let initialImage = 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=600&h=600&fit=crop';
            
            try {
              if (foundProduct.gallery) {
                if (typeof foundProduct.gallery === 'string') {
                  const galleryArray = JSON.parse(foundProduct.gallery);
                  if (Array.isArray(galleryArray) && galleryArray.length > 0 && galleryArray[0]) {
                    initialImage = galleryArray[0];
                  }
                } else if (Array.isArray(foundProduct.gallery) && foundProduct.gallery.length > 0 && foundProduct.gallery[0]) {
                  initialImage = foundProduct.gallery[0];
                }
              }
            } catch (error) {
              console.warn('Error parsing product gallery:', error);
            }
            
            setSelectedImage(initialImage);
            
            // Fetch related products from the same category
            const relatedProductsData = productsResponse.data.filter(p => 
              p.category_id === foundProduct.category_id && 
              p.id !== foundProduct.id &&
              p.status === 'publish'
            ).slice(0, 4); // Show 4 related products
            
            setRelatedProducts(relatedProductsData);
          } else {
            setError('Product not found');
          }
        }
      } catch (err) {
        console.error('Error fetching product:', err);
        setError('Failed to load product. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [resolvedParams.slug]);

  const handleAddToCart = () => {
    if (!product) return;
    
    // Add product to cart
    addToCart({
      productId: product.id.toString(),
      name: product.name,
      price: parseFloat((product.sale_price || product.price).toString()),
      quantity: quantity,
      image: selectedImage,
      vendor: product.business_name || 'Unknown Vendor',
      sku: product.sku,
    });
    
    // Open the cart drawer
    openDrawer();
  };

  const getGalleryImages = () => {
    if (!product?.gallery) return [selectedImage];
    
    try {
      if (typeof product.gallery === 'string') {
        const galleryArray = JSON.parse(product.gallery);
        return Array.isArray(galleryArray) ? galleryArray : [selectedImage];
      } else if (Array.isArray(product.gallery)) {
        return product.gallery;
      }
    } catch (error) {
      console.warn('Error parsing gallery:', error);
    }
    
    return [selectedImage];
  };

  if (loading) {
    return (
      <Layout>
        <div className="container py-5">
          <div className="text-center">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-3">Loading product...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (error || !product) {
    return (
      <Layout>
        <div className="container py-5">
          <div className="alert alert-danger" role="alert">
            {error || 'Product not found'}
          </div>
        </div>
      </Layout>
    );
  }

  const galleryImages = getGalleryImages();

  return (
    <Layout>
      {/* Breadcrumb */}
      <div className="container py-4">
        <nav aria-label="breadcrumb">
          <ol className="breadcrumb">
            <li className="breadcrumb-item">
              <a href="/" className="text-decoration-none">Home</a>
            </li>
            <li className="breadcrumb-item">
              <a href="/shop" className="text-decoration-none">Shop</a>
            </li>
            <li className="breadcrumb-item active" aria-current="page">
              {product.name}
            </li>
          </ol>
        </nav>
      </div>

      {/* Product Detail */}
      <div className="container py-4">
        <div className="row">
          {/* Product Images */}
          <div className="col-lg-6">
            <div className="product-images">
              {/* Main Image */}
              <div className="main-image mb-3">
                <Image
                  src={selectedImage}
                  alt={product.name}
                  width={600}
                  height={600}
                  className="img-fluid rounded"
                  style={{ objectFit: 'cover' }}
                />
              </div>

              {/* Thumbnail Images */}
              {galleryImages.length > 1 && (
                <div className="thumbnail-images d-flex gap-2">
                  {galleryImages.map((image, index) => (
                    <button
                      key={index}
                      className={`thumbnail-btn ${selectedImage === image ? 'active' : ''}`}
                      onClick={() => setSelectedImage(image)}
                      style={{
                        border: selectedImage === image ? '2px solid var(--primary-color)' : '2px solid transparent',
                        borderRadius: '8px',
                        overflow: 'hidden',
                        padding: 0,
                        background: 'none'
                      }}
                    >
                      <Image
                        src={image}
                        alt={`${product.name} ${index + 1}`}
                        width={80}
                        height={80}
                        style={{ objectFit: 'cover' }}
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Product Info */}
          <div className="col-lg-6">
            <div className="product-info">
              <h1 className="product-title mb-3">{product.name}</h1>
              
              {/* Price */}
              <div className="product-price mb-4">
                <span className="current-price h3 text-primary">
                  ${product.price.toLocaleString()}
                </span>
                {product.sale_price && (
                  <span className="compare-price text-muted ms-2">
                    <del>${product.sale_price.toLocaleString()}</del>
                  </span>
                )}
              </div>

              {/* Rating */}
              <div className="product-rating mb-4">
                <div className="stars mb-2">
                  {[...Array(5)].map((_, i) => (
                    <i
                      key={i}
                      className={`fas fa-star ${i < 4 ? 'text-warning' : 'text-muted'}`}
                    />
                  ))}
                  <span className="ms-2 text-muted">(4.5) - 156 reviews</span>
                </div>
              </div>

              {/* Description */}
              <div className="product-description mb-4">
                <h5>Description</h5>
                <p className="text-muted">{product.description}</p>
              </div>

              {/* Product Details */}
              <div className="product-details mb-4">
                <h5>Product Details</h5>
                <ul className="list-unstyled">
                  <li><strong>SKU:</strong> {product.sku}</li>
                  <li><strong>Category:</strong> {product.category_name}</li>
                  <li><strong>Vendor:</strong> {product.business_name}</li>
                  <li><strong>Stock Status:</strong> 
                    <span className={`badge ms-2 ${product.stock_status === 'in_stock' ? 'bg-success' : 'bg-danger'}`}>
                      {product.stock_status === 'in_stock' ? 'In Stock' : 'Out of Stock'}
                    </span>
                  </li>
                  {product.stock_quantity && (
                    <li><strong>Quantity Available:</strong> {product.stock_quantity}</li>
                  )}
                </ul>
              </div>

              {/* Quantity & Add to Cart */}
              <div className="product-actions">
                <div className="row align-items-center mb-4">
                  <div className="col-auto">
                    <label htmlFor="quantity" className="form-label">Quantity:</label>
                  </div>
                  <div className="col-auto">
                    <div className="input-group" style={{ width: '120px' }}>
                      <button 
                        className="btn btn-outline-secondary" 
                        type="button"
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      >
                        -
                      </button>
                      <input
                        type="number"
                        className="form-control text-center"
                        value={quantity}
                        onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                        min="1"
                      />
                      <button 
                        className="btn btn-outline-secondary" 
                        type="button"
                        onClick={() => setQuantity(quantity + 1)}
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>

                <div className="d-grid gap-2 d-md-flex">
                  <button 
                    className="btn btn-primary btn-lg flex-fill"
                    onClick={handleAddToCart}
                    disabled={product.stock_status !== 'in_stock'}
                  >
                    <i className="fas fa-shopping-cart me-2"></i>
                    Add to Cart
                  </button>
                  <button className="btn btn-outline-secondary btn-lg">
                    <i className="far fa-heart"></i>
                  </button>
                  <button className="btn btn-outline-secondary btn-lg">
                    <i className="fas fa-balance-scale"></i>
                  </button>
                </div>
              </div>

              {/* Additional Info */}
              <div className="product-additional mt-4">
                <div className="accordion" id="productAccordion">
                  <div className="accordion-item">
                    <h2 className="accordion-header">
                      <button 
                        className="accordion-button" 
                        type="button" 
                        data-bs-toggle="collapse" 
                        data-bs-target="#shippingInfo"
                      >
                        Shipping Information
                      </button>
                    </h2>
                    <div id="shippingInfo" className="accordion-collapse collapse show" data-bs-parent="#productAccordion">
                      <div className="accordion-body">
                        <ul className="list-unstyled">
                          <li><i className="fas fa-truck me-2"></i> Free shipping on orders over $100</li>
                          <li><i className="fas fa-clock me-2"></i> Standard delivery: 3-5 business days</li>
                          <li><i className="fas fa-undo me-2"></i> 30-day return policy</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  
                  <div className="accordion-item">
                    <h2 className="accordion-header">
                      <button 
                        className="accordion-button collapsed" 
                        type="button" 
                        data-bs-toggle="collapse" 
                        data-bs-target="#specifications"
                      >
                        Specifications
                      </button>
                    </h2>
                    <div id="specifications" className="accordion-collapse collapse" data-bs-parent="#productAccordion">
                      <div className="accordion-body">
                        <p>Detailed specifications will be displayed here based on product attributes.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Related Products Section */}
      {relatedProducts.length > 0 && (
        <div className="container py-5">
          <div className="row">
            <div className="col-12">
              <h3 className="section-title mb-4">Related Products</h3>
            </div>
          </div>
          <div className="row g-4">
            {relatedProducts.map((relatedProduct) => {
              // Transform related product data
              let relatedImageUrl = 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=300&h=300&fit=crop';
              
              try {
                if (relatedProduct.gallery) {
                  if (typeof relatedProduct.gallery === 'string') {
                    const galleryArray = JSON.parse(relatedProduct.gallery);
                    if (Array.isArray(galleryArray) && galleryArray.length > 0 && galleryArray[0]) {
                      relatedImageUrl = galleryArray[0];
                    }
                  } else if (Array.isArray(relatedProduct.gallery) && relatedProduct.gallery.length > 0 && relatedProduct.gallery[0]) {
                    relatedImageUrl = relatedProduct.gallery[0];
                  }
                }
              } catch (error) {
                console.warn('Error parsing related product gallery:', error);
              }

              return (
                <div key={relatedProduct.id} className="col-lg-3 col-md-6 col-sm-6 col-12">
                  <div className="related-product-card">
                    <div className="related-product-image-wrapper">
                      <a href={`/shop/${relatedProduct.slug}`}>
                        <div className="related-product-image">
                          <Image
                            src={relatedImageUrl}
                            alt={relatedProduct.name}
                            width={300}
                            height={300}
                            className="img-fluid"
                          />
                        </div>
                      </a>
                      
                      {/* Product Badges */}
                      <div className="related-product-badges">
                        {relatedProduct.is_featured && (
                          <span className="badge badge-featured">Featured</span>
                        )}
                        {relatedProduct.sale_price && (
                          <span className="badge badge-sale">Sale</span>
                        )}
                      </div>
                    </div>

                    <div className="related-product-info">
                      <h4 className="related-product-title">
                        <a href={`/shop/${relatedProduct.slug}`}>{relatedProduct.name}</a>
                      </h4>
                      
                      <div className="related-product-price">
                        <span className="current-price">${relatedProduct.price.toLocaleString()}</span>
                        {relatedProduct.sale_price && (
                          <span className="compare-price">
                            <del>${relatedProduct.sale_price.toLocaleString()}</del>
                          </span>
                        )}
                      </div>

                      {/* Rating */}
                      <div className="related-product-rating">
                        <div className="stars">
                          {[...Array(5)].map((_, i) => (
                            <i
                              key={i}
                              className={`fas fa-star ${i < 4 ? 'text-warning' : 'text-muted'}`}
                            />
                          ))}
                        </div>
                        <span className="reviews-count">(4.5)</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <style jsx>{`
        .product-title {
          font-family: var(--font-family-heading);
          font-weight: 600;
          color: var(--secondary-color);
        }

        .current-price {
          font-weight: 700;
          color: var(--primary-color);
        }

        .compare-price {
          font-size: 1.1rem;
        }

        .thumbnail-btn {
          transition: all 0.3s ease;
        }

        .thumbnail-btn:hover {
          border-color: var(--primary-color) !important;
        }

        .thumbnail-btn.active {
          border-color: var(--primary-color) !important;
        }

        .product-actions .btn {
          font-weight: 600;
        }

        .accordion-button:not(.collapsed) {
          background-color: var(--primary-color);
          color: white;
        }

        .accordion-button:focus {
          box-shadow: 0 0 0 0.25rem rgba(67, 172, 233, 0.25);
        }

        /* Related Products Styles */
        .section-title {
          font-family: var(--font-family-heading);
          font-size: 28px;
          font-weight: 700;
          color: var(--secondary-color);
          margin-bottom: 30px;
        }

        .related-product-card {
          background: white;
          border-radius: var(--border-radius-lg);
          overflow: hidden;
          transition: all 0.3s ease;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
          height: 100%;
        }

        .related-product-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
        }

        .related-product-image-wrapper {
          position: relative;
          overflow: hidden;
        }

        .related-product-image {
          position: relative;
          padding-top: 100%;
          overflow: hidden;
        }

        .related-product-image img {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.3s ease;
        }

        .related-product-card:hover .related-product-image img {
          transform: scale(1.05);
        }

        .related-product-badges {
          position: absolute;
          top: 15px;
          left: 15px;
          z-index: 3;
        }

        .badge {
          display: inline-block;
          padding: 4px 8px;
          font-size: 11px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          border-radius: var(--border-radius-sm);
          margin-right: 5px;
          margin-bottom: 5px;
        }

        .badge-featured {
          background: var(--primary-color);
          color: white;
        }

        .badge-sale {
          background: var(--danger-color);
          color: white;
        }

        .related-product-info {
          padding: 20px;
        }

        .related-product-title {
          margin-bottom: 10px;
        }

        .related-product-title a {
          font-family: var(--font-family-heading);
          font-size: 16px;
          font-weight: 600;
          color: var(--secondary-color);
          text-decoration: none;
          transition: color 0.3s ease;
        }

        .related-product-title a:hover {
          color: var(--primary-color);
        }

        .related-product-price {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 10px;
        }

        .related-product-price .current-price {
          font-family: var(--font-family-heading);
          font-size: 16px;
          font-weight: 700;
          color: var(--secondary-color);
        }

        .related-product-price .compare-price {
          font-family: var(--font-family-heading);
          font-size: 14px;
          font-weight: 500;
          color: var(--gray-600);
          text-decoration: line-through;
        }

        .related-product-rating {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .related-product-rating .stars {
          display: flex;
          gap: 2px;
        }

        .related-product-rating .stars i {
          font-size: 12px;
        }

        .related-product-rating .reviews-count {
          font-size: 12px;
          color: var(--gray-600);
        }
      `}</style>
    </Layout>
  );
}