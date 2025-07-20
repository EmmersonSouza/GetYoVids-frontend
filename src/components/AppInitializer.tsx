import React, { useEffect, useState } from 'react';
import { connectionDetector } from '../services/connectionDetector';

interface AppInitializerProps {
  children: React.ReactNode;
}

export const AppInitializer: React.FC<AppInitializerProps> = ({ children }) => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [isDetecting, setIsDetecting] = useState(true);
  const [connectionInfo, setConnectionInfo] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initializeApp = async () => {
      try {
        console.log('🚀 Initializing GetYoVids application...');
        setIsDetecting(true);
        
        // Detect the best connection
        const connection = await connectionDetector.detectBestConnection();
        
        console.log('✅ Connection detection completed:', connection);
        setConnectionInfo(connection);
        setIsInitialized(true);
        
        // Log connection details
        console.log('🔗 Using connection:', {
          type: connection.connectionType,
          apiUrl: connection.bestApiUrl,
          signalRUrl: connection.bestSignalRUrl,
          allResults: connection.allResults
        });
        
      } catch (err) {
        console.error('❌ App initialization failed:', err);
        setError(err instanceof Error ? err.message : 'Initialization failed');
        setIsInitialized(true); // Still set to true so app can show error
      } finally {
        setIsDetecting(false);
      }
    };

    initializeApp();
  }, []);

  // Show loading state
  if (isDetecting) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            Connecting to GetYoVids...
          </h2>
          <p className="text-gray-600">
            Testing available connections...
          </p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-pink-100">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            Connection Error
          </h2>
          <p className="text-gray-600 mb-4">
            {error}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Retry Connection
          </button>
        </div>
      </div>
    );
  }

  // Show success state and render children
  if (isInitialized) {
    return (
      <>
        {/* Connection status indicator (optional) */}
        {connectionInfo && (
          <div className="fixed top-4 right-4 z-50">
            <div className="bg-green-100 border border-green-400 text-green-700 px-3 py-1 rounded-full text-sm">
              ✅ {connectionInfo.connectionType}
            </div>
          </div>
        )}
        {children}
      </>
    );
  }

  // Fallback
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-gray-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Loading...</p>
      </div>
    </div>
  );
}; 