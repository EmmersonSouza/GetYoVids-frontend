// hathormodel.com Configuration
// This file contains specific configuration for the hathormodel.com domain

export const hathormodelConfig = {
  // API Configuration
  api: {
    baseUrl: 'https://hathormodel.com/api',
    timeout: 600000, // 10 minutes for video processing
    headers: {
      'Content-Type': 'application/json',
    },
  },

  // SignalR Configuration
  signalR: {
    hubUrl: 'https://hathormodel.com/hubs/downloads',
    automaticReconnect: true,
    reconnectInterval: 2000,
    maxReconnectAttempts: 5,
  },

  // Health Check
  health: {
    endpoint: 'https://hathormodel.com/health',
    interval: 30000, // 30 seconds
  },

  // Swagger Documentation
  swagger: {
    url: 'https://hathormodel.com/swagger',
  },

  // Domain Information
  domain: {
    name: 'hathormodel.com',
    protocol: 'https',
    ssl: true,
    browserTrusted: true,
  },

  // Features
  features: {
    cloudStorage: true,
    batchDownloads: true,
    realTimeProgress: true,
    multiplePlatforms: true,
  },

  // Platform Support
  platforms: {
    youtube: true,
    tiktok: true,
    instagram: true,
    twitter: true,
    vimeo: true,
    facebook: true,
    twitch: true,
    reddit: true,
    pornhub: true,
    xvideos: true,
    xhamster: true,
    redgifs: true,
    youporn: true,
    spankbang: true,
  },

  // Download Options
  downloadOptions: {
    formats: ['mp4', 'avi', 'mov', 'mkv', 'jpg', 'jpeg', 'png', 'webp', 'mp3', 'wav'],
    qualities: ['best', 'worst', '720p', '1080p', '480p', '360p'],
    maxFileSize: 1073741824, // 1GB
  },

  // Cloud Storage
  cloudStorage: {
    enabled: true,
    provider: 'wasabi',
    bucket: 'getyovids',
    region: 'eu-central-2',
    retentionHours: 24,
    makePublic: true,
  },
};

// Helper function to get API URL
export const getApiUrl = (endpoint: string = ''): string => {
  return `${hathormodelConfig.api.baseUrl}${endpoint}`;
};

// Helper function to get SignalR URL
export const getSignalRUrl = (): string => {
  return hathormodelConfig.signalR.hubUrl;
};

// Helper function to check if hathormodel.com is available
export const checkHathormodelAvailability = async (): Promise<boolean> => {
  try {
    const response = await fetch(hathormodelConfig.health.endpoint, {
      method: 'GET',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
      },
      signal: AbortSignal.timeout(3000), // 3 second timeout
    });
    return response.ok;
  } catch (error) {
    console.log('hathormodel.com not available:', error);
    return false;
  }
};

// Helper function to get connection info
export const getConnectionInfo = () => {
  return {
    domain: hathormodelConfig.domain.name,
    protocol: hathormodelConfig.domain.protocol,
    ssl: hathormodelConfig.domain.ssl,
    browserTrusted: hathormodelConfig.domain.browserTrusted,
    apiUrl: hathormodelConfig.api.baseUrl,
    signalRUrl: hathormodelConfig.signalR.hubUrl,
  };
};

export default hathormodelConfig; 