// Dynamic Connection Detector
// Tests all available backend URLs and selects the best one on app startup

interface ConnectionTest {
  url: string;
  type: 'domain' | 'https-ip' | 'http-ip';
  success: boolean;
  responseTime: number;
  error?: string;
}

interface ConnectionResult {
  bestApiUrl: string;
  bestSignalRUrl: string;
  connectionType: string;
  allResults: ConnectionTest[];
}

class ConnectionDetector {
  private static instance: ConnectionDetector;
  private connectionResult: ConnectionResult | null = null;
  private isDetecting = false;
  private detectionPromise: Promise<ConnectionResult> | null = null;

  private constructor() {}

  static getInstance(): ConnectionDetector {
    if (!ConnectionDetector.instance) {
      ConnectionDetector.instance = new ConnectionDetector();
    }
    return ConnectionDetector.instance;
  }

  // Get the current domain from the browser
  private getCurrentDomain(): string {
    const hostname = window.location.hostname;
    // If we're on a domain (not localhost), use it for the backend
    if (hostname !== 'localhost' && hostname !== '127.0.0.1') {
      return hostname;
    }
    return '185.165.169.153'; // Default to IP
  }

  // Check if hathormodel.com is available
  private async checkHathormodelAvailability(): Promise<boolean> {
    try {
      const response = await fetch('https://hathormodel.com/health', {
        method: 'GET',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
        },
        signal: AbortSignal.timeout(3000) // 3 second timeout
      });
      return response.ok;
    } catch (error) {
      console.log('hathormodel.com not available:', error);
      return false;
    }
  }

  // Check if we're in a production environment
  private isProductionEnvironment(): boolean {
    const hostname = window.location.hostname;
    const protocol = window.location.protocol;
    
    // Production if we're on HTTPS and not localhost
    return protocol === 'https:' && hostname !== 'localhost' && hostname !== '127.0.0.1';
  }

  // Check if local development mode is forced
  private isLocalDevelopmentForced(): boolean {
    // Check URL parameter
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('local') === 'true') {
      console.log('🔧 Local development mode forced via URL parameter');
      return true;
    }
    
    // Check localStorage
    if (localStorage.getItem('forceLocalDevelopment') === 'true') {
      console.log('🔧 Local development mode forced via localStorage');
      return true;
    }
    
    return false;
  }

  // Test a single connection
  private async testConnection(url: string, type: string): Promise<ConnectionTest> {
    const startTime = Date.now();
    
    try {
      console.log(`🔍 Testing ${type} connection: ${url}`);
      
      const response = await fetch(`${url}/health`, {
        method: 'GET',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
        },
        signal: AbortSignal.timeout(5000) // 5 second timeout
      });

      const responseTime = Date.now() - startTime;

      if (response.ok) {
        console.log(`✅ ${type} connection successful (${responseTime}ms): ${url}`);
        return {
          url,
          type: type as any,
          success: true,
          responseTime
        };
      } else {
        console.log(`❌ ${type} connection failed (${response.status}): ${url}`);
        return {
          url,
          type: type as any,
          success: false,
          responseTime,
          error: `HTTP ${response.status}`
        };
      }
    } catch (error) {
      const responseTime = Date.now() - startTime;
      console.log(`❌ ${type} connection failed: ${url} - ${error}`);
      return {
        url,
        type: type as any,
        success: false,
        responseTime,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  // Detect the best connection
  async detectBestConnection(): Promise<ConnectionResult> {
    // Return cached result if available
    if (this.connectionResult) {
      console.log('📋 Using cached connection result');
      return this.connectionResult;
    }

    // Prevent multiple simultaneous detections
    if (this.isDetecting && this.detectionPromise) {
      console.log('⏳ Connection detection already in progress, waiting...');
      return this.detectionPromise;
    }

    this.isDetecting = true;
    this.detectionPromise = this.performDetection();
    
    try {
      const result = await this.detectionPromise;
      this.connectionResult = result;
      return result;
    } finally {
      this.isDetecting = false;
      this.detectionPromise = null;
    }
  }

  private async performDetection(): Promise<ConnectionResult> {
    console.log('🚀 Starting dynamic connection detection...');
    
    const domain = this.getCurrentDomain();
    const isProduction = this.isProductionEnvironment();
    const isLocalForced = this.isLocalDevelopmentForced();
    
    console.log(`🌍 Environment: ${isProduction ? 'Production' : 'Development'}`);
    console.log(`🌐 Current domain: ${domain}`);
    console.log(`🔒 Protocol: ${window.location.protocol}`);
    console.log(`🔧 Local development forced: ${isLocalForced}`);
    
    // If local development is forced, skip all other checks
    if (isLocalForced) {
      console.log('🔧 Forced local development mode - testing localhost connections only');
      
      const localConnections = [
        { url: 'http://localhost:5000', type: 'localhost' },
        { url: 'https://localhost:5001', type: 'localhost-https' }
      ];
      
      console.log(`🔗 Testing localhost connections:`, localConnections.map(c => `${c.type}: ${c.url}`));
      
      const localTestPromises = localConnections.map(conn => 
        this.testConnection(conn.url, conn.type)
      );
      
      const localResults = await Promise.all(localTestPromises);
      const successfulLocalConnections = localResults.filter(r => r.success);
      
      if (successfulLocalConnections.length > 0) {
        const bestLocalConnection = successfulLocalConnections.sort((a, b) => a.responseTime - b.responseTime)[0];
        console.log(`🎯 Local connection successful: ${bestLocalConnection.type} (${bestLocalConnection.responseTime}ms)`);
        
        return {
          bestApiUrl: `${bestLocalConnection.url}/api`,
          bestSignalRUrl: bestLocalConnection.url,
          connectionType: bestLocalConnection.type,
          allResults: localResults
        };
      } else {
        console.error('❌ No local connections available in forced local mode');
        throw new Error('No local backend connections available. Please start your backend server on localhost:5000');
      }
    }
    
    // In development mode, prioritize localhost over hathormodel.com
    if (!isProduction && (domain === 'localhost' || domain === '127.0.0.1')) {
      console.log('🔧 Development mode detected - prioritizing localhost connections');
      
      // Test localhost connections first
      const localConnections = [
        { url: 'http://localhost:5000', type: 'localhost' },
        { url: 'https://localhost:5001', type: 'localhost-https' }
      ];
      
      console.log(`🔗 Testing localhost connections:`, localConnections.map(c => `${c.type}: ${c.url}`));
      
      const localTestPromises = localConnections.map(conn => 
        this.testConnection(conn.url, conn.type)
      );
      
      const localResults = await Promise.all(localTestPromises);
      const successfulLocalConnections = localResults.filter(r => r.success);
      
      if (successfulLocalConnections.length > 0) {
        const bestLocalConnection = successfulLocalConnections.sort((a, b) => a.responseTime - b.responseTime)[0];
        console.log(`🎯 Local connection successful: ${bestLocalConnection.type} (${bestLocalConnection.responseTime}ms)`);
        
        return {
          bestApiUrl: `${bestLocalConnection.url}/api`,
          bestSignalRUrl: bestLocalConnection.url,
          connectionType: bestLocalConnection.type,
          allResults: localResults
        };
      }
    }
    
    // Check if hathormodel.com is available
    const hathormodelAvailable = await this.checkHathormodelAvailability();
    
    if (hathormodelAvailable) {
      console.log('🎯 hathormodel.com is available - using as primary backend');
      return {
        bestApiUrl: 'https://hathormodel.com/api',
        bestSignalRUrl: 'https://hathormodel.com',
        connectionType: 'hathormodel-domain',
        allResults: [{
          url: 'https://hathormodel.com',
          type: 'domain',
          success: true,
          responseTime: 0
        }]
      };
    }
    
    // Define connection URLs based on environment
    let connections: Array<{ url: string; type: string }> = [];
    
    if (isProduction) {
      // In production (HTTPS), prioritize HTTPS connections to avoid mixed content
      connections = [
        { url: 'https://185.165.169.153:5001', type: 'https-ip' },
        // Only try HTTP if we're not on HTTPS to avoid mixed content
        ...(window.location.protocol === 'http:' ? [{ url: 'http://185.165.169.153:5000', type: 'http-ip' }] : [])
      ];
    } else {
      // In development, try both
      connections = [
        { url: 'https://185.165.169.153:5001', type: 'https-ip' },
        { url: 'http://185.165.169.153:5000', type: 'http-ip' }
      ];
    }

    console.log(`🔗 Testing connections:`, connections.map(c => `${c.type}: ${c.url}`));

    // Test all connections in parallel
    const testPromises = connections.map(conn => 
      this.testConnection(conn.url, conn.type)
    );

    const results = await Promise.all(testPromises);
    
    // Find the best successful connection (prioritize by type and response time)
    const successfulConnections = results.filter(r => r.success);
    
    if (successfulConnections.length === 0) {
      console.warn('⚠️ No connections successful, using fallback strategy');
      
      // In production, if HTTPS fails, we can't fall back to HTTP due to mixed content
      if (isProduction && window.location.protocol === 'https:') {
        console.error('❌ Production HTTPS environment: Cannot fall back to HTTP due to mixed content policy');
        console.log('💡 Solution: Set up proper SSL certificate on your backend or use a domain with Let\'s Encrypt');
        
        // Use HTTPS as fallback even if it failed (user will need to accept certificate)
        const fallbackUrl = 'https://185.165.169.153:5001';
        return {
          bestApiUrl: `${fallbackUrl}/api`,
          bestSignalRUrl: fallbackUrl,
          connectionType: 'https-ip-fallback',
          allResults: results
        };
      } else {
        // In development or HTTP environment, use first URL as fallback
        const fallbackUrl = connections[0].url;
        return {
          bestApiUrl: `${fallbackUrl}/api`,
          bestSignalRUrl: fallbackUrl,
          connectionType: `${connections[0].type}-fallback`,
          allResults: results
        };
      }
    }

    // Sort by priority: https-ip > http-ip, then by response time
    const priorityOrder = { 'https-ip': 1, 'http-ip': 2 };
    successfulConnections.sort((a, b) => {
      const priorityDiff = priorityOrder[a.type] - priorityOrder[b.type];
      if (priorityDiff !== 0) return priorityDiff;
      return a.responseTime - b.responseTime;
    });

    const bestConnection = successfulConnections[0];
    console.log(`🎯 Best connection selected: ${bestConnection.type} (${bestConnection.responseTime}ms)`);

    return {
      bestApiUrl: `${bestConnection.url}/api`,
      bestSignalRUrl: bestConnection.url,
      connectionType: bestConnection.type,
      allResults: results
    };
  }

  // Get current connection info
  getCurrentConnection(): ConnectionResult | null {
    return this.connectionResult;
  }

  // Force re-detection (useful for debugging)
  async forceRedetection(): Promise<ConnectionResult> {
    console.log('🔄 Forcing connection re-detection...');
    this.connectionResult = null;
    return this.detectBestConnection();
  }

  // Get connection status for debugging
  getConnectionStatus() {
    return {
      hasResult: !!this.connectionResult,
      isDetecting: this.isDetecting,
      currentConnection: this.connectionResult,
      isProduction: this.isProductionEnvironment(),
      protocol: window.location.protocol,
      hostname: window.location.hostname
    };
  }
}

export const connectionDetector = ConnectionDetector.getInstance(); 