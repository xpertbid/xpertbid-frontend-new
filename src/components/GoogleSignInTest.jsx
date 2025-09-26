'use client';

import React, { useEffect, useState } from 'react';
import { socialAuthService } from '@/services/socialAuth';

const GoogleSignInTest = () => {
  const [status, setStatus] = useState('Not initialized');
  const [error, setError] = useState('');

  useEffect(() => {
    const testGoogleSignIn = async () => {
      try {
        setStatus('Initializing Google Sign-In...');
        const initialized = await socialAuthService.initializeGoogle();
        
        if (initialized) {
          setStatus('Google Sign-In initialized successfully');
          setError('');
        } else {
          setStatus('Failed to initialize Google Sign-In');
          setError('Initialization failed');
        }
      } catch (err) {
        setStatus('Error during initialization');
        setError(err.message);
      }
    };

    testGoogleSignIn();
  }, []);

  const handleTestSignIn = async () => {
    try {
      setStatus('Testing Google Sign-In...');
      setError('');
      
      socialAuthService.triggerGoogleLogin();
    } catch (err) {
      setError(err.message);
      setStatus('Test failed');
    }
  };

  return (
    <div style={{ padding: '20px', border: '1px solid #ccc', margin: '20px' }}>
      <h3>Google Sign-In Test</h3>
      <p><strong>Status:</strong> {status}</p>
      {error && <p><strong>Error:</strong> {error}</p>}
      <button onClick={handleTestSignIn} style={{ marginTop: '10px' }}>
        Test Google Sign-In
      </button>
      <div style={{ marginTop: '20px' }}>
        <h4>Debug Info:</h4>
        <p>Google SDK Available: {typeof window !== 'undefined' && window.google ? 'Yes' : 'No'}</p>
        <p>Google Accounts ID Available: {typeof window !== 'undefined' && window.google?.accounts?.id ? 'Yes' : 'No'}</p>
        <p>Client ID: {socialAuthService.googleClientId}</p>
      </div>
    </div>
  );
};

export default GoogleSignInTest;
