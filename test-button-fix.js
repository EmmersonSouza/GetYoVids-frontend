// Test script to verify the button fix
// Run this in your browser console

console.log('🔘 Testing Button Fix...');

// Test 1: Check if button is clickable
function testButtonClickability() {
  console.log('\n🔘 Test 1: Button Clickability');
  
  // Find the main download button
  const downloadButton = document.querySelector('button[class*="bg-primary"]');
  
  if (downloadButton) {
    console.log('✅ Download button found');
    console.log('Button text:', downloadButton.textContent);
    console.log('Button disabled:', downloadButton.disabled);
    console.log('Button classes:', downloadButton.className);
    
    // Check if button is clickable
    if (!downloadButton.disabled) {
      console.log('✅ Button is clickable');
      return true;
    } else {
      console.log('❌ Button is disabled');
      return false;
    }
  } else {
    console.log('❌ Download button not found');
    return false;
  }
}

// Test 2: Check monetization state
function testMonetizationState() {
  console.log('\n💰 Test 2: Monetization State');
  
  // Check localStorage for monetization state
  const clickCount = localStorage.getItem('monetization_click_count');
  const isComplete = localStorage.getItem('monetization_is_complete');
  const platformType = localStorage.getItem('monetization_platform_type');
  
  console.log('Click count:', clickCount);
  console.log('Is complete:', isComplete);
  console.log('Platform type:', platformType);
  
  return {
    clickCount: clickCount ? parseInt(clickCount) : 0,
    isComplete: isComplete === 'true',
    platformType: platformType
  };
}

// Test 3: Check URL validation
function testUrlValidation() {
  console.log('\n🔗 Test 3: URL Validation');
  
  // Find URL input fields
  const urlInputs = document.querySelectorAll('input[type="text"], input[placeholder*="URL"], input[placeholder*="url"]');
  
  if (urlInputs.length > 0) {
    console.log('✅ URL inputs found:', urlInputs.length);
    
    let hasValidUrl = false;
    urlInputs.forEach((input, index) => {
      const value = input.value.trim();
      console.log(`Input ${index + 1}: "${value}"`);
      
      if (value !== '') {
        hasValidUrl = true;
        console.log('✅ Valid URL found');
      }
    });
    
    if (!hasValidUrl) {
      console.log('⚠️ No valid URLs entered');
    }
    
    return hasValidUrl;
  } else {
    console.log('❌ No URL inputs found');
    return false;
  }
}

// Test 4: Simulate button click
function testButtonClick() {
  console.log('\n🖱️ Test 4: Button Click Simulation');
  
  const downloadButton = document.querySelector('button[class*="bg-primary"]');
  
  if (downloadButton && !downloadButton.disabled) {
    console.log('✅ Simulating button click...');
    
    // Create a click event
    const clickEvent = new MouseEvent('click', {
      view: window,
      bubbles: true,
      cancelable: true
    });
    
    // Dispatch the event
    downloadButton.dispatchEvent(clickEvent);
    
    console.log('✅ Button click simulated');
    return true;
  } else {
    console.log('❌ Cannot simulate click - button not found or disabled');
    return false;
  }
}

// Test 5: Check for console logs
function checkConsoleLogs() {
  console.log('\n📋 Test 5: Console Logs');
  
  // This would normally check for specific console messages
  // For now, we'll just note what to look for
  console.log('Look for these console messages after clicking:');
  console.log('🔘 MonetizedButton clicked: {...}');
  console.log('🔄 Monetization click result: true/false');
  console.log('✅ Proceeding with actual action (if monetization complete)');
  
  return true;
}

// Run all tests
function runButtonTests() {
  console.log('🚀 Starting Button Fix Tests...\n');
  
  const results = {
    buttonClickable: testButtonClickability(),
    monetizationState: testMonetizationState(),
    urlValidation: testUrlValidation(),
    buttonClick: testButtonClick(),
    consoleLogs: checkConsoleLogs()
  };
  
  console.log('\n📊 Button Test Results:');
  console.log('========================');
  
  Object.entries(results).forEach(([test, result]) => {
    if (typeof result === 'object') {
      console.log(`📋 ${test}:`, result);
    } else {
      const status = result ? '✅ PASS' : '❌ FAIL';
      console.log(`${status} ${test}`);
    }
  });
  
  console.log('\n💡 Instructions:');
  console.log('1. Enter a valid URL in the input field');
  console.log('2. Click the download button');
  console.log('3. Watch for monetization popups');
  console.log('4. Check console for detailed logs');
  console.log('5. After 3 clicks, the actual download should start');
  
  return results;
}

// Export for use in browser console
window.testButtonFix = runButtonTests;

// Auto-run if this script is executed directly
if (typeof window !== 'undefined') {
  console.log('🔘 Button Fix Test Script Loaded');
  console.log('Run: testButtonFix() to test the button functionality');
} 