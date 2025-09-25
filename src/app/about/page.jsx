'use client';

import React from 'react';
import Layout from '@/components/Layout';
import Link from 'next/link';

export default function AboutPage() {
  const stats = [
    { number: '50K+', label: 'Happy Customers', icon: 'f-users' },
    { number: '1000+', label: 'Products Sold', icon: 'f-shopping-cart' },
    { number: '500+', label: 'Auctions Completed', icon: 'f-gavel' },
    { number: '24/7', label: 'Customer Support', icon: 'f-headset' },
  ];

  const teamMembers = [
    {
      name: 'John Smith',
      position: 'CEO & Founder',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=face',
      bio: 'With over 15 years of experience in e-commerce, John leads our vision for the future of online marketplaces.',
    },
    {
      name: 'Sarah Johnson',
      position: 'CTO',
      image: 'https://images.unsplash.com/photo-1494790108755-2616b612b5bc?w=300&h=300&fit=crop&crop=face',
      bio: 'Sarah drives our technical innovation and ensures our platform delivers cutting-edge solutions.',
    },
    {
      name: 'Michael Brown',
      position: 'Head of Operations',
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop&crop=face',
      bio: 'Michael oversees our day-to-day operations and ensures smooth platform performance.',
    },
    {
      name: 'Emily Davis',
      position: 'Head of Design',
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=300&fit=crop&crop=face',
      bio: 'Emily leads our design team to create beautiful and user-friendly experiences.',
    },
  ];

  const features = [
    {
      icon: 'f-shield-alt',
      title: 'Secure Transactions',
      description: 'Our platform uses advanced security measures to protect all transactions and user data.',
    },
    {
      icon: 'f-shipping-fast',
      title: 'Fast Delivery',
      description: 'We work with trusted shipping partners to ensure fast and reliable delivery worldwide.',
    },
    {
      icon: 'f-award',
      title: 'Quality Guarantee',
      description: 'All products undergo quality checks and come with our satisfaction guarantee.',
    },
    {
      icon: 'f-headset',
      title: '24/7 Support',
      description: 'Our customer support team is available around the clock to assist you.',
    },
  ];

  return (
    <Layout>
      {/* Hero Section */}
      <div className="about-hero bg-primary text-white py-5">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6">
              <h1 className="display-4 fw-bold mb-4">About XpertBid</h1>
              <p className="lead mb-4">
                We&apos;re revolutionizing the way people buy and sell online through our 
                innovative multi-vendor marketplace and auction platform.
              </p>
              <p className="mb-4">
                Since our founding, we&apos;ve been committed to creating a trusted, 
                secure, and user-friendly environment where buyers and sellers 
                can connect and transact with confidence.
              </p>
              <Link href="/contact" className="btn btn-light btn-lg">
                Get in Touch
                <i className="f-arrow-right ms-2"></i>
              </Link>
            </div>
            <div className="col-lg-6">
              <img
                src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=600&h=400&fit=crop"
                alt="About XpertBid"
                className="img-fluid rounded shadow"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="stats-section py-5 bg-light">
        <div className="container">
          <div className="row">
            {stats.map((stat, index) => (
              <div key={index} className="col-lg-3 col-md-6 mb-4">
                <div className="stat-card text-center">
                  <div className="stat-icon mb-3">
                    <i className={`${stat.icon} fa-3x text-primary`}></i>
                  </div>
                  <h3 className="stat-number mb-2">{stat.number}</h3>
                  <p className="stat-label text-muted">{stat.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Our Story Section */}
      <div className="story-section py-5">
        <div className="container">
          <div className="row">
            <div className="col-lg-6 mb-4">
              <img
                src="https://images.unsplash.com/photo-1556761175-b413da4baf72?w=600&h=400&fit=crop"
                alt="Our Story"
                className="img-fluid rounded shadow"
              />
            </div>
            <div className="col-lg-6 mb-4">
              <h2 className="mb-4">Our Story</h2>
              <p className="mb-4">
                XpertBid w, whether through traditional 
                e-commerce or exciting auction formats.
              </p>
              <p className="mb-4">
                What started . We&apos;ve built 
                our platform with cutting-edge technology and a focus on user experience.
              </p>
              <p className="mb-4">
                Today, we continue to innovate and expand our services, always 
                keeping our users&apos; needs at the center of everything we do.
              </p>
              <div className="story-highlights">
                <div className="highlight-item d-flex align-items-center mb-3">
                  <i className="f-check-circle text-success me-3"></i>
                  <span>Trusted by thousands of users worldwide</span>
                </div>
                <div className="highlight-item d-flex align-items-center mb-3">
                  <i className="f-check-circle text-success me-3"></i>
                  <span>Secure and reliable platform</span>
                </div>
                <div className="highlight-item d-flex align-items-center mb-3">
                  <i className="f-check-circle text-success me-3"></i>
                  <span>Innovative auction and marketplace features</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="features-section py-5 bg-light">
        <div className="container">
          <div className="row mb-5">
            <div className="col-12 text-center">
              <h2 className="mb-3">Why Choose XpertBid?</h2>
              <p className="lead text-muted">
                We provide the tools and features you need for successful online trading
              </p>
            </div>
          </div>
          <div className="row">
            {features.map((feature, index) => (
              <div key={index} className="col-lg-3 col-md-6 mb-4">
                <div className="feature-card h-100 text-center">
                  <div className="feature-icon mb-3">
                    <i className={`${feature.icon} fa-3x text-primary`}></i>
                  </div>
                  <h4 className="feature-title mb-3">{feature.title}</h4>
                  <p className="feature-description text-muted">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Team Section */}
      <div className="team-section py-5">
        <div className="container">
          <div className="row mb-5">
            <div className="col-12 text-center">
              <h2 className="mb-3">Meet Our Team</h2>
              <p className="lead text-muted">
                The passionate people behind XpertBid
              </p>
            </div>
          </div>
          <div className="row">
            {teamMembers.map((member, index) => (
              <div key={index} className="col-lg-3 col-md-6 mb-4">
                <div className="team-card text-center">
                  <div className="team-image mb-3">
                    <img
                      src={member.image}
                      alt={member.name}
                      className="img-fluid rounded-circle"
                      style={{ width: '200px', height: '200px', objectFit: 'cover' }}
                    />
                  </div>
                  <h4 className="team-name mb-2">{member.name}</h4>
                  <p className="team-position text-primary mb-3">{member.position}</p>
                  <p className="team-bio text-muted">{member.bio}</p>
                  <div className="team-social">
                    <a href="#" className="social-link me-2">
                      <i className="fab fa-linkedin-in"></i>
                    </a>
                    <a href="#" className="social-link me-2">
                      <i className="fab fa-twitter"></i>
                    </a>
                    <a href="#" className="social-link">
                      <i className="fab fa-github"></i>
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Mission & Vision Section */}
      <div className="mission-section py-5 bg-primary text-white">
        <div className="container">
          <div className="row">
            <div className="col-lg-6 mb-4">
              <h3 className="mb-4">Our Mission</h3>
              <p className="mb-4">
                To democratize online commerce by providing a platform that empowers 
                individuals and businesses to buy and sell products efficiently, 
                securely, and profitably.
              </p>
              <p>
                We believe everyone should have access to powerful e-commerce tools, 
                regardless of their technical expertise or business size.
              </p>
            </div>
            <div className="col-lg-6 mb-4">
              <h3 className="mb-4">Our Vision</h3>
              <p className="mb-4">
                To become the world&apos;s most trusted and innovative marketplace, 
                where technology meets commerce to create extraordinary experiences 
                for buyers and sellers alike.
              </p>
              <p>
                We envision a future where online trading is seamless, transparent, 
                and accessible to everyone, everywhere.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="cta-section py-5">
        <div className="container">
          <div className="row">
            <div className="col-12 text-center">
              <h2 className="mb-4">Ready to Get Started?</h2>
              <p className="lead text-muted mb-4">
                Join thousands of satisfied users and start your journey with XpertBid today
              </p>
              <div className="cta-buttons">
                <Link href="/register" className="btn btn-primary btn-lg me-3 mb-3">
                  Start Selling
                  <i className="f-arrow-right ms-2"></i>
                </Link>
                <Link href="/shop" className="btn btn-outline-primary btn-lg mb-3">
                  Start Shopping
                  <i className="f-shopping-cart ms-2"></i>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .about-hero {
          background: linear-gradient(135deg, var(--primary-color) 0%, var(--primary-hover) 100%);
        }

        .stat-card {
          padding;
          transition: transform 0.3s ease;
        }

        .stat-card:hover {
          transform: translateY(-5px);
        }

        .stat-number {
          font-size;
          font-weight;
          color: var(--primary-color);
        }

        .stat-label {
          font-size: 1.1rem;
          font-weight;
        }

        .feature-card {
          padding;
          background;
          border-radius: var(--border-radius-lg);
          box-shadow: var(--shadow-sm);
          transition: all 0.3s ease;
        }

        .feature-card:hover {
          transform: translateY(-5px);
          box-shadow: var(--shadow-lg);
        }

        .feature-title {
          font-size: 1.25rem;
          font-weight;
          color: var(--dark-color);
        }

        .team-card {
          padding;
          transition: transform 0.3s ease;
        }

        .team-card:hover {
          transform: translateY(-5px);
        }

        .team-name {
          font-size: 1.25rem;
          font-weight;
          color: var(--dark-color);
        }

        .team-position {
          font-size;
          font-weight;
        }

        .social-link {
          display: inline-flex;
          align-items;
          justify-content;
          width;
          height;
          background: var(--gray-100);
          color: var(--gray-600);
          border-radius: 50%;
          text-decoration;
          transition: all 0.3s ease;
        }

        .social-link:hover {
          background: var(--primary-color);
          color;
          transform: translateY(-2px);
        }

        .mission-section {
          background: linear-gradient(135deg, var(--primary-color) 0%, var(--primary-hover) 100%);
        }

        .highlight-item {
          font-size;
          font-weight;
        }

        .btn-lg {
          padding;
          font-size;
          font-weight;
          text-transform;
          letter-spacing: 0.5px;
        }

        .cta-buttons .btn {
          min-width;
        }

        @media (max-width) {
          .about-hero h1 {
            font-size: 2.5rem;
          }
          
          .stat-number {
            font-size: 2.5rem;
          }
          
          .team-image img {
            width: 150px !important;
            height: 150px !important;
          }
          
          .cta-buttons .btn {
            display;
            width: 100%;
            margin-bottom;
          }
        }
      `}</style>
    </Layout>
  );
}
