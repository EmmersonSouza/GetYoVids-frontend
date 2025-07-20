// Test script to check backend connectivity
// Run this in your browser console on getyovids.com

console.log('🔍 Testing Backend Connection...');
console.log('=====================================');

// Test 1: Check if we can reach the VPS
async function testVPSConnectivity() {
  console.log('\n🌐 Test 1: VPS Connectivity');
  
  try {
    // Test basic connectivity
    const response = await fetch('https://185.165.169.153:5001/health', {
      method: 'GET',
      mode: 'cors'
    });
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ HTTPS Backend is responding!');
      console.log('Response:', data);
      return true;
    } else {
      console.log('❌ HTTPS Backend responded with error:', response.status);
      return false;
    }
  } catch (error) {
    console.log('❌ HTTPS Backend connection failed:', error.message);
    
    // Try HTTP as fallback
    try {
      const httpResponse = await fetch('http://185.165.169.153:5000/health', {
        method: 'GET',
        mode: 'cors'
      });
      
      if (httpResponse.ok) {
        const data = await httpResponse.json();
        console.log('✅ HTTP Backend is responding!');
        console.log('Response:', data);
        return true;
      } else {
        console.log('❌ HTTP Backend responded with error:', httpResponse.status);
        return false;
      }
    } catch (httpError) {
      console.log('❌ HTTP Backend connection also failed:', httpError.message);
      return false;
    }
  }
}

// Test 2: Check SignalR connection
async function testSignalRConnection() {
  console.log('\n📡 Test 2: SignalR Connection');
  
  try {
    // Test SignalR negotiation
    const response = await fetch('https://185.165.169.153:5001/hubs/downloads/negotiate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      mode: 'cors'
    });
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ SignalR negotiation successful!');
      console.log('Connection ID:', data.connectionId);
      return true;
    } else {
      console.log('❌ SignalR negotiation failed:', response.status);
      return false;
    }
  } catch (error) {
    console.log('❌ SignalR connection failed:', error.message);
    return false;
  }
}

// Test 3: Check API endpoints
async function testAPIEndpoints() {
  console.log('\n🔌 Test 3: API Endpoints');
  
  const endpoints = [
    '/api/health',
    '/api/download/youtube',
    '/api/validate-url'
  ];
  
  let successCount = 0;
  
  for (const endpoint of endpoints) {
    try {
      const response = await fetch(`https://185.165.169.153:5001${endpoint}`, {
        method: 'GET',
        mode: 'cors'
      });
      
      if (response.ok) {
        console.log(`✅ ${endpoint} - OK`);
        successCount++;
      } else {
        console.log(`❌ ${endpoint} - Error ${response.status}`);
      }
    } catch (error) {
      console.log(`❌ ${endpoint} - Failed: ${error.message}`);
    }
  }
  
  console.log(`📊 API Endpoints: ${successCount}/${endpoints.length} working`);
  return successCount > 0;
}

// Test 4: Check CORS headers
async function testCORSSupport() {
  console.log('\n🌍 Test 4: CORS Support');
  
  try {
    const response = await fetch('https://185.165.169.153:5001/health', {
      method: 'OPTIONS',
      mode: 'cors'
    });
    
    const corsHeaders = {
      'Access-Control-Allow-Origin': response.headers.get('Access-Control-Allow-Origin'),
      'Access-Control-Allow-Methods': response.headers.get('Access-Control-Allow-Methods'),
      'Access-Control-Allow-Headers': response.headers.get('Access-Control-Allow-Headers')
    };
    
    console.log('CORS Headers:', corsHeaders);
    
    if (corsHeaders['Access-Control-Allow-Origin']) {
      console.log('✅ CORS is configured');
      return true;
    } else {
      console.log('❌ CORS headers missing');
      return false;
    }
  } catch (error) {
    console.log('❌ CORS test failed:', error.message);
    return false;
  }
}

// Test 5: Check frontend configuration
function testFrontendConfig() {
  console.log('\n⚙️ Test 5: Frontend Configuration');
  
  // Check if we're on the right domain
  const currentDomain = window.location.hostname;
  console.log('Current domain:', currentDomain);
  
  // Check if we're using HTTPS
  const isHTTPS = window.location.protocol === 'https:';
  console.log('Using HTTPS:', isHTTPS);
  
  // Check if we can access the API service
  if (typeof window !== 'undefined' && window.api) {
    console.log('✅ API service is available');
  } else {
    console.log('❌ API service not found');
  }
  
  // Check if we can access SignalR service
  if (typeof window !== 'undefined' && window.signalRService) {
    console.log('✅ SignalR service is available');
  } else {
    console.log('❌ SignalR service not found');
  }
  
  return true;
}

// Test 6: Check network connectivity
async function testNetworkConnectivity() {
  console.log('\n🌐 Test 6: Network Connectivity');
  
  // Test basic internet connectivity
  try {
    const response = await fetch('https://httpbin.org/get', {
      method: 'GET'
    });
    
    if (response.ok) {
      console.log('✅ Internet connectivity: OK');
    } else {
      console.log('❌ Internet connectivity: Failed');
    }
  } catch (error) {
    console.log('❌ Internet connectivity: Failed -', error.message);
  }
  
  // Test DNS resolution
  try {
    const start = performance.now();
    await fetch('https://185.165.169.153:5001/health', {
      method: 'GET',
      mode: 'cors'
    });
    const end = performance.now();
    console.log(`✅ VPS response time: ${Math.round(end - start)}ms`);
  } catch (error) {
    console.log('❌ VPS not reachable');
  }
  
  return true;
}

// Run all tests
async function runBackendTests() {
  console.log('🚀 Starting Backend Connection Tests...\n');
  
  const results = {
    vpsConnectivity: await testVPSConnectivity(),
    signalRConnection: await testSignalRConnection(),
    apiEndpoints: await testAPIEndpoints(),
    corsSupport: await testCORSSupport(),
    frontendConfig: testFrontendConfig(),
    networkConnectivity: await testNetworkConnectivity()
  };
  
  console.log('\n📊 Backend Test Results:');
  console.log('========================');
  
  Object.entries(results).forEach(([test, result]) => {
    const status = result ? '✅ PASS' : '❌ FAIL';
    console.log(`${status} ${test}`);
  });
  
  const passedTests = Object.values(results).filter(Boolean).length;
  const totalTests = Object.keys(results).length;
  
  console.log(`\n📈 Overall: ${passedTests}/${totalTests} tests passed`);
  
  if (passedTests === totalTests) {
    console.log('🎉 All tests passed! Backend connection is working.');
  } else {
    console.log('⚠️ Some tests failed. Backend needs attention.');
    console.log('\n🔧 Next Steps:');
    console.log('1. SSH into your VPS: ssh root@185.165.169.153');
    console.log('2. Run: cd GetYoVids-backend && chmod +x fix-backend-connection.sh');
    console.log('3. Run: ./fix-backend-connection.sh');
    console.log('4. Check logs for any errors');
  }
  
  return results;
}

// Export for use in browser console
window.testBackendConnection = runBackendTests;

// Auto-run if this script is executed directly
if (typeof window !== 'undefined') {
  console.log('🔍 Backend Connection Test Script Loaded');
  console.log('Run: testBackendConnection() to test the backend connectivity');
} 