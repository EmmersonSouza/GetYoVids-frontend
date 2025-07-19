import { useState, useCallback } from 'react';

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

export const useMonetization = (config: Partial<MonetizationConfig> = {}) => {
  const finalConfig = { ...DEFAULT_CONFIG, ...config };
  const [clickCount, setClickCount] = useState(0);
  const [isMonetizationComplete, setIsMonetizationComplete] = useState(false);

  const resetMonetization = useCallback(() => {
    setClickCount(0);
    setIsMonetizationComplete(false);
  }, []);

  const handleMonetizationClick = useCallback((platformType: PlatformType, isConversion: boolean = false) => {
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
    }

    return newClickCount >= clicksRequired;
  }, [clickCount, finalConfig]);

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

  return {
    clickCount,
    isMonetizationComplete,
    handleMonetizationClick,
    getButtonText,
    getClicksRequired,
    resetMonetization
  };
}; 