import { PlatformType } from '../hooks/useMonetization';

// Adult platforms that should use adult monetization
const ADULT_PLATFORMS = [
  'pornhub',
  'xvideos', 
  'xhamster',
  'redgifs',
  'youporn',
  'spankbang'
];

// Regular platforms that should use regular monetization
const REGULAR_PLATFORMS = [
  'youtube',
  'tiktok',
  'instagram',
  'twitter',
  'vimeo',
  'facebook',
  'twitch',
  'reddit'
];

/**
 * Determine if a platform is adult content
 */
export const isAdultPlatform = (platform: string): boolean => {
  return ADULT_PLATFORMS.includes(platform.toLowerCase());
};

/**
 * Get platform type for monetization
 */
export const getPlatformType = (platform: string): PlatformType => {
  return isAdultPlatform(platform) ? 'adult' : 'regular';
};

/**
 * Get platform type from URL path
 */
export const getPlatformTypeFromPath = (path: string): PlatformType => {
  // Extract platform from path like "/youtube-downloader" -> "youtube"
  const platform = path.replace(/^\/|\-downloader$/g, '').toLowerCase();
  return getPlatformType(platform);
};

/**
 * Check if a platform is supported for monetization
 */
export const isMonetizationSupported = (platform: string): boolean => {
  const allPlatforms = [...ADULT_PLATFORMS, ...REGULAR_PLATFORMS];
  return allPlatforms.includes(platform.toLowerCase());
}; 