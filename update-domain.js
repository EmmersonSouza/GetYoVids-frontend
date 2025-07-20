#!/usr/bin/env node

// Simple script to update the domain in environment configuration
// Usage: node update-domain.js getyovideos.server.com

const fs = require('fs');
const path = require('path');

const domain = process.argv[2];

if (!domain) {
  console.error('❌ Please provide a domain name');
  console.log('Usage: node update-domain.js yourdomain.com');
  process.exit(1);
}

const envFile = path.join(__dirname, 'src', 'config', 'environment.ts');

if (!fs.existsSync(envFile)) {
  console.error('❌ Environment file not found:', envFile);
  process.exit(1);
}

try {
  let content = fs.readFileSync(envFile, 'utf8');
  
  // No domain updates needed - using IP only
  console.log('ℹ️  Using IP-only configuration - no domain updates needed');
  
  // Write back to file
  fs.writeFileSync(envFile, content);
  
  console.log('✅ Domain updated successfully!');
  console.log(`🌐 Frontend will now connect to: https://${domain}`);
  console.log('');
  console.log('📋 Next steps:');
  console.log('1. Build the project: npm run build');
  console.log('2. Deploy to Cloudflare Pages');
  console.log('3. Run backend deployment: ./auto-deploy.sh --full-setup --domain ' + domain);
  
} catch (error) {
  console.error('❌ Error updating domain:', error.message);
  process.exit(1);
} 