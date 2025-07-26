// Test script to debug timeout issues
// Run this in your browser console

async function testTimeoutDebug() {
  console.log('🔍 Testing timeout issues...');
  
  const testUrl = 'https://www.youtube.com/watch?v=w_Mh5GudRHc';
  const startTime = Date.now();
  
  try {
    console.log('⏰ Starting download at:', new Date().toISOString());
    
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
    
    console.log('⏰ Download completed in:', duration, 'ms');
    console.log('Status:', response.status);
    console.log('Content-Type:', response.headers.get('content-type'));
    console.log('Content-Length:', response.headers.get('content-length'));
    
    if (response.ok) {
      const contentType = response.headers.get('content-type');
      
      if (contentType && contentType.includes('video/')) {
        console.log('✅ SUCCESS: Got video file!');
        const blob = await response.blob();
        console.log('✅ Blob size:', blob.size, 'bytes');
      } else {
        console.log('❌ Unexpected content type:', contentType);
        const text = await response.text();
        console.log('Response:', text.substring(0, 200));
      }
    } else {
      console.log('❌ Request failed');
      const text = await response.text();
      console.log('Error:', text);
    }
    
  } catch (error) {
    const endTime = Date.now();
    const duration = endTime - startTime;
    
    console.log('⏰ Error occurred after:', duration, 'ms');
    console.log('❌ Error:', error.message);
    console.log('❌ Error type:', error.name);
    
    if (error.message.includes('timeout') || error.message.includes('504')) {
      console.log('🎯 TIMEOUT DETECTED!');
      console.log('🎯 This confirms the frontend is timing out too early');
    }
  }
  
  console.log('\n📋 Timeout Analysis:');
  console.log('• If timeout occurs < 10 minutes → Frontend timeout issue');
  console.log('• If timeout occurs > 10 minutes → Backend timeout issue');
  console.log('• If no timeout → CORS or other issue');
}

testTimeoutDebug(); 