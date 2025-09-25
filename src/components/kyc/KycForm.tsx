'use client';

import React, { useState, useEffect } from 'react';
import { useKyc } from '@/contexts/KycContext';
import { kycService } from '@/services/kycService';

interface KycFormProps {
  kycType?: string;
  documentId?: number;
  onSuccess: () => void;
  onCancel: () => void;
}

const KycForm: React.FC<KycFormProps> = ({ kycType, documentId, onSuccess, onCancel }) => {
  const { kycTypes, createKycDocument, updateKycDocument, selectedDocument } = useKyc();
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [documents, setDocuments] = useState<File[]>([]);
  const [selectedKycType, setSelectedKycType] = useState(kycType || '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const isEditMode = !!documentId;
  const currentDocument = isEditMode ? selectedDocument : null;

  useEffect(() => {
    if (isEditMode && currentDocument) {
      setFormData(typeof currentDocument.documents === 'object' ? currentDocument.documents || {} : {});
      // Find the kyc type name from the kyc_type
      const kycType = Object.values(kycTypes).find(type => type.name === currentDocument.kyc_type);
      setSelectedKycType(kycType ? kycType.name : '');
    }
  }, [isEditMode, currentDocument, kycTypes]);

  const availableTypes = Object.values(kycTypes).map(type => type.name);
  // Get fields for the selected KYC type
  const currentTypeFields = (() => {
    const kycType = Object.values(kycTypes).find(type => type.name === selectedKycType);
    if (kycType) {
      return {
        required: kycType.required_documents || [],
        optional: []
      };
    }
    return { required: [], optional: [] };
  })();

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setDocuments(prev => [...prev, ...files]);
  };

  const removeFile = (index: number) => {
    setDocuments(prev => prev.filter((_, i) => i !== index));
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Validate required fields
    currentTypeFields.required.forEach(field => {
      if (!formData[field] || formData[field].trim() === '') {
        newErrors[field] = `${field.replace(/_/g, ' ')} is required`;
      }
    });

    // Validate email format
    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Validate phone number format (basic validation)
    if (formData.phone_number && !/^[\+]?[0-9\s\-\(\)]{10,}$/.test(formData.phone_number)) {
      newErrors.phone_number = 'Please enter a valid phone number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    try {
      const submitData = {
        type: selectedKycType,
        data: formData,
        documents: documents.length > 0 ? documents : undefined
      };

      if (isEditMode) {
        await updateKycDocument(documentId, submitData);
      } else {
        await createKycDocument(submitData);
      }

      onSuccess();
    } catch (error: unknown) {
      console.error('Error submitting KYC:', error);
      setErrors({ general: error instanceof Error ? error.message : 'Failed to submit KYC. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getFieldLabel = (field: string): string => {
    return field.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const getFieldType = (field: string): string => {
    if (field.includes('email')) return 'email';
    if (field.includes('phone')) return 'tel';
    if (field.includes('number') || field.includes('limit') || field.includes('size') || field.includes('year')) return 'number';
    if (field.includes('description')) return 'textarea';
    return 'text';
  };

  const renderField = (field: string, isRequired: boolean) => {
    const fieldType = getFieldType(field);
    const fieldLabel = getFieldLabel(field);
    const hasError = !!errors[field];

    if (fieldType === 'textarea') {
      return (
        <div key={field} className="mb-3">
          <label htmlFor={field} className="form-label">
            {fieldLabel} {isRequired && <span className="text-danger">*</span>}
          </label>
          <textarea
            id={field}
            name={field}
            value={formData[field] || ''}
            onChange={(e) => handleInputChange(field, e.target.value)}
            className={`form-control ${hasError ? 'is-invalid' : ''}`}
            rows={3}
            placeholder={`Enter ${fieldLabel.toLowerCase()}`}
          />
          {hasError && <div className="invalid-feedback">{errors[field]}</div>}
        </div>
      );
    }

    return (
      <div key={field} className="mb-3">
        <label htmlFor={field} className="form-label">
          {fieldLabel} {isRequired && <span className="text-danger">*</span>}
        </label>
        <input
          type={fieldType}
          id={field}
          name={field}
          value={formData[field] || ''}
          onChange={(e) => handleInputChange(field, e.target.value)}
          className={`form-control ${hasError ? 'is-invalid' : ''}`}
          placeholder={`Enter ${fieldLabel.toLowerCase()}`}
        />
        {hasError && <div className="invalid-feedback">{errors[field]}</div>}
      </div>
    );
  };

  return (
    <div className="kyc-form">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4 className="mb-0" style={{ fontFamily: 'Poppins, sans-serif', fontWeight: '600' }}>
          <i className="fas fa-id-card me-2 text-primary"></i>
          {isEditMode ? 'Edit KYC Document' : 'Submit KYC Verification'}
        </h4>
        <button
          type="button"
          className="btn btn-outline-secondary"
          onClick={onCancel}
        >
          <i className="fas fa-times me-2"></i>
          Cancel
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        {/* KYC Type Selection (only show if not editing) */}
        {!isEditMode && (
          <div className="card mb-4">
            <div className="card-header">
              <h6 className="mb-0">Select KYC Type</h6>
            </div>
            <div className="card-body">
              <div className="row">
                {availableTypes.map(type => (
                  <div key={type} className="col-md-6 col-lg-4 mb-3">
                    <div 
                      className={`card h-100 ${selectedKycType === type ? 'border-primary bg-light' : 'border-secondary'}`}
                      style={{ cursor: 'pointer' }}
                      onClick={() => setSelectedKycType(type)}
                    >
                      <div className="card-body text-center">
                        <div className="mb-2">
                          {type === 'user' && <i className="fas fa-user fa-2x text-primary"></i>}
                          {type === 'vendor' && <i className="fas fa-store fa-2x text-primary"></i>}
                          {type === 'property' && <i className="fas fa-home fa-2x text-primary"></i>}
                          {type === 'vehicle' && <i className="fas fa-car fa-2x text-primary"></i>}
                          {type === 'auction' && <i className="fas fa-gavel fa-2x text-primary"></i>}
                        </div>
                        <h6 className="card-title">{kycService.getKycTypeDisplayName(type)}</h6>
                        <div className="form-check">
                          <input
                            className="form-check-input"
                            type="radio"
                            name="kycType"
                            value={type}
                            checked={selectedKycType === type}
                            onChange={(e) => setSelectedKycType(e.target.value)}
                          />
                          <label className="form-check-label">Select</label>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Form Fields */}
        {selectedKycType && (
          <div className="card mb-4">
            <div className="card-header">
              <h6 className="mb-0">
                {kycService.getKycTypeDisplayName(selectedKycType)} Information
              </h6>
            </div>
            <div className="card-body">
              <div className="row">
                {/* Required Fields */}
                {currentTypeFields.required.length > 0 && (
                  <div className="col-md-6">
                    <h6 className="text-primary mb-3">Required Information</h6>
                    {currentTypeFields.required.map(field => renderField(field, true))}
                  </div>
                )}

                {/* Optional Fields */}
                {currentTypeFields.optional.length > 0 && (
                  <div className="col-md-6">
                    <h6 className="text-secondary mb-3">Additional Information</h6>
                    {currentTypeFields.optional.map(field => renderField(field, false))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Document Upload */}
        <div className="card mb-4">
          <div className="card-header">
            <h6 className="mb-0">
              <i className="fas fa-file-upload me-2"></i>
              Supporting Documents
            </h6>
          </div>
          <div className="card-body">
            <div className="mb-3">
              <label htmlFor="documents" className="form-label">
                Upload Documents (Images, PDF, Word documents)
              </label>
              <input
                type="file"
                id="documents"
                className="form-control"
                multiple
                accept="image/*,.pdf,.doc,.docx"
                onChange={handleFileChange}
              />
              <div className="form-text">
                Supported formats: JPG, PNG, PDF, DOC, DOCX (Max 10MB per file)
              </div>
            </div>

            {/* File Preview */}
            {documents.length > 0 && (
              <div className="file-preview">
                <h6 className="mb-3">Selected Files:</h6>
                {documents.map((file, index) => (
                  <div key={index} className="file-item d-flex justify-content-between align-items-center p-2 border rounded mb-2">
                    <div>
                      <i className="fas fa-file me-2"></i>
                      <span>{file.name}</span>
                      <small className="text-muted ms-2">({(file.size / 1024 / 1024).toFixed(2)} MB)</small>
                    </div>
                    <button
                      type="button"
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => removeFile(index)}
                    >
                      <i className="fas fa-times"></i>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Error Display */}
        {errors.general && (
          <div className="alert alert-danger" role="alert">
            <i className="fas fa-exclamation-triangle me-2"></i>
            {errors.general}
          </div>
        )}

        {/* Submit Button */}
        <div className="d-flex justify-content-end gap-2">
          <button
            type="button"
            className="btn btn-outline-secondary"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={isSubmitting || !selectedKycType}
          >
            {isSubmitting ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                {isEditMode ? 'Updating...' : 'Submitting...'}
              </>
            ) : (
              <>
                <i className="fas fa-paper-plane me-2"></i>
                {isEditMode ? 'Update KYC' : 'Submit KYC'}
              </>
            )}
          </button>
        </div>
      </form>

      <style jsx>{`
        .kyc-form .card {
          transition: all 0.3s ease;
        }
        
        .kyc-form .file-item {
          background-color: #f8f9fa;
        }
        
        .kyc-form .form-control:focus {
          border-color: #43ACE9;
          box-shadow: 0 0 0 0.2rem rgba(67, 172, 233, 0.25);
        }
      `}</style>
    </div>
  );
};

export default KycForm;
