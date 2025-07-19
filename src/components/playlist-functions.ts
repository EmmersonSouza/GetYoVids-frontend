// Playlist processing functions
// These will be integrated into ToolPage.tsx

// Check if a URL is a YouTube playlist
export const isYoutubePlaylist = (url: string): { isPlaylist: boolean; playlistId?: string } => {
  try {
    if (!url) return { isPlaylist: false };
    
    // Handle youtu.be links with playlist
    if (url.includes('youtu.be/') && (url.includes('?list=') || url.includes('&list='))) {
      const urlObj = new URL(url.includes('://') ? url : `https://${url}`);
      const playlistId = urlObj.searchParams.get('list');
      if (playlistId) {
        return { isPlaylist: true, playlistId };
      }
    }
    
    // Handle youtube.com links
    if (url.includes('youtube.com/playlist') || (url.includes('youtube.com') && (url.includes('list=') || url.includes('&list=')))) {
      const urlObj = new URL(url.includes('://') ? url : `https://${url}`);
      const playlistId = urlObj.searchParams.get('list') || urlObj.pathname.split('/').pop();
      
      if (playlistId) {
        return { isPlaylist: true, playlistId };
      }
    }
    
    // Handle YouTube Music playlists
    if (url.includes('music.youtube.com/playlist')) {
      const urlObj = new URL(url.includes('://') ? url : `https://${url}`);
      const playlistId = urlObj.searchParams.get('list') || urlObj.pathname.split('/').pop();
      if (playlistId) {
        return { isPlaylist: true, playlistId };
      }
    }
    
    return { isPlaylist: false };
  } catch (e) {
    console.error('Error parsing URL:', e);
    return { isPlaylist: false };
  }
};

// Process a single video URL
export const processSingleVideoTemplate = `
const processSingleVideo = async (url: string, format: string, quality: string): Promise<DownloadItem | null> => {
  try {
    // Create a unique ID for this download
    const id = generateUniqueId();
    
    // Create download item
    const downloadItem: DownloadItem = {
      id,
      url,
      status: 'downloading',
      progress: 0,
      format,
      quality
    };
    
    // Get the file format data
    const fileFormatInfo = formatInfo[url]?.formats?.find(f => f.format_id === format);
    
    if (fileFormatInfo) {
      downloadItem.formatInfo = fileFormatInfo;
      downloadItem.title = formatInfo[url].title;
    }
    
    return downloadItem;
    
  } catch (error) {
    console.error('Error processing video:', error);
    return null;
  }
};
`;

// Process a playlist URL
export const processPlaylistTemplate = `
const processPlaylist = async (url: string, format: string, quality: string): Promise<DownloadItem[]> => {
  try {
    console.log('Processing playlist:', { url, format, quality });
    
    // Create a unique ID for this download item
    const downloadId = generateUniqueId();
    const playlistTitle = \`Playlist: \${url.split('/').pop() || 'Untitled'}\`;
    
    // Create playlist download item in pending state
    const downloadItem: DownloadItem = {
      id: downloadId,
      url,
      status: 'downloading',
      progress: 0,
      format,
      quality,
      isPlaylistItem: true,
      title: playlistTitle
    };
    
    // Add the download item to the state immediately so user sees it
    setDownloads(prev => [...prev, downloadItem]);
    
    // Create playlist download task on the backend
    const items = [{ url, format, quality }];
    const response = await downloadService.createPlaylistDownload(items, format);
    const taskId = response.task_id;
    
    // Update the download item with the task ID
    setDownloads(prev => prev.map(item => 
      item.id === downloadId ? { ...item, taskId } : item
    ));
    
    // Start polling for playlist status
    pollPlaylistStatus(taskId, downloadId);
    
    return [downloadItem];
  } catch (error) {
    console.error('Error processing playlist:', error);
    toast({
      title: 'Playlist Error',
      description: error instanceof Error ? error.message : 'Failed to process playlist',
      variant: 'destructive',
    });
    return [];
  }
};
`;

// Poll for playlist download status
export const pollPlaylistStatusTemplate = `
const pollPlaylistStatus = async (taskId: string, downloadId: string) => {
  try {
    // Create polling interval (check status every 2 seconds)
    const intervalId = setInterval(async () => {
      try {
        const status = await downloadService.getPlaylistStatus(taskId);
        
        // Update download item with current status
        setDownloads(prev => prev.map(item => {
          if (item.id !== downloadId) return item;
          
          // Calculate progress percentage
          let progress = 0;
          if (status.total_items > 0) {
            progress = (status.completed_items / status.total_items) * 100;
          }
          
          // Check if download is complete
          if (status.status === 'completed') {
            // Clear the interval when complete
            clearInterval(intervalId);
            
            // Start downloading the playlist zip file
            downloadPlaylistFile(taskId, item);
            
            return {
              ...item,
              progress: 100,
              status: 'completed',
              title: \`\${item.title} (\${status.completed_items}/\${status.total_items} items)\`
            };
          }
          
          // Check for errors
          if (status.status === 'error') {
            clearInterval(intervalId);
            
            return {
              ...item,
              status: 'error',
              error: status.error || 'An unknown error occurred',
              progress
            };
          }
          
          // Update with current progress
          return {
            ...item,
            progress,
            title: status.current_item 
              ? \`\${item.title} (\${status.completed_items}/\${status.total_items}): \${status.current_item}\` 
              : \`\${item.title} (\${status.completed_items}/\${status.total_items} items)\`
          };
        }));
        
      } catch (error) {
        console.error('Error polling playlist status:', error);
        clearInterval(intervalId);
        
        // Update download item with error
        setDownloads(prev => prev.map(item => 
          item.id === downloadId 
            ? { 
                ...item, 
                status: 'error', 
                error: error instanceof Error ? error.message : 'Failed to get playlist status'
              } 
            : item
        ));
      }
    }, 2000); // Poll every 2 seconds
    
    // Clear interval after 30 minutes (failsafe)
    setTimeout(() => clearInterval(intervalId), 30 * 60 * 1000);
    
  } catch (error) {
    console.error('Error setting up playlist status polling:', error);
  }
};
`;

// Download the completed playlist zip file
export const downloadPlaylistFileTemplate = `
const downloadPlaylistFile = async (taskId: string, item: DownloadItem) => {
  try {
    // Download the playlist zip file
    const blob = await downloadService.downloadPlaylist(taskId, (progress) => {
      // Update download progress
      setDownloads(prev => prev.map(dl => 
        dl.id === item.id 
          ? { ...dl, progress } 
          : dl
      ));
    });
    
    // Create a download link and trigger download
    const downloadUrl = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.setAttribute('download', \`playlist_\${taskId}.zip\`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    
    // Clean up the object URL
    window.URL.revokeObjectURL(downloadUrl);
    
    // Update download status
    setDownloads(prev => prev.map(dl => 
      dl.id === item.id 
        ? { ...dl, status: 'completed', progress: 100 } 
        : dl
    ));
    
    toast({
      title: 'Playlist Download Complete',
      description: 'Your playlist has been downloaded successfully.',
      variant: 'default',
    });
    
  } catch (error) {
    console.error('Error downloading playlist file:', error);
    
    // Update download item with error
    setDownloads(prev => prev.map(dl => 
      dl.id === item.id 
        ? { 
            ...dl, 
            status: 'error', 
            error: error instanceof Error ? error.message : 'Failed to download playlist'
          } 
        : dl
    ));
    
    toast({
      title: 'Playlist Download Error',
      description: error instanceof Error ? error.message : 'Failed to download playlist',
      variant: 'destructive',
    });
  }
};
`;

// Handle form submission
export const handleSubmitTemplate = `
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  
  // Filter out empty URLs and validate
  const validUrlItems = urls.filter(item => item.value.trim() !== '');
  
  if (validUrlItems.length === 0) {
    toast({
      title: 'Error',
      description: 'Please enter at least one valid URL',
      variant: 'destructive',
    });
    return;
  }
  
  setIsLoading(true);
  
  try {
    // Process each valid URL
    const downloadPromises = validUrlItems.map(async (item) => {
      try {
        // Validate the URL
        const validation = await validateUrl(item.value, urls.findIndex(u => u.id === item.id));
        
        if (validation.isPlaylist && validation.playlistId) {
          const playlistItems = await processPlaylist(item.value, selectedFormat, selectedQuality);
          return Array.isArray(playlistItems) ? playlistItems : [];
        } else {
          const videoItem = await processSingleVideo(item.value, selectedFormat, selectedQuality);
          return videoItem ? [videoItem] : [];
        }
      } catch (error) {
        console.error(\`Error processing URL \${item.value}:\`, error);
        return [];
      }
    });
    
    const downloadResults = await Promise.all(downloadPromises);
    const newDownloads = downloadResults.flat().filter((item): item is DownloadItem => Boolean(item));
    
    if (newDownloads.length > 0) {
      setDownloads(prev => [...prev, ...newDownloads]);
      
      // Start processing each download
      for (const download of newDownloads) {
        try {
          if (download.isPlaylistItem) {
            // Playlist downloads are handled through polling, no need to do anything here
            console.log('Playlist item being processed via polling', download);
          } else {
            // Handle single video download
            await handleFileDownload(download.url, download.format as FormatType, download.quality || 'best');
          }
        } catch (error) {
          console.error('Error processing download:', error);
          // Update download status with error
          setDownloads(prev => 
            prev.map(dl => 
              dl.id === download.id
                ? { 
                    ...dl, 
                    status: 'error', 
                    error: error instanceof Error ? error.message : 'Download failed',
                    progress: 0
                  }
                : dl
            )
          );
        }
      }
    }
  } catch (error) {
    console.error('Error during download:', error);
    toast({
      title: 'Error',
      description: 'An error occurred while processing your request. Please try again.',
      variant: 'destructive' as const,
    });
  } finally {
    setIsLoading(false);
    // Clear loading state for all URLs
    setUrls(prev => prev.map(item => ({
      ...item,
      loading: false
    })));
  }
};
`;
