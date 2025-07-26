// Test script to check backend route availability
// Run this in your browser console

const TEST_ROUTES = [
  // Specific platform routes (should exist)
  '/api/download/youtube',
  '/api/download/tiktok',
  '/api/download/twitter',
  '/api/download/vimeo',
  '/api/download/facebook',
  '/api/download/twitch',
  '/api/download/reddit',
  
  // Adult content routes (should use generic {platform} route)
  '/api/download/pornhub',
  '/api/download/xvideos',
  '/api/download/xhamster',
  '/api/download/redgifs',
  '/api/download/youporn',
  '/api/download/spankbang',
  
  // Other routes
  '/api/download/standard',
  '/api/download/playlist',
  '/api/download/batch',
  '/api/download/formats',
  '/api/download/test'
];

async function testBackendRoutes() {
  console.log('🔍 Testing backend route availability...');
  console.log('📍 Base URL: https://hathormodel.com');
  
  const results = {
    available: [],
    notFound: [],
    errors: []
  };
  
  for (const route of TEST_ROUTES) {
    console.log(`\n=== TESTING ${route} ===`);
    
    try {
      const startTime = Date.now();
      
      // Test with OPTIONS to check if route exists (without triggering download)
      const response = await fetch(`https://hathormodel.com${route}`, {
        method: 'OPTIONS',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      const endTime = Date.now();
      const duration = endTime - startTime;
      
      console.log(`⏱️ Response time: ${duration}ms`);
      console.log(`📊 Status: ${response.status}`);
      
      if (response.status === 200 || response.status === 405) {
        // 200 = OK, 405 = Method Not Allowed (route exists but doesn't support OPTIONS)
        console.log('✅ ROUTE EXISTS');
        results.available.push(route);
      } else if (response.status === 404) {
        console.log('❌ ROUTE NOT FOUND');
        results.notFound.push(route);
      } else {
        console.log('❓ UNEXPECTED STATUS');
        results.errors.push({ route, status: response.status });
      }
      
    } catch (error) {
      console.log('❌ NETWORK ERROR:', error.message);
      results.errors.push({ route, error: error.message });
    }
  }
  
  console.log('\n📊 SUMMARY:');
  console.log('✅ Available routes:', results.available.length);
  results.available.forEach(route => console.log(`  - ${route}`));
  
  console.log('\n❌ Not found routes:', results.notFound.length);
  results.notFound.forEach(route => console.log(`  - ${route}`));
  
  console.log('\n❓ Error routes:', results.errors.length);
  results.errors.forEach(item => console.log(`  - ${item.route}: ${item.status || item.error}`));
  
  console.log('\n🎯 ANALYSIS:');
  console.log('• Specific platform routes should be available');
  console.log('• Adult content routes should use generic {platform} route');
  console.log('• If adult routes are 404, there might be a routing issue');
}

testBackendRoutes(); 