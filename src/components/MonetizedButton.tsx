import React from 'react';
import { Button } from './ui/button';
import { useMonetization, PlatformType } from '../hooks/useMonetization';
import { Loader2 } from 'lucide-react';

interface MonetizedButtonProps {
  platformType: PlatformType;
  isConversion?: boolean;
  originalText?: string;
  onClick?: () => void | Promise<void>;
  disabled?: boolean;
  loading?: boolean;
  className?: string;
  size?: 'default' | 'sm' | 'lg' | 'icon';
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  children?: React.ReactNode;
  hasValidUrl?: boolean;
  onMonetizationComplete?: () => void;
}

export const MonetizedButton: React.FC<MonetizedButtonProps> = ({
  platformType,
  isConversion = false,
  originalText = 'Download',
  onClick,
  disabled = false,
  loading = false,
  className = '',
  size = 'default',
  variant = 'default',
  children,
  hasValidUrl = true,
  onMonetizationComplete
}) => {
  const {
    clickCount,
    isMonetizationComplete,
    handleMonetizationClick,
    getButtonText,
    getClicksRequired
  } = useMonetization();

  const handleClick = async () => {
    if (loading || disabled) return;

    // If monetization is not complete, handle monetization click
    if (!isMonetizationComplete) {
      const isComplete = handleMonetizationClick(platformType, isConversion);
      if (!isComplete) {
        return; // Don't proceed with the actual action yet
      }
      
      // Call the callback when monetization is complete
      if (onMonetizationComplete) {
        onMonetizationComplete();
      }
    }

    // Monetization is complete, proceed with the actual action
    if (onClick) {
      await onClick();
    }
  };

  const buttonText = getButtonText(platformType, isConversion, originalText, hasValidUrl);
  const clicksRequired = getClicksRequired(platformType, isConversion);
  const isButtonDisabled = disabled || loading;
  

  
  // Add visual styling based on monetization state
  const buttonVariant = isMonetizationComplete ? variant : 'outline';
  const buttonClassName = `${className} ${!isMonetizationComplete ? 'border-yellow-500 text-yellow-500 hover:bg-yellow-500/10' : ''}`;
  
  // Calculate progress for visual indicator
  const progressPercentage = isMonetizationComplete ? 100 : (clickCount / clicksRequired) * 100;

  return (
    <div className="relative">
      <Button
        onClick={handleClick}
        disabled={isButtonDisabled}
        className={buttonClassName}
        size={size}
        variant={buttonVariant}
      >
        {loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Please wait...
          </>
        ) : (
          children || buttonText
        )}
      </Button>
      
      {/* Progress bar for monetization */}
      {!isMonetizationComplete && !loading && (
        <div className="absolute bottom-0 left-0 h-1 bg-yellow-500 transition-all duration-300 ease-out" 
             style={{ width: `${progressPercentage}%` }} />
      )}
    </div>
  );
}; 