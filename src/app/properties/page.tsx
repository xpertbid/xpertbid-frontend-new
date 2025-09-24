'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Layout from '@/components/Layout';
import WoodMartProperties from '@/components/sections/WoodMartProperties';
import { Property } from '@/types';

export default function PropertiesPage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        setLoading(true);
        
        const propertiesResponse = await import('@/services/api').then(module => 
          module.apiService.getProperties()
        );
        
        if (propertiesResponse.success) {
          setProperties(propertiesResponse.data);
        }
      } catch (err) {
        console.error('Error fetching properties:', err);
        setError('Failed to load properties. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, []);

  // Transform API data to match component expectations
  const displayProperties = properties.map(property => ({
    id: property.id,
    name: property.title || 'Property',
    slug: property.slug || `property-${property.id}`,
    price: property.price || 0,
    comparePrice: undefined,
    image: property.images?.[0] || 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=400&h=300&fit=crop',
    rating: 4.5,
    reviewsCount: Math.floor(Math.random() * 50) + 10,
    bedrooms: property.bedrooms || Math.floor(Math.random() * 4) + 1,
    bathrooms: property.bathrooms || Math.floor(Math.random() * 3) + 1,
    area: property.area || Math.floor(Math.random() * 2000) + 800,
    propertyType: property.type || 'House',
    location: property.location || 'City',
    isNew: Math.random() > 0.7,
    isFeatured: Math.random() > 0.8,
    badge: Math.random() > 0.8 ? 'Featured' : undefined
  }));

  if (loading) {
    return (
      <Layout>
        <div className="container py-5">
          <div className="text-center">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-3">Loading properties...</p>
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
      {/* Properties Header */}
      <div className="container py-4">
        <div className="row">
          <div className="col-12">
            <nav aria-label="breadcrumb">
              <ol className="breadcrumb">
                <li className="breadcrumb-item">
                  <Link href="/" className="text-decoration-none">Home</Link>
                </li>
                <li className="breadcrumb-item active" aria-current="page">Properties</li>
              </ol>
            </nav>
          </div>
        </div>
      </div>

      {/* All Properties */}
      <WoodMartProperties 
        title="All Properties"
        subtitle="Find your dream home"
        properties={displayProperties}
        columns={4}
        showViewAll={false}
      />
    </Layout>
  );
}
