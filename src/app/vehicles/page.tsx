'use client';

import React, { useEffect, useState } from 'react';
import Layout from '@/components/Layout';
import WoodMartVehicles from '@/components/sections/WoodMartVehicles';

export default function VehiclesPage() {
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        setLoading(true);
        
        const vehiclesResponse = await import('@/services/api').then(module => 
          module.apiService.getVehicles()
        );
        
        if (vehiclesResponse.success) {
          setVehicles(vehiclesResponse.data);
        }
      } catch (err) {
        console.error('Error fetching vehicles:', err);
        setError('Failed to load vehicles. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchVehicles();
  }, []);

  // Transform API data to match component expectations
  const displayVehicles = vehicles.map(vehicle => ({
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
  }));

  if (loading) {
    return (
      <Layout>
        <div className="container py-5">
          <div className="text-center">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-3">Loading vehicles...</p>
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
      {/* Vehicles Header */}
      <div className="container py-4">
        <div className="row">
          <div className="col-12">
            <nav aria-label="breadcrumb">
              <ol className="breadcrumb">
                <li className="breadcrumb-item">
                  <a href="/" className="text-decoration-none">Home</a>
                </li>
                <li className="breadcrumb-item active" aria-current="page">Vehicles</li>
              </ol>
            </nav>
          </div>
        </div>
      </div>

      {/* All Vehicles */}
      <WoodMartVehicles 
        title="All Vehicles"
        subtitle="Find your perfect ride"
        vehicles={displayVehicles}
        columns={4}
        showViewAll={false}
      />
    </Layout>
  );
}
