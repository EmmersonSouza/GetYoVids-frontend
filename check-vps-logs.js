// Script to help check VPS logs and backend behavior
// Run this in your browser console

async function checkVPSLogs() {
  console.log('🔍 Checking VPS backend behavior...');
  
  // Test a regular YouTube URL that's not working
  const testUrl = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ';
  
  console.log(`Testing URL: ${testUrl}`);
  
  try {
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
    
    console.log(`Status: ${response.status}`);
    console.log(`Content-Type: ${response.headers.get('content-type')}`);
    
    if (response.ok) {
      const contentType = response.headers.get('content-type');
      
      if (contentType && contentType.includes('application/json')) {
        const data = await response.json();
        console.log('❌ Got JSON response:', data);
        console.log('❌ This suggests yt-dlp failed or returned an error');
      } else if (contentType && contentType.includes('video/')) {
        console.log('✅ Got video file!');
        console.log('✅ Size:', response.headers.get('content-length'), 'bytes');
      } else {
        const text = await response.text();
        console.log('❓ Unexpected response:', text.substring(0, 200));
      }
    } else {
      const errorText = await response.text();
      console.log('❌ Request failed:', errorText);
    }
  } catch (error) {
    console.log('❌ Network error:', error.message);
  }
  
  console.log('\n📋 Next steps:');
  console.log('1. Check VPS logs: sudo journalctl -u characterforge-imagix -f');
  console.log('2. Look for yt-dlp errors or download failures');
  console.log('3. Check if yt-dlp is working: yt-dlp --version');
  console.log('4. Test yt-dlp manually: yt-dlp "https://www.youtube.com/watch?v=dQw4w9WgXcQ"');
}

checkVPSLogs(); 