# CharacterForge Backend Deployment with Temp Directory Fix

## Overview
This guide includes a fix for the temp directory permissions issue that prevents YouTube and other downloads from working.

## Quick Fix Script

### 1. Upload the Fix Script
Upload the `fix-temp-directory.sh` script to your VPS:

```bash
# Upload the script to your VPS
scp fix-temp-directory.sh osamabinladen@your-vps-ip:/home/osamabinladen/
```

### 2. Run the Fix Script
```bash
# Make the script executable
chmod +x fix-temp-directory.sh

# Run the fix script
./fix-temp-directory.sh
```

## Manual Fix Steps

If you prefer to fix it manually:

### 1. Create Working Temp Directory
```bash
# Create temp directory in /tmp
sudo mkdir -p /tmp/characterforge-app-temp
sudo chown -R characterforge:characterforge /tmp/characterforge-app-temp
sudo chmod -R 777 /tmp/characterforge-app-temp

# Test permissions
sudo -u characterforge touch /tmp/characterforge-app-temp/test.txt
sudo -u characterforge echo "test" > /tmp/characterforge-app-temp/test.txt
sudo -u characterforge rm /tmp/characterforge-app-temp/test.txt
```

### 2. Update Configuration Files
```bash
# Update production config
sudo sed -i 's|"TempDirectory": "/opt/characterforge/temp"|"TempDirectory": "/tmp/characterforge-app-temp"|g' /opt/characterforge/app/appsettings.Production.json

# Update config template
sudo sed -i 's|"TempDirectory": "/opt/characterforge/temp"|"TempDirectory": "/tmp/characterforge-app-temp"|g' /opt/characterforge/app/config-template.json

# Update config directory file
sudo sed -i 's|"TempDirectory": "/opt/characterforge/temp"|"TempDirectory": "/tmp/characterforge-app-temp"|g' /opt/characterforge/config/appsettings.Production.json
```

### 3. Remove Problematic Directory
```bash
# Remove the problematic app Temp directory
sudo rm -rf /opt/characterforge/app/Temp
```

### 4. Restart Service
```bash
# Restart the service
sudo systemctl restart characterforge-imagix

# Check status
sudo systemctl status characterforge-imagix
```

## Verify the Fix

### 1. Monitor Logs
```bash
sudo journalctl -u characterforge-imagix -f
```

### 2. Test Downloads
Try downloading a YouTube video or TikTok video. You should see:
- No more "Read-only file system" errors
- Successful file downloads
- Progress bars working correctly

## Why This Fix Works

The issue was that the `/opt` filesystem has restrictions that prevent the `characterforge` user from writing files, even with 777 permissions. By moving the temp directory to `/tmp`, we:

1. **Use a filesystem designed for temporary files**
2. **Avoid filesystem-level restrictions**
3. **Ensure proper permissions for the service user**

## Integration with Deployment

Add this to your deployment process:

```bash
# After deploying the backend, run the temp directory fix
./fix-temp-directory.sh
```

Or include the manual steps in your deployment script.

## Troubleshooting

### If the script fails:
1. Check if `/tmp` is writable: `ls -la /tmp`
2. Verify the characterforge user exists: `id characterforge`
3. Check service logs: `sudo journalctl -u characterforge-imagix -f`

### If downloads still fail:
1. Verify the temp directory exists: `ls -la /tmp/characterforge-app-temp`
2. Check permissions: `sudo -u characterforge touch /tmp/characterforge-app-temp/test.txt`
3. Monitor logs for new errors

## Files Modified

The script modifies these files:
- `/opt/characterforge/app/appsettings.Production.json`
- `/opt/characterforge/app/config-template.json`
- `/opt/characterforge/config/appsettings.Production.json`

## Backup

Before running the fix, you can backup the original configs:

```bash
sudo cp /opt/characterforge/app/appsettings.Production.json /opt/characterforge/app/appsettings.Production.json.backup
sudo cp /opt/characterforge/app/config-template.json /opt/characterforge/app/config-template.json.backup
sudo cp /opt/characterforge/config/appsettings.Production.json /opt/characterforge/config/appsettings.Production.json.backup
``` 