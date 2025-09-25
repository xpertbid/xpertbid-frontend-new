'use client';

import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import { useAuth } from '@/contexts/AuthContext';
// import { apiService } from '@/services/api';
import Image from 'next/image';

interface ProfileFormData {
  name: string;
  email: string;
  phone: string;
  date_of_birth: string;
  gender: string;
  avatar: string;
}

const ProfilePage: React.FC = () => {
  const { user, updateProfile } = useAuth();
  const [formData, setFormData] = useState<ProfileFormData>({
    name: '',
    email: '',
    phone: '',
    date_of_birth: '',
    gender: '',
    avatar: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [activeTab, setActiveTab] = useState('profile');

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        date_of_birth: '',
        gender: '',
        avatar: user.avatar || ''
      });
    }
  }, [user]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
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
    setSuccess('');

    try {
      await updateProfile(formData);
      setSuccess('Profile updated successfully!');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    const _currentPassword = formData.get('current_password') as string;
    const newPassword = formData.get('new_password') as string;
    const confirmPassword = formData.get('confirm_password') as string;

    if (newPassword !== confirmPassword) {
      setError('New passwords do not match');
      setLoading(false);
      return;
    }

    try {
      // TODO: Implement password change API method
      setSuccess('Password change functionality will be implemented soon!');
      form.reset();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to change password');
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <Layout>
        <div className="container py-5">
          <div className="text-center">
            <h2>Please Login</h2>
            <p>You need to be logged in to access your profile.</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="profile-page">
        <div className="container py-4">
          {/* Profile Header */}
          <div className="profile-header mb-4">
            <div className="row align-items-center">
              <div className="col-md-8">
                <div className="d-flex align-items-center">
                  <div className="profile-avatar me-3">
                    {user.avatar ? (
                      <Image 
                        src={user.avatar} 
                        alt={user.name} 
                        width={80} 
                        height={80} 
                        className="rounded-circle"
                      />
                    ) : (
                      <div className="avatar-placeholder">
                        <i className="fas fa-user"></i>
                      </div>
                    )}
                  </div>
                  <div>
                    <h2 className="mb-1">{user.name}</h2>
                    <p className="text-muted mb-0">{user.email}</p>
                    <small className="text-muted">
                      Member since {new Date(user.created_at).toLocaleDateString()}
                    </small>
                  </div>
                </div>
              </div>
              <div className="col-md-4 text-end">
                <div className="profile-status">
                  <span className={`badge bg-${user.status === 'active' ? 'success' : 'warning'}`}>
                    {user.status}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="profile-nav mb-4">
            <nav className="nav nav-pills">
              <button 
                className={`nav-link ${activeTab === 'profile' ? 'active' : ''}`}
                onClick={() => setActiveTab('profile')}
              >
                <i className="fas fa-user me-2"></i>
                Profile Information
              </button>
              <button 
                className={`nav-link ${activeTab === 'password' ? 'active' : ''}`}
                onClick={() => setActiveTab('password')}
              >
                <i className="fas fa-lock me-2"></i>
                Change Password
              </button>
              <button 
                className={`nav-link ${activeTab === 'preferences' ? 'active' : ''}`}
                onClick={() => setActiveTab('preferences')}
              >
                <i className="fas fa-cog me-2"></i>
                Preferences
              </button>
            </nav>
          </div>

          {/* Alerts */}
          {error && (
            <div className="alert alert-danger" role="alert">
              <i className="fas fa-exclamation-circle me-2"></i>
              {error}
            </div>
          )}
          {success && (
            <div className="alert alert-success" role="alert">
              <i className="fas fa-check-circle me-2"></i>
              {success}
            </div>
          )}

          {/* Tab Content */}
          {activeTab === 'profile' && (
            <div className="profile-tab">
              <div className="profile-card">
                <div className="card-header">
                  <h5><i className="fas fa-user me-2"></i>Profile Information</h5>
                </div>
                <div className="card-body">
                  <form onSubmit={handleSubmit}>
                    <div className="row">
                      <div className="col-md-6 mb-3">
                        <label htmlFor="name" className="form-label">Full Name</label>
                        <input
                          type="text"
                          className="form-control"
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      <div className="col-md-6 mb-3">
                        <label htmlFor="email" className="form-label">Email Address</label>
                        <input
                          type="email"
                          className="form-control"
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          required
                          disabled
                        />
                        <small className="form-text text-muted">
                          Email cannot be changed. Contact support if needed.
                        </small>
                      </div>
                    </div>

                    <div className="row">
                      <div className="col-md-6 mb-3">
                        <label htmlFor="phone" className="form-label">Phone Number</label>
                        <input
                          type="tel"
                          className="form-control"
                          id="phone"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div className="col-md-6 mb-3">
                        <label htmlFor="date_of_birth" className="form-label">Date of Birth</label>
                        <input
                          type="date"
                          className="form-control"
                          id="date_of_birth"
                          name="date_of_birth"
                          value={formData.date_of_birth}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>

                    <div className="row">
                      <div className="col-md-6 mb-3">
                        <label htmlFor="gender" className="form-label">Gender</label>
                        <select
                          className="form-select"
                          id="gender"
                          name="gender"
                          value={formData.gender}
                          onChange={handleInputChange}
                        >
                          <option value="">Select Gender</option>
                          <option value="male">Male</option>
                          <option value="female">Female</option>
                          <option value="other">Other</option>
                        </select>
                      </div>
                      <div className="col-md-6 mb-3">
                        <label htmlFor="avatar" className="form-label">Avatar URL</label>
                        <input
                          type="url"
                          className="form-control"
                          id="avatar"
                          name="avatar"
                          value={formData.avatar}
                          onChange={handleInputChange}
                          placeholder="https://example.com/avatar.jpg"
                        />
                      </div>
                    </div>

                    <div className="text-end">
                      <button 
                        type="submit" 
                        className="btn btn-primary"
                        disabled={loading}
                      >
                        {loading ? (
                          <>
                            <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                            Updating...
                          </>
                        ) : (
                          <>
                            <i className="fas fa-save me-2"></i>
                            Update Profile
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'password' && (
            <div className="password-tab">
              <div className="profile-card">
                <div className="card-header">
                  <h5><i className="fas fa-lock me-2"></i>Change Password</h5>
                </div>
                <div className="card-body">
                  <form onSubmit={handlePasswordChange}>
                    <div className="row">
                      <div className="col-md-6 mb-3">
                        <label htmlFor="current_password" className="form-label">Current Password</label>
                        <input
                          type="password"
                          className="form-control"
                          id="current_password"
                          name="current_password"
                          required
                        />
                      </div>
                    </div>

                    <div className="row">
                      <div className="col-md-6 mb-3">
                        <label htmlFor="new_password" className="form-label">New Password</label>
                        <input
                          type="password"
                          className="form-control"
                          id="new_password"
                          name="new_password"
                          required
                          minLength={8}
                        />
                        <small className="form-text text-muted">
                          Password must be at least 8 characters long.
                        </small>
                      </div>
                      <div className="col-md-6 mb-3">
                        <label htmlFor="confirm_password" className="form-label">Confirm New Password</label>
                        <input
                          type="password"
                          className="form-control"
                          id="confirm_password"
                          name="confirm_password"
                          required
                          minLength={8}
                        />
                      </div>
                    </div>

                    <div className="text-end">
                      <button 
                        type="submit" 
                        className="btn btn-primary"
                        disabled={loading}
                      >
                        {loading ? (
                          <>
                            <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                            Changing...
                          </>
                        ) : (
                          <>
                            <i className="fas fa-key me-2"></i>
                            Change Password
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'preferences' && (
            <div className="preferences-tab">
              <div className="profile-card">
                <div className="card-header">
                  <h5><i className="fas fa-cog me-2"></i>Account Preferences</h5>
                </div>
                <div className="card-body">
                  <div className="text-center py-5">
                    <i className="fas fa-cog fa-3x text-muted mb-3"></i>
                    <h5>Preferences Coming Soon</h5>
                    <p className="text-muted">
                      We&apos;re working on adding more customization options for your account.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <style jsx>{`
          .profile-page {
            min-height: 100vh;
            background-color: #f8f9fa;
          }

          .profile-header {
            background: white;
            border-radius: var(--border-radius-lg);
            padding: 2rem;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
          }

          .profile-avatar {
            position: relative;
          }

          .avatar-placeholder {
            width: 80px;
            height: 80px;
            background: var(--primary-color);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 32px;
            color: white;
          }

          .profile-nav .nav-pills .nav-link {
            color: var(--secondary-color);
            border-radius: var(--border-radius-lg);
            margin-right: 8px;
            font-weight: 500;
            transition: all 0.3s ease;
          }

          .profile-nav .nav-pills .nav-link:hover {
            background-color: var(--gray-100);
            color: var(--primary-color);
          }

          .profile-nav .nav-pills .nav-link.active {
            background-color: var(--primary-color);
            color: white;
          }

          .profile-card {
            background: white;
            border-radius: var(--border-radius-lg);
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
            overflow: hidden;
          }

          .profile-card .card-header {
            background: var(--gray-50);
            border-bottom: 1px solid var(--gray-200);
            padding: 1rem 1.5rem;
            margin: 0;
          }

          .profile-card .card-header h5 {
            margin: 0;
            color: var(--secondary-color);
            font-weight: 600;
          }

          .profile-card .card-body {
            padding: 2rem;
          }

          .form-label {
            font-weight: 600;
            color: var(--secondary-color);
            margin-bottom: 0.5rem;
          }

          .form-control, .form-select {
            border-radius: var(--border-radius-lg);
            border: 1px solid var(--gray-300);
            padding: 0.75rem 1rem;
            transition: border-color 0.3s ease;
          }

          .form-control:focus, .form-select:focus {
            border-color: var(--primary-color);
            box-shadow: 0 0 0 0.2rem rgba(67, 172, 233, 0.25);
          }

          .btn {
            border-radius: var(--border-radius-lg);
            font-weight: 500;
            padding: 0.75rem 1.5rem;
          }

          @media (max-width: 768px) {
            .profile-header .row {
              text-align: center;
            }

            .profile-card .card-body {
              padding: 1rem;
            }
          }
        `}</style>
      </div>
    </Layout>
  );
};

export default ProfilePage;
