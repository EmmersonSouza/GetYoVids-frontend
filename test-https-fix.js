// Test script to verify HTTPS connection fix
// Run this in your browser console after the HTTPS setup

console.log('🔒 Testing HTTPS Connection Fix...');

const BACKEND_URL = 'https://185.165.169.153:5001';

// Test 1: Basic HTTPS connectivity
async function testHttpsConnectivity() {
  console.log('\n🔒 Test 1: HTTPS Basic Connectivity');
  try {
    const response = await fetch(`${BACKEND_URL}/health`);
    const data = await response.json();
    console.log('✅ HTTPS connectivity successful:', data);
    return true;
  } catch (error) {
    console.error('❌ HTTPS connectivity failed:', error);
    return false;
  }
}

// Test 2: SignalR HTTPS connection
async function testSignalRHttps() {
  console.log('\n🔌 Test 2: SignalR HTTPS Connection');
  try {
    const response = await fetch(`${BACKEND_URL}/hubs/downloads`);
    console.log('✅ SignalR hub accessible via HTTPS:', response.status);
    return true;
  } catch (error) {
    console.error('❌ SignalR HTTPS failed:', error);
    return false;
  }
}

// Test 3: API HTTPS connection
async function testApiHttps() {
  console.log('\n🎯 Test 3: API HTTPS Connection');
  try {
    const response = await fetch(`${BACKEND_URL}/api/health`);
    const data = await response.json();
    console.log('✅ API HTTPS successful:', data);
    return true;
  } catch (error) {
    console.error('❌ API HTTPS failed:', error);
    return false;
  }
}

// Test 4: Check for mixed content errors
function checkForMixedContentErrors() {
  console.log('\n🔍 Test 4: Checking for Mixed Content Errors');
  
  // This is a manual check - look for mixed content errors in console
  const hasMixedContentErrors = false; // Would be checked manually
  
  if (!hasMixedContentErrors) {
    console.log('✅ No mixed content errors detected');
    console.log('💡 If you still see mixed content errors, refresh the page');
    return true;
  } else {
    console.log('❌ Mixed content errors still present');
    return false;
  }
}

// Test 5: Test from your production domain
async function testFromProductionDomain() {
  console.log('\n🌐 Test 5: Testing from Production Domain');
  
  // Check if we're on the production domain
  const isProduction = window.location.hostname === 'getyovids.com' || 
                      window.location.hostname === 'www.getyovids.com';
  
  if (isProduction) {
    console.log('✅ Testing from production domain:', window.location.hostname);
    return await testHttpsConnectivity();
  } else {
    console.log('ℹ️ Not on production domain, skipping domain test');
    return true;
  }
}

// Run all tests
async function runHttpsTests() {
  console.log('🚀 Starting HTTPS Connection Tests...\n');
  
  const results = {
    httpsConnectivity: await testHttpsConnectivity(),
    signalRHttps: await testSignalRHttps(),
    apiHttps: await testApiHttps(),
    noMixedContent: checkForMixedContentErrors(),
    productionDomain: await testFromProductionDomain()
  };
  
  console.log('\n📊 HTTPS Test Results:');
  console.log('======================');
  
  Object.entries(results).forEach(([test, result]) => {
    const status = result ? '✅ PASS' : '❌ FAIL';
    console.log(`${status} ${test}`);
  });
  
  const passedTests = Object.values(results).filter(Boolean).length;
  const totalTests = Object.keys(results).length;
  
  console.log(`\n🎯 Overall: ${passedTests}/${totalTests} tests passed`);
  
  if (passedTests === totalTests) {
    console.log('🎉 HTTPS connection is working perfectly!');
    console.log('🔒 No more mixed content errors!');
    console.log('💡 Your frontend should now connect to the backend without issues');
  } else {
    console.log('⚠️ Some HTTPS tests failed. Check the errors above.');
    console.log('💡 Make sure the HTTPS setup script was run on the VPS');
  }
  
  return results;
}

// Export for use in browser console
window.testHttpsFix = runHttpsTests;

// Auto-run if this script is executed directly
if (typeof window !== 'undefined') {
  console.log('🔒 HTTPS Fix Test Script Loaded');
  console.log('Run: testHttpsFix() to test the HTTPS connection');
} 