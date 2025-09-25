'use client';

import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { apiService } from '@/services/api';

const KycContext = createContext(undefined);

const kycReducer = (state, action) => {
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
        isLoading: false,
        documents: action.payload,
        error: null,
      };
    case 'KYC_TYPES_LOADED':
      return {
        ...state,
        kycTypes: action.payload,
        error: null,
      };
    case 'KYC_DOCUMENT_CREATED':
      return {
        ...state,
        documents: [...state.documents, action.payload],
        error: null,
      };
    case 'KYC_DOCUMENT_UPDATED':
      return {
        ...state,
        documents: state.documents.map(doc => 
          doc.id === action.payload.id ? action.payload : doc
        ),
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
    default:
      return state;
  }
};

const initialState = {
  documents: [],
  kycTypes: {},
  selectedDocument: null,
  isLoading: false,
  error: null,
};

export const KycProvider = ({ children }) => {
  const [state, dispatch] = useReducer(kycReducer, initialState);

  const loadKycDocuments = async (userId) => {
    dispatch({ type: 'KYC_START' });
    
    try {
      const response = await apiService.get(`/kyc/documents/${userId}`);
      
      if (response.success) {
        dispatch({
          type: 'KYC_DOCUMENTS_LOADED',
          payload: response.data || [],
        });
      } else {
        dispatch({
          type: 'KYC_FAILURE',
          payload: response.message || 'Failed to load KYC documents',
        });
      }
    } catch (error) {
      dispatch({
        type: 'KYC_FAILURE',
        payload: error.message || 'Failed to load KYC documents',
      });
    }
  };

  const loadKycTypes = async () => {
    try {
      const response = await apiService.get('/kyc/types');
      
      if (response.success) {
        dispatch({
          type: 'KYC_TYPES_LOADED',
          payload: response.data || {},
        });
      }
    } catch (error) {
      console.error('Failed to load KYC types:', error);
    }
  };

  const createKycDocument = async (documentData) => {
    dispatch({ type: 'KYC_START' });
    
    try {
      const response = await apiService.post('/kyc/documents', documentData);
      
      if (response.success) {
        dispatch({
          type: 'KYC_DOCUMENT_CREATED',
          payload: response.data,
        });
        return { success: true, data: response.data };
      } else {
        dispatch({
          type: 'KYC_FAILURE',
          payload: response.message || 'Failed to create KYC document',
        });
        return { success: false, error: response.message };
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to create KYC document';
      dispatch({
        type: 'KYC_FAILURE',
        payload: errorMessage,
      });
      return { success: false, error: errorMessage };
    }
  };

  const updateKycDocument = async (documentId, documentData) => {
    dispatch({ type: 'KYC_START' });
    
    try {
      const response = await apiService.put(`/kyc/documents/${documentId}`, documentData);
      
      if (response.success) {
        dispatch({
          type: 'KYC_DOCUMENT_UPDATED',
          payload: response.data,
        });
        return { success: true, data: response.data };
      } else {
        dispatch({
          type: 'KYC_FAILURE',
          payload: response.message || 'Failed to update KYC document',
        });
        return { success: false, error: response.message };
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to update KYC document';
      dispatch({
        type: 'KYC_FAILURE',
        payload: errorMessage,
      });
      return { success: false, error: errorMessage };
    }
  };

  const setSelectedDocument = (document) => {
    dispatch({
      type: 'KYC_DOCUMENT_SELECTED',
      payload: document,
    });
  };

  const value = {
    ...state,
    loadKycDocuments,
    loadKycTypes,
    createKycDocument,
    updateKycDocument,
    setSelectedDocument,
  };

  return (
    <KycContext.Provider value={value}>
      {children}
    </KycContext.Provider>
  );
};

export const useKyc = () => {
  const context = useContext(KycContext);
  if (context === undefined) {
    throw new Error('useKyc must be used within a KycProvider');
  }
  return context;
};