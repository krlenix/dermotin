'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { CountryConfig, CourierInfo, getAvailableCouriers, getDefaultCourier } from '@/config/countries';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Truck, Check } from 'lucide-react';

interface CourierSelectorProps {
  countryConfig: CountryConfig;
  selectedCourierId?: string;
  onCourierChange?: (courier: CourierInfo) => void;
  className?: string;
}

export function CourierSelector({ 
  countryConfig, 
  selectedCourierId,
  onCourierChange,
  className 
}: CourierSelectorProps) {
  const t = useTranslations();
  const availableCouriers = getAvailableCouriers(countryConfig);
  const defaultCourier = getDefaultCourier(countryConfig);
  
  // Use selectedCourierId if provided, otherwise use default courier
  const [selectedCourier, setSelectedCourier] = useState<CourierInfo>(
    selectedCourierId 
      ? availableCouriers.find(c => c.id === selectedCourierId) || defaultCourier
      : defaultCourier
  );

  const handleCourierChange = (courierId: string) => {
    const courier = availableCouriers.find(c => c.id === courierId);
    if (courier) {
      setSelectedCourier(courier);
      onCourierChange?.(courier);
    }
  };

  // Don't show selector if there's only one courier
  if (availableCouriers.length <= 1) {
    return (
      <div className={`space-y-3 ${className}`}>
        <Label className="text-base font-semibold text-gray-900">
          {t('delivery.courier_title')}
        </Label>
        <Card className="p-4 bg-blue-50 border-blue-200">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white rounded-lg shadow-sm flex items-center justify-center">
              <Image
                src={defaultCourier.logo}
                alt={defaultCourier.name}
                width={40}
                height={40}
                className="w-8 h-8 object-contain"
              />
            </div>
            <div className="flex-1">
              <p className="font-medium text-blue-800">
                {t('delivery.delivery_by')} {defaultCourier.name}
              </p>
              <p className="text-sm text-blue-600">
                {t('delivery.delivery_time')}: {defaultCourier.deliveryTime}
              </p>
            </div>
            <Truck className="h-6 w-6 text-blue-600" />
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      <Label className="text-base font-semibold text-gray-900">
        {t('delivery.select_courier')}
      </Label>
      
      <div className="space-y-3">
        {availableCouriers.map((courier) => {
          const isSelected = selectedCourier.id === courier.id;
          
          return (
            <div
              key={courier.id}
              onClick={() => handleCourierChange(courier.id)}
              className={`
                relative flex items-center gap-4 p-4 border-2 rounded-lg cursor-pointer transition-all
                ${isSelected 
                  ? 'border-blue-500 bg-blue-50 shadow-md' 
                  : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50'
                }
              `}
            >
              {/* Selection Indicator */}
              <div className={`
                w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all
                ${isSelected 
                  ? 'border-blue-500 bg-blue-500' 
                  : 'border-gray-300 bg-white'
                }
              `}>
                {isSelected && (
                  <Check className="w-4 h-4 text-white" />
                )}
              </div>
              
              {/* Courier Logo */}
              <div className={`
                w-12 h-12 rounded-lg shadow-sm flex items-center justify-center transition-all
                ${isSelected ? 'bg-white' : 'bg-gray-50'}
              `}>
                <Image
                  src={courier.logo}
                  alt={courier.name}
                  width={40}
                  height={40}
                  className={`w-8 h-8 object-contain transition-all ${
                    isSelected ? 'opacity-100' : 'opacity-60'
                  }`}
                />
              </div>
              
              {/* Courier Info */}
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <p className={`font-medium transition-all ${
                    isSelected ? 'text-blue-900' : 'text-gray-500'
                  }`}>
                    {courier.name}
                  </p>
                  {courier.isDefault && (
                    <Badge 
                      variant={isSelected ? "default" : "secondary"} 
                      className={`text-xs transition-all ${
                        isSelected ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-500'
                      }`}
                    >
                      {t('delivery.recommended')}
                    </Badge>
                  )}
                </div>
                <p className={`text-sm transition-all ${
                  isSelected ? 'text-blue-700' : 'text-gray-400'
                }`}>
                  {t('delivery.delivery_time')}: {courier.deliveryTime}
                </p>
              </div>
              
              {/* Truck Icon */}
              <Truck className={`h-5 w-5 transition-all ${
                isSelected ? 'text-blue-500' : 'text-gray-300'
              }`} />
            </div>
          );
        })}
      </div>
    </div>
  );
}
