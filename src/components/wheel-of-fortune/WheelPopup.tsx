import React from 'react';
import { WheelPopupConfig } from '@/types/wheel';
import { useWheelPopup } from '@/hooks/useWheelPopup';
import { Button } from '@/components/ui/button';

interface WheelPopupProps {
  popupConfig: WheelPopupConfig;
  onClose?: () => void;
}

export const WheelPopup: React.FC<WheelPopupProps> = ({
  popupConfig,
  onClose,
}) => {
  const { isVisible, hidePopup, forceShow, reset } = useWheelPopup(popupConfig);

  // Debug logging
  React.useEffect(() => {
    console.log('🎡 WheelPopup mounted with config:', popupConfig);
    console.log('🎡 isVisible:', isVisible);
  }, [popupConfig, isVisible]);

  const handleClose = () => {
    hidePopup();
    if (onClose) {
      onClose();
    }
  };

  if (!isVisible) {
    return (
      <>
        {/* Development Controls */}
        {process.env.NODE_ENV === 'development' && (
          <div className="fixed bottom-4 right-4 z-50 space-y-2">
            <div className="bg-black/80 text-white p-2 rounded text-xs space-y-1">
              <div>Wheel Popup Controls (Dev)</div>
              <Button
                onClick={forceShow}
                size="sm"
                variant="outline"
                className="w-full text-xs"
              >
                Force Show
              </Button>
              <Button
                onClick={reset}
                size="sm"
                variant="outline"
                className="w-full text-xs"
              >
                Reset Storage
              </Button>
            </div>
          </div>
        )}
      </>
    );
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4"
      data-wheel-popup
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm animate-in fade-in duration-300"
        onClick={handleClose}
      />

      {/* Popup Content */}
      <div className="relative z-10 w-full max-w-[95vw] sm:max-w-2xl animate-in slide-in-from-bottom duration-500">
        {/* Close Button */}
        <div className="absolute -top-4 -right-4 z-20">
          <Button
            onClick={handleClose}
            size="sm"
            variant="outline"
            className="rounded-full w-10 h-10 p-0 bg-white/90 hover:bg-white border-2 border-gray-300 shadow-lg"
          >
            ✕
          </Button>
        </div>

        {/* Wheel Component */}
        {/* <WheelOfFortune
          config={wheelConfig}
          onPrizeWon={handlePrizeWon}
          onClose={handleClose}
          className="animate-in zoom-in duration-700"
        /> */}


      </div>
    </div>
  );
};
