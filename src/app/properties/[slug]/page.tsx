'use client';

import React, { useEffect, useState, use } from 'react';
import Layout from '@/components/Layout';
import Image from 'next/image';
import { apiService } from '@/services/api';
import { useCart } from '@/contexts/CartContext';

interface PropertyDetailPageProps {
  params: {
    slug: string;
  };
}

export default function PropertyDetailPage({ params }: PropertyDetailPageProps) {
  const resolvedParams = use(params);
  const [property, setProperty] = useState<any>(null);
  const [relatedProperties, setRelatedProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<string>('');
  const [quantity, setQuantity] = useState(1);
  const { addToCart, openDrawer } = useCart();

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        setLoading(true);
        
        // Get all properties first, then find by slug
        const propertiesResponse = await apiService.getProperties();
        
        if (propertiesResponse.success) {
          const foundProperty = propertiesResponse.data.find(p => p.slug === resolvedParams.slug);
          
          if (foundProperty) {
            setProperty(foundProperty);
            
            // Set initial image
            let initialImage = 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=600&h=600&fit=crop';
            
            if (foundProperty.featured_image && foundProperty.featured_image.trim() !== '') {
              initialImage = foundProperty.featured_image;
            }
            
            setSelectedImage(initialImage);
            
            // Fetch related properties (same category or random)
            const relatedPropertiesData = propertiesResponse.data.filter(p => 
              p.id !== foundProperty.id &&
              p.status === 'publish'
            ).slice(0, 4); // Show 4 related properties
            
            setRelatedProperties(relatedPropertiesData);
          } else {
            // Create a mock property for demonstration
            const mockProperty = {
              id: 999,
              slug: resolvedParams.slug,
              name: resolvedParams.slug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
              featured_image: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=600&h=600&fit=crop',
              price: 450000,
              sale_price: 425000,
              description: 'This is a beautiful property with modern amenities and excellent location.',
              long_description: 'Experience luxury living in this stunning property. Featuring modern design, premium finishes, and excellent connectivity. Perfect for families looking for comfort and convenience.',
              property_type: 'House',
              bedrooms: 4,
              bathrooms: 3,
              area: '2,500 sq ft',
              year_built: '2020',
              location: 'Downtown',
              status: 'publish',
              stock_quantity: 1
            };
            
            setProperty(mockProperty);
            setSelectedImage(mockProperty.featured_image);
          }
        }
      } catch (err) {
        console.error('Error fetching property:', err);
        
        // Create a fallback property for demonstration
        const fallbackProperty = {
          id: 999,
          slug: resolvedParams.slug,
          name: resolvedParams.slug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
          featured_image: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=600&h=600&fit=crop',
          price: 450000,
          sale_price: 425000,
          description: 'This is a beautiful property with modern amenities and excellent location.',
          long_description: 'Experience luxury living in this stunning property. Featuring modern design, premium finishes, and excellent connectivity.',
          property_type: 'House',
          bedrooms: 4,
          bathrooms: 3,
          area: '2,500 sq ft',
          year_built: '2020',
          location: 'Downtown',
          status: 'publish',
          stock_quantity: 1
        };
        
        setProperty(fallbackProperty);
        setSelectedImage(fallbackProperty.featured_image);
      } finally {
        setLoading(false);
      }
    };

    fetchProperty();
  }, [resolvedParams.slug]);

  const handleAddToCart = () => {
    if (!property) return;
    
    // Add property to cart
    addToCart({
      productId: property.id.toString(),
      name: property.name,
      price: parseFloat((property.sale_price || property.price).toString()),
      quantity: quantity,
      image: selectedImage,
      vendor: property.business_name || 'Property Dealer',
      sku: property.sku || property.slug,
    });
    
    // Open the cart drawer
    openDrawer();
  };

  const getGalleryImages = () => {
    if (!property?.gallery) return [selectedImage];
    
    try {
      if (typeof property.gallery === 'string') {
        const parsedGallery = JSON.parse(property.gallery);
        return Array.isArray(parsedGallery) ? parsedGallery : [selectedImage];
      }
      return Array.isArray(property.gallery) ? property.gallery : [selectedImage];
    } catch (e) {
      console.error("Failed to parse gallery:", e);
      return [selectedImage];
    }
  };

  const galleryImages = getGalleryImages();

  if (loading) {
    return (
      <Layout>
        <div className="container py-5 text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3">Loading property details...</p>
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
          <a href="/properties" className="btn btn-primary mt-3">Back to Properties</a>
        </div>
      </Layout>
    );
  }

  if (!property) {
    return (
      <Layout>
        <div className="container py-5 text-center">
          <div className="alert alert-warning" role="alert">
            Property data could not be loaded.
          </div>
          <a href="/properties" className="btn btn-primary mt-3">Back to Properties</a>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="property-detail-page py-5">
        <div className="container">
          {/* Breadcrumb */}
          <nav aria-label="breadcrumb" className="mb-4">
            <ol className="breadcrumb">
              <li className="breadcrumb-item"><a href="/">Home</a></li>
              <li className="breadcrumb-item"><a href="/properties">Properties</a></li>
              <li className="breadcrumb-item active" aria-current="page">{property.name}</li>
            </ol>
          </nav>

          <div className="row">
            {/* Property Gallery */}
            <div className="col-lg-6">
              <div className="property-gallery">
                <div className="main-image mb-3">
                  <Image
                    src={selectedImage || 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=600&h=600&fit=crop'}
                    alt={property.name}
                    width={600}
                    height={600}
                    className="img-fluid rounded"
                  />
                </div>
                <div className="thumbnail-images d-flex gap-2 overflow-auto">
                  {galleryImages.map((img, index) => (
                    <div 
                      key={index} 
                      className={`thumbnail-item ${selectedImage === img ? 'active' : ''}`}
                      onClick={() => setSelectedImage(img)}
                    >
                      <Image
                        src={img || 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=100&h=100&fit=crop'}
                        alt={`${property.name} thumbnail ${index + 1}`}
                        width={100}
                        height={100}
                        className="img-fluid rounded"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Property Details */}
            <div className="col-lg-6">
              <div className="property-details">
                <h1 className="property-title">{property.name}</h1>
                <div className="property-meta mb-3">
                  <span className="type me-3">Type: <strong>{property.property_type || 'House'}</strong></span>
                  <span className="location">Location: <strong>{property.location || 'Downtown'}</strong></span>
                </div>

                <div className="property-rating mb-3">
                  <div className="stars">
                    {[...Array(5)].map((_, index) => (
                      <i
                        key={index}
                        className={`fas fa-star ${index < 4.5 ? 'active' : ''}`}
                      />
                    ))}
                  </div>
                  <span className="reviews-count ms-2">(156 Reviews)</span>
                </div>

                <div className="property-price mb-4">
                  <span className="current-price">${property.price?.toLocaleString() || '450,000'}</span>
                  {property.sale_price && (
                    <span className="compare-price ms-2">
                      <del>${property.sale_price.toLocaleString()}</del>
                    </span>
                  )}
                </div>

                <p className="property-description mb-4">
                  {property.description || 'No description available.'}
                </p>

                <div className="property-actions d-flex align-items-center mb-4">
                  <div className="quantity-selector me-3">
                    <button className="btn btn-outline-secondary" onClick={() => setQuantity(Math.max(1, quantity - 1))}>-</button>
                    <input 
                      type="number" 
                      className="form-control text-center mx-2" 
                      value={quantity} 
                      onChange={(e) => setQuantity(parseInt(e.target.value) || 1)} 
                      min="1" 
                      style={{ width: '60px' }} 
                    />
                    <button className="btn btn-outline-secondary" onClick={() => setQuantity(quantity + 1)}>+</button>
                  </div>
                  <button className="btn btn-primary btn-add-to-cart me-3" onClick={handleAddToCart}>
                    <i className="fas fa-shopping-cart me-2"></i> Add to Cart
                  </button>
                  <button className="btn btn-outline-secondary btn-wishlist me-2" title="Add to Wishlist">
                    <i className="far fa-heart"></i>
                  </button>
                  <button className="btn btn-outline-secondary btn-compare" title="Compare">
                    <i className="fas fa-balance-scale"></i>
                  </button>
                </div>

                <div className="property-stock mb-4">
                  <span className={`badge ${property.stock_quantity > 0 ? 'bg-success' : 'bg-danger'}`}>
                    {property.stock_quantity > 0 ? 'Available' : 'Not Available'}
                  </span>
                </div>

                {/* Property Specifications */}
                <div className="property-specs mb-4">
                  <h5>Property Specifications</h5>
                  <div className="row">
                    <div className="col-6">
                      <div className="spec-item">
                        <strong>Bedrooms:</strong> {property.bedrooms || 'N/A'}
                      </div>
                      <div className="spec-item">
                        <strong>Bathrooms:</strong> {property.bathrooms || 'N/A'}
                      </div>
                      <div className="spec-item">
                        <strong>Area:</strong> {property.area || 'N/A'}
                      </div>
                    </div>
                    <div className="col-6">
                      <div className="spec-item">
                        <strong>Year Built:</strong> {property.year_built || 'N/A'}
                      </div>
                      <div className="spec-item">
                        <strong>Property Type:</strong> {property.property_type || 'N/A'}
                      </div>
                      <div className="spec-item">
                        <strong>Location:</strong> {property.location || 'N/A'}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Accordion for more details */}
                <div className="accordion" id="propertyDetailsAccordion">
                  <div className="accordion-item">
                    <h2 className="accordion-header" id="headingOne">
                      <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
                        Description
                      </button>
                    </h2>
                    <div id="collapseOne" className="accordion-collapse collapse show" aria-labelledby="headingOne" data-bs-parent="#propertyDetailsAccordion">
                      <div className="accordion-body">
                        {property.long_description || property.description || 'No detailed description available.'}
                      </div>
                    </div>
                  </div>
                  <div className="accordion-item">
                    <h2 className="accordion-header" id="headingTwo">
                      <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseTwo" aria-expanded="false" aria-controls="collapseTwo">
                        Amenities
                      </button>
                    </h2>
                    <div id="collapseTwo" className="accordion-collapse collapse" aria-labelledby="headingTwo" data-bs-parent="#propertyDetailsAccordion">
                      <div className="accordion-body">
                        <div className="amenities-grid">
                          <div className="amenity-item">
                            <div className="amenity-icon">
                              <i className="fas fa-swimming-pool text-primary"></i>
                            </div>
                            <span className="amenity-name">Swimming Pool</span>
                          </div>
                          
                          <div className="amenity-item">
                            <div className="amenity-icon">
                              <i className="fas fa-seedling text-success"></i>
                            </div>
                            <span className="amenity-name">Garden</span>
                          </div>
                          
                          <div className="amenity-item">
                            <div className="amenity-icon">
                              <i className="fas fa-car text-info"></i>
                            </div>
                            <span className="amenity-name">Parking</span>
                          </div>
                          
                          <div className="amenity-item">
                            <div className="amenity-icon">
                              <i className="fas fa-shield-alt text-warning"></i>
                            </div>
                            <span className="amenity-name">Security</span>
                          </div>
                          
                          <div className="amenity-item">
                            <div className="amenity-icon">
                              <i className="fas fa-snowflake text-primary"></i>
                            </div>
                            <span className="amenity-name">Air Conditioning</span>
                          </div>
                          
                          <div className="amenity-item">
                            <div className="amenity-icon">
                              <i className="fas fa-utensils text-danger"></i>
                            </div>
                            <span className="amenity-name">Modern Kitchen</span>
                          </div>
                          
                          <div className="amenity-item">
                            <div className="amenity-icon">
                              <i className="fas fa-wifi text-info"></i>
                            </div>
                            <span className="amenity-name">WiFi</span>
                          </div>
                          
                          <div className="amenity-item">
                            <div className="amenity-icon">
                              <i className="fas fa-dumbbell text-secondary"></i>
                            </div>
                            <span className="amenity-name">Gym</span>
                          </div>
                          
                          <div className="amenity-item">
                            <div className="amenity-icon">
                              <i className="fas fa-hot-tub text-primary"></i>
                            </div>
                            <span className="amenity-name">Hot Tub</span>
                          </div>
                          
                          <div className="amenity-item">
                            <div className="amenity-icon">
                              <i className="fas fa-fireplace text-danger"></i>
                            </div>
                            <span className="amenity-name">Fireplace</span>
                          </div>
                          
                          <div className="amenity-item">
                            <div className="amenity-icon">
                              <i className="fas fa-washing-machine text-info"></i>
                            </div>
                            <span className="amenity-name">Laundry</span>
                          </div>
                          
                          <div className="amenity-item">
                            <div className="amenity-icon">
                              <i className="fas fa-paw text-warning"></i>
                            </div>
                            <span className="amenity-name">Pet Friendly</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="accordion-item">
                    <h2 className="accordion-header" id="headingThree">
                      <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseThree" aria-expanded="false" aria-controls="collapseThree">
                        Financing Options
                      </button>
                    </h2>
                    <div id="collapseThree" className="accordion-collapse collapse" aria-labelledby="headingThree" data-bs-parent="#propertyDetailsAccordion">
                      <div className="accordion-body">
                        <p>We offer flexible financing options and mortgage assistance. Contact our financial advisors for personalized solutions.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Related Properties Section */}
      {relatedProperties.length > 0 && (
        <div className="container py-5">
          <div className="row">
            <div className="col-12">
              <h3 className="section-title mb-4">Related Properties</h3>
            </div>
          </div>
          <div className="row g-4">
            {relatedProperties.map((relatedProperty) => {
              let relatedImageUrl = 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=300&h=300&fit=crop';
              
              if (relatedProperty.featured_image && relatedProperty.featured_image.trim() !== '') {
                relatedImageUrl = relatedProperty.featured_image;
              }

              return (
                <div key={relatedProperty.id} className="col-lg-3 col-md-6 col-sm-6 col-12">
                  <div className="related-property-card">
                    <div className="related-property-image-wrapper">
                      <a href={`/properties/${relatedProperty.slug}`}>
                        <div className="related-property-image">
                          <Image
                            src={relatedImageUrl}
                            alt={relatedProperty.name}
                            width={300}
                            height={300}
                            className="img-fluid"
                          />
                        </div>
                      </a>
                      
                      {/* Property Badges */}
                      <div className="related-property-badges">
                        {relatedProperty.is_featured && (
                          <span className="badge badge-featured">Featured</span>
                        )}
                        {relatedProperty.sale_price && (
                          <span className="badge badge-sale">Sale</span>
                        )}
                      </div>
                    </div>

                    <div className="related-property-info">
                      <h4 className="related-property-title">
                        <a href={`/properties/${relatedProperty.slug}`}>{relatedProperty.name}</a>
                      </h4>
                      
                      <div className="related-property-price">
                        <span className="current-price">${relatedProperty.price?.toLocaleString() || '450,000'}</span>
                        {relatedProperty.sale_price && (
                          <span className="compare-price">
                            <del>${relatedProperty.sale_price.toLocaleString()}</del>
                          </span>
                        )}
                      </div>

                      {/* Rating */}
                      <div className="related-property-rating">
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
        .property-title {
          font-family: var(--font-family-heading);
          font-weight: 600;
          color: var(--secondary-color);
        }
        .property-meta span {
          font-size: 14px;
          color: var(--gray-600);
        }
        .property-meta strong {
          color: var(--secondary-color);
        }
        .property-rating .stars i {
          color: #ffc107;
        }
        .property-price .current-price {
          font-family: var(--font-family-heading);
          font-size: 24px;
          font-weight: 700;
          color: var(--primary-color);
        }
        .property-price .compare-price {
          font-family: var(--font-family-heading);
          font-size: 18px;
          color: var(--gray-600);
          text-decoration: line-through;
        }
        .property-description {
          font-size: 16px;
          line-height: 1.6;
          color: var(--gray-700);
        }
        .quantity-selector .form-control {
          border-color: var(--gray-300);
        }
        .btn-add-to-cart {
          background-color: var(--primary-color);
          border-color: var(--primary-color);
          color: white;
          font-weight: 600;
          padding: 10px 25px;
          border-radius: var(--border-radius-lg);
          transition: all 0.3s ease;
        }
        .btn-add-to-cart:hover {
          background-color: var(--primary-hover);
          border-color: var(--primary-hover);
        }
        .btn-wishlist, .btn-compare {
          border-color: var(--gray-300);
          color: var(--secondary-color);
          transition: all 0.3s ease;
        }
        .btn-wishlist:hover, .btn-compare:hover {
          background-color: var(--primary-color);
          border-color: var(--primary-color);
          color: white;
        }
        .property-gallery .thumbnail-item {
          border: 2px solid transparent;
          cursor: pointer;
          transition: border-color 0.2s ease;
        }
        .property-gallery .thumbnail-item.active {
          border-color: var(--primary-color);
        }
        .accordion-button {
          font-family: var(--font-family-heading);
          font-weight: 600;
          color: var(--secondary-color);
          background-color: var(--light-color);
          border-bottom: 1px solid var(--gray-200);
        }
        .accordion-button:not(.collapsed) {
          background-color: var(--primary-color);
          color: white;
        }
        .accordion-button:focus {
          box-shadow: 0 0 0 0.25rem rgba(67, 172, 233, 0.25);
        }
        .property-specs .spec-item {
          margin-bottom: 8px;
          font-size: 14px;
        }

        /* Amenities Grid Styles */
        .amenities-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 15px;
          margin-top: 15px;
        }

        .amenity-item {
          display: flex;
          align-items: center;
          padding: 12px;
          background: #f8f9fa;
          border-radius: var(--border-radius-sm);
          transition: all 0.3s ease;
          border: 1px solid #e9ecef;
        }

        .amenity-item:hover {
          background: var(--light-color);
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }

        .amenity-icon {
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: white;
          border-radius: 50%;
          margin-right: 12px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          transition: all 0.3s ease;
        }

        .amenity-item:hover .amenity-icon {
          transform: scale(1.1);
        }

        .amenity-icon i {
          font-size: 18px;
        }

        .amenity-name {
          font-weight: 500;
          color: var(--secondary-color);
          font-size: 14px;
        }

        /* Related Properties Styles */
        .section-title {
          font-family: var(--font-family-heading);
          font-size: 28px;
          font-weight: 700;
          color: var(--secondary-color);
          margin-bottom: 30px;
        }

        .related-property-card {
          background: white;
          border-radius: var(--border-radius-lg);
          overflow: hidden;
          transition: all 0.3s ease;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
          height: 100%;
        }

        .related-property-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
        }

        .related-property-image-wrapper {
          position: relative;
          overflow: hidden;
        }

        .related-property-image {
          position: relative;
          padding-top: 100%;
          overflow: hidden;
        }

        .related-property-image img {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.3s ease;
        }

        .related-property-card:hover .related-property-image img {
          transform: scale(1.05);
        }

        .related-property-badges {
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

        .related-property-info {
          padding: 20px;
        }

        .related-property-title {
          margin-bottom: 10px;
        }

        .related-property-title a {
          font-family: var(--font-family-heading);
          font-size: 16px;
          font-weight: 600;
          color: var(--secondary-color);
          text-decoration: none;
          transition: color 0.3s ease;
        }

        .related-property-title a:hover {
          color: var(--primary-color);
        }

        .related-property-price {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 10px;
        }

        .related-property-price .current-price {
          font-family: var(--font-family-heading);
          font-size: 16px;
          font-weight: 700;
          color: var(--secondary-color);
        }

        .related-property-price .compare-price {
          font-family: var(--font-family-heading);
          font-size: 14px;
          font-weight: 500;
          color: var(--gray-600);
          text-decoration: line-through;
        }

        .related-property-rating {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .related-property-rating .stars {
          display: flex;
          gap: 2px;
        }

        .related-property-rating .stars i {
          font-size: 12px;
        }

        .related-property-rating .reviews-count {
          font-size: 12px;
          color: var(--gray-600);
        }
      `}</style>
    </Layout>
  );
}
