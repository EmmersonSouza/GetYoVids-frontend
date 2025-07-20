# 🧪 VPS Backend Testing Guide

## 🎯 **Quick Test Methods**

### **Method 1: Browser Console Test (Recommended)**

1. **Open your frontend** (localhost:8080 or your domain)
2. **Press F12** to open browser console
3. **Copy and paste** the test script from `test-vps-connection.js`
4. **Run the test**:
   ```javascript
   testVpsConnection()
   ```

### **Method 2: Direct Browser Test**

1. **Open a new browser tab**
2. **Navigate to**: `http://185.165.169.153:5000/health`
3. **Expected result**: JSON response like `{"status":"healthy","timestamp":"..."}`

### **Method 3: Frontend Integration Test**

1. **Go to your frontend** (YouTube downloader, etc.)
2. **Enter a test URL**: `https://www.youtube.com/watch?v=dQw4w9WgXcQ`
3. **Click download** and watch the network tab in F12
4. **Check for requests** to `185.165.169.153:5000`

## 🔍 **What the Tests Check**

### **1. Basic Connectivity**
- ✅ Can reach the VPS IP address
- ✅ Port 5000 is open and accessible
- ✅ Backend is responding to basic requests

### **2. API Health**
- ✅ Backend API endpoints are working
- ✅ JSON responses are properly formatted
- ✅ No server errors

### **3. CORS Configuration**
- ✅ Your frontend domains are allowed
- ✅ Local development URLs work
- ✅ Production domains work
- ✅ Network IPs work

### **4. Download Endpoints**
- ✅ YouTube downloader endpoint responds
- ✅ POST requests are accepted
- ✅ JSON payloads are processed

### **5. SignalR Connection**
- ✅ Real-time communication hub is accessible
- ✅ WebSocket connections can be established

### **6. Cloud Storage**
- ✅ Wasabi cloud storage integration works
- ✅ File upload/download endpoints respond

### **7. Network Latency**
- ✅ Connection speed measurement
- ✅ Performance assessment

### **8. Frontend Integration**
- ✅ Your frontend's API service can connect
- ✅ Axios/fetch requests work properly

## 🚨 **Common Issues & Solutions**

### **Issue: "Failed to fetch" or "Network Error"**
**Possible Causes:**
- VPS is down or not running
- Firewall blocking port 5000
- Backend service crashed

**Solutions:**
```bash
# SSH into your VPS and check
ssh root@185.165.169.153

# Check if backend is running
sudo systemctl status characterforge-imagix

# Check if port 5000 is listening
netstat -tlnp | grep :5000

# Check firewall
sudo ufw status
```

### **Issue: CORS Errors**
**Symptoms:** Browser console shows CORS policy errors

**Solutions:**
1. **Check CORS configuration** in `Program.cs`
2. **Verify your domain** is in the allowed origins
3. **Restart the backend** after CORS changes

### **Issue: "Connection Refused"**
**Solutions:**
```bash
# On VPS, check if service is running
sudo systemctl start characterforge-imagix
sudo systemctl enable characterforge-imagix

# Check logs
sudo journalctl -u characterforge-imagix -f
```

### **Issue: Slow Response Times**
**Solutions:**
1. **Check VPS resources**: `htop` or `top`
2. **Check network**: `ping 185.165.169.153`
3. **Check backend logs** for performance issues

## 📊 **Expected Test Results**

### **✅ All Tests Pass**
```
🎉 All tests passed! Your VPS backend is working perfectly!
```

### **⚠️ Some Tests Fail**
Check which specific tests failed and focus on those areas.

### **❌ Most Tests Fail**
Likely a fundamental connectivity or service issue.

## 🔧 **Manual Testing Steps**

### **Step 1: Verify VPS is Running**
```bash
# SSH into VPS
ssh root@185.165.169.153

# Check service status
sudo systemctl status characterforge-imagix

# Check if port is listening
ss -tlnp | grep :5000
```

### **Step 2: Test from VPS**
```bash
# Test locally on VPS
curl http://localhost:5000/health

# Test from VPS to external
curl http://185.165.169.153:5000/health
```

### **Step 3: Test from Your PC**
```bash
# Test connectivity
ping 185.165.169.153

# Test port
telnet 185.165.169.153 5000

# Test HTTP
curl http://185.165.169.153:5000/health
```

### **Step 4: Test from Frontend**
1. Open browser console on your frontend
2. Run the test script
3. Check network tab for requests
4. Verify responses

## 🎯 **Production Testing Checklist**

Before going live, verify:

- [ ] **VPS is accessible** from internet
- [ ] **Backend service** is running and auto-restarting
- [ ] **CORS policy** allows your production domains
- [ ] **Firewall** allows port 5000
- [ ] **SSL/HTTPS** is configured (if needed)
- [ ] **Domain DNS** points to VPS IP
- [ ] **Frontend** connects to correct backend URL
- [ ] **Download functionality** works end-to-end
- [ ] **Error handling** works properly
- [ ] **Logs** are being generated and accessible

## 🚀 **Quick Commands for VPS**

```bash
# Check service status
sudo systemctl status characterforge-imagix

# Restart service
sudo systemctl restart characterforge-imagix

# View logs
sudo journalctl -u characterforge-imagix -f

# Check port
netstat -tlnp | grep :5000

# Check firewall
sudo ufw status

# Check disk space
df -h

# Check memory
free -h

# Check CPU
top
```

## 📱 **Mobile Testing**

Test from mobile devices:
1. **Open your frontend** on mobile browser
2. **Try downloading** a video
3. **Check if it works** on mobile networks
4. **Test different mobile browsers** (Chrome, Safari, Firefox)

## 🌐 **Cross-Browser Testing**

Test on different browsers:
- ✅ Chrome
- ✅ Firefox
- ✅ Safari
- ✅ Edge
- ✅ Mobile browsers

## 🔄 **Continuous Monitoring**

Set up monitoring:
1. **Health check endpoint** returns 200
2. **Log monitoring** for errors
3. **Uptime monitoring** service
4. **Performance monitoring** for slow responses

## 📞 **Emergency Contacts**

If tests fail:
1. **Check VPS status** first
2. **Restart backend service**
3. **Check firewall settings**
4. **Review recent changes**
5. **Check system resources** 