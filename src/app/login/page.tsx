'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import LoginModal from '@/components/LoginModal';

export default function LoginPage() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      // Redirect to home if already authenticated
      router.push('/');
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (isAuthenticated) {
    return null; // Will redirect
  }

  return (
    <div className="login-page">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-6 col-md-8">
            <div className="card shadow-lg border-0 mt-5">
              <div className="card-body p-5">
                <div className="text-center mb-4">
                  <h2 className="card-title" style={{ 
                    fontFamily: 'Poppins, sans-serif', 
                    fontWeight: '700',
                    color: '#000'
                  }}>
                    Welcome to XpertBid
                  </h2>
                  <p className="text-muted">
                    Sign in to your account or create a new one
                  </p>
                </div>

                <LoginModal
                  isOpen={true}
                  onClose={() => router.push('/')}
                  onLoginSuccess={() => router.push('/')}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
