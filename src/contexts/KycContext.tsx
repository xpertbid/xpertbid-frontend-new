'use client';

import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { apiService } from '@/services/api';
import { KycDocument, KycType, KycTypeInfo, KycDocumentFormData } from '@/types';

interface KycState {
  documents: KycDocument[];
  kycTypes: { [key: string]: KycTypeInfo };
  isLoading: boolean;
  error: string | null;
  selectedDocument: KycDocument | null;
}

interface KycContextType extends KycState {
  loadKycDocuments: () => Promise<void>;
  loadKycTypes: () => Promise<void>;
  createKycDocument: (formData: Record<string, unknown>) => Promise<void>;
  updateKycDocument: (id: number, formData: Record<string, unknown>) => Promise<void>;
  uploadDocument: (id: number, file: File) => Promise<void>;
  removeDocument: (id: number, documentPath: string) => Promise<void>;
  setSelectedDocument: (document: KycDocument | null) => void;
  clearError: () => void;
}

type KycAction =
  | { type: 'KYC_START' }
  | { type: 'KYC_DOCUMENTS_LOADED'; payload: KycDocument[] }
  | { type: 'KYC_TYPES_LOADED'; payload: { [key: string]: KycTypeInfo } }
  | { type: 'KYC_DOCUMENT_CREATED'; payload: KycDocument }
  | { type: 'KYC_DOCUMENT_UPDATED'; payload: KycDocument }
  | { type: 'KYC_DOCUMENT_SELECTED'; payload: KycDocument | null }
  | { type: 'KYC_FAILURE'; payload: string }
  | { type: 'KYC_CLEAR_ERROR' };

const KycContext = createContext<KycContextType | undefined>(undefined);

const kycReducer = (state: KycState, action: KycAction): KycState => {
  switch (action.type) {
    case 'KYC_START':
      return {
        ...state,
        isLoading: true,
        error: null,
      };
    case 'KYC_DOCUMENTS_LOADED':
      return {
        ...state,
        documents: action.payload,
        isLoading: false,
        error: null,
      };
    case 'KYC_TYPES_LOADED':
      return {
        ...state,
        kycTypes: action.payload,
        isLoading: false,
        error: null,
      };
    case 'KYC_DOCUMENT_CREATED':
      return {
        ...state,
        documents: [action.payload, ...state.documents],
        isLoading: false,
        error: null,
      };
    case 'KYC_DOCUMENT_UPDATED':
      return {
        ...state,
        documents: state.documents.map(doc => 
          doc.id === action.payload.id ? action.payload : doc
        ),
        isLoading: false,
        error: null,
      };
    case 'KYC_DOCUMENT_SELECTED':
      return {
        ...state,
        selectedDocument: action.payload,
      };
    case 'KYC_FAILURE':
      return {
        ...state,
        isLoading: false,
        error: action.payload,
      };
    case 'KYC_CLEAR_ERROR':
      return {
        ...state,
        error: null,
      };
    default:
      return state;
  }
};

export const KycProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(kycReducer, {
    documents: [],
    kycTypes: {},
    isLoading: false,
    error: null,
    selectedDocument: null,
  });

  const loadKycDocuments = async () => {
    dispatch({ type: 'KYC_START' });
    try {
      const response = await apiService.getKycDocuments();
      if (response.success) {
        dispatch({ type: 'KYC_DOCUMENTS_LOADED', payload: response.data });
      } else {
        throw new Error(response.message || 'Failed to load KYC documents');
      }
    } catch (error: unknown) {
      dispatch({ type: 'KYC_FAILURE', payload: error instanceof Error ? error.message : 'Failed to load KYC documents' });
    }
  };

  const loadKycTypes = async () => {
    dispatch({ type: 'KYC_START' });
    try {
      const response = await apiService.getKycTypes();
      if (response.success) {
        dispatch({ type: 'KYC_TYPES_LOADED', payload: response.data });
      } else {
        throw new Error(response.message || 'Failed to load KYC types');
      }
    } catch (error: unknown) {
      dispatch({ type: 'KYC_FAILURE', payload: error instanceof Error ? error.message : 'Failed to load KYC types' });
    }
  };

  const createKycDocument = async (formData: Record<string, unknown>) => {
    dispatch({ type: 'KYC_START' });
    try {
      const response = await apiService.submitKycDocument(formData as KycDocumentFormData);
      if (response.success) {
        dispatch({ type: 'KYC_DOCUMENT_CREATED', payload: response.data });
      } else {
        throw new Error(response.message || 'Failed to create KYC document');
      }
    } catch (error: unknown) {
      dispatch({ type: 'KYC_FAILURE', payload: error instanceof Error ? error.message : 'Failed to create KYC document' });
      throw error;
    }
  };

  const updateKycDocument = async (id: number, formData: Record<string, unknown>) => {
    dispatch({ type: 'KYC_START' });
    try {
      const response = await apiService.updateKycDocument(id, formData as Partial<KycDocumentFormData>);
      if (response.success) {
        dispatch({ type: 'KYC_DOCUMENT_UPDATED', payload: response.data });
      } else {
        throw new Error(response.message || 'Failed to update KYC document');
      }
    } catch (error: unknown) {
      dispatch({ type: 'KYC_FAILURE', payload: error instanceof Error ? error.message : 'Failed to update KYC document' });
      throw error;
    }
  };

  const uploadDocument = async (id: number, file: File) => {
    // TODO: Implement document upload
    throw new Error('Document upload not implemented yet');
  };

  const removeDocument = async (id: number, documentPath: string) => {
    // TODO: Implement document removal
    throw new Error('Document removal not implemented yet');
  };

  const setSelectedDocument = (document: KycDocument | null) => {
    dispatch({ type: 'KYC_DOCUMENT_SELECTED', payload: document });
  };

  const clearError = () => {
    dispatch({ type: 'KYC_CLEAR_ERROR' });
  };

  // Load KYC types on mount
  useEffect(() => {
    loadKycTypes();
  }, []);

  return (
    <KycContext.Provider
      value={{
        ...state,
        loadKycDocuments,
        loadKycTypes,
        createKycDocument,
        updateKycDocument,
        uploadDocument,
        removeDocument,
        setSelectedDocument,
        clearError,
      }}
    >
      {children}
    </KycContext.Provider>
  );
};

export const useKyc = (): KycContextType => {
  const context = useContext(KycContext);
  if (context === undefined) {
    throw new Error('useKyc must be used within a KycProvider');
  }
  return context;
};
