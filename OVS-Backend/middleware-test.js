// Middleware Test Script
const fetch = require('node-fetch');

// Replace with your server URL
const SERVER_URL = 'http://localhost:3000';

// Function to login and get token
async function loginAsAdmin() {
  try {
    const response = await fetch(`${SERVER_URL}/auth/signin`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'admin',  // Replace with actual admin email if different
        password: 'YourAdminPassword'  // Replace with actual admin password
      })
    });
    
    const data = await response.json();
    
    if (!data.token) {
      console.error('Login failed:', data);
      return null;
    }
    
    console.log('Login successful, token received');
    return data.token;
  } catch (error) {
    console.error('Error during login:', error);
    return null;
  }
}

// Function to test middleware routes
async function testMiddleware(token) {
  if (!token) {
    console.error('No token available, cannot test middleware');
    return;
  }

  try {
    // Test the test-middleware route
    console.log('\nTesting /test-middleware route:');
    const testResponse = await fetch(`${SERVER_URL}/info/test-middleware`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    const testData = await testResponse.json();
    console.log('Status:', testResponse.status);
    console.log('Response:', testData);
    
    // Test the admin route
    console.log('\nTesting /admin route:');
    const adminResponse = await fetch(`${SERVER_URL}/info/admin`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    const adminData = await adminResponse.json();
    console.log('Status:', adminResponse.status);
    console.log('Response:', adminData);
    
  } catch (error) {
    console.error('Error testing middleware:', error);
  }
}

// Test without token to check error handling
async function testWithoutToken() {
  try {
    console.log('\nTesting routes without token:');
    const response = await fetch(`${SERVER_URL}/info/test-middleware`);
    const data = await response.json();
    console.log('Status:', response.status);
    console.log('Response:', data);
  } catch (error) {
    console.error('Error testing without token:', error);
  }
}

// Run the tests
async function runTests() {
  // First test with invalid/no token
  await testWithoutToken();
  
  // Then test with valid token
  const token = await loginAsAdmin();
  await testMiddleware(token);
}

runTests(); 