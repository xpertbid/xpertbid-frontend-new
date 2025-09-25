'use client';

import React, { useState, useEffect } from 'react';
import { apiService } from '@/services/api';
import { useAuth } from '@/contexts/AuthContext';

const ProfileDetailsTab = ({ user }) => {
  const { updateUser } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    date_of_birth: '',
    gender: '',
    address: '',
    city: '',
    state: '',
    country: '',
    postal_code: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        date_of_birth: user.date_of_birth || '',
        gender: user.gender || '',
        address: user.address || '',
        city: user.city || '',
        state: user.state || '',
        country: user.country || '',
        postal_code: user.postal_code || ''
      });
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear errors when user starts typing
    if (error) {
      setError(null);
    }
    if (success) {
      setSuccess(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await apiService.postJson('/user/profile', formData);
      
      if (response.success) {
        // Update user in auth context
        if (updateUser) {
          updateUser(response.data);
        }
        setSuccess('Profile updated successfully!');
      } else {
        setError(response.message || 'Failed to update profile');
      }
    } catch (error) {
      console.error('Profile update error:', error);
      setError('Failed to update profile. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setError(null);
    setSuccess(null);

    const passwordData = {
      current_password: e.target.current_password.value,
      new_password: e.target.new_password.value,
      new_password_confirmation: e.target.new_password_confirmation.value
    };

    try {
      const response = await apiService.postJson('/user/change-password', passwordData);
      
      if (response.success) {
        setSuccess('Password changed successfully!');
        e.target.reset();
      } else {
        setError(response.message || 'Failed to change password');
      }
    } catch (error) {
      console.error('Password change error:', error);
      setError('Failed to change password. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="profile-details-content">
      <div className="row">
        <div className="col-lg-8">
          <div className="card">
            <div className="card-header">
              <h5 className="mb-0">
                <i className="fas fa-user-edit me-2"></i>
                Personal Information
              </h5>
            </div>
            <div className="card-body">
              {error && (
                <div className="alert alert-danger" role="alert">
                  <i className="fas fa-exclamation-triangle me-2"></i>
                  {error}
                </div>
              )}
              
              {success && (
                <div className="alert alert-success" role="alert">
                  <i className="fas fa-check-circle me-2"></i>
                  {success}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label htmlFor="name" className="form-label">Full Name *</label>
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
                    <label htmlFor="email" className="form-label">Email Address *</label>
                    <input
                      type="email"
                      className="form-control"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
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
                </div>

                <hr className="my-4" />
                
                <h6 className="mb-3">
                  <i className="fas fa-map-marker-alt me-2"></i>
                  Address Information
                </h6>
                
                <div className="row">
                  <div className="col-12 mb-3">
                    <label htmlFor="address" className="form-label">Street Address</label>
                    <input
                      type="text"
                      className="form-control"
                      id="address"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="col-md-4 mb-3">
                    <label htmlFor="city" className="form-label">City</label>
                    <input
                      type="text"
                      className="form-control"
                      id="city"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="col-md-4 mb-3">
                    <label htmlFor="state" className="form-label">State/Province</label>
                    <input
                      type="text"
                      className="form-control"
                      id="state"
                      name="state"
                      value={formData.state}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="col-md-4 mb-3">
                    <label htmlFor="country" className="form-label">Country</label>
                    <input
                      type="text"
                      className="form-control"
                      id="country"
                      name="country"
                      value={formData.country}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label htmlFor="postal_code" className="form-label">Postal Code</label>
                    <input
                      type="text"
                      className="form-control"
                      id="postal_code"
                      name="postal_code"
                      value={formData.postal_code}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                <div className="d-flex justify-content-end">
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={isSaving}
                  >
                    {isSaving ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                        Saving...
                      </>
                    ) : (
                      <>
                        <i className="fas fa-save me-2"></i>
                        Save Changes
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

        <div className="col-lg-4">
          <div className="card">
            <div className="card-header">
              <h5 className="mb-0">
                <i className="fas fa-lock me-2"></i>
                Change Password
              </h5>
            </div>
            <div className="card-body">
              <form onSubmit={handleChangePassword}>
                <div className="mb-3">
                  <label htmlFor="current_password" className="form-label">Current Password</label>
                  <input
                    type="password"
                    className="form-control"
                    id="current_password"
                    name="current_password"
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="new_password" className="form-label">New Password</label>
                  <input
                    type="password"
                    className="form-control"
                    id="new_password"
                    name="new_password"
                    required
                    minLength="8"
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="new_password_confirmation" className="form-label">Confirm New Password</label>
                  <input
                    type="password"
                    className="form-control"
                    id="new_password_confirmation"
                    name="new_password_confirmation"
                    required
                    minLength="8"
                  />
                </div>
                <button
                  type="submit"
                  className="btn btn-outline-primary w-100"
                  disabled={isSaving}
                >
                  {isSaving ? (
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
              </form>
            </div>
          </div>

          <div className="card mt-3">
            <div className="card-header">
              <h5 className="mb-0">
                <i className="fas fa-info-circle me-2"></i>
                Account Information
              </h5>
            </div>
            <div className="card-body">
              <div className="account-info">
                <div className="d-flex justify-content-between mb-2">
                  <span>Member Since:</span>
                  <strong>{new Date(user?.created_at || user?.joinedDate).toLocaleDateString()}</strong>
                </div>
                <div className="d-flex justify-content-between mb-2">
                  <span>Account Status:</span>
                  <span className={`badge ${user?.status === 'active' ? 'bg-success' : 'bg-warning'}`}>
                    {user?.status?.toUpperCase() || 'ACTIVE'}
                  </span>
                </div>
                <div className="d-flex justify-content-between mb-2">
                  <span>User Role:</span>
                  <strong>{user?.role?.toUpperCase() || 'USER'}</strong>
                </div>
                <div className="d-flex justify-content-between">
                  <span>Last Updated:</span>
                  <strong>{new Date(user?.updated_at).toLocaleDateString()}</strong>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .profile-details-content .card {
          transition: all 0.3s ease;
        }
        
        .profile-details-content .card:hover {
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }
        
        .account-info > div {
          padding: 0.5rem 0;
          border-bottom: 1px solid #f8f9fa;
        }
        
        .account-info > div:last-child {
          border-bottom: none;
        }
        
        .form-label {
          font-weight: 600;
          color: #495057;
        }
        
        .card-header h5 {
          color: #495057;
        }
      `}</style>
    </div>
  );
};

export default ProfileDetailsTab;
