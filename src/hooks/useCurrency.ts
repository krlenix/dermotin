'use client';

import { useState, useEffect } from 'react';
import { SupportedCurrency, CURRENCY_RATES, convertCurrency, getCurrencySymbol } from '@/config/countries';

export function useCurrency(defaultCurrency: SupportedCurrency = 'RSD') {
  const [currency, setCurrency] = useState<SupportedCurrency>(defaultCurrency);

  useEffect(() => {
    // Try to get currency from localStorage when other currencies are available
    const savedCurrency = localStorage.getItem('preferred-currency') as SupportedCurrency;
    if (savedCurrency && CURRENCY_RATES[savedCurrency]) {
      setCurrency(savedCurrency);
    }
  }, []);

  const changeCurrency = (newCurrency: SupportedCurrency) => {
    setCurrency(newCurrency);
    localStorage.setItem('preferred-currency', newCurrency);
  };

  const formatPrice = (amount: number, fromCurrency: SupportedCurrency = 'RSD') => {
    // If the amount is already in the correct currency, don't convert
    const finalAmount = fromCurrency === currency ? amount : convertCurrency(amount, fromCurrency, currency);
    const symbol = getCurrencySymbol(currency);
    
    return new Intl.NumberFormat('sr-RS', {
      style: 'decimal',
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(finalAmount) + ' ' + symbol;
  };

  const convertPrice = (amount: number, fromCurrency: SupportedCurrency = 'RSD') => {
    return convertCurrency(amount, fromCurrency, currency);
  };

  return {
    currency,
    changeCurrency,
    formatPrice,
    convertPrice,
    currencySymbol: getCurrencySymbol(currency)
  };
}
