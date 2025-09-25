'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Layout from '@/components/Layout';
// import Image from 'next/image';
import { apiService } from '@/services/api';
import { useAuth } from '@/contexts/AuthContext';



export default function ProfilePage() {
  const { user, isAuthenticated, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [orders, setOrders] = useState([]);
  const [bids, setBids] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchUserData = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      // Fetch user orders and bids
      const [ordersResponse, bidsResponse] = await Promise.all([
        apiService.getUserOrders(),
        apiService.getUserBids()
      ]);

      if (ordersResponse.success) {
        setOrders(ordersResponse.data);
      }

      if (bidsResponse.success) {
        setBids(bidsResponse.data);
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated && user) {
      fetchUserData();
    }
  }, [isAuthenticated, user, fetchUserData]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  // Redirect to login if not authenticated
  if (!isAuthenticated || !user) {
    return (
      <Layout>
        <div className="container py-5">
          <div className="row justify-content-center">
            <div className="col-md-6 text-center">
              <div className="card">
                <div className="card-body py-5">
                  <i className="f-user-circle fa-5x text-muted mb-4"></i>
                  <h3 className="mb-3">Please Login</h3>
                  <p className="text-muted mb-4">You need to be logged in to access your account.</p>
                  <Link href="/login" className="btn btn-primary">
                    Login to Continue
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  const renderDashboard = () => (
    <div className="profile-dashboard">
      <div className="welcome-section mb-5">
        <h4>Hello {user.name} (not {user.name}? <button className="btn-link text-primary" onClick={logout}>Log out</button>)</h4>
        <p className="text-muted">
          From your account dashboard you can view your recent orders, manage your shipping and billing addresses, 
          and edit your password and account details.
        </p>
      </div>

      <div className="dashboard-grid">
        <div className="row g-4">
          <div className="col-lg-4 col-md-6">
            <Link href="#" className="dashboard-card" onClick={() => setActiveTab('orders')}>
              <div className="dashboard-card-icon">
                <i className="f-file-alt"></i>
              </div>
              <div className="dashboard-card-content">
                <h6>Orders</h6>
                <span className="text-muted">{orders.length} orders</span>
              </div>
            </Link>
          </div>

          <div className="col-lg-4 col-md-6">
            <Link href="#" className="dashboard-card" onClick={() => setActiveTab('downloads')}>
              <div className="dashboard-card-icon">
                <i className="f-download"></i>
              </div>
              <div className="dashboard-card-content">
                <h6>Downloads</h6>
                <span className="text-muted">No downloads yet</span>
              </div>
            </Link>
          </div>

          <div className="col-lg-4 col-md-6">
            <Link href="#" className="dashboard-card" onClick={() => setActiveTab('addresses')}>
              <div className="dashboard-card-icon">
                <i className="f-map-marker-alt"></i>
              </div>
              <div className="dashboard-card-content">
                <h6>Addresses</h6>
                <span className="text-muted">Manage addresses</span>
              </div>
            </Link>
          </div>

          <div className="col-lg-4 col-md-6">
            <Link href="#" className="dashboard-card" onClick={() => setActiveTab('account-details')}>
              <div className="dashboard-card-icon">
                <i className="f-user"></i>
              </div>
              <div className="dashboard-card-content">
                <h6>Account details</h6>
                <span className="text-muted">Edit your details</span>
              </div>
            </Link>
          </div>

          <div className="col-lg-4 col-md-6">
            <Link href="#" className="dashboard-card" onClick={() => setActiveTab('waitlist')}>
              <div className="dashboard-card-icon">
                <i className="f-clock"></i>
              </div>
              <div className="dashboard-card-content">
                <h6>Waitlist</h6>
                <span className="text-muted">Your waitlist items</span>
              </div>
            </Link>
          </div>

          <div className="col-lg-4 col-md-6">
            <Link href="/wishlist" className="dashboard-card">
              <div className="dashboard-card-icon">
                <i className="f-heart"></i>
              </div>
              <div className="dashboard-card-content">
                <h6>Wishlist</h6>
                <span className="text-muted">Your saved items</span>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );

  const renderOrders = () => (
    <div className="orders-section">
      <h4 className="mb-4">Orders</h4>
      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center py-5">
          <i className="f-shopping-bag fa-3x text-muted mb-3"></i>
          <h5 className="text-muted">No orders yet</h5>
          <p className="text-muted">You haven&apos;t placed any orders yet.</p>
          <Link href="/shop" className="btn btn-primary">Start Shopping</Link>
        </div>
      ) : (
        <div className="table-responsive">
          <table className="table table-hover">
            <thead>
              <tr>
                <th>Order</th>
                <th>Date</th>
                <th>Status</th>
                <th>Total</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id}>
                  <td>#{order.id}</td>
                  <td>{formatDate(order.created_at)}</td>
                  <td>
                    <span className={`badge bg-${order.status === 'completed' ? 'success' : 'warning'}`}>
                      {order.status}
                    </span>
                  </td>
                  <td>{formatCurrency(order.total_amount)}</td>
                  <td>
                    <Link href={`/orders/${order.id}`} className="btn btn-sm btn-outline-primary">
                      View
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );

  const renderAccountDetails = () => (
    <div className="account-details-section">
      <h4 className="mb-4">Account Details</h4>
      <div className="row">
        <div className="col-md-8">
          <form>
            <div className="row mb-3">
              <div className="col-md-6">
                <label htmlFor="firstName" className="form-label">First name</label>
                <input type="text" className="form-control" id="firstName" defaultValue={user.name?.split(' ')[0] || ''} />
              </div>
              <div className="col-md-6">
                <label htmlFor="lastName" className="form-label">Last name</label>
                <input type="text" className="form-control" id="lastName" defaultValue={user.name?.split(' ').slice(1).join(' ') || ''} />
              </div>
            </div>

            <div className="mb-3">
              <label htmlFor="displayName" className="form-label">Display name</label>
              <input type="text" className="form-control" id="displayName" defaultValue={user.name || ''} />
              <div className="form-text">This will be how your name will be displayed in the account section and in reviews</div>
            </div>

            <div className="mb-3">
              <label htmlFor="email" className="form-label">Email address</label>
              <input type="email" className="form-control" id="email" defaultValue={user.email} />
            </div>

            <h5 className="mb-3">Password change</h5>

            <div className="mb-3">
              <label htmlFor="currentPassword" className="form-label">Current password (leave blank to leave unchanged)</label>
              <input type="password" className="form-control" id="currentPassword" />
            </div>

            <div className="mb-3">
              <label htmlFor="newPassword" className="form-label">New password (leave blank to leave unchanged)</label>
              <input type="password" className="form-control" id="newPassword" />
            </div>

            <div className="mb-4">
              <label htmlFor="confirmPassword" className="form-label">Confirm new password</label>
              <input type="password" className="form-control" id="confirmPassword" />
            </div>

            <button type="submit" className="btn btn-primary">Save changes</button>
          </form>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return renderDashboard();
      case 'orders':
        return renderOrders();
      case 'account-details':
        return renderAccountDetails();
      case 'downloads':
        return (
          <div className="text-center py-5">
            <i className="f-download fa-3x text-muted mb-3"></i>
            <h5 className="text-muted">No downloads available</h5>
            <p className="text-muted">Downloads will appear here when available.</p>
          </div>
        );
      case 'addresses':
        return (
          <div className="text-center py-5">
            <i className="f-map-marker-alt fa-3x text-muted mb-3"></i>
            <h5 className="text-muted">No addresses saved</h5>
            <p className="text-muted">Add your shipping and billing addresses.</p>
          </div>
        );
      case 'waitlist':
        return (
          <div className="text-center py-5">
            <i className="f-clock fa-3x text-muted mb-3"></i>
            <h5 className="text-muted">No waitlist items</h5>
            <p className="text-muted">Items you&apos;re waiting for will appear here.</p>
          </div>
        );
      default:
        return renderDashboard();
    }
  };

  return (
    <Layout>
      {/* Hero Banner */}
      <div className="profile-hero">
        <div className="container">
          <div className="row">
            <div className="col-12">
              <div className="hero-content">
                <h1 className="hero-title">My Account</h1>
                <nav aria-label="breadcrumb">
                  <ol className="breadcrumb">
                    <li className="breadcrumb-item"><Link href="/">Home</Link></li>
                    <li className="breadcrumb-item active" aria-current="page">My Account</li>
                  </ol>
                </nav>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container py-5">
        <div className="row">
          {/* Sidebar */}
          <div className="col-lg-3 col-md-4">
            <div className="account-sidebar">
              <h5 className="sidebar-title">MY ACCOUNT</h5>
              <nav className="sidebar-nav">
                <Link 
                  href="#" 
                  className={`sidebar-link ${activeTab === 'dashboard' ? 'active' : ''}`}
                  onClick={(e) => { e.preventDefault(); setActiveTab('dashboard'); }}
                >
                  Dashboard
                </Link>
                <Link 
                  href="#" 
                  className={`sidebar-link ${activeTab === 'orders' ? 'active' : ''}`}
                  onClick={(e) => { e.preventDefault(); setActiveTab('orders'); }}
                >
                  Orders
                </Link>
                <Link 
                  href="#" 
                  className={`sidebar-link ${activeTab === 'downloads' ? 'active' : ''}`}
                  onClick={(e) => { e.preventDefault(); setActiveTab('downloads'); }}
                >
                  Downloads
                </Link>
                <Link 
                  href="#" 
                  className={`sidebar-link ${activeTab === 'addresses' ? 'active' : ''}`}
                  onClick={(e) => { e.preventDefault(); setActiveTab('addresses'); }}
                >
                  Addresses
                </Link>
                <Link 
                  href="#" 
                  className={`sidebar-link ${activeTab === 'account-details' ? 'active' : ''}`}
                  onClick={(e) => { e.preventDefault(); setActiveTab('account-details'); }}
                >
                  Account details
                </Link>
                <Link 
                  href="#" 
                  className={`sidebar-link ${activeTab === 'waitlist' ? 'active' : ''}`}
                  onClick={(e) => { e.preventDefault(); setActiveTab('waitlist'); }}
                >
                  Waitlist
                </Link>
                <Link href="/wishlist" className="sidebar-link">
                  Wishlist
                </Link>
                <button className="sidebar-link logout-btn" onClick={logout}>
                  Logout
                </button>
              </nav>
              
              <div className="sidebar-footer">
                <Link href="/shop" className="btn btn-dark w-100">
                  <i className="f-bolt me-2"></i>
                  Buy XpertBid
                </Link>
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="col-lg-9 col-md-8">
            <div className="account-content">
              {renderContent()}
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .profile-hero {
          background: linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), 
                      url('https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=1200&h=400&fit=crop') center/cover;
          padding;
          color;
        }

        .hero-title {
          font-size;
          font-weight;
          margin-bottom;
        }

        .breadcrumb {
          margin-bottom;
        }

        .breadcrumb-item a {
          color;
          text-decoration;
        }

        .breadcrumb-item.active {
          color: rgba(255, 255, 255, 0.8);
        }

        .account-sidebar {
          background: #f8f9fa;
          padding: 2rem 1.5rem;
          border-radius;
          height: fit-content;
          position;
          top;
        }

        .sidebar-title {
          font-weight;
          color: #333;
          margin-bottom: 1.5rem;
          font-size: 1.1rem;
        }

        .sidebar-nav {
          list-style;
          padding;
          margin;
        }

        .sidebar-link {
          display;
          padding: 0.75rem 0;
          color: #666;
          text-decoration;
          border-bottom: 1px solid #e9ecef;
          transition: all 0.3s ease;
          background;
          border;
          width: 100%;
          text-align;
        }

        .sidebar-link:last-child {
          border-bottom;
        }

        .sidebar-link:hover {
          color: #007bff;
          padding-left: 0.5rem;
        }

        .sidebar-link.active {
          color: #007bff;
          font-weight;
          background: rgba(0, 123, 255, 0.1);
          margin: 0 -1.5rem;
          padding-left: 1.5rem;
        }

        .logout-btn {
          color: #dc3545;
          cursor;
        }

        .logout-btn:hover {
          color: #c82333;
        }

        .sidebar-footer {
          margin-top;
          padding-top: 1.5rem;
          border-top: 1px solid #e9ecef;
        }

        .account-content {
          background;
          padding;
          border-radius;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          min-height;
        }

        .dashboard-grid {
          margin-top;
        }

        .dashboard-card {
          display;
          align-items;
          padding: 1.5rem;
          background;
          border: 1px solid #e9ecef;
          border-radius;
          text-decoration;
          color;
          transition: all 0.3s ease;
          height: 100%;
        }

        .dashboard-card:hover {
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          transform: translateY(-2px);
          color;
        }

        .dashboard-card-icon {
          width;
          height;
          background: #f8f9fa;
          border-radius: 50%;
          display;
          align-items;
          justify-content;
          margin-right;
          flex-shrink;
        }

        .dashboard-card-icon i {
          font-size: 1.5rem;
          color: #666;
        }

        .dashboard-card-content h6 {
          margin: 0 0 0.25rem 0;
          font-weight;
          color: #333;
        }

        .dashboard-card-content span {
          font-size: 0.875rem;
        }

        .welcome-section h4 {
          color: #333;
          margin-bottom;
        }

        .welcome-section .btn-link {
          background;
          border;
          color: #007bff;
          text-decoration;
          cursor;
          padding;
        }

        .table th {
          border-top;
          font-weight;
          color: #333;
        }

        .form-label {
          font-weight;
          color: #333;
          margin-bottom: 0.5rem;
        }

        .form-control {
          border: 1px solid #ddd;
          border-radius;
          padding: 0.75rem;
        }

        .form-control:focus {
          border-color: #007bff;
          box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
        }

        .btn-primary {
          background-color: #007bff;
          border-color: #007bff;
          padding: 0.75rem 1.5rem;
          border-radius;
          font-weight;
        }

        .btn-primary:hover {
          background-color: #0056b3;
          border-color: #0056b3;
        }

        .btn-dark {
          background-color: #333;
          border-color: #333;
          padding: 0.75rem 1.5rem;
          border-radius;
          font-weight;
        }

        .btn-dark:hover {
          background-color: #222;
          border-color: #222;
        }

        @media (max-width) {
          .hero-title {
            font-size;
          }
          
          .account-sidebar {
            margin-bottom;
            position;
          }
          
          .account-content {
            padding: 1.5rem;
          }
        }
      `}</style>
    </Layout>
  );
}
