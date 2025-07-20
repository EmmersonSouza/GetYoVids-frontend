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
    // Production environment
    production: {
      baseUrl: 'https://DOMAIN_PLACEHOLDER', // Will be updated by deployment script
      apiUrl: 'https://DOMAIN_PLACEHOLDER/api', // Will be updated by deployment script
      signalRUrl: 'https://DOMAIN_PLACEHOLDER' // Will be updated by deployment script
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
  return {
    ...environment.api[isDev ? 'development' : 'production'],
    ...environment.features,
    ...environment.app
  };
};

// Export individual configs for easy access
export const apiConfig = getCurrentConfig();
export const { baseUrl, apiUrl, signalRUrl } = apiConfig; 