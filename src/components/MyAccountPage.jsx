'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import KycDashboard from './kyc/KycDashboard';
import ProfileImageUpload from './ProfileImageUpload';
import ProfileDetailsTab from './account/ProfileDetailsTab';
import OrdersTab from './account/OrdersTab';
import MyBidsTab from './account/MyBidsTab';
import MyAuctionsTab from './account/MyAuctionsTab';
import MyProductsTab from './account/MyProductsTab';
import MyPropertiesTab from './account/MyPropertiesTab';
import SettingsTab from './account/SettingsTab';
import { useAuth } from '@/contexts/AuthContext';
import { apiService } from '@/services/api';

const MyAccountPage = ({ user }) => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [userStats, setUserStats] = useState({
    totalOrders: 0,
    totalBids: 0,
    totalAuctions: 0,
    totalProducts: 0,
    totalProperties: 0
  });
  const [isLoadingStats, setIsLoadingStats] = useState(true);
  const { user: authUser, updateUser } = useAuth();

  const currentUser = user || authUser;

  // Load user statistics
  useEffect(() => {
    const loadUserStats = async () => {
      if (!currentUser?.id) return;
      
      setIsLoadingStats(true);
      try {
        // Load all statistics in parallel
        const [ordersResponse, bidsResponse, auctionsResponse, productsResponse, propertiesResponse] = await Promise.all([
          apiService.getUserOrders(),
          apiService.getUserBids(),
          apiService.getUserAuctions(),
          apiService.getUserProducts(),
          apiService.getUserProperties()
        ]);

        setUserStats({
          totalOrders: ordersResponse.success ? (ordersResponse.data?.length || 0) : 0,
          totalBids: bidsResponse.success ? (bidsResponse.data?.length || 0) : 0,
          totalAuctions: auctionsResponse.success ? (auctionsResponse.data?.length || 0) : 0,
          totalProducts: productsResponse.success ? (productsResponse.data?.length || 0) : 0,
          totalProperties: propertiesResponse.success ? (propertiesResponse.data?.length || 0) : 0
        });
      } catch (error) {
        console.error('Error loading user statistics:', error);
      } finally {
        setIsLoadingStats(false);
      }
    };

    loadUserStats();
  }, [currentUser?.id]);

  const handleImageChange = (newAvatarUrl) => {
    // Update the user's avatar in the auth context
    if (updateUser) {
      updateUser({ avatar: newAvatarUrl });
    }
  };

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: 'fas fa-tachometer-alt' },
    { id: 'profile', label: 'Profile', icon: 'fas fa-user' },
    { id: 'profile-details', label: 'Profile Details', icon: 'fas fa-user-edit' },
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
            {isLoadingStats ? (
              <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '200px' }}>
                <div className="text-center">
                  <div className="spinner-border text-primary mb-3" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                  <p className="text-muted">Loading your statistics...</p>
                </div>
              </div>
            ) : (
              <div className="row">
                <div className="col-md-3 mb-4">
                  <div className="stat-card">
                    <div className="stat-icon">
                      <i className="fas fa-shopping-bag"></i>
                    </div>
                    <div className="stat-info">
                      <h3>{userStats.totalOrders}</h3>
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
                      <h3>{userStats.totalBids}</h3>
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
                      <h3>{userStats.totalAuctions}</h3>
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
                      <h3>{userStats.totalProducts}</h3>
                      <p>My Products</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        );

      case 'profile':
        if (!currentUser) {
          return (
            <div className="profile-content">
              <div className="alert alert-warning" role="alert">
                <i className="fas fa-exclamation-triangle me-2"></i>
                Please log in to view your profile information.
              </div>
            </div>
          );
        }
        
        return (
          <div className="profile-content">
            <div className="row">
              <div className="col-md-4">
                <div className="profile-card">
                  <ProfileImageUpload 
                    currentAvatar={currentUser.avatar}
                    onImageChange={handleImageChange}
                    userId={currentUser.id}
                  />
                  <h4 className="mt-3">{currentUser.name}</h4>
                  <p className="text-muted">{currentUser.email}</p>
                  <p className="text-muted">
                    Member since {currentUser.created_at ? 
                      new Date(currentUser.created_at).toLocaleDateString() : 
                      'Unknown'
                    }
                  </p>
                </div>
              </div>
              <div className="col-md-8">
                <div className="profile-form">
                  <h5>Quick Profile Info</h5>
                  <div className="profile-summary">
                    <div className="row">
                      <div className="col-sm-6 mb-3">
                        <strong>Full Name:</strong>
                        <p className="text-muted">{currentUser.name || 'Not provided'}</p>
                      </div>
                      <div className="col-sm-6 mb-3">
                        <strong>Email:</strong>
                        <p className="text-muted">{currentUser.email || 'Not provided'}</p>
                      </div>
                      <div className="col-sm-6 mb-3">
                        <strong>Phone:</strong>
                        <p className="text-muted">{currentUser.phone || 'Not provided'}</p>
                      </div>
                      <div className="col-sm-6 mb-3">
                        <strong>Role:</strong>
                        <p className="text-muted">{currentUser.role?.toUpperCase() || 'USER'}</p>
                      </div>
                    </div>
                    <div className="mt-3">
                      <button 
                        className="btn btn-primary" 
                        onClick={() => setActiveTab('profile-details')}
                      >
                        <i className="fas fa-edit me-2"></i>
                        Edit Profile Details
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'profile-details':
        return <ProfileDetailsTab user={currentUser} />;

      case 'orders':
        return <OrdersTab userId={currentUser.id} />;

      case 'bids':
        return <MyBidsTab userId={currentUser.id} />;

      case 'auctions':
        return <MyAuctionsTab userId={currentUser?.id} />;

      case 'products':
        return <MyProductsTab userId={currentUser?.id} />;

      case 'properties':
        return <MyPropertiesTab userId={currentUser?.id} />;

      case 'settings':
        return <SettingsTab userId={currentUser?.id} />;

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
                  {currentUser?.avatar ? (
                    <img src={currentUser.avatar} alt={currentUser.name || 'User'} />
                  ) : (
                    <div className="avatar-placeholder">
                      <i className="fas fa-user fa-2x"></i>
                    </div>
                  )}
                </div>
                <h5>{currentUser?.name || 'Guest User'}</h5>
                <p className="text-muted">{currentUser?.email || 'Not logged in'}</p>
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

        .avatar-placeholder {
          width: 100%;
          height: 100%;
          background: #f8f9fa;
          border: 2px dashed #dee2e6;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #6c757d;
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