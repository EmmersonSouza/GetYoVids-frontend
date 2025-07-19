// Map of domains to their corresponding service paths
export const domainToServiceMap: Record<string, string> = {
  // Video Platforms
  'youtube.com': '/youtube-downloader',
  'youtu.be': '/youtube-downloader',
  'tiktok.com': '/tiktok-downloader',
  'instagram.com': '/instagram-downloader',
  'twitter.com': '/twitter-downloader',
  'x.com': '/twitter-downloader',
  'vimeo.com': '/vimeo-downloader',
  'facebook.com': '/facebook-downloader',
  'fb.watch': '/facebook-downloader',
  'twitch.tv': '/twitch-downloader',
  'reddit.com': '/reddit-downloader',
  
  // Adult Video Platforms
  'pornhub.com': '/pornhub-downloader',
  'phncdn.com': '/pornhub-downloader',
  'xvideos.com': '/xvideos-downloader',
  'xhamster.com': '/xhamster-downloader',
  'xhamster.desi': '/xhamster-downloader',
  'xhamster.one': '/xhamster-downloader',
  'xhamster2.com': '/xhamster-downloader',
  'redgifs.com': '/redgifs-downloader',
  'redgifs.io': '/redgifs-downloader',
  'youporn.com': '/youporn-downloader',
  'youporn2.com': '/youporn-downloader',
  'spankbang.com': '/spankbang-downloader',
  'spankbang.party': '/spankbang-downloader',
} as const;

type ServicePath = typeof domainToServiceMap[keyof typeof domainToServiceMap];

// Get the service path for a given URL
export function getServiceForUrl(url: string): { path: ServicePath | null; domain: string | null } {
  if (!url || !url.includes('.')) {
    return { path: null, domain: null };
  }
  try {
    const urlObj = new URL(url.startsWith('http') ? url : `https://${url}`);
    const domainParts = urlObj.hostname.split('.');
    
    // Check for subdomains like 'www', 'm', etc.
    for (let i = 0; i < domainParts.length - 1; i++) {
      const testDomain = domainParts.slice(i).join('.');
      if (domainToServiceMap[testDomain]) {
        return {
          path: domainToServiceMap[testDomain] as ServicePath,
          domain: testDomain
        };
      }
    }
  } catch (e) {
    console.error('Error parsing URL:', e);
  }
  
  return { path: null, domain: null };
}

// Check if a URL is valid for the current service
export function isUrlValidForService(url: string, currentPath: string): boolean {
  if (!url) return false;
  
  const { path: servicePath } = getServiceForUrl(url);
  
  if (!servicePath) {
    return false;
  }
  
  return servicePath === `/${currentPath}`;
}
