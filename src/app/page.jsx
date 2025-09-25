'use client';

import React, { useEffect, useState } from 'react';
import Layout from '@/components/Layout';
import WoodMartHero from '@/components/sections/WoodMartHero';
import WoodMartCategories from '@/components/sections/WoodMartCategories';
import WoodMartProductGrid from '@/components/sections/WoodMartProductGrid';
import WoodMartVehicles from '@/components/sections/WoodMartVehicles';
import WoodMartProperties from '@/components/sections/WoodMartProperties';
import WoodMartAuctions from '@/components/sections/WoodMartAuctions';
//import WoodMartNewsletter from '@/components/sections/WoodMartNewsletter';
import { apiService, Product, Category } from '@/services/api';
// Types removed - using plain JavaScript objects

export default function Home() {
  const [categories, setCategories] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [properties, setProperties] = useState([]);
  const [auctions, setAuctions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch all data in parallel
        const [
          categoriesResponse, 
          productsResponse, 
          vehiclesResponse, 
          propertiesResponse, 
          auctionsResponse
        ] = await Promise.all([
          apiService.getCategories(),
          apiService.getFeaturedProducts(12),
          apiService.getVehicles(),
          apiService.getProperties(),
          apiService.getAuctions()
        ]);

        if (categoriesResponse.success) {
          setCategories(categoriesResponse.data);
        }

        if (productsResponse.success) {
          setFeaturedProducts(productsResponse.data.slice(0, 12));
        }

        if (vehiclesResponse.success) {
          setVehicles(vehiclesResponse.data.slice(0, 12));
        }

        if (propertiesResponse.success) {
          setProperties(propertiesResponse.data.slice(0, 12));
        }

        if (auctionsResponse.success) {
          setAuctions(auctionsResponse.data.slice(0, 12));
        }
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Fallback mock data for demonstration if API fails
  const mockCategories = [
    {
      id: 1,
      name: 'Electronics',
      slug: 'electronics',
      image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400&h=300&fit=crop',
      productCount: 245,
      description: 'Latest electronics and gadgets'
    },
    {
      id: 2,
      name: 'Smartphones',
      slug: 'smartphones',
      image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=300&fit=crop',
      productCount: 189,
      description: 'Top smartphone brands and models'
    },
    {
      id: 3,
      name: 'Laptops',
      slug: 'laptops',
      image: 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=400&h=300&fit=crop',
      productCount: 156,
      description: 'High-performance laptops for work and gaming'
    },
    {
      id: 4,
      name: 'Fashion',
      slug: 'fashion',
      image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=300&fit=crop',
      productCount: 203,
      description: 'Trendy fashion and clothing'
    }
  ];

  // Fallback mock data for demonstration if API fails
  const mockFeaturedProducts = [
    {
      id: 1,
      name: 'iPhone 15 Pro',
      slug: 'iphone-15-pro',
      price: 999,
      comparePrice: 1199,
      image: 'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=400&h=400&fit=crop',
      rating: 4.8,
      reviewsCount: 156,
      isNew: true,
      badge: 'Bestseller'
    },
    {
      id: 2,
      name: 'MacBook Pro 16-inch',
      slug: 'macbook-pro-16',
      price: 2499,
      image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&h=400&fit=crop',
      rating: 4.9,
      reviewsCount: 89,
      isFeatured: true
    },
    {
      id: 3,
      name: 'Samsung Galaxy S24 Ultra',
      slug: 'samsung-galaxy-s24-ultra',
      price: 1199,
      comparePrice: 1299,
      image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=400&fit=crop',
      rating: 4.7,
      reviewsCount: 234,
      isSale: true
    },
    {
      id: 4,
      name: 'Nike Air Max 270',
      slug: 'nike-air-max-270',
      price: 150,
      image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop',
      rating: 4.6,
      reviewsCount: 67,
      isNew: true
    },
    {
      id: 5,
      name: 'Sony WH-1000XM4',
      slug: 'sony-wh-1000xm4',
      price: 349,
      comparePrice: 399,
      image: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=400&h=400&fit=crop',
      rating: 4.8,
      reviewsCount: 145,
      isSale: true
    },
    {
      id: 6,
      name: 'Canon EOS R5',
      slug: 'canon-eos-r5',
      price: 3899,
      image: 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=400&h=400&fit=crop',
      rating: 4.9,
      reviewsCount: 23,
      isFeatured: true
    },
    {
      id: 7,
      name: 'Dell XPS 13',
      slug: 'dell-xps-13',
      price: 1299,
      image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&h=400&fit=crop',
      rating: 4.5,
      reviewsCount: 78,
      isNew: true
    },
    {
      id: 8,
      name: 'Apple Watch Series 9',
      slug: 'apple-watch-series-9',
      price: 399,
      comparePrice: 449,
      image: 'https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=400&h=400&fit=crop',
      rating: 4.7,
      reviewsCount: 112,
      isSale: true
    },
    {
      id: 9,
      name: 'iPad Pro 12.9',
      slug: 'ipad-pro-12-9',
      price: 1099,
      image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400&h=400&fit=crop',
      rating: 4.8,
      reviewsCount: 89,
      isFeatured: true
    },
    {
      id: 10,
      name: 'Samsung 4K TV',
      slug: 'samsung-4k-tv',
      price: 899,
      comparePrice: 1199,
      image: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=400&h=400&fit=crop',
      rating: 4.6,
      reviewsCount: 156,
      isSale: true
    },
    {
      id: 11,
      name: 'Gaming Chair',
      slug: 'gaming-chair',
      price: 299,
      image: 'https://images.unsplash.com/photo-1592078615290-033ee584e267?w=400&h=400&fit=crop',
      rating: 4.4,
      reviewsCount: 234,
      isNew: true
    },
    {
      id: 12,
      name: 'Wireless Mouse',
      slug: 'wireless-mouse',
      price: 79,
      comparePrice: 99,
      image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400&h=400&fit=crop',
      rating: 4.5,
      reviewsCount: 67,
      isSale: true
    }
  ];

  // Mock data for vehicles
  const mockVehicles = [
    {
      id: 1,
      name: '2023 Tesla Model S',
      slug: '2023-tesla-model-s',
      price: 89990,
      comparePrice: 94990,
      image: 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=400&h=300&fit=crop',
      rating: 4.9,
      reviewsCount: 45,
      year: 2023,
      mileage: 15000,
      fuelType: 'Electric',
      transmission: 'Automatic',
      isNew: true,
      badge: 'Premium'
    },
    {
      id: 2,
      name: '2022 BMW X5',
      slug: '2022-bmw-x5',
      price: 65990,
      image: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=400&h=300&fit=crop',
      rating: 4.7,
      reviewsCount: 78,
      year: 2022,
      mileage: 25000,
      fuelType: 'Gasoline',
      transmission: 'Automatic',
      isFeatured: true
    },
    {
      id: 3,
      name: '2023 Honda Civic',
      slug: '2023-honda-civic',
      price: 28990,
      comparePrice: 31990,
      image: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=400&h=300&fit=crop',
      rating: 4.6,
      reviewsCount: 123,
      year: 2023,
      mileage: 12000,
      fuelType: 'Gasoline',
      transmission: 'CVT',
      isSale: true
    },
    {
      id: 4,
      name: '2021 Mercedes-Benz C-Class',
      slug: '2021-mercedes-benz-c-class',
      price: 45990,
      image: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=400&h=300&fit=crop',
      rating: 4.8,
      reviewsCount: 67,
      year: 2021,
      mileage: 32000,
      fuelType: 'Gasoline',
      transmission: 'Automatic',
      isNew: true
    },
    {
      id: 5,
      name: '2023 Ford F-150',
      slug: '2023-ford-f150',
      price: 54990,
      comparePrice: 57990,
      image: 'https://images.unsplash.com/photo-1563720223185-11003d516935?w=400&h=300&fit=crop',
      rating: 4.5,
      reviewsCount: 89,
      year: 2023,
      mileage: 18000,
      fuelType: 'Gasoline',
      transmission: 'Automatic',
      isSale: true
    },
    {
      id: 6,
      name: '2022 Audi A4',
      slug: '2022-audi-a4',
      price: 42990,
      image: 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=400&h=300&fit=crop',
      rating: 4.7,
      reviewsCount: 56,
      year: 2022,
      mileage: 22000,
      fuelType: 'Gasoline',
      transmission: 'Automatic',
      isFeatured: true
    },
    {
      id: 7,
      name: '2023 Toyota Camry',
      slug: '2023-toyota-camry',
      price: 31990,
      image: 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=400&h=300&fit=crop',
      rating: 4.6,
      reviewsCount: 134,
      year: 2023,
      mileage: 14000,
      fuelType: 'Hybrid',
      transmission: 'CVT',
      isNew: true
    },
    {
      id: 8,
      name: '2021 Porsche 911',
      slug: '2021-porsche-911',
      price: 125990,
      comparePrice: 135990,
      image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=400&h=300&fit=crop',
      rating: 4.9,
      reviewsCount: 23,
      year: 2021,
      mileage: 8500,
      fuelType: 'Gasoline',
      transmission: 'Manual',
      isSale: true,
      badge: 'Luxury'
    },
    {
      id: 9,
      name: '2023 Nissan Altima',
      slug: '2023-nissan-altima',
      price: 27990,
      image: 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=400&h=300&fit=crop',
      rating: 4.4,
      reviewsCount: 98,
      year: 2023,
      mileage: 16000,
      fuelType: 'Gasoline',
      transmission: 'CVT',
      isFeatured: true
    },
    {
      id: 10,
      name: '2022 Lexus RX',
      slug: '2022-lexus-rx',
      price: 58990,
      comparePrice: 62990,
      image: 'https://images.unsplash.com/photo-1549317336-206569e8475c?w=400&h=300&fit=crop',
      rating: 4.8,
      reviewsCount: 76,
      year: 2022,
      mileage: 20000,
      fuelType: 'Hybrid',
      transmission: 'Automatic',
      isSale: true
    },
    {
      id: 11,
      name: '2023 Hyundai Elantra',
      slug: '2023-hyundai-elantra',
      price: 24990,
      image: 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=400&h=300&fit=crop',
      rating: 4.3,
      reviewsCount: 112,
      year: 2023,
      mileage: 13000,
      fuelType: 'Gasoline',
      transmission: 'CVT',
      isNew: true
    },
    {
      id: 12,
      name: '2021 Subaru Outback',
      slug: '2021-subaru-outback',
      price: 35990,
      comparePrice: 38990,
      image: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400&h=300&fit=crop',
      rating: 4.5,
      reviewsCount: 87,
      year: 2021,
      mileage: 28000,
      fuelType: 'Gasoline',
      transmission: 'CVT',
      isSale: true
    }
  ];

  // Mock data for properties
  const mockProperties = [
    {
      id: 1,
      name: 'Modern Downtown Condo',
      slug: 'modern-downtown-condo',
      price: 750000,
      comparePrice: 800000,
      image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=400&h=300&fit=crop',
      rating: 4.8,
      reviewsCount: 34,
      bedrooms: 2,
      bathrooms: 2,
      area: 1200,
      propertyType: 'Condo',
      location: 'Downtown',
      isNew: true,
      badge: 'Featured'
    },
    {
      id: 2,
      name: 'Luxury Family Home',
      slug: 'luxury-family-home',
      price: 1250000,
      image: 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=400&h=300&fit=crop',
      rating: 4.9,
      reviewsCount: 28,
      bedrooms: 4,
      bathrooms: 3,
      area: 2500,
      propertyType: 'House',
      location: 'Suburbs',
      isFeatured: true
    },
    {
      id: 3,
      name: 'Beachfront Villa',
      slug: 'beachfront-villa',
      price: 2100000,
      comparePrice: 2300000,
      image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400&h=300&fit=crop',
      rating: 4.9,
      reviewsCount: 15,
      bedrooms: 5,
      bathrooms: 4,
      area: 3500,
      propertyType: 'Villa',
      location: 'Beachfront',
      isSale: true
    },
    {
      id: 4,
      name: 'Cozy Studio Apartment',
      slug: 'cozy-studio-apartment',
      price: 450000,
      image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400&h=300&fit=crop',
      rating: 4.5,
      reviewsCount: 42,
      bedrooms: 1,
      bathrooms: 1,
      area: 600,
      propertyType: 'Studio',
      location: 'City Center',
      isNew: true
    },
    {
      id: 5,
      name: 'Mountain View Cabin',
      slug: 'mountain-view-cabin',
      price: 650000,
      comparePrice: 700000,
      image: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=400&h=300&fit=crop',
      rating: 4.7,
      reviewsCount: 31,
      bedrooms: 3,
      bathrooms: 2,
      area: 1800,
      propertyType: 'Cabin',
      location: 'Mountains',
      isSale: true
    },
    {
      id: 6,
      name: 'Historic Townhouse',
      slug: 'historic-townhouse',
      price: 950000,
      image: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400&h=300&fit=crop',
      rating: 4.6,
      reviewsCount: 19,
      bedrooms: 3,
      bathrooms: 2,
      area: 1600,
      propertyType: 'Townhouse',
      location: 'Historic District',
      isFeatured: true
    },
    {
      id: 7,
      name: 'Modern Loft',
      slug: 'modern-loft',
      price: 580000,
      image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400&h=300&fit=crop',
      rating: 4.4,
      reviewsCount: 56,
      bedrooms: 2,
      bathrooms: 1,
      area: 1000,
      propertyType: 'Loft',
      location: 'Arts District',
      isNew: true
    },
    {
      id: 8,
      name: 'Garden Apartment',
      slug: 'garden-apartment',
      price: 420000,
      comparePrice: 450000,
      image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&h=300&fit=crop',
      rating: 4.3,
      reviewsCount: 38,
      bedrooms: 1,
      bathrooms: 1,
      area: 800,
      propertyType: 'Apartment',
      location: 'Garden District',
      isSale: true
    },
    {
      id: 9,
      name: 'Penthouse Suite',
      slug: 'penthouse-suite',
      price: 1800000,
      image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=400&h=300&fit=crop',
      rating: 4.9,
      reviewsCount: 12,
      bedrooms: 3,
      bathrooms: 3,
      area: 2000,
      propertyType: 'Penthouse',
      location: 'High Rise',
      isFeatured: true
    },
    {
      id: 10,
      name: 'Country House',
      slug: 'country-house',
      price: 850000,
      comparePrice: 900000,
      image: 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=400&h=300&fit=crop',
      rating: 4.7,
      reviewsCount: 25,
      bedrooms: 4,
      bathrooms: 2,
      area: 2200,
      propertyType: 'House',
      location: 'Countryside',
      isSale: true
    },
    {
      id: 11,
      name: 'Waterfront Condo',
      slug: 'waterfront-condo',
      price: 1200000,
      image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=400&h=300&fit=crop',
      rating: 4.8,
      reviewsCount: 33,
      bedrooms: 2,
      bathrooms: 2,
      area: 1400,
      propertyType: 'Condo',
      location: 'Waterfront',
      isNew: true
    },
    {
      id: 12,
      name: 'Duplex Apartment',
      slug: 'duplex-apartment',
      price: 680000,
      comparePrice: 720000,
      image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&h=300&fit=crop',
      rating: 4.5,
      reviewsCount: 47,
      bedrooms: 3,
      bathrooms: 2,
      area: 1500,
      propertyType: 'Duplex',
      location: 'Uptown',
      isSale: true
    }
  ];

  // Mock data for auctions
  const mockAuctions = [
    {
      id: 1,
      name: 'Vintage Rolex Watch',
      slug: 'vintage-rolex-watch',
      currentBid: 8500,
      reservePrice: 10000,
      image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=300&fit=crop',
      rating: 4.9,
      reviewsCount: 12,
      endTime: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
      bidCount: 23,
      productName: 'Rolex Submariner',
      sellerName: 'Luxury Timepieces',
      isFeatured: true,
      badge: 'Luxury'
    },
    {
      id: 2,
      name: 'Antique Persian Rug',
      slug: 'antique-persian-rug',
      currentBid: 3200,
      reservePrice: 4000,
      image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop',
      rating: 4.7,
      reviewsCount: 8,
      endTime: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
      bidCount: 15,
      productName: 'Handwoven Persian Rug',
      sellerName: 'Antique Collectors',
      isNew: true
    },
    {
      id: 3,
      name: 'Classic Car Restoration',
      slug: 'classic-car-restoration',
      currentBid: 45000,
      reservePrice: 55000,
      image: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=400&h=300&fit=crop',
      rating: 4.8,
      reviewsCount: 6,
      endTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      bidCount: 31,
      productName: '1967 Ford Mustang',
      sellerName: 'Classic Cars Inc',
      isFeatured: true
    },
    {
      id: 4,
      name: 'Rare Wine Collection',
      slug: 'rare-wine-collection',
      currentBid: 2800,
      image: 'https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?w=400&h=300&fit=crop',
      rating: 4.6,
      reviewsCount: 14,
      endTime: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
      bidCount: 19,
      productName: 'Vintage Wine Set',
      sellerName: 'Wine Collectors',
      isNew: true
    },
    {
      id: 5,
      name: 'Artwork by Local Artist',
      slug: 'artwork-local-artist',
      currentBid: 1200,
      reservePrice: 1500,
      image: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400&h=300&fit=crop',
      rating: 4.4,
      reviewsCount: 22,
      endTime: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(),
      bidCount: 8,
      productName: 'Abstract Painting',
      sellerName: 'Local Gallery',
      isSale: true
    },
    {
      id: 6,
      name: 'Jewelry Set',
      slug: 'jewelry-set',
      currentBid: 5600,
      reservePrice: 7000,
      image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&h=300&fit=crop',
      rating: 4.8,
      reviewsCount: 9,
      endTime: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString(),
      bidCount: 27,
      productName: 'Diamond Jewelry Set',
      sellerName: 'Prestige Jewelers',
      isFeatured: true
    },
    {
      id: 7,
      name: 'Electronics Bundle',
      slug: 'electronics-bundle',
      currentBid: 450,
      image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400&h=300&fit=crop',
      rating: 4.3,
      reviewsCount: 35,
      endTime: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000).toISOString(),
      bidCount: 12,
      productName: 'Gaming Setup',
      sellerName: 'Tech Deals',
      isNew: true
    },
    {
      id: 8,
      name: 'Furniture Collection',
      slug: 'furniture-collection',
      currentBid: 1800,
      reservePrice: 2200,
      image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop',
      rating: 4.5,
      reviewsCount: 18,
      endTime: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000).toISOString(),
      bidCount: 16,
      productName: 'Living Room Set',
      sellerName: 'Home Decor Plus',
      isSale: true
    },
    {
      id: 9,
      name: 'Sports Memorabilia',
      slug: 'sports-memorabilia',
      currentBid: 3200,
      image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop',
      rating: 4.7,
      reviewsCount: 11,
      endTime: new Date(Date.now() + 9 * 24 * 60 * 60 * 1000).toISOString(),
      bidCount: 24,
      productName: 'Signed Basketball',
      sellerName: 'Sports Collectibles',
      isFeatured: true
    },
    {
      id: 10,
      name: 'Collectible Coins',
      slug: 'collectible-coins',
      currentBid: 950,
      reservePrice: 1200,
      image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=300&fit=crop',
      rating: 4.6,
      reviewsCount: 16,
      endTime: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(),
      bidCount: 13,
      productName: 'Rare Coin Collection',
      sellerName: 'Numismatics Pro',
      isSale: true
    },
    {
      id: 11,
      name: 'Musical Instrument',
      slug: 'musical-instrument',
      currentBid: 2800,
      image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=300&fit=crop',
      rating: 4.8,
      reviewsCount: 7,
      endTime: new Date(Date.now() + 11 * 24 * 60 * 60 * 1000).toISOString(),
      bidCount: 20,
      productName: 'Vintage Guitar',
      sellerName: 'Music Masters',
      isNew: true
    },
    {
      id: 12,
      name: 'Photography Equipment',
      slug: 'photography-equipment',
      currentBid: 1500,
      reservePrice: 1800,
      image: 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=400&h=300&fit=crop',
      rating: 4.4,
      reviewsCount: 29,
      endTime: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000).toISOString(),
      bidCount: 17,
      productName: 'Camera Kit',
      sellerName: 'Photo Pro Shop',
      isSale: true
    }
  ];

  // Transform API data to match component expectations
  const displayCategories = categories.length > 0 ? categories.map(cat => ({
    id: cat.id,
    name: cat.name,
    slug: cat.slug,
    image: cat.image && cat.image.trim() !== '' ? cat.image : '/images/placeholder.svg',
    productCount: 0, // We'll need to fetch this separately if needed
    description: cat.description || `Shop ${cat.name.toLowerCase()} products`
  })) : mockCategories;

  const displayProducts = featuredProducts.length > 0 ? featuredProducts.map(product => {
    // Safely handle gallery data
    let imageUrl = '/images/placeholder.svg';
    
    try {
      if (product.gallery) {
        // If gallery is a string, try to parse it as JSON
        if (typeof product.gallery === 'string') {
          const galleryArray = JSON.parse(product.gallery);
          if (Array.isArray(galleryArray) && galleryArray.length > 0 && galleryArray[0]) {
            imageUrl = galleryArray[0];
          }
        } 
        // If gallery is already an array
        else if (Array.isArray(product.gallery) && product.gallery.length > 0 && product.gallery[0]) {
          imageUrl = product.gallery[0];
        }
      }
    } catch (error) {
      console.warn('Error parsing product gallery:', error);
      imageUrl = '/images/placeholder.svg';
    }

    return {
      id: product.id,
      name: product.name,
      slug: product.slug,
      price: product.price,
      comparePrice: product.sale_price,
      image: imageUrl,
      rating: 4.5, // Default rating since we don't have this in the API yet
      reviewsCount: Math.floor(Math.random() * 50) + 10, // Random for now
      isNew: product.is_featured,
      badge: product.sale_price ? 'Sale' : 'New'
    };
  }) : mockFeaturedProducts;

  // Transform vehicles data
  const displayVehicles = vehicles.length > 0 ? vehicles.slice(0, 12).map(vehicle => ({
    id: vehicle.id,
    name: vehicle.name || 'Vehicle',
    slug: vehicle.slug || `vehicle-${vehicle.id}`,
    price: vehicle.price || 0,
    comparePrice: vehicle.sale_price,
    image: vehicle.featured_image || 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=400&h=300&fit=crop',
    rating: 4.5,
    reviewsCount: Math.floor(Math.random() * 50) + 10,
    year: vehicle.year || 2023,
    mileage: vehicle.mileage || Math.floor(Math.random() * 50000) + 10000,
    fuelType: vehicle.fuel_type || 'Gasoline',
    transmission: vehicle.transmission || 'Automatic',
    isNew: Math.random() > 0.7,
    isFeatured: Math.random() > 0.8,
    badge: Math.random() > 0.8 ? 'Premium' : undefined
  })) : mockVehicles;

  // Transform properties data
  const displayProperties = properties.length > 0 ? properties.slice(0, 12).map(property => ({
    id: property.id,
    name: property.name || 'Property',
    slug: property.slug || `property-${property.id}`,
    price: property.price || 0,
    comparePrice: property.sale_price,
    image: property.featured_image || 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=400&h=300&fit=crop',
    rating: 4.5,
    reviewsCount: Math.floor(Math.random() * 50) + 10,
    bedrooms: property.bedrooms || Math.floor(Math.random() * 4) + 1,
    bathrooms: property.bathrooms || Math.floor(Math.random() * 3) + 1,
    area: property.area || Math.floor(Math.random() * 2000) + 800,
    propertyType: property.property_type || 'House',
    location: property.location || 'City',
    isNew: Math.random() > 0.7,
    isFeatured: Math.random() > 0.8,
    badge: Math.random() > 0.8 ? 'Featured' : undefined
  })) : mockProperties;

  // Transform auctions data
  const displayAuctions = auctions.length > 0 ? auctions.slice(0, 12).map(auction => ({
    id: auction.id,
    name: auction.product_name || 'Auction Item',
    slug: auction.slug || `auction-${auction.id}`,
    currentBid: auction.current_bid || Math.floor(Math.random() * 10000) + 100,
    reservePrice: auction.reserve_price,
    image: auction.product_image || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=300&fit=crop',
    rating: 4.5,
    reviewsCount: Math.floor(Math.random() * 50) + 10,
    endTime: auction.end_time || new Date(Date.now() + Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
    bidCount: Math.floor(Math.random() * 50) + 5,
    productName: auction.product_name || 'Auction Item',
    sellerName: auction.seller_name || 'Seller',
    isNew: Math.random() > 0.7,
    isFeatured: Math.random() > 0.8,
    badge: Math.random() > 0.8 ? 'Luxury' : undefined
  })) : mockAuctions;

  return (
    <Layout>
      {/* XpertBid Hero Section */}
      <WoodMartHero />
      
      {/* Categories Section */}
      <WoodMartCategories 
        title="Shop by Category"
        subtitle="Browse our collections"
        categories={displayCategories}
        columns={4}
      />
      
      {/* Featured Products */}
      <WoodMartProductGrid 
        title="Featured Products"
        subtitle="Handpicked items just for you"
        products={displayProducts}
        columns={4}
        showViewAll={true}
        viewAllLink="/shop"
      />
      
      {/* Live Auctions */}
      <WoodMartAuctions 
        title="Live Auctions"
        subtitle="Bid and win amazing deals"
        auctions={displayAuctions}
        columns={4}
        showViewAll={true}
        viewAllLink="/auctions"
      />
      
      {/* Featured Vehicles */}
      <WoodMartVehicles 
        title="Featured Vehicles"
        subtitle="Find your perfect ride"
        vehicles={displayVehicles}
        columns={4}
        showViewAll={true}
        viewAllLink="/vehicles"
      />
      
      {/* Featured Properties */}
      <WoodMartProperties 
        title="Featured Properties"
        subtitle="Find your dream home"
        properties={displayProperties}
        columns={4}
        showViewAll={true}
        viewAllLink="/properties"
      />
      
      {/* Newsletter Section */}
      
    </Layout>
  );
}

