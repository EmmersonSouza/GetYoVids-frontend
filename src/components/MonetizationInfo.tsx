import React from 'react';
import { AlertCircle, Info } from 'lucide-react';
import { Alert, AlertDescription } from './ui/alert';

interface MonetizationInfoProps {
  platformType: 'adult' | 'regular';
  isConversion?: boolean;
  className?: string;
}

export const MonetizationInfo: React.FC<MonetizationInfoProps> = ({
  platformType,
  isConversion = false,
  className = ''
}) => {
  const clicksRequired = isConversion ? 2 : 3;
  const platformTypeText = platformType === 'adult' ? 'adult content' : 'regular content';

  return (
    <Alert className={`mb-4 ${className}`}>
      <Info className="h-4 w-4" />
      <AlertDescription>
        <strong>Monetization Notice:</strong> To support our free service, you need to click the download/convert button{' '}
        <strong>{clicksRequired} times</strong>. Each click will open a sponsor page in a new tab. 
        This helps us keep the service free for everyone. Thank you for your support!
      </AlertDescription>
    </Alert>
  );
}; 