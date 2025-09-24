'use client';

import React, { useState } from 'react';
import Layout from '@/components/Layout';
import MyAccountPage from '@/components/MyAccountPage';
import { User } from '@/types';

interface SampleUser extends User {
  joinedDate: string;
  totalOrders?: number;
  totalBids?: number;
  totalAuctions?: number;
  totalProducts?: number;
  totalProperties?: number;
}

const AccountDemoPage = () => {
  const [selectedRole, setSelectedRole] = useState('ecommerce');

  const userRoles = [
    {
      id: 'ecommerce',
      name: 'E-commerce Customer',
      description: 'Regular customer buying products online',
      icon: 'fas fa-shopping-bag',
      color: 'primary'
    },
    {
      id: 'bidder',
      name: 'Auction Bidder',
      description: 'User who participates in auctions as a bidder',
      icon: 'fas fa-gavel',
      color: 'warning'
    },
    {
      id: 'auction_seller',
      name: 'Auction Seller',
      description: 'User who creates and manages auction listings',
      icon: 'fas fa-hammer',
      color: 'danger'
    },
    {
      id: 'vendor',
      name: 'Vendor',
      description: 'Business selling multiple products on the platform',
      icon: 'fas fa-store',
      color: 'success'
    },
    {
      id: 'property_buyer',
      name: 'Property Buyer',
      description: 'User looking to buy properties/real estate',
      icon: 'fas fa-home',
      color: 'info'
    },
    {
      id: 'property_seller',
      name: 'Property Seller',
      description: 'User selling properties/real estate',
      icon: 'fas fa-building',
      color: 'secondary'
    }
  ];

  const sampleUsers: Record<string, SampleUser> = {
    ecommerce: {
      id: 1,
      name: 'John Doe',
      email: 'john.doe@example.com',
      tenant_id: 1,
      status: 'active',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100',
      role: 'ecommerce',
      created_at: '2024-01-15T00:00:00Z',
      updated_at: '2024-01-15T00:00:00Z',
      joinedDate: '2024-01-15',
      totalOrders: 12
    },
    bidder: {
      id: 2,
      name: 'Sarah Wilson',
      email: 'sarah.wilson@example.com',
      tenant_id: 1,
      status: 'active',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100',
      role: 'bidder',
      created_at: '2024-02-10T00:00:00Z',
      updated_at: '2024-02-10T00:00:00Z',
      joinedDate: '2024-02-10',
      totalBids: 8
    },
    auction_seller: {
      id: 3,
      name: 'Michael Chen',
      email: 'michael.chen@example.com',
      tenant_id: 1,
      status: 'active',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100',
      role: 'auction_seller',
      created_at: '2024-01-05T00:00:00Z',
      updated_at: '2024-01-05T00:00:00Z',
      joinedDate: '2024-01-05',
      totalAuctions: 3
    },
    vendor: {
      id: 4,
      name: 'Emma Thompson',
      email: 'emma.thompson@example.com',
      tenant_id: 1,
      status: 'active',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100',
      role: 'vendor',
      created_at: '2023-12-20T00:00:00Z',
      updated_at: '2023-12-20T00:00:00Z',
      joinedDate: '2023-12-20',
      totalProducts: 25
    },
    property_buyer: {
      id: 5,
      name: 'David Rodriguez',
      email: 'david.rodriguez@example.com',
      tenant_id: 1,
      status: 'active',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100',
      role: 'property_buyer',
      created_at: '2024-03-01T00:00:00Z',
      updated_at: '2024-03-01T00:00:00Z',
      joinedDate: '2024-03-01',
      totalProperties: 0
    },
    property_seller: {
      id: 6,
      name: 'Lisa Anderson',
      email: 'lisa.anderson@example.com',
      tenant_id: 1,
      status: 'active',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100',
      role: 'property_seller',
      created_at: '2024-01-25T00:00:00Z',
      updated_at: '2024-01-25T00:00:00Z',
      joinedDate: '2024-01-25',
      totalProperties: 5
    }
  };

  return (
    <Layout>
      <div className="account-demo-page">
        <div className="container py-4">
          {/* Header */}
          <div className="row mb-4">
            <div className="col-12">
              <h1 className="text-center mb-4" style={{ 
                fontFamily: 'Poppins, sans-serif', 
                fontSize: '32px', 
                fontWeight: '700',
                color: '#000'
              }}>
                My Account - Role Demo
              </h1>
              <p className="text-center text-muted mb-4">
                Explore different user account types and their specific functionalities
              </p>
            </div>
          </div>

          {/* Role Selection */}
          <div className="role-selector mb-4">
            <div className="row">
              {userRoles.map((role) => (
                <div key={role.id} className="col-lg-4 col-md-6 mb-3">
                  <div 
                    className={`role-card card h-100 cursor-pointer ${selectedRole === role.id ? 'border-primary' : ''}`}
                    onClick={() => setSelectedRole(role.id)}
                    style={{ 
                      cursor: 'pointer',
                      border: selectedRole === role.id ? '2px solid #43ACE9' : '1px solid #dee2e6',
                      transition: 'all 0.3s ease'
                    }}
                  >
                    <div className="card-body text-center">
                      <div className={`role-icon mb-3 text-${role.color}`}>
                        <i className={`${role.icon}`} style={{ fontSize: '48px' }}></i>
                      </div>
                      <h5 className="card-title" style={{ fontFamily: 'Poppins, sans-serif', fontWeight: '600' }}>
                        {role.name}
                      </h5>
                      <p className="card-text text-muted small">
                        {role.description}
                      </p>
                      {selectedRole === role.id && (
                        <div className="selected-indicator">
                          <i className="fas fa-check-circle text-primary"></i>
                          <span className="ms-2 text-primary fw-bold">Selected</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Current Role Info */}
          <div className="current-role-info mb-4">
            <div className="alert alert-info">
              <div className="row align-items-center">
                <div className="col-md-8">
                  <h6 className="mb-1">
                    <i className={`${userRoles.find(r => r.id === selectedRole)?.icon} me-2`}></i>
                    Currently viewing: {userRoles.find(r => r.id === selectedRole)?.name}
                  </h6>
                  <p className="mb-0 small">
                    {userRoles.find(r => r.id === selectedRole)?.description}
                  </p>
                </div>
                <div className="col-md-4 text-end">
                  <button 
                    className="btn btn-primary"
                    onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                  >
                    <i className="fas fa-eye me-2"></i>
                    View Account
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Account Page */}
          <div className="account-preview">
            <MyAccountPage user={sampleUsers[selectedRole as keyof typeof sampleUsers]} />
          </div>
        </div>
      </div>

      <style jsx>{`
        .role-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        }
        
        .selected-indicator {
          margin-top: 10px;
        }
        
        .cursor-pointer {
          cursor: pointer;
        }
      `}</style>
    </Layout>
  );
};

export default AccountDemoPage;
