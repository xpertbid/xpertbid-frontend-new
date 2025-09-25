'use client';

import React, { useEffect, useState } from 'react';
import Layout from '@/components/Layout';
import { useAuth } from '@/contexts/AuthContext';
import { apiService } from '@/services/api';
import { Order } from '@/types';
import Link from 'next/link';

export default function OrdersPage() {
  const { user, isAuthenticated } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isAuthenticated && user) {
      fetchOrders();
    }
  }, [isAuthenticated, user]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await apiService.getUserOrders();
      
      if (response.success) {
        setOrders(response.data);
      } else {
        setError('Failed to fetch order history');
      }
    } catch (err) {
      console.error('Error fetching orders:', err);
      setError('Failed to fetch order history');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return 'success';
      case 'pending':
        return 'warning';
      case 'processing':
        return 'info';
      case 'cancelled':
        return 'danger';
      case 'shipped':
        return 'primary';
      default:
        return 'secondary';
    }
  };

  if (!isAuthenticated) {
    return (
      <Layout>
        <div className="container py-5">
          <div className="row justify-content-center">
            <div className="col-md-6 text-center">
              <div className="card">
                <div className="card-body py-5">
                  <i className="fas fa-shopping-bag fa-5x text-muted mb-4"></i>
                  <h3 className="mb-3">Please Login</h3>
                  <p className="text-muted mb-4">You need to be logged in to view your order history.</p>
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

  return (
    <Layout>
      {/* Hero Banner */}
      <div className="orders-hero">
        <div className="container">
          <div className="row">
            <div className="col-12">
              <div className="hero-content">
                <h1 className="hero-title">My Orders</h1>
                <nav aria-label="breadcrumb">
                  <ol className="breadcrumb">
                    <li className="breadcrumb-item"><Link href="/">Home</Link></li>
                    <li className="breadcrumb-item active" aria-current="page">My Orders</li>
                  </ol>
                </nav>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container py-5">
        <div className="row">
          <div className="col-12">
            <div className="orders-header mb-4">
              <h2>Order History</h2>
              <p className="text-muted">Track all your purchases and their status.</p>
            </div>

            {loading ? (
              <div className="text-center py-5">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
                <p className="mt-3">Loading your orders...</p>
              </div>
            ) : error ? (
              <div className="alert alert-danger" role="alert">
                {error}
              </div>
            ) : orders.length === 0 ? (
              <div className="text-center py-5">
                <i className="fas fa-shopping-bag fa-3x text-muted mb-3"></i>
                <h5 className="text-muted">No Orders Yet</h5>
                <p className="text-muted">You haven&apos;t placed any orders yet. Start shopping!</p>
                <Link href="/shop" className="btn btn-primary">
                  Start Shopping
                </Link>
              </div>
            ) : (
              <div className="table-responsive">
                <table className="table table-hover">
                  <thead className="table-light">
                    <tr>
                      <th>Order #</th>
                      <th>Date</th>
                      <th>Status</th>
                      <th>Total</th>
                      <th>Payment</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((order) => (
                      <tr key={order.id} className="order-row">
                        <td>
                          <strong>#{order.id}</strong>
                        </td>
                        <td>{formatDate(order.created_at)}</td>
                        <td>
                          <span className={`badge bg-${getStatusColor(order.status)}`}>
                            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                          </span>
                        </td>
                        <td>
                          <strong>{formatCurrency(order.total_amount)}</strong>
                        </td>
                        <td>
                          <span className={`badge bg-${order.payment_status === 'paid' ? 'success' : 'warning'}`}>
                            {order.payment_status}
                          </span>
                        </td>
                        <td>
                          <div className="btn-group" role="group">
                            <Link 
                              href={`/orders/${order.id}`} 
                              className="btn btn-sm btn-outline-primary"
                            >
                              View
                            </Link>
                            {order.status === 'completed' && (
                              <button className="btn btn-sm btn-outline-secondary">
                                Reorder
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Order Summary */}
            {orders.length > 0 && (
              <div className="row mt-5">
                <div className="col-md-4">
                  <div className="order-summary-card">
                    <div className="summary-icon">
                      <i className="fas fa-shopping-bag"></i>
                    </div>
                    <div className="summary-content">
                      <h5>Total Orders</h5>
                      <p className="summary-number">{orders.length}</p>
                    </div>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="order-summary-card">
                    <div className="summary-icon">
                      <i className="fas fa-dollar-sign"></i>
                    </div>
                    <div className="summary-content">
                      <h5>Total Spent</h5>
                      <p className="summary-number">
                        {formatCurrency(orders.reduce((sum, order) => sum + order.total_amount, 0))}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="order-summary-card">
                    <div className="summary-icon">
                      <i className="fas fa-check-circle"></i>
                    </div>
                    <div className="summary-content">
                      <h5>Completed</h5>
                      <p className="summary-number">
                        {orders.filter(order => order.status === 'completed').length}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        .orders-hero {
          background: linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), 
                      url('https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1200&h=400&fit=crop') center/cover;
          padding: 80px 0;
          color: white;
        }

        .hero-title {
          font-size: 3rem;
          font-weight: 700;
          margin-bottom: 1rem;
        }

        .breadcrumb {
          margin-bottom: 0;
        }

        .breadcrumb-item a {
          color: white;
          text-decoration: none;
        }

        .breadcrumb-item.active {
          color: rgba(255, 255, 255, 0.8);
        }

        .orders-header h2 {
          color: #333;
          font-weight: 700;
          margin-bottom: 0.5rem;
        }

        .table {
          background: white;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        }

        .table th {
          border-top: none;
          font-weight: 600;
          color: #333;
          background: #f8f9fa;
          padding: 1rem;
        }

        .table td {
          padding: 1rem;
          vertical-align: middle;
          border-top: 1px solid #e9ecef;
        }

        .order-row:hover {
          background-color: #f8f9fa;
        }

        .btn-group .btn {
          margin-right: 0.25rem;
        }

        .btn-group .btn:last-child {
          margin-right: 0;
        }

        .order-summary-card {
          background: white;
          border: 1px solid #e9ecef;
          border-radius: 12px;
          padding: 2rem;
          text-align: center;
          transition: all 0.3s ease;
          height: 100%;
        }

        .order-summary-card:hover {
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          transform: translateY(-2px);
        }

        .summary-icon {
          width: 60px;
          height: 60px;
          background: #f8f9fa;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 1rem auto;
        }

        .summary-icon i {
          font-size: 1.5rem;
          color: #007bff;
        }

        .summary-content h5 {
          color: #333;
          font-weight: 600;
          margin-bottom: 0.5rem;
        }

        .summary-number {
          font-size: 1.5rem;
          font-weight: 700;
          color: #007bff;
          margin: 0;
        }

        .badge {
          font-size: 0.75rem;
          padding: 0.5rem 0.75rem;
          border-radius: 20px;
        }

        @media (max-width: 768px) {
          .hero-title {
            font-size: 2rem;
          }
          
          .table-responsive {
            font-size: 0.875rem;
          }
          
          .order-summary-card {
            margin-bottom: 1rem;
          }
        }
      `}</style>
    </Layout>
  );
}
