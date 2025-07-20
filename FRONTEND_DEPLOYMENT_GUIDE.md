# 🚀 Frontend Deployment Guide

## 📋 **Current Configuration**

Your frontend is configured to connect to the backend as follows:

### **Development Mode**
- **API URL**: `http://185.165.169.153:5000/api`
- **Used when**: Running locally with `npm run dev`

### **Production Mode** 
- **API URL**: `http://185.165.169.153:5000/api`
- **Used when**: Deployed to Cloudflare Pages

## 🔧 **Backend Server Status**

Your backend server is running on:
- **IP**: `185.165.169.153`
- **Port**: `5000`
- **Protocol**: HTTP (not HTTPS)
- **Status**: ✅ Running (as shown in deployment logs)

## 🌐 **CORS Configuration**

The backend is configured to accept requests from:
- ✅ `https://getyovids-fronted.pages.dev` (Cloudflare Pages)
- ✅ `https://www.getyovids.com` (Main domain)
- ✅ `http://185.165.169.153` (Direct IP)
- ✅ `http://localhost:8080` (Development)

## 🚀 **Deploy to Cloudflare Pages**

### **Step 1: Build the Frontend**
```bash
cd GetYoVids-frontend
npm run build
```

### **Step 2: Deploy to Cloudflare Pages**
1. Go to your Cloudflare Pages dashboard
2. Connect your repository or upload the `dist` folder
3. Set build settings:
   - **Build command**: `npm run build`
   - **Build output directory**: `dist`
   - **Root directory**: `GetYoVids-frontend` (if deploying from monorepo)

### **Step 3: Environment Variables (Optional)**
You can set these in Cloudflare Pages if needed:
- `VITE_API_BASE_URL`: `http://185.165.169.153:5000/api`

## 🔍 **Testing the Connection**

### **From Browser Console**
Open your deployed frontend and run in browser console:
```javascript
fetch('http://185.165.169.153:5000/api/health')
  .then(response => response.json())
  .then(data => console.log('Backend health:', data))
  .catch(error => console.error('Connection error:', error));
```

### **Expected Response**
```json
{
  "status": "Healthy"
}
```

## ⚠️ **Important Notes**

### **HTTP vs HTTPS**
- Your backend currently runs on **HTTP** (not HTTPS)
- This is fine for development and testing
- For production, consider setting up HTTPS with a reverse proxy (nginx)

### **Firewall Configuration**
Make sure your server allows incoming connections on port 5000:
```bash
sudo ufw allow 5000
```

### **Domain Configuration**
Once you have your domain configured:
1. Update `vite.config.ts` to use your domain instead of IP
2. Update backend CORS to include your domain
3. Consider setting up HTTPS

## 🔧 **Troubleshooting**

### **Connection Refused**
- Check if backend is running: `curl http://185.165.169.153:5000/health`
- Check firewall: `sudo ufw status`
- Check backend logs for errors

### **CORS Errors**
- Verify the frontend domain is in backend CORS configuration
- Check browser console for specific CORS error messages

### **Mixed Content Errors**
- If your frontend is on HTTPS but backend is HTTP, browsers may block requests
- Solution: Set up HTTPS for backend or use a reverse proxy

## 📞 **Quick Test**

To quickly test if everything works:

1. **Backend Health Check**:
   ```bash
   curl http://185.165.169.153:5000/health
   ```

2. **Frontend API Test**:
   ```javascript
   // Run in browser console on your deployed frontend
   fetch('http://185.165.169.153:5000/api/health')
     .then(r => r.json())
     .then(console.log)
   ```

3. **Download Test**:
   Try downloading a video through your frontend interface 