'use client';

import React, { useState, useRef } from 'react';
import { apiService } from '@/services/api';

const ProfileImageUpload = ({ currentAvatar, onImageChange, userId }) => {
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please select a valid image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('Image size must be less than 5MB');
      return;
    }

    setError(null);
    
    // Create preview URL
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);

    // Upload the file
    uploadImage(file);
  };

  const uploadImage = async (file) => {
    setIsUploading(true);
    setError(null);

    try {
      // Create FormData for file upload
      const formData = new FormData();
      formData.append('avatar', file);
      formData.append('user_id', userId);

      // Upload to backend
      const response = await apiService.postForm('/user/profile/avatar', formData);

      if (response.success) {
        // Update the user's avatar URL
        const newAvatarUrl = response.data.avatar_url || response.data.avatar;
        onImageChange(newAvatarUrl);
        
        // Clear preview since we have the real URL
        if (previewUrl) {
          URL.revokeObjectURL(previewUrl);
          setPreviewUrl(null);
        }
      } else {
        setError(response.message || 'Failed to upload image');
      }
    } catch (error) {
      console.error('Image upload error:', error);
      setError('Failed to upload image. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveImage = async () => {
    setIsUploading(true);
    setError(null);

    try {
      const response = await apiService.delJson('/user/profile/avatar');

      if (response.success) {
        onImageChange(null);
        if (previewUrl) {
          URL.revokeObjectURL(previewUrl);
          setPreviewUrl(null);
        }
      } else {
        setError(response.message || 'Failed to remove image');
      }
    } catch (error) {
      console.error('Image removal error:', error);
      setError('Failed to remove image. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const displayImage = previewUrl || currentAvatar;

  return (
    <div className="profile-image-upload">
      <div className="image-container">
        <div className="avatar-wrapper" onClick={handleClick}>
          {displayImage ? (
            <img 
              src={displayImage} 
              alt="Profile" 
              className="profile-avatar"
            />
          ) : (
            <div className="avatar-placeholder">
              <i className="fas fa-user fa-3x"></i>
            </div>
          )}
          
          <div className="upload-overlay">
            <i className="fas fa-camera"></i>
            <span>{isUploading ? 'Uploading...' : 'Change Photo'}</span>
          </div>
        </div>
        
        {isUploading && (
          <div className="upload-progress">
            <div className="spinner-border spinner-border-sm" role="status">
              <span className="visually-hidden">Uploading...</span>
            </div>
          </div>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        style={{ display: 'none' }}
        disabled={isUploading}
      />

      <div className="image-actions mt-3">
        <button
          type="button"
          className="btn btn-outline-primary btn-sm me-2"
          onClick={handleClick}
          disabled={isUploading}
        >
          <i className="fas fa-upload me-1"></i>
          Upload New Photo
        </button>
        
        {displayImage && (
          <button
            type="button"
            className="btn btn-outline-danger btn-sm"
            onClick={handleRemoveImage}
            disabled={isUploading}
          >
            <i className="fas fa-trash me-1"></i>
            Remove Photo
          </button>
        )}
      </div>

      {error && (
        <div className="alert alert-danger mt-3" role="alert">
          <i className="fas fa-exclamation-triangle me-2"></i>
          {error}
        </div>
      )}

      <div className="upload-info mt-2">
        <small className="text-muted">
          <i className="fas fa-info-circle me-1"></i>
          Supported formats: JPG, PNG, GIF. Max size: 5MB
        </small>
      </div>

      <style jsx>{`
        .profile-image-upload {
          text-align: center;
        }

        .image-container {
          position: relative;
          display: inline-block;
          margin-bottom: 1rem;
        }

        .avatar-wrapper {
          position: relative;
          cursor: pointer;
          border-radius: 50%;
          overflow: hidden;
          width: 120px;
          height: 120px;
          margin: 0 auto;
          transition: all 0.3s ease;
        }

        .avatar-wrapper:hover {
          transform: scale(1.05);
        }

        .profile-avatar {
          width: 100%;
          height: 100%;
          object-fit: cover;
          border-radius: 50%;
        }

        .avatar-placeholder {
          width: 100%;
          height: 100%;
          background: #f8f9fa;
          border: 2px dashed #dee2e6;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #6c757d;
        }

        .upload-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.7);
          color: white;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          opacity: 0;
          transition: opacity 0.3s ease;
          border-radius: 50%;
        }

        .avatar-wrapper:hover .upload-overlay {
          opacity: 1;
        }

        .upload-overlay i {
          font-size: 1.5rem;
          margin-bottom: 0.25rem;
        }

        .upload-overlay span {
          font-size: 0.75rem;
          font-weight: 500;
        }

        .upload-progress {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          background: rgba(255, 255, 255, 0.9);
          padding: 0.5rem;
          border-radius: 50%;
        }

        .image-actions {
          display: flex;
          justify-content: center;
          gap: 0.5rem;
          flex-wrap: wrap;
        }

        .upload-info {
          font-size: 0.75rem;
        }

        @media (max-width: 768px) {
          .avatar-wrapper {
            width: 100px;
            height: 100px;
          }
          
          .image-actions {
            flex-direction: column;
            align-items: center;
          }
          
          .image-actions .btn {
            width: 100%;
            max-width: 200px;
          }
        }
      `}</style>
    </div>
  );
};

export default ProfileImageUpload;
