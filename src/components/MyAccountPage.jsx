'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import KycDashboard from './kyc/KycDashboard';

const MyAccountPage = ({ user }) => {
  const [activeTab, setActiveTab] = useState('dashboard');

  const currentUser = user || {
    id: 1,
    name: 'John Doe',
    email: 'john.doe@example.com',
    tenant_id: 1,
    phone: '+1234567890',
    status: 'active',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100',
    role: 'ecommerce',
    created_at: '2024-01-15T00:00:00Z',
    updated_at: '2024-01-15T00:00:00Z',
    joinedDate: '2024-01-15',
    totalOrders: 12,
    totalBids: 5,
    totalAuctions: 2,
    totalProducts: 0,
    totalProperties: 0
  };

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: 'fas fa-tachometer-alt' },
    { id: 'profile', label: 'Profile', icon: 'fas fa-user' },
    { id: 'orders', label: 'Orders', icon: 'fas fa-shopping-bag' },
    { id: 'bids', label: 'My Bids', icon: 'fas fa-gavel' },
    { id: 'auctions', label: 'My Auctions', icon: 'fas fa-hammer' },
    { id: 'products', label: 'My Products', icon: 'fas fa-box' },
    { id: 'properties', label: 'My Properties', icon: 'fas fa-home' },
    { id: 'kyc', label: 'KYC Documents', icon: 'fas fa-id-card' },
    { id: 'settings', label: 'Settings', icon: 'fas fa-cog' }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <div className="dashboard-content">
            <div className="row">
              <div className="col-md-3 mb-4">
                <div className="stat-card">
                  <div className="stat-icon">
                    <i className="fas fa-shopping-bag"></i>
                  </div>
                  <div className="stat-info">
                    <h3>{currentUser.totalOrders || 0}</h3>
                    <p>Total Orders</p>
                  </div>
                </div>
              </div>
              <div className="col-md-3 mb-4">
                <div className="stat-card">
                  <div className="stat-icon">
                    <i className="fas fa-gavel"></i>
                  </div>
                  <div className="stat-info">
                    <h3>{currentUser.totalBids || 0}</h3>
                    <p>Total Bids</p>
                  </div>
                </div>
              </div>
              <div className="col-md-3 mb-4">
                <div className="stat-card">
                  <div className="stat-icon">
                    <i className="fas fa-hammer"></i>
                  </div>
                  <div className="stat-info">
                    <h3>{currentUser.totalAuctions || 0}</h3>
                    <p>My Auctions</p>
                  </div>
                </div>
              </div>
              <div className="col-md-3 mb-4">
                <div className="stat-card">
                  <div className="stat-icon">
                    <i className="fas fa-box"></i>
                  </div>
                  <div className="stat-info">
                    <h3>{currentUser.totalProducts || 0}</h3>
                    <p>My Products</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'profile':
        return (
          <div className="profile-content">
            <div className="row">
              <div className="col-md-4">
                <div className="profile-card">
                  <div className="profile-avatar">
                    <img src={currentUser.avatar} alt={currentUser.name} />
                  </div>
                  <h4>{currentUser.name}</h4>
                  <p className="text-muted">{currentUser.email}</p>
                  <p className="text-muted">Member since {currentUser.joinedDate}</p>
                </div>
              </div>
              <div className="col-md-8">
                <div className="profile-form">
                  <h5>Edit Profile</h5>
                  <form>
                    <div className="row">
                      <div className="col-md-6 mb-3">
                        <label htmlFor="name">Full Name</label>
                        <input type="text" className="form-control" id="name" defaultValue={currentUser.name} />
                      </div>
                      <div className="col-md-6 mb-3">
                        <label htmlFor="email">Email</label>
                        <input type="email" className="form-control" id="email" defaultValue={currentUser.email} />
                      </div>
                      <div className="col-md-6 mb-3">
                        <label htmlFor="phone">Phone</label>
                        <input type="tel" className="form-control" id="phone" defaultValue={currentUser.phone} />
                      </div>
                      <div className="col-md-6 mb-3">
                        <label htmlFor="role">Role</label>
                        <input type="text" className="form-control" id="role" defaultValue={currentUser.role} readOnly />
                      </div>
                    </div>
                    <button type="submit" className="btn btn-primary">Update Profile</button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        );

      case 'kyc':
        return <KycDashboard />;

      default:
        return (
          <div className="tab-content">
            <h4>{tabs.find(tab => tab.id === activeTab)?.label}</h4>
            <p>Content for {activeTab} tab will be implemented here.</p>
          </div>
        );
    }
  };

  return (
    <div className="my-account-page">
      <div className="container py-4">
        <div className="row">
          {/* Sidebar */}
          <div className="col-md-3">
            <div className="account-sidebar">
              <div className="user-info">
                <div className="user-avatar">
                  <img src={currentUser.avatar} alt={currentUser.name} />
                </div>
                <h5>{currentUser.name}</h5>
                <p className="text-muted">{currentUser.email}</p>
              </div>

              <nav className="account-nav">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    className={`nav-item ${activeTab === tab.id ? 'active' : ''}`}
                    onClick={() => setActiveTab(tab.id)}
                  >
                    <i className={tab.icon}></i>
                    <span>{tab.label}</span>
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="col-md-9">
            <div className="account-content">
              {renderTabContent()}
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .my-account-page {
          min-height: 100vh;
          background: #f8f9fa;
        }

        .account-sidebar {
          background: white;
          border-radius: 8px;
          padding: 20px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
          margin-bottom: 20px;
        }

        .user-info {
          text-align: center;
          margin-bottom: 30px;
          padding-bottom: 20px;
          border-bottom: 1px solid #eee;
        }

        .user-avatar {
          width: 80px;
          height: 80px;
          margin: 0 auto 15px;
          border-radius: 50%;
          overflow: hidden;
        }

        .user-avatar img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .account-nav {
          display: flex;
          flex-direction: column;
          gap: 5px;
        }

        .nav-item {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 12px 15px;
          border: none;
          background: none;
          text-align: left;
          border-radius: 6px;
          transition: all 0.2s;
          cursor: pointer;
        }

        .nav-item:hover {
          background: #f8f9fa;
        }

        .nav-item.active {
          background: #007bff;
          color: white;
        }

        .nav-item i {
          width: 20px;
        }

        .account-content {
          background: white;
          border-radius: 8px;
          padding: 30px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }

        .stat-card {
          background: white;
          border-radius: 8px;
          padding: 20px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
          display: flex;
          align-items: center;
          gap: 15px;
        }

        .stat-icon {
          width: 50px;
          height: 50px;
          background: #007bff;
          color: white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 20px;
        }

        .stat-info h3 {
          margin: 0;
          font-size: 1.5rem;
          font-weight: 700;
          color: #333;
        }

        .stat-info p {
          margin: 0;
          color: #666;
          font-size: 0.9rem;
        }

        .profile-card {
          background: white;
          border-radius: 8px;
          padding: 20px;
          text-align: center;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }

        .profile-avatar {
          width: 120px;
          height: 120px;
          margin: 0 auto 20px;
          border-radius: 50%;
          overflow: hidden;
        }

        .profile-avatar img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .profile-form {
          background: white;
          border-radius: 8px;
          padding: 20px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }

        @media (max-width: 768px) {
          .account-sidebar {
            margin-bottom: 20px;
          }

          .account-nav {
            flex-direction: row;
            overflow-x: auto;
            gap: 10px;
          }

          .nav-item {
            white-space: nowrap;
            min-width: 120px;
          }
        }
      `}</style>
    </div>
  );
};

export default MyAccountPage;