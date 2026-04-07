'use client';

import { ArrowRight } from 'lucide-react';

interface CtaDividerProps {
  title?: string;
  subtitle?: string;
  buttonLabel: string;
  onClick: () => void;
}

export function CtaDivider({ title, subtitle, buttonLabel, onClick }: CtaDividerProps) {
  return (
    <section className="relative left-1/2 right-1/2 w-screen -translate-x-1/2 py-0">
      <div className="cta-divider relative overflow-hidden px-4 py-9 text-center md:py-12">
        {title ? (
          <h3 className="mx-auto max-w-3xl text-2xl font-black leading-tight text-white md:text-3xl">
            {title}
          </h3>
        ) : null}

        {subtitle ? (
          <p className="mx-auto mt-2 max-w-2xl text-sm font-medium leading-6 text-white/92 md:text-base">
            {subtitle}
          </p>
        ) : null}

        <button
          type="button"
          onClick={onClick}
          className="mt-4 inline-flex items-center justify-center gap-2 rounded-full bg-white px-7 py-4 text-[13px] font-extrabold uppercase tracking-[0.04em] text-[#358055] shadow-[0_14px_28px_rgba(0,0,0,0.12)] transition-transform duration-300 hover:-translate-y-0.5 md:px-9"
        >
          {buttonLabel}
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </section>
  );
}
