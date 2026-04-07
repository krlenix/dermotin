'use client';

import { MessageCircleMore, Star } from 'lucide-react';
import { Product } from '@/config/products';
import { AnimatedHighlight } from '@/components/ui/AnimatedHighlight';

interface TestimonialsSectionProps {
  product: Product;
}

export function TestimonialsSection({ product }: TestimonialsSectionProps) {
  const testimonials = (product.testimonials ?? []).slice(0, 3);

  return (
    <section id="testimonials" className="py-8 md:py-10">
      <div className="container mx-auto px-4">
        <div className="text-center">
          <span className="highlight-chip-orange">Sta nasi kupci kazu</span>
          <h2 className="mt-4 text-3xl md:text-5xl font-black leading-tight text-slate-950">
            Vizuelno jaci blok za <AnimatedHighlight>iskustva kupaca</AnimatedHighlight>
          </h2>
          <p className="mx-auto mt-4 max-w-3xl text-base md:text-lg text-slate-600">
            Testimonials ostaju iz postojecih podataka za proizvod, ali sada sede u centralnom proof delu sa jacim
            konverzionim naglaskom.
          </p>
        </div>

        <div className="mt-8 rounded-[2rem] border border-[#358055]/12 bg-[linear-gradient(180deg,rgba(245,250,247,0.92),rgba(255,255,255,0.98))] p-4 md:p-5 shadow-[0_18px_45px_rgba(53,128,85,0.06)]">
          <div className="mx-auto mb-5 flex w-fit items-center gap-2 rounded-full bg-[#358055]/10 px-4 py-2 text-[#358055]">
            <MessageCircleMore className="h-4 w-4" />
            <span className="text-xs font-semibold uppercase tracking-[0.16em]">Recenzije i iskustva</span>
          </div>
          <div className="grid gap-4 lg:grid-cols-3">
            {testimonials.map((testimonial) => (
              <div key={testimonial.id} className="rounded-[1.6rem] border border-[#358055]/10 bg-white px-5 py-5 shadow-sm">
                <div className="flex items-center gap-1 text-amber-400">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`h-4 w-4 ${star <= testimonial.rating ? 'fill-current' : 'text-slate-200'}`}
                    />
                  ))}
                </div>
                <p className="mt-4 text-sm leading-7 text-slate-700">&ldquo;{testimonial.text}&rdquo;</p>
                <div className="mt-5 border-t border-slate-100 pt-4">
                  <p className="font-semibold text-slate-900">{testimonial.name}</p>
                  <p className="text-sm text-slate-500">{testimonial.city}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
