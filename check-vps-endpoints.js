// Check what endpoints are actually deployed on the VPS
// Run this in your browser console

async function checkVPSEndpoints() {
  console.log('🔍 Checking what endpoints are actually deployed on VPS...');
  console.log('📍 VPS URL: https://hathormodel.com');
  
  const endpoints = [
    // Adult platforms that should work
    '/api/download/pornhub',
    '/api/download/xvideos', 
    '/api/download/xhamster',
    '/api/download/youporn',
    '/api/download/spankbang',
    '/api/download/redgifs',
    
    // Standard platforms for comparison
    '/api/download/youtube',
    '/api/download/tiktok',
    '/api/download/twitter',
    
    // Generic route (should work for any platform)
    '/api/download/testplatform'
  ];
  
  const results = {
    working: [],
    notFound: [],
    errors: []
  };
  
  for (const endpoint of endpoints) {
    console.log(`\n=== TESTING ${endpoint} ===`);
    
    try {
      const response = await fetch(`https://hathormodel.com${endpoint}`, {
        method: 'OPTIONS', // Just check if route exists
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      console.log(`📊 Status: ${response.status}`);
      
      if (response.status === 200 || response.status === 405) {
        console.log('✅ ENDPOINT EXISTS');
        results.working.push(endpoint);
      } else if (response.status === 404) {
        console.log('❌ ENDPOINT NOT FOUND');
        results.notFound.push(endpoint);
      } else {
        console.log('❓ UNEXPECTED STATUS');
        results.errors.push({ endpoint, status: response.status });
      }
      
    } catch (error) {
      console.log('❌ NETWORK ERROR:', error.message);
      results.errors.push({ endpoint, error: error.message });
    }
  }
  
  console.log('\n📊 SUMMARY:');
  console.log('✅ Working endpoints:', results.working.length);
  results.working.forEach(endpoint => console.log(`  - ${endpoint}`));
  
  console.log('\n❌ Not found endpoints:', results.notFound.length);
  results.notFound.forEach(endpoint => console.log(`  - ${endpoint}`));
  
  console.log('\n❓ Error endpoints:', results.errors.length);
  results.errors.forEach(item => console.log(`  - ${item.endpoint}: ${item.status || item.error}`));
  
  console.log('\n🎯 ANALYSIS:');
  if (results.notFound.includes('/api/download/pornhub')) {
    console.log('❌ Pornhub endpoint is missing - backend needs new code deployment');
  }
  if (results.working.includes('/api/download/testplatform')) {
    console.log('✅ Generic {platform} route is working');
  }
  if (results.working.includes('/api/download/redgifs')) {
    console.log('✅ RedGifs endpoint is working (as expected)');
  }
  
  console.log('\n💡 RECOMMENDATION:');
  if (results.notFound.length > 0) {
    console.log('• Backend needs to be redeployed with the new adult platform endpoints');
    console.log('• Run: sudo systemctl stop characterforge-imagix');
    console.log('• Deploy new code');
    console.log('• Run: sudo systemctl start characterforge-imagix');
  } else {
    console.log('• All endpoints are working - the issue might be elsewhere');
  }
}

checkVPSEndpoints(); 