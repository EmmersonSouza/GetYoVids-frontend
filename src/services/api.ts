import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import { toast } from '../components/ui/use-toast';
import { signalRService } from './signalr';
import { apiUrl } from '../config/environment';

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

// Get API base URL from environment configuration
const getApiBaseUrl = () => {
  return apiUrl;
};

// Create axios instance with base config for the new C# backend
const api: AxiosInstance = axios.create({
  baseURL: getApiBaseUrl(),
  timeout: 600000, // 10 minutes for video processing
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for API calls
api.interceptors.request.use(
  (config) => {
    // Add auth token if available
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for API calls
api.interceptors.response.use(
  (response: AxiosResponse) => {
    // Handle file downloads (blob responses)
    if (response.config.responseType === 'blob') {
      return response;
    }
    
    // Handle standard JSON responses
    return response.data;
  },
  (error: AxiosError) => {
    // Handle errors
    if (error.response) {
      // Server responded with a status code outside 2xx
      const errorData = error.response.data as { detail?: string; message?: string; };
      const errorMessage = errorData?.detail || errorData?.message || 'An error occurred';
      
      // Show error toast
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
      // Request was made but no response received
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
      // Something happened in setting up the request
      return Promise.reject({
        message: error.message || 'An unexpected error occurred',
        code: 'REQUEST_ERROR',
      });
    }
  }
);

// Helper function to handle file downloads
const downloadFile = (data: Blob, fileName: string) => {
  // Use the Blob directly without re-wrapping it
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
        toast({
          title: 'Configuration Error',
          description: 'The application is not configured correctly for this download source.',
          variant: 'destructive',
        });
        throw new Error(`Invalid platform specified: ${platformRoute}`);
      }

      // Map platform route to appropriate backend endpoint
      const endpoint = `/download/${platform}`;
      
      
      
      
      
      // For cloud storage downloads
      if (options.useCloudStorage) {
        console.log('api.ts: downloadMedia - cloud storage path taken');
        try {
          const requestData = {
            videoUrl: url,
            format: format,
            quality: quality,
            customFileName: `download_${Date.now()}`,
            makePublic: true,
            retentionHours: 24
          };
          
          // Show initial progress
          if (onProgress) onProgress(10);
          
          // Request cloud storage upload
          const response = await api.post('/cloudstorage/download-and-upload', requestData);
          
          if (!response.data || !response.data.success) {
            throw new Error(response.data?.errorMessage || 'Cloud storage upload failed');
          }
          
          // Final progress
          if (onProgress) onProgress(100);
          
          // Return cloud storage result
          return {
            success: true,
            cloudStorage: true,
            publicUrl: response.data.publicUrl,
            fileKey: response.data.fileKey,
            fileName: response.data.fileName,
            fileSize: response.data.fileSize,
            expirationTime: response.data.expirationTime
          };
          
        } catch (error) {
          console.error('Cloud storage download failed:', error);
          throw error;
        }
      }
      
      // For direct downloads, we'll use a different approach
      if (options.directDownload) {
        console.log('api.ts: downloadMedia - directDownload path taken');
        try {
          const requestData = {
            Url: url,
            Format: format,
            Quality: quality,
            RemoveWatermark: options.removeWatermark || false,
            DirectDownload: true
          };
          
          // Show initial progress
          if (onProgress) onProgress(10);
          
          // Request the file as a blob
          const response = await api.post(endpoint, requestData, { 
            responseType: 'blob',
            onDownloadProgress: (progressEvent) => {
              if (onProgress && progressEvent.total) {
                const progress = Math.round((progressEvent.loaded / progressEvent.total) * 90) + 10;
                onProgress(Math.min(progress, 99)); // Cap at 99% until fully complete
              }
            }
          });
          
          // Final progress
          if (onProgress) onProgress(100);
          
          // Return the blob directly
          return response.data;
          
        } catch (error) {
          console.error('Direct download failed:', error);
          throw error;
        }
      }
      
      // Standard download flow using SignalR
      try {
        await signalRService.startConnection();
        
        const requestData = {
          Url: url,
          Format: format,
          Quality: quality,
          RemoveWatermark: options.removeWatermark || false,
          DirectDownload: false // Use SignalR flow
        };
        
        const response = await api.post(endpoint, requestData);
        
        // Check if we got a proper response with data
        if (!response.data) {
          throw new Error('Invalid response from server');
        }
        
        const { batchId } = response.data;
        
        if (!batchId) {
          throw new Error('No batch ID returned from server');
        }
        
        // Return a promise that resolves when the download is complete
        return new Promise((resolve, reject) => {
          // Set up progress tracking
          signalRService.onBatchProgress(batchId, (progressData) => {
            if (onProgress) {
              const progress = Math.round(progressData.percentage || 0);
              onProgress(progress);
            }
          });
          
          // Handle completion
          signalRService.onBatchCompleted(batchId, async (result) => {
            if (result.fileId) {
              const downloadUrl = `/download/${result.fileId}`;
              // For batch downloads, open in a new tab or trigger download
              window.open(downloadUrl, '_blank');
              resolve({ success: true, fileId: result.fileId, downloadUrl });
            } else {
              resolve({ success: true, ...result });
            }
          });
          
          // Handle errors
          signalRService.onBatchError(batchId, (error) => {
            console.error('Batch error:', error);
            reject(new Error(error || 'Download failed'));
          });
          
          // Join the SignalR group for this batch
          signalRService.joinBatchGroup(batchId).catch(console.error);
        });
      } catch (error) {
        console.error('SignalR download failed:', error);
        throw error;
      }
    } catch (error) {
      console.error('Download failed:', error);
      throw error;
    }
  },

  

  

  /**
   * Create a playlist download task
   */
  async createPlaylistDownload(
    items: PlaylistItem[], 
    outputFormat?: string
  ): Promise<{ batchId: string }> {
    try {
      await signalRService.startConnection();
      
      const response = await api.post('/download/playlist', { 
        urls: items.map(item => item.url),
        format: outputFormat || 'mp4',
        quality: items[0]?.quality || 'best'
      });
      
      const { batchId } = response.data;
      return { batchId };
    } catch (error) {
      console.error('Failed to create playlist download:', error);
      throw error;
    }
  },

  /**
   * Get playlist download status
   */
  async getPlaylistStatus(batchId: string): Promise<PlaylistTaskStatus> {
    try {
      const response = await api.get(`/download/batch/${batchId}/progress`);
      return response.data;
    } catch (error) {
      console.error('Failed to get playlist status:', error);
      throw error;
    }
  },

  /**
   * Download completed playlist
   */
  async downloadPlaylist(batchId: string, onProgress?: (progress: number) => void): Promise<void> {
    try {
      await signalRService.startConnection();
      
      // Set up progress tracking
      signalRService.onBatchProgress(batchId, (progressData) => {
        if (onProgress) {
          const progress = Math.round(progressData.percentage || 0);
          onProgress(progress);
        }
      });
      
      // Return a promise that resolves when the download is complete
      return new Promise((resolve, reject) => {
        signalRService.onBatchCompleted(batchId, (result) => {
          if (result.fileId) {
            // For direct downloads
            window.open(`/download/${result.fileId}`, '_blank');
          }
          resolve();
        });
        
        signalRService.onBatchError(batchId, (error) => {
          reject(new Error(error || 'Playlist download failed'));
        });
        
        // Join the SignalR group for this batch
        signalRService.joinBatchGroup(batchId).catch(console.error);
      });
    } catch (error) {
      console.error('Failed to download playlist:', error);
      throw error;
    }
  },

  /**
   * Get all media items from a multi-media post (Instagram, Facebook, Reddit)
   * Downloads and returns metadata for individual files that can be downloaded separately
   */
  async getPostMediaItems(platform: string, url: string, options?: { instagramCookies?: string }) {
    try {
      const requestData: any = { Url: url };
      
      // Add Instagram cookies if provided
      if (platform === 'instagram' && options?.instagramCookies) {
        requestData.InstagramCookies = options.instagramCookies;
      }
      
      const response = await api.post(`/download/${platform}/media`, requestData);
      return response;
    } catch (error) {
      console.error('Failed to get post media items:', error);
      throw error;
    }
  },
  
  /**
   * Validate a URL and check if it's a playlist (frontend-only implementation)
   */
  async validateUrl(url: string) {
    try {
      // Check if it's a YouTube playlist
      const youtubePlaylistMatch = url.match(/[&?]list=([a-zA-Z0-9_-]+)/);
      if (youtubePlaylistMatch) {
        return {
          isValid: true,
          isPlaylist: true,
          playlistId: youtubePlaylistMatch[1],
          platform: 'youtube'
        };
      }
      
      // For other URLs, assume they're single videos
      return {
        isValid: true,
        isPlaylist: false,
        platform: this.detectPlatform(url)
      };
    } catch (error) {
      console.error('Failed to validate URL:', error);
      return {
        isValid: false,
        isPlaylist: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  },

  /**
   * Detect platform from URL
   */
  detectPlatform(url: string): string {
    if (url.includes('youtube.com') || url.includes('youtu.be')) return 'youtube';
    if (url.includes('instagram.com')) return 'instagram';
    if (url.includes('tiktok.com')) return 'tiktok';
    if (url.includes('facebook.com')) return 'facebook';
    if (url.includes('reddit.com')) return 'reddit';
    return 'unknown';
  },

  /**
   * Download a single YouTube video with enhanced metadata
   */
  async downloadYouTubeVideo(url: string, format: string = 'mp4', quality: string = 'best') {
    try {
      console.log('🎬 API: downloadYouTubeVideo called with URL:', url, 'Format:', format, 'Quality:', quality);
      
      const requestPayload = { 
        Url: url,
        Format: format,
        Quality: quality
      };
      console.log('🎬 API: Sending single video request payload:', requestPayload);
      
      // Use a longer timeout specifically for video downloads
      const response = await api.post('/download/youtube', requestPayload, {
        timeout: 600000 // 10 minutes for video processing
      });
      
      console.log('🎬 API: Single video response received:', response);
      const data = response.data || response;
      
      console.log('🎬 API: Single video processed data:', data);
      return data;
    } catch (error) {
      console.error('🎬 API: Failed to download YouTube video:', error);
      throw error;
    }
  },

  /**
   * Get YouTube playlist items for individual selection
   */
  async getYouTubePlaylistItems(url: string, format: string = 'mp4', quality: string = 'best') {
    try {
      console.log('🎵 API: getYouTubePlaylistItems called with URL:', url, 'Format:', format, 'Quality:', quality);
      
      const requestPayload = { 
        Url: url,
        Format: format,
        Quality: quality
      };
      console.log('🎵 API: Sending request payload:', requestPayload);
      
      const response = await api.post('/download/youtube/playlist', requestPayload);
      
      console.log('🎵 API: Raw response received:', response);
      console.log('🎵 API: Response type:', typeof response);
      
      // The api service likely returns response.data directly due to axios interceptor
      const data = response.data || response; // Handle both cases
      
      console.log('🎵 API: Processed data:', data);
      console.log('🎵 API: Data type:', typeof data);
      
      if (data) {
        console.log('🎵 API: Data keys:', Object.keys(data));
        console.log('🎵 API: Success status:', data.success);
        console.log('🎵 API: Title:', data.title);
        console.log('🎵 API: Total items:', data.totalItems);
        console.log('🎵 API: Is playlist:', data.isPlaylist);
        console.log('🎵 API: Is auto-downloaded:', data.isAutoDownloaded);
        
        if (data.playlistItems) {
          console.log('🎵 API: Playlist items count:', data.playlistItems.length);
          console.log('🎵 API: First playlist item:', data.playlistItems[0]);
          console.log('🎵 API: All playlist items:', data.playlistItems);
        } else if (data.downloadedFiles) {
          console.log('🎵 API: Downloaded files count:', data.downloadedFiles.length);
          console.log('🎵 API: First downloaded file:', data.downloadedFiles[0]);
          console.log('🎵 API: All downloaded files:', data.downloadedFiles);
        } else {
          console.log('🎵 API: No playlistItems or downloadedFiles property found in data');
          console.log('🎵 API: Available properties:', Object.keys(data));
        }
      } else {
        console.log('🎵 API: Data is null/undefined');
      }
      
      return data;
    } catch (error) {
      console.error('🎵 API: Failed to get YouTube playlist items:', error);
      if (error.response) {
        console.error('🎵 API: Error response status:', error.response.status);
        console.error('🎵 API: Error response data:', error.response.data);
        console.error('🎵 API: Error response headers:', error.response.headers);
      } else if (error.request) {
        console.error('🎵 API: Error request:', error.request);
      } else {
        console.error('🎵 API: Error message:', error.message);
      }
      throw error;
    }
  },

  // Cloud Storage Methods
  async uploadToCloudStorage(filePath: string, options?: {
    customKey?: string;
    makePublic?: boolean;
    retentionHours?: number;
  }) {
    try {
      const response = await api.post('/cloudstorage/upload', {
        filePath,
        customKey: options?.customKey,
        makePublic: options?.makePublic ?? true,
        retentionHours: options?.retentionHours ?? 24
      });
      return response.data;
    } catch (error) {
      console.error('Failed to upload to cloud storage:', error);
      throw error;
    }
  },

  async getCloudStorageStatus() {
    try {
      const response = await api.get('/cloudstorage/status');
      return response.data;
    } catch (error) {
      console.error('Failed to get cloud storage status:', error);
      throw error;
    }
  },

  async deleteFromCloudStorage(fileKey: string) {
    try {
      const response = await api.delete(`/cloudstorage/delete/${fileKey}`);
      return response.data;
    } catch (error) {
      console.error('Failed to delete from cloud storage:', error);
      throw error;
    }
  }
};

// Export the API instance for direct use if needed
export default api;
