'use client';

import React, { useState } from 'react';
import Layout from '@/components/Layout';
import ProductPage from '@/components/ProductPage';
import AuctionPage from '@/components/AuctionPage';
import PropertyPage from '@/components/PropertyPage';
import VehiclePage from '@/components/VehiclePage';

const DemoPage = () => {
  const [activeTab, setActiveTab] = useState('product');

  // Sample Product Data
  const sampleProduct = {
    id: '1',
    name: 'Smart Watch Wood Edition - Premium Quality',
    price: 299.99,
    salePrice: 199.99,
    images: [
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500',
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500',
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500',
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500'
    ],
    description: 'Experience the perfect blend of technology and natural beauty with our Smart Watch Wood Edition. Crafted from premium wood materials and featuring the latest smart technology, this watch is perfect for the modern lifestyle.',
    specifications: {
      'Display': '1.4" AMOLED Touchscreen',
      'Battery Life': '7 days',
      'Water Resistance': '5ATM',
      'Connectivity': 'Bluetooth 5.0, WiFi',
      'Sensors': 'Heart Rate, GPS, Accelerometer',
      'Compatibility': 'iOS 12+, Android 8+',
      'Materials': 'Wood, Stainless Steel, Gorilla Glass'
    },
    variations: [
      { size: 'S', color: 'Natural Wood', colorCode: '#8B4513' },
      { size: 'M', color: 'Dark Wood', colorCode: '#654321' },
      { size: 'L', color: 'Light Wood', colorCode: '#DEB887' }
    ],
    inStock: true,
    stockQuantity: 15,
    rating: 4.5,
    reviewCount: 128,
    vendor: 'WoodMart Premium',
    category: 'Smart Watches',
    tags: ['Smart Watch', 'Wood', 'Premium', 'Technology'],
    sku: 'WM-SW-WOOD-001'
  };

  // Sample Auction Data
  const sampleAuction = {
    id: '1',
    title: 'Rare Vintage Rolex Submariner 1965 - Excellent Condition',
    description: 'This exceptional 1965 Rolex Submariner is in pristine condition with original box and papers. A true collector\'s piece that has been meticulously maintained.',
    images: [
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500',
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500',
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500'
    ],
    currentBid: 25000,
    startingBid: 15000,
    bidIncrement: 500,
    endTime: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days from now
    startTime: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
    status: 'active' as const,
    category: 'Luxury Watches',
    vendor: 'Luxury Auction House',
    condition: 'Excellent',
    location: 'Dubai, UAE',
    bidCount: 23,
    watchers: 156,
    previousBids: [
      { id: '1', bidder: 'Collector_123', amount: 25000, timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString() },
      { id: '2', bidder: 'WatchLover', amount: 24500, timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString() },
      { id: '3', bidder: 'VintageFan', amount: 24000, timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString() }
    ]
  };

  // Sample Property Data
  const sampleProperty = {
    id: '1',
    title: 'Luxury 3BR Apartment with Marina View - JBR',
    price: 2500000,
    pricePerSqft: 1500,
    images: [
      'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800',
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800',
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800',
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800'
    ],
    description: 'Stunning 3-bedroom apartment in the heart of JBR with breathtaking marina views. This modern apartment features high-end finishes, premium appliances, and access to world-class amenities.',
    location: 'Jumeirah Beach Residence',
    emirate: 'Dubai',
    community: 'JBR',
    bedrooms: 3,
    bathrooms: 3,
    area: 1650,
    propertyType: 'Apartment',
    purpose: 'Sale',
    furnished: 'Semi-Furnished',
    yearBuilt: 2020,
    parking: 2,
    amenities: [
      'Swimming Pool',
      'Gym',
      'Concierge',
      'Parking',
      'Balcony',
      'Marina View',
      'Security',
      'Playground'
    ],
    features: [
      'Marble Floors',
      'Built-in Wardrobes',
      'Central AC',
      'Modern Kitchen',
      'En-suite Bathrooms',
      'Balcony Access'
    ],
    agent: {
      name: 'Sarah Ahmed',
      phone: '+971 50 123 4567',
      email: 'sarah.ahmed@realestate.com',
      agency: 'Premium Properties Dubai',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100'
    },
    specifications: {
      'Floor': '15th',
      'Building': 'Marina Heights',
      'Maintenance': 'AED 15,000/year',
      'Service Charges': 'Included',
      'View': 'Marina View'
    },
    nearbyAmenities: [
      { name: 'Dubai Marina Mall', distance: '500m', type: 'Shopping' },
      { name: 'JBR Beach', distance: '200m', type: 'Beach' },
      { name: 'Marina Walk', distance: '300m', type: 'Entertainment' },
      { name: 'Dubai Metro', distance: '800m', type: 'Transport' }
    ]
  };

  // Sample Vehicle Data
  const sampleVehicle = {
    id: '1',
    title: '2025 BMW X6 40i M Sport 3.0L - White',
    make: 'BMW',
    model: 'X6',
    year: 2025,
    price: 350000,
    images: [
      'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800',
      'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800',
      'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800',
      'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800'
    ],
    description: 'Experience the perfect blend of luxury and performance with the 2025 BMW X6 40i M Sport. This stunning SUV combines powerful performance with sophisticated design and cutting-edge technology.',
    location: 'Dubai, UAE',
    mileage: 24,
    fuelType: 'Petrol',
    transmission: 'Automatic',
    bodyType: 'SUV',
    color: 'White',
    interiorColor: 'Black',
    engineSize: '3.0L',
    cylinders: 6,
    horsepower: 375,
    drivetrain: 'All Wheel Drive',
    steeringSide: 'Left Hand',
    doors: 4,
    seats: 5,
    condition: 'New',
    warranty: '24 months',
    features: [
      'M Sport Package',
      'Panoramic Sunroof',
      'Leather Seats',
      'Navigation System',
      'Bluetooth Connectivity',
      'Cruise Control',
      'Parking Sensors',
      'LED Headlights',
      'Climate Control',
      'Premium Sound System'
    ],
    specifications: {
      'Fuel Economy': '10.5L/100km',
      'Acceleration': '0-100km/h in 5.4s',
      'Top Speed': '250 km/h',
      'Boot Space': '580L',
      'Towing Capacity': '2500kg'
    },
    dealer: {
      name: 'Premium Motors Dubai',
      phone: '+971 4 123 4567',
      email: 'info@premiummotors.ae',
      address: 'Sheikh Zayed Road, Dubai',
      rating: 4.8,
      reviews: 245
    },
    financeOptions: {
      monthlyPayment: 5617,
      downPayment: 70000,
      interestRate: 2.99,
      term: 60
    }
  };

  return (
    <Layout>
      <div className="demo-page">
        <div className="container py-4">
        <div className="row">
          <div className="col-12">
            <h1 className="text-center mb-4" style={{ 
              fontFamily: 'Poppins, sans-serif', 
              fontSize: '32px', 
              fontWeight: '700',
              color: '#000'
            }}>
              Product Page Demos
            </h1>

            {/* Tab Navigation */}
            <div className="demo-tabs mb-4">
              <ul className="nav nav-tabs justify-content-center" role="tablist">
                <li className="nav-item" role="presentation">
                  <button
                    className={`nav-link ${activeTab === 'product' ? 'active' : ''}`}
                    onClick={() => setActiveTab('product')}
                    style={{ fontFamily: 'Poppins, sans-serif', fontWeight: '500', textTransform: 'uppercase' }}
                  >
                    Product
                  </button>
                </li>
                <li className="nav-item" role="presentation">
                  <button
                    className={`nav-link ${activeTab === 'auction' ? 'active' : ''}`}
                    onClick={() => setActiveTab('auction')}
                    style={{ fontFamily: 'Poppins, sans-serif', fontWeight: '500', textTransform: 'uppercase' }}
                  >
                    Auction
                  </button>
                </li>
                <li className="nav-item" role="presentation">
                  <button
                    className={`nav-link ${activeTab === 'property' ? 'active' : ''}`}
                    onClick={() => setActiveTab('property')}
                    style={{ fontFamily: 'Poppins, sans-serif', fontWeight: '500', textTransform: 'uppercase' }}
                  >
                    Property
                  </button>
                </li>
                <li className="nav-item" role="presentation">
                  <button
                    className={`nav-link ${activeTab === 'vehicle' ? 'active' : ''}`}
                    onClick={() => setActiveTab('vehicle')}
                    style={{ fontFamily: 'Poppins, sans-serif', fontWeight: '500', textTransform: 'uppercase' }}
                  >
                    Vehicle
                  </button>
                </li>
              </ul>
            </div>

            {/* Tab Content */}
            <div className="tab-content">
              {activeTab === 'product' && <ProductPage product={sampleProduct} />}
              {activeTab === 'auction' && <AuctionPage auction={sampleAuction} />}
              {activeTab === 'property' && <PropertyPage property={sampleProperty} />}
              {activeTab === 'vehicle' && <VehiclePage vehicle={sampleVehicle} />}
            </div>
          </div>
        </div>
        </div>
      </div>
    </Layout>
  );
};

export default DemoPage;
