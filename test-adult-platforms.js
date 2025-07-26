// Test script to verify adult content platforms work with unified approach
// Run this in your browser console

const TEST_PLATFORMS = {
  // Test URLs for different adult platforms (using real URLs for testing)
  pornhub: 'https://www.pornhub.com/view_video.php?viewkey=ph5f8b8b8b8b8b',
  xvideos: 'https://www.xvideos.com/video123456/test_video',
  xhamster: 'https://xhamster.com/videos/test-video-123456',
  youporn: 'https://www.youporn.com/watch/123456/test-video',
  spankbang: 'https://spankbang.com/12345/video/test_video',
  redgifs: 'https://redgifs.com/watch/test-video-123456'
};

async function testAdultPlatforms() {
  console.log('🔍 Testing adult content platforms with unified approach...');
  console.log('📍 Backend URL: https://hathormodel.com');
  
  const results = {
    success: [],
    error: [],
    notFound: []
  };
  
  for (const [platform, testUrl] of Object.entries(TEST_PLATFORMS)) {
    console.log(`\n=== TESTING ${platform.toUpperCase()} ===`);
    console.log(`URL: ${testUrl}`);
    
    try {
      const startTime = Date.now();
      
      const response = await fetch(`https://hathormodel.com/api/download/${platform}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          url: testUrl,
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
        console.log('❌ ROUTE NOT FOUND - Backend endpoint missing');
        results.notFound.push(platform);
      } else if (response.ok) {
        const contentType = response.headers.get('content-type');
        
        if (contentType && contentType.includes('video/')) {
          console.log('✅ SUCCESS: Got video file!');
          console.log('✅ File size:', response.headers.get('content-length'), 'bytes');
          results.success.push(platform);
        } else if (contentType && contentType.includes('application/json')) {
          const data = await response.json();
          console.log('❌ Got JSON response (error):', data);
          results.error.push({ platform, error: data });
        } else {
          console.log('❓ Unexpected content type:', contentType);
          const text = await response.text();
          console.log('Response preview:', text.substring(0, 200));
          results.error.push({ platform, error: 'Unexpected content type' });
        }
      } else {
        const errorText = await response.text();
        console.log('❌ Request failed:', errorText);
        results.error.push({ platform, error: errorText });
      }
    } catch (error) {
      console.log('❌ Network error:', error.message);
      results.error.push({ platform, error: error.message });
    }
  }
  
  console.log('\n📊 SUMMARY:');
  console.log('✅ Successful platforms:', results.success.length);
  results.success.forEach(platform => console.log(`  - ${platform}`));
  
  console.log('\n❌ Error platforms:', results.error.length);
  results.error.forEach(item => console.log(`  - ${item.platform}: ${item.error}`));
  
  console.log('\n❌ Not found platforms:', results.notFound.length);
  results.notFound.forEach(platform => console.log(`  - ${platform}`));
  
  console.log('\n🎯 ANALYSIS:');
  console.log('• All platforms now have specific endpoints (no more generic {platform})');
  console.log('• All should return file blobs (not JSON)');
  console.log('• All should work with the same timeout settings as YouTube');
  console.log('• Pornhub has special cookie handling for authentication');
  console.log('• If you see "ROUTE NOT FOUND", the backend needs to be redeployed');
}

testAdultPlatforms(); 