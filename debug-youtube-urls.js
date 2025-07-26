// Detailed debug script to test different YouTube URL patterns
// Run this in your browser console to see what's happening

const TEST_URLS = {
  // These should all work with the new unified approach
  shorts: 'https://youtube.com/shorts/dQw4w9WgXcQ',
  regular: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
  withPlaylist: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ&list=PLbpi6ZahtOH6Blw3RGYpWkSByi_T7Rygb',
  youtu_be: 'https://youtu.be/dQw4w9WgXcQ',
  youtu_be_with_playlist: 'https://youtu.be/dQw4w9WgXcQ?list=PLbpi6ZahtOH6Blw3RGYpWkSByi_T7Rygb'
};

async function debugYouTubeURLs() {
  console.log('🔍 Testing different YouTube URL patterns...');
  console.log('🔍 This will help identify which URL patterns work and which don\'t');
  
  for (const [name, url] of Object.entries(TEST_URLS)) {
    console.log(`\n=== TESTING ${name.toUpperCase()} ===`);
    console.log(`URL: ${url}`);
    
    try {
      const startTime = Date.now();
      
      const response = await fetch('https://hathormodel.com/api/download/youtube', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          url: url,
          format: 'mp4',
          quality: 'best',
          directDownload: true
        })
      });
      
      const endTime = Date.now();
      const duration = endTime - startTime;
      
      console.log(`⏱️ Response time: ${duration}ms`);
      console.log(`📊 Status: ${response.status} ${response.statusText}`);
      console.log(`📋 Content-Type: ${response.headers.get('content-type')}`);
      console.log(`📏 Content-Length: ${response.headers.get('content-length')}`);
      
      if (response.ok) {
        const contentType = response.headers.get('content-type');
        
        if (contentType && contentType.includes('application/json')) {
          const data = await response.json();
          console.log('❌ GOT JSON RESPONSE:', data);
          console.log('❌ This means the backend is still using old logic or yt-dlp failed');
        } else if (contentType && contentType.includes('video/')) {
          console.log('✅ GOT VIDEO FILE!');
          console.log('✅ File size:', response.headers.get('content-length'), 'bytes');
          console.log('✅ MIME type:', contentType);
        } else {
          console.log('❓ UNEXPECTED CONTENT TYPE:', contentType);
          const text = await response.text();
          console.log('📄 Response preview:', text.substring(0, 300));
        }
      } else {
        const errorText = await response.text();
        console.log('❌ REQUEST FAILED:', errorText);
      }
    } catch (error) {
      console.log('❌ NETWORK ERROR:', error.message);
    }
  }
  
  console.log('\n🎯 ANALYSIS:');
  console.log('• If only Shorts work → yt-dlp might have issues with regular YouTube URLs');
  console.log('• If all return JSON → Backend still has old logic');
  console.log('• If all return files → Everything works!');
  console.log('• If some work, some don\'t → URL pattern issue');
}

debugYouTubeURLs(); 