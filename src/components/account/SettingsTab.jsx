'use client';

import React, { useState, useEffect } from 'react';
import { apiService } from '@/services/api';

const SettingsTab = ({ userId }) => {
  const [settings, setSettings] = useState({
    notifications: {
      email: true,
      bid: true,
      order: true,
      auction: true,
      property: true
    },
    privacy: {
      profile_public: false,
      show_activity: true,
      two_factor: false
    }
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    loadSettings();
  }, [userId]);

  const loadSettings = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await apiService.getUserSettings();
      
      if (response.success) {
        setSettings(response.data || settings);
      } else {
        console.warn('Settings API failed, using defaults:', response.message);
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNotificationChange = (key, value) => {
    setSettings(prev => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [key]: value
      }
    }));
  };

  const handlePrivacyChange = (key, value) => {
    setSettings(prev => ({
      ...prev,
      privacy: {
        ...prev.privacy,
        [key]: value
      }
    }));
  };

  const saveNotificationSettings = async () => {
    setIsSaving(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await apiService.updateUserSettings('notifications', settings.notifications);
      
      if (response.success) {
        setSuccess('Notification preferences saved successfully!');
      } else {
        setError(response.message || 'Failed to save notification settings');
      }
    } catch (error) {
      console.error('Error saving notification settings:', error);
      setError('Failed to save notification settings. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const savePrivacySettings = async () => {
    setIsSaving(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await apiService.updateUserSettings('privacy', settings.privacy);
      
      if (response.success) {
        setSuccess('Privacy settings saved successfully!');
      } else {
        setError(response.message || 'Failed to save privacy settings');
      }
    } catch (error) {
      console.error('Error saving privacy settings:', error);
      setError('Failed to save privacy settings. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="settings-content">
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
          <div className="text-center">
            <div className="spinner-border text-primary mb-3" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="text-muted">Loading your settings...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="settings-content">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4 className="mb-0">
          <i className="fas fa-cog me-2 text-primary"></i>
          Account Settings
        </h4>
      </div>

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

      <div className="row">
        <div className="col-md-6">
          <div className="card">
            <div className="card-header">
              <h6 className="mb-0">
                <i className="fas fa-bell me-2"></i>
                Notification Preferences
              </h6>
            </div>
            <div className="card-body">
              <div className="form-check mb-3">
                <input 
                  className="form-check-input" 
                  type="checkbox" 
                  id="email-notifications" 
                  checked={settings.notifications.email}
                  onChange={(e) => handleNotificationChange('email', e.target.checked)}
                />
                <label className="form-check-label" htmlFor="email-notifications">
                  Email Notifications
                </label>
              </div>
              <div className="form-check mb-3">
                <input 
                  className="form-check-input" 
                  type="checkbox" 
                  id="bid-notifications" 
                  checked={settings.notifications.bid}
                  onChange={(e) => handleNotificationChange('bid', e.target.checked)}
                />
                <label className="form-check-label" htmlFor="bid-notifications">
                  Bid Notifications
                </label>
              </div>
              <div className="form-check mb-3">
                <input 
                  className="form-check-input" 
                  type="checkbox" 
                  id="order-notifications" 
                  checked={settings.notifications.order}
                  onChange={(e) => handleNotificationChange('order', e.target.checked)}
                />
                <label className="form-check-label" htmlFor="order-notifications">
                  Order Updates
                </label>
              </div>
              <div className="form-check mb-3">
                <input 
                  className="form-check-input" 
                  type="checkbox" 
                  id="auction-notifications" 
                  checked={settings.notifications.auction}
                  onChange={(e) => handleNotificationChange('auction', e.target.checked)}
                />
                <label className="form-check-label" htmlFor="auction-notifications">
                  Auction Updates
                </label>
              </div>
              <div className="form-check mb-3">
                <input 
                  className="form-check-input" 
                  type="checkbox" 
                  id="property-notifications" 
                  checked={settings.notifications.property}
                  onChange={(e) => handleNotificationChange('property', e.target.checked)}
                />
                <label className="form-check-label" htmlFor="property-notifications">
                  Property Updates
                </label>
              </div>
              <button 
                className="btn btn-outline-primary btn-sm"
                onClick={saveNotificationSettings}
                disabled={isSaving}
              >
                {isSaving ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-1" role="status"></span>
                    Saving...
                  </>
                ) : (
                  <>
                    <i className="fas fa-save me-1"></i>
                    Save Preferences
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="card">
            <div className="card-header">
              <h6 className="mb-0">
                <i className="fas fa-shield-alt me-2"></i>
                Privacy & Security
              </h6>
            </div>
            <div className="card-body">
              <div className="form-check mb-3">
                <input 
                  className="form-check-input" 
                  type="checkbox" 
                  id="profile-public" 
                  checked={settings.privacy.profile_public}
                  onChange={(e) => handlePrivacyChange('profile_public', e.target.checked)}
                />
                <label className="form-check-label" htmlFor="profile-public">
                  Make Profile Public
                </label>
              </div>
              <div className="form-check mb-3">
                <input 
                  className="form-check-input" 
                  type="checkbox" 
                  id="show-activity" 
                  checked={settings.privacy.show_activity}
                  onChange={(e) => handlePrivacyChange('show_activity', e.target.checked)}
                />
                <label className="form-check-label" htmlFor="show-activity">
                  Show Activity Status
                </label>
              </div>
              <div className="form-check mb-3">
                <input 
                  className="form-check-input" 
                  type="checkbox" 
                  id="two-factor" 
                  checked={settings.privacy.two_factor}
                  onChange={(e) => handlePrivacyChange('two_factor', e.target.checked)}
                />
                <label className="form-check-label" htmlFor="two-factor">
                  Enable Two-Factor Authentication
                </label>
              </div>
              <button 
                className="btn btn-outline-primary btn-sm"
                onClick={savePrivacySettings}
                disabled={isSaving}
              >
                {isSaving ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-1" role="status"></span>
                    Saving...
                  </>
                ) : (
                  <>
                    <i className="fas fa-save me-1"></i>
                    Save Settings
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="row mt-4">
        <div className="col-12">
          <div className="card">
            <div className="card-header">
              <h6 className="mb-0">
                <i className="fas fa-download me-2"></i>
                Data & Privacy
              </h6>
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-md-6">
                  <h6>Export Your Data</h6>
                  <p className="text-muted small">
                    Download a copy of your account data including profile information, orders, and activity history.
                  </p>
                  <button className="btn btn-outline-secondary btn-sm">
                    <i className="fas fa-download me-1"></i>
                    Export Data
                  </button>
                </div>
                <div className="col-md-6">
                  <h6>Delete Account</h6>
                  <p className="text-muted small">
                    Permanently delete your account and all associated data. This action cannot be undone.
                  </p>
                  <button className="btn btn-outline-danger btn-sm">
                    <i className="fas fa-trash me-1"></i>
                    Delete Account
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .settings-content .card {
          transition: all 0.3s ease;
        }
        
        .settings-content .card:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }
        
        .form-check-label {
          font-weight: 500;
          color: #495057;
        }
        
        .card-header h6 {
          color: #495057;
        }
      `}</style>
    </div>
  );
};

export default SettingsTab;
