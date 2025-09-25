'use client';

import React, { useEffect, useState } from 'react';
import Layout from '@/components/Layout';
import WoodMartHero from '@/components/sections/WoodMartHero';
import WoodMartCategories from '@/components/sections/WoodMartCategories';
import WoodMartProductGrid from '@/components/sections/WoodMartProductGrid';
import WoodMartVehicles from '@/components/sections/WoodMartVehicles';
import WoodMartProperties from '@/components/sections/WoodMartProperties';
import WoodMartAuctions from '@/components/sections/WoodMartAuctions';
import WoodMartNewsletter from '@/components/sections/WoodMartNewsletter';
import BlogSection from '@/components/sections/BlogSection';
import { apiService } from '@/services/api';
// Types removed - using plain JavaScript objects

export default function Home() {
  const [categories, setCategories] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [properties, setProperties] = useState([]);
  const [auctions, setAuctions] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        
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


        if (categoriesResponse.success && categoriesResponse.data.length > 0) {
          setCategories(categoriesResponse.data);
        } else {
          setCategories(mockCategories);
        }

        if (productsResponse.success && productsResponse.data.length > 0) {
          setFeaturedProducts(productsResponse.data.slice(0, 12));
        } else {
          setFeaturedProducts(mockFeaturedProducts);
        }

        if (vehiclesResponse.success && vehiclesResponse.data.length > 0) {
          setVehicles(vehiclesResponse.data.slice(0, 12));
        } else {
          setVehicles(mockVehicles);
        }

        if (propertiesResponse.success && propertiesResponse.data.length > 0) {
          setProperties(propertiesResponse.data.slice(0, 12));
        } else {
          setProperties(mockProperties);
        }

        if (auctionsResponse.success && auctionsResponse.data.length > 0) {
          setAuctions(auctionsResponse.data.slice(0, 12));
        } else {
          setAuctions(mockAuctions);
        }
      } catch (err) {
        console.error('Error fetching data, using mock data:', err);
        console.error('Error details:', {
          message: err instanceof Error ? err.message : 'Unknown error',
          stack: err instanceof Error ? err.stack : undefined,
          name: err instanceof Error ? err.name : undefined
        });
        // Use mock data
        setCategories(mockCategories);
        setFeaturedProducts(mockFeaturedProducts);
        setVehicles(mockVehicles);
        setProperties(mockProperties);
        setAuctions(mockAuctions);
      }
    };

    fetchData();
  }, []);

  // Fallback mock data for demonstration if API fails
  const mockCategories = [
    {
      id: 1,
      tenant_id: 1,
      parent_id: null,
      level: 1,
      path: 'electronics',
      name: 'Electronics',
      slug: 'electronics',
      description: 'Latest electronics and gadgets',
      image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400&h=300&fit=crop',
      banner_image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=800&h=400&fit=crop',
      icon: 'electronics',
      color: '#3B82F6',
      sort_order: 1,
      is_active: true,
      is_featured: true,
      status: 'active',
      language: 'en',
      translation_group: null,
      seo_meta: null,
      seo_title: 'Product',
      seo_description: 'Product description',
      seo_keywords: 'product, item',
      canonical_url: null,
      commission_rate: 5.0,
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z'
    },
    {
      id: 1,
      tenant_id: 1,
      parent_id: null,
      level: 1,
      path: 'electronics/smartphones',
      name: 'Smartphones',
      slug: 'smartphones',
      description: 'Top smartphone brands and models',
      image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=300&fit=crop',
      banner_image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=800&h=400&fit=crop',
      icon: 'smartphone',
      color: '#10B981',
      sort_order: 1,
      is_active: true,
      is_featured: true,
      status: 'active',
      language: 'en',
      translation_group: null,
      seo_meta: null,
      seo_title: 'Product',
      seo_description: 'Product description',
      seo_keywords: 'product, item',
      canonical_url: null,
      commission_rate: 5.0,
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z'
    },
    {
      id: 1,
      tenant_id: 1,
      parent_id: null,
      level: 1,
      path: 'electronics/laptops',
      name: 'Laptops',
      slug: 'laptops',
      description: 'High-performance laptops for work and gaming',
      image: 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=400&h=300&fit=crop',
      banner_image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=800&h=400&fit=crop',
      icon: 'laptop',
      color: '#F59E0B',
      sort_order: 1,
      is_active: true,
      is_featured: true,
      status: 'active',
      language: 'en',
      translation_group: null,
      seo_meta: null,
      seo_title: 'Product',
      seo_description: 'Product description',
      seo_keywords: 'product, item',
      canonical_url: null,
      commission_rate: 5.0,
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z'
    },
    {
      id: 1,
      tenant_id: 1,
      parent_id: null,
      level: 1,
      path: 'fashion',
      name: 'Fashion',
      slug: 'fashion',
      description: 'Trendy fashion and clothing',
      image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=300&fit=crop',
      banner_image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=800&h=400&fit=crop',
      icon: 'fashion',
      color: '#EF4444',
      sort_order: 1,
      is_active: true,
      is_featured: true,
      status: 'active',
      language: 'en',
      translation_group: null,
      seo_meta: null,
      seo_title: 'Product',
      seo_description: 'Product description',
      seo_keywords: 'product, item',
      canonical_url: null,
      commission_rate: 5.0,
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z'
    }
  ];

  // Fallback mock data for demonstration if API fails
  const mockFeaturedProducts = [
    {
      id: 1,
      name: 'iPhone 15 Pro',
      slug: 'iphone-15-pro',
      description: 'The latest iPhone with advanced features and premium design',
      short_description: 'Latest iPhone with premium features',
      price: 299.99,
      sale_price: 249.99,
      sku: 'IPH15PRO-001',
      stock_quantity: 50,
      stock_status: 'in_stock',
      weight: 0.187,
      length: 15.54,
      width: 7.65,
      height: 0.83,
      status: 'active',
      is_featured: true,
      images: ['https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=400&h=400&fit=crop'],
      featured_image: 'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=400&h=400&fit=crop',
      thumbnail_image: 'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=200&h=200&fit=crop',
      business_name: 'Apple Store',
      category_name: 'Smartphones',
      brand_name: 'Apple',
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z'
    },
    {
      id: 1,
      name: 'MacBook Pro 16-inch',
      slug: 'macbook-pro-16',
      description: 'Powerful laptop for professionals and creators',
      short_description: 'Professional laptop for creators',
      price: 299.99,
      sale_price: 249.99,
      sku: 'MBP16-001',
      stock_quantity: 50,
      stock_status: 'in_stock',
      weight: 2.0,
      length: 35.57,
      width: 24.81,
      height: 1.68,
      status: 'active',
      is_featured: true,
      images: ['https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&h=400&fit=crop'],
      featured_image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&h=400&fit=crop',
      thumbnail_image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=200&h=200&fit=crop',
      business_name: 'Apple Store',
      category_name: 'Laptops',
      brand_name: 'Apple',
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z'
    },
    {
      id: 1,
      name: 'Samsung Galaxy S24 Ultra',
      slug: 'samsung-galaxy-s24-ultra',
      description: 'Latest Android smartphone with advanced camera system',
      short_description: 'Latest Android smartphone',
      price: 299.99,
      sale_price: 249.99,
      sku: 'SGS24U-001',
      stock_quantity: 50,
      stock_status: 'in_stock',
      weight: 0.232,
      length: 16.24,
      width: 7.9,
      height: 0.88,
      status: 'active',
      is_featured: true,
      images: ['https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=400&fit=crop'],
      featured_image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=400&fit=crop',
      thumbnail_image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=200&h=200&fit=crop',
      business_name: 'Samsung Store',
      category_name: 'Smartphones',
      brand_name: 'Samsung',
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z'
    },
    {
      id: 1,
      name: 'Nike Air Max 270',
      slug: 'nike-air-max-270',
      price: 299.99,
      image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop',
      rating: 4.6,
      reviewsCount: 128,
      isNew: true
    },
    {
      id: 1,
      name: 'Sony WH-1000XM4',
      slug: 'sony-wh-1000xm4',
      price: 299.99,
      comparePrice: 349.99,
      image: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=400&h=400&fit=crop',
      rating: 4.8,
      reviewsCount: 128,
      isSale: true
    },
    {
      id: 1,
      name: 'Canon EOS R5',
      slug: 'canon-eos-r5',
      price: 299.99,
      image: 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=400&h=400&fit=crop',
      rating: 4.9,
      reviewsCount: 128,
      isFeatured: true
    },
    {
      id: 1,
      name: 'Dell XPS 13',
      slug: 'dell-xps-13',
      price: 299.99,
      image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&h=400&fit=crop',
      rating: 4.5,
      reviewsCount: 128,
      isNew: true
    },
    {
      id: 1,
      name: 'Apple Watch Series 9',
      slug: 'apple-watch-series-9',
      price: 299.99,
      comparePrice: 349.99,
      image: 'https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=400&h=400&fit=crop',
      rating: 4.7,
      reviewsCount: 128,
      isSale: true
    },
    {
      id: 1,
      name: 'iPad Pro 12.9',
      slug: 'ipad-pro-12-9',
      price: 299.99,
      image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400&h=400&fit=crop',
      rating: 4.8,
      reviewsCount: 128,
      isFeatured: true
    },
    {
      id: 1,
      name: 'Samsung 4K TV',
      slug: 'samsung-4k-tv',
      price: 299.99,
      comparePrice: 349.99,
      image: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=400&h=400&fit=crop',
      rating: 4.6,
      reviewsCount: 128,
      isSale: true
    },
    {
      id: 1,
      name: 'Gaming Chair',
      slug: 'gaming-chair',
      price: 299.99,
      image: 'https://images.unsplash.com/photo-1592078615290-033ee584e267?w=400&h=400&fit=crop',
      rating: 4.4,
      reviewsCount: 128,
      isNew: true
    },
    {
      id: 1,
      name: 'Wireless Mouse',
      slug: 'wireless-mouse',
      price: 299.99,
      comparePrice: 349.99,
      image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400&h=400&fit=crop',
      rating: 4.5,
      reviewsCount: 128,
      isSale: true
    }
  ];

  // Mock data for vehicles
  const mockVehicles = [
    {
      id: 1,
      name: '2023 Tesla Model S',
      slug: '2023-tesla-model-s',
      price: 299.99,
      comparePrice: 349.99,
      image: 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=400&h=300&fit=crop',
      rating: 4.9,
      reviewsCount: 128,
      year: 2023,
      mileage: 25000,
      fuelType: 'Electric',
      transmission: 'Automatic',
      isNew: false,
      badge: 'Premium'
    },
    {
      id: 1,
      name: '2022 BMW X5',
      slug: '2022-bmw-x5',
      price: 299.99,
      image: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=400&h=300&fit=crop',
      rating: 4.7,
      reviewsCount: 128,
      year: 2023,
      mileage: 25000,
      fuelType: 'Gasoline',
      transmission: 'Automatic',
      isFeatured: true
    },
    {
      id: 1,
      name: '2023 Honda Civic',
      slug: '2023-honda-civic',
      price: 299.99,
      comparePrice: 349.99,
      image: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=400&h=300&fit=crop',
      rating: 4.6,
      reviewsCount: 128,
      year: 2023,
      mileage: 25000,
      fuelType: 'Gasoline',
      transmission: 'CVT',
      isSale: true
    },
    {
      id: 1,
      name: '2021 Mercedes-Benz C-Class',
      slug: '2021-mercedes-benz-c-class',
      price: 299.99,
      image: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=400&h=300&fit=crop',
      rating: 4.8,
      reviewsCount: 128,
      year: 2023,
      mileage: 25000,
      fuelType: 'Gasoline',
      transmission: 'Automatic',
      isNew: true
    },
    {
      id: 1,
      name: '2023 Ford F-150',
      slug: '2023-ford-f150',
      price: 299.99,
      comparePrice: 349.99,
      image: 'https://images.unsplash.com/photo-1563720223185-11003d516935?w=400&h=300&fit=crop',
      rating: 4.5,
      reviewsCount: 128,
      year: 2023,
      mileage: 25000,
      fuelType: 'Gasoline',
      transmission: 'Automatic',
      isSale: true
    },
    {
      id: 1,
      name: '2022 Audi A4',
      slug: '2022-audi-a4',
      price: 299.99,
      image: 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=400&h=300&fit=crop',
      rating: 4.7,
      reviewsCount: 128,
      year: 2023,
      mileage: 25000,
      fuelType: 'Gasoline',
      transmission: 'Automatic',
      isFeatured: true
    },
    {
      id: 1,
      name: '2023 Toyota Camry',
      slug: '2023-toyota-camry',
      price: 299.99,
      image: 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=400&h=300&fit=crop',
      rating: 4.6,
      reviewsCount: 128,
      year: 2023,
      mileage: 25000,
      fuelType: 'Hybrid',
      transmission: 'CVT',
      isNew: true
    },
    {
      id: 1,
      name: '2021 Porsche 911',
      slug: '2021-porsche-911',
      price: 299.99,
      comparePrice: 349.99,
      image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=400&h=300&fit=crop',
      rating: 4.9,
      reviewsCount: 128,
      year: 2023,
      mileage: 25000,
      fuelType: 'Gasoline',
      transmission: 'Manual',
      isSale: true,
      badge: 'Luxury'
    },
    {
      id: 1,
      name: '2023 Nissan Altima',
      slug: '2023-nissan-altima',
      price: 299.99,
      image: 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=400&h=300&fit=crop',
      rating: 4.4,
      reviewsCount: 128,
      year: 2023,
      mileage: 25000,
      fuelType: 'Gasoline',
      transmission: 'CVT',
      isFeatured: true
    },
    {
      id: 1,
      name: '2022 Lexus RX',
      slug: '2022-lexus-rx',
      price: 299.99,
      comparePrice: 349.99,
      image: 'https://images.unsplash.com/photo-1549317336-206569e8475c?w=400&h=300&fit=crop',
      rating: 4.8,
      reviewsCount: 128,
      year: 2023,
      mileage: 25000,
      fuelType: 'Hybrid',
      transmission: 'Automatic',
      isSale: true
    },
    {
      id: 1,
      name: '2023 Hyundai Elantra',
      slug: '2023-hyundai-elantra',
      price: 299.99,
      image: 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=400&h=300&fit=crop',
      rating: 4.3,
      reviewsCount: 128,
      year: 2023,
      mileage: 25000,
      fuelType: 'Gasoline',
      transmission: 'CVT',
      isNew: true
    },
    {
      id: 1,
      name: '2021 Subaru Outback',
      slug: '2021-subaru-outback',
      price: 299.99,
      comparePrice: 349.99,
      image: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400&h=300&fit=crop',
      rating: 4.5,
      reviewsCount: 128,
      year: 2023,
      mileage: 25000,
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
      price: 299.99,
      comparePrice: 349.99,
      image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=400&h=300&fit=crop',
      rating: 4.8,
      reviewsCount: 128,
      bedrooms: 3,
      bathrooms: 2,
      area: 1800,
      propertyType: 'Condo',
      location: 'Downtown',
      isNew: false,
      badge: 'Featured'
    },
    {
      id: 1,
      name: 'Luxury Family Home',
      slug: 'luxury-family-home',
      price: 299.99,
      image: 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=400&h=300&fit=crop',
      rating: 4.9,
      reviewsCount: 128,
      bedrooms: 3,
      bathrooms: 2,
      area: 1800,
      propertyType: 'House',
      location: 'Suburbs',
      isFeatured: true
    },
    {
      id: 1,
      name: 'Beachfront Villa',
      slug: 'beachfront-villa',
      price: 299.99,
      comparePrice: 349.99,
      image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400&h=300&fit=crop',
      rating: 4.9,
      reviewsCount: 128,
      bedrooms: 3,
      bathrooms: 2,
      area: 1800,
      propertyType: 'Villa',
      location: 'Beachfront',
      isSale: true
    },
    {
      id: 1,
      name: 'Cozy Studio Apartment',
      slug: 'cozy-studio-apartment',
      price: 299.99,
      image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400&h=300&fit=crop',
      rating: 4.5,
      reviewsCount: 128,
      bedrooms: 3,
      bathrooms: 2,
      area: 1800,
      propertyType: 'Studio',
      location: 'City Center',
      isNew: true
    },
    {
      id: 1,
      name: 'Mountain View Cabin',
      slug: 'mountain-view-cabin',
      price: 299.99,
      comparePrice: 349.99,
      image: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=400&h=300&fit=crop',
      rating: 4.7,
      reviewsCount: 128,
      bedrooms: 3,
      bathrooms: 2,
      area: 1800,
      propertyType: 'Cabin',
      location: 'Mountains',
      isSale: true
    },
    {
      id: 1,
      name: 'Historic Townhouse',
      slug: 'historic-townhouse',
      price: 299.99,
      image: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400&h=300&fit=crop',
      rating: 4.6,
      reviewsCount: 128,
      bedrooms: 3,
      bathrooms: 2,
      area: 1800,
      propertyType: 'Townhouse',
      location: 'Historic District',
      isFeatured: true
    },
    {
      id: 1,
      name: 'Modern Loft',
      slug: 'modern-loft',
      price: 299.99,
      image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400&h=300&fit=crop',
      rating: 4.4,
      reviewsCount: 128,
      bedrooms: 3,
      bathrooms: 2,
      area: 1800,
      propertyType: 'Loft',
      location: 'Arts District',
      isNew: true
    },
    {
      id: 1,
      name: 'Garden Apartment',
      slug: 'garden-apartment',
      price: 299.99,
      comparePrice: 349.99,
      image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&h=300&fit=crop',
      rating: 4.3,
      reviewsCount: 128,
      bedrooms: 3,
      bathrooms: 2,
      area: 1800,
      propertyType: 'Apartment',
      location: 'Garden District',
      isSale: true
    },
    {
      id: 1,
      name: 'Penthouse Suite',
      slug: 'penthouse-suite',
      price: 299.99,
      image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=400&h=300&fit=crop',
      rating: 4.9,
      reviewsCount: 128,
      bedrooms: 3,
      bathrooms: 2,
      area: 1800,
      propertyType: 'Penthouse',
      location: 'High Rise',
      isFeatured: true
    },
    {
      id: 1,
      name: 'Country House',
      slug: 'country-house',
      price: 299.99,
      comparePrice: 349.99,
      image: 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=400&h=300&fit=crop',
      rating: 4.7,
      reviewsCount: 128,
      bedrooms: 3,
      bathrooms: 2,
      area: 1800,
      propertyType: 'House',
      location: 'Countryside',
      isSale: true
    },
    {
      id: 1,
      name: 'Waterfront Condo',
      slug: 'waterfront-condo',
      price: 299.99,
      image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=400&h=300&fit=crop',
      rating: 4.8,
      reviewsCount: 128,
      bedrooms: 3,
      bathrooms: 2,
      area: 1800,
      propertyType: 'Condo',
      location: 'Waterfront',
      isNew: true
    },
    {
      id: 1,
      name: 'Duplex Apartment',
      slug: 'duplex-apartment',
      price: 299.99,
      comparePrice: 349.99,
      image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&h=300&fit=crop',
      rating: 4.5,
      reviewsCount: 128,
      bedrooms: 3,
      bathrooms: 2,
      area: 1800,
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
      currentBid: 1200,
      reservePrice: 2000,
      image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=300&fit=crop',
      rating: 4.9,
      reviewsCount: 128,
      endTime: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
      bidCount: 15,
      productName: 'Rolex Submariner',
      sellerName: 'Luxury Timepieces',
      isFeatured: true,
      badge: 'Luxury'
    },
    {
      id: 1,
      name: 'Antique Persian Rug',
      slug: 'antique-persian-rug',
      currentBid: 1200,
      reservePrice: 2000,
      image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop',
      rating: 4.7,
      reviewsCount: 128,
      endTime: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
      bidCount: 15,
      productName: 'Handwoven Persian Rug',
      sellerName: 'Antique Collectors',
      isNew: true
    },
    {
      id: 1,
      name: 'Classic Car Restoration',
      slug: 'classic-car-restoration',
      currentBid: 1200,
      reservePrice: 2000,
      image: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=400&h=300&fit=crop',
      rating: 4.8,
      reviewsCount: 128,
      endTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      bidCount: 15,
      productName: '1967 Ford Mustang',
      sellerName: 'Classic Cars Inc',
      isFeatured: true
    },
    {
      id: 1,
      name: 'Rare Wine Collection',
      slug: 'rare-wine-collection',
      currentBid: 1200,
      image: 'https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?w=400&h=300&fit=crop',
      rating: 4.6,
      reviewsCount: 128,
      endTime: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
      bidCount: 15,
      productName: 'Vintage Wine Set',
      sellerName: 'Wine Collectors',
      isNew: true
    },
    {
      id: 1,
      name: 'Artwork by Local Artist',
      slug: 'artwork-local-artist',
      currentBid: 1200,
      reservePrice: 2000,
      image: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400&h=300&fit=crop',
      rating: 4.4,
      reviewsCount: 128,
      endTime: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(),
      bidCount: 15,
      productName: 'Abstract Painting',
      sellerName: 'Local Gallery',
      isSale: true
    },
    {
      id: 1,
      name: 'Jewelry Set',
      slug: 'jewelry-set',
      currentBid: 1200,
      reservePrice: 2000,
      image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&h=300&fit=crop',
      rating: 4.8,
      reviewsCount: 128,
      endTime: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString(),
      bidCount: 15,
      productName: 'Diamond Jewelry Set',
      sellerName: 'Prestige Jewelers',
      isFeatured: true
    },
    {
      id: 1,
      name: 'Electronics Bundle',
      slug: 'electronics-bundle',
      currentBid: 1200,
      image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400&h=300&fit=crop',
      rating: 4.3,
      reviewsCount: 128,
      endTime: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000).toISOString(),
      bidCount: 15,
      productName: 'Gaming Setup',
      sellerName: 'Tech Deals',
      isNew: true
    },
    {
      id: 1,
      name: 'Furniture Collection',
      slug: 'furniture-collection',
      currentBid: 1200,
      reservePrice: 2000,
      image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop',
      rating: 4.5,
      reviewsCount: 128,
      endTime: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000).toISOString(),
      bidCount: 15,
      productName: 'Living Room Set',
      sellerName: 'Home Decor Plus',
      isSale: true
    },
    {
      id: 1,
      name: 'Sports Memorabilia',
      slug: 'sports-memorabilia',
      currentBid: 1200,
      image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop',
      rating: 4.7,
      reviewsCount: 128,
      endTime: new Date(Date.now() + 9 * 24 * 60 * 60 * 1000).toISOString(),
      bidCount: 15,
      productName: 'Signed Basketball',
      sellerName: 'Sports Collectibles',
      isFeatured: true
    },
    {
      id: 1,
      name: 'Collectible Coins',
      slug: 'collectible-coins',
      currentBid: 1200,
      reservePrice: 2000,
      image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=300&fit=crop',
      rating: 4.6,
      reviewsCount: 128,
      endTime: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(),
      bidCount: 15,
      productName: 'Rare Coin Collection',
      sellerName: 'Numismatics Pro',
      isSale: true
    },
    {
      id: 1,
      name: 'Musical Instrument',
      slug: 'musical-instrument',
      currentBid: 1200,
      image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=300&fit=crop',
      rating: 4.8,
      reviewsCount: 128,
      endTime: new Date(Date.now() + 11 * 24 * 60 * 60 * 1000).toISOString(),
      bidCount: 15,
      productName: 'Vintage Guitar',
      sellerName: 'Music Masters',
      isNew: true
    },
    {
      id: 1,
      name: 'Photography Equipment',
      slug: 'photography-equipment',
      currentBid: 1200,
      reservePrice: 2000,
      image: 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=400&h=300&fit=crop',
      rating: 4.4,
      reviewsCount: 128,
      endTime: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000).toISOString(),
      bidCount: 15,
      productName: 'Camera Kit',
      sellerName: 'Photo Pro Shop',
      isSale: true
    }
  ];

  // Transform API data to match component expectations
  const displayCategories = categories.length > 0 ? categories : mockCategories;

  const displayProducts = featuredProducts.length > 0 ? featuredProducts.map(product => {
    // Safely handle gallery data
    let imageUrl = '/images/placeholder.svg';
    
    try {
      if (product.featured_image) {
        imageUrl = product.featured_image;
      }
      else if (product.thumbnail_image) {
        imageUrl = product.thumbnail_image;
      }
      else if (product.images) {
        // If images is a string, try to parse it
        if (typeof product.images === 'string') {
          const imagesArray = JSON.parse(product.images);
          if (Array.isArray(imagesArray) && imagesArray.length > 0 && imagesArray[0]) {
            imageUrl = imagesArray[0];
          }
        } 
        // If images is already an array
        else if (Array.isArray(product.images) && product.images.length > 0 && product.images[0]) {
          imageUrl = product.images[0];
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
  }) : [];

  // Transform vehicles data
  const displayVehicles = vehicles.length > 0 ? vehicles.slice(0, 12).map(vehicle => {
    // Helper function to safely get first image for vehicles
    const getFirstVehicleImage = (images) => {
      if (!images) return 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=400&h=300&fit=crop';
      if (Array.isArray(images)) return images[0] || 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=400&h=300&fit=crop';
      if (typeof images === 'string') {
        try {
          const parsed = JSON.parse(images);
          return Array.isArray(parsed) && parsed.length > 0 ? parsed[0] : 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=400&h=300&fit=crop';
        } catch (error) {
          return images; // If it's not JSON, return the string as-is
        }
      }
      return 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=400&h=300&fit=crop';
    };

    return {
      id: vehicle.id,
      name: vehicle.title || 'Vehicle',
      slug: vehicle.slug || `vehicle-${vehicle.id}`,
      price: vehicle.price || 0,
      comparePrice: 349.99,
      image: getFirstVehicleImage(vehicle.images),
      rating: 4.5,
      reviewsCount: Math.floor(Math.random() * 50) + 10,
      year: vehicle.year || 2023,
      mileage: vehicle.mileage || Math.floor(Math.random() * 50000) + 10000,
      fuelType: vehicle.fuel_type || 'Gasoline',
      transmission: vehicle.transmission || 'Automatic',
      isNew: Math.random() > 0.7,
      isFeatured: Math.random() > 0.8,
      badge: Math.random() > 0.8 ? 'Premium' : undefined
    };
  }) : [];

  // Transform properties data
  const displayProperties = properties.length > 0 ? properties.slice(0, 12).map(property => {
    // Helper function to safely get first image
    const getFirstImage = (images) => {
      if (!images) return 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=400&h=300&fit=crop';
      if (Array.isArray(images)) return images[0] || 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=400&h=300&fit=crop';
      if (typeof images === 'string') {
        try {
          const parsed = JSON.parse(images);
          return Array.isArray(parsed) && parsed.length > 0 ? parsed[0] : 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=400&h=300&fit=crop';
        } catch {
          return images; // If it's not JSON, return the string as-is
        }
      }
      return 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=400&h=300&fit=crop';
    };

    return {
      id: property.id,
      name: property.title || 'Property',
      slug: property.slug || `property-${property.id}`,
      price: property.price || 0,
      comparePrice: 349.99,
      image: getFirstImage(property.images),
      rating: 4.5,
      reviewsCount: Math.floor(Math.random() * 50) + 10,
      bedrooms: property.bedrooms || Math.floor(Math.random() * 4) + 1,
      bathrooms: property.bathrooms || Math.floor(Math.random() * 3) + 1,
      area: property.area_sqft || Math.floor(Math.random() * 2000) + 800,
      propertyType: property.property_type || 'House',
      location: `${property.city || 'City'}, ${property.state || 'State'}`,
      isNew: Math.random() > 0.7,
      isFeatured: property.is_featured || Math.random() > 0.8,
      badge: Math.random() > 0.8 ? 'Featured' : undefined
    };
  }) : [];

  // Transform auctions data
  const displayAuctions = auctions.length > 0 ? auctions.slice(0, 12).map(auction => {
    // Helper function to safely get first image for auctions
    const getFirstAuctionImage = (images) => {
      if (!images) return 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=300&fit=crop';
      if (Array.isArray(images)) return images[0] || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=300&fit=crop';
      if (typeof images === 'string') {
        try {
          const parsed = JSON.parse(images);
          return Array.isArray(parsed) && parsed.length > 0 ? parsed[0] : 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=300&fit=crop';
        } catch {
          return images;
        }
      }
      return 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=300&fit=crop';
    };

    return {
      id: auction.id,
      name: auction.product_name || 'Auction Item',
      slug: auction.slug || `auction-${auction.id}`,
      currentBid: auction.current_bid || Math.floor(Math.random() * 10000) + 100,
      reservePrice: auction.reserve_price,
      image: getFirstAuctionImage(auction.product_image),
      rating: 4.5,
      reviewsCount: Math.floor(Math.random() * 50) + 10,
      endTime: auction.end_time || new Date(Date.now() + Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
      bidCount: Math.floor(Math.random() * 50) + 5,
      productName: auction.product_name || 'Auction Item',
      sellerName: auction.seller_name || 'Seller',
      isNew: Math.random() > 0.7,
      isFeatured: Math.random() > 0.8,
      badge: Math.random() > 0.8 ? 'Luxury' : undefined
    };
  }) : [];

  return (
    <Layout>
      {/* XpertBid Hero Section */}
      <WoodMartHero />
      
      {/* Categories Section */}
      <WoodMartCategories 
        title="Shop by Category"
        subtitle="Browse our furniture collections"
        categories={[
          {
            id: 1,
            name: 'Living Room',
            slug: 'living-room',
            image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop',
            productCount: 150,
            description: 'Comfortable sofas, chairs, and coffee tables'
          },
          {
            id: 2,
            name: 'Bedroom',
            slug: 'bedroom',
            image: 'https://images.unsplash.com/photo-1555041469-a586c61ea4bc?w=400&h=300&fit=crop',
            productCount: 120,
            description: 'Beds, dressers, and bedroom furniture'
          },
          {
            id: 3,
            name: 'Kitchen',
            slug: 'kitchen',
            image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop',
            productCount: 80,
            description: 'Kitchen cabinets, tables, and storage'
          },
          {
            id: 4,
            name: 'Office',
            slug: 'office',
            image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&h=300&fit=crop',
            productCount: 90,
            description: 'Desks, chairs, and office furniture'
          }
        ]}
        columns={4}
      />
      
      {/* Featured Products */}
        <WoodMartProductGrid 
          title="Featured Products"
          subtitle="Handpicked furniture just for you"
          products={[
            {
              id: 1,
              name: 'Modern Sofa Set',
              slug: 'modern-sofa-set',
              price: 899.99,
              comparePrice: 1099.99,
              image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=400&fit=crop',
              badge: 'Sale',
              badgeColor: 'primary',
              rating: 4.8,
              reviewsCount: 128,
              isNew: false,
              isSale: true,
              isFeatured: true
            },
            {
              id: 2,
              name: 'Oak Dining Table',
              slug: 'oak-dining-table',
              price: 599.99,
              image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=400&fit=crop',
              badge: 'New',
              badgeColor: 'success',
              rating: 4.6,
              reviewsCount: 95,
              isNew: true,
              isSale: false,
              isFeatured: true
            },
            {
              id: 3,
              name: 'Comfortable Armchair',
              slug: 'comfortable-armchair',
              price: 399.99,
              comparePrice: 499.99,
              image: 'https://images.unsplash.com/photo-1555041469-a586c61ea4bc?w=400&h=400&fit=crop',
              badge: 'Sale',
              badgeColor: 'primary',
              rating: 4.7,
              reviewsCount: 87,
              isNew: false,
              isSale: true,
              isFeatured: true
            },
            {
              id: 4,
              name: 'Modern Coffee Table',
              slug: 'modern-coffee-table',
              price: 299.99,
              image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=400&fit=crop',
              badge: 'Featured',
              badgeColor: 'warning',
              rating: 4.5,
              reviewsCount: 156,
              isNew: false,
              isSale: false,
              isFeatured: true
            },
            {
              id: 5,
              name: 'Executive Desk',
              slug: 'executive-desk',
              price: 799.99,
              image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&h=400&fit=crop',
              badge: 'New',
              badgeColor: 'success',
              rating: 4.9,
              reviewsCount: 203,
              isNew: true,
              isSale: false,
              isFeatured: true
            },
            {
              id: 6,
              name: 'Luxury Bed Frame',
              slug: 'luxury-bed-frame',
              price: 1299.99,
              comparePrice: 1599.99,
              image: 'https://images.unsplash.com/photo-1555041469-a586c61ea4bc?w=400&h=400&fit=crop',
              badge: 'Sale',
              badgeColor: 'primary',
              rating: 4.8,
              reviewsCount: 142,
              isNew: false,
              isSale: true,
              isFeatured: true
            },
            {
              id: 7,
              name: 'Storage Cabinet',
              slug: 'storage-cabinet',
              price: 449.99,
              image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=400&fit=crop',
              badge: 'Featured',
              badgeColor: 'warning',
              rating: 4.4,
              reviewsCount: 78,
              isNew: false,
              isSale: false,
              isFeatured: true
            },
            {
              id: 8,
              name: 'Modern Bookshelf',
              slug: 'modern-bookshelf',
              price: 349.99,
              comparePrice: 429.99,
              image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=400&fit=crop',
              badge: 'Sale',
              badgeColor: 'primary',
              rating: 4.6,
              reviewsCount: 91,
              isNew: false,
              isSale: true,
              isFeatured: true
            }
          ]}
          columns={4}
          showViewAll={true}
          viewAllLink="/shop"
        />
      
      {/* Blog Section */}
      <BlogSection />
      
      {/* Newsletter Section */}
      <WoodMartNewsletter />
      
    </Layout>
  );
}

