// Test YouTube specifically to see what's happening
// Run this in your browser console

async function testYouTube() {
  console.log('🔍 Testing YouTube specifically...');
  console.log('📍 Backend URL: https://hathormodel.com');
  
  const testUrls = [
    'https://www.youtube.com/watch?v=dQw4w9WgXcQ', // Rick Roll
    'https://youtu.be/dQw4w9WgXcQ', // Short URL
    'https://youtube.com/shorts/8Pd7fj0N5os' // Shorts
  ];
  
  for (const testUrl of testUrls) {
    console.log(`\n=== TESTING YOUTUBE URL ===`);
    console.log(`URL: ${testUrl}`);
    
    try {
      const startTime = Date.now();
      
      const response = await fetch('https://hathormodel.com/api/download/youtube', {
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
        console.log('❌ YOUTUBE ENDPOINT NOT FOUND');
      } else if (response.ok) {
        const contentType = response.headers.get('content-type');
        
        if (contentType && contentType.includes('video/')) {
          console.log('✅ SUCCESS: Got YouTube video file!');
          console.log('✅ File size:', response.headers.get('content-length'), 'bytes');
        } else if (contentType && contentType.includes('application/json')) {
          const data = await response.json();
          console.log('❌ Got JSON response (error):', data);
        } else {
          console.log('❓ Unexpected content type:', contentType);
          const text = await response.text();
          console.log('Response preview:', text.substring(0, 200));
        }
      } else {
        const errorText = await response.text();
        console.log('❌ Request failed:', errorText);
      }
    } catch (error) {
      console.log('❌ Network error:', error.message);
    }
  }
  
  console.log('\n🎯 ANALYSIS:');
  console.log('• YouTube should have both specific endpoint and generic route support');
  console.log('• If 404: Backend endpoint missing');
  console.log('• If JSON error: Backend processing issue');
  console.log('• If video file: YouTube is working!');
}

testYouTube(); 