import * as signalR from '@microsoft/signalr';
import { toast } from '../components/ui/use-toast';

interface BatchProgressData {
  percentage: number;
  message: string;
}

interface BatchCompletionResult {
  downloadUrl?: string;
  success: boolean;
  message?: string;
  fileId?: string;
}

class SignalRService {
  private connection: signalR.HubConnection | null = null;
  private baseUrl: string = 'https://185.165.169.153:5001';
  private isConnecting: boolean = false;
  private reconnectAttempts: number = 0;
  private maxReconnectAttempts: number = 5;
  private reconnectDelay: number = 2000; // 2 seconds

  // Callbacks
  private progressCallbacks: Map<string, (progress: BatchProgressData) => void> = new Map();
  private errorCallbacks: Map<string, (error: string) => void> = new Map();
  private completionCallbacks: Map<string, (result: BatchCompletionResult) => void> = new Map();

  constructor() {
    this.initializeConnection();
  }

  private initializeConnection() {
    if (this.connection) {
      return;
    }

    this.connection = new signalR.HubConnectionBuilder()
      .withUrl(`${this.baseUrl}/hubs/downloads`)
      .withAutomaticReconnect({
        nextRetryDelayInMilliseconds: (retryContext) => {
          if (retryContext.elapsedMilliseconds < 60000) { // 1 minute of total retry time
            return Math.min(1000 * Math.pow(2, retryContext.previousRetryCount), 10000);
          }
          return null; // Stop retrying after 1 minute
        },
      })
      .configureLogging(signalR.LogLevel.Warning)
      .build();

    this.setupEventHandlers();
  }

  private setupEventHandlers() {
    if (!this.connection) return;

    this.connection.on('BatchProgressUpdate', (batchId: string, progress: BatchProgressData) => {
      const callback = this.progressCallbacks.get(batchId);
      if (callback) {
        callback(progress);
      }
    });

    this.connection.on('BatchError', (batchId: string, error: { message: string }) => {
      const callback = this.errorCallbacks.get(batchId);
      if (callback) {
        callback(error.message || 'An error occurred');
      }
      this.cleanupCallbacks(batchId);
    });

    this.connection.on('BatchCompleted', (batchId: string, result: BatchCompletionResult) => {
      const callback = this.completionCallbacks.get(batchId);
      if (callback) {
        callback(result);
      }
      this.cleanupCallbacks(batchId);
    });

    this.connection.onclose(async () => {
      console.log('SignalR connection closed');
      await this.reconnect();
    });
  }

  private async reconnect() {
    if (this.isConnecting || this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.log('Max reconnection attempts reached');
      return;
    }

    this.isConnecting = true;
    this.reconnectAttempts++;

    try {
      await this.startConnection();
      console.log('Successfully reconnected to SignalR hub');
      this.reconnectAttempts = 0; // Reset counter on successful reconnect
    } catch (error) {
      console.error('Failed to reconnect to SignalR hub:', error);
      // Schedule next reconnection attempt
      setTimeout(() => this.reconnect(), this.reconnectDelay);
    } finally {
      this.isConnecting = false;
    }
  }

  private cleanupCallbacks(batchId: string) {
    // Remove callbacks after they're no longer needed
    setTimeout(() => {
      this.progressCallbacks.delete(batchId);
      this.errorCallbacks.delete(batchId);
      this.completionCallbacks.delete(batchId);
    }, 5000); // Wait 5 seconds before cleaning up
  }

  public async startConnection() {
    if (!this.connection) {
      this.initializeConnection();
    }

    if (this.connection?.state === signalR.HubConnectionState.Disconnected) {
      try {
        await this.connection.start();
        console.log('SignalR Connected');
      } catch (err) {
        console.error('Error starting SignalR connection:', err);
        throw err;
      }
    }
  }

  public async stopConnection() {
    if (this.connection && this.connection.state !== signalR.HubConnectionState.Disconnected) {
      try {
        await this.connection.stop();
        console.log('SignalR connection stopped');
      } catch (err) {
        console.error('Error stopping SignalR connection:', err);
      }
    }
  }

  public async joinBatchGroup(batchId: string) {
    // Validate batchId to prevent null/undefined values from being sent to the SignalR hub
    if (!batchId) {
      console.warn('Cannot join batch group: batchId is null or undefined');
      return;
    }

    if (this.connection?.state === signalR.HubConnectionState.Connected) {
      try {
        await this.connection.invoke('JoinBatchGroup', batchId);
      } catch (error) {
        console.error('Error joining batch group:', error);
        throw error;
      }
    } else {
      console.warn('Cannot join batch group: SignalR connection not established');
    }
  }

  public onBatchProgress(batchId: string, callback: (progress: BatchProgressData) => void) {
    this.progressCallbacks.set(batchId, callback);
  }

  public onBatchError(batchId: string, callback: (error: string) => void) {
    this.errorCallbacks.set(batchId, callback);
  }

  public onBatchCompleted(batchId: string, callback: (result: BatchCompletionResult) => void) {
    this.completionCallbacks.set(batchId, callback);
  }

  public removeBatchListeners(batchId: string) {
    this.progressCallbacks.delete(batchId);
    this.errorCallbacks.delete(batchId);
    this.completionCallbacks.delete(batchId);
  }
}

export const signalRService = new SignalRService();

// Start the connection when the service is imported
if (typeof window !== 'undefined') {
  signalRService.startConnection().catch(err => {
    console.error('Failed to start SignalR connection:', err);
  });
}
