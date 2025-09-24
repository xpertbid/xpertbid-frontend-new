'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface HeroSlide {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  buttonText: string;
  buttonLink: string;
  image: string;
  overlay?: boolean;
}

const WoodMartHero: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides: HeroSlide[] = [
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

  const goToSlide = (index: number) => {
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
                      <i className="fas fa-arrow-right ms-2"></i>
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
        <i className="fas fa-chevron-left"></i>
      </button>
      <button className="hero-nav hero-nav-next" onClick={goToNext}>
        <i className="fas fa-chevron-right"></i>
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
          position: relative;
          height: 100vh;
          overflow: hidden;
        }

        .hero-slider {
          position: relative;
          height: 100%;
        }

        .hero-slide {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          opacity: 0;
          transition: opacity 0.8s ease-in-out;
          display: flex;
          align-items: center;
        }

        .hero-slide.active {
          opacity: 1;
        }

        .hero-overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(
            135deg,
            rgba(26, 26, 26, 0.7) 0%,
            rgba(51, 51, 51, 0.5) 50%,
            rgba(26, 26, 26, 0.3) 100%
          );
          z-index: 1;
        }

        .hero-content {
          position: relative;
          z-index: 2;
          color: white;
          max-width: 600px;
        }

        .hero-subtitle {
          display: inline-block;
          font-family: var(--font-family-heading);
          font-size: 14px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 2px;
          color: var(--primary-color);
          margin-bottom: 20px;
          background: rgba(255, 255, 255, 0.1);
          padding: 8px 16px;
          border-radius: var(--border-radius-sm);
          backdrop-filter: blur(10px);
        }

        .hero-title {
          font-family: var(--font-family-heading);
          font-size: 64px;
          font-weight: 700;
          line-height: 1.1;
          margin-bottom: 24px;
          text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
        }

        .hero-description {
          font-family: var(--font-family);
          font-size: 18px;
          line-height: 1.6;
          margin-bottom: 32px;
          opacity: 0.9;
          text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.3);
        }

        .hero-btn {
          display: inline-flex;
          align-items: center;
          font-family: var(--font-family-heading);
          font-size: 14px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 1px;
          color: white;
          background: var(--primary-color);
          padding: 16px 32px;
          border-radius: var(--border-radius);
          text-decoration: none;
          transition: all 0.3s ease;
          box-shadow: 0 4px 15px rgba(67, 172, 233, 0.3);
        }

        .hero-btn:hover {
          background: var(--primary-hover);
          color: white;
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(67, 172, 233, 0.4);
        }

        .hero-nav {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          z-index: 10;
          width: 50px;
          height: 50px;
          background: rgba(255, 255, 255, 0.9);
          border: none;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.3s ease;
          backdrop-filter: blur(10px);
        }

        .hero-nav:hover {
          background: white;
          transform: translateY(-50%) scale(1.1);
        }

        .hero-nav-prev {
          left: 30px;
        }

        .hero-nav-next {
          right: 30px;
        }

        .hero-indicators {
          position: absolute;
          bottom: 30px;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          gap: 12px;
          z-index: 10;
        }

        .hero-indicator {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          border: 2px solid rgba(255, 255, 255, 0.5);
          background: transparent;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .hero-indicator.active {
          background: white;
          border-color: white;
        }

        .hero-indicator:hover {
          border-color: white;
        }

        /* Responsive Design */
        @media (max-width: 768px) {
          .woodmart-hero {
            height: 70vh;
          }

          .hero-title {
            font-size: 42px;
          }

          .hero-description {
            font-size: 16px;
          }

          .hero-nav {
            width: 40px;
            height: 40px;
          }

          .hero-nav-prev {
            left: 15px;
          }

          .hero-nav-next {
            right: 15px;
          }

          .hero-indicators {
            bottom: 20px;
          }
        }

        @media (max-width: 480px) {
          .hero-title {
            font-size: 32px;
          }

          .hero-description {
            font-size: 14px;
          }

          .hero-btn {
            padding: 12px 24px;
            font-size: 12px;
          }
        }
      `}</style>
    </section>
  );
};

export default WoodMartHero;
