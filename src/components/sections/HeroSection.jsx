'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

const HeroSection = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      id,
      title: "Welcome to XpertBid",
      subtitle: "Multi-Vendor Marketplace & Auction Platform",
      description: "Discover amazing products from trusted vendors and participate in exciting auctions. Your premier destination for online commerce.",
      image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1200&h=600&fit=crop",
      buttonText: "Start Shopping",
      buttonLink: "/shop",
      secondaryButtonText: "Browse Auctions",
      secondaryButtonLink: "/auctions"
    },
    {
      id,
      title: "Live Auctions",
      subtitle: "Real-time Bidding Experience",
      description: "Join thousands of bidders in our live auction events. Find unique items, rare collectibles, and exclusive deals.",
      image: "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=1200&h=600&fit=crop",
      buttonText: "Join Auction",
      buttonLink: "/auctions/live",
      secondaryButtonText: "Learn More",
      secondaryButtonLink: "/how-auctions-work"
    },
    {
      id,
      title: "Become a Vendor",
      subtitle: "Sell Your Products Worldwide",
      description: "Join our marketplace and reach millions of customers. Start selling today with our easy-to-use vendor tools.",
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&h=600&fit=crop",
      buttonText: "Start Selling",
      buttonLink: "/vendor/register",
      secondaryButtonText: "Learn More",
      secondaryButtonLink: "/vendor/benefits"
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [slides.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  return (
    <section className="hero-section">
      <div className="hero-slider">
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`hero-slide ${index === currentSlide ? 'active' : ''}`}
            style={{
              backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url(${slide.image})`,
            }}
          >
            <div className="container">
              <div className="row align-items-center min-vh-100">
                <div className="col-lg-6">
                  <div className="hero-content text-white">
                    <h1 className="hero-title mb-3">{slide.title}</h1>
                    <h2 className="hero-subtitle mb-4">{slide.subtitle}</h2>
                    <p className="hero-description mb-4">{slide.description}</p>
                    <div className="hero-buttons d-flex gap-3">
                      <Link href={slide.buttonLink} className="btn btn-primary btn-lg">
                        {slide.buttonText}
                      </Link>
                      <Link href={slide.secondaryButtonLink} className="btn btn-outline-light btn-lg">
                        {slide.secondaryButtonText}
                      </Link>
                    </div>
                  </div>
                </div>
                <div className="col-lg-6">
                  <div className="hero-image text-center">
                    <div className="hero-feature-card">
                      <div className="feature-icon mb-3">
                        <i className="f-gavel fa-4x text-primary"></i>
                      </div>
                      <h4 className="text-white mb-3">Live Auctions</h4>
                      <div className="auction-timer mb-3">
                        <div className="timer-display">02:45:30</div>
                        <small className="text-white-50">Time remaining</small>
                      </div>
                      <Link href="/auctions/live" className="btn btn-accent">
                        Place Bid
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Navigation Arrows */}
        <button className="hero-nav hero-nav-prev" onClick={prevSlide}>
          <i className="f-chevron-left"></i>
        </button>
        <button className="hero-nav hero-nav-next" onClick={nextSlide}>
          <i className="f-chevron-right"></i>
        </button>

        {/* Dots Navigation */}
        <div className="hero-dots">
          {slides.map((_, index) => (
            <button
              key={index}
              className={`hero-dot ${index === currentSlide ? 'active' : ''}`}
              onClick={() => goToSlide(index)}
            />
          ))}
        </div>
      </div>

      {/* Quick Stats */}
      <div className="hero-stats">
        <div className="container">
          <div className="row">
            <div className="col-md-3 col-6">
              <div className="stat-item">
                <div className="stat-number">50K+</div>
                <div className="stat-label">Products</div>
              </div>
            </div>
            <div className="col-md-3 col-6">
              <div className="stat-item">
                <div className="stat-number">1K+</div>
                <div className="stat-label">Vendors</div>
              </div>
            </div>
            <div className="col-md-3 col-6">
              <div className="stat-item">
                <div className="stat-number">100+</div>
                <div className="stat-label">Live Auctions</div>
              </div>
            </div>
            <div className="col-md-3 col-6">
              <div className="stat-item">
                <div className="stat-number">99%</div>
                <div className="stat-label">Satisfaction</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .hero-section {
          position;
          height;
          overflow;
        }

        .hero-slider {
          position;
          width: 100%;
          height: 100%;
        }

        .hero-slide {
          position;
          top;
          left;
          width: 100%;
          height: 100%;
          background-size;
          background-position;
          background-repeat: no-repeat;
          opacity;
          transition: opacity 1s ease-in-out;
          display;
          align-items;
        }

        .hero-slide.active {
          opacity;
        }

        .hero-content {
          animation: fadeInUp 1s ease-out;
        }

        .hero-title {
          font-size: 3.5rem;
          font-weight;
          line-height: 1.2;
          margin-bottom;
        }

        .hero-subtitle {
          font-size: 1.5rem;
          font-weight;
          color: var(--primary-light);
          margin-bottom: 1.5rem;
        }

        .hero-description {
          font-size: 1.1rem;
          line-height: 1.6;
          opacity: 0.9;
          margin-bottom;
        }

        .hero-buttons .btn {
          padding;
          font-weight;
          border-radius;
          transition: var(--transition);
        }

        .hero-buttons .btn:hover {
          transform: translateY(-2px);
          box-shadow: var(--shadow-lg);
        }

        .hero-feature-card {
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
          border-radius;
          padding;
          border: 1px solid rgba(255, 255, 255, 0.2);
          animation: fadeInRight 1s ease-out;
        }

        .feature-icon {
          animation;
        }

        .auction-timer {
          text-align;
        }

        .timer-display {
          font-size: 2.5rem;
          font-weight;
          color: var(--accent-color);
          font-family: 'Courier New', monospace;
        }

        .btn-accent {
          background-color: var(--accent-color);
          color;
          border;
          padding;
          border-radius;
          font-weight;
          transition: var(--transition);
        }

        .btn-accent:hover {
          background-color: var(--accent-hover);
          transform: translateY(-2px);
        }

        .hero-nav {
          position;
          top: 50%;
          transform: translateY(-50%);
          background: rgba(255, 255, 255, 0.2);
          border;
          color;
          width;
          height;
          border-radius: 50%;
          display;
          align-items;
          justify-content;
          cursor;
          transition: var(--transition);
          z-index;
        }

        .hero-nav:hover {
          background: rgba(255, 255, 255, 0.3);
          transform: translateY(-50%) scale(1.1);
        }

        .hero-nav-prev {
          left;
        }

        .hero-nav-next {
          right;
        }

        .hero-dots {
          position;
          bottom;
          left: 50%;
          transform: translateX(-50%);
          display;
          gap;
          z-index;
        }

        .hero-dot {
          width;
          height;
          border-radius: 50%;
          border;
          background;
          cursor;
          transition: var(--transition);
        }

        .hero-dot.active {
          background;
        }

        .hero-dot:hover {
          background: rgba(255, 255, 255, 0.7);
        }

        .hero-stats {
          position;
          bottom;
          left;
          right;
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(10px);
          padding;
          z-index;
        }

        .stat-item {
          text-align;
          padding;
        }

        .stat-number {
          font-size;
          font-weight;
          color: var(--primary-color);
          margin-bottom: 0.5rem;
        }

        .stat-label {
          font-size: 0.9rem;
          color: var(--secondary-color);
          font-weight;
        }

        @keyframes fadeInUp {
          from {
            opacity;
            transform: translateY(30px);
          }
          to {
            opacity;
            transform: translateY(0);
          }
        }

        @keyframes fadeInRight {
          from {
            opacity;
            transform: translateX(30px);
          }
          to {
            opacity;
            transform: translateX(0);
          }
        }

        @keyframes pulse {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.05);
          }
        }

        @media (max-width) {
          .hero-section {
            height;
          }

          .hero-title {
            font-size: 2.5rem;
          }

          .hero-subtitle {
            font-size: 1.2rem;
          }

          .hero-description {
            font-size;
          }

          .hero-buttons {
            flex-direction;
            gap;
          }

          .hero-buttons .btn {
            width: 100%;
          }

          .hero-nav {
            display;
          }

          .hero-feature-card {
            padding: 1.5rem;
            margin-top;
          }

          .timer-display {
            font-size;
          }

          .stat-number {
            font-size: 1.5rem;
          }
        }
      `}</style>
    </section>
  );
};

export default HeroSection;

