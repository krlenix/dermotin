'use client';

import { useRef } from 'react';
import { useTranslations } from 'next-intl';
import { BadgeCheck, ChevronLeft, ChevronRight, Star } from 'lucide-react';
import { Product } from '@/config/products';

interface ReviewsSectionProps {
  product: Product;
}

export function ReviewsSection({ product }: ReviewsSectionProps) {
  const t = useTranslations();
  const scrollerRef = useRef<HTMLDivElement | null>(null);

  const reviews = product.testimonials ?? [];

  if (reviews.length === 0) {
    return null;
  }

  const reviewCount = reviews.length;
  const averageRating = reviews.reduce((sum, review) => sum + review.rating, 0) / reviewCount;
  const ratingBuckets = [5, 4, 3, 2, 1].map((stars) => {
    const count = reviews.filter((review) => review.rating === stars).length;
    return { stars, count, percent: (count / reviewCount) * 100 };
  });

  const formatDate = (value: string) => {
    const parsed = new Date(value);
    if (Number.isNaN(parsed.getTime())) return value;
    return parsed.toLocaleDateString('sr-RS', { day: 'numeric', month: 'long', year: 'numeric' });
  };

  const scrollByPage = (direction: -1 | 1) => {
    const scroller = scrollerRef.current;
    if (!scroller) return;
    scroller.scrollBy({ left: direction * scroller.clientWidth * 0.9, behavior: 'smooth' });
  };

  return (
    <section id="testimonials" className="scroll-mt-28 py-6 md:py-8">
      <div className="container mx-auto px-4">
        <div className="section-card overflow-hidden px-5 py-6 md:px-8 md:py-8">
          <div className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
            {/* Rating summary */}
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#358055]">
                {t('testimonials_ui.customer_reviews')}
              </p>
              <div className="mt-4 flex items-center gap-3">
                <span className="text-5xl font-black leading-none text-slate-950 md:text-6xl">
                  {averageRating.toFixed(1)}/5
                </span>
                <div className="flex text-amber-400">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`h-6 w-6 ${
                        star <= Math.round(averageRating)
                          ? 'fill-current'
                          : 'fill-slate-200 text-slate-200'
                      }`}
                    />
                  ))}
                </div>
              </div>
              <p className="mt-2 text-sm font-semibold text-slate-500">
                {t('testimonials_ui.review_count_label', { count: reviewCount })}
              </p>

              <div className="mt-6 space-y-2.5">
                {ratingBuckets.map((bucket) => (
                  <div key={bucket.stars} className="flex items-center gap-3">
                    <span className="w-3 shrink-0 text-right text-sm font-bold text-slate-700">
                      {bucket.stars}
                    </span>
                    <Star className="h-3.5 w-3.5 shrink-0 fill-current text-amber-400" />
                    <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-100">
                      <div
                        className="h-full rounded-full bg-[#358055] transition-all duration-700"
                        style={{ width: `${bucket.percent}%` }}
                      />
                    </div>
                    <span className="w-6 shrink-0 text-xs font-semibold text-slate-400">
                      {bucket.count}
                    </span>
                  </div>
                ))}
              </div>

              <p className="mt-6 text-xs leading-5 text-slate-400">
                {t('testimonials_ui.verified_note')}
              </p>
            </div>

            {/* Review cards */}
            <div className="min-w-0">
              <div
                ref={scrollerRef}
                className="scrollbar-hide -mx-1 flex snap-x snap-mandatory gap-3 overflow-x-auto px-1 pb-1"
              >
                {reviews.map((review) => (
                  <article
                    key={review.id}
                    className="flex w-[17rem] shrink-0 snap-start flex-col rounded-[1.3rem] border border-[#358055]/10 bg-white px-5 py-5 shadow-[0_10px_26px_rgba(15,23,42,0.04)] sm:w-[19rem]"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="truncate text-sm font-black text-slate-900">
                          {review.name}, {review.city}
                        </p>
                        {review.verified && (
                          <p className="mt-0.5 inline-flex items-center gap-1 text-[11px] font-bold text-[#358055]">
                            <BadgeCheck className="h-3.5 w-3.5" />
                            {t('testimonials_ui.verified_buyer')}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="mt-2.5 flex text-amber-400">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`h-3.5 w-3.5 ${
                            star <= review.rating ? 'fill-current' : 'fill-slate-200 text-slate-200'
                          }`}
                        />
                      ))}
                    </div>

                    <p className="mt-3 flex-1 text-sm leading-6 text-slate-600">{review.text}</p>

                    <p className="mt-4 text-xs font-medium text-slate-400">
                      {formatDate(review.dateAdded)}
                    </p>
                  </article>
                ))}
              </div>

              {reviews.length > 1 && (
                <div className="mt-4 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => scrollByPage(-1)}
                    aria-label="Previous reviews"
                    className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#358055]/12 bg-white text-slate-600 transition-colors hover:border-[#F3765D]/40 hover:text-[#F3765D]"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => scrollByPage(1)}
                    aria-label="Next reviews"
                    className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#358055]/12 bg-white text-slate-600 transition-colors hover:border-[#F3765D]/40 hover:text-[#F3765D]"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
