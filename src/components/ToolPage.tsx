import React, { useState, useEffect, useCallback, useMemo } from "react";
import { Helmet } from "react-helmet-async";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { SidebarItem } from "../config/sidebarConfig";
import { 
  Plus, 
  X, 
  Download, 
  Loader2, 
  AlertCircle, 
  ExternalLink, 
  CheckCircle2, 
  RefreshCw, 
  ListMusic,
  Minus,
  PlusIcon,
  MinusIcon
} from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { isUrlValidForService } from "../utils/urlUtils";
import { downloadService } from "../services/api";
import { signalRService } from "../services/signalr";
import { toast } from "./ui/use-toast";
import { baseUrl } from "../config/environment";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel
} from "./ui/select";
import { Progress } from "./ui/progress";
import AdSpace from "./AdSpace";
import { MonetizedButton } from "./MonetizedButton";
import { getPlatformTypeFromPath } from "../utils/platformConfig";
import { MonetizationInfo } from "./MonetizationInfo";
// import { MonetizationDebug } from "./MonetizationDebug";

type DownloadStatus = 'pending' | 'downloading' | 'completed' | 'error' | 'processing';

type FormatType = 'MP4' | 'MP3' | 'WEBM' | 'M4A' | 'MOV' | 'MKV' | 'FLAC' | 'WAV' | 'OGG' | 'JPG' | 'PNG' | 'WEBP' | 'GIF';

interface QualityOption {
  formatCode: string;
  label: string;
  resolution?: string;
  fileSize?: number;
  isAudioOnly: boolean;
  isVideoOnly: boolean;
}

interface FormatInfo {
  title: string;
  duration?: number;
  thumbnailUrl?: string;
  formats: string[]; // e.g., ["mp4", "webm", "mp3"]
  qualities: QualityOption[];
  isPlaylist: boolean;
  playlistCount?: number;
  errorMessage?: string;
}

interface VideoInfo {
  url: string;
  title: string;
  duration?: number;
  thumbnail?: string;
  formats: QualityOption[]; // This will now be a list of QualityOption
  best_audio?: QualityOption;
  best_video?: QualityOption;
  best_combined?: QualityOption;
  _type?: string; // 'playlist' | 'video' | 'audio'
  entries?: VideoInfo[]; // For playlists
}

interface UrlItem {
  id: string;
  value: string;
  error?: string;
  isPlaylist?: boolean;
  playlistId?: string;
  playlistTitle?: string;
  suggestedPath?: string;
  domain?: string;
  selectedFormat?: string;
  message?: string;
  removeWatermark?: boolean;
}

interface MediaItem {
  id: string;
  url: string;
  title: string;
  thumbnailUrl?: string;
  mediaType: string; // 'image' or 'video'
  resolution?: string;
  fileSize: number;
  suggestedFormat: string; // 'jpg' for images, 'mp4' for videos
  displayName: string;
  platform: string;
}

interface DownloadItem {
  id: string;
  url: string;
  status: DownloadStatus;
  progress: number;
  error?: string;
  downloadUrl?: string;
  fileName?: string;
  fileSize?: number;
  format?: string;
  quality?: string;
  formatInfo?: FormatInfo;
  availableFormats?: VideoInfo;
  isPlaylistItem?: boolean;
  playlistTitle?: string;
  title?: string;
  removeWatermark?: boolean;
  thumbnailUrl?: string; // Direct thumbnail URL from backend
  // New properties for multi-media posts
  mediaItem?: MediaItem;
  isFromMultiMediaPost?: boolean;
  postTitle?: string;
  // Cloud storage properties
  cloudStorage?: boolean;
  fileKey?: string;
  expirationTime?: string;
}

interface ToolPageProps {
  title: string;
  description: string;
  placeholder?: string;
  buttonText?: string;
  showFormatOptions?: boolean;
}

export const ToolPage: React.FC<ToolPageProps> = ({
  title,
  description,
  placeholder = "Paste your video URL here...",
  buttonText = "Download it",
  showFormatOptions = true
}: ToolPageProps) => {
  // State management
  const [urls, setUrls] = useState<UrlItem[]>(() => [{ 
    id: Math.random().toString(36).substring(2, 11), 
    value: '', 
    isPlaylist: false 
  }]);
  const [isLoading, setIsLoading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [batchId, setBatchId] = useState<string | null>(null);
  const [playlistInfo, setPlaylistInfo] = useState<VideoInfo | null>(null);
  const [downloads, setDownloads] = useState<DownloadItem[]>([]);
  const [selectedFormat, setSelectedFormat] = useState<string>('mp4');
  const [monetizationKey, setMonetizationKey] = useState(0);
  const [availableFormatsAndQualities, setAvailableFormatsAndQualities] = useState<FormatInfo | null>(() => ({
    title: "",
    formats: ["mp4", "mp3", "webm", "m4a", "mov", "mkv", "flac", "wav", "ogg", "jpg", "png", "webp", "gif"], // Common formats including images
    qualities: [], // Add empty qualities array to satisfy the interface
    isPlaylist: false,
  }));
  
  // Instagram cookie helper state
  const [showCookieHelper, setShowCookieHelper] = useState(false);
  const [instagramCookies, setInstagramCookies] = useState<string>('');
  
  // Local temp storage is the default - files are served from temp directory

  const location = useLocation();
  const navigate = useNavigate();
  const currentPath = location.pathname.replace(/^\//, '');

  // Helper function to detect if a platform supports multi-media posts OR playlist breakdown
  const isMultiMediaPlatform = (url: string): string | null => {
    if (url.includes('instagram.com')) return 'instagram';
    if (url.includes('facebook.com') || url.includes('fb.com')) return 'facebook';
    if (url.includes('reddit.com')) return 'reddit';
    return null;
  };

  // Helper function to detect YouTube playlists
  const isYouTubePlaylist = (url: string): { isPlaylist: boolean; playlistId?: string } => {
    console.log('🔍 Checking if URL is YouTube playlist:', url);
    
    if (url.includes('youtube.com') || url.includes('youtu.be')) {
      console.log('🔍 URL contains YouTube domain');
      const playlistMatch = url.match(/[&?]list=([a-zA-Z0-9_-]+)/);
      console.log('🔍 Playlist regex match result:', playlistMatch);
      
      const result = {
        isPlaylist: !!playlistMatch,
        playlistId: playlistMatch ? playlistMatch[1] : undefined
      };
      console.log('🔍 isYouTubePlaylist result:', result);
      return result;
    }
    
    console.log('🔍 URL is not from YouTube');
    return { isPlaylist: false };
  };

  // Check if the current route is a multi-media platform (hide format selector by default)
  const isMultiMediaRoute = (): boolean => {
    const currentPath = window.location.pathname;
    return currentPath.includes('/instagram-downloader') ||
           currentPath.includes('/tiktok-downloader') ||
           currentPath.includes('/reddit-downloader');
  };

  // Check if format selector should be hidden (either by route or by URL detection)
  const shouldHideFormatSelector = useMemo(() => {
    // Hide by default for multi-media routes (Instagram, TikTok, Reddit)
    if (isMultiMediaRoute()) {
      return true;
    }
    
    // Hide if we detect non-YouTube multi-media URLs
    return urls.some(url => {
      const multiMediaPlatform = isMultiMediaPlatform(url.value);
      // Only hide for non-YouTube multi-media platforms (Instagram, Facebook, Reddit)
      // YouTube should show format selector like TikTok
      return multiMediaPlatform && !url.value.includes('youtube.com') && !url.value.includes('youtu.be');
    });
  }, [urls]);

  // Add a new URL field
  const addUrlField = useCallback(() => {
    setUrls([...urls, { id: generateUniqueId(), value: '', isPlaylist: false }]);
  }, [urls]);

  

  // Handle URL input change
  const handleUrlChange = useCallback((id: string, value: string) => {
    setUrls(prevUrls => {
      const newUrls = prevUrls.map(url => {
        if (url.id === id) {
          const isValid = isUrlValidForService(value, currentPath);
          return {
            ...url,
            value,
            error: isValid ? undefined : `This URL is not supported on the ${currentPath || 'current'} downloader`
          };
        }
        return url;
      });
      return newUrls;
    });
  }, [currentPath]);

  // Format options for the format selector
  

  // Check if any URL is valid for submission
  const hasValidUrls = urls.some(url => 
    url.value.trim() !== '' && !url.error && isUrlValidForService(url.value, currentPath)
  );



  

  

  // Remove a URL input field
  const removeUrlField = useCallback((id: string) => {
    if (urls.length > 1) {
      setUrls(prevUrls => prevUrls.filter(url => url.id !== id));
    }
  }, [urls]);

  // Handle format selection change
  const handleFormatChange = useCallback((value: string) => {
    setSelectedFormat(value as FormatType);
    // Reset quality when format changes
  }, []);

  

  // Handle downloading individual items from the queue
  const handleItemDownload = useCallback(async (item: DownloadItem) => {
    if (item.status === 'completed' && item.downloadUrl) {
      // File is already downloaded and ready, download it to user's computer
      try {
        const response = await fetch(resolveDownloadUrl(item.downloadUrl));
        if (!response.ok) throw new Error('Failed to fetch file');
        
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = item.fileName || `${item.title || 'download'}.${item.format || 'mp4'}`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        a.remove();

        toast({
          title: 'Downloaded!',
          description: `${item.fileName || item.title} saved to your downloads folder`,
        });
      } catch (error) {
        console.error('Download failed:', error);
        toast({
          title: 'Download Failed',
          description: 'Failed to download file. The file may have expired.',
          variant: 'destructive',
        });
      }
      return;
    }

    // Update item status to downloading
    setDownloads(prev =>
      prev.map(d =>
        d.id === item.id
          ? { ...d, status: 'downloading', progress: 0, error: undefined }
          : d
      )
    );

    try {
      const progressHandler = (progress: number) => {
        setDownloads(prev =>
          prev.map(d =>
            d.id === item.id
              ? { ...d, progress }
              : d
          )
        );
      };

      // Download the individual media item
      const result = await downloadService.downloadMedia(
        currentPath,
        item.url,
        item.format || 'mp4',
        'best',
        progressHandler,
        { 
          directDownload: false,
          useCloudStorage: true
        }
      );

      if (result instanceof Blob) {
        const url = window.URL.createObjectURL(result);
        const fileExt = item.format || (item.mediaItem?.mediaType === 'image' ? 'jpg' : 'mp4');
        const fileName = `${item.title || 'download'}.${fileExt}`;

        setDownloads(prev =>
          prev.map(d =>
            d.id === item.id
              ? {
                  ...d,
                  progress: 100,
                  status: 'completed',
                  downloadUrl: url,
                  fileName
                }
              : d
          )
        );

        toast({
          title: 'Download Ready',
          description: `${item.title} is ready for download`,
        });
      } else {
        // Handle other result types
        toast({
          title: 'Download Ready',
          description: `${item.title} is ready for download`,
        });
      }
    } catch (error) {
      setDownloads(prev =>
        prev.map(d =>
          d.id === item.id
            ? { ...d, status: 'error', error: (error as Error)?.message || 'Download failed' }
            : d
        )
      );

      toast({
        title: 'Download Failed',
        description: (error as Error)?.message || 'Download failed',
        variant: 'destructive',
      });
    }
  }, [currentPath]);

  // Handle file download (for legacy downloads)
  const handleFileDownload = useCallback(async (download: DownloadItem) => {
    try {
      // Check if we have a cloud storage URL
      if (download.cloudStorage && download.downloadUrl && download.downloadUrl.startsWith('http')) {
        // Cloud storage URL - open in new tab
        window.open(download.downloadUrl, '_blank');
        toast({
          title: 'Cloud Storage',
          description: 'File opened from cloud storage',
          variant: 'default',
        });
        return;
      }
      
      // Local storage URL - download normally
      if (!download.downloadUrl) return;
      
      const response = await fetch(resolveDownloadUrl(download.downloadUrl));
      if (!response.ok) throw new Error('Failed to download file');
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = download.fileName || 'download';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      a.remove();
      
      toast({
        title: 'Downloaded!',
        description: `${download.fileName || 'File'} saved to your downloads folder`,
      });
      
      // Reset monetization after successful file download to require 2 clicks for next download
      console.log('🔄 Resetting monetization after file download completed');
      setTimeout(() => {
        localStorage.removeItem('monetization_click_count');
        localStorage.removeItem('monetization_is_complete');
        localStorage.removeItem('monetization_platform_type');
        localStorage.removeItem('monetization_is_conversion');
        setMonetizationKey(prev => prev + 1);
      }, 100); // Small delay to ensure download completes
    } catch (error) {
      console.error('Download failed:', error);
      toast({
        title: 'Download Failed',
        description: 'Failed to download file',
        variant: 'destructive',
      });
    }
  }, []);

  // In useEffect for SignalR, remove all direct references to signalRService.connection
  // and use only public methods. Also, use correct method names and signatures.
  useEffect(() => {
    if (!batchId) return;

    const handleBatchProgress = (progress: { percentage: number }) => {
      const percent = Math.round(progress.percentage || 0);
      setDownloadProgress(percent);
    };

    const handleBatchCompleted = (result: { success: boolean; message?: string }) => {
      setDownloadProgress(100);
      toast({
        title: 'Batch Download Complete',
        description: result.success ? 'Successfully downloaded playlist.' : (result.message || 'Some items failed.'),
        variant: result.success ? 'default' : 'destructive',
      });
      setBatchId(null);
      signalRService.removeBatchListeners(batchId);
    };

    const handleBatchError = (error: string) => {
      toast({
        title: 'Batch Error',
        description: error,
        variant: 'destructive',
      });
      signalRService.removeBatchListeners(batchId);
    };

    signalRService.onBatchProgress(batchId, handleBatchProgress);
    signalRService.onBatchError(batchId, handleBatchError);
    signalRService.onBatchCompleted(batchId, handleBatchCompleted);

    return () => {
      signalRService.removeBatchListeners(batchId);
    };
  }, [batchId]);

  // Helper to generate unique IDs
  const generateUniqueId = (): string => {
    return Math.random().toString(36).substring(2, 11);
  };

  // Helper to resolve download URLs - converts relative backend URLs to absolute URLs
  const resolveDownloadUrl = (url: string): string => {
    if (url.startsWith('/api/')) {
      // Use the environment configuration
      return `${baseUrl}${url}`;
    }
    return url;
  };



  // Add a helper function to retry a single download
  const retryDownload = async (item: DownloadItem) => {
    if (!item.url) return;
    
    try {
      // Update download status to show we're downloading
      setDownloads(prev => 
        prev.map(i => 
          i.id === item.id
            ? { ...i, status: 'downloading', progress: 0, error: undefined }
            : i
        )
      );
      
      
      
      // Create a progress update handler
      const progressHandler = (progress: number) => {
        // Update download progress
        setDownloads(prev => 
          prev.map(i => 
            i.id === item.id
              ? { ...i, progress }
              : i
          )
        );
      };
      
      // Start the download with directDownload: true
      const platformRoute = `${currentPath}`;
      const format = item.format || selectedFormat.toLowerCase();
      const quality = 'best';
      const options = {
        removeWatermark: item.removeWatermark || false,
        directDownload: true // Enable direct file download
      };
      
      // Call downloadMedia with separate arguments (not an object)
      try {
        const result = await downloadService.downloadMedia(
          platformRoute,
          item.url,
          format,
          quality,
          progressHandler,
          options
        );
        // Process the result
        if (result instanceof Blob) {
          // Create a download URL for the blob but don't automatically download
          const url = window.URL.createObjectURL(result);
          const fileExt = format || 'mp4';
          
          // Update download status to completed with downloadUrl available
          setDownloads(prev => 
            prev.map(i => 
              i.id === item.id
                ? { 
                    ...i, 
                    progress: 100, 
                    status: 'completed',
                    downloadUrl: url,
                    fileName: `download.${fileExt}`
                  }
                : i
            )
          );
          
          toast({
            title: 'Download Ready',
            description: 'File is ready for download',
            variant: "default",
          });
          
          // Reset monetization after successful retry download
          console.log('🔄 Resetting monetization after retry download');
          localStorage.removeItem('monetization_click_count');
          localStorage.removeItem('monetization_is_complete');
          localStorage.removeItem('monetization_platform_type');
          localStorage.removeItem('monetization_is_conversion');
        } else {
          throw new Error('Failed to download file');
        }
      } catch (error) {
        // Update only this specific download to error state
        setDownloads(prev => 
          prev.map(i => 
            i.id === item.id
              ? { 
                  ...i, 
                  status: 'error', 
                  error: (error as Error)?.message || "An unexpected error occurred." 
                }
              : i
          )
        );
        
        toast({
          title: "Download Error",
          description: (error as Error)?.message || "An unexpected error occurred.",
          variant: "destructive",
        });
      }
    } catch (outerError) {
        console.error('Outer download error:', outerError);
        toast({
          title: "Download Error",
          description: "An unexpected error occurred while processing your request.",
          variant: "destructive",
        });
    }
  };

  const handleDownload = async () => {
    console.log('🚀 handleDownload started');
    console.log('🚀 URLs to process:', urls);
    console.log('🚀 Selected format:', selectedFormat);
    console.log('🚀 Current path:', currentPath);
    
    setIsLoading(true);
    setDownloads([]); // Clear previous downloads

    for (const urlItem of urls) {
      if (!urlItem.value.trim() || urlItem.error || !isUrlValidForService(urlItem.value, currentPath)) {
        console.warn(`Skipping invalid URL: ${urlItem.value || 'empty'}. Error: ${urlItem.error || 'Validation failed'}`);
        continue;
      }

      // Check if this is a multi-media platform (Instagram, Facebook, Reddit)
      const multiMediaPlatform = isMultiMediaPlatform(urlItem.value);
      console.log('🎯 Processing URL:', urlItem.value);
      console.log('🎯 Multi-media platform detected:', multiMediaPlatform);
      
      const { isPlaylist: isYouTubePlaylistUrl, playlistId: youtubePlaylistId } = isYouTubePlaylist(urlItem.value);
      console.log('🎯 YouTube playlist detection result:', { isYouTubePlaylistUrl, youtubePlaylistId });
      
      if (multiMediaPlatform) {
        try {
          // Backend downloads all media and returns metadata for individual files
          // Pass Instagram cookies if available
          const downloadOptions = multiMediaPlatform === 'instagram' && instagramCookies 
            ? { instagramCookies } 
            : {};
          const downloadResult = await downloadService.getPostMediaItems(multiMediaPlatform, urlItem.value, downloadOptions) as any;
          
          if (downloadResult && downloadResult.downloadedFiles?.length > 0) {
            // Create individual download items for each file (photos AND videos)
            const newDownloadItems = downloadResult.downloadedFiles.map((file: any) => ({
              id: generateUniqueId(),
              url: file.downloadUrl, // Direct download URL for the file
              status: 'completed' as DownloadStatus, // Files are already downloaded and ready
              progress: 100,
              format: file.format || 'unknown',
              quality: 'best',
              title: file.displayName || file.fileName,
              fileName: file.fileName,
              downloadUrl: file.downloadUrl, // URL to download this specific file
              fileSize: file.fileSize,
              thumbnailUrl: file.thumbnailUrl, // Include thumbnail URL from backend
              mediaItem: {
                id: file.id,
                url: file.downloadUrl,
                title: file.displayName || file.fileName,
                thumbnailUrl: file.thumbnailUrl, // Also include in mediaItem for backward compatibility
                mediaType: file.mediaType || 'unknown',
                resolution: file.resolution || undefined,
                fileSize: file.fileSize,
                suggestedFormat: file.format || 'unknown',
                displayName: file.displayName || file.fileName,
                platform: multiMediaPlatform
              },
              isFromMultiMediaPost: true,
              postTitle: downloadResult.title || `${multiMediaPlatform} post`
            }));

            setDownloads(prev => [...prev, ...newDownloadItems]);

            const successCount = newDownloadItems.length;
            const photoCount = downloadResult.photoCount || 0;
            const videoCount = downloadResult.videoCount || 0;

            toast({
              title: `${successCount} files ready!`,
              description: `Downloaded ${photoCount} photos and ${videoCount} videos from ${multiMediaPlatform} post. Click individual download buttons to save each file.`,
            });
          } else {
            // Handle case where no files were downloaded
            console.warn(`No media files downloaded from ${multiMediaPlatform} post`);
            toast({
              title: `No Media Downloaded`,
              description: `No photos or videos could be downloaded from this ${multiMediaPlatform} post`,
              variant: 'destructive',
            });
          }
        } catch (error) {
          console.error(`Error processing ${multiMediaPlatform} post:`, error);
          console.error('Error details:', error?.response?.data);
          console.error('Error status:', error?.response?.status);
          console.error('Error message:', error?.message);
          
          toast({
            title: `${multiMediaPlatform} Error`,
            description: `Failed to get media items from ${multiMediaPlatform} post. Please check the URL and try again.`,
            variant: 'destructive',
          });
        }
        continue; // Skip regular download processing for multi-media platforms
      }

      // Check if this is a YouTube URL (playlist or single video)
      const isYouTubeUrl = urlItem.value.includes('youtube.com') || urlItem.value.includes('youtu.be');
      if (isYouTubeUrl) {
        console.log('🎬 Processing YouTube URL:', urlItem.value);
        console.log('🎬 Is playlist:', isYouTubePlaylistUrl, 'Playlist ID:', youtubePlaylistId);
        
        // For single YouTube videos, use the standard download process (like TikTok)
        if (!isYouTubePlaylistUrl || !youtubePlaylistId) {
          console.log('🎬 Single YouTube video - using standard download process like TikTok');
          // Continue to the standard download process below - this will use downloadMedia() like TikTok
        } else {
          console.log('🎬 YouTube playlist detected - using enhanced handling');
          console.log('🎬 Using format:', selectedFormat, 'and quality: best');
          try {
            let playlistResult: any;
            
            if (isYouTubePlaylistUrl && youtubePlaylistId) {
              console.log('🎬 Calling downloadService.getYouTubePlaylistItems for playlist URL:', urlItem.value);
              // Get playlist items from backend with format and quality parameters
              playlistResult = await downloadService.getYouTubePlaylistItems(
                urlItem.value, 
                selectedFormat.toLowerCase(), 
                'best'
              ) as any;
            } else {
              console.log('🎬 Calling downloadService.downloadYouTubeVideo for single video URL:', urlItem.value);
              // For single YouTube videos, use the YouTube-specific download method
              playlistResult = await downloadService.downloadYouTubeVideo(
                urlItem.value, 
                selectedFormat.toLowerCase(), 
                'best'
              ) as any;
            }
            
            console.log('🎬 Received playlist result:', playlistResult);
            console.log('🎬 Playlist result type:', typeof playlistResult);
            
            if (playlistResult) {
              console.log('🎬 Playlist result keys:', Object.keys(playlistResult));
              console.log('🎬 Playlist success status:', playlistResult.success);
              console.log('🎬 Is auto-downloaded:', playlistResult.isAutoDownloaded);
              console.log('🎬 Playlist items exist:', !!playlistResult.playlistItems);
              console.log('🎬 Downloaded files exist:', !!playlistResult.downloadedFiles);
              console.log('🎬 Total items:', playlistResult.totalItems);
              console.log('🎬 Playlist title:', playlistResult.title);
            } else {
              console.log('🎬 Playlist result is null/undefined');
            }
            
            if (playlistResult && playlistResult.success) {
              if (playlistResult.isAutoDownloaded && playlistResult.downloadedFiles?.length > 0) {
                // Auto-downloaded content: Single videos or small playlists (Instagram-like behavior)
                const isPlaylist = isYouTubePlaylistUrl && youtubePlaylistId;
                const contentType = isPlaylist ? 'playlist' : 'video';
                console.log(`🎬 ${contentType} auto-downloaded:`, playlistResult.downloadedFiles.length, 'files ready');
                
                const newDownloadItems = playlistResult.downloadedFiles.map((file: any) => ({
                  id: generateUniqueId(),
                  url: file.downloadUrl, // Direct download URL for the file
                  status: 'completed' as DownloadStatus, // Files are already downloaded and ready
                  progress: 100,
                  format: file.format || selectedFormat.toLowerCase(),
                  quality: 'best',
                  title: file.displayName || file.fileName,
                  fileName: file.fileName,
                  downloadUrl: file.downloadUrl, // URL to download this specific file
                  fileSize: file.fileSize,
                  thumbnailUrl: file.thumbnailUrl, // Include thumbnail for UI display
                  mediaItem: {
                    id: file.id,
                    url: file.downloadUrl,
                    title: file.displayName || file.fileName,
                    mediaType: file.mediaType || 'video',
                    resolution: undefined,
                    fileSize: file.fileSize,
                    suggestedFormat: file.format || selectedFormat.toLowerCase(),
                    displayName: file.displayName || file.fileName,
                    platform: 'youtube'
                  },
                  isFromMultiMediaPost: true,
                  postTitle: playlistResult.title || (isPlaylist ? 'YouTube Playlist' : 'YouTube Video')
                }));

                setDownloads(prev => [...prev, ...newDownloadItems]);

                const fileCount = newDownloadItems.length;
                const successMessage = isPlaylist 
                  ? `Small playlist auto-downloaded! ${fileCount} videos are ready for download.`
                  : `Video downloaded! Ready for download with thumbnail.`;
                
                toast({
                  title: `${fileCount} ${fileCount === 1 ? 'file' : 'files'} ready!`,
                  description: successMessage + ' Click individual download buttons to save them.',
                });
                
              } else if (!playlistResult.isAutoDownloaded && playlistResult.playlistItems?.length > 0) {
                // Large playlist: Individual selection required (current behavior)
                console.log('🎬 Large playlist requiring selection:', playlistResult.playlistItems.length, 'videos available');
                
                const newDownloadItems = playlistResult.playlistItems.map((video: any) => ({
                  id: generateUniqueId(),
                  url: video.url, // Individual video URL
                  status: 'pending' as DownloadStatus, // Videos need to be downloaded individually
                  progress: 0,
                  format: selectedFormat.toLowerCase(),
                  quality: 'best',
                  title: video.title,
                  fileName: `${video.title}.${selectedFormat.toLowerCase()}`,
                  thumbnailUrl: video.thumbnailUrl,
                  isPlaylistItem: true,
                  playlistTitle: playlistResult.title || 'YouTube Playlist'
                }));

                setDownloads(prev => [...prev, ...newDownloadItems]);

                const videoCount = newDownloadItems.length;
                toast({
                  title: `${videoCount} videos found!`,
                  description: `Large playlist detected! Found ${videoCount} videos. Click individual download buttons to download each video.`,
                });
              }
            } else {
              // Handle case where no videos were found
              console.warn('🎬 No videos found in YouTube playlist');
              console.warn('🎬 Playlist result analysis:');
              console.warn('🎬 - playlistResult exists:', !!playlistResult);
              console.warn('🎬 - playlistResult.playlistItems exists:', !!playlistResult?.playlistItems);
              console.warn('🎬 - playlistResult.playlistItems length:', playlistResult?.playlistItems?.length);
              console.warn('🎬 - playlistResult.success:', playlistResult?.success);
              console.warn('🎬 - playlistResult.error:', playlistResult?.error);
              console.warn('🎬 - Full playlistResult object:', playlistResult);
              
              const isPlaylist = isYouTubePlaylistUrl && youtubePlaylistId;
              const contentType = isPlaylist ? 'playlist' : 'video';
              
              toast({
                title: `No ${contentType.charAt(0).toUpperCase() + contentType.slice(1)} Found`,
                description: `No ${contentType} could be found at this YouTube URL`,
                variant: 'destructive',
              });
            }
          } catch (error) {
            console.error('🎬 Error processing YouTube playlist:', error);
            console.error('🎬 Error type:', typeof error);
            console.error('🎬 Error name:', error?.name);
            console.error('🎬 Error message:', error?.message);
            console.error('🎬 Error stack:', error?.stack);
            
            if (error?.response) {
              console.error('🎬 Error response:', error.response);
              console.error('🎬 Error response status:', error.response.status);
              console.error('🎬 Error response data:', error.response.data);
              console.error('🎬 Error response headers:', error.response.headers);
            } else if (error?.request) {
              console.error('🎬 Error request:', error.request);
            }
            
            const isPlaylist = isYouTubePlaylistUrl && youtubePlaylistId;
            const contentType = isPlaylist ? 'playlist' : 'video';
            
            toast({
              title: `YouTube ${contentType} Error`,
              description: `Failed to get ${contentType} from YouTube. Please check the URL and try again.`,
              variant: 'destructive',
            });
          }
        }
        // For single videos, continue to standard download process
        if (!isYouTubePlaylistUrl || !youtubePlaylistId) {
          console.log('🎬 Single YouTube video - continuing to standard download process like TikTok');
        } else {
          continue; // Skip regular download processing only for YouTube playlists
        }
      }

      // Handle regular downloads for non-YouTube, non-multi-media platforms
      const downloadId = generateUniqueId();
      const newItem: DownloadItem = {
        id: downloadId,
        url: urlItem.value,
        status: 'downloading',
        progress: 0,
        format: selectedFormat.toLowerCase(),
        quality: 'best',
        title: urlItem.value // Use URL initially, will be updated if title is fetched
      };

      // Add to downloads queue
      setDownloads(prev => [...prev, newItem]);

      try {
        // Set up download parameters
        const platformRoute = `${currentPath}`;
        const format = selectedFormat.toLowerCase();
        const quality = 'best';
        const options = {
          removeWatermark: urlItem.removeWatermark || false,
          directDownload: true, // Use direct download like retry function
          useCloudStorage: false // Don't force cloud storage for regular downloads
        };
        console.log('ToolPage.tsx: handleDownload - options.directDownload:', options.directDownload);

        // Create a progress update handler for this specific download
        const progressHandler = (progress: number) => {
          setDownloads(prev =>
            prev.map(i =>
              i.id === downloadId
                ? { ...i, progress }
                : i
            )
          );
        };

        // Initiate the download using the service
        const result = await downloadService.downloadMedia(
          platformRoute,
          urlItem.value,
          format,
          quality,
          progressHandler,
          options
        );

        // Handle the result
        if (result instanceof Blob) {
          // Create a download URL for the blob but don't trigger download automatically
          const url = window.URL.createObjectURL(result);
          const fileExt = format || 'mp4';

          // Update download status to completed with downloadUrl available
          setDownloads(prev =>
            prev.map(i =>
              i.id === downloadId
                ? {
                    ...i,
                    progress: 100,
                    status: 'completed',
                    downloadUrl: url,
                    fileName: `download.${fileExt}`
                  }
                : i
            )
          );

          toast({
            title: 'Download Ready',
            description: 'File is ready for download',
            variant: "default",
          });
        } else {
          throw new Error('Failed to download file');
        }
      } catch (error) {
        // Update only this specific download to error state
        setDownloads(prev =>
          prev.map(i =>
            i.id === downloadId
              ? {
                  ...i,
                  status: 'error',
                  error: (error as Error)?.message || "An unexpected error occurred."
                }
              : i
          )
        );

        toast({
          title: "Download Error",
          description: (error as Error)?.message || "An unexpected error occurred.",
          variant: "destructive",
        });
      }
    }
    
    console.log('🚀 handleDownload completed');
    console.log('🚀 Final downloads state:', downloads);
    setIsLoading(false);
    
    // Reset monetization after successful download to require 3 clicks for next download
    console.log('🔄 Resetting monetization after download completion');
    setTimeout(() => {
      localStorage.removeItem('monetization_click_count');
      localStorage.removeItem('monetization_is_complete');
      localStorage.removeItem('monetization_platform_type');
      localStorage.removeItem('monetization_is_conversion');
      setMonetizationKey(prev => prev + 1);
      console.log('✅ Monetization reset completed');
    }, 100); // Small delay to ensure state updates properly
  };

  return (
    <>
      <Helmet>
        <title>{`${title} - GetYoVids.com`}</title>
        <meta name="description" content={description} />
        <meta name="keywords" content={`${title.toLowerCase()}, video downloader, free downloader, online downloader, ${title.toLowerCase().replace(/\s+/g, ' ')}`} />
        <link rel="canonical" href={`https://getyovids.com${location.pathname}`} />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`https://getyovids.com${location.pathname}`} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:image" content="https://getyovids.com/og-image.png" />
        <meta property="og:site_name" content="GetYoVids.com" />
        
        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content={`https://getyovids.com${location.pathname}`} />
        <meta property="twitter:title" content={title} />
        <meta property="twitter:description" content={description} />
        <meta property="twitter:image" content="https://getyovids.com/og-image.png" />
        
        {/* Additional SEO Meta Tags */}
        <meta name="robots" content="index, follow" />
        <meta name="author" content="GetYoVids.com" />
        <meta name="language" content="English" />
        <meta name="revisit-after" content="7 days" />
        
        {/* Structured Data for Tool/Service */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            "name": title,
            "description": description,
            "url": `https://getyovids.com${location.pathname}`,
            "applicationCategory": "MultimediaApplication",
            "operatingSystem": "Web Browser",
            "offers": {
              "@type": "Offer",
              "price": "0",
              "priceCurrency": "USD"
            },
            "provider": {
              "@type": "Organization",
              "name": "GetYoVids.com",
              "url": "https://getyovids.com"
            }
          })}
        </script>
      </Helmet>
      <div className="flex-1 bg-background text-foreground p-4 md:p-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold tracking-tight text-primary sm:text-5xl">
              {title}
            </h1>
            <p className="mt-4 text-lg text-muted-foreground">
              {description}
            </p>
          
          </div>
          {/* Top Horizontal Ad Space */}
          <div className="mb-8">
            <AdSpace type="horizontal" size="728x90" />
          </div>
          
          <div className="bg-card rounded-lg border border-gray-800 p-6 mb-8">
            <div className="space-y-4">
              {urls.map((url, index) => (
                <div key={url.id} className="flex items-center gap-2">
                  <div className="flex-1">
                    <Label htmlFor={`url-input-${url.id}`} className="sr-only">
                      URL
                    </Label>
                    <Input
                      id={`url-input-${url.id}`}
                      type="text"
                      placeholder={placeholder}
                      value={url.value}
                      onChange={(e) => handleUrlChange(url.id, e.target.value)}
                      className={url.error ? "border-red-500" : ""}
                      disabled={isLoading}
                    />
                    {url.error && (
                      <p className="text-red-500 text-sm mt-1">{url.error}</p>
                    )}
                  </div>
                  {index === urls.length - 1 && (
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={addUrlField}
                      disabled={isLoading}
                    >
                      <PlusIcon className="h-4 w-4" />
                    </Button>
                  )}
                  {urls.length > 1 && (
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => removeUrlField(url.id)}
                      disabled={isLoading}
                    >
                      <MinusIcon className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>

        

            {shouldHideFormatSelector && (
              <div className="mt-4 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                <p className="text-sm text-blue-400">
                  <span className="font-medium">
                    {isMultiMediaRoute() ? "Multi-Media Platform:" : "Multi-Media Content Detected:"}
                  </span> 
                  {isMultiMediaRoute() ? 
                    " This platform supports downloading multiple photos and videos from posts. Individual items will be added to your download queue." :
                    " All photos and videos from this post will be added to your download queue."
                  } You can then choose which items to download individually.
                </p>
                
                {/* Instagram Cookie Helper */}
                {currentPath.includes('instagram') && (
                  <div className="mt-4 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h5 className="font-medium text-yellow-400">🔐 Enhanced Instagram Access</h5>
                      <button
                        type="button"
                        onClick={() => setShowCookieHelper(!showCookieHelper)}
                        className="text-sm bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-300 px-3 py-1 rounded transition-colors"
                      >
                        {showCookieHelper ? 'Hide' : 'Show'} Cookie Helper
                      </button>
                    </div>
                    <p className="text-sm text-yellow-300 mb-3">
                      For private posts or full carousel access, you can provide your Instagram cookies. This uses your own Instagram session.
                    </p>
                    
                    {showCookieHelper && (
                      <div className="space-y-4 mt-4 p-4 bg-gray-800/50 rounded-lg">
                        <h6 className="font-medium text-white">How to get your Instagram cookies:</h6>
                        <ol className="text-sm text-gray-300 space-y-2 list-decimal list-inside">
                          <li>Open Instagram in your browser and log in</li>
                          <li>Press F12 to open Developer Tools</li>
                          <li>Go to the "Application" tab (Chrome) or "Storage" tab (Firefox)</li>
                          <li>Click on "Cookies" → "https://www.instagram.com"</li>
                          <li>Find the "sessionid" cookie and copy its value</li>
                          <li>Paste it in the field below</li>
                        </ol>
                        
                        <div className="space-y-2">
                          <Label htmlFor="instagram-cookies" className="text-sm font-medium text-white">
                            Instagram Session ID
                          </Label>
                          <Input
                            id="instagram-cookies"
                            type="password"
                            value={instagramCookies}
                            onChange={(e) => setInstagramCookies(e.target.value)}
                            placeholder="Paste your sessionid cookie value here..."
                            className="bg-gray-700/50 border-gray-600 text-white placeholder-gray-400"
                          />
                          <p className="text-xs text-gray-400">
                            ⚠️ Your cookies stay on your device and are only used for this session. We don't store them.
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {showFormatOptions && !shouldHideFormatSelector && (
              <div className="mt-4">
                <Label htmlFor="format-select">Select Format</Label>
                <Select
                  value={selectedFormat}
                  onValueChange={handleFormatChange}
                  disabled={isLoading}
                >
                  <SelectTrigger id="format-select">
                    <SelectValue placeholder="Select a format" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Formats</SelectLabel>
                      {availableFormatsAndQualities?.formats.map((format) => (
                        <SelectItem key={format} value={format}>
                          {format.toUpperCase()}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Monetization Info */}
            <MonetizationInfo 
              platformType={getPlatformTypeFromPath(currentPath)}
              className="mt-4"
            />

            {/* Debug Panel - Commented out for deployment */}
            {/* {process.env.NODE_ENV === 'development' && (
              <MonetizationDebug 
                platformType={getPlatformTypeFromPath(currentPath)}
              />
            )} */}



            <div className="mt-6">
              <MonetizedButton
                key={`main-${monetizationKey}`}
                platformType={getPlatformTypeFromPath(currentPath)}
                originalText={buttonText}
                onClick={hasValidUrls ? handleDownload : () => {
                  toast({
                    title: 'No URL Entered',
                    description: 'Please enter a valid URL to download',
                    variant: 'destructive',
                  });
                }}
                disabled={isLoading}
                loading={isLoading}
                className="w-full"
                size="lg"
                hasValidUrl={hasValidUrls}
              />
            </div>
          </div>

          {downloads.length > 0 && (
            <div className="bg-card rounded-lg border border-gray-800 p-6 mb-8">
              <h2 className="text-xl font-semibold text-white mb-4">Downloads</h2>
              
              {/* Downloads Ad Space */}
              <div className="mb-6">
                <AdSpace type="horizontal" size="300x250" />
              </div>
              
              {/* Download Queue Monetization Info */}
              <div className="mb-4 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                <p className="text-sm text-blue-400 text-center">
                  💾 <strong>Download Queue:</strong> Click download buttons 2 times to save files. 
                  Each click triggers ads to support our free service.
                </p>
              </div>
              
              <div className="space-y-4">
                {downloads.map((item) => (
                  <div key={item.id} className="p-4 bg-gray-800 rounded-lg">
                    <div className="flex items-center gap-4">
                      {/* Thumbnail */}
                      <div className="flex-shrink-0 w-16 h-16 bg-gray-700 rounded-lg overflow-hidden border border-gray-600">
                        {item.thumbnailUrl ? (
                          // Priority 1: Direct thumbnail URL from backend (Instagram, YouTube, etc.)
                          <img 
                            src={resolveDownloadUrl(item.thumbnailUrl)}
                            alt={item.title || 'Thumbnail'}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              // Fallback to placeholder if thumbnail fails to load
                              const target = e.target as HTMLImageElement;
                              target.style.display = 'none';
                              const placeholder = target.nextElementSibling as HTMLElement;
                              if (placeholder) placeholder.style.display = 'flex';
                            }}
                          />
                        ) : item.mediaItem?.mediaType === 'image' && item.downloadUrl ? (
                          // Priority 2: For images, use the download URL as the thumbnail
                          <img 
                            src={resolveDownloadUrl(item.downloadUrl)} 
                            alt={item.title || 'Image'}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              // Fallback to placeholder if image fails to load
                              const target = e.target as HTMLImageElement;
                              target.style.display = 'none';
                              const placeholder = target.nextElementSibling as HTMLElement;
                              if (placeholder) placeholder.style.display = 'flex';
                            }}
                          />
                        ) : item.mediaItem?.thumbnailUrl ? (
                          // Priority 3: For multi-media posts with explicit thumbnail URLs in mediaItem
                          <img 
                            src={resolveDownloadUrl(item.mediaItem.thumbnailUrl)} 
                            alt={item.title || 'Thumbnail'}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              // Fallback to placeholder if thumbnail fails to load
                              const target = e.target as HTMLImageElement;
                              target.style.display = 'none';
                              const placeholder = target.nextElementSibling as HTMLElement;
                              if (placeholder) placeholder.style.display = 'flex';
                            }}
                          />
                        ) : item.formatInfo?.thumbnailUrl ? (
                          // Priority 4: For regular downloads (YouTube, TikTok, etc.) with thumbnails from backend
                          <img 
                            src={item.formatInfo.thumbnailUrl} 
                            alt={item.title || 'Thumbnail'}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              // Fallback to placeholder if thumbnail fails to load
                              const target = e.target as HTMLImageElement;
                              target.style.display = 'none';
                              const placeholder = target.nextElementSibling as HTMLElement;
                              if (placeholder) placeholder.style.display = 'flex';
                            }}
                          />
                        ) : item.availableFormats?.thumbnail ? (
                          // Priority 5: Alternative thumbnail source for regular downloads
                          <img 
                            src={item.availableFormats.thumbnail} 
                            alt={item.title || 'Thumbnail'}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              // Fallback to placeholder if thumbnail fails to load
                              const target = e.target as HTMLImageElement;
                              target.style.display = 'none';
                              const placeholder = target.nextElementSibling as HTMLElement;
                              if (placeholder) placeholder.style.display = 'flex';
                            }}
                          />
                        ) : null}
                        
                        {/* Fallback placeholder */}
                        <div 
                          className={`w-full h-full flex items-center justify-center text-gray-400 ${
                            item.thumbnailUrl ||
                            (item.mediaItem?.mediaType === 'image' && item.downloadUrl) || 
                            item.mediaItem?.thumbnailUrl || 
                            item.formatInfo?.thumbnailUrl || 
                            item.availableFormats?.thumbnail ? 'hidden' : 'flex'
                          }`}
                        >
                          {item.mediaItem?.mediaType === 'image' ? (
                            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/>
                            </svg>
                          ) : item.mediaItem?.mediaType === 'video' ? (
                            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M8 5v14l11-7z"/>
                            </svg>
                          ) : (
                            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                            </svg>
                          )}
                        </div>
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <p className="text-white font-medium truncate">
                          {item.title || item.url}
                        </p>
                        <p className="text-sm text-gray-400">
                          {item.isFromMultiMediaPost 
                            ? `${item.mediaItem?.mediaType || 'Media'} from ${item.postTitle || 'post'}` 
                            : item.isPlaylistItem 
                              ? "Playlist" 
                              : "Single File"} - {item.format?.toUpperCase()}

                        </p>
                        {item.mediaItem && (
                          <p className="text-xs text-gray-500">
                            {item.mediaItem.resolution && `${item.mediaItem.resolution} • `}
                            {item.mediaItem.fileSize > 0 && `${(item.mediaItem.fileSize / 1024 / 1024).toFixed(1)} MB`}
                          </p>
                        )}

                      </div>

                      {/* Action buttons */}
                      <div className="flex items-center gap-4">
                        {item.status === 'pending' && item.isFromMultiMediaPost && (
                          <MonetizedButton
                            key={`pending-${item.id}-${monetizationKey}`}
                            platformType={getPlatformTypeFromPath(currentPath)}
                            isConversion={true}
                            originalText="Download"
                            onClick={() => handleItemDownload(item)}
                            size="sm"
                            hasValidUrl={true}
                          >
                            <Download className="mr-2 h-4 w-4" />
                            Download
                          </MonetizedButton>
                        )}
                        {item.status === 'completed' && item.downloadUrl && (
                          <MonetizedButton
                            key={`completed-${item.id}-${monetizationKey}`}
                            platformType={getPlatformTypeFromPath(currentPath)}
                            isConversion={true}
                            originalText="Download"
                            onClick={() => handleFileDownload(item)}
                            size="sm"
                            hasValidUrl={true}
                          >
                            <Download className="mr-2 h-4 w-4" />
                            Download
                          </MonetizedButton>
                        )}
                        {item.status === 'error' && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => item.isFromMultiMediaPost ? handleItemDownload(item) : retryDownload(item)}
                          >
                            <RefreshCw className="mr-2 h-4 w-4" />
                            Retry
                          </Button>
                        )}
                      </div>
                    </div>
                    {(item.status === 'downloading' || item.status === 'processing') && (
                      <div className="mt-2">
                        <Progress value={item.progress} className="h-2" />
                        <p className="text-sm text-gray-400 mt-1">
                          {item.status === 'processing' ? 'Processing...' : `${Math.round(item.progress)}%`}
                        </p>
                      </div>
                    )}
                    {item.status === 'error' && (
                      <p className="text-red-400 text-sm mt-2">{item.error}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Middle Horizontal Ad Space */}
          <div className="mb-8">
            <AdSpace type="horizontal" size="970x90" />
          </div>
          
          {/* Bottom Horizontal Ad Space */}
          <div className="mb-8">
            <AdSpace type="horizontal" size="728x90" />
          </div>

          {/* SEO Content */}
          <div className="bg-card rounded-lg border border-gray-800 p-6">
            <h2 className="text-xl font-semibold text-white mb-4">
              {(() => {
                const platformMap: { [key: string]: string } = {
                  'youtube-downloader': 'YouTube',
                  'tiktok-downloader': 'TikTok',
                  'instagram-downloader': 'Instagram',
                  'facebook-downloader': 'Facebook',
                  'reddit-downloader': 'Reddit'
                };
                const platform = platformMap[currentPath] || 'Social Media';
                return `How To Download From ${platform} Using This Tool`;
              })()}
            </h2>
            <div className="text-gray-300 space-y-4">
              <div>
                <h3 className="text-lg font-medium text-white mb-2">📋 Step-by-Step Guide</h3>
                <ol className="list-decimal list-inside space-y-2 ml-4">
                  <li><strong>Paste Your URL:</strong> Copy and paste the {(() => {
                    const platformMap: { [key: string]: string } = {
                      'youtube-downloader': 'YouTube video or playlist',
                      'tiktok-downloader': 'TikTok video',
                      'instagram-downloader': 'Instagram post, reel, or story',
                      'facebook-downloader': 'Facebook post or video',
                      'reddit-downloader': 'Reddit post'
                    };
                    return platformMap[currentPath] || 'content';
                  })()} URL into the input field above.</li>
                  
                  <li><strong>Add Multiple URLs (Optional):</strong> Click the <span className="inline-flex items-center justify-center w-6 h-6 border border-gray-600 rounded text-xs bg-gray-700">+</span> button to add more URL fields for batch downloading from the same platform.</li>
                  
                  {!shouldHideFormatSelector && (
                    <li><strong>Choose Format:</strong> Select your preferred format (MP4, MP3, etc.) and quality from the dropdown menu.</li>
                  )}
                  
                  <li><strong>Start Download:</strong> Click the "Download" button to begin processing your content.</li>
                  
                  <li><strong>Download Files:</strong> Once processed, click the individual download buttons for each file in your download queue.</li>
                </ol>
              </div>

              <div>
                <h3 className="text-lg font-medium text-white mb-2">🚀 Advanced Features</h3>
                <div className="space-y-3">
                  <div>
                    <h4 className="font-medium text-blue-400">Multiple URL Processing</h4>
                    <p className="text-sm">Use the <span className="inline-flex items-center justify-center w-6 h-6 border border-gray-600 rounded text-xs bg-gray-700">+</span> button to add multiple URL fields from the same platform. For example, on the YouTube downloader, you can add multiple YouTube videos or playlists to download in one batch. All URLs must be from the current platform - mixed platforms are not allowed.</p>
                  </div>
                  
                  {(() => {
                    const isInstagramFacebookReddit = ['instagram-downloader', 'facebook-downloader', 'reddit-downloader'].includes(currentPath);
                    const isYouTube = ['youtube-downloader'].includes(currentPath);
                    
                    if (isInstagramFacebookReddit) {
                      return (
                        <div>
                          <h4 className="font-medium text-green-400">Auto-Download All Media</h4>
                          <p className="text-sm">This platform automatically downloads all photos and videos from posts. Individual files will appear in your download queue ready for saving.</p>
                        </div>
                      );
                    }
                    
                    if (isYouTube) {
                      return (
                                                 <div>
                           <h4 className="font-medium text-purple-400">Smart Playlist Handling</h4>
                           <ul className="text-sm space-y-1 ml-4 list-disc">
                             <li><strong>Small Playlists (&lt;25 videos):</strong> Automatically downloads all videos like Instagram posts</li>
                             <li><strong>Large Playlists (≥25 videos):</strong> Shows individual video selection interface</li>
                             <li><strong>Safety Limits:</strong> Auto-download blocked if total duration &gt;8h, individual videos &gt;3h, or estimated size &gt;10GB</li>
                             <li><strong>Format Selection:</strong> Choose MP4, MP3, or other formats for entire playlists</li>
                           </ul>
                         </div>
                      );
                    }
                    
                    return (
                      <div>
                        <h4 className="font-medium text-yellow-400">Platform-Specific Features</h4>
                        <p className="text-sm">This tool adapts to each platform's content structure, providing optimized downloading for different types of media.</p>
                      </div>
                    );
                  })()}
                  
                  <div>
                    <h4 className="font-medium text-orange-400">Download Queue Management</h4>
                    <p className="text-sm">All processed content appears in the download queue below. Each item can be downloaded individually, and you can see progress, file sizes, and formats before downloading.</p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium text-white mb-2">💡 Pro Tips</h3>
                <ul className="list-disc list-inside space-y-1 ml-4 text-sm">
                  <li>URLs are validated in real-time - invalid URLs will show error messages</li>
                  <li>You can remove URL fields using the <span className="inline-flex items-center justify-center w-6 h-6 border border-gray-600 rounded text-xs bg-gray-700">-</span> button</li>
                  <li>The tool remembers your format preferences during your session</li>
                  <li>Large files show progress indicators during processing</li>
                  <li>Add multiple URLs from the same platform for efficient batch downloading</li>
                  <li>Safety limits prevent abuse: playlists with excessive duration or size require individual selection</li>
                </ul>
              </div>

              <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
                <h4 className="font-medium text-blue-400 mb-2">🔒 Privacy & Security</h4>
                <p className="text-sm">All downloads are processed securely. URLs are validated before processing, and downloaded content is temporarily stored only for delivery to you.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};


                      
