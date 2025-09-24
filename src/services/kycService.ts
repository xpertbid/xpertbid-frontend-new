import { apiService } from './api';

export interface KycDocument {
  id: number;
  user_id: number;
  type: 'user' | 'vendor' | 'property' | 'vehicle' | 'auction';
  status: 'pending' | 'approved' | 'rejected' | 'under_review';
  data: Record<string, any>;
  documents: string[];
  admin_notes?: string;
  reviewed_at?: string;
  reviewer_id?: number;
  created_at: string;
  updated_at: string;
  user?: {
    id: number;
    name: string;
    email: string;
  };
  reviewer?: {
    id: number;
    name: string;
    email: string;
  };
}

export interface KycFormData {
  type: string;
  data: Record<string, any>;
  documents?: File[];
}

export interface KycTypeFields {
  required: string[];
  optional: string[];
}

export interface KycTypes {
  [key: string]: KycTypeFields;
}

class KycService {
  private baseUrl = '/kyc';

  async getKycDocuments(): Promise<KycDocument[]> {
    try {
      const response = await apiService.customRequest(this.baseUrl);
      return response.data || [];
    } catch (error) {
      console.error('Error fetching KYC documents:', error);
      throw error;
    }
  }

  async getKycDocument(id: number): Promise<KycDocument> {
    try {
      const response = await apiService.customRequest(`${this.baseUrl}/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching KYC document:', error);
      throw error;
    }
  }

  async createKycDocument(formData: KycFormData): Promise<KycDocument> {
    try {
      const data = new FormData();
      data.append('type', formData.type);
      data.append('data', JSON.stringify(formData.data));
      
      if (formData.documents) {
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

  async updateKycDocument(id: number, formData: KycFormData): Promise<KycDocument> {
    try {
      const data = new FormData();
      data.append('_method', 'PUT');
      data.append('data', JSON.stringify(formData.data));
      
      if (formData.documents) {
        formData.documents.forEach((file, index) => {
          data.append(`documents[${index}]`, file);
        });
      }

      const response = await apiService.customRequest(`${this.baseUrl}/${id}`, {
        method: 'POST',
        body: data,
      });
      return response.data;
    } catch (error) {
      console.error('Error updating KYC document:', error);
      throw error;
    }
  }

  async uploadDocument(id: number, file: File): Promise<void> {
    try {
      const data = new FormData();
      data.append('document', file);

      await apiService.customRequest(`${this.baseUrl}/${id}/upload-document`, {
        method: 'POST',
        body: data,
      });
    } catch (error) {
      console.error('Error uploading document:', error);
      throw error;
    }
  }

  async removeDocument(id: number, documentPath: string): Promise<void> {
    try {
      await apiService.customRequest(`${this.baseUrl}/${id}/remove-document`, {
        method: 'DELETE',
        body: JSON.stringify({ document_path: documentPath }),
      });
    } catch (error) {
      console.error('Error removing document:', error);
      throw error;
    }
  }

  async getKycTypes(): Promise<KycTypes> {
    try {
      const response = await apiService.customRequest('/kyc-types');
      return response.data || {};
    } catch (error) {
      console.error('Error fetching KYC types:', error);
      // Return empty object as fallback instead of throwing
      return {};
    }
  }

  getKycTypeFields(kycTypes: KycTypes, type: string): KycTypeFields {
    return kycTypes[type] || { required: [], optional: [] };
  }

  getKycTypeDisplayName(type: string): string {
    const displayNames = {
      'user': 'E-commerce User',
      'vendor': 'Vendor',
      'property': 'Property User',
      'vehicle': 'Vehicle User',
      'auction': 'Auction User'
    };
    return displayNames[type as keyof typeof displayNames] || type;
  }

  getStatusDisplayName(status: string): string {
    const displayNames = {
      'pending': 'Pending Review',
      'approved': 'Approved',
      'rejected': 'Rejected',
      'under_review': 'Under Review'
    };
    return displayNames[status as keyof typeof displayNames] || status;
  }

  getStatusBadgeClass(status: string): string {
    const badgeClasses = {
      'pending': 'bg-warning',
      'approved': 'bg-success',
      'rejected': 'bg-danger',
      'under_review': 'bg-info'
    };
    return badgeClasses[status as keyof typeof badgeClasses] || 'bg-secondary';
  }
}

export const kycService = new KycService();
