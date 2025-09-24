'use client';

import React from 'react';

const FeaturesSection: React.FC = () => {
  const features = [
    {
      id: 1,
      icon: 'fas fa-store',
      title: 'Multi-Vendor Marketplace',
      description: 'Comprehensive marketplace ecosystem supporting multiple vendors with individual storefronts and management tools.',
      color: 'primary'
    },
    {
      id: 2,
      icon: 'fas fa-gavel',
      title: 'Advanced Auctions',
      description: 'Real-time bidding system with multiple auction types, automated processes, and comprehensive bid management.',
      color: 'danger'
    },
    {
      id: 3,
      icon: 'fas fa-mobile-alt',
      title: 'Mobile Applications',
      description: 'Native Flutter apps for customers, vendors, and delivery partners with offline capabilities and push notifications.',
      color: 'success'
    },
    {
      id: 4,
      icon: 'fas fa-shield-alt',
      title: 'Secure Payments',
      description: 'Multiple payment gateways with SSL encryption and fraud protection for safe and secure transactions.',
      color: 'info'
    },
    {
      id: 5,
      icon: 'fas fa-shipping-fast',
      title: 'Fast Delivery',
      description: 'Integrated logistics with real-time tracking, multiple shipping options, and delivery partner network.',
      color: 'warning'
    },
    {
      id: 6,
      icon: 'fas fa-headset',
      title: '24/7 Support',
      description: 'Round-the-clock customer support with live chat, email, and phone support for all users.',
      color: 'secondary'
    }
  ];

  const getColorClass = (color: string) => {
    const colorClasses: { [key: string]: string } = {
      'primary': 'feature-primary',
      'danger': 'feature-danger',
      'success': 'feature-success',
      'info': 'feature-info',
      'warning': 'feature-warning',
      'secondary': 'feature-secondary'
    };
    return colorClasses[color] || 'feature-primary';
  };

  return (
    <section className="features-section py-5">
      <div className="container">
        <div className="row">
          <div className="col-12">
            <div className="section-header text-center mb-5">
              <h2 className="section-title">Platform Features</h2>
              <p className="section-subtitle">Everything you need for a successful online business</p>
            </div>
          </div>
        </div>

        <div className="row">
          {features.map((feature) => (
            <div key={feature.id} className="col-lg-4 col-md-6 mb-4">
              <div className={`feature-card ${getColorClass(feature.color)}`}>
                <div className="feature-icon">
                  <i className={feature.icon}></i>
                </div>
                <div className="feature-content">
                  <h4 className="feature-title">{feature.title}</h4>
                  <p className="feature-description">{feature.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Stats Section */}
        <div className="stats-section mt-5">
          <div className="row">
            <div className="col-12">
              <div className="stats-container">
                <div className="row">
                  <div className="col-lg-3 col-md-6 mb-4">
                    <div className="stat-item">
                      <div className="stat-icon">
                        <i className="fas fa-users"></i>
                      </div>
                      <div className="stat-content">
                        <div className="stat-number">50K+</div>
                        <div className="stat-label">Active Users</div>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-3 col-md-6 mb-4">
                    <div className="stat-item">
                      <div className="stat-icon">
                        <i className="fas fa-store"></i>
                      </div>
                      <div className="stat-content">
                        <div className="stat-number">1K+</div>
                        <div className="stat-label">Vendors</div>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-3 col-md-6 mb-4">
                    <div className="stat-item">
                      <div className="stat-icon">
                        <i className="fas fa-box"></i>
                      </div>
                      <div className="stat-content">
                        <div className="stat-number">100K+</div>
                        <div className="stat-label">Products</div>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-3 col-md-6 mb-4">
                    <div className="stat-item">
                      <div className="stat-icon">
                        <i className="fas fa-gavel"></i>
                      </div>
                      <div className="stat-content">
                        <div className="stat-number">500+</div>
                        <div className="stat-label">Auctions</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .features-section {
          background: white;
        }

        .section-header {
          margin-bottom: 3rem;
        }

        .section-title {
          font-size: 2.5rem;
          font-weight: 700;
          color: var(--secondary-color);
          margin-bottom: 1rem;
        }

        .section-subtitle {
          font-size: 1.1rem;
          color: var(--gray-600);
          margin-bottom: 0;
        }

        .feature-card {
          background: white;
          border-radius: var(--border-radius-xl);
          padding: 2rem;
          text-align: center;
          box-shadow: var(--shadow-sm);
          transition: var(--transition);
          height: 100%;
          border-top: 4px solid var(--primary-color);
          position: relative;
          overflow: hidden;
        }

        .feature-card:hover {
          transform: translateY(-5px);
          box-shadow: var(--shadow-lg);
        }

        .feature-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 4px;
          background: var(--primary-color);
          transition: var(--transition);
        }

        .feature-card:hover::before {
          height: 6px;
        }

        .feature-primary::before { background: var(--primary-color); }
        .feature-danger::before { background: var(--danger-color); }
        .feature-success::before { background: var(--success-color); }
        .feature-info::before { background: var(--info-color); }
        .feature-warning::before { background: var(--warning-color); }
        .feature-secondary::before { background: var(--secondary-color); }

        .feature-icon {
          margin-bottom: 1.5rem;
        }

        .feature-icon i {
          font-size: 3rem;
          color: var(--primary-color);
          transition: var(--transition);
        }

        .feature-primary .feature-icon i { color: var(--primary-color); }
        .feature-danger .feature-icon i { color: var(--danger-color); }
        .feature-success .feature-icon i { color: var(--success-color); }
        .feature-info .feature-icon i { color: var(--info-color); }
        .feature-warning .feature-icon i { color: var(--warning-color); }
        .feature-secondary .feature-icon i { color: var(--secondary-color); }

        .feature-card:hover .feature-icon i {
          transform: scale(1.1);
        }

        .feature-content {
          text-align: center;
        }

        .feature-title {
          font-size: 1.25rem;
          font-weight: 600;
          color: var(--secondary-color);
          margin-bottom: 1rem;
        }

        .feature-description {
          color: var(--gray-600);
          line-height: 1.6;
          margin-bottom: 0;
        }

        .stats-section {
          margin-top: 4rem;
          padding-top: 3rem;
          border-top: 1px solid var(--gray-200);
        }

        .stats-container {
          background: linear-gradient(135deg, var(--primary-color) 0%, var(--primary-hover) 100%);
          border-radius: var(--border-radius-xl);
          padding: 3rem 2rem;
          color: white;
        }

        .stat-item {
          display: flex;
          align-items: center;
          gap: 1rem;
          text-align: left;
        }

        .stat-icon {
          flex-shrink: 0;
        }

        .stat-icon i {
          font-size: 2.5rem;
          color: rgba(255, 255, 255, 0.9);
        }

        .stat-content {
          flex: 1;
        }

        .stat-number {
          font-size: 2rem;
          font-weight: 700;
          margin-bottom: 0.25rem;
          color: white;
        }

        .stat-label {
          font-size: 0.9rem;
          color: rgba(255, 255, 255, 0.8);
          font-weight: 500;
        }

        @media (max-width: 768px) {
          .section-title {
            font-size: 2rem;
          }

          .feature-card {
            padding: 1.5rem;
          }

          .feature-icon i {
            font-size: 2.5rem;
          }

          .feature-title {
            font-size: 1.1rem;
          }

          .stats-container {
            padding: 2rem 1rem;
          }

          .stat-item {
            text-align: center;
            flex-direction: column;
            gap: 0.5rem;
          }

          .stat-icon i {
            font-size: 2rem;
          }

          .stat-number {
            font-size: 1.5rem;
          }
        }

        @media (max-width: 576px) {
          .feature-card {
            padding: 1.25rem;
          }

          .feature-icon i {
            font-size: 2rem;
          }

          .stats-container {
            padding: 1.5rem 1rem;
          }
        }
      `}</style>
    </section>
  );
};

export default FeaturesSection;
