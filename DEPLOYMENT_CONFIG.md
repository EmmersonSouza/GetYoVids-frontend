# 🚀 Deployment Configuration

## 🌐 Server Information

### **Production Server**
- **Hostname**: `getyovids.server.com`
- **Primary IP**: `185.165.169.153`
- **IPv6**: `2a06:1700:0:2f5::f200:3c9f/64`
- **Nameservers**: `ns1.flokinet.net`, `ns2.flokinet.net`

## 🔧 API Configuration

### **Development Environment**
- **Frontend**: `http://localhost:8080`
- **Backend API**: `http://localhost:5000/api`

### **Production Environment**
- **Frontend**: `https://getyovids-fronted.pages.dev` (Cloudflare Pages)
- **Backend API**: `https://185.165.169.153:5000/api` (Direct IP)

## 📋 DNS Configuration

### **Required DNS Records**
```
Type    Name                    Value
A       api.getyovids.com       185.165.169.153
A       www.getyovids.com       185.165.169.153
A       getyovids.com           185.165.169.153
```

## 🔒 CORS Configuration

### **Backend CORS Policy**
The backend allows requests from:
- `http://localhost:8080` (Development)
- `http://localhost:3000` (Development - Vite default)
- `https://getyovids-fronted.pages.dev` (Production - Cloudflare Pages)
- `https://www.getyovids.com` (Production - Main domain)
- `https://185.165.169.153` (Production - Direct IP)

## 🏗️ Build Configuration

### **Development Build**
```bash
npm run dev
# Uses: http://localhost:5000/api
```

### **Production Build**
```bash
npm run build
# Uses: https://185.165.169.153:5000/api
```

## 🚀 Deployment Steps

### **1. Backend Deployment**
```bash
# On server (185.165.169.153)
cd GetYoVids-backend
./auto-deploy.sh --full-setup --native --production
```

### **2. Frontend Deployment**
```bash
# Build for production
cd GetYoVids-frontend
npm run build

# Deploy to Cloudflare Pages
# Upload dist/ folder to Cloudflare Pages
```

### **3. DNS Configuration**
- Configure DNS records to point domains to `185.165.169.153`
- Set up SSL certificates for HTTPS

## 🔍 Testing

### **Development Testing**
- Frontend: `http://localhost:8080`
- Backend: `http://localhost:5000`
- API: `http://localhost:5000/api`

### **Production Testing**
- Frontend: `https://getyovids-fronted.pages.dev`
- Backend: `https://185.165.169.153:5000`
- API: `https://185.165.169.153:5000/api`

## 📝 Notes

- ✅ **Direct IP access** is configured for immediate deployment
- ✅ **Domain-based access** will work once DNS is configured
- ✅ **CORS is properly configured** for all environments
- ✅ **HTTPS is supported** for production
- ✅ **Cloudflare Pages** integration is ready 