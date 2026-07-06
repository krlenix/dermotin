'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Product, INGREDIENTS } from '@/config/products';
import { cn } from '@/lib/utils';
import {
  ChevronDown,
  Leaf,
  Book,
  AlertTriangle,
  Sparkles,
  Beaker,
  Droplets,
  Star,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

interface ProductDetailsAccordionProps {
  product: Product;
  className?: string;
}

interface AccordionItem {
  id: string;
  title: string;
  icon: React.ReactNode;
  content: React.ReactNode;
}

const ITEMS_PER_PAGE = 6;

export function ProductDetailsAccordion({ product, className }: ProductDetailsAccordionProps) {
  const t = useTranslations();
  const [openItems, setOpenItems] = useState<Set<string>>(new Set(['ingredients']));

  const toggleItem = (id: string) => {
    const newOpenItems = new Set(openItems);
    if (newOpenItems.has(id)) {
      newOpenItems.delete(id);
    } else {
      newOpenItems.add(id);
    }
    setOpenItems(newOpenItems);
  };

  const [activeTab, setActiveTab] = useState<'key' | 'all'>('key');
  const [currentPage, setCurrentPage] = useState(0);
  const [currentAllPage, setCurrentAllPage] = useState(0);

  useEffect(() => {
    setCurrentPage(0);
    setCurrentAllPage(0);
  }, [activeTab]);

  const renderIngredients = () => {
    const keyIngredients = product.ingredients.filter((id) => {
      const ingredient = INGREDIENTS[id];
      return (
        ingredient?.category === 'herbal_extract' ||
        ingredient?.category === 'essential_oil' ||
        ingredient?.category === 'active_compound'
      );
    });

    const totalPages = Math.ceil(keyIngredients.length / ITEMS_PER_PAGE);
    const totalAllPages = Math.ceil(product.ingredients.length / ITEMS_PER_PAGE);

    const currentPageIngredients = keyIngredients.slice(
      currentPage * ITEMS_PER_PAGE,
      (currentPage + 1) * ITEMS_PER_PAGE
    );

    const currentAllPageIngredients = product.ingredients.slice(
      currentAllPage * ITEMS_PER_PAGE,
      (currentAllPage + 1) * ITEMS_PER_PAGE
    );

    const getCategoryIcon = (category: string) => {
      switch (category) {
        case 'herbal_extract':
          return <Leaf className="h-4 w-4 text-[#358055]" />;
        case 'essential_oil':
          return <Droplets className="h-4 w-4 text-[#F3765D]" />;
        case 'active_compound':
          return <Beaker className="h-4 w-4 text-[#2f6f4a]" />;
        default:
          return <Sparkles className="h-4 w-4 text-slate-400" />;
      }
    };

    const renderCompactIngredient = (ingredientId: string) => {
      const ingredient = INGREDIENTS[ingredientId];
      if (!ingredient) return null;

      return (
        <div
          key={ingredientId}
          className="rounded-[1.1rem] border border-[#358055]/10 bg-white p-3.5 shadow-[0_6px_16px_rgba(15,23,42,0.03)] transition-all duration-200 hover:-translate-y-0.5 hover:border-[#358055]/25 hover:shadow-[0_10px_24px_rgba(15,23,42,0.06)]"
        >
          <div className="flex items-start gap-2.5">
            <span className="mt-0.5 inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#358055]/8">
              {getCategoryIcon(ingredient.category)}
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-bold leading-tight text-slate-900">
                {ingredient.serbianName}
              </p>
              <p className="mt-0.5 text-[11px] font-medium uppercase tracking-[0.03em] text-slate-400">
                {ingredient.inciName}
              </p>
              <p className="mt-1.5 text-xs leading-5 text-slate-600">{ingredient.description}</p>
            </div>
          </div>
        </div>
      );
    };

    const renderPagination = (
      page: number,
      total: number,
      setPage: (updater: (prev: number) => number) => void
    ) =>
      total > 1 && (
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setPage((prev) => (prev - 1 + total) % total)}
            aria-label="Previous"
            className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-[#358055]/12 bg-white text-slate-600 transition-colors hover:border-[#F3765D]/40 hover:text-[#F3765D]"
          >
            <ChevronLeft className="h-3.5 w-3.5" />
          </button>
          <span className="min-w-[40px] text-center text-xs font-semibold text-slate-500">
            {page + 1} / {total}
          </span>
          <button
            type="button"
            onClick={() => setPage((prev) => (prev + 1) % total)}
            aria-label="Next"
            className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-[#358055]/12 bg-white text-slate-600 transition-colors hover:border-[#F3765D]/40 hover:text-[#F3765D]"
          >
            <ChevronRight className="h-3.5 w-3.5" />
          </button>
        </div>
      );

    const renderDots = (page: number, total: number, setPage: (index: number) => void) =>
      total > 1 && (
        <div className="mt-4 flex justify-center gap-2">
          {Array.from({ length: total }, (_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setPage(i)}
              aria-label={`Page ${i + 1}`}
              className={cn(
                'h-2 rounded-full transition-all duration-300',
                i === page ? 'w-6 bg-[#F3765D]' : 'w-2 bg-slate-300 hover:bg-slate-400'
              )}
            />
          ))}
        </div>
      );

    return (
      <div className="space-y-4">
        {/* Formula summary */}
        <div className="rounded-[1.2rem] border border-[#358055]/12 bg-[linear-gradient(135deg,rgba(53,128,85,0.08),rgba(243,118,93,0.06))] p-4">
          <div className="flex items-start gap-3">
            <div className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#358055] text-white shadow-[0_8px_18px_rgba(53,128,85,0.25)]">
              <Sparkles className="h-4 w-4" />
            </div>
            <div>
              <h4 className="font-black text-slate-950">Kompletna formula sastojaka</h4>
              <p className="mt-1 text-sm leading-relaxed text-slate-600">
                6 medicinskih biljnih ekstrakata + 5 eteričnih ulja + aktivni sastojci + pomoćne
                komponente
              </p>
            </div>
          </div>
        </div>

        {/* Tab navigation */}
        <div className="flex gap-1 rounded-full border border-[#358055]/10 bg-[#358055]/6 p-1">
          <button
            type="button"
            onClick={() => setActiveTab('key')}
            className={cn(
              'flex-1 rounded-full px-4 py-2 text-sm font-bold transition-all duration-200',
              activeTab === 'key'
                ? 'bg-[#358055] text-white shadow-[0_8px_18px_rgba(53,128,85,0.25)]'
                : 'text-slate-600 hover:text-[#358055]'
            )}
          >
            <span className="flex items-center justify-center gap-2">
              <Star className="h-4 w-4" />
              Ključni sastojci ({keyIngredients.length})
            </span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('all')}
            className={cn(
              'flex-1 rounded-full px-4 py-2 text-sm font-bold transition-all duration-200',
              activeTab === 'all'
                ? 'bg-[#358055] text-white shadow-[0_8px_18px_rgba(53,128,85,0.25)]'
                : 'text-slate-600 hover:text-[#358055]'
            )}
          >
            <span className="flex items-center justify-center gap-2">
              <Book className="h-4 w-4" />
              Potpuna lista ({product.ingredients.length})
            </span>
          </button>
        </div>

        {/* Tab content */}
        <div>
          {activeTab === 'key' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between gap-3 py-1">
                <p className="text-sm text-slate-500">Najbitniji sastojci koji čine srce formule</p>
                {renderPagination(currentPage, totalPages, setCurrentPage)}
              </div>

              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3" key={currentPage}>
                {currentPageIngredients.map(renderCompactIngredient)}
              </div>

              {renderDots(currentPage, totalPages, setCurrentPage)}
            </div>
          )}

          {activeTab === 'all' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between gap-3 py-1">
                <p className="text-sm text-slate-500">Kompletan INCI spisak svih sastojaka</p>
                {renderPagination(currentAllPage, totalAllPages, setCurrentAllPage)}
              </div>

              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3" key={`all-${currentAllPage}`}>
                {currentAllPageIngredients.map(renderCompactIngredient)}
              </div>

              {renderDots(currentAllPage, totalAllPages, setCurrentAllPage)}
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderUsage = () => {
    const steps =
      product.usageSteps && product.usageSteps.length > 0
        ? product.usageSteps
        : [t('product.usage_step_1'), t('product.usage_step_2'), t('product.usage_step_3')];

    return (
      <div className="space-y-4">
        <p className="leading-relaxed text-slate-600">{product.usage}</p>

        <div className="grid gap-2.5">
          {steps.map((step, index) => (
            <div
              key={step}
              className="flex items-center gap-3 rounded-[1.1rem] border border-[#358055]/10 bg-[#358055]/[0.04] px-4 py-3"
            >
              <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#358055] text-sm font-black text-white shadow-[0_6px_14px_rgba(53,128,85,0.25)]">
                {index + 1}
              </span>
              <span className="text-sm font-medium leading-5 text-slate-700">{step}</span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderWarnings = () => {
    return (
      <div className="space-y-4">
        <div className="rounded-[1.2rem] border border-red-200 bg-red-50 p-4">
          <div className="mb-2 flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-red-600" />
            <h4 className="font-bold text-red-800">{t('product.important_warnings')}</h4>
          </div>
          <p className="text-sm leading-relaxed text-red-700">
            {t('product.read_carefully')}
            <br />
            {t('product.consult_doctor')}
          </p>
        </div>

        <div className="grid gap-2.5 sm:grid-cols-2">
          {product.warnings.map((warning, index) => (
            <div
              key={index}
              className="flex items-start gap-2.5 rounded-[1.1rem] border border-amber-200 bg-amber-50 px-3.5 py-3"
            >
              <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
              <p className="text-sm leading-5 text-amber-800">{warning}</p>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const accordionItems: AccordionItem[] = [
    {
      id: 'ingredients',
      title: t('product.ingredients'),
      icon: <Leaf className="h-5 w-5" />,
      content: renderIngredients(),
    },
    {
      id: 'usage',
      title: t('product.usage'),
      icon: <Book className="h-5 w-5" />,
      content: renderUsage(),
    },
    {
      id: 'warnings',
      title: t('product.warnings'),
      icon: <AlertTriangle className="h-5 w-5" />,
      content: renderWarnings(),
    },
  ];

  return (
    <div className={cn('mx-auto w-full max-w-3xl', className)}>
      <div className="space-y-3">
        {accordionItems.map((item) => {
          const isOpen = openItems.has(item.id);

          return (
            <div
              key={item.id}
              className={cn(
                'overflow-hidden rounded-[1.4rem] border bg-white transition-all duration-300',
                isOpen
                  ? 'border-[#358055]/25 shadow-[0_16px_40px_rgba(26,54,42,0.08)]'
                  : 'border-[#358055]/12 shadow-[0_8px_20px_rgba(15,23,42,0.03)] hover:border-[#358055]/25'
              )}
            >
              <button
                type="button"
                onClick={() => toggleItem(item.id)}
                className="flex w-full items-center justify-between px-5 py-4 text-left transition-colors hover:bg-[#358055]/[0.04] md:px-6"
              >
                <div className="flex items-center gap-3">
                  <span
                    className={cn(
                      'inline-flex h-10 w-10 items-center justify-center rounded-2xl transition-colors',
                      isOpen ? 'bg-[#358055] text-white' : 'bg-[#358055]/10 text-[#358055]'
                    )}
                  >
                    {item.icon}
                  </span>
                  <h3 className="font-black text-slate-950">{item.title}</h3>
                </div>

                <span
                  className={cn(
                    'inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border transition-all duration-200',
                    isOpen
                      ? 'rotate-180 border-[#358055]/25 bg-[#358055]/8 text-[#358055]'
                      : 'border-[#358055]/12 bg-white text-slate-400'
                  )}
                >
                  <ChevronDown className="h-[18px] w-[18px]" />
                </span>
              </button>

              <div
                className={cn(
                  'grid transition-all duration-300 ease-in-out',
                  isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                )}
              >
                <div className="overflow-hidden">
                  <div className="border-t border-[#358055]/10 px-5 py-5 md:px-6">{item.content}</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
