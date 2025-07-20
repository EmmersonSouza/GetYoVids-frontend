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
    
    // Define all possible connection URLs (IP only)
    const connections = [
      { url: 'https://185.165.169.153:5001', type: 'https-ip' },
      { url: 'http://185.165.169.153:5000', type: 'http-ip' }
    ];

    // Test all connections in parallel
    const testPromises = connections.map(conn => 
      this.testConnection(conn.url, conn.type)
    );

    const results = await Promise.all(testPromises);
    
    // Find the best successful connection (prioritize by type and response time)
    const successfulConnections = results.filter(r => r.success);
    
    if (successfulConnections.length === 0) {
      console.warn('⚠️ No connections successful, using first URL as fallback');
      const fallbackUrl = connections[0].url;
      return {
        bestApiUrl: `${fallbackUrl}/api`,
        bestSignalRUrl: fallbackUrl,
        connectionType: connections[0].type,
        allResults: results
      };
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
      currentConnection: this.connectionResult
    };
  }
}

export const connectionDetector = ConnectionDetector.getInstance(); 