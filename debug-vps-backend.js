// Debug script to see what the VPS backend is actually doing
// Run this in your browser console

const TEST_URLS = {
  shorts: 'https://youtube.com/shorts/dQw4w9WgXcQ',
  regular: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
  withPlaylist: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ&list=PLbpi6ZahtOH6Blw3RGYpWkSByi_T7Rygb'
};

async function debugVPSBackend() {
  console.log('🔍 Debugging VPS backend behavior...');
  
  for (const [name, url] of Object.entries(TEST_URLS)) {
    console.log(`\n=== TESTING ${name.toUpperCase()} ===`);
    console.log(`URL: ${url}`);
    
    try {
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
      
      console.log(`Status: ${response.status}`);
      console.log(`Content-Type: ${response.headers.get('content-type')}`);
      
      if (response.ok) {
        const contentType = response.headers.get('content-type');
        
        if (contentType && contentType.includes('application/json')) {
          const data = await response.json();
          console.log('❌ BACKEND RETURNED JSON (OLD CODE):', data);
          console.log('❌ This means the VPS still has the old playlist logic!');
        } else if (contentType && contentType.includes('video/')) {
          console.log('✅ BACKEND RETURNED FILE BLOB (NEW CODE)');
          console.log('✅ File size:', response.headers.get('content-length'));
        } else {
          console.log('❓ Unexpected content type:', contentType);
          const text = await response.text();
          console.log('Response text:', text.substring(0, 200));
        }
      } else {
        const errorText = await response.text();
        console.log('❌ Request failed:', errorText);
      }
    } catch (error) {
      console.log('❌ Network error:', error.message);
    }
  }
  
  console.log('\n🎯 DIAGNOSIS:');
  console.log('If Shorts work but others return JSON → VPS has OLD backend code');
  console.log('If all return file blobs → VPS has NEW backend code');
  console.log('If all fail → Network/CORS issue');
}

debugVPSBackend(); 