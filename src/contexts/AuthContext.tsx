'use client';

import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { apiService } from '@/services/api';

interface User {
  id: number;
  name: string;
  email: string;
  avatar?: string;
  phone?: string;
  user_type?: string;
  status?: string;
  email_verified_at?: string;
  created_at?: string;
  updated_at?: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  register: (data: {
    name: string;
    email: string;
    password: string;
    password_confirmation: string;
  }) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (data: Partial<User>) => Promise<void>;
  clearError: () => void;
}

type AuthAction =
  | { type: 'AUTH_START' }
  | { type: 'AUTH_SUCCESS'; payload: { user: User; token: string } }
  | { type: 'AUTH_FAILURE'; payload: string }
  | { type: 'AUTH_LOGOUT' }
  | { type: 'AUTH_CLEAR_ERROR' }
  | { type: 'AUTH_UPDATE_USER'; payload: User };

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'AUTH_START':
      return {
        ...state,
        isLoading: true,
        error: null,
      };
    case 'AUTH_SUCCESS':
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      };
    case 'AUTH_FAILURE':
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        error: action.payload,
      };
    case 'AUTH_LOGOUT':
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      };
    case 'AUTH_CLEAR_ERROR':
      return {
        ...state,
        error: null,
      };
    case 'AUTH_UPDATE_USER':
      return {
        ...state,
        user: action.payload,
      };
    default:
      return state;
  }
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, {
    user: null,
    token: null,
    isAuthenticated: false,
    isLoading: true,
    error: null,
  });

  // Load auth state from localStorage on mount
  useEffect(() => {
    const loadAuthState = async () => {
      try {
        const token = localStorage.getItem('auth_token');
        const userData = localStorage.getItem('auth_user');

        if (token && userData) {
          const user = JSON.parse(userData);
          
          // Set token in API service
          apiService.setAuthToken(token);
          
          // Verify token is still valid
          try {
            const response = await apiService.getProfile();
            if (response && response.data) {
              dispatch({
                type: 'AUTH_SUCCESS',
                payload: { user: response.data, token },
              });
            } else {
              // Token is invalid, clear storage
              localStorage.removeItem('auth_token');
              localStorage.removeItem('auth_user');
              apiService.removeAuthToken();
              dispatch({ type: 'AUTH_LOGOUT' });
            }
          } catch (error) {
            // Token is invalid, clear storage
            localStorage.removeItem('auth_token');
            localStorage.removeItem('auth_user');
            apiService.removeAuthToken();
            dispatch({ type: 'AUTH_LOGOUT' });
          }
        } else {
          dispatch({ type: 'AUTH_LOGOUT' });
        }
      } catch (error) {
        console.error('Error loading auth state:', error);
        dispatch({ type: 'AUTH_LOGOUT' });
      }
    };

    loadAuthState();
  }, []);

  const login = async (email: string, password: string) => {
    dispatch({ type: 'AUTH_START' });

    try {
      const response = await apiService.login({ email, password });
      
      if (response && response.success && response.data) {
        const { user, token } = response.data;
        
        // Store in localStorage
        localStorage.setItem('auth_token', token);
        localStorage.setItem('auth_user', JSON.stringify(user));
        
        // Set token in API service
        apiService.setAuthToken(token);
        
        dispatch({
          type: 'AUTH_SUCCESS',
          payload: { user, token },
        });
      } else {
        throw new Error(response?.message || 'Login failed');
      }
    } catch (error: any) {
      const errorMessage = error.message || 'Login failed. Please try again.';
      dispatch({ type: 'AUTH_FAILURE', payload: errorMessage });
      throw error;
    }
  };

  const register = async (data: {
    name: string;
    email: string;
    password: string;
    password_confirmation: string;
  }) => {
    dispatch({ type: 'AUTH_START' });

    try {
      const response = await apiService.register(data);
      
      if (response && response.success && response.data) {
        const { user, token } = response.data;
        
        // Store in localStorage
        localStorage.setItem('auth_token', token);
        localStorage.setItem('auth_user', JSON.stringify(user));
        
        // Set token in API service
        apiService.setAuthToken(token);
        
        dispatch({
          type: 'AUTH_SUCCESS',
          payload: { user, token },
        });
      } else {
        throw new Error(response?.message || 'Registration failed');
      }
    } catch (error: any) {
      const errorMessage = error.message || 'Registration failed. Please try again.';
      dispatch({ type: 'AUTH_FAILURE', payload: errorMessage });
      throw error;
    }
  };

  const logout = async () => {
    try {
      // Call logout API
      await apiService.logout();
    } catch (error) {
      console.error('Logout API error:', error);
      // Continue with logout even if API call fails
    }

    // Clear localStorage
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
    
    // Remove token from API service
    apiService.removeAuthToken();
    
    dispatch({ type: 'AUTH_LOGOUT' });
  };

  const updateProfile = async (data: Partial<User>) => {
    try {
      const response = await apiService.request('/auth/profile', {
        method: 'PUT',
        body: JSON.stringify(data),
      });
      
      if (response && response.success && response.data) {
        const updatedUser = response.data;
        
        // Update localStorage
        localStorage.setItem('auth_user', JSON.stringify(updatedUser));
        
        dispatch({
          type: 'AUTH_UPDATE_USER',
          payload: updatedUser,
        });
      } else {
        throw new Error(response?.message || 'Profile update failed');
      }
    } catch (error: any) {
      const errorMessage = error.message || 'Profile update failed. Please try again.';
      dispatch({ type: 'AUTH_FAILURE', payload: errorMessage });
      throw error;
    }
  };

  const clearError = () => {
    dispatch({ type: 'AUTH_CLEAR_ERROR' });
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        login,
        register,
        logout,
        updateProfile,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
