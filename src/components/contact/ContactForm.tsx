'use client';

import React, { useState } from 'react';

const ContactForm: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setIsSubmitted(true);
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="contact-form-success text-center py-5">
        <div className="success-icon mb-4">
          <i className="fas fa-check-circle fa-4x text-success"></i>
        </div>
        <h3 className="mb-3">Thank You!</h3>
        <p className="text-muted mb-4">
          Your message has been sent successfully. We&apos;ll get back to you within 24 hours.
        </p>
        <button 
          className="btn btn-primary"
          onClick={() => {
            setIsSubmitted(false);
            setFormData({ name: '', email: '', subject: '', message: '' });
          }}
        >
          Send Another Message
        </button>
      </div>
    );
  }

  return (
    <div className="contact-form">
      <div className="form-header mb-4">
        <h3 className="form-title">Send us a Message</h3>
        <p className="form-subtitle text-muted">
          Fill out the form below and we&apos;ll get back to you as soon as possible.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="contact-form-form">
        <div className="row">
          <div className="col-md-6 mb-3">
            <label htmlFor="name" className="form-label">Full Name *</label>
            <input
              type="text"
              className="form-control"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="col-md-6 mb-3">
            <label htmlFor="email" className="form-label">Email Address *</label>
            <input
              type="email"
              className="form-control"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="mb-3">
          <label htmlFor="subject" className="form-label">Subject *</label>
          <select
            className="form-select"
            id="subject"
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            required
          >
            <option value="">Select a subject</option>
            <option value="general">General Inquiry</option>
            <option value="support">Technical Support</option>
            <option value="billing">Billing Question</option>
            <option value="partnership">Partnership</option>
            <option value="feedback">Feedback</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div className="mb-4">
          <label htmlFor="message" className="form-label">Message *</label>
          <textarea
            className="form-control"
            id="message"
            name="message"
            rows={6}
            value={formData.message}
            onChange={handleChange}
            placeholder="Please describe your inquiry in detail..."
            required
          ></textarea>
        </div>

        <div className="form-actions">
          <button 
            type="submit" 
            className="btn btn-primary btn-lg"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <i className="fas fa-spinner fa-spin me-2"></i>
                Sending...
              </>
            ) : (
              <>
                <i className="fas fa-paper-plane me-2"></i>
                Send Message
              </>
            )}
          </button>
        </div>
      </form>

      <style jsx>{`
        .contact-form {
          background: white;
          padding: 2rem;
          box-shadow: var(--shadow-sm);
          border-radius: 0;
        }

        .form-title {
          font-size: 1.75rem;
          font-weight: 600;
          color: var(--secondary-color);
          margin-bottom: 0.5rem;
        }

        .form-subtitle {
          font-size: 1rem;
          line-height: 1.6;
        }

        .form-label {
          font-weight: 500;
          color: var(--secondary-color);
          margin-bottom: 0.5rem;
        }

        .form-control,
        .form-select {
          border-radius: 0;
          border: 1px solid var(--gray-300);
          padding: 12px 16px;
          font-size: 1rem;
          transition: var(--transition-fast);
        }

        .form-control:focus,
        .form-select:focus {
          border-color: var(--primary-color);
          box-shadow: 0 0 0 3px rgba(131, 183, 53, 0.1);
          outline: none;
        }

        .form-control::placeholder {
          color: var(--gray-500);
        }

        .btn {
          border-radius: 0;
          padding: 12px 24px;
          font-weight: 500;
          transition: var(--transition-fast);
        }

        .btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .contact-form-success {
          background: white;
          padding: 3rem 2rem;
          box-shadow: var(--shadow-sm);
          border-radius: 0;
          text-align: center;
        }

        .success-icon {
          animation: bounceIn 0.6s ease-out;
        }

        @keyframes bounceIn {
          0% {
            opacity: 0;
            transform: scale(0.3);
          }
          50% {
            opacity: 1;
            transform: scale(1.05);
          }
          70% {
            transform: scale(0.9);
          }
          100% {
            opacity: 1;
            transform: scale(1);
          }
        }

        @media (max-width: 768px) {
          .contact-form {
            padding: 1.5rem;
          }

          .form-title {
            font-size: 1.5rem;
          }

          .btn {
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
};

export default ContactForm;
