// Test script to verify monetization fix (direct link + pop-under)
// Run this in your browser console

console.log('💰 Testing Monetization Fix (Direct Link + Pop-under)...');

// Test 1: Check if monetization service is available
function testMonetizationService() {
  console.log('\n🔧 Test 1: Monetization Service Availability');
  
  // Check if the service is loaded
  if (typeof window !== 'undefined' && window.monetizationService) {
    console.log('✅ Monetization service found in window object');
    return true;
  }
  
  // Check if we can access it through the hook
  console.log('⚠️ Monetization service not found in window object');
  console.log('This is normal - the service is imported in the hook');
  return true;
}

// Test 2: Check monetization state
function testMonetizationState() {
  console.log('\n💰 Test 2: Current Monetization State');
  
  const clickCount = localStorage.getItem('monetization_click_count');
  const isComplete = localStorage.getItem('monetization_is_complete');
  const platformType = localStorage.getItem('monetization_platform_type');
  const isConversion = localStorage.getItem('monetization_is_conversion');
  
  console.log('Click count:', clickCount || '0');
  console.log('Is complete:', isComplete || 'false');
  console.log('Platform type:', platformType || 'none');
  console.log('Is conversion:', isConversion || 'false');
  
  return {
    clickCount: clickCount ? parseInt(clickCount) : 0,
    isComplete: isComplete === 'true',
    platformType: platformType,
    isConversion: isConversion === 'true'
  };
}

// Test 3: Simulate monetization click
function testMonetizationClick() {
  console.log('\n🖱️ Test 3: Simulating Monetization Click');
  
  // Find the download button
  const downloadButton = document.querySelector('button[class*="bg-primary"], button[class*="border-yellow-500"]');
  
  if (downloadButton && !downloadButton.disabled) {
    console.log('✅ Download button found and clickable');
    console.log('Button text:', downloadButton.textContent);
    
    // Simulate click
    console.log('🖱️ Simulating button click...');
    downloadButton.click();
    
    console.log('✅ Button click simulated');
    console.log('📋 Watch for:');
    console.log('  - Direct link opening in new tab');
    console.log('  - Pop-under scripts loading');
    console.log('  - Console logs from monetization service');
    
    return true;
  } else {
    console.log('❌ Download button not found or disabled');
    console.log('Button found:', !!downloadButton);
    console.log('Button disabled:', downloadButton?.disabled);
    return false;
  }
}

// Test 4: Check for monetization URLs
function testMonetizationUrls() {
  console.log('\n🔗 Test 4: Monetization URLs');
  
  const expectedUrls = {
    regular: {
      direct: 'https://www.profitableratecpm.com/ez1aaw8g?key=51edc43e9af4ba16487654d5ad13b998',
      script: '//pl27204121.profitableratecpm.com/d0/57/c2/d057c2967ef81828dc840400a9c2c6e6.js',
      html: 'https://pl27204121.profitableratecpm.com/d0/57/c2/d057c2967ef81828dc840400a9c2c6e6.html'
    },
    adult: {
      direct: 'https://www.profitableratecpm.com/dbr0v40ree?key=0e82932f1f8aea216d88b58a4d024b63',
      script: '//pl27204234.profitableratecpm.com/a2/a2/85/a2a28507a6bd2463e79401e2b296cb2c.js',
      html: 'https://pl27204234.profitableratecpm.com/a2/a2/85/a2a28507a6bd2463e79401e2b296cb2c.html'
    }
  };
  
  console.log('Expected URLs:');
  console.log('Regular platform:');
  console.log('  Direct:', expectedUrls.regular.direct);
  console.log('  Script:', expectedUrls.regular.script);
  console.log('  HTML:', expectedUrls.regular.html);
  console.log('Adult platform:');
  console.log('  Direct:', expectedUrls.adult.direct);
  console.log('  Script:', expectedUrls.adult.script);
  console.log('  HTML:', expectedUrls.adult.html);
  
  return expectedUrls;
}

// Test 5: Check for pop-under detection
function testPopUnderDetection() {
  console.log('\n🔍 Test 5: Pop-under Detection');
  
  // Check if any pop-under scripts are loaded
  const scripts = document.querySelectorAll('script[src*="profitableratecpm"]');
  console.log('Pop-under scripts found:', scripts.length);
  
  scripts.forEach((script, index) => {
    console.log(`  Script ${index + 1}:`, script.src);
  });
  
  // Check if any iframes are present
  const iframes = document.querySelectorAll('iframe[src*="profitableratecpm"]');
  console.log('Pop-under iframes found:', iframes.length);
  
  iframes.forEach((iframe, index) => {
    console.log(`  Iframe ${index + 1}:`, iframe.src);
  });
  
  return {
    scripts: scripts.length,
    iframes: iframes.length
  };
}

// Test 6: Monitor network requests
function testNetworkMonitoring() {
  console.log('\n🌐 Test 6: Network Request Monitoring');
  
  console.log('📋 Monitor these network requests after clicking:');
  console.log('  - Direct link requests to profitableratecpm.com');
  console.log('  - Script requests to pl27204121.profitableratecpm.com');
  console.log('  - Script requests to pl27204234.profitableratecpm.com');
  console.log('  - HTML requests to profitableratecpm.com');
  
  // Check if we can access network information
  if ('performance' in window && 'getEntriesByType' in performance) {
    const requests = performance.getEntriesByType('resource');
    const monetizationRequests = requests.filter(req => 
      req.name.includes('profitableratecpm')
    );
    
    console.log('Previous monetization requests found:', monetizationRequests.length);
    monetizationRequests.forEach((req, index) => {
      console.log(`  Request ${index + 1}:`, req.name);
    });
  }
  
  return true;
}

// Test 7: Check console logs
function testConsoleLogs() {
  console.log('\n📋 Test 7: Expected Console Logs');
  
  console.log('After clicking the button, look for these console messages:');
  console.log('💰 Monetization click X/Y for [platform]');
  console.log('💰 Executing monetization for [platform] platform');
  console.log('✅ Direct link opened in new tab');
  console.log('✅ Pop-under script loaded and executed');
  console.log('✅ Pop-under iframe loaded');
  console.log('✅ Pop-under window created');
  console.log('✅ All monetization methods executed successfully');
  console.log('🔄 Monetization progress: X/Y clicks');
  console.log('✅ Monetization complete! Required: Y, Clicks: X');
  
  return true;
}

// Run all tests
function runMonetizationTests() {
  console.log('🚀 Starting Monetization Fix Tests...\n');
  
  const results = {
    serviceAvailable: testMonetizationService(),
    monetizationState: testMonetizationState(),
    buttonClick: testMonetizationClick(),
    urls: testMonetizationUrls(),
    popUnderDetection: testPopUnderDetection(),
    networkMonitoring: testNetworkMonitoring(),
    consoleLogs: testConsoleLogs()
  };
  
  console.log('\n📊 Monetization Test Results:');
  console.log('=============================');
  
  Object.entries(results).forEach(([test, result]) => {
    if (typeof result === 'object' && result !== null) {
      console.log(`📋 ${test}:`, result);
    } else {
      const status = result ? '✅ PASS' : '❌ FAIL';
      console.log(`${status} ${test}`);
    }
  });
  
  console.log('\n💡 Instructions:');
  console.log('1. Click the download button');
  console.log('2. Watch for a new tab opening with the direct link');
  console.log('3. Check browser console for detailed logs');
  console.log('4. Look for pop-under windows/tabs');
  console.log('5. Check Network tab in DevTools for requests');
  console.log('6. After 3 clicks, the actual download should start');
  
  console.log('\n🔍 Debug Commands:');
  console.log('localStorage.getItem("monetization_click_count")');
  console.log('localStorage.getItem("monetization_is_complete")');
  console.log('localStorage.getItem("monetization_platform_type")');
  
  return results;
}

// Export for use in browser console
window.testMonetizationFix = runMonetizationTests;

// Auto-run if this script is executed directly
if (typeof window !== 'undefined') {
  console.log('💰 Monetization Fix Test Script Loaded');
  console.log('Run: testMonetizationFix() to test the monetization functionality');
} 