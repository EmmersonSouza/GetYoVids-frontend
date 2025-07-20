// Environment configuration for GetYoVids frontend
// This file is automatically updated by the deployment script

export const environment = {
  // Backend API configuration
  api: {
    // Development environment
    development: {
      baseUrl: 'http://185.165.169.153:5000',
      apiUrl: 'http://185.165.169.153:5000/api',
      signalRUrl: 'http://185.165.169.153:5000'
    },
    // Production environment - URLs will be detected dynamically
    production: {
      // These are fallback URLs if dynamic detection fails
      fallbackUrls: [
        'https://185.165.169.153:5001',
        'http://185.165.169.153:5000'
      ]
    }
  },
  
  // Feature flags
  features: {
    monetization: true,
    cloudStorage: true,
    batchDownloads: true,
    realTimeProgress: true
  },
  
  // App configuration
  app: {
    name: 'GetYoVids',
    version: '1.0.0',
    timeout: 600000, // 10 minutes
    maxRetries: 3
  }
};

// Helper function to get current environment config
export const getCurrentConfig = () => {
  const isDev = import.meta.env.DEV;
  
  if (isDev) {
    return {
      ...environment.api.development,
      ...environment.features,
      ...environment.app
    };
  }
  
  // For production, return fallback URLs
  return {
    baseUrl: environment.api.production.fallbackUrls[0],
    apiUrl: `${environment.api.production.fallbackUrls[0]}/api`,
    signalRUrl: environment.api.production.fallbackUrls[0],
    ...environment.features,
    ...environment.app
  };
};

// Export individual configs for easy access (fallback values)
export const apiConfig = getCurrentConfig();
export const { baseUrl, apiUrl, signalRUrl } = apiConfig; 