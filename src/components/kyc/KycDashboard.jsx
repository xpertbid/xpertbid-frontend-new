'use client';

import React, { useState, useEffect } from 'react';
import { useKyc } from '@/contexts/KycContext';
import { useAuth } from '@/contexts/AuthContext';
import { kycService } from '@/services/kycService';
import KycForm from './KycForm';
import KycDocumentCard from './KycDocumentCard';



const KycDashboard = ({ user }) => {
  const { documents, kycTypes, isLoading, error, loadKycDocuments } = useKyc();
  const { user: authUser } = useAuth();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedType, setSelectedType] = useState('');

  const currentUser = user || authUser;

  useEffect(() => {
    if (currentUser) {
      loadKycDocuments();
    }
  }, [currentUser, loadKycDocuments]);

  const handleCreateKyc = () => {
    setShowCreateForm(true);
  };

  const handleTypeSelect = (type) => {
    setSelectedType(type);
    setShowCreateForm(true);
  };

  const handleFormSubmit = () => {
    setShowCreateForm(false);
    setSelectedType('');
    loadKycDocuments();
  };

  const handleFormCancel = () => {
    setShowCreateForm(false);
    setSelectedType('');
  };

  if (isLoading && documents.length === 0) {
    return (
      <div className="kyc-dashboard">
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
          <div className="text-center">
            <div className="spinner-border text-primary mb-3" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="text-muted">Loading KYC information...</p>
          </div>
        </div>
      </div>
    );
  }

  if (showCreateForm) {
    return (
      <KycForm
        kycType={selectedType}
        onSuccess={handleFormSubmit}
        onCancel={handleFormCancel}
      />
    );
  }

  const availableTypes = Object.values(kycTypes).map(type => type.name);
  const submittedTypes = documents.map(doc => {
    const kycType = Object.values(kycTypes).find(type => type.name === doc.kyc_type);
    return kycType ? kycType.name : 'Unknown';
  });
  const pendingDocuments = documents.filter(doc => doc.status === 'pending' || doc.status === 'under_review');
  const approvedDocuments = documents.filter(doc => doc.status === 'approved');
  const rejectedDocuments = documents.filter(doc => doc.status === 'rejected');

  return (
    <div className="kyc-dashboard">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4 className="mb-0" style={{ fontFamily: 'Poppins, sans-serif', fontWeight: '600' }}>
          <i className="f-id-card me-2 text-primary"></i>
          KYC Verification
        </h4>
        <button
          className="btn btn-primary"
          onClick={handleCreateKyc}
          disabled={availableTypes.length === 0}
        >
          <i className="f-plus me-2"></i>
          Submit KYC
        </button>
      </div>

      {error && (
        <div className="alert alert-danger" role="alert">
          <i className="f-exclamation-triangle me-2"></i>
          {error}
        </div>
      )}

      {/* KYC Status Overview */}
      <div className="row mb-4">
        <div className="col-md-3">
          <div className="card bg-primary text-white">
            <div className="card-body text-center">
              <i className="f-clock fa-2x mb-2"></i>
              <h5 className="card-title">{pendingDocuments.length}</h5>
              <p className="card-text small">Pending Review</p>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card bg-success text-white">
            <div className="card-body text-center">
              <i className="f-check-circle fa-2x mb-2"></i>
              <h5 className="card-title">{approvedDocuments.length}</h5>
              <p className="card-text small">Approved</p>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card bg-danger text-white">
            <div className="card-body text-center">
              <i className="f-times-circle fa-2x mb-2"></i>
              <h5 className="card-title">{rejectedDocuments.length}</h5>
              <p className="card-text small">Rejected</p>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card bg-info text-white">
            <div className="card-body text-center">
              <i className="f-file-alt fa-2x mb-2"></i>
              <h5 className="card-title">{documents.length}</h5>
              <p className="card-text small">Total Submissions</p>
            </div>
          </div>
        </div>
      </div>

      {/* Available KYC Types */}
      {availableTypes.length > 0 && (
        <div className="card mb-4">
          <div className="card-header">
            <h6 className="mb-0">
              <i className="f-list me-2"></i>
              Available KYC Types
            </h6>
          </div>
          <div className="card-body">
            <div className="row">
              {availableTypes.map(type => {
                const isSubmitted = submittedTypes.includes(type);
                const userDocument = documents.find(doc => {
                  const kycType = Object.values(kycTypes).find(kt => kt.name === doc.kyc_type);
                  return kycType && kycType.name === type;
                });
                const status = userDocument?.status;
                
                return (
                  <div key={type} className="col-md-6 col-lg-4 mb-3">
                    <div 
                      className={`card h-100 ${isSubmitted ? 'border-success' : 'border-primary'} ${isSubmitted ? 'opacity-75' : ''}`}
                      style={{ cursor: !isSubmitted ? 'pointer' : 'default' }}
                      onClick={() => !isSubmitted && handleTypeSelect(type)}
                    >
                      <div className="card-body text-center">
                        <div className="mb-3">
                          {type === 'user' && <i className="f-user fa-3x text-primary"></i>}
                          {type === 'vendor' && <i className="f-store fa-3x text-primary"></i>}
                          {type === 'property' && <i className="f-home fa-3x text-primary"></i>}
                          {type === 'vehicle' && <i className="f-car fa-3x text-primary"></i>}
                          {type === 'auction' && <i className="f-gavel fa-3x text-primary"></i>}
                        </div>
                        <h6 className="card-title">{kycService.getKycTypeDisplayName(type)}</h6>
                        <p className="card-text small text-muted">
                          {isSubmitted ? (
                            <span className={`badge ${kycService.getStatusBadgeClass(status || 'pending')}`}>
                              {kycService.getStatusDisplayName(status || 'pending')}
                            </span>
                          ) : (
                            'Click to submit KYC'
                          )}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Existing KYC Documents */}
      {documents.length > 0 && (
        <div className="card">
          <div className="card-header">
            <h6 className="mb-0">
              <i className="f-history me-2"></i>
              KYC Submission History
            </h6>
          </div>
          <div className="card-body">
            <div className="row">
              {documents.map(document => (
                <div key={document.id} className="col-12 mb-3">
                  <KycDocumentCard document={document} />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {documents.length === 0 && !isLoading && (
        <div className="card">
          <div className="card-body text-center py-5">
            <i className="f-id-card fa-4x text-muted mb-3"></i>
            <h5 className="text-muted">No KYC Submissions Yet</h5>
            <p className="text-muted mb-4">
              Complete your KYC verification to access all platform features.
            </p>
            <button
              className="btn btn-primary"
              onClick={handleCreateKyc}
              disabled={availableTypes.length === 0}
            >
              <i className="f-plus me-2"></i>
              Start KYC Verification
            </button>
          </div>
        </div>
      )}

      <style jsx>{`
        .kyc-dashboard .card {
          transition: all 0.3s ease;
        }
        
        .kyc-dashboard .card:hover:not(.opacity-75) {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }
        
        .kyc-dashboard .badge {
          font-size: 0.75rem;
        }
      `}</style>
    </div>
  );
};

export default KycDashboard;

