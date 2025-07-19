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
  regularUrl: 'https://www.profitableratecpm.com/fdnmh9gyz?key=e6245f9002cf4cd77c752254a76c9648',
  adultUrl: 'https://www.profitableratecpm.com/e2wmujan53?key=04f53b6a5684d0fdd419de033f5756d8',
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