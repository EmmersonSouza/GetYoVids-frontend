#!/usr/bin/env node

/**
 * Test script to verify backend connection
 * Run this from the frontend directory to test API connectivity
 */

const https = require('https');
const http = require('http');

const BACKEND_URL = 'http://185.165.169.153:5000';
const API_ENDPOINTS = [
  '/health',
  '/api/health'
];

console.log('🔍 Testing backend connection...\n');

async function testEndpoint(url) {
  return new Promise((resolve) => {
    const protocol = url.startsWith('https') ? https : http;
    
    const req = protocol.get(url, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        resolve({
          url,
          status: res.statusCode,
          headers: res.headers,
          data: data
        });
      });
    });
    
    req.on('error', (error) => {
      resolve({
        url,
        error: error.message,
        status: 'ERROR'
      });
    });
    
    req.setTimeout(5000, () => {
      req.destroy();
      resolve({
        url,
        error: 'Timeout after 5 seconds',
        status: 'TIMEOUT'
      });
    });
  });
}

async function runTests() {
  console.log(`📍 Backend URL: ${BACKEND_URL}\n`);
  
  for (const endpoint of API_ENDPOINTS) {
    const fullUrl = `${BACKEND_URL}${endpoint}`;
    console.log(`🔗 Testing: ${fullUrl}`);
    
    const result = await testEndpoint(fullUrl);
    
    if (result.error) {
      console.log(`❌ Error: ${result.error}\n`);
    } else {
      console.log(`✅ Status: ${result.status}`);
      console.log(`📄 Response: ${result.data.substring(0, 200)}${result.data.length > 200 ? '...' : ''}\n`);
    }
  }
  
  console.log('🎯 Frontend Configuration Check:');
  console.log('   API URL (both dev and prod): http://185.165.169.153:5000/api');
  
  console.log('\n📋 Next Steps:');
  console.log('   1. If tests pass, your backend is accessible');
  console.log('   2. Deploy your frontend to Cloudflare Pages');
  console.log('   3. Test the connection from your deployed frontend');
  console.log('   4. If you get CORS errors, check the backend CORS configuration');
}

runTests().catch(console.error); 