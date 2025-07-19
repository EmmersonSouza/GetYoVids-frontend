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
  children
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
    }

    // Monetization is complete, proceed with the actual action
    if (onClick) {
      await onClick();
    }
  };

  const buttonText = getButtonText(platformType, isConversion, originalText);
  const clicksRequired = getClicksRequired(platformType, isConversion);
  const isButtonDisabled = disabled || loading || (!isMonetizationComplete && clickCount === 0);

  return (
    <Button
      onClick={handleClick}
      disabled={isButtonDisabled}
      className={className}
      size={size}
      variant={variant}
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
  );
}; 