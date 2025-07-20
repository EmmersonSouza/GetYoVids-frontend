import { useState, useCallback, useEffect } from 'react';

export type PlatformType = 'adult' | 'regular';

interface MonetizationConfig {
  regularUrl: string;
  adultUrl: string;
  regularClicksRequired: number;
  adultClicksRequired: number;
  conversionClicksRequired: number;
}

const DEFAULT_CONFIG: MonetizationConfig = {
  regularUrl: 'https://www.profitableratecpm.com/ez1aaw8g?key=51edc43e9af4ba16487654d5ad13b998',
  adultUrl: 'https://www.profitableratecpm.com/dbr0v40ree?key=0e82932f1f8aea216d88b58a4d024b63',
  regularClicksRequired: 3,
  adultClicksRequired: 3,
  conversionClicksRequired: 2
};

// Persistent storage keys
const STORAGE_KEYS = {
  CLICK_COUNT: 'monetization_click_count',
  IS_COMPLETE: 'monetization_is_complete',
  PLATFORM_TYPE: 'monetization_platform_type',
  IS_CONVERSION: 'monetization_is_conversion',
  SESSION_ID: 'monetization_session_id'
};

export const useMonetization = (config: Partial<MonetizationConfig> = {}) => {
  const finalConfig = { ...DEFAULT_CONFIG, ...config };
  
  // Generate a unique session ID for this browser session
  const [sessionId] = useState(() => {
    const existing = localStorage.getItem(STORAGE_KEYS.SESSION_ID);
    if (existing) return existing;
    
    const newSessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem(STORAGE_KEYS.SESSION_ID, newSessionId);
    return newSessionId;
  });

  // Initialize state from localStorage
  const [clickCount, setClickCount] = useState(() => {
    const stored = localStorage.getItem(STORAGE_KEYS.CLICK_COUNT);
    return stored ? parseInt(stored, 10) : 0;
  });

  const [isMonetizationComplete, setIsMonetizationComplete] = useState(() => {
    const stored = localStorage.getItem(STORAGE_KEYS.IS_COMPLETE);
    return stored === 'true';
  });

  const [currentPlatformType, setCurrentPlatformType] = useState<PlatformType | null>(() => {
    const stored = localStorage.getItem(STORAGE_KEYS.PLATFORM_TYPE) as PlatformType;
    return stored || null;
  });

  const [currentIsConversion, setCurrentIsConversion] = useState(() => {
    const stored = localStorage.getItem(STORAGE_KEYS.IS_CONVERSION);
    return stored === 'true';
  });

  // Save state to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CLICK_COUNT, clickCount.toString());
  }, [clickCount]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.IS_COMPLETE, isMonetizationComplete.toString());
  }, [isMonetizationComplete]);

  useEffect(() => {
    if (currentPlatformType) {
      localStorage.setItem(STORAGE_KEYS.PLATFORM_TYPE, currentPlatformType);
    }
  }, [currentPlatformType]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.IS_CONVERSION, currentIsConversion.toString());
  }, [currentIsConversion]);

  const resetMonetization = useCallback(() => {
    setClickCount(0);
    setIsMonetizationComplete(false);
    setCurrentPlatformType(null);
    setCurrentIsConversion(false);
    
    // Clear localStorage
    localStorage.removeItem(STORAGE_KEYS.CLICK_COUNT);
    localStorage.removeItem(STORAGE_KEYS.IS_COMPLETE);
    localStorage.removeItem(STORAGE_KEYS.PLATFORM_TYPE);
    localStorage.removeItem(STORAGE_KEYS.IS_CONVERSION);
  }, []);

  const handleMonetizationClick = useCallback((platformType: PlatformType, isConversion: boolean = false) => {
    // Check if we're switching platforms or conversion type
    const isPlatformSwitch = currentPlatformType !== platformType;
    const isConversionSwitch = currentIsConversion !== isConversion;
    
    // Reset if switching platforms or conversion type
    if (isPlatformSwitch || isConversionSwitch) {
      setClickCount(0);
      setIsMonetizationComplete(false);
      setCurrentPlatformType(platformType);
      setCurrentIsConversion(isConversion);
    }

    const clicksRequired = isConversion 
      ? finalConfig.conversionClicksRequired
      : platformType === 'adult' 
        ? finalConfig.adultClicksRequired 
        : finalConfig.regularClicksRequired;

    const newClickCount = clickCount + 1;
    setClickCount(newClickCount);

    // Open the appropriate URL in a new tab
    const url = platformType === 'adult' ? finalConfig.adultUrl : finalConfig.regularUrl;
    window.open(url, '_blank');

    // For clean routes (regular), also inject pop-under script
    if (platformType === 'regular') {
      const popUnderScript = document.createElement('script');
      popUnderScript.type = 'text/javascript';
      popUnderScript.src = '//pl27204121.profitableratecpm.com/d0/57/c2/d057c2967ef81828dc840400a9c2c6e6.js';
      document.head.appendChild(popUnderScript);
    }
    
    // For adult routes, also inject pop-under script
    if (platformType === 'adult') {
      const popUnderScript = document.createElement('script');
      popUnderScript.type = 'text/javascript';
      popUnderScript.src = '//pl27204234.profitableratecpm.com/a2/a2/85/a2a28507a6bd2463e79401e2b296cb2c.js';
      document.head.appendChild(popUnderScript);
    }

    // Check if monetization is complete
    if (newClickCount >= clicksRequired) {
      setIsMonetizationComplete(true);
      console.log(`✅ Monetization complete! Required: ${clicksRequired}, Clicks: ${newClickCount}`);
    } else {
      console.log(`🔄 Monetization progress: ${newClickCount}/${clicksRequired} clicks`);
    }

    return newClickCount >= clicksRequired;
  }, [clickCount, finalConfig, currentPlatformType, currentIsConversion]);

  const getButtonText = useCallback((platformType: PlatformType, isConversion: boolean = false, originalText: string = 'Download') => {
    if (isMonetizationComplete) {
      return originalText;
    }

    const clicksRequired = isConversion 
      ? finalConfig.conversionClicksRequired
      : platformType === 'adult' 
        ? finalConfig.adultClicksRequired 
        : finalConfig.regularClicksRequired;

    const clicksLeft = clicksRequired - clickCount;
    
    if (clicksLeft > 0) {
      return `${originalText} (${clicksLeft} clicks left)`;
    }
    
    return originalText;
  }, [clickCount, isMonetizationComplete, finalConfig]);

  const getClicksRequired = useCallback((platformType: PlatformType, isConversion: boolean = false) => {
    return isConversion 
      ? finalConfig.conversionClicksRequired
      : platformType === 'adult' 
        ? finalConfig.adultClicksRequired 
        : finalConfig.regularClicksRequired;
  }, [finalConfig]);

  // Debug function to log current state
  const debugState = useCallback(() => {
    console.log('🔍 Monetization Debug State:', {
      clickCount,
      isMonetizationComplete,
      currentPlatformType,
      currentIsConversion,
      sessionId,
      clicksRequired: currentPlatformType && currentIsConversion !== null 
        ? getClicksRequired(currentPlatformType, currentIsConversion)
        : 'unknown'
    });
  }, [clickCount, isMonetizationComplete, currentPlatformType, currentIsConversion, sessionId, getClicksRequired]);

  return {
    clickCount,
    isMonetizationComplete,
    handleMonetizationClick,
    getButtonText,
    getClicksRequired,
    resetMonetization,
    debugState,
    currentPlatformType,
    currentIsConversion
  };
}; 