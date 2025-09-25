'use client';

import React, { useState, useEffect } from 'react';
import { apiService } from '@/services/api';
import { useCurrency } from '@/contexts/CurrencyLanguageContext';

const OrdersTab = ({ userId }) => {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { formatPrice } = useCurrency();

  useEffect(() => {
    loadOrders();
  }, [userId]);

  const loadOrders = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await apiService.getUserOrders();
      
      if (response.success) {
        setOrders(response.data || []);
      } else {
        setError(response.message || 'Failed to load orders');
      }
    } catch (error) {
      console.error('Error loading orders:', error);
      setError('Failed to load orders. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusBadgeClass = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending':
        return 'bg-warning';
      case 'processing':
        return 'bg-info';
      case 'shipped':
        return 'bg-primary';
      case 'delivered':
        return 'bg-success';
      case 'cancelled':
        return 'bg-danger';
      default:
        return 'bg-secondary';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (isLoading) {
    return (
      <div className="orders-content">
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
          <div className="text-center">
            <div className="spinner-border text-primary mb-3" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="text-muted">Loading your orders...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="orders-content">
        <div className="alert alert-danger" role="alert">
          <i className="fas fa-exclamation-triangle me-2"></i>
          {error}
        </div>
        <button className="btn btn-outline-primary" onClick={loadOrders}>
          <i className="fas fa-refresh me-2"></i>
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="orders-content">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4 className="mb-0">
          <i className="fas fa-shopping-bag me-2 text-primary"></i>
          My Orders
        </h4>
        <span className="badge bg-primary">{orders.length} Orders</span>
      </div>

      {orders.length === 0 ? (
        <div className="card">
          <div className="card-body text-center py-5">
            <i className="fas fa-shopping-bag fa-4x text-muted mb-3"></i>
            <h5 className="text-muted">No Orders Yet</h5>
            <p className="text-muted mb-4">
              You haven't placed any orders yet. Start shopping to see your orders here.
            </p>
            <a href="/shop" className="btn btn-primary">
              <i className="fas fa-shopping-cart me-2"></i>
              Start Shopping
            </a>
          </div>
        </div>
      ) : (
        <div className="row">
          {orders.map((order) => (
            <div key={order.id} className="col-12 mb-4">
              <div className="card">
                <div className="card-header d-flex justify-content-between align-items-center">
                  <div>
                    <h6 className="mb-0">Order #{order.id}</h6>
                    <small className="text-muted">Placed on {formatDate(order.created_at)}</small>
                  </div>
                  <div className="text-end">
                    <span className={`badge ${getStatusBadgeClass(order.status)}`}>
                      {order.status?.toUpperCase()}
                    </span>
                    <div className="mt-1">
                      <strong>{formatPrice(order.total_amount || order.total)}</strong>
                    </div>
                  </div>
                </div>
                <div className="card-body">
                  <div className="row">
                    <div className="col-md-8">
                      <h6>Order Items:</h6>
                      {order.items && order.items.length > 0 ? (
                        <ul className="list-unstyled">
                          {order.items.map((item, index) => (
                            <li key={index} className="d-flex justify-content-between align-items-center py-2 border-bottom">
                              <div>
                                <strong>{item.product_name || item.name}</strong>
                                <br />
                                <small className="text-muted">Qty: {item.quantity}</small>
                              </div>
                              <div className="text-end">
                                <strong>{formatPrice(item.price * item.quantity)}</strong>
                              </div>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-muted">No items found for this order.</p>
                      )}
                    </div>
                    <div className="col-md-4">
                      <h6>Order Summary:</h6>
                      <div className="order-summary">
                        <div className="d-flex justify-content-between">
                          <span>Subtotal:</span>
                          <span>{formatPrice(order.subtotal || order.total)}</span>
                        </div>
                        <div className="d-flex justify-content-between">
                          <span>Shipping:</span>
                          <span>{formatPrice(order.shipping_cost || 0)}</span>
                        </div>
                        <div className="d-flex justify-content-between">
                          <span>Tax:</span>
                          <span>{formatPrice(order.tax_amount || 0)}</span>
                        </div>
                        <hr />
                        <div className="d-flex justify-content-between">
                          <strong>Total:</strong>
                          <strong>{formatPrice(order.total_amount || order.total)}</strong>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="card-footer">
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <small className="text-muted">
                        <i className="fas fa-map-marker-alt me-1"></i>
                        {order.shipping_address || 'Address not available'}
                      </small>
                    </div>
                    <div>
                      <button className="btn btn-outline-primary btn-sm me-2">
                        <i className="fas fa-eye me-1"></i>
                        View Details
                      </button>
                      {order.status === 'delivered' && (
                        <button className="btn btn-outline-success btn-sm">
                          <i className="fas fa-star me-1"></i>
                          Review
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <style jsx>{`
        .orders-content .card {
          transition: all 0.3s ease;
        }
        
        .orders-content .card:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }
        
        .order-summary {
          background: #f8f9fa;
          padding: 1rem;
          border-radius: 0.375rem;
        }
        
        .order-summary > div {
          margin-bottom: 0.5rem;
        }
        
        .order-summary hr {
          margin: 0.75rem 0;
        }
      `}</style>
    </div>
  );
};

export default OrdersTab;
