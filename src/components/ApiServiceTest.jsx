'use client';

import React, { useEffect, useState } from 'react';
import { apiService } from '@/services/api';

const ApiServiceTest = () => {
  const [testResults, setTestResults] = useState({});

  useEffect(() => {
    const testApiService = () => {
      const results = {
        apiServiceExists: !!apiService,
        socialLoginExists: typeof apiService.socialLogin === 'function',
        allMethods: Object.keys(apiService),
        socialLoginType: typeof apiService.socialLogin
      };
      
      console.log('API Service Test Results:', results);
      setTestResults(results);
    };

    testApiService();
  }, []);

  const testSocialLogin = async () => {
    try {
      const testData = {
        id: 'test123',
        name: 'Test User',
        email: 'test@example.com',
        provider: 'google'
      };
      
      console.log('Testing socialLogin with data:', testData);
      const result = await apiService.socialLogin(testData);
      console.log('Social login result:', result);
      alert('Social login test successful! Check console for details.');
    } catch (error) {
      console.error('Social login test failed:', error);
      alert('Social login test failed: ' + error.message);
    }
  };

  return (
    <div style={{ padding: '20px', border: '1px solid #ccc', margin: '20px' }}>
      <h3>API Service Test</h3>
      
      <div style={{ marginBottom: '20px' }}>
        <h4>Test Results:</h4>
        <p><strong>API Service Exists:</strong> {testResults.apiServiceExists ? '✅ Yes' : '❌ No'}</p>
        <p><strong>Social Login Method Exists:</strong> {testResults.socialLoginExists ? '✅ Yes' : '❌ No'}</p>
        <p><strong>Social Login Type:</strong> {testResults.socialLoginType}</p>
        <p><strong>Total Methods:</strong> {testResults.allMethods?.length || 0}</p>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <h4>Available Methods:</h4>
        <div style={{ maxHeight: '200px', overflow: 'auto', border: '1px solid #eee', padding: '10px' }}>
          {testResults.allMethods?.map(method => (
            <div key={method} style={{ marginBottom: '5px' }}>
              <code>{method}</code> - <em>{typeof apiService[method]}</em>
            </div>
          ))}
        </div>
      </div>

      <button onClick={testSocialLogin} style={{ marginTop: '10px' }}>
        Test Social Login Function
      </button>

      <div style={{ marginTop: '20px' }}>
        <h4>Debug Info:</h4>
        <p>Check browser console for detailed logs</p>
        <p>If socialLogin is not a function, try:</p>
        <ul>
          <li>Hard refresh the page (Ctrl+F5)</li>
          <li>Clear browser cache</li>
          <li>Restart the development server</li>
        </ul>
      </div>
    </div>
  );
};

export default ApiServiceTest;
