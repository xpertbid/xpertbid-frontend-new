'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Layout from '@/components/Layout';
import WoodMartProductGrid from '@/components/sections/WoodMartProductGrid';
import { apiService } from '@/services/api';
import { Product } from '@/types';

interface CategoryPageProps {
  params: {
    slug: string;
  };
}

export default function CategoryPage({ params }: CategoryPageProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [categoryName, setCategoryName] = useState('');

  useEffect(() => {
    const fetchCategoryProducts = async () => {
      try {
        setLoading(true);
        
        // Get all products first, then filter by category
        const productsResponse = await apiService.getProducts();
        
        if (productsResponse.success) {
          // Filter products by category slug
          const categoryProducts = productsResponse.data.filter(product => 
            product.category_name && 
            product.category_name.toLowerCase().replace(/\s+/g, '-') === params.slug
          );
          
          setProducts(categoryProducts);
          setCategoryName(categoryProducts[0]?.category_name || params.slug);
        }
      } catch (err) {
        console.error('Error fetching category products:', err);
        setError('Failed to load products. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryProducts();
  }, [params.slug]);

  // Transform API data to match component expectations
  const displayProducts = products.map(product => {
    // Safely handle gallery data
    let imageUrl = 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400&h=400&fit=crop';
    
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
      imageUrl = 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400&h=400&fit=crop';
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
  });

  if (loading) {
    return (
      <Layout>
        <div className="container py-5">
          <div className="text-center">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-3">Loading products...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="container py-5">
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Category Header */}
      <div className="container py-4">
        <div className="row">
          <div className="col-12">
            <nav aria-label="breadcrumb">
              <ol className="breadcrumb">
                <li className="breadcrumb-item">
                  <Link href="/" className="text-decoration-none">Home</Link>
                </li>
                <li className="breadcrumb-item">
                  <Link href="/shop" className="text-decoration-none">Shop</Link>
                </li>
                <li className="breadcrumb-item active" aria-current="page">
                  {categoryName}
                </li>
              </ol>
            </nav>
          </div>
        </div>
      </div>

      {/* Category Products */}
      <WoodMartProductGrid 
        title={`${categoryName} Products`}
        subtitle={`Browse our ${categoryName.toLowerCase()} collection`}
        products={displayProducts}
        columns={4}
        showViewAll={false}
      />
    </Layout>
  );
}
