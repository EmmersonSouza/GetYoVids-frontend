const https = require('https');
const http = require('http');

// Configuration
const BACKEND_IP = '185.165.169.153';
const HTTP_PORT = 5000;
const HTTPS_PORT = 5001;

console.log('🔍 Testing Backend Connectivity...\n');

// Test HTTP connectivity
function testHTTP() {
    return new Promise((resolve) => {
        console.log('🌐 Testing HTTP (Port 5000)...');
        
        const req = http.get(`http://${BACKEND_IP}:${HTTP_PORT}/health`, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                console.log(`✅ HTTP Status: ${res.statusCode}`);
                console.log(`📄 Response: ${data.substring(0, 100)}...`);
                resolve(true);
            });
        });
        
        req.on('error', (err) => {
            console.log(`❌ HTTP Error: ${err.message}`);
            resolve(false);
        });
        
        req.setTimeout(5000, () => {
            console.log('❌ HTTP Timeout');
            req.destroy();
            resolve(false);
        });
    });
}

// Test HTTPS connectivity
function testHTTPS() {
    return new Promise((resolve) => {
        console.log('\n🔒 Testing HTTPS (Port 5001)...');
        
        const options = {
            hostname: BACKEND_IP,
            port: HTTPS_PORT,
            path: '/health',
            method: 'GET',
            rejectUnauthorized: false // Allow self-signed certificates
        };
        
        const req = https.request(options, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                console.log(`✅ HTTPS Status: ${res.statusCode}`);
                console.log(`📄 Response: ${data.substring(0, 100)}...`);
                resolve(true);
            });
        });
        
        req.on('error', (err) => {
            console.log(`❌ HTTPS Error: ${err.message}`);
            resolve(false);
        });
        
        req.setTimeout(5000, () => {
            console.log('❌ HTTPS Timeout');
            req.destroy();
            resolve(false);
        });
        
        req.end();
    });
}

// Test API endpoints
function testAPIEndpoints() {
    return new Promise((resolve) => {
        console.log('\n🔌 Testing API Endpoints...');
        
        const endpoints = [
            '/api/convert/health',
            '/api/download/health',
            '/swagger',
            '/'
        ];
        
        let successCount = 0;
        let totalTests = endpoints.length;
        
        endpoints.forEach((endpoint, index) => {
            const options = {
                hostname: BACKEND_IP,
                port: HTTPS_PORT,
                path: endpoint,
                method: 'GET',
                rejectUnauthorized: false
            };
            
            const req = https.request(options, (res) => {
                console.log(`✅ ${endpoint}: ${res.statusCode}`);
                successCount++;
                
                if (successCount === totalTests) {
                    resolve(successCount === totalTests);
                }
            });
            
            req.on('error', (err) => {
                console.log(`❌ ${endpoint}: ${err.message}`);
                if (successCount === totalTests) {
                    resolve(false);
                }
            });
            
            req.setTimeout(3000, () => {
                console.log(`❌ ${endpoint}: Timeout`);
                if (successCount === totalTests) {
                    resolve(false);
                }
            });
            
            req.end();
        });
    });
}

// Test SignalR negotiation
function testSignalR() {
    return new Promise((resolve) => {
        console.log('\n📡 Testing SignalR Negotiation...');
        
        const options = {
            hostname: BACKEND_IP,
            port: HTTPS_PORT,
            path: '/downloadHub/negotiate',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            rejectUnauthorized: false
        };
        
        const req = https.request(options, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                console.log(`✅ SignalR Status: ${res.statusCode}`);
                try {
                    const response = JSON.parse(data);
                    console.log(`📄 Connection ID: ${response.connectionId || 'N/A'}`);
                    resolve(true);
                } catch (e) {
                    console.log(`📄 Response: ${data.substring(0, 100)}...`);
                    resolve(res.statusCode === 200);
                }
            });
        });
        
        req.on('error', (err) => {
            console.log(`❌ SignalR Error: ${err.message}`);
            resolve(false);
        });
        
        req.setTimeout(5000, () => {
            console.log('❌ SignalR Timeout');
            req.destroy();
            resolve(false);
        });
        
        req.write(JSON.stringify({}));
        req.end();
    });
}

// Test CORS headers
function testCORS() {
    return new Promise((resolve) => {
        console.log('\n🌍 Testing CORS Headers...');
        
        const options = {
            hostname: BACKEND_IP,
            port: HTTPS_PORT,
            path: '/health',
            method: 'OPTIONS',
            headers: {
                'Origin': 'https://localhost:3000',
                'Access-Control-Request-Method': 'POST',
                'Access-Control-Request-Headers': 'Content-Type'
            },
            rejectUnauthorized: false
        };
        
        const req = https.request(options, (res) => {
            console.log(`✅ CORS Status: ${res.statusCode}`);
            console.log(`📄 Access-Control-Allow-Origin: ${res.headers['access-control-allow-origin'] || 'Not set'}`);
            console.log(`📄 Access-Control-Allow-Methods: ${res.headers['access-control-allow-methods'] || 'Not set'}`);
            resolve(res.statusCode === 200);
        });
        
        req.on('error', (err) => {
            console.log(`❌ CORS Error: ${err.message}`);
            resolve(false);
        });
        
        req.setTimeout(5000, () => {
            console.log('❌ CORS Timeout');
            req.destroy();
            resolve(false);
        });
        
        req.end();
    });
}

// Main test function
async function runTests() {
    console.log('🚀 Starting Comprehensive Backend Tests...\n');
    
    const results = {
        http: await testHTTP(),
        https: await testHTTPS(),
        api: await testAPIEndpoints(),
        signalr: await testSignalR(),
        cors: await testCORS()
    };
    
    console.log('\n📊 Test Results Summary:');
    console.log('========================');
    console.log(`HTTP (Port 5000): ${results.http ? '✅ PASS' : '❌ FAIL'}`);
    console.log(`HTTPS (Port 5001): ${results.https ? '✅ PASS' : '❌ FAIL'}`);
    console.log(`API Endpoints: ${results.api ? '✅ PASS' : '❌ FAIL'}`);
    console.log(`SignalR: ${results.signalr ? '✅ PASS' : '❌ FAIL'}`);
    console.log(`CORS: ${results.cors ? '✅ PASS' : '❌ FAIL'}`);
    
    const passedTests = Object.values(results).filter(Boolean).length;
    const totalTests = Object.keys(results).length;
    
    console.log(`\n🎯 Overall: ${passedTests}/${totalTests} tests passed`);
    
    if (passedTests === totalTests) {
        console.log('🎉 All tests passed! Your backend is working perfectly.');
        console.log('\n🌐 Your backend is accessible at:');
        console.log(`   HTTP:  http://${BACKEND_IP}:${HTTP_PORT}`);
        console.log(`   HTTPS: https://${BACKEND_IP}:${HTTPS_PORT}`);
    } else {
        console.log('⚠️  Some tests failed. Check the backend service and firewall configuration.');
    }
    
    console.log('\n📝 Frontend Configuration:');
    console.log('Make sure your frontend is configured to use:');
    console.log(`   API Base URL: https://${BACKEND_IP}:${HTTPS_PORT}`);
    console.log(`   SignalR URL: https://${BACKEND_IP}:${HTTPS_PORT}/downloadHub`);
}

// Run the tests
runTests().catch(console.error); 