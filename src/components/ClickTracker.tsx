import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

interface ClickTrackerProps {
  onComplete: () => void;
  children: React.ReactNode;
}

const ClickTracker: React.FC<ClickTrackerProps> = ({ onComplete, children }) => {
  const [clicksLeft, setClicksLeft] = useState(3);
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

  const handleClick = () => {
    if (clicksLeft > 0) {
      // For clean routes, open direct link and pop-under
      if (!isAdultRoute) {
        // Open direct link in new tab
        window.open('https://www.profitableratecpm.com/ez1aaw8g?key=51edc43e9af4ba16487654d5ad13b998', '_blank');
        
        // Create and inject pop-under script
        const popUnderScript = document.createElement('script');
        popUnderScript.type = 'text/javascript';
        popUnderScript.src = '//pl27204121.profitableratecpm.com/d0/57/c2/d057c2967ef81828dc840400a9c2c6e6.js';
        document.head.appendChild(popUnderScript);
      }
      
      // Decrease clicks left
      const newClicksLeft = clicksLeft - 1;
      setClicksLeft(newClicksLeft);
      
      // If all clicks completed, call onComplete
      if (newClicksLeft === 0) {
        onComplete();
      }
    }
  };

  return (
    <div onClick={handleClick} style={{ cursor: 'pointer' }}>
      {children}
    </div>
  );
};

export default ClickTracker; 