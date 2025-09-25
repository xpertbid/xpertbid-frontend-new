'use client';

import React, { useState, useEffect } from 'react';

const WoodMartHero = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      id: 1,
      brand: "CAPPELLINI",
      title: "Wooden Lounge Chairs",
      description: "Semper vulputate aliquam curae condimentum quisque gravida fusce convallis arcu cum at.",
      price: "$999.00",
      image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=1920&h=1080&fit=crop",
      overlay: false
    },
    {
      id: 2,
      brand: "MODERN LIVING",
      title: "Contemporary Furniture",
      description: "Transform your space with our latest collection of modern furniture and accessories.",
      price: "$799.00",
      image: "https://images.unsplash.com/photo-1555041469-a586c61ea4bc?w=1920&h=1080&fit=crop",
      overlay: false
    },
    {
      id: 3,
      brand: "PREMIUM QUALITY",
      title: "Luxury Home Decor",
      description: "Get the best deals on premium furniture and home decor. Limited time offers available.",
      price: "$1299.00",
      image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=1920&h=1080&fit=crop",
      overlay: false
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
          height: 600px;
          overflow: hidden;
          background: #ffffff;
        }

        .hero-slider {
          position: relative;
          width: 100%;
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
          color: #83B735;
          margin-bottom: 15px;
          background: rgba(131, 183, 53, 0.1);
          padding: 8px 16px;
          border-radius: var(--border-radius-sm);
          backdrop-filter: blur(10px);
        }

        .hero-title {
          font-family: var(--font-family-heading);
          font-size: 3.5rem;
          font-weight: 700;
          line-height: 1.1;
          margin-bottom: 20px;
          text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
        }

        .hero-description {
          font-family: var(--font-family);
          font-size: 1.1rem;
          line-height: 1.6;
          margin-bottom: 30px;
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
          background: #83B735;
          padding: 15px 35px;
          border-radius: var(--border-radius);
          text-decoration: none;
          transition: all 0.3s ease;
          box-shadow: 0 4px 15px rgba(131, 183, 53, 0.3);
        }

        .hero-btn:hover {
          background: #6B9B2A;
          color: white;
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(131, 183, 53, 0.4);
        }

        .hero-nav {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          z-index: 3;
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
          color: var(--secondary-color);
          font-size: 18px;
        }

        .hero-nav:hover {
          background: #83B735;
          color: white;
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
          z-index: 3;
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
          background: #83B735;
          border-color: white;
        }

        .hero-indicator:hover {
          border-color: #83B735;
        }

        /* Responsive Design */
        @media (max-width: 768px) {
          .woodmart-hero {
            height: 500px;
          }

          .hero-title {
            font-size: 2.5rem;
          }

          .hero-description {
            font-size: 1rem;
          }

          .hero-nav {
            width: 40px;
            height: 40px;
            font-size: 16px;
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

        @media (max-width: 575px) {
          .woodmart-hero {
            height: 400px;
          }

          .hero-title {
            font-size: 2rem;
          }

          .hero-subtitle {
            font-size: 12px;
            padding: 6px 12px;
          }

          .hero-description {
            font-size: 0.9rem;
            margin-bottom: 20px;
          }

          .hero-btn {
            padding: 12px 25px;
            font-size: 12px;
          }

          .hero-nav {
            display: none;
          }
        }
      `}</style>
    </section>
  );
};

export default WoodMartHero;
