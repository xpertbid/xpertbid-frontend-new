// /services/kycService.js
import { apiService } from './api';

class KycService {
  constructor() {
    this.baseUrl = '/kyc';
  }

  async getKycDocuments() {
    try {
      const response = await apiService.customRequest(`${this.baseUrl}`);
      return response?.data ?? [];
    } catch (error) {
      console.error('Error fetching KYC documents:', error);
      throw error;
    }
  }

  async getKycDocument(id) {
    try {
      const response = await apiService.customRequest(
        `${this.baseUrl}/${id}`
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching KYC document:', error);
      throw error;
    }
  }

  async createKycDocument(formData) {
    try {
      const data = new FormData();
      data.append('type', formData.type);
      data.append('data', JSON.stringify(formData.data));

      if (formData.documents?.length) {
        formData.documents.forEach((file, index) => {
          data.append(`documents[${index}]`, file);
        });
      }

      const response = await apiService.customRequest(this.baseUrl, {
        method: 'POST',
        body: data,
      });

      return response.data;
    } catch (error) {
      console.error('Error creating KYC document:', error);
      throw error;
    }
  }

  async updateKycDocument(id, formData) {
    try {
      const data = new FormData();
      data.append('_method', 'PUT'); // if your backend uses method-override
      data.append('data', JSON.stringify(formData.data));

      if (formData.documents?.length) {
        formData.documents.forEach((file, index) => {
          data.append(`documents[${index}]`, file);
        });
      }

      const response = await apiService.customRequest(
        `${this.baseUrl}/${id}`,
        {
          method: 'POST', // or 'PUT' if your backend supports direct PUT multipart
          body: data,
        }
      );

      return response.data;
    } catch (error) {
      console.error('Error updating KYC document:', error);
      throw error;
    }
  }

  async uploadDocument(id, file) {
    try {
      const data = new FormData();
      data.append('document', file);

      await apiService.customRequest(
        `${this.baseUrl}/${id}/upload-document`,
        {
          method: 'POST',
          body: data,
        }
      );
    } catch (error) {
      console.error('Error uploading document:', error);
      throw error;
    }
  }

  async removeDocument(id, documentPath) {
    try {
      await apiService.customRequest(
        `${this.baseUrl}/${id}/remove-document`,
        {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ document_path: documentPath }),
        }
      );
    } catch (error) {
      console.error('Error removing document:', error);
      throw error;
    }
  }

  async getKycTypes() {
    try {
      const response = await apiService.customRequest('/kyc-types');
      return response?.data ?? {};
    } catch (error) {
      console.error('Error fetching KYC types:', error);
      // graceful fallback
      return {};
    }
  }

  getKycTypeFields(kycTypes, type) {
    return kycTypes[type] || { required: [], optional: [] };
  }

  getKycTypeDisplayName(type) {
    const displayNames = {
      user: 'E-commerce User',
      vendor: 'Vendor',
      property: 'Property User',
      vehicle: 'Vehicle User',
      auction: 'Auction User',
    };
    return displayNames[type] || type;
  }

  getStatusDisplayName(status) {
    const displayNames = {
      pending: 'Pending Review',
      approved: 'Approved',
      rejected: 'Rejected',
      under_review: 'Under Review',
    };
    return displayNames[status] || status;
  }

  getStatusBadgeClass(status) {
    const badgeClasses = {
      pending: 'bg-warning',
      approved: 'bg-success',
      rejected: 'bg-danger',
      under_review: 'bg-info',
    };
    return badgeClasses[status] || 'bg-secondary';
  }
}

export const kycService = new KycService();
