'use client';

import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import { useAuth } from '@/contexts/AuthContext';
import { apiService } from '@/services/api';
import { KycDocumentFormData, KycTypeInfo, KycDocument } from '@/types';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const KycDocumentPage: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();
  const [kycTypes, setKycTypes] = useState<{ [key: string]: KycTypeInfo }>({});
  const [existingDocuments, setExistingDocuments] = useState<KycDocument[]>([]);
  const [selectedType, setSelectedType] = useState<string>('');
  const [formData, setFormData] = useState<KycDocumentFormData>({
    kyc_type: 'user',
    full_name: user?.name || '',
    email: user?.email || '',
  });
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [currentStep, setCurrentStep] = useState(1);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    } else {
      loadKycData();
    }
  }, [isAuthenticated, router]);

  const loadKycData = async () => {
    try {
      setLoading(true);
      
      // Load KYC types
      const typesResponse = await apiService.getKycTypes();
      if (typesResponse.success) {
        setKycTypes(typesResponse.data);
      }

      // Load existing KYC documents
      const documentsResponse = await apiService.getKycDocuments();
      if (documentsResponse.success) {
        setExistingDocuments(documentsResponse.data);
      }
    } catch (error) {
      console.error('Error loading KYC data:', error);
      setError('Failed to load KYC information');
    } finally {
      setLoading(false);
    }
  };

  const handleTypeSelection = (type: string) => {
    setSelectedType(type);
    setFormData(prev => ({
      ...prev,
      kyc_type: type as 'user' | 'vendor' | 'property' | 'vehicle' | 'auction',
      full_name: user?.name || '',
      email: user?.email || '',
    }));
    setCurrentStep(2);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    if (error) {
      setError('');
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setUploadedFiles(prev => [...prev, ...files]);
      setFormData(prev => ({
        ...prev,
        documents: [...(prev.documents || []), ...files]
      }));
    }
  };

  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
    setFormData(prev => ({
      ...prev,
      documents: prev.documents?.filter((_, i) => i !== index)
    }));
  };

  const validateForm = () => {
    // const type = kycTypes[selectedType];
    
    if (!formData.full_name?.trim()) {
      setError('Full name is required');
      return false;
    }
    
    if (!formData.email?.trim()) {
      setError('Email is required');
      return false;
    }

    // Type-specific validation
    if (selectedType === 'vendor') {
      if (!formData.business_name?.trim()) {
        setError('Business name is required for vendor verification');
        return false;
      }
    }

    if (selectedType === 'property') {
      if (!formData.property_type?.trim()) {
        setError('Property type is required');
        return false;
      }
    }

    if (selectedType === 'vehicle') {
      if (!formData.vehicle_make?.trim() || !formData.vehicle_model?.trim()) {
        setError('Vehicle make and model are required');
        return false;
      }
    }

    if (!uploadedFiles.length) {
      setError('Please upload at least one document');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setSubmitLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await apiService.submitKycDocument(formData);
      
      if (response.success) {
        setSuccess('KYC document submitted successfully! Your application is under review.');
        setTimeout(() => {
          router.push('/dashboard');
        }, 2000);
      } else {
        setError(response.message || 'Failed to submit KYC document. Please try again.');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit KYC document. Please try again.');
    } finally {
      setSubmitLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <Layout>
        <div className="container py-5">
          <div className="text-center">
            <h2>Please Login</h2>
            <p>You need to be logged in to submit KYC documents.</p>
            <Link href="/login" className="btn btn-primary">
              Go to Login
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  if (loading) {
    return (
      <Layout>
        <div className="container py-5">
          <div className="text-center">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-3">Loading KYC information...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="kyc-document-page">
        <div className="container py-5">
          <div className="row justify-content-center">
            <div className="col-lg-10">
              {/* Header */}
              <div className="kyc-header text-center mb-5">
                <h1 className="display-5 fw-bold text-primary mb-3">
                  <i className="fas fa-shield-alt me-3"></i>
                  KYC Document Verification
                </h1>
                <p className="lead text-muted">
                  Complete your identity verification to access all platform features
                </p>
              </div>

              {/* Existing Documents Alert */}
              {existingDocuments.length > 0 && (
                <div className="alert alert-info mb-4">
                  <h5><i className="fas fa-info-circle me-2"></i>Your KYC Status</h5>
                  <div className="existing-documents">
                    {existingDocuments.map((doc) => (
                      <div key={doc.id} className="existing-doc">
                        <span className="doc-type">{doc.kyc_type.toUpperCase()}</span>
                        <span className={`badge bg-${
                          doc.status === 'approved' ? 'success' : 
                          doc.status === 'rejected' ? 'danger' : 
                          doc.status === 'under_review' ? 'warning' : 'secondary'
                        } ms-2`}>
                          {doc.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Step 1: Type Selection */}
              {currentStep === 1 && (
                <div className="type-selection-step">
                  <h3 className="text-center mb-4">Choose Verification Type</h3>
                  <div className="row">
                    {Object.entries(kycTypes).map(([key, type]) => (
                      <div key={key} className="col-md-6 col-lg-4 mb-4">
                        <div 
                          className="kyc-type-card"
                          onClick={() => handleTypeSelection(key)}
                        >
                          <div className="type-icon" style={{ color: type.color }}>
                            <i className={type.icon}></i>
                          </div>
                          <h5>{type.name}</h5>
                          <p>{type.description}</p>
                          <div className="required-docs">
                            <small className="text-muted">Required Documents:</small>
                            <ul>
                              {type.required_documents.map((doc, index) => (
                                <li key={index}><small>{doc}</small></li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Step 2: Document Form */}
              {currentStep === 2 && selectedType && (
                <div className="document-form-step">
                  <div className="form-header mb-4">
                    <button 
                      className="btn btn-outline-secondary mb-3"
                      onClick={() => setCurrentStep(1)}
                    >
                      <i className="fas fa-arrow-left me-2"></i>
                      Back to Type Selection
                    </button>
                    <h3>
                      <i className={kycTypes[selectedType]?.icon + ' me-2'} style={{ color: kycTypes[selectedType]?.color }}></i>
                      {kycTypes[selectedType]?.name} Verification
                    </h3>
                    <p className="text-muted">{kycTypes[selectedType]?.description}</p>
                  </div>

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

                  <form onSubmit={handleSubmit}>
                    <div className="card">
                      <div className="card-header">
                        <h5><i className="fas fa-user me-2"></i>Personal Information</h5>
                      </div>
                      <div className="card-body">
                        <div className="row">
                          <div className="col-md-6 mb-3">
                            <label htmlFor="full_name" className="form-label">Full Name *</label>
                            <input
                              type="text"
                              className="form-control"
                              id="full_name"
                              name="full_name"
                              value={formData.full_name}
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
                        </div>

                        <div className="row">
                          <div className="col-md-6 mb-3">
                            <label htmlFor="phone_number" className="form-label">Phone Number</label>
                            <input
                              type="tel"
                              className="form-control"
                              id="phone_number"
                              name="phone_number"
                              value={formData.phone_number}
                              onChange={handleInputChange}
                            />
                          </div>
                          <div className="col-md-6 mb-3">
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
                        </div>

                        <div className="mb-3">
                          <label htmlFor="address" className="form-label">Address</label>
                          <textarea
                            className="form-control"
                            id="address"
                            name="address"
                            value={formData.address}
                            onChange={handleInputChange}
                            rows={2}
                          />
                        </div>

                        <div className="row">
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
                            <label htmlFor="state" className="form-label">State</label>
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
                      </div>
                    </div>

                    {/* Type-specific fields */}
                    {selectedType === 'vendor' && (
                      <div className="card mt-4">
                        <div className="card-header">
                          <h5><i className="fas fa-building me-2"></i>Business Information</h5>
                        </div>
                        <div className="card-body">
                          <div className="row">
                            <div className="col-md-6 mb-3">
                              <label htmlFor="business_name" className="form-label">Business Name *</label>
                              <input
                                type="text"
                                className="form-control"
                                id="business_name"
                                name="business_name"
                                value={formData.business_name}
                                onChange={handleInputChange}
                                required
                              />
                            </div>
                            <div className="col-md-6 mb-3">
                              <label htmlFor="business_type" className="form-label">Business Type</label>
                              <select
                                className="form-select"
                                id="business_type"
                                name="business_type"
                                value={formData.business_type}
                                onChange={handleInputChange}
                              >
                                <option value="">Select Business Type</option>
                                <option value="individual">Individual</option>
                                <option value="company">Company</option>
                                <option value="partnership">Partnership</option>
                                <option value="corporation">Corporation</option>
                              </select>
                            </div>
                          </div>

                          <div className="row">
                            <div className="col-md-6 mb-3">
                              <label htmlFor="business_registration_number" className="form-label">Registration Number</label>
                              <input
                                type="text"
                                className="form-control"
                                id="business_registration_number"
                                name="business_registration_number"
                                value={formData.business_registration_number}
                                onChange={handleInputChange}
                              />
                            </div>
                            <div className="col-md-6 mb-3">
                              <label htmlFor="tax_number" className="form-label">Tax Number</label>
                              <input
                                type="text"
                                className="form-control"
                                id="tax_number"
                                name="tax_number"
                                value={formData.tax_number}
                                onChange={handleInputChange}
                              />
                            </div>
                          </div>

                          <div className="mb-3">
                            <label htmlFor="business_address" className="form-label">Business Address</label>
                            <textarea
                              className="form-control"
                              id="business_address"
                              name="business_address"
                              value={formData.business_address}
                              onChange={handleInputChange}
                              rows={2}
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    {selectedType === 'property' && (
                      <div className="card mt-4">
                        <div className="card-header">
                          <h5><i className="fas fa-home me-2"></i>Property Information</h5>
                        </div>
                        <div className="card-body">
                          <div className="row">
                            <div className="col-md-6 mb-3">
                              <label htmlFor="property_type" className="form-label">Property Type *</label>
                              <select
                                className="form-select"
                                id="property_type"
                                name="property_type"
                                value={formData.property_type}
                                onChange={handleInputChange}
                                required
                              >
                                <option value="">Select Property Type</option>
                                <option value="residential">Residential</option>
                                <option value="commercial">Commercial</option>
                                <option value="industrial">Industrial</option>
                                <option value="land">Land</option>
                              </select>
                            </div>
                            <div className="col-md-6 mb-3">
                              <label htmlFor="property_size" className="form-label">Property Size</label>
                              <input
                                type="text"
                                className="form-control"
                                id="property_size"
                                name="property_size"
                                value={formData.property_size}
                                onChange={handleInputChange}
                                placeholder="e.g., 1500 sq ft"
                              />
                            </div>
                          </div>

                          <div className="row">
                            <div className="col-md-6 mb-3">
                              <label htmlFor="property_location" className="form-label">Property Location</label>
                              <input
                                type="text"
                                className="form-control"
                                id="property_location"
                                name="property_location"
                                value={formData.property_location}
                                onChange={handleInputChange}
                              />
                            </div>
                            <div className="col-md-6 mb-3">
                              <label htmlFor="property_ownership" className="form-label">Ownership Status</label>
                              <select
                                className="form-select"
                                id="property_ownership"
                                name="property_ownership"
                                value={formData.property_ownership}
                                onChange={handleInputChange}
                              >
                                <option value="">Select Ownership</option>
                                <option value="owned">Owned</option>
                                <option value="leased">Leased</option>
                                <option value="inherited">Inherited</option>
                              </select>
                            </div>
                          </div>

                          <div className="mb-3">
                            <label htmlFor="property_description" className="form-label">Property Description</label>
                            <textarea
                              className="form-control"
                              id="property_description"
                              name="property_description"
                              value={formData.property_description}
                              onChange={handleInputChange}
                              rows={3}
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    {selectedType === 'vehicle' && (
                      <div className="card mt-4">
                        <div className="card-header">
                          <h5><i className="fas fa-car me-2"></i>Vehicle Information</h5>
                        </div>
                        <div className="card-body">
                          <div className="row">
                            <div className="col-md-6 mb-3">
                              <label htmlFor="vehicle_make" className="form-label">Make *</label>
                              <input
                                type="text"
                                className="form-control"
                                id="vehicle_make"
                                name="vehicle_make"
                                value={formData.vehicle_make}
                                onChange={handleInputChange}
                                required
                              />
                            </div>
                            <div className="col-md-6 mb-3">
                              <label htmlFor="vehicle_model" className="form-label">Model *</label>
                              <input
                                type="text"
                                className="form-control"
                                id="vehicle_model"
                                name="vehicle_model"
                                value={formData.vehicle_model}
                                onChange={handleInputChange}
                                required
                              />
                            </div>
                          </div>

                          <div className="row">
                            <div className="col-md-6 mb-3">
                              <label htmlFor="vehicle_year" className="form-label">Year</label>
                              <input
                                type="text"
                                className="form-control"
                                id="vehicle_year"
                                name="vehicle_year"
                                value={formData.vehicle_year}
                                onChange={handleInputChange}
                              />
                            </div>
                            <div className="col-md-6 mb-3">
                              <label htmlFor="vehicle_type" className="form-label">Vehicle Type</label>
                              <select
                                className="form-select"
                                id="vehicle_type"
                                name="vehicle_type"
                                value={formData.vehicle_type}
                                onChange={handleInputChange}
                              >
                                <option value="">Select Type</option>
                                <option value="car">Car</option>
                                <option value="truck">Truck</option>
                                <option value="motorcycle">Motorcycle</option>
                                <option value="suv">SUV</option>
                                <option value="van">Van</option>
                              </select>
                            </div>
                          </div>

                          <div className="row">
                            <div className="col-md-6 mb-3">
                              <label htmlFor="vehicle_vin" className="form-label">VIN Number</label>
                              <input
                                type="text"
                                className="form-control"
                                id="vehicle_vin"
                                name="vehicle_vin"
                                value={formData.vehicle_vin}
                                onChange={handleInputChange}
                              />
                            </div>
                            <div className="col-md-6 mb-3">
                              <label htmlFor="vehicle_registration_number" className="form-label">Registration Number</label>
                              <input
                                type="text"
                                className="form-control"
                                id="vehicle_registration_number"
                                name="vehicle_registration_number"
                                value={formData.vehicle_registration_number}
                                onChange={handleInputChange}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {selectedType === 'auction' && (
                      <div className="card mt-4">
                        <div className="card-header">
                          <h5><i className="fas fa-gavel me-2"></i>Auction Item Information</h5>
                        </div>
                        <div className="card-body">
                          <div className="row">
                            <div className="col-md-6 mb-3">
                              <label htmlFor="auction_type" className="form-label">Auction Type</label>
                              <select
                                className="form-select"
                                id="auction_type"
                                name="auction_type"
                                value={formData.auction_type}
                                onChange={handleInputChange}
                              >
                                <option value="">Select Auction Type</option>
                                <option value="art">Art & Collectibles</option>
                                <option value="electronics">Electronics</option>
                                <option value="jewelry">Jewelry</option>
                                <option value="antiques">Antiques</option>
                                <option value="other">Other</option>
                              </select>
                            </div>
                            <div className="col-md-6 mb-3">
                              <label htmlFor="item_category" className="form-label">Item Category</label>
                              <input
                                type="text"
                                className="form-control"
                                id="item_category"
                                name="item_category"
                                value={formData.item_category}
                                onChange={handleInputChange}
                              />
                            </div>
                          </div>

                          <div className="row">
                            <div className="col-md-6 mb-3">
                              <label htmlFor="item_condition" className="form-label">Item Condition</label>
                              <select
                                className="form-select"
                                id="item_condition"
                                name="item_condition"
                                value={formData.item_condition}
                                onChange={handleInputChange}
                              >
                                <option value="">Select Condition</option>
                                <option value="new">New</option>
                                <option value="excellent">Excellent</option>
                                <option value="good">Good</option>
                                <option value="fair">Fair</option>
                                <option value="poor">Poor</option>
                              </select>
                            </div>
                            <div className="col-md-6 mb-3">
                              <label htmlFor="estimated_value" className="form-label">Estimated Value</label>
                              <input
                                type="text"
                                className="form-control"
                                id="estimated_value"
                                name="estimated_value"
                                value={formData.estimated_value}
                                onChange={handleInputChange}
                                placeholder="e.g., $1000"
                              />
                            </div>
                          </div>

                          <div className="mb-3">
                            <label htmlFor="item_description" className="form-label">Item Description</label>
                            <textarea
                              className="form-control"
                              id="item_description"
                              name="item_description"
                              value={formData.item_description}
                              onChange={handleInputChange}
                              rows={3}
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    {/* File Upload Section */}
                    <div className="card mt-4">
                      <div className="card-header">
                        <h5><i className="fas fa-upload me-2"></i>Document Upload</h5>
                      </div>
                      <div className="card-body">
                        <div className="mb-3">
                          <label htmlFor="documents" className="form-label">Upload Documents *</label>
                          <input
                            type="file"
                            className="form-control"
                            id="documents"
                            name="documents"
                            multiple
                            accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                            onChange={handleFileChange}
                          />
                          <div className="form-text">
                            Accepted formats: PDF, JPG, PNG, DOC, DOCX. Max file size: 10MB each.
                          </div>
                        </div>

                        {/* Required Documents List */}
                        <div className="required-docs-list mb-3">
                          <h6>Required Documents:</h6>
                          <ul className="list-unstyled">
                            {kycTypes[selectedType]?.required_documents.map((doc, index) => (
                              <li key={index} className="mb-1">
                                <i className="fas fa-check-circle text-success me-2"></i>
                                {doc}
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Uploaded Files List */}
                        {uploadedFiles.length > 0 && (
                          <div className="uploaded-files">
                            <h6>Uploaded Files:</h6>
                            <div className="files-list">
                              {uploadedFiles.map((file, index) => (
                                <div key={index} className="file-item">
                                  <div className="file-info">
                                    <i className="fas fa-file me-2"></i>
                                    <span>{file.name}</span>
                                    <small className="text-muted">({(file.size / 1024 / 1024).toFixed(2)} MB)</small>
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
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Additional Information */}
                    <div className="card mt-4">
                      <div className="card-header">
                        <h5><i className="fas fa-info-circle me-2"></i>Additional Information</h5>
                      </div>
                      <div className="card-body">
                        <div className="mb-3">
                          <label htmlFor="additional_info" className="form-label">Additional Notes</label>
                          <textarea
                            className="form-control"
                            id="additional_info"
                            name="additional_info"
                            value={formData.additional_info}
                            onChange={handleInputChange}
                            rows={3}
                            placeholder="Any additional information you'd like to provide..."
                          />
                        </div>
                      </div>
                    </div>

                    {/* Submit Button */}
                    <div className="text-center mt-4">
                      <button 
                        type="submit" 
                        className="btn btn-primary btn-lg"
                        disabled={submitLoading}
                      >
                        {submitLoading ? (
                          <>
                            <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                            Submitting...
                          </>
                        ) : (
                          <>
                            <i className="fas fa-paper-plane me-2"></i>
                            Submit KYC Document
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </div>
          </div>
        </div>

        <style jsx>{`
          .kyc-document-page {
            min-height: 100vh;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            padding: 2rem 0;
          }

          .kyc-header {
            color: white;
            margin-bottom: 3rem;
          }

          .kyc-type-card {
            background: white;
            border-radius: var(--border-radius-lg);
            padding: 2rem;
            text-align: center;
            cursor: pointer;
            transition: all 0.3s ease;
            height: 100%;
            border: 2px solid transparent;
          }

          .kyc-type-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
            border-color: var(--primary-color);
          }

          .type-icon {
            font-size: 3rem;
            margin-bottom: 1rem;
          }

          .kyc-type-card h5 {
            color: var(--secondary-color);
            font-weight: 600;
            margin-bottom: 1rem;
          }

          .kyc-type-card p {
            color: var(--gray-600);
            margin-bottom: 1rem;
          }

          .required-docs ul {
            text-align: left;
            padding-left: 0;
            list-style: none;
          }

          .required-docs li {
            color: var(--gray-600);
            font-size: 12px;
            margin-bottom: 0.25rem;
          }

          .required-docs li::before {
            content: '•';
            color: var(--primary-color);
            margin-right: 0.5rem;
          }

          .document-form-step {
            background: white;
            border-radius: var(--border-radius-lg);
            padding: 2rem;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
          }

          .card {
            border: none;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
            border-radius: var(--border-radius-lg);
          }

          .card-header {
            background: var(--gray-50);
            border-bottom: 1px solid var(--gray-200);
            border-radius: var(--border-radius-lg) var(--border-radius-lg) 0 0 !important;
          }

          .card-header h5 {
            margin: 0;
            color: var(--secondary-color);
            font-weight: 600;
          }

          .form-label {
            font-weight: 600;
            color: var(--secondary-color);
            margin-bottom: 0.5rem;
          }

          .form-control, .form-select {
            border-radius: var(--border-radius-lg);
            border: 1px solid var(--gray-300);
            transition: border-color 0.3s ease;
          }

          .form-control:focus, .form-select:focus {
            border-color: var(--primary-color);
            box-shadow: 0 0 0 0.2rem rgba(67, 172, 233, 0.25);
          }

          .uploaded-files {
            background: var(--gray-50);
            border-radius: var(--border-radius-lg);
            padding: 1rem;
          }

          .file-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 0.5rem;
            background: white;
            border-radius: var(--border-radius-sm);
            margin-bottom: 0.5rem;
          }

          .file-item:last-child {
            margin-bottom: 0;
          }

          .existing-documents {
            display: flex;
            flex-wrap: wrap;
            gap: 1rem;
          }

          .existing-doc {
            display: flex;
            align-items: center;
          }

          .doc-type {
            font-weight: 600;
            color: var(--secondary-color);
          }

          .required-docs-list ul {
            margin: 0;
          }

          .btn {
            border-radius: var(--border-radius-lg);
            font-weight: 500;
            transition: all 0.3s ease;
          }

          .btn-primary:hover {
            transform: translateY(-1px);
          }

          .alert {
            border-radius: var(--border-radius-lg);
            border: none;
          }

          @media (max-width: 768px) {
            .kyc-document-page {
              padding: 1rem 0;
            }

            .document-form-step {
              padding: 1.5rem;
            }

            .kyc-type-card {
              padding: 1.5rem;
            }

            .type-icon {
              font-size: 2rem;
            }
          }
        `}</style>
      </div>
    </Layout>
  );
};

export default KycDocumentPage;
