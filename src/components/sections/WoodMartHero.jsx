'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
// import Image from 'next/image';



const WoodMartHero = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides= [
    {
      id: 1,
      title: "XpertBid Marketplace",
      subtitle: "Shop Everything",
      description: "Discover amazing products, bid on auctions, find properties, and buy vehicles all in one place.",
      buttonText: "Start Shopping",
      buttonLink: "/shop",
      image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1920&h=1080&fit=crop",
      overlay: true
    },
    {
      id: 2,
      title: "Live Auctions",
      subtitle: "Bid & Win",
      description: "Participate in exciting live auctions and win amazing deals on premium products.",
      buttonText: "View Auctions",
      buttonLink: "/auctions",
      image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=1920&h=1080&fit=crop",
      overlay: true
    },
    {
      id: 3,
      title: "Properties & Vehicles",
      subtitle: "Real Estate & Auto",
      description: "Find your dream home or the perfect vehicle from our extensive listings.",
      buttonText: "Browse Listings",
      buttonLink: "/properties",
      image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1920&h=1080&fit=crop",
      overlay: true
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [slides.length]);

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  const goToPrevious = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const goToNext = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  return (
    <section className="woodmart-hero">
      <div className="hero-slider">
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`hero-slide ${index === currentSlide ? 'active' : ''}`}
            style={{
              backgroundImage: `url(${slide.image})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat'
            }}
          >
            {slide.overlay && <div className="hero-overlay"></div>}
            <div className="container">
              <div className="row align-items-center min-vh-100">
                <div className="col-lg-6">
                  <div className="hero-content">
                    <span className="hero-subtitle">{slide.subtitle}</span>
                    <h1 className="hero-title">{slide.title}</h1>
                    <p className="hero-description">{slide.description}</p>
                    <Link href={slide.buttonLink} className="hero-btn">
                      {slide.buttonText}
                      <i className="f-arrow-right ms-2"></i>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      <button className="hero-nav hero-nav-prev" onClick={goToPrevious}>
        <i className="f-chevron-left"></i>
      </button>
      <button className="hero-nav hero-nav-next" onClick={goToNext}>
        <i className="f-chevron-right"></i>
      </button>

      {/* Slide Indicators */}
      <div className="hero-indicators">
        {slides.map((_, index) => (
          <button
            key={index}
            className={`hero-indicator ${index === currentSlide ? 'active' : ''}`}
            onClick={() => goToSlide(index)}
          />
        ))}
      </div>

      <style jsx>{`
        .woodmart-hero {
          position;
          height;
          overflow;
        }

        .hero-slider {
          position;
          height: 100%;
        }

        .hero-slide {
          position;
          top;
          left;
          width: 100%;
          height: 100%;
          opacity;
          transition: opacity 0.8s ease-in-out;
          display;
          align-items;
        }

        .hero-slide.active {
          opacity;
        }

        .hero-overlay {
          position;
          top;
          left;
          width: 100%;
          height: 100%;
          background: linear-gradient(
            135deg,
            rgba(26, 26, 26, 0.7) 0%,
            rgba(51, 51, 51, 0.5) 50%,
            rgba(26, 26, 26, 0.3) 100%
          );
          z-index;
        }

        .hero-content {
          position;
          z-index;
          color;
          max-width;
        }

        .hero-subtitle {
          display: inline-block;
          font-family: var(--font-family-heading);
          font-size;
          font-weight;
          text-transform;
          letter-spacing;
          color: var(--primary-color);
          margin-bottom;
          background: rgba(255, 255, 255, 0.1);
          padding;
          border-radius: var(--border-radius-sm);
          backdrop-filter: blur(10px);
        }

        .hero-title {
          font-family: var(--font-family-heading);
          font-size;
          font-weight;
          line-height: 1.1;
          margin-bottom;
          text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
        }

        .hero-description {
          font-family: var(--font-family);
          font-size;
          line-height: 1.6;
          margin-bottom;
          opacity: 0.9;
          text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.3);
        }

        .hero-btn {
          display: inline-flex;
          align-items;
          font-family: var(--font-family-heading);
          font-size;
          font-weight;
          text-transform;
          letter-spacing;
          color;
          background: var(--primary-color);
          padding;
          border-radius: var(--border-radius);
          text-decoration;
          transition: all 0.3s ease;
          box-shadow: 0 4px 15px rgba(67, 172, 233, 0.3);
        }

        .hero-btn:hover {
          background: var(--primary-hover);
          color;
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(67, 172, 233, 0.4);
        }

        .hero-nav {
          position;
          top: 50%;
          transform: translateY(-50%);
          z-index;
          width;
          height;
          background: rgba(255, 255, 255, 0.9);
          border;
          border-radius: 50%;
          display;
          align-items;
          justify-content;
          cursor;
          transition: all 0.3s ease;
          backdrop-filter: blur(10px);
        }

        .hero-nav:hover {
          background;
          transform: translateY(-50%) scale(1.1);
        }

        .hero-nav-prev {
          left;
        }

        .hero-nav-next {
          right;
        }

        .hero-indicators {
          position;
          bottom;
          left: 50%;
          transform: translateX(-50%);
          display;
          gap;
          z-index;
        }

        .hero-indicator {
          width;
          height;
          border-radius: 50%;
          border: 2px solid rgba(255, 255, 255, 0.5);
          background;
          cursor;
          transition: all 0.3s ease;
        }

        .hero-indicator.active {
          background;
          border-color;
        }

        .hero-indicator:hover {
          border-color;
        }

        /* Responsive Design */
        @media (max-width) {
          .woodmart-hero {
            height;
          }

          .hero-title {
            font-size;
          }

          .hero-description {
            font-size;
          }

          .hero-nav {
            width;
            height;
          }

          .hero-nav-prev {
            left;
          }

          .hero-nav-next {
            right;
          }

          .hero-indicators {
            bottom;
          }
        }

        @media (max-width) {
          .hero-title {
            font-size;
          }

          .hero-description {
            font-size;
          }

          .hero-btn {
            padding;
            font-size;
          }
        }
      `}</style>
    </section>
  );
};

export default WoodMartHero;

