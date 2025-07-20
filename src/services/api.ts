import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import { toast } from '../components/ui/use-toast';
import { signalRService } from './signalr';
import { connectionDetector } from './connectionDetector';

// Declare global variable for API base URL
declare global {
  const __API_BASE_URL__: string;
}

// Define API response types
export interface ApiResponse<T = unknown> {
  data?: T;
  error?: {
    message: string;
    code?: string | number;
    details?: unknown;
  };
}

// Interface for playlist item
export interface PlaylistItem {
  url: string;
  format: string;
  quality: string;
}

// Interface for playlist task status
export interface PlaylistTaskStatus {
  task_id: string;
  status: string;
  progress: number;
  completed_items: number;
  total_items: number;
  current_item?: string;
  download_url?: string;
  error?: string;
}

// Map frontend routes to backend platform identifiers
const platformMap: Record<string, string> = {
  // Standard video platforms
  'youtube-downloader': 'youtube',
  'tiktok-downloader': 'tiktok',
  'instagram-downloader': 'instagram',
  'twitter-downloader': 'twitter',
  'vimeo-downloader': 'vimeo',
  'facebook-downloader': 'facebook',
  'twitch-downloader': 'twitch',
  'reddit-downloader': 'reddit',
  
  // Adult video platforms
  'pornhub-downloader': 'pornhub',
  'xvideos-downloader': 'xvideos',
  'xhamster-downloader': 'xhamster',
  'redgifs-downloader': 'redgifs',
  'youporn-downloader': 'youporn',
  'spankbang-downloader': 'spankbang',
};

// Simple API service that uses connection detector
class ApiService {
  private apiInstance: AxiosInstance | null = null;

  async getApi(): Promise<AxiosInstance> {
    if (!this.apiInstance) {
      await this.initializeApi();
    }
    return this.apiInstance!;
  }

  private async initializeApi() {
    const connection = await connectionDetector.detectBestConnection();
    
    console.log('🔗 Initializing API with URL:', connection.bestApiUrl);
    
    this.apiInstance = axios.create({
      baseURL: connection.bestApiUrl,
      timeout: 600000, // 10 minutes for video processing
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    if (!this.apiInstance) return;

    // Request interceptor
    this.apiInstance.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('auth_token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor
    this.apiInstance.interceptors.response.use(
      (response: AxiosResponse) => {
        if (response.config.responseType === 'blob') {
          return response;
        }
        return response.data;
      },
      (error: AxiosError) => {
        if (error.response) {
          const errorData = error.response.data as { detail?: string; message?: string; };
          const errorMessage = errorData?.detail || errorData?.message || 'An error occurred';
          
          toast({
            title: 'Error',
            description: errorMessage,
            variant: 'destructive',
          });
          
          return Promise.reject({
            message: errorMessage,
            code: error.response.status,
            details: errorData,
          });
        } else if (error.request) {
          const errorMessage = 'No response from server. Please check your connection.';
          
          toast({
            title: 'Connection Error',
            description: errorMessage,
            variant: 'destructive',
          });
          
          return Promise.reject({
            message: errorMessage,
            code: 'NO_RESPONSE',
          });
        } else {
          return Promise.reject({
            message: error.message || 'An unexpected error occurred',
            code: 'REQUEST_ERROR',
          });
        }
      }
    );
  }
}

// Create singleton instance
const apiService = new ApiService();

// Helper function to get API instance
export const getApi = async () => {
  return await apiService.getApi();
};

// Helper function to handle file downloads
const downloadFile = (data: Blob, fileName: string) => {
  const url = window.URL.createObjectURL(data);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', fileName);
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
};

// Download service
export const downloadService = {
  /**
   * Download media from a platform
   */
  async downloadMedia(
    platformRoute: string, 
    url: string, 
    format: string = 'mp4',
    quality: string = 'best',
    onProgress?: (progress: number) => void,
    options: {
      removeWatermark?: boolean,
      directDownload?: boolean,
      useCloudStorage?: boolean,
      [key: string]: unknown
    } = {}
  ) {
    try {
      const platform = platformMap[platformRoute];
      if (!platform) {
        console.error(`Invalid platform route: ${platformRoute}`);
        throw new Error(`Unsupported platform: ${platformRoute}`);
      }

      const api = await getApi();
      
      // Prepare request data
      const requestData = {
        url,
        format,
        quality,
        removeWatermark: options.removeWatermark || false,
        directDownload: options.directDownload || false,
        ...options
      };

      // Handle cloud storage upload
      if (options.useCloudStorage) {
        console.log('📤 Uploading to cloud storage...');
        
        const requestData = {
          url,
          format,
          quality,
          removeWatermark: options.removeWatermark || false,
          customKey: options.customKey,
          makePublic: options.makePublic || false,
          retentionHours: options.retentionHours || 24,
          ...options
        };

        // Request cloud storage upload
        const response = await api.post('/cloudstorage/download-and-upload', requestData);
        
        if (!response.data || !response.data.success) {
          throw new Error(response.data?.message || 'Cloud storage upload failed');
        }

        return {
          success: true,
          downloadUrl: response.data.downloadUrl,
          fileKey: response.data.fileKey,
          message: 'File uploaded to cloud storage successfully'
        };
      }

      // Determine the correct endpoint based on platform
      let endpoint: string;
      const supportedMediaPlatforms = ['instagram', 'facebook', 'reddit'];
      
      if (supportedMediaPlatforms.includes(platform)) {
        // Use /media endpoint for platforms that support multi-media posts
        endpoint = `/download/${platform}/media`;
      } else {
        // Use standard platform endpoint for single media platforms
        endpoint = `/download/${platform}`;
      }

      // Handle direct download
      if (options.directDownload) {
        console.log('⬇️ Starting direct download...');
        
        const response = await api.post(endpoint, requestData, {
          responseType: 'blob',
          onDownloadProgress: (progressEvent) => {
            if (progressEvent.total) {
              const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
              onProgress?.(progress);
            }
          }
        });

        // Return the blob so the calling component can handle it properly
        return response.data;
      }

      // Handle regular download with progress tracking
      console.log('🔄 Starting download with progress tracking...');
      
      const response = await api.post(endpoint, requestData);
      
      if (!response.data || !response.data.success) {
        throw new Error(response.data?.message || 'Download failed');
      }

      // Start SignalR connection for progress updates
      await signalRService.startConnection();
      
      return {
        success: true,
        taskId: response.data.taskId,
        message: 'Download started successfully'
      };

    } catch (error) {
      console.error('Download error:', error);
      throw error;
    }
  },

  /**
   * Create a batch download for playlist items
   */
  async createPlaylistDownload(
    items: PlaylistItem[], 
    outputFormat?: string
  ): Promise<{ batchId: string }> {
    try {
      const api = await getApi();
      
      const response = await api.post('/download/playlist', {
        items,
        outputFormat: outputFormat || 'mp4'
      });

      if (!response.data || !response.data.success) {
        throw new Error(response.data?.message || 'Failed to create playlist download');
      }

      return { batchId: response.data.batchId };
    } catch (error) {
      console.error('Playlist download creation error:', error);
      throw error;
    }
  },

  /**
   * Get playlist download status
   */
  async getPlaylistStatus(batchId: string): Promise<PlaylistTaskStatus> {
    try {
      const api = await getApi();
      
      const response = await api.get(`/download/playlist/${batchId}/status`);
      return response.data;
    } catch (error) {
      console.error('Get playlist status error:', error);
      throw error;
    }
  },

  /**
   * Download playlist with progress tracking
   */
  async downloadPlaylist(batchId: string, onProgress?: (progress: number) => void): Promise<void> {
    try {
      const api = await getApi();
      
      const response = await api.post(`/download/playlist/${batchId}/download`, {}, {
        responseType: 'blob',
        onDownloadProgress: (progressEvent) => {
          if (progressEvent.total) {
            const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            onProgress?.(progress);
          }
        }
      });

      // Extract filename from response headers
      const contentDisposition = response.headers['content-disposition'];
      let fileName = `playlist.zip`;
      
      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/);
        if (filenameMatch && filenameMatch[1]) {
          fileName = filenameMatch[1].replace(/['"]/g, '');
        }
      }

      downloadFile(response.data, fileName);
    } catch (error) {
      console.error('Playlist download error:', error);
      throw error;
    }
  },

  /**
   * Get media items from a post (for Instagram, etc.)
   */
  async getPostMediaItems(platform: string, url: string, options?: { instagramCookies?: string }) {
    try {
      const api = await getApi();
      
      const response = await api.post(`/download/${platform}/media`, {
        url,
        getMediaItems: true,
        instagramCookies: options?.instagramCookies
      });

      if (!response.data || !response.data.success) {
        throw new Error(response.data?.message || 'Failed to get media items');
      }

      return response.data.mediaItems || [];
    } catch (error) {
      console.error('Get media items error:', error);
      throw error;
    }
  },

  /**
   * Validate URL format
   */
  async validateUrl(url: string) {
    try {
      const api = await getApi();
      
      const response = await api.post('/validate/url', { url });
      return response.data;
    } catch (error) {
      console.error('URL validation error:', error);
      throw error;
    }
  },

  /**
   * Detect platform from URL
   */
  detectPlatform(url: string): string {
    const urlLower = url.toLowerCase();
    
    if (urlLower.includes('youtube.com') || urlLower.includes('youtu.be')) return 'youtube';
    if (urlLower.includes('tiktok.com')) return 'tiktok';
    if (urlLower.includes('instagram.com')) return 'instagram';
    if (urlLower.includes('twitter.com') || urlLower.includes('x.com')) return 'twitter';
    if (urlLower.includes('vimeo.com')) return 'vimeo';
    if (urlLower.includes('facebook.com') || urlLower.includes('fb.com')) return 'facebook';
    if (urlLower.includes('twitch.tv')) return 'twitch';
    if (urlLower.includes('reddit.com')) return 'reddit';
    if (urlLower.includes('pornhub.com')) return 'pornhub';
    if (urlLower.includes('xvideos.com')) return 'xvideos';
    if (urlLower.includes('xhamster.com')) return 'xhamster';
    if (urlLower.includes('redgifs.com')) return 'redgifs';
    if (urlLower.includes('youporn.com')) return 'youporn';
    if (urlLower.includes('spankbang.com')) return 'spankbang';
    
    return 'unknown';
  },

  /**
   * Download YouTube video
   */
  async downloadYouTubeVideo(url: string, format: string = 'mp4', quality: string = 'best') {
    try {
      const api = await getApi();
      
      const requestPayload = {
        url,
        format,
        quality
      };

      const response = await api.post('/download/youtube', requestPayload);
      
      if (!response.data || !response.data.success) {
        throw new Error(response.data?.message || 'Failed to download YouTube video');
      }

      // The backend returns JSON with download information, not a blob
      return response.data;
    } catch (error) {
      console.error('YouTube download error:', error);
      throw error;
    }
  },

  /**
   * Get YouTube playlist items
   */
  async getYouTubePlaylistItems(url: string, format: string = 'mp4', quality: string = 'best') {
    try {
      const api = await getApi();
      
      const requestPayload = {
        url,
        format,
        quality
      };

      const response = await api.post('/download/youtube/playlist', requestPayload);
      
      if (!response.data || !response.data.success) {
        throw new Error(response.data?.message || 'Failed to get playlist items');
      }

      // The backend returns the full response object, not just items
      return response.data;
    } catch (error) {
      console.error('YouTube playlist error:', error);
      throw error;
    }
  },

  /**
   * Upload file to cloud storage
   */
  async uploadToCloudStorage(filePath: string, options?: {
    customKey?: string;
    makePublic?: boolean;
    retentionHours?: number;
  }) {
    try {
      const api = await getApi();
      
      const response = await api.post('/cloudstorage/upload', {
        filePath,
        customKey: options?.customKey,
        makePublic: options?.makePublic || false,
        retentionHours: options?.retentionHours || 24
      });

      if (!response.data || !response.data.success) {
        throw new Error(response.data?.message || 'Cloud storage upload failed');
      }

      return {
        success: true,
        downloadUrl: response.data.downloadUrl,
        fileKey: response.data.fileKey
      };
    } catch (error) {
      console.error('Cloud storage upload error:', error);
      throw error;
    }
  },

  /**
   * Get cloud storage status
   */
  async getCloudStorageStatus() {
    try {
      const api = await getApi();
      
      const response = await api.get('/cloudstorage/status');
      return response.data;
    } catch (error) {
      console.error('Cloud storage status error:', error);
      throw error;
    }
  },

  /**
   * Delete file from cloud storage
   */
  async deleteFromCloudStorage(fileKey: string) {
    try {
      const api = await getApi();
      
      const response = await api.delete(`/cloudstorage/delete/${fileKey}`);
      
      if (!response.data || !response.data.success) {
        throw new Error(response.data?.message || 'Failed to delete file from cloud storage');
      }

      return {
        success: true,
        message: 'File deleted from cloud storage successfully'
      };
    } catch (error) {
      console.error('Cloud storage delete error:', error);
      throw error;
    }
  }
};
