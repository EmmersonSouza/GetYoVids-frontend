import React from 'react';
import { useLocation } from 'react-router-dom';
import CleanRouteAd from './ads/CleanRouteAds';
import AdultRouteAd from './ads/AdultRouteAds';

interface BannerAdProps {
  className?: string;
}

const BannerAd: React.FC<BannerAdProps> = ({ className = '' }) => {
  const location = useLocation();

  // Determine if current route is adult content
  const isAdultRoute = [
    '/pornhub-downloader',
    '/xvideos-downloader', 
    '/xhamster-downloader',
    '/redgifs-downloader',
    '/youporn-downloader',
    '/spankbang-downloader'
  ].includes(location.pathname);

  // Choose the appropriate ad component
  const AdComponent = isAdultRoute ? AdultRouteAd : CleanRouteAd;

  return (
    <div className={`w-full flex justify-center py-4 ${className}`}>
      <AdComponent size="728x90" />
    </div>
  );
};

export default BannerAd; 