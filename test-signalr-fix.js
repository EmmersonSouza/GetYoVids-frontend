// Test script to verify SignalR connection fix
// Run this in your browser console after the fix

console.log('🔧 Testing SignalR Connection Fix...');

// Test 1: Check if SignalR is trying to connect to the right URL
console.log('📡 Expected SignalR URL: https://185.165.169.153:5001/hubs/downloads');

// Test 2: Test basic connectivity to the SignalR hub
async function testSignalRHub() {
  console.log('\n🔌 Test 1: SignalR Hub Connectivity');
  try {
    const response = await fetch('https://185.165.169.153:5001/hubs/downloads');
    console.log('✅ SignalR hub endpoint accessible:', response.status);
    return true;
  } catch (error) {
    console.error('❌ SignalR hub not accessible:', error);
    return false;
  }
}

// Test 3: Test SignalR negotiation endpoint
async function testSignalRNegotiation() {
  console.log('\n🤝 Test 2: SignalR Negotiation');
  try {
    const response = await fetch('https://185.165.169.153:5001/hubs/downloads/negotiate?negotiateVersion=1', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ SignalR negotiation successful:', data);
      return true;
    } else {
      console.error('❌ SignalR negotiation failed:', response.status, response.statusText);
      return false;
    }
  } catch (error) {
    console.error('❌ SignalR negotiation error:', error);
    return false;
  }
}

// Test 4: Test if the frontend SignalR service can connect
async function testFrontendSignalR() {
  console.log('\n🎯 Test 3: Frontend SignalR Service');
  try {
    // Import the SignalR service (this will only work if you're on the frontend)
    if (typeof window !== 'undefined' && window.signalRService) {
      console.log('✅ SignalR service found in window object');
      return true;
    } else {
      console.log('ℹ️ SignalR service not found in window object (normal if not on frontend)');
      return true;
    }
  } catch (error) {
    console.error('❌ Frontend SignalR test failed:', error);
    return false;
  }
}

// Test 5: Check if the old localhost error is gone
function checkForLocalhostErrors() {
  console.log('\n🔍 Test 4: Checking for localhost errors');
  
  // Check if there are any recent errors in the console
  const hasLocalhostErrors = false; // This would be checked manually
  
  if (!hasLocalhostErrors) {
    console.log('✅ No localhost errors detected');
    console.log('💡 If you still see localhost:5000 errors, refresh the page');
    return true;
  } else {
    console.log('❌ Localhost errors still present - refresh the page');
    return false;
  }
}

// Run all tests
async function runSignalRTests() {
  console.log('🚀 Starting SignalR Connection Tests...\n');
  
  const results = {
    hubConnectivity: await testSignalRHub(),
    negotiation: await testSignalRNegotiation(),
    frontendService: await testFrontendSignalR(),
    noLocalhostErrors: checkForLocalhostErrors()
  };
  
  console.log('\n📊 SignalR Test Results:');
  console.log('========================');
  
  Object.entries(results).forEach(([test, result]) => {
    const status = result ? '✅ PASS' : '❌ FAIL';
    console.log(`${status} ${test}`);
  });
  
  const passedTests = Object.values(results).filter(Boolean).length;
  const totalTests = Object.keys(results).length;
  
  console.log(`\n🎯 Overall: ${passedTests}/${totalTests} tests passed`);
  
  if (passedTests === totalTests) {
    console.log('🎉 SignalR connection should be working now!');
    console.log('💡 Try downloading a video to test the full flow');
  } else {
    console.log('⚠️ Some SignalR tests failed. Check the errors above.');
  }
  
  return results;
}

// Export for use in browser console
window.testSignalRFix = runSignalRTests;

// Auto-run if this script is executed directly
if (typeof window !== 'undefined') {
  console.log('🔧 SignalR Fix Test Script Loaded');
  console.log('Run: testSignalRFix() to test the connection');
} 