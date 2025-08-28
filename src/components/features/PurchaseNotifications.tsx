'use client';

import { useState, useEffect, useMemo } from 'react';
import { toast } from 'sonner';
import { ShoppingCart } from 'lucide-react';
import { useTranslations } from 'next-intl';

interface PurchaseNotification {
  id: string;
  customerName: string;
  location: string;
  productName: string;
  quantity: number;
  timeAgo: string;
  verified: boolean;
}

interface PurchaseNotificationsProps {
  className?: string;
}

export function PurchaseNotifications({ }: PurchaseNotificationsProps) {
  const t = useTranslations();
  const [isClient, setIsClient] = useState(false);
  const [stockCount, setStockCount] = useState(47);

  // Sample purchase data - this would normally come from your backend
  const samplePurchases: PurchaseNotification[] = useMemo(() => [
    {
      id: '1',
      customerName: 'Marija S.',
      location: t('locations.belgrade'),
      productName: `FUNGEL - ${t('purchase_notifications.packages_3')}`,
      quantity: 3,
      timeAgo: t('purchase_notifications.time_ago_2_min'),
      verified: true
    },
    {
      id: '2',
      customerName: 'Stefan M.',
      location: t('locations.novi_sad'),
      productName: `FUNGEL - ${t('purchase_notifications.packages_1')}`,
      quantity: 1,
      timeAgo: t('purchase_notifications.time_ago_8_min'),
      verified: true
    },
    {
      id: '3',
      customerName: 'Ana P.',
      location: t('locations.nis'),
      productName: `FUNGEL - ${t('purchase_notifications.packages_2')}`,
      quantity: 2,
      timeAgo: t('purchase_notifications.time_ago_12_min'),
      verified: false
    },
    {
      id: '4',
      customerName: 'Petar J.',
      location: t('locations.kragujevac'),
      productName: `FUNGEL - ${t('purchase_notifications.packages_1')}`,
      quantity: 1,
      timeAgo: t('purchase_notifications.time_ago_18_min'),
      verified: true
    },
    {
      id: '5',
      customerName: 'Milica R.',
      location: t('locations.subotica'),
      productName: `FUNGEL - ${t('purchase_notifications.packages_2')}`,
      quantity: 2,
      timeAgo: t('purchase_notifications.time_ago_25_min'),
      verified: false
    },
    {
      id: '6',
      customerName: 'Aleksandar T.',
      location: t('locations.pancevo'),
      productName: `FUNGEL - ${t('purchase_notifications.packages_1')}`,
      quantity: 1,
      timeAgo: t('purchase_notifications.time_ago_31_min'),
      verified: true
    }
  ], [t]);

  useEffect(() => {
    setIsClient(true);
    // Get from session storage when client loads
    const stored = sessionStorage.getItem('fungel-stock-count');
    if (stored) {
      setStockCount(parseInt(stored));
    }
  }, []);

  useEffect(() => {
    // Update session storage when stock changes
    if (isClient) {
      sessionStorage.setItem('fungel-stock-count', stockCount.toString());
    }
  }, [stockCount, isClient]);

  useEffect(() => {
    if (!isClient) return;

    const showNotification = () => {
      const randomIndex = Math.floor(Math.random() * samplePurchases.length);
      const randomNotification = samplePurchases[randomIndex];

      // Show toast notification with shopping cart icon and stock info
      toast.success(
        `${randomNotification.customerName} iz ${randomNotification.location}`,
        {
          description: `${t('purchase_notifications.just_bought')} ${randomNotification.productName} ${randomNotification.timeAgo} • ${t('purchase_notifications.in_stock')}: ${stockCount} ${t('purchase_notifications.pieces')}`,
          duration: 6000,
          icon: <ShoppingCart className="h-4 w-4" />
        }
      );

      // Simulate stock decrease
      if (Math.random() > 0.7) { // 30% chance to decrease stock
        setStockCount(prev => Math.max(1, prev - 1));
      }
    };

    // Show first notification after 8 seconds
    const initialTimeout = setTimeout(showNotification, 8000);

    // Then show notifications every 45-90 seconds (much less frequent)
    const interval = setInterval(() => {
      showNotification();
    }, Math.random() * 45000 + 45000); // 45-90 seconds

    return () => {
      clearTimeout(initialTimeout);
      clearInterval(interval);
    };
  }, [samplePurchases, stockCount, t, isClient]);

  // Component now uses toast notifications instead of popup cards
  return null;
}