'use client';

import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { ContactFormData } from '@/types';

export default function ContactPage() {
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const contactInfo = [
    {
      icon: 'fas fa-map-marker-alt',
      title: 'Address',
      details: ['123 Business Street', 'Suite 100', 'New York, NY 10001'],
    },
    {
      icon: 'fas fa-phone',
      title: 'Phone',
      details: ['+1 (555) 123-4567', '+1 (555) 987-6543'],
    },
    {
      icon: 'fas fa-envelope',
      title: 'Email',
      details: ['info@xpertbid.com', 'support@xpertbid.com'],
    },
    {
      icon: 'fas fa-clock',
      title: 'Business Hours',
      details: ['Monday - Friday: 9:00 AM - 6:00 PM', 'Saturday: 10:00 AM - 4:00 PM', 'Sunday: Closed'],
    },
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setSuccess(true);
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: '',
      });
    } catch {
      setError('Failed to send message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <Layout>
        <div className="contact-success py-5">
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-lg-6 text-center">
                <div className="success-card p-5">
                  <div className="success-icon mb-4">
                    <i className="fas fa-check-circle fa-4x text-success"></i>
                  </div>
                  <h2 className="mb-3">Message Sent Successfully!</h2>
                  <p className="text-muted mb-4">
                    Thank you for contacting us. We&apos;ll get back to you within 24 hours.
                  </p>
                  <button 
                    className="btn btn-primary"
                    onClick={() => setSuccess(false)}
                  >
                    Send Another Message
                  </button>
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
      {/* Contact Hero */}
      <div className="contact-hero bg-light py-5">
        <div className="container">
          <div className="row">
            <div className="col-12 text-center">
              <h1 className="display-4 fw-bold text-dark mb-3">Contact Us</h1>
              <p className="lead text-muted mb-0">
                Get in touch with our team. We&apos;re here to help you succeed.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Info Cards */}
      <div className="contact-info-section py-5">
        <div className="container">
          <div className="row">
            {contactInfo.map((info, index) => (
              <div key={index} className="col-lg-3 col-md-6 mb-4">
                <div className="contact-info-card h-100 text-center">
                  <div className="info-icon mb-3">
                    <i className={`${info.icon} fa-2x text-primary`}></i>
                  </div>
                  <h5 className="info-title mb-3">{info.title}</h5>
                  <div className="info-details">
                    {info.details.map((detail, idx) => (
                      <p key={idx} className="text-muted mb-1">{detail}</p>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Contact Form & Map */}
      <div className="contact-form-section py-5 bg-light">
        <div className="container">
          <div className="row">
            {/* Contact Form */}
            <div className="col-lg-8 mb-4">
              <div className="contact-form-card">
                <div className="form-header mb-4">
                  <h3 className="mb-3">Send us a Message</h3>
                  <p className="text-muted">
                    Have a question or need assistance? Fill out the form below and we&apos;ll get back to you soon.
                  </p>
                </div>

                <form onSubmit={handleSubmit}>
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label htmlFor="name" className="form-label">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        className="form-control"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        placeholder="Enter your full name"
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label htmlFor="email" className="form-label">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        className="form-control"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        placeholder="Enter your email"
                      />
                    </div>
                  </div>

                  <div className="mb-3">
                    <label htmlFor="subject" className="form-label">
                      Subject *
                    </label>
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      className="form-control"
                      value={formData.subject}
                      onChange={handleInputChange}
                      required
                      placeholder="Enter message subject"
                    />
                  </div>

                  <div className="mb-4">
                    <label htmlFor="message" className="form-label">
                      Message *
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      className="form-control"
                      rows={6}
                      value={formData.message}
                      onChange={handleInputChange}
                      required
                      placeholder="Enter your message"
                    ></textarea>
                  </div>

                  {error && (
                    <div className="alert alert-danger mb-3" role="alert">
                      {error}
                    </div>
                  )}

                  <button
                    type="submit"
                    className="btn btn-primary btn-lg"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                        Sending Message...
                      </>
                    ) : (
                      <>
                        Send Message
                        <i className="fas fa-paper-plane ms-2"></i>
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>

            {/* Contact Sidebar */}
            <div className="col-lg-4 mb-4">
              <div className="contact-sidebar">
                {/* Map */}
                <div className="map-section mb-4">
                  <h5 className="mb-3">Find Us Here</h5>
                  <div className="map-container">
                    <iframe
                      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3024.1!2d-74.0060!3d40.7128!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDDCsDQyJzQ2LjEiTiA3NMKwMDAnMjEuNiJX!5e0!3m2!1sen!2sus!4v1600000000000!5m2!1sen!2sus"
                      width="100%"
                      height="250"
                      style={{ border: 0, borderRadius: '8px' }}
                      allowFullScreen
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                    ></iframe>
                  </div>
                </div>

                {/* Quick Contact */}
                <div className="quick-contact-section">
                  <h5 className="mb-3">Quick Contact</h5>
                  <div className="quick-contact-item mb-3">
                    <div className="d-flex align-items-center">
                      <i className="fas fa-phone text-primary me-3"></i>
                      <div>
                        <strong>Call Us</strong>
                        <p className="mb-0 text-muted">+1 (555) 123-4567</p>
                      </div>
                    </div>
                  </div>
                  <div className="quick-contact-item mb-3">
                    <div className="d-flex align-items-center">
                      <i className="fas fa-envelope text-primary me-3"></i>
                      <div>
                        <strong>Email Us</strong>
                        <p className="mb-0 text-muted">info@xpertbid.com</p>
                      </div>
                    </div>
                  </div>
                  <div className="quick-contact-item">
                    <div className="d-flex align-items-center">
                      <i className="fas fa-comments text-primary me-3"></i>
                      <div>
                        <strong>Live Chat</strong>
                        <p className="mb-0 text-muted">Available 24/7</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Social Media */}
                <div className="social-section mt-4">
                  <h5 className="mb-3">Follow Us</h5>
                  <div className="social-links">
                    <a href="#" className="social-link me-2">
                      <i className="fab fa-facebook-f"></i>
                    </a>
                    <a href="#" className="social-link me-2">
                      <i className="fab fa-twitter"></i>
                    </a>
                    <a href="#" className="social-link me-2">
                      <i className="fab fa-instagram"></i>
                    </a>
                    <a href="#" className="social-link me-2">
                      <i className="fab fa-linkedin-in"></i>
                    </a>
                    <a href="#" className="social-link">
                      <i className="fab fa-youtube"></i>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="faq-section py-5">
        <div className="container">
          <div className="row">
            <div className="col-12 text-center mb-5">
              <h2 className="mb-3">Frequently Asked Questions</h2>
              <p className="lead text-muted">
                Find answers to common questions about our platform
              </p>
            </div>
          </div>
          <div className="row">
            <div className="col-lg-8 mx-auto">
              <div className="accordion" id="faqAccordion">
                <div className="accordion-item">
                  <h2 className="accordion-header">
                    <button 
                      className="accordion-button" 
                      type="button" 
                      data-bs-toggle="collapse" 
                      data-bs-target="#faq1"
                    >
                      How do I create an account?
                    </button>
                  </h2>
                  <div id="faq1" className="accordion-collapse collapse show" data-bs-parent="#faqAccordion">
                    <div className="accordion-body">
                      Creating an account is simple! Click on the &quot;Register&quot; button in the top navigation, 
                      fill out the required information, and verify your email address.
                    </div>
                  </div>
                </div>

                <div className="accordion-item">
                  <h2 className="accordion-header">
                    <button 
                      className="accordion-button collapsed" 
                      type="button" 
                      data-bs-toggle="collapse" 
                      data-bs-target="#faq2"
                    >
                      How do auctions work?
                    </button>
                  </h2>
                  <div id="faq2" className="accordion-collapse collapse" data-bs-parent="#faqAccordion">
                    <div className="accordion-body">
                      Our auctions are time-limited events where users can bid on products. 
                      The highest bidder when the auction ends wins the item. You&apos;ll receive 
                      notifications about your bidding activity.
                    </div>
                  </div>
                </div>

                <div className="accordion-item">
                  <h2 className="accordion-header">
                    <button 
                      className="accordion-button collapsed" 
                      type="button" 
                      data-bs-toggle="collapse" 
                      data-bs-target="#faq3"
                    >
                      What payment methods do you accept?
                    </button>
                  </h2>
                  <div id="faq3" className="accordion-collapse collapse" data-bs-parent="#faqAccordion">
                    <div className="accordion-body">
                      We accept major credit cards, PayPal, bank transfers, and various other 
                      secure payment methods. All transactions are encrypted and secure.
                    </div>
                  </div>
                </div>

                <div className="accordion-item">
                  <h2 className="accordion-header">
                    <button 
                      className="accordion-button collapsed" 
                      type="button" 
                      data-bs-toggle="collapse" 
                      data-bs-target="#faq4"
                    >
                      How can I become a seller?
                    </button>
                  </h2>
                  <div id="faq4" className="accordion-collapse collapse" data-bs-parent="#faqAccordion">
                    <div className="accordion-body">
                      To become a seller, register for an account and complete the vendor 
                      verification process. You&apos;ll need to provide business information 
                      and agree to our seller terms and conditions.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .contact-hero {
          background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
        }

        .contact-info-card {
          background: white;
          padding: 2rem 1.5rem;
          border-radius: var(--border-radius-lg);
          box-shadow: var(--shadow-sm);
          transition: all 0.3s ease;
        }

        .contact-info-card:hover {
          transform: translateY(-5px);
          box-shadow: var(--shadow-lg);
        }

        .info-title {
          font-weight: 600;
          color: var(--dark-color);
        }

        .contact-form-card {
          background: white;
          padding: 3rem;
          border-radius: var(--border-radius-lg);
          box-shadow: var(--shadow-sm);
        }

        .form-label {
          font-weight: 500;
          color: var(--dark-color);
          margin-bottom: 0.5rem;
        }

        .form-control {
          border: 1px solid var(--gray-300);
          border-radius: var(--border-radius);
          padding: 0.75rem 1rem;
          font-size: 1rem;
          transition: all 0.3s ease;
        }

        .form-control:focus {
          border-color: var(--primary-color);
          box-shadow: 0 0 0 0.2rem rgba(67, 172, 233, 0.25);
        }

        .contact-sidebar {
          background: white;
          padding: 2rem;
          border-radius: var(--border-radius-lg);
          box-shadow: var(--shadow-sm);
          height: fit-content;
        }

        .quick-contact-item {
          padding: 1rem 0;
          border-bottom: 1px solid var(--gray-200);
        }

        .quick-contact-item:last-child {
          border-bottom: none;
        }

        .social-link {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 40px;
          height: 40px;
          background: var(--gray-100);
          color: var(--gray-600);
          border-radius: 50%;
          text-decoration: none;
          transition: all 0.3s ease;
        }

        .social-link:hover {
          background: var(--primary-color);
          color: white;
          transform: translateY(-2px);
        }

        .success-card {
          background: white;
          border-radius: var(--border-radius-lg);
          box-shadow: var(--shadow-lg);
        }

        .accordion-button {
          font-weight: 500;
        }

        .accordion-button:not(.collapsed) {
          background-color: var(--primary-color);
          color: white;
        }

        .btn-lg {
          padding: 12px 30px;
          font-size: 16px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          border-radius: 25px;
        }

        @media (max-width: 768px) {
          .contact-hero h1 {
            font-size: 2.5rem;
          }
          
          .contact-form-card {
            padding: 2rem 1.5rem;
          }
          
          .contact-sidebar {
            padding: 1.5rem;
          }
        }
      `}</style>
    </Layout>
  );
}