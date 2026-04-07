'use client';

import { useEffect, useRef, useState } from 'react';
import { Check, ChevronLeft, ChevronRight, Quote, Star } from 'lucide-react';
import { Product } from '@/config/products';

interface ProofSectionProps {
  product: Product;
}

export const SATISFIED_CUSTOMERS = 20000;

export function ProofSection({ product }: ProofSectionProps) {
  const proofNumber = SATISFIED_CUSTOMERS;
  const testimonials = (product.testimonials?.filter((item) => item.featured) ?? product.testimonials ?? []).slice(0, 5);
  const benefitFallbacks = [
    'Pogodan za svakodnevnu upotrebu i jednostavnu rutinu',
    'Formula ostaje na kozi i deluje bez ispiranja',
    'Biljna nega za osetljivu i problematicnu kozu',
  ];
  const benefits = (product.benefits.slice(3, 6).length === 3 ? product.benefits.slice(3, 6) : benefitFallbacks).slice(0, 3);
  const [activeIndex, setActiveIndex] = useState(0);
  const [animatedProofNumber, setAnimatedProofNumber] = useState(0);
  const [hasStartedCounting, setHasStartedCounting] = useState(false);
  const proofNumberRef = useRef<HTMLSpanElement | null>(null);

  const activeTestimonial = testimonials[activeIndex];

  useEffect(() => {
    const element = proofNumberRef.current;

    if (!element || hasStartedCounting) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setHasStartedCounting(true);
          observer.disconnect();
        }
      },
      { threshold: 0.55 }
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, [hasStartedCounting]);

  useEffect(() => {
    if (!hasStartedCounting) {
      return;
    }

    const duration = 1600;
    const start = performance.now();
    let frameId = 0;

    const animate = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const easedProgress = 1 - Math.pow(1 - progress, 3);

      setAnimatedProofNumber(Math.round(proofNumber * easedProgress));

      if (progress < 1) {
        frameId = requestAnimationFrame(animate);
      }
    };

    frameId = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(frameId);
  }, [hasStartedCounting, proofNumber]);

  const showPrev = () => {
    setActiveIndex((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));
  };

  const showNext = () => {
    setActiveIndex((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1));
  };

  return (
    <section id="testimonials" className="py-6 md:py-8">
      <div className="container mx-auto px-4">
        <div className="section-card overflow-hidden">
          <div className="grid gap-0 lg:grid-cols-[0.9fr_1.1fr]">
            <div className="relative overflow-hidden px-6 py-6 md:px-8 md:py-7">
              <div className="absolute inset-0 bg-[linear-gradient(145deg,rgba(250,252,251,0.98)_0%,rgba(241,247,244,0.96)_36%,rgba(252,247,243,0.95)_100%)]" />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(96,142,126,0.24),transparent_34%),radial-gradient(circle_at_85%_18%,rgba(255,107,53,0.14),transparent_24%),linear-gradient(180deg,rgba(255,255,255,0.18),transparent_58%)]" />
              <div className="absolute inset-y-0 right-0 w-px bg-gradient-to-b from-transparent via-[#358055]/12 to-transparent" />
              <div className="relative">
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#358055]">Dokaz poverenja</p>
              <div className="mt-4 flex items-end gap-3">
                <span ref={proofNumberRef} className="text-6xl md:text-7xl font-black leading-none text-slate-950">
                  {animatedProofNumber.toLocaleString('sr-RS')}+
                </span>
              </div>
              <p className="mt-4 max-w-xl text-2xl font-bold leading-tight text-slate-900">
                Zadovoljni kupci vec prepoznaju rezultat i redovnu upotrebu <span className="highlight-block">{product.name}</span>
              </p>
              <p className="mt-3 text-base text-slate-600">
                Preko <span className="font-semibold text-slate-900">{proofNumber.toLocaleString('sr-RS')} zadovoljnih kupaca</span>
              </p>

              <div className="mt-6 grid gap-3">
                {benefits.map((benefit) => (
                  <div
                    key={benefit}
                    className="flex items-center gap-3 rounded-2xl border border-white/70 bg-white/82 px-4 py-3 shadow-[0_10px_24px_rgba(53,128,85,0.05)] backdrop-blur-sm"
                  >
                    <div className="rounded-full bg-[#358055]/10 p-1.5">
                      <Check className="h-4 w-4 text-[#358055]" />
                    </div>
                    <p className="text-sm font-medium text-slate-700">{benefit}</p>
                  </div>
                ))}
              </div>
              </div>
            </div>

            <div className="flex items-center justify-center px-6 py-6 md:px-8 md:py-7">
              <div className="w-full max-w-2xl">
                <p className="text-center text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">Izdvojena iskustva</p>

                <div className="mt-4 rounded-[1.8rem] border border-[#358055]/10 bg-white px-6 py-6 shadow-sm">
                  <div className="flex items-center justify-center gap-1 text-amber-400">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`h-4 w-4 ${star <= (activeTestimonial?.rating ?? 5) ? 'fill-current' : 'text-slate-200'}`}
                      />
                    ))}
                  </div>

                  <div className="mt-5 flex justify-center">
                    <div className="rounded-2xl bg-[#F3765D]/10 p-3">
                      <Quote className="h-6 w-6 text-[#F3765D]" />
                    </div>
                  </div>

                  <p className="mx-auto mt-5 max-w-xl text-center text-lg leading-8 text-slate-700">
                    &ldquo;
                    {activeTestimonial?.text ??
                      `${product.name} je formulisan tako da spoji redovnu upotrebu, prirodne sastojke i jednostavnu rutinu.`}
                    &rdquo;
                  </p>

                  <div className="mt-5 text-center">
                    <p className="font-semibold text-slate-900">{activeTestimonial?.name ?? 'Dermotin kupci'}</p>
                    <p className="text-sm text-slate-500">{activeTestimonial?.city ?? 'Verifikovana iskustva kupaca'}</p>
                  </div>

                  {testimonials.length > 1 && (
                    <div className="mt-6 flex items-center justify-center gap-4">
                      <button
                        type="button"
                        onClick={showPrev}
                        className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#358055]/12 bg-white text-slate-600 transition-colors hover:border-[#F3765D]/40 hover:text-[#F3765D]"
                        aria-label="Previous testimonial"
                      >
                        <ChevronLeft className="h-5 w-5" />
                      </button>

                      <div className="flex items-center gap-2">
                        {testimonials.map((item, index) => (
                          <button
                            key={item.id}
                            type="button"
                            onClick={() => setActiveIndex(index)}
                            className={`h-2.5 rounded-full transition-all ${
                              index === activeIndex ? 'w-8 bg-[#F3765D]' : 'w-2.5 bg-slate-300 hover:bg-slate-400'
                            }`}
                            aria-label={`Go to testimonial ${index + 1}`}
                          />
                        ))}
                      </div>

                      <button
                        type="button"
                        onClick={showNext}
                        className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#358055]/12 bg-white text-slate-600 transition-colors hover:border-[#F3765D]/40 hover:text-[#F3765D]"
                        aria-label="Next testimonial"
                      >
                        <ChevronRight className="h-5 w-5" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
