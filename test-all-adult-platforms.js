// Test all adult content platforms with the unified approach
// Run this in your browser console

const ADULT_PLATFORMS = {
  'pornhub-downloader': {
    platform: 'pornhub',
    testUrl: 'https://www.pornhub.com/view_video.php?viewkey=ph5f8b8b8b8b8b'
  },
  'xvideos-downloader': {
    platform: 'xvideos', 
    testUrl: 'https://www.xvideos.com/video123456/test_video'
  },
  'xhamster-downloader': {
    platform: 'xhamster',
    testUrl: 'https://xhamster.com/videos/test-video-123456'
  },
  'youporn-downloader': {
    platform: 'youporn',
    testUrl: 'https://www.youporn.com/watch/123456/test-video'
  },
  'spankbang-downloader': {
    platform: 'spankbang',
    testUrl: 'https://spankbang.com/12345/video/test_video'
  },
  'redgifs-downloader': {
    platform: 'redgifs',
    testUrl: 'https://redgifs.com/watch/test-video-123456'
  }
};

async function testAllAdultPlatforms() {
  console.log('🔍 Testing all adult content platforms with unified approach...');
  console.log('📍 Backend URL: https://hathormodel.com');
  
  const results = {
    success: [],
    error: [],
    notFound: [],
    jsonError: []
  };
  
  for (const [frontendRoute, config] of Object.entries(ADULT_PLATFORMS)) {
    console.log(`\n=== TESTING ${frontendRoute.toUpperCase()} ===`);
    console.log(`Platform: ${config.platform}`);
    console.log(`URL: ${config.testUrl}`);
    
    try {
      const startTime = Date.now();
      
      const response = await fetch(`https://hathormodel.com/api/download/${config.platform}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          url: config.testUrl,
          format: 'mp4',
          quality: 'best',
          directDownload: true
        })
      });
      
      const endTime = Date.now();
      const duration = endTime - startTime;
      
      console.log(`⏱️ Response time: ${duration}ms`);
      console.log(`📊 Status: ${response.status}`);
      console.log(`📋 Content-Type: ${response.headers.get('content-type')}`);
      console.log(`📏 Content-Length: ${response.headers.get('content-length')}`);
      
      if (response.status === 404) {
        console.log('❌ ENDPOINT NOT FOUND');
        results.notFound.push(frontendRoute);
      } else if (response.ok) {
        const contentType = response.headers.get('content-type');
        
        if (contentType && contentType.includes('video/')) {
          console.log('✅ SUCCESS: Got video file!');
          console.log('✅ File size:', response.headers.get('content-length'), 'bytes');
          results.success.push(frontendRoute);
        } else if (contentType && contentType.includes('application/json')) {
          const data = await response.json();
          console.log('❌ Got JSON response (error):', data);
          results.jsonError.push({ route: frontendRoute, error: data });
        } else {
          console.log('❓ Unexpected content type:', contentType);
          const text = await response.text();
          console.log('Response preview:', text.substring(0, 200));
          results.error.push({ route: frontendRoute, error: 'Unexpected content type' });
        }
      } else {
        const errorText = await response.text();
        console.log('❌ Request failed:', errorText);
        results.error.push({ route: frontendRoute, error: errorText });
      }
    } catch (error) {
      console.log('❌ Network error:', error.message);
      results.error.push({ route: frontendRoute, error: error.message });
    }
  }
  
  console.log('\n📊 SUMMARY:');
  console.log('✅ Successful platforms:', results.success.length);
  results.success.forEach(route => console.log(`  - ${route}`));
  
  console.log('\n❌ JSON error platforms:', results.jsonError.length);
  results.jsonError.forEach(item => console.log(`  - ${item.route}: ${JSON.stringify(item.error)}`));
  
  console.log('\n❌ Other error platforms:', results.error.length);
  results.error.forEach(item => console.log(`  - ${item.route}: ${item.error}`));
  
  console.log('\n❌ Not found platforms:', results.notFound.length);
  results.notFound.forEach(route => console.log(`  - ${route}`));
  
  console.log('\n🎯 ANALYSIS:');
  console.log('• All platforms should use the unified /api/download/{platform} endpoint');
  console.log('• All should return file blobs (not JSON) when working correctly');
  console.log('• JSON errors are expected for fake URLs (backend working correctly)');
  console.log('• 404 errors mean the backend endpoint is missing');
  
  console.log('\n💡 EXPECTED RESULTS:');
  console.log('• JSON errors with "No video found" = ✅ Backend working correctly');
  console.log('• 404 errors = ❌ Backend endpoint missing');
  console.log('• Video files = ✅ Platform working perfectly');
}

testAllAdultPlatforms(); 