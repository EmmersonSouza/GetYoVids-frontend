import React from 'react';
import { useMonetization } from '../hooks/useMonetization';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';

interface MonetizationDebugProps {
  platformType: 'adult' | 'regular';
  isConversion?: boolean;
}

export const MonetizationDebug: React.FC<MonetizationDebugProps> = ({
  platformType,
  isConversion = false
}) => {
  const {
    clickCount,
    isMonetizationComplete,
    getClicksRequired,
    resetMonetization,
    debugState,
    currentPlatformType,
    currentIsConversion
  } = useMonetization();

  const clicksRequired = getClicksRequired(platformType, isConversion);
  const clicksLeft = clicksRequired - clickCount;

  return (
    <Card className="mb-4 border-yellow-500/20 bg-yellow-500/5">
      <CardHeader>
        <CardTitle className="text-yellow-400 text-sm">
          🔍 Monetization Debug Panel
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div>
            <span className="text-gray-400">Platform Type:</span>
            <Badge variant={platformType === 'adult' ? 'destructive' : 'default'} className="ml-1">
              {platformType}
            </Badge>
          </div>
          <div>
            <span className="text-gray-400">Is Conversion:</span>
            <Badge variant={isConversion ? 'secondary' : 'outline'} className="ml-1">
              {isConversion ? 'Yes' : 'No'}
            </Badge>
          </div>
          <div>
            <span className="text-gray-400">Clicks Required:</span>
            <span className="text-white ml-1">{clicksRequired}</span>
          </div>
          <div>
            <span className="text-gray-400">Clicks Completed:</span>
            <span className="text-white ml-1">{clickCount}</span>
          </div>
          <div>
            <span className="text-gray-400">Clicks Left:</span>
            <span className="text-white ml-1">{clicksLeft}</span>
          </div>
          <div>
            <span className="text-gray-400">Status:</span>
            <Badge variant={isMonetizationComplete ? 'default' : 'secondary'} className="ml-1">
              {isMonetizationComplete ? 'Complete' : 'In Progress'}
            </Badge>
          </div>
        </div>
        
        <div className="text-xs text-gray-400">
          <div>Current Platform: {currentPlatformType || 'None'}</div>
          <div>Current Conversion: {currentIsConversion ? 'Yes' : 'No'}</div>
        </div>

        <div className="flex gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={debugState}
            className="text-xs"
          >
            Log State
          </Button>
          <Button
            size="sm"
            variant="destructive"
            onClick={resetMonetization}
            className="text-xs"
          >
            Reset
          </Button>
        </div>

        <div className="text-xs text-gray-500">
          Open browser console to see detailed logs
        </div>
      </CardContent>
    </Card>
  );
}; 