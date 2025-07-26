#!/bin/bash

# Fix Temp Directory Script for CharacterForge Backend
# This script fixes the temp directory permissions and configuration issues

echo "🔧 Fixing CharacterForge temp directory configuration..."

# Create a working temp directory in /tmp
echo "📁 Creating temp directory in /tmp..."
sudo mkdir -p /tmp/characterforge-app-temp
sudo chown -R characterforge:characterforge /tmp/characterforge-app-temp
sudo chmod -R 777 /tmp/characterforge-app-temp

# Test if the temp directory works
echo "🧪 Testing temp directory permissions..."
if sudo -u characterforge touch /tmp/characterforge-app-temp/test.txt 2>/dev/null; then
    echo "✅ Temp directory permissions working"
    sudo -u characterforge rm /tmp/characterforge-app-temp/test.txt
else
    echo "❌ Temp directory permissions failed"
    exit 1
fi

# Update the production configuration
echo "📝 Updating appsettings.Production.json..."
sudo sed -i 's|"TempDirectory": "/opt/characterforge/temp"|"TempDirectory": "/tmp/characterforge-app-temp"|g' /opt/characterforge/app/appsettings.Production.json

# Update the config template
echo "📝 Updating config-template.json..."
sudo sed -i 's|"TempDirectory": "/opt/characterforge/temp"|"TempDirectory": "/tmp/characterforge-app-temp"|g' /opt/characterforge/app/config-template.json

# Update the config directory file
echo "📝 Updating config/appsettings.Production.json..."
sudo sed -i 's|"TempDirectory": "/opt/characterforge/temp"|"TempDirectory": "/tmp/characterforge-app-temp"|g' /opt/characterforge/config/appsettings.Production.json

# Remove the problematic app Temp directory if it exists
echo "🗑️ Removing problematic app Temp directory..."
sudo rm -rf /opt/characterforge/app/Temp

# Restart the service
echo "🔄 Restarting CharacterForge service..."
sudo systemctl restart characterforge-imagix

# Check service status
echo "📊 Checking service status..."
sudo systemctl status characterforge-imagix --no-pager -l

echo "✅ Temp directory fix completed!"
echo "📁 New temp directory: /tmp/characterforge-app-temp"
echo "🔍 Monitor logs with: sudo journalctl -u characterforge-imagix -f" 