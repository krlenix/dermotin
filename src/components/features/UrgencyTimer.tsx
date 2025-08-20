'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Clock } from 'lucide-react';

interface UrgencyTimerProps {
  duration: number; // Duration in hours
  className?: string;
}

export function UrgencyTimer({ duration, className }: UrgencyTimerProps) {
  const t = useTranslations();
  const [timeLeft, setTimeLeft] = useState({
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  const [isTicking, setIsTicking] = useState(false);

  useEffect(() => {
    // Calculate end time (duration hours from now)
    const endTime = new Date();
    endTime.setHours(endTime.getHours() + duration);
    const totalDuration = duration * 60 * 60 * 1000; // Total duration in milliseconds

    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = endTime.getTime() - now;

      if (distance > 0) {
        const hours = Math.floor(distance / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        setTimeLeft({ hours, minutes, seconds });
        
        // Trigger ticking animation on each second
        setIsTicking(true);
        setTimeout(() => setIsTicking(false), 200);
      } else {
        setTimeLeft({ hours: 0, minutes: 0, seconds: 0 });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [duration]);



  return (
    <div className={`bg-gradient-to-br from-red-50 to-orange-100 rounded-xl p-6 border-2 border-orange-300 shadow-lg ${className}`}>
      <div className="text-center">
        {/* Title */}
        <div className="flex items-center justify-center gap-3 mb-6">
          <Clock className={`h-7 w-7 text-orange-600 ${isTicking ? 'animate-pulse' : ''}`} />
          <span className="text-2xl font-bold text-orange-800">{t('urgency.action_expires')}</span>
        </div>

        {/* Large Time Display */}
        <div className="flex justify-center gap-4 mb-6">
          {timeLeft.hours > 0 && (
            <div className="bg-gradient-to-b from-orange-500 to-red-500 text-white rounded-xl px-6 py-4 min-w-[80px] shadow-lg">
              <div className="text-4xl font-bold font-mono">
                {timeLeft.hours.toString().padStart(2, '0')}
              </div>
              <div className="text-sm font-medium mt-1">{t('urgency.hours')}</div>
            </div>
          )}
          <div className="bg-gradient-to-b from-orange-500 to-red-500 text-white rounded-xl px-6 py-4 min-w-[80px] shadow-lg">
            <div className="text-4xl font-bold font-mono">
              {timeLeft.minutes.toString().padStart(2, '0')}
            </div>
            <div className="text-sm font-medium mt-1">{t('urgency.minutes')}</div>
          </div>
          <div className="bg-gradient-to-b from-orange-500 to-red-500 text-white rounded-xl px-6 py-4 min-w-[80px] shadow-lg">
            <div className="text-4xl font-bold font-mono">
              {timeLeft.seconds.toString().padStart(2, '0')}
            </div>
            <div className="text-sm font-medium mt-1">{t('urgency.seconds')}</div>
          </div>
        </div>

        {/* Urgency Message */}
        <div className="text-lg font-bold text-orange-700">
          {t('urgency.dont_miss')}
        </div>
      </div>
    </div>
  );
}
