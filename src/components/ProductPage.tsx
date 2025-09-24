'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useCart } from '@/contexts/CartContext';

interface ProductPageProps {
  product: {
    id: string;
    name: string;
    price: number;
    salePrice?: number;
    images: string[];
    description: string;
    specifications: any;
    variations?: any[];
    inStock: boolean;
    stockQuantity?: number;
    rating: number;
    reviewCount: number;
    vendor: string;
    category: string;
    tags: string[];
    sku: string;
  };
}

const ProductPage: React.FC<ProductPageProps> = ({ product }) => {
  const { addToCart } = useCart();
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedVariation, setSelectedVariation] = useState<any>(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [showAddToCartSuccess, setShowAddToCartSuccess] = useState(false);

  const handleAddToCart = () => {
    const variations = {};
    if (selectedSize) variations.size = selectedSize;
    if (selectedColor) variations.color = selectedColor;

    addToCart({
      productId: product.id,
      name: product.name,
      price: product.price,
      salePrice: product.salePrice,
      quantity,
      image: product.images[0],
      variations: Object.keys(variations).length > 0 ? variations : undefined,
      vendor: product.vendor,
      sku: product.sku,
    });

    setShowAddToCartSuccess(true);
    setTimeout(() => setShowAddToCartSuccess(false), 3000);
  };

  const handleBuyNow = () => {
    // Add to cart first, then redirect to checkout
    handleAddToCart();
    window.location.href = '/checkout';
  };

  const handleWishlist = () => {
    // Add to wishlist logic
    console.log('Adding to wishlist:', product.id);
  };

  return (
    <div className="product-page">
      <div className="container py-4">
        {/* Breadcrumb */}
        <nav aria-label="breadcrumb" className="mb-4">
          <ol className="breadcrumb">
            <li className="breadcrumb-item">
              <Link href="/">Home</Link>
            </li>
            <li className="breadcrumb-item">
              <Link href="/shop">Shop</Link>
            </li>
            <li className="breadcrumb-item">
              <Link href={`/categories/${product.category.toLowerCase()}`}>
                {product.category}
              </Link>
            </li>
            <li className="breadcrumb-item active" aria-current="page">
              {product.name}
            </li>
          </ol>
        </nav>

        <div className="row">
          {/* Product Images */}
          <div className="col-lg-6">
            <div className="product-images">
              {/* Main Image */}
              <div className="main-image mb-3">
                <img
                  src={product.images[selectedImage]}
                  alt={product.name}
                  className="img-fluid w-100"
                  style={{ borderRadius: '8px', aspectRatio: '1/1', objectFit: 'cover' }}
                />
              </div>

              {/* Thumbnail Images */}
              <div className="thumbnail-images d-flex gap-2">
                {product.images.map((image, index) => (
                  <img
                    key={index}
                    src={image}
                    alt={`${product.name} ${index + 1}`}
                    className={`img-thumbnail ${selectedImage === index ? 'active' : ''}`}
                    style={{ 
                      width: '80px', 
                      height: '80px', 
                      objectFit: 'cover',
                      cursor: 'pointer',
                      border: selectedImage === index ? '2px solid #43ACE9' : '1px solid #dee2e6'
                    }}
                    onClick={() => setSelectedImage(index)}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Product Details */}
          <div className="col-lg-6">
            <div className="product-details">
              {/* Product Title */}
              <h1 className="product-title mb-3" style={{ 
                fontFamily: 'Poppins, sans-serif', 
                fontSize: '28px', 
                fontWeight: '600',
                color: '#000'
              }}>
                {product.name}
              </h1>

              {/* Rating */}
              <div className="rating mb-3">
                <div className="stars d-flex align-items-center">
                  {[...Array(5)].map((_, i) => (
                    <i
                      key={i}
                      className={`fas fa-star ${i < product.rating ? 'text-warning' : 'text-muted'}`}
                    ></i>
                  ))}
                  <span className="ms-2 text-muted">({product.reviewCount} reviews)</span>
                </div>
              </div>

              {/* Price */}
              <div className="price mb-4">
                {product.salePrice ? (
                  <div className="d-flex align-items-center gap-3">
                    <span className="sale-price" style={{ 
                      fontSize: '32px', 
                      fontWeight: '700', 
                      color: '#43ACE9',
                      fontFamily: 'Poppins, sans-serif'
                    }}>
                      ${product.salePrice}
                    </span>
                    <span className="original-price text-muted text-decoration-line-through" style={{ fontSize: '24px' }}>
                      ${product.price}
                    </span>
                    <span className="badge bg-danger" style={{ fontSize: '12px' }}>
                      Save ${product.price - product.salePrice}
                    </span>
                  </div>
                ) : (
                  <span className="price" style={{ 
                    fontSize: '32px', 
                    fontWeight: '700', 
                    color: '#43ACE9',
                    fontFamily: 'Poppins, sans-serif'
                  }}>
                    ${product.price}
                  </span>
                )}
              </div>

              {/* Description */}
              <div className="description mb-4">
                <p style={{ color: '#606060', lineHeight: '1.6' }}>
                  {product.description}
                </p>
              </div>

              {/* Stock Status */}
              <div className="stock-status mb-4">
                {product.inStock ? (
                  <span className="badge bg-success">
                    <i className="fas fa-check me-1"></i>
                    In Stock {product.stockQuantity && `(${product.stockQuantity} available)`}
                  </span>
                ) : (
                  <span className="badge bg-danger">
                    <i className="fas fa-times me-1"></i>
                    Out of Stock
                  </span>
                )}
              </div>

              {/* Variations */}
              {product.variations && (
                <div className="variations mb-4">
                  {/* Size Selection */}
                  <div className="size-selection mb-3">
                    <label className="form-label fw-bold">Size:</label>
                    <div className="d-flex gap-2">
                      {product.variations.map((variation, index) => (
                        <button
                          key={index}
                          className={`btn btn-outline-secondary ${selectedSize === variation.size ? 'active' : ''}`}
                          onClick={() => setSelectedSize(variation.size)}
                          style={{ minWidth: '50px' }}
                        >
                          {variation.size}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Color Selection */}
                  <div className="color-selection mb-3">
                    <label className="form-label fw-bold">Color:</label>
                    <div className="d-flex gap-2">
                      {product.variations.map((variation, index) => (
                        <button
                          key={index}
                          className={`color-swatch ${selectedColor === variation.color ? 'active' : ''}`}
                          style={{
                            width: '40px',
                            height: '40px',
                            backgroundColor: variation.colorCode || '#ccc',
                            border: '2px solid #dee2e6',
                            borderRadius: '50%',
                            cursor: 'pointer'
                          }}
                          onClick={() => setSelectedColor(variation.color)}
                          title={variation.color}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Quantity */}
              <div className="quantity mb-4">
                <label className="form-label fw-bold">Quantity:</label>
                <div className="quantity-controls d-flex align-items-center">
                  <button
                    className="btn btn-outline-secondary"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                  >
                    <i className="fas fa-minus"></i>
                  </button>
                  <input
                    type="number"
                    className="form-control text-center mx-2"
                    style={{ width: '80px' }}
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                    min="1"
                  />
                  <button
                    className="btn btn-outline-secondary"
                    onClick={() => setQuantity(quantity + 1)}
                  >
                    <i className="fas fa-plus"></i>
                  </button>
                </div>
              </div>

              {/* Success Notification */}
              {showAddToCartSuccess && (
                <div className="alert alert-success alert-dismissible fade show mb-4" role="alert">
                  <i className="fas fa-check-circle me-2"></i>
                  Product added to cart successfully!
                  <button type="button" className="btn-close" onClick={() => setShowAddToCartSuccess(false)}></button>
                </div>
              )}

              {/* Action Buttons */}
              <div className="action-buttons mb-4">
                <div className="d-flex gap-3">
                  <button
                    className="btn btn-primary flex-fill"
                    onClick={handleAddToCart}
                    disabled={!product.inStock}
                    style={{
                      padding: '15px 30px',
                      fontSize: '16px',
                      fontWeight: '600',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px'
                    }}
                  >
                    <i className="fas fa-shopping-cart me-2"></i>
                    Add to Cart
                  </button>
                  <button
                    className="btn btn-outline-primary"
                    onClick={handleBuyNow}
                    disabled={!product.inStock}
                    style={{
                      padding: '15px 20px',
                      fontSize: '16px',
                      fontWeight: '600',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px'
                    }}
                  >
                    Buy Now
                  </button>
                  <button
                    className="btn btn-outline-secondary"
                    onClick={handleWishlist}
                    style={{ padding: '15px 20px' }}
                  >
                    <i className="fas fa-heart"></i>
                  </button>
                </div>
              </div>

              {/* Product Meta */}
              <div className="product-meta">
                <div className="row">
                  <div className="col-6">
                    <strong>SKU:</strong> {product.sku}
                  </div>
                  <div className="col-6">
                    <strong>Vendor:</strong> {product.vendor}
                  </div>
                  <div className="col-6">
                    <strong>Category:</strong> {product.category}
                  </div>
                  <div className="col-6">
                    <strong>Tags:</strong> {product.tags.join(', ')}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Product Tabs */}
        <div className="product-tabs mt-5">
          <ul className="nav nav-tabs" id="productTabs" role="tablist">
            <li className="nav-item" role="presentation">
              <button
                className="nav-link active"
                id="description-tab"
                data-bs-toggle="tab"
                data-bs-target="#description"
                type="button"
                role="tab"
                aria-controls="description"
                aria-selected="true"
                style={{ fontFamily: 'Poppins, sans-serif', fontWeight: '500', textTransform: 'uppercase' }}
              >
                Description
              </button>
            </li>
            <li className="nav-item" role="presentation">
              <button
                className="nav-link"
                id="specifications-tab"
                data-bs-toggle="tab"
                data-bs-target="#specifications"
                type="button"
                role="tab"
                aria-controls="specifications"
                aria-selected="false"
                style={{ fontFamily: 'Poppins, sans-serif', fontWeight: '500', textTransform: 'uppercase' }}
              >
                Specifications
              </button>
            </li>
            <li className="nav-item" role="presentation">
              <button
                className="nav-link"
                id="reviews-tab"
                data-bs-toggle="tab"
                data-bs-target="#reviews"
                type="button"
                role="tab"
                aria-controls="reviews"
                aria-selected="false"
                style={{ fontFamily: 'Poppins, sans-serif', fontWeight: '500', textTransform: 'uppercase' }}
              >
                Reviews ({product.reviewCount})
              </button>
            </li>
          </ul>

          <div className="tab-content" id="productTabsContent">
            <div className="tab-pane fade show active" id="description" role="tabpanel" aria-labelledby="description-tab">
              <div className="p-4">
                <p>{product.description}</p>
              </div>
            </div>

            <div className="tab-pane fade" id="specifications" role="tabpanel" aria-labelledby="specifications-tab">
              <div className="p-4">
                <table className="table">
                  <tbody>
                    {Object.entries(product.specifications).map(([key, value]) => (
                      <tr key={key}>
                        <td><strong>{key}:</strong></td>
                        <td>{value as string}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="tab-pane fade" id="reviews" role="tabpanel" aria-labelledby="reviews-tab">
              <div className="p-4">
                <p>Reviews will be displayed here...</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductPage;
