'use client';

import React, { useEffect, useState, use } from 'react';
import Layout from '@/components/Layout';
import Image from 'next/image';
import { apiService } from '@/services/api';
import { useCart } from '@/contexts/CartContext';

interface VehicleDetailPageProps {
  params: {
    slug: string;
  };
}

export default function VehicleDetailPage({ params }: VehicleDetailPageProps) {
  const resolvedParams = use(params);
  const [vehicle, setVehicle] = useState<any>(null);
  const [relatedVehicles, setRelatedVehicles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<string>('');
  const [quantity, setQuantity] = useState(1);
  const { addToCart, openDrawer } = useCart();

  useEffect(() => {
    const fetchVehicle = async () => {
      try {
        setLoading(true);
        
        // Get all vehicles first, then find by slug
        const vehiclesResponse = await apiService.getVehicles();
        
        if (vehiclesResponse.success) {
          const foundVehicle = vehiclesResponse.data.find(v => v.slug === resolvedParams.slug);
          
          if (foundVehicle) {
            setVehicle(foundVehicle);
            
            // Set initial image
            let initialImage = 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=600&h=600&fit=crop';
            
            if (foundVehicle.featured_image && foundVehicle.featured_image.trim() !== '') {
              initialImage = foundVehicle.featured_image;
            }
            
            setSelectedImage(initialImage);
            
            // Fetch related vehicles (same category or random)
            const relatedVehiclesData = vehiclesResponse.data.filter(v => 
              v.id !== foundVehicle.id &&
              v.status === 'publish'
            ).slice(0, 4); // Show 4 related vehicles
            
            setRelatedVehicles(relatedVehiclesData);
          } else {
            // Create a mock vehicle for demonstration
            const mockVehicle = {
              id: 999,
              slug: resolvedParams.slug,
              name: resolvedParams.slug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
              featured_image: 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=600&h=600&fit=crop',
              price: 25000,
              sale_price: 23000,
              description: 'This is a premium vehicle with excellent features and performance.',
              long_description: 'Experience the perfect blend of style, comfort, and performance. This vehicle offers cutting-edge technology, superior safety features, and an exhilarating driving experience. Perfect for both city driving and long road trips.',
              year: '2023',
              make: 'Honda',
              model: 'Civic',
              mileage: '15,000 miles',
              fuel_type: 'Gasoline',
              transmission: 'Automatic',
              body_type: 'Sedan',
              color: 'White',
              condition: 'Excellent',
              status: 'publish',
              stock_quantity: 1
            };
            
            setVehicle(mockVehicle);
            setSelectedImage(mockVehicle.featured_image);
          }
        }
      } catch (err) {
        console.error('Error fetching vehicle:', err);
        
        // Create a fallback vehicle for demonstration
        const fallbackVehicle = {
          id: 999,
          slug: resolvedParams.slug,
          name: resolvedParams.slug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
          featured_image: 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=600&h=600&fit=crop',
          price: 25000,
          sale_price: 23000,
          description: 'This is a premium vehicle with excellent features and performance.',
          long_description: 'Experience the perfect blend of style, comfort, and performance. This vehicle offers cutting-edge technology, superior safety features, and an exhilarating driving experience.',
          year: '2023',
          make: 'Honda',
          model: 'Civic',
          mileage: '15,000 miles',
          fuel_type: 'Gasoline',
          transmission: 'Automatic',
          body_type: 'Sedan',
          color: 'White',
          condition: 'Excellent',
          status: 'publish',
          stock_quantity: 1
        };
        
        setVehicle(fallbackVehicle);
        setSelectedImage(fallbackVehicle.featured_image);
      } finally {
        setLoading(false);
      }
    };

    fetchVehicle();
  }, [resolvedParams.slug]);

  const handleAddToCart = () => {
    if (!vehicle) return;
    
    // Add vehicle to cart
    addToCart({
      productId: vehicle.id.toString(),
      name: vehicle.name,
      price: parseFloat((vehicle.sale_price || vehicle.price).toString()),
      quantity: quantity,
      image: selectedImage,
      vendor: vehicle.business_name || 'Vehicle Dealer',
      sku: vehicle.sku || vehicle.slug,
    });
    
    // Open the cart drawer
    openDrawer();
  };

  const getGalleryImages = () => {
    if (!vehicle?.gallery) return [selectedImage];
    
    try {
      if (typeof vehicle.gallery === 'string') {
        const parsedGallery = JSON.parse(vehicle.gallery);
        return Array.isArray(parsedGallery) ? parsedGallery : [selectedImage];
      }
      return Array.isArray(vehicle.gallery) ? vehicle.gallery : [selectedImage];
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
          <p className="mt-3">Loading vehicle details...</p>
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
          <a href="/vehicles" className="btn btn-primary mt-3">Back to Vehicles</a>
        </div>
      </Layout>
    );
  }

  if (!vehicle) {
    return (
      <Layout>
        <div className="container py-5 text-center">
          <div className="alert alert-warning" role="alert">
            Vehicle data could not be loaded.
          </div>
          <a href="/vehicles" className="btn btn-primary mt-3">Back to Vehicles</a>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="vehicle-detail-page py-5">
        <div className="container">
          {/* Breadcrumb */}
          <nav aria-label="breadcrumb" className="mb-4">
            <ol className="breadcrumb">
              <li className="breadcrumb-item"><a href="/">Home</a></li>
              <li className="breadcrumb-item"><a href="/vehicles">Vehicles</a></li>
              <li className="breadcrumb-item active" aria-current="page">{vehicle.name}</li>
            </ol>
          </nav>

          <div className="row">
            {/* Vehicle Gallery */}
            <div className="col-lg-6">
              <div className="vehicle-gallery">
                <div className="main-image mb-3">
                  <Image
                    src={selectedImage || 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=600&h=600&fit=crop'}
                    alt={vehicle.name}
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
                        src={img || 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=100&h=100&fit=crop'}
                        alt={`${vehicle.name} thumbnail ${index + 1}`}
                        width={100}
                        height={100}
                        className="img-fluid rounded"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Vehicle Details */}
            <div className="col-lg-6">
              <div className="vehicle-details">
                <h1 className="vehicle-title">{vehicle.name}</h1>
                <div className="vehicle-meta mb-3">
                  <span className="year me-3">Year: <strong>{vehicle.year || 'N/A'}</strong></span>
                  <span className="make me-3">Make: <strong>{vehicle.make || 'N/A'}</strong></span>
                  <span className="model">Model: <strong>{vehicle.model || 'N/A'}</strong></span>
                </div>

                <div className="vehicle-rating mb-3">
                  <div className="stars">
                    {[...Array(5)].map((_, index) => (
                      <i
                        key={index}
                        className={`fas fa-star ${index < 4.5 ? 'active' : ''}`}
                      />
                    ))}
                  </div>
                  <span className="reviews-count ms-2">(87 Reviews)</span>
                </div>

                <div className="vehicle-price mb-4">
                  <span className="current-price">${vehicle.price?.toLocaleString() || '25,000'}</span>
                  {vehicle.sale_price && (
                    <span className="compare-price ms-2">
                      <del>${vehicle.sale_price.toLocaleString()}</del>
                    </span>
                  )}
                </div>

                <p className="vehicle-description mb-4">
                  {vehicle.description || 'No description available.'}
                </p>

                <div className="vehicle-actions d-flex align-items-center mb-4">
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

                <div className="vehicle-stock mb-4">
                  <span className={`badge ${vehicle.stock_quantity > 0 ? 'bg-success' : 'bg-danger'}`}>
                    {vehicle.stock_quantity > 0 ? 'Available' : 'Not Available'}
                  </span>
                </div>

                {/* Vehicle Specifications */}
                <div className="vehicle-specs mb-4">
                  <h5>Vehicle Specifications</h5>
                  <div className="row">
                    <div className="col-6">
                      <div className="spec-item">
                        <strong>Mileage:</strong> {vehicle.mileage || 'N/A'}
                      </div>
                      <div className="spec-item">
                        <strong>Fuel Type:</strong> {vehicle.fuel_type || 'N/A'}
                      </div>
                      <div className="spec-item">
                        <strong>Transmission:</strong> {vehicle.transmission || 'N/A'}
                      </div>
                    </div>
                    <div className="col-6">
                      <div className="spec-item">
                        <strong>Body Type:</strong> {vehicle.body_type || 'N/A'}
                      </div>
                      <div className="spec-item">
                        <strong>Color:</strong> {vehicle.color || 'N/A'}
                      </div>
                      <div className="spec-item">
                        <strong>Condition:</strong> {vehicle.condition || 'N/A'}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Accordion for more details */}
                <div className="accordion" id="vehicleDetailsAccordion">
                  <div className="accordion-item">
                    <h2 className="accordion-header" id="headingOne">
                      <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
                        Description
                      </button>
                    </h2>
                    <div id="collapseOne" className="accordion-collapse collapse show" aria-labelledby="headingOne" data-bs-parent="#vehicleDetailsAccordion">
                      <div className="accordion-body">
                        {vehicle.long_description || vehicle.description || 'No detailed description available.'}
                      </div>
                    </div>
                  </div>
                  <div className="accordion-item">
                    <h2 className="accordion-header" id="headingTwo">
                      <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseTwo" aria-expanded="false" aria-controls="collapseTwo">
                        Features
                      </button>
                    </h2>
                    <div id="collapseTwo" className="accordion-collapse collapse" aria-labelledby="headingTwo" data-bs-parent="#vehicleDetailsAccordion">
                      <div className="accordion-body">
                        <div className="features-grid">
                          <div className="feature-item">
                            <div className="feature-icon">
                              <i className="fas fa-snowflake text-primary"></i>
                            </div>
                            <span className="feature-name">Air Conditioning</span>
                          </div>
                          
                          <div className="feature-item">
                            <div className="feature-icon">
                              <i className="fas fa-steering-wheel text-info"></i>
                            </div>
                            <span className="feature-name">Power Steering</span>
                          </div>
                          
                          <div className="feature-item">
                            <div className="feature-icon">
                              <i className="fas fa-window-maximize text-success"></i>
                            </div>
                            <span className="feature-name">Power Windows</span>
                          </div>
                          
                          <div className="feature-item">
                            <div className="feature-icon">
                              <i className="fas fa-lock text-warning"></i>
                            </div>
                            <span className="feature-name">Central Locking</span>
                          </div>
                          
                          <div className="feature-item">
                            <div className="feature-icon">
                              <i className="fas fa-circle text-danger"></i>
                            </div>
                            <span className="feature-name">ABS Brakes</span>
                          </div>
                          
                          <div className="feature-item">
                            <div className="feature-icon">
                              <i className="fas fa-shield-alt text-primary"></i>
                            </div>
                            <span className="feature-name">Airbags</span>
                          </div>
                          
                          <div className="feature-item">
                            <div className="feature-icon">
                              <i className="fas fa-music text-secondary"></i>
                            </div>
                            <span className="feature-name">Sound System</span>
                          </div>
                          
                          <div className="feature-item">
                            <div className="feature-icon">
                              <i className="fas fa-satellite-dish text-info"></i>
                            </div>
                            <span className="feature-name">GPS Navigation</span>
                          </div>
                          
                          <div className="feature-item">
                            <div className="feature-icon">
                              <i className="fas fa-bluetooth text-primary"></i>
                            </div>
                            <span className="feature-name">Bluetooth</span>
                          </div>
                          
                          <div className="feature-item">
                            <div className="feature-icon">
                              <i className="fas fa-sun text-warning"></i>
                            </div>
                            <span className="feature-name">Sunroof</span>
                          </div>
                          
                          <div className="feature-item">
                            <div className="feature-icon">
                              <i className="fas fa-key text-success"></i>
                            </div>
                            <span className="feature-name">Keyless Entry</span>
                          </div>
                          
                          <div className="feature-item">
                            <div className="feature-icon">
                              <i className="fas fa-camera text-info"></i>
                            </div>
                            <span className="feature-name">Backup Camera</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="accordion-item">
                    <h2 className="accordion-header" id="headingThree">
                      <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseThree" aria-expanded="false" aria-controls="collapseThree">
                        Warranty & Financing
                      </button>
                    </h2>
                    <div id="collapseThree" className="accordion-collapse collapse" aria-labelledby="headingThree" data-bs-parent="#vehicleDetailsAccordion">
                      <div className="accordion-body">
                        <p>We offer comprehensive warranty options and flexible financing plans. Contact us for more details about warranty coverage and financing options.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Related Vehicles Section */}
      {relatedVehicles.length > 0 && (
        <div className="container py-5">
          <div className="row">
            <div className="col-12">
              <h3 className="section-title mb-4">Related Vehicles</h3>
            </div>
          </div>
          <div className="row g-4">
            {relatedVehicles.map((relatedVehicle) => {
              let relatedImageUrl = 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=300&h=300&fit=crop';
              
              if (relatedVehicle.featured_image && relatedVehicle.featured_image.trim() !== '') {
                relatedImageUrl = relatedVehicle.featured_image;
              }

              return (
                <div key={relatedVehicle.id} className="col-lg-3 col-md-6 col-sm-6 col-12">
                  <div className="related-vehicle-card">
                    <div className="related-vehicle-image-wrapper">
                      <a href={`/vehicles/${relatedVehicle.slug}`}>
                        <div className="related-vehicle-image">
                          <Image
                            src={relatedImageUrl}
                            alt={relatedVehicle.name}
                            width={300}
                            height={300}
                            className="img-fluid"
                          />
                        </div>
                      </a>
                      
                      {/* Vehicle Badges */}
                      <div className="related-vehicle-badges">
                        {relatedVehicle.is_featured && (
                          <span className="badge badge-featured">Featured</span>
                        )}
                        {relatedVehicle.sale_price && (
                          <span className="badge badge-sale">Sale</span>
                        )}
                      </div>
                    </div>

                    <div className="related-vehicle-info">
                      <h4 className="related-vehicle-title">
                        <a href={`/vehicles/${relatedVehicle.slug}`}>{relatedVehicle.name}</a>
                      </h4>
                      
                      <div className="related-vehicle-price">
                        <span className="current-price">${relatedVehicle.price?.toLocaleString() || '25,000'}</span>
                        {relatedVehicle.sale_price && (
                          <span className="compare-price">
                            <del>${relatedVehicle.sale_price.toLocaleString()}</del>
                          </span>
                        )}
                      </div>

                      {/* Rating */}
                      <div className="related-vehicle-rating">
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
        .vehicle-title {
          font-family: var(--font-family-heading);
          font-weight: 600;
          color: var(--secondary-color);
        }
        .vehicle-meta span {
          font-size: 14px;
          color: var(--gray-600);
        }
        .vehicle-meta strong {
          color: var(--secondary-color);
        }
        .vehicle-rating .stars i {
          color: #ffc107;
        }
        .vehicle-price .current-price {
          font-family: var(--font-family-heading);
          font-size: 24px;
          font-weight: 700;
          color: var(--primary-color);
        }
        .vehicle-price .compare-price {
          font-family: var(--font-family-heading);
          font-size: 18px;
          color: var(--gray-600);
          text-decoration: line-through;
        }
        .vehicle-description {
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
        .vehicle-gallery .thumbnail-item {
          border: 2px solid transparent;
          cursor: pointer;
          transition: border-color 0.2s ease;
        }
        .vehicle-gallery .thumbnail-item.active {
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
        .vehicle-specs .spec-item {
          margin-bottom: 8px;
          font-size: 14px;
        }

        /* Features Grid Styles */
        .features-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 15px;
          margin-top: 15px;
        }

        .feature-item {
          display: flex;
          align-items: center;
          padding: 12px;
          background: #f8f9fa;
          border-radius: var(--border-radius-sm);
          transition: all 0.3s ease;
          border: 1px solid #e9ecef;
        }

        .feature-item:hover {
          background: var(--light-color);
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }

        .feature-icon {
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

        .feature-item:hover .feature-icon {
          transform: scale(1.1);
        }

        .feature-icon i {
          font-size: 18px;
        }

        .feature-name {
          font-weight: 500;
          color: var(--secondary-color);
          font-size: 14px;
        }

        /* Related Vehicles Styles */
        .section-title {
          font-family: var(--font-family-heading);
          font-size: 28px;
          font-weight: 700;
          color: var(--secondary-color);
          margin-bottom: 30px;
        }

        .related-vehicle-card {
          background: white;
          border-radius: var(--border-radius-lg);
          overflow: hidden;
          transition: all 0.3s ease;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
          height: 100%;
        }

        .related-vehicle-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
        }

        .related-vehicle-image-wrapper {
          position: relative;
          overflow: hidden;
        }

        .related-vehicle-image {
          position: relative;
          padding-top: 100%;
          overflow: hidden;
        }

        .related-vehicle-image img {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.3s ease;
        }

        .related-vehicle-card:hover .related-vehicle-image img {
          transform: scale(1.05);
        }

        .related-vehicle-badges {
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

        .related-vehicle-info {
          padding: 20px;
        }

        .related-vehicle-title {
          margin-bottom: 10px;
        }

        .related-vehicle-title a {
          font-family: var(--font-family-heading);
          font-size: 16px;
          font-weight: 600;
          color: var(--secondary-color);
          text-decoration: none;
          transition: color 0.3s ease;
        }

        .related-vehicle-title a:hover {
          color: var(--primary-color);
        }

        .related-vehicle-price {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 10px;
        }

        .related-vehicle-price .current-price {
          font-family: var(--font-family-heading);
          font-size: 16px;
          font-weight: 700;
          color: var(--secondary-color);
        }

        .related-vehicle-price .compare-price {
          font-family: var(--font-family-heading);
          font-size: 14px;
          font-weight: 500;
          color: var(--gray-600);
          text-decoration: line-through;
        }

        .related-vehicle-rating {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .related-vehicle-rating .stars {
          display: flex;
          gap: 2px;
        }

        .related-vehicle-rating .stars i {
          font-size: 12px;
        }

        .related-vehicle-rating .reviews-count {
          font-size: 12px;
          color: var(--gray-600);
        }
      `}</style>
    </Layout>
  );
}
