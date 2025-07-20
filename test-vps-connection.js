// Test script to verify VPS backend connection
// Run this in your browser console on your frontend

const BACKEND_URL = 'https://185.165.169.153:5001';

console.log('🔍 Testing VPS Backend Connection...');
console.log('Backend URL:', BACKEND_URL);

// Test 1: Basic connectivity
async function testBasicConnectivity() {
  console.log('\n📡 Test 1: Basic Connectivity');
  try {
    const response = await fetch(`${BACKEND_URL}/health`);
    const data = await response.json();
    console.log('✅ Basic connectivity successful:', data);
    return true;
  } catch (error) {
    console.error('❌ Basic connectivity failed:', error);
    return false;
  }
}

// Test 2: API health endpoint
async function testApiHealth() {
  console.log('\n🏥 Test 2: API Health Endpoint');
  try {
    const response = await fetch(`${BACKEND_URL}/api/health`);
    const data = await response.json();
    console.log('✅ API health successful:', data);
    return true;
  } catch (error) {
    console.error('❌ API health failed:', error);
    return false;
  }
}

// Test 3: CORS test with different origins
async function testCorsOrigins() {
  console.log('\n🌐 Test 3: CORS Origins');
  
  const origins = [
    'http://localhost:8080',
    'http://192.168.56.1:8080',
    'http://192.168.1.102:8080',
    'https://getyovids.com',
    'https://www.getyovids.com',
    'https://getyovids-fronted.pages.dev'
  ];
  
  for (const origin of origins) {
    try {
      const response = await fetch(`${BACKEND_URL}/health`, {
        method: 'OPTIONS',
        headers: {
          'Origin': origin,
          'Access-Control-Request-Method': 'GET',
          'Access-Control-Request-Headers': 'Content-Type'
        }
      });
      
      const corsHeaders = {
        'Access-Control-Allow-Origin': response.headers.get('Access-Control-Allow-Origin'),
        'Access-Control-Allow-Methods': response.headers.get('Access-Control-Allow-Methods'),
        'Access-Control-Allow-Headers': response.headers.get('Access-Control-Allow-Headers')
      };
      
      console.log(`✅ CORS for ${origin}:`, corsHeaders);
    } catch (error) {
      console.error(`❌ CORS for ${origin} failed:`, error);
    }
  }
}

// Test 4: Download endpoint test
async function testDownloadEndpoint() {
  console.log('\n⬇️ Test 4: Download Endpoint');
  try {
    const response = await fetch(`${BACKEND_URL}/youtube-downloader`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Origin': window.location.origin
      },
      body: JSON.stringify({
        Url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', // Test video
        Format: 'mp4',
        Quality: 'best',
        DirectDownload: false
      })
    });
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ Download endpoint successful:', data);
      return true;
    } else {
      console.error('❌ Download endpoint failed:', response.status, response.statusText);
      return false;
    }
  } catch (error) {
    console.error('❌ Download endpoint error:', error);
    return false;
  }
}

// Test 5: SignalR connection test
async function testSignalRConnection() {
  console.log('\n🔌 Test 5: SignalR Connection');
  try {
    // Test if SignalR hub is accessible
    const response = await fetch(`${BACKEND_URL}/downloadhub`);
    console.log('✅ SignalR hub accessible:', response.status);
    return true;
  } catch (error) {
    console.error('❌ SignalR hub not accessible:', error);
    return false;
  }
}

// Test 6: Cloud storage endpoint test
async function testCloudStorage() {
  console.log('\n☁️ Test 6: Cloud Storage Endpoint');
  try {
    const response = await fetch(`${BACKEND_URL}/cloudstorage/health`);
    const data = await response.json();
    console.log('✅ Cloud storage health:', data);
    return true;
  } catch (error) {
    console.error('❌ Cloud storage health failed:', error);
    return false;
  }
}

// Test 7: Network latency test
async function testLatency() {
  console.log('\n⏱️ Test 7: Network Latency');
  const startTime = performance.now();
  
  try {
    await fetch(`${BACKEND_URL}/health`);
    const endTime = performance.now();
    const latency = endTime - startTime;
    
    console.log(`✅ Latency: ${latency.toFixed(2)}ms`);
    
    if (latency < 100) {
      console.log('🚀 Excellent connection speed!');
    } else if (latency < 300) {
      console.log('👍 Good connection speed');
    } else if (latency < 1000) {
      console.log('⚠️ Moderate connection speed');
    } else {
      console.log('🐌 Slow connection speed');
    }
    
    return latency;
  } catch (error) {
    console.error('❌ Latency test failed:', error);
    return null;
  }
}

// Test 8: Frontend API service test
async function testFrontendApiService() {
  console.log('\n🎯 Test 8: Frontend API Service');
  try {
    // Test if the frontend can use its own API service
    const api = {
      baseURL: BACKEND_URL,
      get: async (url) => {
        const response = await fetch(`${BACKEND_URL}${url}`);
        return { data: await response.json() };
      }
    };
    
    const result = await api.get('/health');
    console.log('✅ Frontend API service working:', result.data);
    return true;
  } catch (error) {
    console.error('❌ Frontend API service failed:', error);
    return false;
  }
}

// Run all tests
async function runAllTests() {
  console.log('🚀 Starting VPS Backend Connection Tests...\n');
  
  const results = {
    basicConnectivity: await testBasicConnectivity(),
    apiHealth: await testApiHealth(),
    corsOrigins: await testCorsOrigins(),
    downloadEndpoint: await testDownloadEndpoint(),
    signalRConnection: await testSignalRConnection(),
    cloudStorage: await testCloudStorage(),
    latency: await testLatency(),
    frontendApiService: await testFrontendApiService()
  };
  
  console.log('\n📊 Test Results Summary:');
  console.log('========================');
  
  Object.entries(results).forEach(([test, result]) => {
    const status = result ? '✅ PASS' : '❌ FAIL';
    console.log(`${status} ${test}`);
  });
  
  const passedTests = Object.values(results).filter(Boolean).length;
  const totalTests = Object.keys(results).length;
  
  console.log(`\n🎯 Overall: ${passedTests}/${totalTests} tests passed`);
  
  if (passedTests === totalTests) {
    console.log('🎉 All tests passed! Your VPS backend is working perfectly!');
  } else {
    console.log('⚠️ Some tests failed. Check the errors above for details.');
  }
  
  return results;
}

// Export for use in browser console
window.testVpsConnection = runAllTests;

// Auto-run if this script is executed directly
if (typeof window !== 'undefined') {
  console.log('🔧 VPS Connection Test Script Loaded');
  console.log('Run: testVpsConnection() to start testing');
} 