// Test script to check hathormodel.com connection
// Run this in your browser console to test the connection

const TEST_URL = 'https://hathormodel.com';

async function testHathormodelConnection() {
  console.log('🔍 Testing hathormodel.com connection...');
  
  // Test 1: Basic health check
  try {
    console.log('1️⃣ Testing health endpoint...');
    const healthResponse = await fetch(`${TEST_URL}/health`, {
      method: 'GET',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    if (healthResponse.ok) {
      const healthData = await healthResponse.json();
      console.log('✅ Health check successful:', healthData);
    } else {
      console.log('❌ Health check failed:', healthResponse.status, healthResponse.statusText);
    }
  } catch (error) {
    console.log('❌ Health check error:', error.message);
  }
  
  // Test 2: CORS preflight test
  try {
    console.log('2️⃣ Testing CORS preflight...');
    const corsResponse = await fetch(`${TEST_URL}/health`, {
      method: 'OPTIONS',
      mode: 'cors',
      headers: {
        'Origin': 'http://localhost:8080',
        'Access-Control-Request-Method': 'POST',
        'Access-Control-Request-Headers': 'Content-Type'
      }
    });
    
    console.log('CORS Response status:', corsResponse.status);
    console.log('CORS Headers:', {
      'Access-Control-Allow-Origin': corsResponse.headers.get('Access-Control-Allow-Origin'),
      'Access-Control-Allow-Methods': corsResponse.headers.get('Access-Control-Allow-Methods'),
      'Access-Control-Allow-Headers': corsResponse.headers.get('Access-Control-Allow-Headers')
    });
  } catch (error) {
    console.log('❌ CORS test error:', error.message);
  }
  
  // Test 3: YouTube download endpoint test
  try {
    console.log('3️⃣ Testing YouTube download endpoint...');
    const downloadResponse = await fetch(`${TEST_URL}/api/download/youtube`, {
      method: 'POST',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        format: 'mp4',
        quality: 'best',
        directDownload: true
      })
    });
    
    console.log('Download Response status:', downloadResponse.status);
    console.log('Download Response headers:', {
      'Content-Type': downloadResponse.headers.get('Content-Type'),
      'Content-Length': downloadResponse.headers.get('Content-Length')
    });
    
    if (downloadResponse.ok) {
      const contentType = downloadResponse.headers.get('Content-Type');
      if (contentType && contentType.includes('video/')) {
        console.log('✅ Download endpoint working - returning video file');
      } else {
        const text = await downloadResponse.text();
        console.log('📄 Response body:', text.substring(0, 200) + '...');
      }
    } else {
      console.log('❌ Download endpoint failed:', downloadResponse.status, downloadResponse.statusText);
    }
  } catch (error) {
    console.log('❌ Download test error:', error.message);
  }
  
  // Test 4: Network connectivity test
  try {
    console.log('4️⃣ Testing basic connectivity...');
    const startTime = Date.now();
    const pingResponse = await fetch(`${TEST_URL}/health`, {
      method: 'GET',
      mode: 'no-cors' // This bypasses CORS for basic connectivity test
    });
    const endTime = Date.now();
    console.log(`✅ Basic connectivity: ${endTime - startTime}ms`);
  } catch (error) {
    console.log('❌ Basic connectivity failed:', error.message);
  }
}

// Run the test
testHathormodelConnection(); 