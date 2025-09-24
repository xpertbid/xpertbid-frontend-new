'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import KycDashboard from './kyc/KycDashboard';

interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: 'ecommerce' | 'bidder' | 'auction_seller' | 'vendor' | 'property_buyer' | 'property_seller';
  joinedDate: string;
  totalOrders?: number;
  totalBids?: number;
  totalAuctions?: number;
  totalProducts?: number;
  totalProperties?: number;
}

interface MyAccountPageProps {
  user?: User;
}

const MyAccountPage: React.FC<MyAccountPageProps> = ({ user }) => {
  const [activeTab, setActiveTab] = useState('dashboard');

  // Sample user data - replace with actual user data from context/API
  const currentUser: User = user || {
    id: '1',
    name: 'John Doe',
    email: 'john.doe@example.com',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100',
    role: 'ecommerce',
    joinedDate: '2024-01-15',
    totalOrders: 12,
    totalBids: 8,
    totalAuctions: 3,
    totalProducts: 25,
    totalProperties: 5
  };

  const getRoleDisplayName = (role: string) => {
    const roleNames = {
      'ecommerce': 'E-commerce Customer',
      'bidder': 'Auction Bidder',
      'auction_seller': 'Auction Seller',
      'vendor': 'Vendor',
      'property_buyer': 'Property Buyer',
      'property_seller': 'Property Seller'
    };
    return roleNames[role as keyof typeof roleNames] || role;
  };

  const getRoleIcon = (role: string) => {
    const roleIcons = {
      'ecommerce': 'fas fa-shopping-bag',
      'bidder': 'fas fa-gavel',
      'auction_seller': 'fas fa-hammer',
      'vendor': 'fas fa-store',
      'property_buyer': 'fas fa-home',
      'property_seller': 'fas fa-building'
    };
    return roleIcons[role as keyof typeof roleIcons] || 'fas fa-user';
  };

  const getDashboardContent = () => {
    switch (currentUser.role) {
      case 'ecommerce':
        return <EcommerceDashboard user={currentUser} />;
      case 'bidder':
        return <BidderDashboard user={currentUser} />;
      case 'auction_seller':
        return <AuctionSellerDashboard user={currentUser} />;
      case 'vendor':
        return <VendorDashboard user={currentUser} />;
      case 'property_buyer':
        return <PropertyBuyerDashboard user={currentUser} />;
      case 'property_seller':
        return <PropertySellerDashboard user={currentUser} />;
      default:
        return <EcommerceDashboard user={currentUser} />;
    }
  };

  const getNavigationItems = () => {
    const baseItems = [
      { id: 'dashboard', label: 'Dashboard', icon: 'fas fa-tachometer-alt' },
      { id: 'kyc', label: 'KYC Verification', icon: 'fas fa-id-card' },
      { id: 'profile', label: 'Profile', icon: 'fas fa-user' },
      { id: 'settings', label: 'Settings', icon: 'fas fa-cog' },
      { id: 'notifications', label: 'Notifications', icon: 'fas fa-bell' },
      { id: 'security', label: 'Security', icon: 'fas fa-shield-alt' }
    ];

    const roleSpecificItems = {
      'ecommerce': [
        { id: 'orders', label: 'My Orders', icon: 'fas fa-shopping-cart' },
        { id: 'wishlist', label: 'Wishlist', icon: 'fas fa-heart' },
        { id: 'addresses', label: 'Addresses', icon: 'fas fa-map-marker-alt' }
      ],
      'bidder': [
        { id: 'bids', label: 'My Bids', icon: 'fas fa-gavel' },
        { id: 'watchlist', label: 'Watchlist', icon: 'fas fa-eye' },
        { id: 'bid-history', label: 'Bid History', icon: 'fas fa-history' }
      ],
      'auction_seller': [
        { id: 'auctions', label: 'My Auctions', icon: 'fas fa-hammer' },
        { id: 'create-auction', label: 'Create Auction', icon: 'fas fa-plus' },
        { id: 'auction-analytics', label: 'Analytics', icon: 'fas fa-chart-bar' }
      ],
      'vendor': [
        { id: 'products', label: 'My Products', icon: 'fas fa-box' },
        { id: 'add-product', label: 'Add Product', icon: 'fas fa-plus' },
        { id: 'orders', label: 'Orders', icon: 'fas fa-shopping-cart' },
        { id: 'analytics', label: 'Analytics', icon: 'fas fa-chart-line' }
      ],
      'property_buyer': [
        { id: 'saved-properties', label: 'Saved Properties', icon: 'fas fa-heart' },
        { id: 'viewings', label: 'Viewings', icon: 'fas fa-calendar' },
        { id: 'inquiries', label: 'Inquiries', icon: 'fas fa-envelope' }
      ],
      'property_seller': [
        { id: 'my-properties', label: 'My Properties', icon: 'fas fa-home' },
        { id: 'add-property', label: 'Add Property', icon: 'fas fa-plus' },
        { id: 'viewings', label: 'Viewings', icon: 'fas fa-calendar' },
        { id: 'inquiries', label: 'Inquiries', icon: 'fas fa-envelope' }
      ]
    };

    return [...baseItems, ...(roleSpecificItems[currentUser.role as keyof typeof roleSpecificItems] || [])];
  };

  return (
    <div className="my-account-page">
      <div className="container py-4">
        {/* Breadcrumb */}
        <nav aria-label="breadcrumb" className="mb-4">
          <ol className="breadcrumb">
            <li className="breadcrumb-item">
              <Link href="/">Home</Link>
            </li>
            <li className="breadcrumb-item active" aria-current="page">
              My Account
            </li>
          </ol>
        </nav>

        <div className="row">
          {/* Sidebar */}
          <div className="col-lg-3">
            <div className="account-sidebar">
              {/* User Profile Card */}
              <div className="profile-card bg-light p-4 rounded mb-4">
                <div className="profile-header text-center mb-3">
                  <img
                    src={currentUser.avatar}
                    alt={currentUser.name}
                    className="rounded-circle mb-3"
                    style={{ width: '80px', height: '80px', objectFit: 'cover' }}
                  />
                  <h5 className="mb-1" style={{ fontFamily: 'Poppins, sans-serif', fontWeight: '600' }}>
                    {currentUser.name}
                  </h5>
                  <div className="user-role">
                    <span className={`badge bg-primary`}>
                      <i className={`${getRoleIcon(currentUser.role)} me-1`}></i>
                      {getRoleDisplayName(currentUser.role)}
                    </span>
                  </div>
                  <p className="text-muted small mt-2 mb-0">
                    Member since {new Date(currentUser.joinedDate).toLocaleDateString()}
                  </p>
                </div>
              </div>

              {/* Navigation */}
              <div className="account-navigation">
                <div className="list-group">
                  {getNavigationItems().map((item) => (
                    <button
                      key={item.id}
                      className={`list-group-item list-group-item-action d-flex align-items-center ${
                        activeTab === item.id ? 'active' : ''
                      }`}
                      onClick={() => setActiveTab(item.id)}
                      style={{
                        border: 'none',
                        borderLeft: activeTab === item.id ? '3px solid #43ACE9' : '3px solid transparent',
                        backgroundColor: activeTab === item.id ? '#f8f9fa' : 'white'
                      }}
                    >
                      <i className={`${item.icon} me-3`} style={{ width: '20px' }}></i>
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="col-lg-9">
            <div className="account-content">
              {activeTab === 'dashboard' && getDashboardContent()}
              {activeTab === 'kyc' && <KycDashboard user={currentUser} />}
              {activeTab === 'profile' && <ProfileTab user={currentUser} />}
              {activeTab === 'settings' && <SettingsTab user={currentUser} />}
              {activeTab === 'notifications' && <NotificationsTab user={currentUser} />}
              {activeTab === 'security' && <SecurityTab user={currentUser} />}
              
              {/* Role-specific tabs */}
              {activeTab === 'orders' && <OrdersTab user={currentUser} />}
              {activeTab === 'wishlist' && <WishlistTab user={currentUser} />}
              {activeTab === 'addresses' && <AddressesTab user={currentUser} />}
              {activeTab === 'bids' && <BidsTab user={currentUser} />}
              {activeTab === 'watchlist' && <WatchlistTab user={currentUser} />}
              {activeTab === 'bid-history' && <BidHistoryTab user={currentUser} />}
              {activeTab === 'auctions' && <AuctionsTab user={currentUser} />}
              {activeTab === 'create-auction' && <CreateAuctionTab user={currentUser} />}
              {activeTab === 'auction-analytics' && <AuctionAnalyticsTab user={currentUser} />}
              {activeTab === 'products' && <ProductsTab user={currentUser} />}
              {activeTab === 'add-product' && <AddProductTab user={currentUser} />}
              {activeTab === 'analytics' && <AnalyticsTab user={currentUser} />}
              {activeTab === 'saved-properties' && <SavedPropertiesTab user={currentUser} />}
              {activeTab === 'viewings' && <ViewingsTab user={currentUser} />}
              {activeTab === 'inquiries' && <InquiriesTab user={currentUser} />}
              {activeTab === 'my-properties' && <MyPropertiesTab user={currentUser} />}
              {activeTab === 'add-property' && <AddPropertyTab user={currentUser} />}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Dashboard Components for different user types
const EcommerceDashboard: React.FC<{ user: User }> = ({ user }) => (
  <div className="dashboard-content">
    <h4 className="mb-4" style={{ fontFamily: 'Poppins, sans-serif', fontWeight: '600' }}>
      E-commerce Dashboard
    </h4>
    
    <div className="row mb-4">
      <div className="col-md-3">
        <div className="stat-card bg-primary text-white p-3 rounded">
          <div className="stat-value h4 mb-1">{user.totalOrders || 0}</div>
          <div className="stat-label">Total Orders</div>
        </div>
      </div>
      <div className="col-md-3">
        <div className="stat-card bg-success text-white p-3 rounded">
          <div className="stat-value h4 mb-1">$2,450</div>
          <div className="stat-label">Total Spent</div>
        </div>
      </div>
      <div className="col-md-3">
        <div className="stat-card bg-warning text-white p-3 rounded">
          <div className="stat-value h4 mb-1">3</div>
          <div className="stat-label">Pending Orders</div>
        </div>
      </div>
      <div className="col-md-3">
        <div className="stat-card bg-info text-white p-3 rounded">
          <div className="stat-value h4 mb-1">12</div>
          <div className="stat-label">Wishlist Items</div>
        </div>
      </div>
    </div>

    <div className="row">
      <div className="col-md-6">
        <div className="card">
          <div className="card-header">
            <h6 className="mb-0">Recent Orders</h6>
          </div>
          <div className="card-body">
            <div className="order-item d-flex justify-content-between align-items-center mb-3">
              <div>
                <div className="fw-bold">Order #XB-001</div>
                <div className="text-muted small">2 items - $299.98</div>
              </div>
              <span className="badge bg-success">Delivered</span>
            </div>
            <div className="order-item d-flex justify-content-between align-items-center mb-3">
              <div>
                <div className="fw-bold">Order #XB-002</div>
                <div className="text-muted small">1 item - $149.99</div>
              </div>
              <span className="badge bg-warning">Processing</span>
            </div>
            <Link href="/account?tab=orders" className="btn btn-outline-primary btn-sm">
              View All Orders
            </Link>
          </div>
        </div>
      </div>
      <div className="col-md-6">
        <div className="card">
          <div className="card-header">
            <h6 className="mb-0">Wishlist</h6>
          </div>
          <div className="card-body">
            <div className="wishlist-item d-flex align-items-center mb-3">
              <img src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=50" alt="Product" className="me-3 rounded" style={{ width: '50px', height: '50px', objectFit: 'cover' }} />
              <div className="flex-grow-1">
                <div className="fw-bold small">Smart Watch Wood Edition</div>
                <div className="text-primary fw-bold">$199.99</div>
              </div>
            </div>
            <Link href="/account?tab=wishlist" className="btn btn-outline-primary btn-sm">
              View Wishlist
            </Link>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const BidderDashboard: React.FC<{ user: User }> = ({ user }) => (
  <div className="dashboard-content">
    <h4 className="mb-4" style={{ fontFamily: 'Poppins, sans-serif', fontWeight: '600' }}>
      Auction Bidder Dashboard
    </h4>
    
    <div className="row mb-4">
      <div className="col-md-3">
        <div className="stat-card bg-primary text-white p-3 rounded">
          <div className="stat-value h4 mb-1">{user.totalBids || 0}</div>
          <div className="stat-label">Total Bids</div>
        </div>
      </div>
      <div className="col-md-3">
        <div className="stat-card bg-success text-white p-3 rounded">
          <div className="stat-value h4 mb-1">5</div>
          <div className="stat-label">Won Auctions</div>
        </div>
      </div>
      <div className="col-md-3">
        <div className="stat-card bg-warning text-white p-3 rounded">
          <div className="stat-value h4 mb-1">3</div>
          <div className="stat-label">Active Bids</div>
        </div>
      </div>
      <div className="col-md-3">
        <div className="stat-card bg-info text-white p-3 rounded">
          <div className="stat-value h4 mb-1">12</div>
          <div className="stat-label">Watched Items</div>
        </div>
      </div>
    </div>

    <div className="row">
      <div className="col-md-6">
        <div className="card">
          <div className="card-header">
            <h6 className="mb-0">Active Bids</h6>
          </div>
          <div className="card-body">
            <div className="bid-item d-flex justify-content-between align-items-center mb-3">
              <div>
                <div className="fw-bold">Vintage Rolex Submariner</div>
                <div className="text-muted small">Your bid: $25,000</div>
              </div>
              <span className="badge bg-warning">Leading</span>
            </div>
            <Link href="/account?tab=bids" className="btn btn-outline-primary btn-sm">
              View All Bids
            </Link>
          </div>
        </div>
      </div>
      <div className="col-md-6">
        <div className="card">
          <div className="card-header">
            <h6 className="mb-0">Won Auctions</h6>
          </div>
          <div className="card-body">
            <div className="won-item d-flex justify-content-between align-items-center mb-3">
              <div>
                <div className="fw-bold">Antique Persian Rug</div>
                <div className="text-muted small">Winning bid: $2,500</div>
              </div>
              <span className="badge bg-success">Won</span>
            </div>
            <Link href="/account?tab=bid-history" className="btn btn-outline-primary btn-sm">
              View History
            </Link>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const AuctionSellerDashboard: React.FC<{ user: User }> = ({ user }) => (
  <div className="dashboard-content">
    <h4 className="mb-4" style={{ fontFamily: 'Poppins, sans-serif', fontWeight: '600' }}>
      Auction Seller Dashboard
    </h4>
    
    <div className="row mb-4">
      <div className="col-md-3">
        <div className="stat-card bg-primary text-white p-3 rounded">
          <div className="stat-value h4 mb-1">{user.totalAuctions || 0}</div>
          <div className="stat-label">Total Auctions</div>
        </div>
      </div>
      <div className="col-md-3">
        <div className="stat-card bg-success text-white p-3 rounded">
          <div className="stat-value h4 mb-1">$45,600</div>
          <div className="stat-label">Total Sales</div>
        </div>
      </div>
      <div className="col-md-3">
        <div className="stat-card bg-warning text-white p-3 rounded">
          <div className="stat-value h4 mb-1">2</div>
          <div className="stat-label">Active Auctions</div>
        </div>
      </div>
      <div className="col-md-3">
        <div className="stat-card bg-info text-white p-3 rounded">
          <div className="stat-value h4 mb-1">156</div>
          <div className="stat-label">Total Bids</div>
        </div>
      </div>
    </div>

    <div className="row">
      <div className="col-md-6">
        <div className="card">
          <div className="card-header">
            <h6 className="mb-0">Active Auctions</h6>
          </div>
          <div className="card-body">
            <div className="auction-item d-flex justify-content-between align-items-center mb-3">
              <div>
                <div className="fw-bold">Vintage Rolex Submariner</div>
                <div className="text-muted small">Current bid: $25,000</div>
              </div>
              <span className="badge bg-success">Live</span>
            </div>
            <Link href="/account?tab=auctions" className="btn btn-outline-primary btn-sm">
              Manage Auctions
            </Link>
          </div>
        </div>
      </div>
      <div className="col-md-6">
        <div className="card">
          <div className="card-header">
            <h6 className="mb-0">Recent Sales</h6>
          </div>
          <div className="card-body">
            <div className="sale-item d-flex justify-content-between align-items-center mb-3">
              <div>
                <div className="fw-bold">Antique Persian Rug</div>
                <div className="text-muted small">Sold for: $2,500</div>
              </div>
              <span className="badge bg-success">Completed</span>
            </div>
            <Link href="/account?tab=auction-analytics" className="btn btn-outline-primary btn-sm">
              View Analytics
            </Link>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const VendorDashboard: React.FC<{ user: User }> = ({ user }) => (
  <div className="dashboard-content">
    <h4 className="mb-4" style={{ fontFamily: 'Poppins, sans-serif', fontWeight: '600' }}>
      Vendor Dashboard
    </h4>
    
    <div className="row mb-4">
      <div className="col-md-3">
        <div className="stat-card bg-primary text-white p-3 rounded">
          <div className="stat-value h4 mb-1">{user.totalProducts || 0}</div>
          <div className="stat-label">Total Products</div>
        </div>
      </div>
      <div className="col-md-3">
        <div className="stat-card bg-success text-white p-3 rounded">
          <div className="stat-value h4 mb-1">$12,450</div>
          <div className="stat-label">Monthly Sales</div>
        </div>
      </div>
      <div className="col-md-3">
        <div className="stat-card bg-warning text-white p-3 rounded">
          <div className="stat-value h4 mb-1">45</div>
          <div className="stat-label">Pending Orders</div>
        </div>
      </div>
      <div className="col-md-3">
        <div className="stat-card bg-info text-white p-3 rounded">
          <div className="stat-value h4 mb-1">4.8</div>
          <div className="stat-label">Rating</div>
        </div>
      </div>
    </div>

    <div className="row">
      <div className="col-md-6">
        <div className="card">
          <div className="card-header">
            <h6 className="mb-0">Top Products</h6>
          </div>
          <div className="card-body">
            <div className="product-item d-flex justify-content-between align-items-center mb-3">
              <div>
                <div className="fw-bold">Smart Watch Wood Edition</div>
                <div className="text-muted small">Sales: 156 units</div>
              </div>
              <span className="badge bg-success">Best Seller</span>
            </div>
            <Link href="/account?tab=products" className="btn btn-outline-primary btn-sm">
              Manage Products
            </Link>
          </div>
        </div>
      </div>
      <div className="col-md-6">
        <div className="card">
          <div className="card-header">
            <h6 className="mb-0">Recent Orders</h6>
          </div>
          <div className="card-body">
            <div className="order-item d-flex justify-content-between align-items-center mb-3">
              <div>
                <div className="fw-bold">Order #XB-001</div>
                <div className="text-muted small">3 items - $599.97</div>
              </div>
              <span className="badge bg-warning">Processing</span>
            </div>
            <Link href="/account?tab=orders" className="btn btn-outline-primary btn-sm">
              View All Orders
            </Link>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const PropertyBuyerDashboard: React.FC<{ user: User }> = ({ user }) => (
  <div className="dashboard-content">
    <h4 className="mb-4" style={{ fontFamily: 'Poppins, sans-serif', fontWeight: '600' }}>
      Property Buyer Dashboard
    </h4>
    
    <div className="row mb-4">
      <div className="col-md-3">
        <div className="stat-card bg-primary text-white p-3 rounded">
          <div className="stat-value h4 mb-1">12</div>
          <div className="stat-label">Saved Properties</div>
        </div>
      </div>
      <div className="col-md-3">
        <div className="stat-card bg-success text-white p-3 rounded">
          <div className="stat-value h4 mb-1">5</div>
          <div className="stat-label">Viewings Scheduled</div>
        </div>
      </div>
      <div className="col-md-3">
        <div className="stat-card bg-warning text-white p-3 rounded">
          <div className="stat-value h4 mb-1">8</div>
          <div className="stat-label">Inquiries Sent</div>
        </div>
      </div>
      <div className="col-md-3">
        <div className="stat-card bg-info text-white p-3 rounded">
          <div className="stat-value h4 mb-1">2</div>
          <div className="stat-label">Offers Made</div>
        </div>
      </div>
    </div>

    <div className="row">
      <div className="col-md-6">
        <div className="card">
          <div className="card-header">
            <h6 className="mb-0">Saved Properties</h6>
          </div>
          <div className="card-body">
            <div className="property-item d-flex justify-content-between align-items-center mb-3">
              <div>
                <div className="fw-bold">Luxury 3BR Apartment - JBR</div>
                <div className="text-muted small">AED 2,500,000</div>
              </div>
              <span className="badge bg-primary">Saved</span>
            </div>
            <Link href="/account?tab=saved-properties" className="btn btn-outline-primary btn-sm">
              View Saved Properties
            </Link>
          </div>
        </div>
      </div>
      <div className="col-md-6">
        <div className="card">
          <div className="card-header">
            <h6 className="mb-0">Upcoming Viewings</h6>
          </div>
          <div className="card-body">
            <div className="viewing-item d-flex justify-content-between align-items-center mb-3">
              <div>
                <div className="fw-bold">Villa in Palm Jumeirah</div>
                <div className="text-muted small">Tomorrow 2:00 PM</div>
              </div>
              <span className="badge bg-warning">Scheduled</span>
            </div>
            <Link href="/account?tab=viewings" className="btn btn-outline-primary btn-sm">
              Manage Viewings
            </Link>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const PropertySellerDashboard: React.FC<{ user: User }> = ({ user }) => (
  <div className="dashboard-content">
    <h4 className="mb-4" style={{ fontFamily: 'Poppins, sans-serif', fontWeight: '600' }}>
      Property Seller Dashboard
    </h4>
    
    <div className="row mb-4">
      <div className="col-md-3">
        <div className="stat-card bg-primary text-white p-3 rounded">
          <div className="stat-value h4 mb-1">{user.totalProperties || 0}</div>
          <div className="stat-label">Listed Properties</div>
        </div>
      </div>
      <div className="col-md-3">
        <div className="stat-card bg-success text-white p-3 rounded">
          <div className="stat-value h4 mb-1">156</div>
          <div className="stat-label">Total Views</div>
        </div>
      </div>
      <div className="col-md-3">
        <div className="stat-card bg-warning text-white p-3 rounded">
          <div className="stat-value h4 mb-1">12</div>
          <div className="stat-label">Scheduled Viewings</div>
        </div>
      </div>
      <div className="col-md-3">
        <div className="stat-card bg-info text-white p-3 rounded">
          <div className="stat-value h4 mb-1">8</div>
          <div className="stat-label">Inquiries</div>
        </div>
      </div>
    </div>

    <div className="row">
      <div className="col-md-6">
        <div className="card">
          <div className="card-header">
            <h6 className="mb-0">My Properties</h6>
          </div>
          <div className="card-body">
            <div className="property-item d-flex justify-content-between align-items-center mb-3">
              <div>
                <div className="fw-bold">Luxury 3BR Apartment - JBR</div>
                <div className="text-muted small">AED 2,500,000</div>
              </div>
              <span className="badge bg-success">Active</span>
            </div>
            <Link href="/account?tab=my-properties" className="btn btn-outline-primary btn-sm">
              Manage Properties
            </Link>
          </div>
        </div>
      </div>
      <div className="col-md-6">
        <div className="card">
          <div className="card-header">
            <h6 className="mb-0">Recent Inquiries</h6>
          </div>
          <div className="card-body">
            <div className="inquiry-item d-flex justify-content-between align-items-center mb-3">
              <div>
                <div className="fw-bold">John Smith</div>
                <div className="text-muted small">Interested in Villa</div>
              </div>
              <span className="badge bg-warning">New</span>
            </div>
            <Link href="/account?tab=inquiries" className="btn btn-outline-primary btn-sm">
              View All Inquiries
            </Link>
          </div>
        </div>
      </div>
    </div>
  </div>
);

// Placeholder components for other tabs
const ProfileTab: React.FC<{ user: User }> = ({ user }) => (
  <div className="tab-content">
    <h4 className="mb-4">Profile Settings</h4>
    <p>Profile management content will go here...</p>
  </div>
);

const SettingsTab: React.FC<{ user: User }> = ({ user }) => (
  <div className="tab-content">
    <h4 className="mb-4">Account Settings</h4>
    <p>Account settings content will go here...</p>
  </div>
);

const NotificationsTab: React.FC<{ user: User }> = ({ user }) => (
  <div className="tab-content">
    <h4 className="mb-4">Notifications</h4>
    <p>Notification settings content will go here...</p>
  </div>
);

const SecurityTab: React.FC<{ user: User }> = ({ user }) => (
  <div className="tab-content">
    <h4 className="mb-4">Security</h4>
    <p>Security settings content will go here...</p>
  </div>
);

// E-commerce tabs
const OrdersTab: React.FC<{ user: User }> = ({ user }) => (
  <div className="tab-content">
    <h4 className="mb-4">My Orders</h4>
    <p>Order management content will go here...</p>
  </div>
);

const WishlistTab: React.FC<{ user: User }> = ({ user }) => (
  <div className="tab-content">
    <h4 className="mb-4">Wishlist</h4>
    <p>Wishlist content will go here...</p>
  </div>
);

const AddressesTab: React.FC<{ user: User }> = ({ user }) => (
  <div className="tab-content">
    <h4 className="mb-4">Addresses</h4>
    <p>Address management content will go here...</p>
  </div>
);

// Auction bidder tabs
const BidsTab: React.FC<{ user: User }> = ({ user }) => (
  <div className="tab-content">
    <h4 className="mb-4">My Bids</h4>
    <p>Bid management content will go here...</p>
  </div>
);

const WatchlistTab: React.FC<{ user: User }> = ({ user }) => (
  <div className="tab-content">
    <h4 className="mb-4">Watchlist</h4>
    <p>Watchlist content will go here...</p>
  </div>
);

const BidHistoryTab: React.FC<{ user: User }> = ({ user }) => (
  <div className="tab-content">
    <h4 className="mb-4">Bid History</h4>
    <p>Bid history content will go here...</p>
  </div>
);

// Auction seller tabs
const AuctionsTab: React.FC<{ user: User }> = ({ user }) => (
  <div className="tab-content">
    <h4 className="mb-4">My Auctions</h4>
    <p>Auction management content will go here...</p>
  </div>
);

const CreateAuctionTab: React.FC<{ user: User }> = ({ user }) => (
  <div className="tab-content">
    <h4 className="mb-4">Create Auction</h4>
    <p>Create auction form will go here...</p>
  </div>
);

const AuctionAnalyticsTab: React.FC<{ user: User }> = ({ user }) => (
  <div className="tab-content">
    <h4 className="mb-4">Auction Analytics</h4>
    <p>Auction analytics content will go here...</p>
  </div>
);

// Vendor tabs
const ProductsTab: React.FC<{ user: User }> = ({ user }) => (
  <div className="tab-content">
    <h4 className="mb-4">My Products</h4>
    <p>Product management content will go here...</p>
  </div>
);

const AddProductTab: React.FC<{ user: User }> = ({ user }) => (
  <div className="tab-content">
    <h4 className="mb-4">Add Product</h4>
    <p>Add product form will go here...</p>
  </div>
);

const AnalyticsTab: React.FC<{ user: User }> = ({ user }) => (
  <div className="tab-content">
    <h4 className="mb-4">Analytics</h4>
    <p>Vendor analytics content will go here...</p>
  </div>
);

// Property buyer tabs
const SavedPropertiesTab: React.FC<{ user: User }> = ({ user }) => (
  <div className="tab-content">
    <h4 className="mb-4">Saved Properties</h4>
    <p>Saved properties content will go here...</p>
  </div>
);

const ViewingsTab: React.FC<{ user: User }> = ({ user }) => (
  <div className="tab-content">
    <h4 className="mb-4">Viewings</h4>
    <p>Viewing management content will go here...</p>
  </div>
);

const InquiriesTab: React.FC<{ user: User }> = ({ user }) => (
  <div className="tab-content">
    <h4 className="mb-4">Inquiries</h4>
    <p>Inquiry management content will go here...</p>
  </div>
);

// Property seller tabs
const MyPropertiesTab: React.FC<{ user: User }> = ({ user }) => (
  <div className="tab-content">
    <h4 className="mb-4">My Properties</h4>
    <p>Property management content will go here...</p>
  </div>
);

const AddPropertyTab: React.FC<{ user: User }> = ({ user }) => (
  <div className="tab-content">
    <h4 className="mb-4">Add Property</h4>
    <p>Add property form will go here...</p>
  </div>
);

export default MyAccountPage;
