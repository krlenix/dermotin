import { getRequestConfig } from 'next-intl/server';

export default getRequestConfig(async ({ requestLocale }) => {
  // This typically corresponds to the `[locale]` segment
  let locale = await requestLocale;

  // Ensure that a valid locale is used
  if (!locale || !['rs', 'ba', 'hr', 'me'].includes(locale)) { // Serbia, Bosnia, Croatia, and Montenegro
    locale = 'rs';
  }

  return {
    locale,
    messages: (await import(`./messages/${locale}.json`)).default
  };
});
