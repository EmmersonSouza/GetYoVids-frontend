import React, { useEffect, useRef } from 'react';

interface AdSpaceProps {
  type: 'horizontal' | 'vertical';
  size?: string;
  className?: string;
  sticky?: boolean;
  priority?: 'high' | 'medium' | 'low';
}

const AdSpace: React.FC<AdSpaceProps> = ({ 
  type, 
  size = type === 'horizontal' ? '728x90' : '300x600',
  className = '',
  sticky = false,
  priority = 'medium'
}) => {
  const adRef = useRef<HTMLDivElement>(null);
  const baseClasses = "bg-gray-800 border border-gray-700 rounded-lg p-4 text-center";
  
  // Dynamic sizing based on type and size prop
  const getSizeClasses = () => {
    if (type === 'horizontal') {
      if (size.includes('970')) return "min-h-[90px] h-[90px] flex items-center justify-center";
      if (size.includes('728')) return "min-h-[90px] h-[90px] flex items-center justify-center";
      if (size.includes('300x250')) return "min-h-[250px] h-[250px] flex items-center justify-center";
      if (size.includes('300x600')) return "min-h-[600px] h-[600px] flex items-center justify-center";
      return "min-h-[90px] h-[90px] flex items-center justify-center"; // default 728x90
    } else {
      // Vertical ads - more responsive heights
      if (size.includes('300x600')) return "min-h-[600px] h-[600px] flex items-center justify-center";
      if (size.includes('300x900')) return "min-h-[900px] h-[900px] flex items-center justify-center";
      if (size.includes('300x1200')) return "min-h-[1200px] h-[1200px] flex items-center justify-center";
      if (size.includes('160x600')) return "min-h-[600px] h-[600px] flex items-center justify-center";
      // Responsive height based on viewport
      return "min-h-[600px] h-[80vh] flex items-center justify-center"; // default responsive
    }
  };
  
  const getPriorityClasses = () => {
    switch (priority) {
      case 'high':
        return "ring-2 ring-yellow-500 ring-opacity-50";
      case 'medium':
        return "ring-1 ring-blue-500 ring-opacity-30";
      case 'low':
        return "";
      default:
        return "";
    }
  };
  
  const containerClasses = sticky ? "sticky top-4" : "";

  // Inject ad scripts for 300x250 size
  useEffect(() => {
    if (size === '300x250' && adRef.current) {
      // Clear any existing content
      adRef.current.innerHTML = '';

      // Create and inject the first script
      const script1 = document.createElement('script');
      script1.type = 'text/javascript';
      script1.innerHTML = `
        atOptions = {
          'key' : '02ec90615c00e9e8df9ffab6e17b6ed6',
          'format' : 'iframe',
          'height' : 250,
          'width' : 300,
          'params' : {}
        };
      `;
      adRef.current.appendChild(script1);

      // Create and inject the second script
      const script2 = document.createElement('script');
      script2.type = 'text/javascript';
      script2.src = '//www.highperformanceformat.com/02ec90615c00e9e8df9ffab6e17b6ed6/invoke.js';
      adRef.current.appendChild(script2);

      // Cleanup function
      return () => {
        if (adRef.current) {
          adRef.current.innerHTML = '';
        }
      };
    }
  }, [size]);

  // Render content based on size
  const renderContent = () => {
    if (size === '300x250') {
      return <div ref={adRef} className="w-full h-full flex items-center justify-center" />;
    }
    
    // Default placeholder for other sizes
    return (
      <div className="text-gray-500">
        <p className="text-sm font-medium mb-2">
          {type === 'horizontal' ? 'Horizontal' : 'Vertical'} Ad Space
        </p>
        <p className="text-xs">{size}</p>
        {priority === 'high' && (
          <p className="text-xs mt-1 text-yellow-500">High Priority</p>
        )}
        {type === 'vertical' && (
          <p className="text-xs mt-1">Large screens only</p>
        )}
      </div>
    );
  };

  return (
    <div className={`${containerClasses} ${className}`}>
      <div className={`${baseClasses} ${getSizeClasses()} ${getPriorityClasses()}`}>
        {renderContent()}
      </div>
    </div>
  );
};

export default AdSpace; 