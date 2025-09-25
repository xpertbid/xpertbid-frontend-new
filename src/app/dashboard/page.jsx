'use client';

import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import { useAuth } from '@/contexts/AuthContext';
import { useCurrency } from '@/contexts/CurrencyLanguageContext';
import { apiService } from '@/services/api';
import Link from 'next/link';
import Image from 'next/image';



export default function DashboardPage() {
  const { user, isAuthenticated } = useAuth();
  const { formatPrice } = useCurrency();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    if (isAuthenticated && user) {
      loadDashboardData();
    }
  }, [isAuthenticated, user]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      // Load user's orders
      const ordersResponse = await apiService.getUserOrders();   
      const orders = ordersResponse.success ? ordersResponse.data : [];  

      // Load user's bids
      const bidsResponse = await apiService.getUserBids();       
      const bids = bidsResponse.success ? bidsResponse.data : [];
      
      // Calculate stats
      const totalOrders = orders.length;
      const totalSpent = orders.reduce((sum, order) => sum + (order.total_amount || 0), 0);
      const totalBids = bids.length;
      const totalWins = bids.filter((bid) => bid.auction_status === 'won').length;
      
      setStats({
        totalOrders,
        totalSpent,
        totalBids,
        totalWins,
        recentOrders: orders.slice(0, 5),
        recentBids: bids.slice(0, 5)
      });
    } catch (error) {
      console.error('Error loading dashboard data:', error);
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
                <p>You need to be logged in to access your dashboard.</p>
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
            <p className="mt-3">Loading your dashboard...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="dashboard-page">
        {/* Dashboard Header */}
        <div className="dashboard-header bg-light py-4">
          <div className="container">
            <div className="row align-items-center">
              <div className="col-md-8">
                <div className="d-flex align-items-center">
                  <div className="user-avatar me-3">
                    {user?.avatar ? (
                      <Image 
                        src={user.avatar} 
                        alt={user.name} 
                        width={60} 
                        height={60} 
                        className="rounded-circle"
                      />
                    ) : (
                      <div className="avatar-placeholder">
                        <i className="f-user"></i>
                      </div>
                    )}
                  </div>
                  <div>
                    <h2 className="mb-1">Welcome back, {user?.name}!</h2>
                    <p className="text-muted mb-0">{user?.email}</p>
                  </div>
                </div>
              </div>
              <div className="col-md-4 text-end">
                <div className="dashboard-actions">
                  <Link href="/dashboard/profile" className="btn btn-outline-primary me-2">
                    <i className="f-user-edit me-1"></i>
                    Edit Profile
                  </Link>
                  <Link href="/dashboard/settings" className="btn btn-outline-secondary">
                    <i className="f-cog me-1"></i>
                    Settings
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
                className={`nav-link ${activeTab === 'orders' ? 'active' : ''}`}
                onClick={() => setActiveTab('orders')}
              >
                <i className="f-shopping-bag me-2"></i>
                Orders
              </button>
              <button 
                className={`nav-link ${activeTab === 'bids' ? 'active' : ''}`}
                onClick={() => setActiveTab('bids')}
              >
                <i className="f-gavel me-2"></i>
                Bids
              </button>
              <button 
                className={`nav-link ${activeTab === 'favorites' ? 'active' : ''}`}
                onClick={() => setActiveTab('favorites')}
              >
                <i className="f-heart me-2"></i>
                Favorites
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
                      <i className="f-shopping-bag"></i>
                    </div>
                    <div className="stat-content">
                      <h3>{stats?.totalOrders || 0}</h3>
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
                      <h3>{formatPrice(stats?.totalSpent || 0)}</h3>
                      <p>Total Spent</p>
                    </div>
                  </div>
                </div>
                <div className="col-md-3 mb-3">
                  <div className="stat-card">
                    <div className="stat-icon">
                      <i className="f-gavel"></i>
                    </div>
                    <div className="stat-content">
                      <h3>{stats?.totalBids || 0}</h3>
                      <p>Total Bids</p>
                    </div>
                  </div>
                </div>
                <div className="col-md-3 mb-3">
                  <div className="stat-card">
                    <div className="stat-icon">
                      <i className="f-trophy"></i>
                    </div>
                    <div className="stat-content">
                      <h3>{stats?.totalWins || 0}</h3>
                      <p>Auction Wins</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Recent Activity */}
              <div className="row">
                <div className="col-md-6">
                  <div className="dashboard-card">
                    <div className="card-header">
                      <h5><i className="f-clock me-2"></i>Recent Orders</h5>
                    </div>
                    <div className="card-body">
                      {stats?.recentOrders?.length ? (
                        <div className="recent-items">
                          {stats.recentOrders.map((order) => (
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
                                <p className="mb-0 fw-bold">{formatPrice(order.total_amount)}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-4">
                          <i className="f-shopping-bag fa-3x text-muted mb-3"></i>
                          <p className="text-muted">No orders yet</p>
                          <Link href="/shop" className="btn btn-primary">
                            Start Shopping
                          </Link>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="dashboard-card">
                    <div className="card-header">
                      <h5><i className="f-gavel me-2"></i>Recent Bids</h5>
                    </div>
                    <div className="card-body">
                      {stats?.recentBids?.length ? (
                        <div className="recent-items">
                          {stats.recentBids.map((bid) => (
                            <div key={bid.id} className="recent-item">
                              <div className="item-info">
                                <h6>Auction #{bid.auction_id}</h6>
                                <p className="text-muted mb-1">
                                  {new Date(bid.created_at).toLocaleDateString()}
                                </p>
                              </div>
                              <div className="item-status">
                                <span className={`badge bg-${bid.auction_status === 'won' ? 'success' : 'info'}`}>                                                
                                  {bid.auction_status === 'won' ? 'Winning' : 'Outbid'}
                                </span>
                                <p className="mb-0 fw-bold">{formatPrice(bid.bid_amount)}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-4">
                          <i className="f-gavel fa-3x text-muted mb-3"></i>
                          <p className="text-muted">No bids yet</p>
                          <Link href="/auctions" className="btn btn-primary">
                            View Auctions
                          </Link>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'orders' && (
            <div className="dashboard-orders">
              <div className="dashboard-card">
                <div className="card-header d-flex justify-content-between align-items-center">
                  <h5><i className="f-shopping-bag me-2"></i>All Orders</h5>
                  <Link href="/orders" className="btn btn-outline-primary btn-sm">
                    View All Orders
                  </Link>
                </div>
                <div className="card-body">
                  <div className="text-center py-5">
                    <i className="f-shopping-bag fa-3x text-muted mb-3"></i>
                    <h5>Order Management</h5>
                    <p className="text-muted">Track and manage all your orders in one place.</p>
                    <Link href="/orders" className="btn btn-primary">
                      View All Orders
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'bids' && (
            <div className="dashboard-bids">
              <div className="dashboard-card">
                <div className="card-header d-flex justify-content-between align-items-center">
                  <h5><i className="f-gavel me-2"></i>All Bids</h5>
                  <Link href="/bids" className="btn btn-outline-primary btn-sm">
                    View All Bids
                  </Link>
                </div>
                <div className="card-body">
                  <div className="text-center py-5">
                    <i className="f-gavel fa-3x text-muted mb-3"></i>
                    <h5>Bid Management</h5>
                    <p className="text-muted">Track and manage all your auction bids.</p>
                    <Link href="/bids" className="btn btn-primary">
                      View All Bids
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'favorites' && (
            <div className="dashboard-favorites">
              <div className="dashboard-card">
                <div className="card-header d-flex justify-content-between align-items-center">
                  <h5><i className="f-heart me-2"></i>Favorites</h5>
                  <Link href="/favorites" className="btn btn-outline-primary btn-sm">
                    View All Favorites
                  </Link>
                </div>
                <div className="card-body">
                  <div className="text-center py-5">
                    <i className="f-heart fa-3x text-muted mb-3"></i>
                    <h5>Your Favorites</h5>
                    <p className="text-muted">Products and auctions you&apos;ve marked .</p>
                    <Link href="/favorites" className="btn btn-primary">
                      View All Favorites
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <style jsx>{`
          .dashboard-page {
            min-height;
            background-color: #f8f9fa;
          }

          .dashboard-header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color;
          }

          .user-avatar {
            position;
          }

          .avatar-placeholder {
            width;
            height;
            background: rgba(255, 255, 255, 0.2);
            border-radius: 50%;
            display;
            align-items;
            justify-content;
            font-size;
            color;
          }

          .dashboard-nav .nav-pills .nav-link {
            color: var(--secondary-color);
            border-radius: var(--border-radius-lg);
            margin-right;
            font-weight;
            transition: all 0.3s ease;
          }

          .dashboard-nav .nav-pills .nav-link:hover {
            background-color: var(--gray-100);
            color: var(--primary-color);
          }

          .dashboard-nav .nav-pills .nav-link.active {
            background-color: var(--primary-color);
            color;
          }

          .stat-card {
            background;
            border-radius: var(--border-radius-lg);
            padding: 1.5rem;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
            display;
            align-items;
            transition: transform 0.3s ease;
          }

          .stat-card:hover {
            transform: translateY(-2px);
          }

          .stat-icon {
            width;
            height;
            background: var(--primary-color);
            border-radius: 50%;
            display;
            align-items;
            justify-content;
            color;
            font-size;
            margin-right;
          }

          .stat-content h3 {
            font-size;
            font-weight;
            color: var(--secondary-color);
            margin-bottom: 0.25rem;
          }

          .stat-content p {
            color: var(--gray-600);
            margin-bottom;
            font-weight;
          }

          .dashboard-card {
            background;
            border-radius: var(--border-radius-lg);
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
            overflow;
          }

          .dashboard-card .card-header {
            background: var(--gray-50);
            border-bottom: 1px solid var(--gray-200);
            padding: 1rem 1.5rem;
            margin;
          }

          .dashboard-card .card-header h5 {
            margin;
            color: var(--secondary-color);
            font-weight;
          }

          .dashboard-card .card-body {
            padding: 1.5rem;
          }

          .recent-item {
            display;
            justify-content;
            align-items;
            padding;
            border-bottom: 1px solid var(--gray-200);
          }

          .recent-item:last-child {
            border-bottom;
          }

          .item-info h6 {
            margin-bottom: 0.25rem;
            color: var(--secondary-color);
            font-weight;
          }

          .item-status {
            text-align;
          }

          .dashboard-actions .btn {
            border-radius: var(--border-radius-lg);
            font-weight;
          }

          @media (max-width) {
            .dashboard-header .row {
              text-align;
            }

            .dashboard-actions {
              margin-top;
            }

            .stat-card {
              flex-direction;
              text-align;
            }

            .stat-icon {
              margin-right;
              margin-bottom;
            }
          }
        `}</style>
      </div>
    </Layout>
  );
};

