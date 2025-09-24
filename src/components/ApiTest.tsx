'use client';

import React, { useState, useEffect } from 'react';
import { apiService } from '@/services/api';
import { Product, Category } from '@/types';

export default function ApiTest() {
  const [apiStatus, setApiStatus] = useState<'checking' | 'connected' | 'error'>('checking');
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    const testApi = async () => {
      try {
        // Test health check
        const healthResponse = await apiService.healthCheck();
        if (healthResponse.success) {
          setApiStatus('connected');
          
          // Fetch sample data
          const [productsResponse, categoriesResponse] = await Promise.all([
            apiService.getProducts({ limit: 3 }),
            apiService.getCategories()
          ]);
          
          if (productsResponse.success) {
            setProducts(productsResponse.data);
          }
          
          if (categoriesResponse.success) {
            setCategories(categoriesResponse.data);
          }
        } else {
          setApiStatus('error');
        }
      } catch (error) {
        console.error('API test failed:', error);
        setApiStatus('error');
      }
    };

    testApi();
  }, []);

  return (
    <div className="api-test-component p-4 border rounded mb-4">
      <h4>API Connection Test</h4>
      
      <div className="mb-3">
        <strong>Status: </strong>
        <span className={`badge ${
          apiStatus === 'connected' ? 'bg-success' : 
          apiStatus === 'error' ? 'bg-danger' : 'bg-warning'
        }`}>
          {apiStatus === 'connected' ? 'Connected' : 
           apiStatus === 'error' ? 'Error' : 'Checking...'}
        </span>
      </div>

      {apiStatus === 'connected' && (
        <div>
          <div className="mb-3">
            <strong>Categories ({categories.length}):</strong>
            <ul className="list-unstyled">
              {categories.slice(0, 3).map(category => (
                <li key={category.id} className="ms-3">
                  • {category.name} ({category.slug})
                </li>
              ))}
            </ul>
          </div>

          <div className="mb-3">
            <strong>Products ({products.length}):</strong>
            <ul className="list-unstyled">
              {products.slice(0, 3).map(product => (
                <li key={product.id} className="ms-3">
                  • {product.name} - ${product.price} ({product.sku})
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {apiStatus === 'error' && (
        <div className="text-danger">
          <p>Failed to connect to API. Make sure the Laravel backend is running on http://localhost:8000</p>
          <p>Run: <code>cd backend && php artisan serve</code></p>
        </div>
      )}
    </div>
  );
}