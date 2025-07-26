// Test script to bypass normal API flow and test direct download
// Run this in your browser console

async function testDirectDownload() {
  console.log('🧪 Testing direct download bypass...');
  
  const testUrl = 'https://www.youtube.com/watch?v=w_Mh5GudRHc';
  
  try {
    // Test 1: Simple fetch without axios
    console.log('1️⃣ Testing with simple fetch...');
    
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
    
    console.log('Status:', response.status);
    console.log('Content-Type:', response.headers.get('content-type'));
    console.log('Content-Length:', response.headers.get('content-length'));
    
    if (response.ok) {
      const contentType = response.headers.get('content-type');
      
      if (contentType && contentType.includes('video/')) {
        console.log('✅ SUCCESS: Got video file!');
        const blob = await response.blob();
        console.log('✅ Blob size:', blob.size, 'bytes');
        
        // Create download link
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'test-video.mp4';
        a.click();
        window.URL.revokeObjectURL(url);
        
        console.log('✅ Download triggered!');
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
    console.log('❌ Error:', error.message);
  }
  
  // Test 2: Check if it's a CORS issue
  console.log('\n2️⃣ Testing CORS headers...');
  
  try {
    const preflightResponse = await fetch('https://hathormodel.com/api/download/youtube', {
      method: 'OPTIONS',
      headers: {
        'Origin': 'http://localhost:8080',
        'Access-Control-Request-Method': 'POST',
        'Access-Control-Request-Headers': 'Content-Type'
      }
    });
    
    console.log('Preflight status:', preflightResponse.status);
    console.log('Access-Control-Allow-Origin:', preflightResponse.headers.get('Access-Control-Allow-Origin'));
    console.log('Access-Control-Allow-Methods:', preflightResponse.headers.get('Access-Control-Allow-Methods'));
    console.log('Access-Control-Allow-Headers:', preflightResponse.headers.get('Access-Control-Allow-Headers'));
    
  } catch (error) {
    console.log('❌ Preflight error:', error.message);
  }
}

testDirectDownload(); 