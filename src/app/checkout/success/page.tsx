import Layout from '@/components/Layout';
import Link from 'next/link';

export default function CheckoutSuccess() {
  return (
    <Layout>
      <div className="checkout-success-page">
        <div className="container py-5">
          <div className="row justify-content-center">
            <div className="col-lg-6">
              <div className="success-card text-center">
                <div className="success-icon mb-4">
                  <i className="fas fa-check-circle" style={{ fontSize: '80px', color: '#28a745' }}></i>
                </div>
                
                <h1 className="success-title mb-3" style={{ 
                  fontFamily: 'Poppins, sans-serif', 
                  fontSize: '32px', 
                  fontWeight: '700',
                  color: '#000'
                }}>
                  Order Confirmed!
                </h1>
                
                <p className="success-message mb-4" style={{ color: '#606060', fontSize: '18px' }}>
                  Thank you for your purchase. Your order has been successfully placed and you will receive a confirmation email shortly.
                </p>
                
                <div className="order-details mb-4 p-4 bg-light rounded">
                  <h6 className="mb-3">Order Details</h6>
                  <div className="row">
                    <div className="col-6">
                      <div className="detail-item">
                        <strong>Order Number:</strong><br />
                        <span className="text-primary">#XB-2024-001234</span>
                      </div>
                    </div>
                    <div className="col-6">
                      <div className="detail-item">
                        <strong>Order Date:</strong><br />
                        <span>{new Date().toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="action-buttons">
                  <Link href="/" className="btn btn-primary me-3">
                    <i className="fas fa-home me-2"></i>
                    Continue Shopping
                  </Link>
                  <Link href="/orders" className="btn btn-outline-primary">
                    <i className="fas fa-list me-2"></i>
                    View Orders
                  </Link>
                </div>
                
                <div className="support-info mt-4 p-3 bg-light rounded">
                  <small className="text-muted">
                    <i className="fas fa-info-circle me-1"></i>
                    Need help? Contact our support team at <a href="mailto:support@xpertbid.com">support@xpertbid.com</a>
                  </small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
