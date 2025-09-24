'use client';

import React, { useState } from 'react';
import { useKyc } from '@/contexts/KycContext';
import { kycService } from '@/services/kycService';
import { KycDocument } from '@/services/kycService';

interface KycDocumentCardProps {
  document: KycDocument;
}

const KycDocumentCard: React.FC<KycDocumentCardProps> = ({ document }) => {
  const { setSelectedDocument } = useKyc();
  const [showDetails, setShowDetails] = useState(false);

  const handleViewDetails = () => {
    setSelectedDocument(document);
    setShowDetails(true);
  };

  const handleEdit = () => {
    setSelectedDocument(document);
    // This would trigger the edit form
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return 'fas fa-clock text-warning';
      case 'approved':
        return 'fas fa-check-circle text-success';
      case 'rejected':
        return 'fas fa-times-circle text-danger';
      case 'under_review':
        return 'fas fa-eye text-info';
      default:
        return 'fas fa-question-circle text-secondary';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'user':
        return 'fas fa-user text-primary';
      case 'vendor':
        return 'fas fa-store text-primary';
      case 'property':
        return 'fas fa-home text-primary';
      case 'vehicle':
        return 'fas fa-car text-primary';
      case 'auction':
        return 'fas fa-gavel text-primary';
      default:
        return 'fas fa-file text-secondary';
    }
  };

  return (
    <div className="kyc-document-card">
      <div className="card">
        <div className="card-body">
          <div className="row align-items-center">
            <div className="col-md-1">
              <i className={`${getTypeIcon(document.type)} fa-2x`}></i>
            </div>
            <div className="col-md-3">
              <h6 className="card-title mb-1">
                {kycService.getKycTypeDisplayName(document.type)}
              </h6>
              <small className="text-muted">
                Submitted: {formatDate(document.created_at)}
              </small>
            </div>
            <div className="col-md-2">
              <span className={`badge ${kycService.getStatusBadgeClass(document.status)}`}>
                <i className={`${getStatusIcon(document.status)} me-1`}></i>
                {kycService.getStatusDisplayName(document.status)}
              </span>
            </div>
            <div className="col-md-2">
              <small className="text-muted">
                <i className="fas fa-file me-1"></i>
                {document.documents?.length || 0} documents
              </small>
            </div>
            <div className="col-md-4">
              <div className="btn-group btn-group-sm">
                <button
                  className="btn btn-outline-primary"
                  onClick={handleViewDetails}
                  title="View Details"
                >
                  <i className="fas fa-eye"></i>
                </button>
                {(document.status === 'rejected' || document.status === 'pending') && (
                  <button
                    className="btn btn-outline-warning"
                    onClick={handleEdit}
                    title="Edit"
                  >
                    <i className="fas fa-edit"></i>
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Admin Notes (if available) */}
          {document.admin_notes && (
            <div className="mt-3 p-3 bg-light rounded">
              <h6 className="text-muted mb-2">
                <i className="fas fa-comment me-2"></i>
                Admin Notes:
              </h6>
              <p className="mb-0 small">{document.admin_notes}</p>
              {document.reviewed_at && (
                <small className="text-muted">
                  Reviewed: {formatDate(document.reviewed_at)}
                  {document.reviewer && ` by ${document.reviewer.name}`}
                </small>
              )}
            </div>
          )}

          {/* Document Preview */}
          {document.documents && document.documents.length > 0 && (
            <div className="mt-3">
              <h6 className="text-muted mb-2">
                <i className="fas fa-paperclip me-2"></i>
                Attached Documents:
              </h6>
              <div className="row">
                {document.documents.slice(0, 3).map((docPath, index) => (
                  <div key={index} className="col-md-4 mb-2">
                    <div className="document-preview p-2 border rounded">
                      <i className="fas fa-file-pdf text-danger me-2"></i>
                      <small className="text-muted">
                        Document {index + 1}
                      </small>
                    </div>
                  </div>
                ))}
                {document.documents.length > 3 && (
                  <div className="col-md-4 mb-2">
                    <div className="document-preview p-2 border rounded text-center">
                      <small className="text-muted">
                        +{document.documents.length - 3} more
                      </small>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Details Modal would go here */}
      {showDetails && (
        <KycDocumentDetails
          document={document}
          onClose={() => setShowDetails(false)}
        />
      )}

      <style jsx>{`
        .kyc-document-card .card {
          transition: all 0.3s ease;
        }
        
        .kyc-document-card .card:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }
        
        .kyc-document-card .document-preview {
          background-color: #f8f9fa;
          transition: all 0.3s ease;
        }
        
        .kyc-document-card .document-preview:hover {
          background-color: #e9ecef;
        }
      `}</style>
    </div>
  );
};

// KYC Document Details Component
interface KycDocumentDetailsProps {
  document: KycDocument;
  onClose: () => void;
}

const KycDocumentDetails: React.FC<KycDocumentDetailsProps> = ({ document, onClose }) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h5 className="modal-title">
            KYC Document Details - {kycService.getKycTypeDisplayName(document.type)}
          </h5>
          <button type="button" className="btn-close" onClick={onClose}></button>
        </div>
        
        <div className="modal-body">
          {/* Document Information */}
          <div className="row mb-4">
            <div className="col-md-6">
              <h6>Document Information</h6>
              <table className="table table-sm">
                <tbody>
                  <tr>
                    <td><strong>Type:</strong></td>
                    <td>{kycService.getKycTypeDisplayName(document.type)}</td>
                  </tr>
                  <tr>
                    <td><strong>Status:</strong></td>
                    <td>
                      <span className={`badge ${kycService.getStatusBadgeClass(document.status)}`}>
                        {kycService.getStatusDisplayName(document.status)}
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td><strong>Submitted:</strong></td>
                    <td>{formatDate(document.created_at)}</td>
                  </tr>
                  <tr>
                    <td><strong>Last Updated:</strong></td>
                    <td>{formatDate(document.updated_at)}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            
            <div className="col-md-6">
              <h6>Review Information</h6>
              <table className="table table-sm">
                <tbody>
                  <tr>
                    <td><strong>Reviewed At:</strong></td>
                    <td>{document.reviewed_at ? formatDate(document.reviewed_at) : 'Not reviewed'}</td>
                  </tr>
                  <tr>
                    <td><strong>Reviewed By:</strong></td>
                    <td>{document.reviewer?.name || 'Not assigned'}</td>
                  </tr>
                  <tr>
                    <td><strong>Documents:</strong></td>
                    <td>{document.documents?.length || 0} files</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Form Data */}
          {document.data && (
            <div className="mb-4">
              <h6>Submitted Information</h6>
              <div className="row">
                {Object.entries(document.data).map(([key, value]) => (
                  <div key={key} className="col-md-6 mb-2">
                    <strong>{key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}:</strong>
                    <br />
                    <span className="text-muted">{String(value)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Admin Notes */}
          {document.admin_notes && (
            <div className="mb-4">
              <h6>Admin Notes</h6>
              <div className="p-3 bg-light rounded">
                <p className="mb-0">{document.admin_notes}</p>
              </div>
            </div>
          )}

          {/* Documents */}
          {document.documents && document.documents.length > 0 && (
            <div>
              <h6>Attached Documents</h6>
              <div className="row">
                {document.documents.map((docPath, index) => (
                  <div key={index} className="col-md-4 mb-3">
                    <div className="card">
                      <div className="card-body text-center">
                        <i className="fas fa-file-pdf fa-3x text-danger mb-2"></i>
                        <h6 className="card-title">Document {index + 1}</h6>
                        <button className="btn btn-sm btn-outline-primary">
                          <i className="fas fa-download me-1"></i>
                          Download
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        
        <div className="modal-footer">
          <button type="button" className="btn btn-secondary" onClick={onClose}>
            Close
          </button>
        </div>
      </div>

      <style jsx>{`
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 9999;
          padding: 20px;
        }

        .modal-content {
          background: white;
          border-radius: 8px;
          width: 100%;
          max-width: 800px;
          max-height: 90vh;
          overflow-y: auto;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
        }

        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 20px;
          border-bottom: 1px solid #e9ecef;
        }

        .modal-body {
          padding: 20px;
        }

        .modal-footer {
          padding: 20px;
          border-top: 1px solid #e9ecef;
          display: flex;
          justify-content: flex-end;
        }

        .btn-close {
          background: none;
          border: none;
          font-size: 1.5rem;
          cursor: pointer;
        }
      `}</style>
    </div>
  );
};

export default KycDocumentCard;
