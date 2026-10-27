'use client';

import { useEffect, useMemo, useState } from 'react';

import { getProductsForLocale, getProductVariantsForCountry, type Product } from '@/config/products';
import type { CountryConfig } from '@/config/countries';
import type { ViberOffer } from '@/config/viber-offers';
import { getLanderContent, type LanderContent } from '@/config/lander-content';
import { getProductProof } from '@/config/store-proof';
import { CheckoutLander } from './CheckoutLander';
import type { BundlePart } from './BundleContents';

interface ViberLandingProps {
  offer: ViberOffer;
  product: Product;
  countryConfig: CountryConfig;
  locale: string;
}

/**
 * Kratka Viber stranica u stilu prodajne stranice: ponuda → prednosti → cena → forma.
 * Bez pixela i bez CAPI-ja (channel="viber"), bez navigacije koja odvodi sa ponude.
 */
export function ViberLanding({ offer, product, countryConfig, locale }: ViberLandingProps) {
  const [parts, setParts] = useState<BundlePart[]>([]);
  const [campaign, setCampaign] = useState(offer.slug);

  useEffect(() => {
    const utm = new URLSearchParams(window.location.search).get('utm_campaign');
    if (utm) setCampaign(utm.slice(0, 100));
  }, []);

  useEffect(() => {
    let cancelled = false;
    getProductsForLocale(locale).then((all) => {
      if (cancelled || !product.bundleItems) return;
      setParts(
        product.bundleItems.flatMap((item) => {
          const component = all[item.productId];
          if (!component) return [];
          const variants = getProductVariantsForCountry(component, locale);
          const variant = variants.find((v) => v.id === item.variantId) || variants[0];
          return [{ product: component, variant, quantity: item.quantity, gratis: item.gratis === true }];
        })
      );
    });
    return () => {
      cancelled = true;
    };
  }, [locale, product]);

  // Sadržaj: Viber naslov i tačke + dokazi/sastojci sa prodajne stranice proizvoda
  const content = useMemo<LanderContent | null>(() => {
    const base = getLanderContent(product.id);
    if (!base) return null;
    const dash = offer.headline.indexOf(' — ');
    const hero: LanderContent['hero'] =
      dash > 0
        ? [
            { text: offer.headline.slice(0, dash), mark: 'green' },
            { text: offer.headline.slice(dash + 3), mark: 'coral' },
          ]
        : [{ text: offer.headline, mark: 'green' }];
    return { ...base, hero, benefits: offer.bullets, benefitsTitle: undefined };
  }, [offer, product.id]);

  const proof = getProductProof(product.id);
  if (!content) return null;

  return (
    <CheckoutLander
      product={product}
      content={content}
      countryConfig={countryConfig}
      locale={locale}
      bundleParts={parts}
      shots={proof?.shots}
      reviewsCount={proof?.reviewsCount}
      channel="viber"
      campaign={campaign}
      compact
      kicker={offer.kicker}
      formTitle={offer.formTitle}
    />
  );
}
