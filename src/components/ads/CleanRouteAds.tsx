import React, { useEffect, useRef } from 'react';

// Global ad queue to prevent conflicts
let adQueue: Array<() => void> = [];
let isProcessingAd = false;

const processAdQueue = () => {
  if (isProcessingAd || adQueue.length === 0) return;
  
  isProcessingAd = true;
  const nextAd = adQueue.shift();
  
  if (nextAd) {
    nextAd();
    setTimeout(() => {
      isProcessingAd = false;
      processAdQueue();
    }, 100);
  }
};

interface CleanRouteAdProps {
  size: '728x90' | '160x600' | '300x250' | '970x90' | '320x50' | '160x300' | '468x60';
  className?: string;
}

const CleanRouteAd: React.FC<CleanRouteAdProps> = ({ size, className = '' }) => {
  const adRef = useRef<HTMLDivElement>(null);
  const uniqueId = useRef(`ad-${Math.random().toString(36).substr(2, 9)}`);

  useEffect(() => {
    if (adRef.current) {
      adRef.current.innerHTML = '';

      let adKey = '';
      let width = 0;
      let height = 0;

      switch (size) {
        case '728x90':
          adKey = 'e12fe3309289642d85f214c8a89e2a3c';
          width = 728;
          height = 90;
          break;
        case '160x600':
          adKey = '6b7813cca59ab943a06adc91b6530be2';
          width = 160;
          height = 600;
          break;
        case '300x250':
          adKey = '02ec90615c00e9e8df9ffab6e17b6ed6';
          width = 300;
          height = 250;
          break;
        case '970x90':
          adKey = 'e12fe3309289642d85f214c8a89e2a3c';
          width = 970;
          height = 90;
          break;
        case '320x50':
          adKey = '3bdd26e502dfbee6143c92a2b4873ca7';
          width = 320;
          height = 50;
          break;
        case '160x300':
          adKey = '976917386bce53ff669b047297faa7e4';
          width = 160;
          height = 300;
          break;
        case '468x60':
          adKey = '02ec90615c00e9e8df9ffab6e17b6ed6'; // Using 300x250 key for now, replace with actual 468x60 key
          width = 468;
          height = 60;
          break;
      }

      // Create a unique container ID
      const containerId = `ad-container-${uniqueId.current}`;
      adRef.current.id = containerId;

      // Add this ad to the queue
      adQueue.push(() => {
        if (adRef.current) {
          // Clear any existing content
          adRef.current.innerHTML = '';
          
          // Create and inject the first script
          const script1 = document.createElement('script');
          script1.type = 'text/javascript';
          script1.innerHTML = `
            atOptions = {
              'key' : '${adKey}',
              'format' : 'iframe',
              'height' : ${height},
              'width' : ${width},
              'params' : {}
            };
          `;
          adRef.current.appendChild(script1);

          // Create and inject the second script
          const script2 = document.createElement('script');
          script2.type = 'text/javascript';
          script2.src = `//www.highperformanceformat.com/${adKey}/invoke.js`;
          
          // Add error handling and timeout
          script2.onerror = () => {
            console.warn(`Ad failed to load for key: ${adKey}`);
            if (adRef.current) {
              adRef.current.innerHTML = `<div class="text-gray-400 text-sm">Ad loading...</div>`;
            }
          };
          
          script2.onload = () => {
            console.log(`Ad loaded successfully for key: ${adKey}`);
          };
          
          adRef.current.appendChild(script2);
          
          // Set a timeout to show loading message if ad doesn't appear
          setTimeout(() => {
            if (adRef.current && adRef.current.children.length === 2) {
              // Only show loading if no iframe was created
              const hasIframe = adRef.current.querySelector('iframe');
              if (!hasIframe) {
                console.warn(`Ad did not load within 3 seconds for key: ${adKey}`);
                adRef.current.innerHTML = `<div class="text-gray-400 text-sm">Ad loading...</div>`;
                
                // Try to reload the ad after a delay
                setTimeout(() => {
                  if (adRef.current) {
                    console.log(`Retrying ad load for key: ${adKey}`);
                    adRef.current.innerHTML = '';
                    
                    // Re-inject the scripts
                    const retryScript1 = document.createElement('script');
                    retryScript1.type = 'text/javascript';
                    retryScript1.innerHTML = `
                      atOptions = {
                        'key' : '${adKey}',
                        'format' : 'iframe',
                        'height' : ${height},
                        'width' : ${width},
                        'params' : {}
                      };
                    `;
                    adRef.current.appendChild(retryScript1);

                    const retryScript2 = document.createElement('script');
                    retryScript2.type = 'text/javascript';
                    retryScript2.src = `//www.highperformanceformat.com/${adKey}/invoke.js`;
                    adRef.current.appendChild(retryScript2);
                  }
                }, 2000);
              }
            }
          }, 3000);
        }
      });

      // Start processing the queue
      processAdQueue();

      return () => {
        if (adRef.current) {
          adRef.current.innerHTML = '';
        }
      };
    }
  }, [size]);

  const getSizeClasses = () => {
    switch (size) {
      case '728x90':
        return "min-h-[90px] h-[90px] w-full flex items-center justify-center";
      case '160x600':
        return "min-h-[600px] h-[600px] w-[160px] flex items-center justify-center";
      case '300x250':
        return "min-h-[250px] h-[250px] w-[300px] flex items-center justify-center";
      case '970x90':
        return "min-h-[90px] h-[90px] w-full flex items-center justify-center";
      case '320x50':
        return "min-h-[50px] h-[50px] w-[320px] flex items-center justify-center";
      case '160x300':
        return "min-h-[300px] h-[300px] w-[160px] flex items-center justify-center";
      case '468x60':
        return "min-h-[60px] h-[60px] w-[468px] flex items-center justify-center";
      default:
        return "min-h-[90px] h-[90px] w-full flex items-center justify-center";
    }
  };

  return (
    <div className={`bg-gray-800 border border-gray-700 rounded-lg p-4 text-center ${className}`}>
      <div ref={adRef} className={getSizeClasses()} />
    </div>
  );
};

export default CleanRouteAd; 