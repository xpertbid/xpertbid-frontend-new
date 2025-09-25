'use client';

import React, { useEffect, useState } from 'react';
import Layout from '@/components/Layout';
import WoodMartHero from '@/components/sections/WoodMartHero';
import WoodMartCategories from '@/components/sections/WoodMartCategories';
import WoodMartProductGrid from '@/components/sections/WoodMartProductGrid';
import WoodMartVehicles from '@/components/sections/WoodMartVehicles';
import WoodMartProperties from '@/components/sections/WoodMartProperties';
import WoodMartAuctions from '@/components/sections/WoodMartAuctions';
// import WoodMartNewsletter from '@/components/sections/WoodMartNewsletter';
import BlogSection from '@/components/sections/BlogSection';
import { apiService } from '@/services/api';
import { Product, Category, Vehicle, Property, Auction } from '@/types';

export default function Home() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [properties, setProperties] = useState<Property[]>([]);
  const [auctions, setAuctions] = useState<Auction[]>([]);

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
          setFeaturedProducts(mockFeaturedProducts as unknown as Product[]);
        }

        if (vehiclesResponse.success && vehiclesResponse.data.length > 0) {
          setVehicles(vehiclesResponse.data.slice(0, 12));
        } else {
          setVehicles(mockVehicles as unknown as Vehicle[]);
        }

        if (propertiesResponse.success && propertiesResponse.data.length > 0) {
          setProperties(propertiesResponse.data.slice(0, 12));
        } else {
          setProperties(mockProperties as unknown as Property[]);
        }

        if (auctionsResponse.success && auctionsResponse.data.length > 0) {
          setAuctions(auctionsResponse.data.slice(0, 12));
        } else {
          setAuctions(mockAuctions as unknown as Auction[]);
        }
      } catch (err) {
        console.error('Error fetching data, using mock data:', err);
        console.error('Error details:', {
          message: err instanceof Error ? err.message : 'Unknown error',
          stack: err instanceof Error ? err.stack : undefined,
          name: err instanceof Error ? err.name : undefined
        });
        // Use mock data as fallback
        setCategories(mockCategories);
        setFeaturedProducts(mockFeaturedProducts as unknown as Product[]);
        setVehicles(mockVehicles as unknown as Vehicle[]);
        setProperties(mockProperties as unknown as Property[]);
        setAuctions(mockAuctions as unknown as Auction[]);
      }
    };

    fetchData();
  }, []);

  // Fallback mock data for demonstration if API fails
  const mockCategories = [
    {
      id: 1,
      tenant_id: 1,
      parent_id: undefined,
      level: 1,
      path: 'electronics',
      name: 'Electronics',
      slug: 'electronics',
      description: 'Latest electronics and gadgets',
      image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400&h=300&fit=crop',
      banner_image: undefined,
      icon: 'electronics',
      color: '#3B82F6',
      sort_order: 1,
      is_active: true,
      is_featured: true,
      status: 1,
      language: 'en',
      translation_group: undefined,
      seo_meta: undefined,
      seo_title: undefined,
      seo_description: undefined,
      seo_keywords: undefined,
      canonical_url: undefined,
      commission_rate: undefined,
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z'
    },
    {
      id: 2,
      tenant_id: 1,
      parent_id: 1,
      level: 2,
      path: 'electronics/smartphones',
      name: 'Smartphones',
      slug: 'smartphones',
      description: 'Top smartphone brands and models',
      image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=300&fit=crop',
      banner_image: undefined,
      icon: 'smartphone',
      color: '#10B981',
      sort_order: 2,
      is_active: true,
      is_featured: true,
      status: 1,
      language: 'en',
      translation_group: undefined,
      seo_meta: undefined,
      seo_title: undefined,
      seo_description: undefined,
      seo_keywords: undefined,
      canonical_url: undefined,
      commission_rate: undefined,
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z'
    },
    {
      id: 3,
      tenant_id: 1,
      parent_id: 1,
      level: 2,
      path: 'electronics/laptops',
      name: 'Laptops',
      slug: 'laptops',
      description: 'High-performance laptops for work and gaming',
      image: 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=400&h=300&fit=crop',
      banner_image: undefined,
      icon: 'laptop',
      color: '#F59E0B',
      sort_order: 3,
      is_active: true,
      is_featured: true,
      status: 1,
      language: 'en',
      translation_group: undefined,
      seo_meta: undefined,
      seo_title: undefined,
      seo_description: undefined,
      seo_keywords: undefined,
      canonical_url: undefined,
      commission_rate: undefined,
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z'
    },
    {
      id: 4,
      tenant_id: 1,
      parent_id: undefined,
      level: 1,
      path: 'fashion',
      name: 'Fashion',
      slug: 'fashion',
      description: 'Trendy fashion and clothing',
      image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=300&fit=crop',
      banner_image: undefined,
      icon: 'fashion',
      color: '#EF4444',
      sort_order: 4,
      is_active: true,
      is_featured: true,
      status: 1,
      language: 'en',
      translation_group: undefined,
      seo_meta: undefined,
      seo_title: undefined,
      seo_description: undefined,
      seo_keywords: undefined,
      canonical_url: undefined,
      commission_rate: undefined,
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
      price: 999,
      sale_price: 1199,
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
      id: 2,
      name: 'MacBook Pro 16-inch',
      slug: 'macbook-pro-16',
      description: 'Powerful laptop for professionals and creators',
      short_description: 'Professional laptop for creators',
      price: 2499,
      sale_price: undefined,
      sku: 'MBP16-001',
      stock_quantity: 25,
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
      id: 3,
      name: 'Samsung Galaxy S24 Ultra',
      slug: 'samsung-galaxy-s24-ultra',
      description: 'Latest Android smartphone with advanced camera system',
      short_description: 'Latest Android smartphone',
      price: 1199,
      sale_price: 1299,
      sku: 'SGS24U-001',
      stock_quantity: 75,
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
        // If images is a string, try to parse it as JSON
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
  }) : mockFeaturedProducts;

  // Transform vehicles data
  const displayVehicles = vehicles.length > 0 ? vehicles.slice(0, 12).map(vehicle => {
    // Helper function to safely get first image for vehicles
    const getFirstVehicleImage = (images: string | string[] | undefined): string => {
      if (!images) return 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=400&h=300&fit=crop';
      if (Array.isArray(images)) return images[0] || 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=400&h=300&fit=crop';
      if (typeof images === 'string') {
        try {
          const parsed = JSON.parse(images);
          return Array.isArray(parsed) && parsed.length > 0 ? parsed[0] : 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=400&h=300&fit=crop';
        } catch {
          return images; // If it's not JSON, treat as single URL
        }
      }
      return 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=400&h=300&fit=crop';
    };

    return {
      id: vehicle.id,
      name: vehicle.title || 'Vehicle',
      slug: vehicle.slug || `vehicle-${vehicle.id}`,
      price: vehicle.price || 0,
      comparePrice: undefined,
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
  }) : mockVehicles;

  // Transform properties data
  const displayProperties = properties.length > 0 ? properties.slice(0, 12).map(property => {
    // Helper function to safely get first image
    const getFirstImage = (images: string | string[] | undefined): string => {
      if (!images) return 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=400&h=300&fit=crop';
      if (Array.isArray(images)) return images[0] || 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=400&h=300&fit=crop';
      if (typeof images === 'string') {
        try {
          const parsed = JSON.parse(images);
          return Array.isArray(parsed) && parsed.length > 0 ? parsed[0] : 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=400&h=300&fit=crop';
        } catch {
          return images; // If it's not JSON, treat as single URL
        }
      }
      return 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=400&h=300&fit=crop';
    };

    return {
      id: property.id,
      name: property.title || 'Property',
      slug: property.slug || `property-${property.id}`,
      price: property.price || 0,
      comparePrice: undefined,
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
  }) : mockProperties;

  // Transform auctions data
  const displayAuctions = auctions.length > 0 ? auctions.slice(0, 12).map(auction => {
    // Helper function to safely get first image for auctions
    const getFirstAuctionImage = (images: string | string[] | undefined): string => {
      if (!images) return 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=300&fit=crop';
      if (Array.isArray(images)) return images[0] || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=300&fit=crop';
      if (typeof images === 'string') {
        try {
          const parsed = JSON.parse(images);
          return Array.isArray(parsed) && parsed.length > 0 ? parsed[0] : 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=300&fit=crop';
        } catch {
          return images; // If it's not JSON, treat as single URL
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
  }) : mockAuctions;

  return (
    <Layout>
      {/* XpertBid Hero Section */}
      <WoodMartHero />
      
      {/* Categories Section */}
      <WoodMartCategories 
        title="Shop by Category"
        subtitle="Browse our collections"
        categories={displayCategories.map(cat => ({
          id: cat.id,
          name: cat.name,
          slug: cat.slug,
          image: cat.image,
          productCount: Math.floor(Math.random() * 200) + 50, // Mock product count
          description: cat.description
        }))}
        columns={4}
      />
      
      {/* Featured Products */}
        <WoodMartProductGrid 
          title="Featured Products"
          subtitle="Handpicked items just for you"
          products={displayProducts.map(product => ({
            id: product.id,
            name: product.name,
            slug: product.slug,
            price: product.price,
            comparePrice: 'sale_price' in product && product.sale_price && product.sale_price > product.price ? product.sale_price : undefined,
            image: 'images' in product && product.images && Array.isArray(product.images) && product.images.length > 0 ? product.images[0] : '/images/placeholder.svg',
            badge: 'is_featured' in product && product.is_featured ? 'Featured' : undefined,
            badgeColor: 'is_featured' in product && product.is_featured ? 'primary' : undefined,
            rating: Math.random() * 5, // Mock rating
            reviewsCount: Math.floor(Math.random() * 200), // Mock reviews count
            isNew: false, // Example logic
            isSale: 'sale_price' in product && product.sale_price !== undefined && product.sale_price < product.price,
            isFeatured: 'is_featured' in product ? product.is_featured : false
          }))}
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
      
      {/* Blog Section */}
      <BlogSection />
      
      {/* Newsletter Section */}
      
    </Layout>
  );
}