'use client';

import { Users, Shield } from 'lucide-react';
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
  showTrustBadges = true,
  className 
}: SocialProofProps) {
  const t = useTranslations('social_proof');

  const trustBadges = [
    { icon: Shield, text: t('money_back_guarantee') },
  ];

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Recent Purchases */}
      {recentPurchases > 0 && (
        <Card className="p-4 bg-green-50 border-green-200">
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5 text-green-600" />
            <span className="text-green-800">
              {t('recent_purchases', { count: recentPurchases, timeframe: timeFrame })}
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

    </div>
  );
}
