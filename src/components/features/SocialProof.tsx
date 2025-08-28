'use client';

import { useState, useEffect } from 'react';
import { Users, Star, Shield, CheckCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { useTranslations } from 'next-intl';

interface SocialProofProps {
  recentPurchases?: number;
  timeFrame?: string;
  showReviews?: boolean;
  showTrustBadges?: boolean;
  className?: string;
}

export function SocialProof({ 
  recentPurchases = 0,
  timeFrame = '24h',
  showReviews = true,
  showTrustBadges = true,
  className 
}: SocialProofProps) {
  const t = useTranslations('social_proof');
  const [currentPurchases, setCurrentPurchases] = useState(recentPurchases);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient) return;

    // Simulate live purchase updates
    const interval = setInterval(() => {
      if (Math.random() > 0.7) {
        setCurrentPurchases(prev => prev + 1);
      }
    }, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, [isClient]);

  const trustBadges = [
    { icon: Shield, text: t('money_back_guarantee') },
    { icon: CheckCircle, text: t('verified_reviews') },
    { icon: Star, text: t('customer_rating') + ': 4.97/5' },
  ];

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Recent Purchases */}
      {recentPurchases > 0 && (
        <Card className="p-4 bg-green-50 border-green-200">
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5 text-green-600" />
            <span className="text-green-800">
              {t('recent_purchases', { count: currentPurchases, timeframe: timeFrame })}
            </span>
          </div>
        </Card>
      )}

      {/* Trust Badges */}
      {showTrustBadges && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
          {trustBadges.map((badge, index) => (
            <div key={index} className="flex items-center gap-2 p-2 bg-blue-50 rounded-lg">
              <badge.icon className="h-4 w-4 text-blue-600" />
              <span className="text-blue-800 text-sm font-medium">{badge.text}</span>
            </div>
          ))}
        </div>
      )}

      {/* Customer Reviews Summary */}
      {showReviews && (
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex text-yellow-400">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} className="h-4 w-4 fill-current" />
                ))}
              </div>
              <span className="text-sm font-medium">4.97/5</span>
            </div>
            <Badge variant="secondary">
              {t('based_on_reviews', { count: 235 })}
            </Badge>
          </div>
        </Card>
      )}
    </div>
  );
}
