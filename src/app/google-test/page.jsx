'use client';

import React from 'react';
import Layout from '@/components/Layout';
import GoogleSignInTest from '@/components/GoogleSignInTest';
import ApiServiceTest from '@/components/ApiServiceTest';

export default function GoogleTestPage() {
  return (
    <Layout>
      <div className="container py-5">
        <h1>Google Sign-In Test Page</h1>
        <p>This page helps debug Google Sign-In integration issues.</p>
        
        <ApiServiceTest />
        
        <GoogleSignInTest />
        
        <div className="mt-5">
          <h4>Instructions:</h4>
          <ol>
            <li>Check the status above to see if Google Sign-In is initialized</li>
            <li>Click "Test Google Sign-In" to trigger the sign-in flow</li>
            <li>Check browser console for any error messages</li>
            <li>Verify the Google Client ID is correct</li>
          </ol>
        </div>

        <div className="mt-4">
          <h4>Common Issues:</h4>
          <ul>
            <li><strong>Client ID not configured:</strong> Make sure the Google Client ID is correct</li>
            <li><strong>Domain not authorized:</strong> Add your domain to Google Console</li>
            <li><strong>Script loading failed:</strong> Check network connectivity</li>
            <li><strong>Callback not working:</strong> Check browser console for errors</li>
          </ul>
        </div>
      </div>
    </Layout>
  );
}
