# 🎯 Frontend hathormodel.com Integration Guide

## 🚀 **Overview**

Your frontend is now configured to automatically connect to `hathormodel.com` when it's available! The connection detector will prioritize your domain over the IP address.

## 🔧 **How It Works**

### **1. Connection Detection Priority**

The frontend uses a smart connection detector that:

1. **First checks** if `hathormodel.com` is available
2. **If available** → Uses `https://hathormodel.com` as primary backend
3. **If not available** → Falls back to IP address connections
4. **Automatic detection** on app startup

### **2. Configuration Files**

#### **Connection Detector** (`src/services/connectionDetector.ts`)
```typescript
// Automatically detects hathormodel.com availability
private async checkHathormodelAvailability(): Promise<boolean> {
  try {
    const response = await fetch('https://hathormodel.com/health', {
      method: 'GET',
      mode: 'cors',
      headers: { 'Content-Type': 'application/json' },
      signal: AbortSignal.timeout(3000)
    });
    return response.ok;
  } catch (error) {
    return false;
  }
}
```

#### **Hathormodel Config** (`src/config/hathormodel.ts`)
```typescript
export const hathormodelConfig = {
  api: {
    baseUrl: 'https://hathormodel.com/api',
    timeout: 600000,
  },
  signalR: {
    hubUrl: 'https://hathormodel.com/hubs/downloads',
  },
  health: {
    endpoint: 'https://hathormodel.com/health',
  },
  // ... more configuration
};
```

## 🎯 **Connection Priority Order**

1. **🎯 hathormodel.com** (if available)
2. **🔒 HTTPS IP** (`https://185.165.169.153:5001`)
3. **🌐 HTTP IP** (`http://185.165.169.153:5000`) - only in development

## 🧪 **Testing the Integration**

### **Test 1: Check Connection Detection**
```javascript
// In browser console
import { connectionDetector } from './src/services/connectionDetector';
const result = await connectionDetector.detectBestConnection();
console.log('Best connection:', result);
```

### **Test 2: Check Hathormodel Availability**
```javascript
// In browser console
import { checkHathormodelAvailability } from './src/config/hathormodel';
const available = await checkHathormodelAvailability();
console.log('hathormodel.com available:', available);
```

### **Test 3: Test API Connection**
```javascript
// In browser console
fetch('https://hathormodel.com/health')
  .then(response => response.json())
  .then(data => console.log('✅ hathormodel.com connected:', data))
  .catch(error => console.error('❌ hathormodel.com failed:', error));
```

## 🎨 **Frontend URLs**

When `hathormodel.com` is available, your frontend will connect to:

- **API Base**: `https://hathormodel.com/api`
- **SignalR Hub**: `https://hathormodel.com/hubs/downloads`
- **Health Check**: `https://hathormodel.com/health`
- **Swagger Docs**: `https://hathormodel.com/swagger`

## 🔄 **Automatic Fallback**

If `hathormodel.com` is not available, the frontend automatically falls back to:

- **API Base**: `https://185.165.169.153:5001/api`
- **SignalR Hub**: `https://185.165.169.153:5001/hubs/downloads`

## 🚀 **Deployment Process**

### **Step 1: Backend Setup**
```bash
# SSH into your VPS
ssh root@185.165.169.153
cd ~/GetYoVids-backend

# Run hathormodel setup
./auto-deploy.sh --hathormodel
```

### **Step 2: Frontend Deployment**
```bash
# Navigate to frontend
cd ../GetYoVids-frontend

# Build the project
npm run build

# Deploy to Cloudflare Pages
# The frontend will automatically detect hathormodel.com
```

## 🎯 **Expected Behavior**

### **When hathormodel.com is Available:**
```
🎯 hathormodel.com is available - using as primary backend
✅ API: https://hathormodel.com/api
✅ SignalR: https://hathormodel.com/hubs/downloads
✅ Browser-trusted SSL
✅ No mixed content errors
```

### **When hathormodel.com is Not Available:**
```
⚠️ hathormodel.com not available, falling back to IP
✅ API: https://185.165.169.153:5001/api
✅ SignalR: https://185.165.169.153:5001/hubs/downloads
```

## 🛠️ **Troubleshooting**

### **Frontend Not Connecting to hathormodel.com**

**Check 1: DNS Resolution**
```bash
nslookup hathormodel.com
# Should return: 185.165.169.153
```

**Check 2: Backend Health**
```bash
curl https://hathormodel.com/health
# Should return: {"status":"healthy","timestamp":"..."}
```

**Check 3: CORS Issues**
```javascript
// In browser console
fetch('https://hathormodel.com/health', {
  method: 'GET',
  mode: 'cors',
  headers: { 'Content-Type': 'application/json' }
})
.then(response => console.log('CORS OK:', response.status))
.catch(error => console.error('CORS Error:', error));
```

### **Connection Detection Issues**

**Force Redetection:**
```javascript
// In browser console
import { connectionDetector } from './src/services/connectionDetector';
await connectionDetector.forceRedetection();
const result = await connectionDetector.detectBestConnection();
console.log('New connection:', result);
```

### **SignalR Connection Issues**

**Check SignalR Status:**
```javascript
// In browser console
import { signalRService } from './src/services/signalr';
console.log('SignalR State:', signalRService.connection?.state);
```

## 📋 **Configuration Files**

### **Updated Files:**
- `src/services/connectionDetector.ts` - Hathormodel detection logic
- `src/services/api.ts` - API service with hathormodel support
- `src/services/signalr.ts` - SignalR service with hathormodel support
- `src/config/hathormodel.ts` - Hathormodel-specific configuration

### **Backup Files:**
When you run the auto-deploy script, backup files are created:
- `*.backup.YYYYMMDD-HHMMSS`

## 🎉 **Benefits**

- ✅ **Automatic detection** of hathormodel.com
- ✅ **Seamless fallback** to IP if domain unavailable
- ✅ **Browser-trusted SSL** when using hathormodel.com
- ✅ **No mixed content errors** in production
- ✅ **Professional domain** for your app
- ✅ **Real-time connection** monitoring

## 🔄 **Maintenance**

### **SSL Certificate**
- Auto-renewed by Let's Encrypt
- No frontend changes needed

### **Domain Changes**
- Update `src/config/hathormodel.ts` if needed
- Connection detector will automatically adapt

### **Backend Updates**
- Run `./auto-deploy.sh --hathormodel` to update
- Frontend will automatically detect changes

## 📞 **Next Steps**

1. **Configure DNS** in Hostinger to point `hathormodel.com` to `185.165.169.153`
2. **Run backend setup**: `./auto-deploy.sh --hathormodel`
3. **Deploy frontend** to Cloudflare Pages
4. **Test connection** using the provided test commands
5. **Monitor logs** for any connection issues

Your frontend is now fully integrated with `hathormodel.com` and will automatically use your professional domain when available! 🚀 