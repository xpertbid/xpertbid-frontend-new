'use client';

import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import { useAuth } from '@/contexts/AuthContext';
// import { useCurrency } from '@/contexts/CurrencyLanguageContext';
import { apiService } from '@/services/api';
import Link from 'next/link';
import Image from 'next/image';
import PriceDisplay from '@/components/PriceDisplay';



export default function VendorDashboardPage() {
  const { user, isAuthenticated } = useAuth();
  const [vendor, setVendor] = useState(null);
  const [stats, setStats] = useState(null);
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    if (isAuthenticated && user) {
      loadVendorData();
    }
  }, [isAuthenticated, user]);

  const loadVendorData = async () => {
    try {
      setLoading(true);
      
      // Load vendor profile
      const vendorResponse = await apiService.getVendorProfile();
      if (vendorResponse.success) {
        setVendor(vendorResponse.data);
      }

      // Load vendor dashboard data
      const dashboardResponse = await apiService.getVendorDashboard();
      if (dashboardResponse.success) {
        setDashboardData(dashboardResponse.data);
        setStats(dashboardResponse.data.stats);
      }
    } catch (error) {
      console.error('Error loading vendor data:', error);
      setError('Failed to load vendor data');
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <Layout>
        <div className="container py-5">
          <div className="row justify-content-center">
            <div className="col-md-6">
              <div className="text-center">
                <h2>Please Login</h2>
                <p>You need to be logged in to access the vendor dashboard.</p>
                <Link href="/login" className="btn btn-primary">
                  Go to Login
                </Link>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (loading) {
    return (
      <Layout>
        <div className="container py-5">
          <div className="text-center">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-3">Loading vendor dashboard...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (error || !vendor) {
    return (
      <Layout>
        <div className="container py-5">
          <div className="text-center">
            <div className="alert alert-warning" role="alert">
              <h4>No Vendor Account Found</h4>
              <p>You don&apos;t have a vendor account yet. Would you like to register ?</p>
              <Link href="/vendor/register" className="btn btn-primary">
                Become a Vendor
              </Link>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="vendor-dashboard-page">
        {/* Dashboard Header */}
        <div className="dashboard-header bg-light py-4">
          <div className="container">
            <div className="row align-items-center">
              <div className="col-md-8">
                <div className="d-flex align-items-center">
                  <div className="store-logo me-3">
                    {vendor.store_logo ? (
                      <Image 
                        src={vendor.store_logo} 
                        alt={vendor.store_name} 
                        width={60} 
                        height={60} 
                        className="rounded"
                      />
                    ) : (
                      <div className="logo-placeholder">
                        <i className="f-store"></i>
                      </div>
                    )}
                  </div>
                  <div>
                    <h2 className="mb-1">{vendor.store_name}</h2>
                    <p className="text-muted mb-0">{vendor.business_name}</p>
                    <div className="vendor-badges">
                      <span className={`badge bg-${vendor.status === 'approved' ? 'success' : 'warning'} me-2`}>
                        {vendor.status}
                      </span>
                      <span className={`badge bg-${vendor.tier === 'platinum' ? 'dark' : vendor.tier === 'gold' ? 'warning' : 'info'}`}>
                        {vendor.tier} tier
                      </span>
                      {vendor.verified && (
                        <span className="badge bg-primary ms-2">
                          <i className="f-check-circle me-1"></i>
                          Verified
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-md-4 text-end">
                <div className="dashboard-actions">
                  <Link href="/vendor/profile" className="btn btn-outline-primary me-2">
                    <i className="f-edit me-1"></i>
                    Edit Store
                  </Link>
                  <Link href="/vendor/products" className="btn btn-outline-secondary">
                    <i className="f-box me-1"></i>
                    Products
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="container py-4">
          {/* Navigation Tabs */}
          <div className="dashboard-nav mb-4">
            <nav className="nav nav-pills">
              <button 
                className={`nav-link ${activeTab === 'overview' ? 'active' : ''}`}
                onClick={() => setActiveTab('overview')}
              >
                <i className="f-chart-pie me-2"></i>
                Overview
              </button>
              <button 
                className={`nav-link ${activeTab === 'products' ? 'active' : ''}`}
                onClick={() => setActiveTab('products')}
              >
                <i className="f-box me-2"></i>
                Products
              </button>
              <button 
                className={`nav-link ${activeTab === 'orders' ? 'active' : ''}`}
                onClick={() => setActiveTab('orders')}
              >
                <i className="f-shopping-bag me-2"></i>
                Orders
              </button>
              <button 
                className={`nav-link ${activeTab === 'analytics' ? 'active' : ''}`}
                onClick={() => setActiveTab('analytics')}
              >
                <i className="f-chart-line me-2"></i>
                Analytics
              </button>
            </nav>
          </div>

          {/* Tab Content */}
          {activeTab === 'overview' && (
            <div className="dashboard-overview">
              {/* Stats Cards */}
              <div className="row mb-4">
                <div className="col-md-3 mb-3">
                  <div className="stat-card">
                    <div className="stat-icon">
                      <i className="f-box"></i>
                    </div>
                    <div className="stat-content">
                      <h3>{stats?.total_products || 0}</h3>
                      <p>Total Products</p>
                    </div>
                  </div>
                </div>
                <div className="col-md-3 mb-3">
                  <div className="stat-card">
                    <div className="stat-icon">
                      <i className="f-shopping-bag"></i>
                    </div>
                    <div className="stat-content">
                      <h3>{stats?.total_orders || 0}</h3>
                      <p>Total Orders</p>
                    </div>
                  </div>
                </div>
                <div className="col-md-3 mb-3">
                  <div className="stat-card">
                    <div className="stat-icon">
                      <i className="f-dollar-sign"></i>
                    </div>
                    <div className="stat-content">
                      <PriceDisplay 
                        amount={stats?.total_revenue || 0} 
                        className="revenue-amount"
                        fromCurrency="USD"
                      />
                      <p>Total Revenue</p>
                    </div>
                  </div>
                </div>
                <div className="col-md-3 mb-3">
                  <div className="stat-card">
                    <div className="stat-icon">
                      <i className="f-clock"></i>
                    </div>
                    <div className="stat-content">
                      <h3>{stats?.pending_orders || 0}</h3>
                      <p>Pending Orders</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Recent Activity */}
              <div className="row">
                <div className="col-md-8">
                  <div className="dashboard-card">
                    <div className="card-header">
                      <h5><i className="f-clock me-2"></i>Recent Orders</h5>
                    </div>
                    <div className="card-body">
                      {dashboardData?.recent_orders?.length ? (
                        <div className="recent-items">
                          {dashboardData.recent_orders.map((order) => (
                            <div key={order.id} className="recent-item">
                              <div className="item-info">
                                <h6>Order #{order.order_number}</h6>
                                <p className="text-muted mb-1">
                                  {new Date(order.created_at).toLocaleDateString()}
                                </p>
                              </div>
                              <div className="item-status">
                                <span className={`badge bg-${order.status === 'completed' ? 'success' : 'warning'}`}>
                                  {order.status}
                                </span>
                                <PriceDisplay 
                                  amount={order.total_amount} 
                                  fromCurrency="USD"
                                  className="fw-bold mb-0"
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-4">
                          <i className="f-shopping-bag fa-3x text-muted mb-3"></i>
                          <p className="text-muted">No orders yet</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="col-md-4">
                  <div className="dashboard-card">
                    <div className="card-header">
                      <h6><i className="f-exclamation-triangle me-2"></i>Low Stock</h6>
                    </div>
                    <div className="card-body">
                      {dashboardData?.low_stock_products?.length ? (
                        <div className="low-stock-items">
                          {dashboardData.low_stock_products.map((product) => (
                            <div key={product.id} className="low-stock-item">
                              <h6>{product.name}</h6>
                              <p className="text-danger mb-0">
                                Only {product.stock_quantity} left
                              </p>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-3">
                          <i className="f-check-circle fa-2x text-success mb-2"></i>
                          <p className="text-muted small mb-0">All products in stock</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'products' && (
            <div className="dashboard-products">
              <div className="dashboard-card">
                <div className="card-header d-flex justify-content-between align-items-center">
                  <h5><i className="f-box me-2"></i>Product Management</h5>
                  <Link href="/vendor/products/add" className="btn btn-primary btn-sm">
                    <i className="f-plus me-1"></i>
                    Add Product
                  </Link>
                </div>
                <div className="card-body">
                  <div className="text-center py-5">
                    <i className="f-box fa-3x text-muted mb-3"></i>
                    <h5>Product Management</h5>
                    <p className="text-muted">Add, edit, and manage all your products in one place.</p>
                    <Link href="/vendor/products" className="btn btn-primary">
                      Manage Products
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'orders' && (
            <div className="dashboard-orders">
              <div className="dashboard-card">
                <div className="card-header d-flex justify-content-between align-items-center">
                  <h5><i className="f-shopping-bag me-2"></i>Order Management</h5>
                  <Link href="/vendor/orders" className="btn btn-outline-primary btn-sm">
                    View All Orders
                  </Link>
                </div>
                <div className="card-body">
                  <div className="text-center py-5">
                    <i className="f-shopping-bag fa-3x text-muted mb-3"></i>
                    <h5>Order Management</h5>
                    <p className="text-muted">Process and manage all your customer orders.</p>
                    <Link href="/vendor/orders" className="btn btn-primary">
                      View Orders
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'analytics' && (
            <div className="dashboard-analytics">
              <div className="dashboard-card">
                <div className="card-header">
                  <h5><i className="f-chart-line me-2"></i>Analytics & Reports</h5>
                </div>
                <div className="card-body">
                  <div className="text-center py-5">
                    <i className="f-chart-line fa-3x text-muted mb-3"></i>
                    <h5>Analytics Coming Soon</h5>
                    <p className="text-muted">Get detailed insights into your store performance.</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <style jsx>{`
          .vendor-dashboard-page {
            min-height: 100vh;
            background-color: #f8f9fa;
          }

          .dashboard-header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
          }

          .store-logo {
            position: relative;
          }

          .logo-placeholder {
            width: 60px;
            height: 60px;
            background: rgba(255, 255, 255, 0.2);
            border-radius: var(--border-radius-lg);
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 24px;
            color: white;
          }

          .vendor-badges {
            margin-top: 0.5rem;
          }

          .dashboard-nav .nav-pills .nav-link {
            color: var(--secondary-color);
            border-radius: var(--border-radius-lg);
            margin-right: 0.5rem;
            font-weight: 500;
            transition: all 0.3s ease;
          }

          .dashboard-nav .nav-pills .nav-link:hover {
            background-color: var(--gray-100);
            color: var(--primary-color);
          }

          .dashboard-nav .nav-pills .nav-link.active {
            background-color: var(--primary-color);
            color: white;
          }

          .stat-card {
            background: white;
            border-radius: var(--border-radius-lg);
            padding: 1.5rem;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
            display: flex;
            align-items: center;
            transition: transform 0.3s ease;
          }

          .stat-card:hover {
            transform: translateY(-2px);
          }

          .stat-icon {
            width: 50px;
            height: 50px;
            background: var(--primary-color);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-size: 20px;
            margin-right: 1rem;
          }

          .stat-content h3 {
            font-size: 2rem;
            font-weight: 700;
            color: var(--secondary-color);
            margin-bottom: 0.25rem;
          }

          .stat-content p {
            color: var(--gray-600);
            margin-bottom: 0;
            font-weight: 500;
          }

          .dashboard-card {
            background: white;
            border-radius: var(--border-radius-lg);
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
            overflow: hidden;
          }

          .dashboard-card .card-header {
            background: var(--gray-50);
            border-bottom: 1px solid var(--gray-200);
            padding: 1rem 1.5rem;
            margin: 0;
          }

          .dashboard-card .card-header h5 {
            margin: 0;
            color: var(--secondary-color);
            font-weight: 600;
          }

          .dashboard-card .card-header h6 {
            margin: 0;
            color: var(--secondary-color);
            font-weight: 600;
          }

          .dashboard-card .card-body {
            padding: 1.5rem;
          }

          .recent-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 1rem 0;
            border-bottom: 1px solid var(--gray-200);
          }

          .recent-item:last-child {
            border-bottom: none;
          }

          .item-info h6 {
            margin-bottom: 0.25rem;
            color: var(--secondary-color);
            font-weight: 600;
          }

          .item-status {
            text-align: right;
          }

          .low-stock-item {
            padding: 0.75rem 0;
            border-bottom: 1px solid var(--gray-200);
          }

          .low-stock-item:last-child {
            border-bottom: none;
          }

          .low-stock-item h6 {
            margin-bottom: 0.25rem;
            color: var(--secondary-color);
            font-weight: 600;
            font-size: 0.9rem;
          }

          .dashboard-actions .btn {
            border-radius: var(--border-radius-lg);
            font-weight: 500;
          }

          @media (max-width: 768px) {
            .dashboard-header .row {
              text-align: center;
            }

            .dashboard-actions {
              margin-top: 1rem;
            }

            .stat-card {
              flex-direction: column;
              text-align: center;
            }

            .stat-icon {
              margin-right: 0;
              margin-bottom: 1rem;
            }
          }
        `}</style>
      </div>
    </Layout>
  );
};

