'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Product, INGREDIENTS } from '@/config/products';
import { cn } from '@/lib/utils';
import { 
  ChevronDown, 
  Leaf, 
  Shield, 
  Book, 
  AlertTriangle,
  Sparkles,
  Beaker,
  Heart,
  CheckCircle,
  Star,
  ChevronLeft,
  ChevronRight,
  Pause,
  Play
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
  defaultOpen?: boolean;
}

export function ProductDetailsAccordion({ product, className }: ProductDetailsAccordionProps) {
  const t = useTranslations();
  const [openItems, setOpenItems] = useState<Set<string>>(new Set(['ingredients'])); // Default open

  const toggleItem = (id: string) => {
    const newOpenItems = new Set(openItems);
    if (newOpenItems.has(id)) {
      newOpenItems.delete(id);
    } else {
      newOpenItems.add(id);
    }
    setOpenItems(newOpenItems);
  };

  // Smart tabbed ingredients interface - compact and organized
  const [activeTab, setActiveTab] = useState('key');
  const [currentPage, setCurrentPage] = useState(0);
  const [currentAllPage, setCurrentAllPage] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(false);
  
  // Auto-scroll effect
  useEffect(() => {
    const ITEMS_PER_PAGE = 6;
    const keyIngredients = product.ingredients.filter(id => {
      const ingredient = INGREDIENTS[id];
      return ingredient?.category === 'herbal_extract' || ingredient?.category === 'essential_oil' || ingredient?.category === 'active_compound';
    });
    const totalPages = Math.ceil(keyIngredients.length / ITEMS_PER_PAGE);
    
    if (!isAutoPlay || activeTab !== 'key' || totalPages <= 1) return;
    
    const interval = setInterval(() => {
      setCurrentPage((prev) => (prev + 1) % totalPages);
    }, 4000); // Change page every 4 seconds

    return () => clearInterval(interval);
  }, [isAutoPlay, activeTab, product.ingredients]);

  // Reset to first page when changing tabs
  useEffect(() => {
    setCurrentPage(0);
    setCurrentAllPage(0);
  }, [activeTab]);
  
  const renderIngredients = () => {
    const ITEMS_PER_PAGE = 6; // Show 6 ingredients per page (3x2 grid)
    // Smart grouping: Key ingredients vs Full list
    const keyIngredients = product.ingredients.filter(id => {
      const ingredient = INGREDIENTS[id];
      return ingredient?.category === 'herbal_extract' || ingredient?.category === 'essential_oil' || ingredient?.category === 'active_compound';
    });

    // const supportingIngredients = product.ingredients.filter(id => {
    //   const ingredient = INGREDIENTS[id];
    //   return ingredient?.category === 'base_component' || ingredient?.category === 'preservative' || ingredient?.category === 'other';
    // });

    // Pagination logic for both tabs
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
        case 'herbal_extract': return <Leaf className="h-4 w-4 text-green-500" />;
        case 'essential_oil': return <Sparkles className="h-4 w-4 text-purple-500" />;
        case 'active_compound': return <Beaker className="h-4 w-4 text-blue-500" />;
        case 'base_component': return <Shield className="h-4 w-4 text-gray-500" />;
        case 'preservative': return <CheckCircle className="h-4 w-4 text-orange-500" />;
        case 'other': return <Heart className="h-4 w-4 text-gray-500" />;
        default: return <Leaf className="h-4 w-4 text-gray-400" />;
      }
    };

    const renderCompactIngredient = (ingredientId: string) => {
      const ingredient = INGREDIENTS[ingredientId];
      if (!ingredient) return null;

      return (
        <div 
          key={ingredientId} 
          className="p-3 bg-white rounded-lg border border-gray-100 hover:border-gray-200 hover:shadow-sm transition-all duration-200"
        >
          <div className="flex items-start gap-2">
            {getCategoryIcon(ingredient.category)}
            <div className="flex-1 min-w-0">
              <p className="font-medium text-gray-900 text-sm leading-tight">
                {ingredient.serbianName}
              </p>
              <p className="text-xs text-gray-500 font-mono mb-1">
                {ingredient.inciName}
              </p>
              <p className="text-xs text-gray-600 leading-relaxed">
                {ingredient.description}
              </p>
            </div>
          </div>
        </div>
      );
    };

    return (
      <div className="space-y-4">
        {/* Header info */}
        <div className="p-4 bg-green-50 rounded-lg border border-green-100">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
              <Sparkles className="h-4 w-4 text-green-600" />
            </div>
            <div>
              <h4 className="font-medium text-green-900 mb-1">
                Kompletna formula sastojaka
              </h4>
              <p className="text-sm text-green-700 leading-relaxed">
                6 medicinskih biljnih ekstrakata + 5 eteričnih ulja + aktivni sastojci + pomoćne komponente
              </p>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-1 p-1 bg-gray-100 rounded-lg">
          <button
            onClick={() => setActiveTab('key')}
            className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'key'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <Star className="h-4 w-4" />
              Ključni sastojci ({keyIngredients.length})
            </div>
          </button>
          <button
            onClick={() => setActiveTab('all')}
            className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'all'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <Book className="h-4 w-4" />
              Potpuna lista ({product.ingredients.length})
            </div>
          </button>
        </div>

        {/* Tab Content */}
        <div className="min-h-[300px]">
          {activeTab === 'key' && (
            <div className="space-y-4">
              {/* Header with controls */}
              <div className="flex items-center justify-between py-2">
                <p className="text-sm text-gray-600">
                  Najbitniji sastojci koji čine srce formule
                </p>
                {totalPages > 1 && (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setIsAutoPlay(!isAutoPlay)}
                      className="p-1.5 rounded-md bg-gray-100 hover:bg-gray-200 transition-colors"
                      title={isAutoPlay ? 'Pauziraj auto-prikaz' : 'Pokreni auto-prikaz'}
                    >
                      {isAutoPlay ? <Pause className="h-3 w-3" /> : <Play className="h-3 w-3" />}
                    </button>
                    <button
                      onClick={() => setCurrentPage((prev) => (prev - 1 + totalPages) % totalPages)}
                      className="p-1.5 rounded-md bg-gray-100 hover:bg-gray-200 transition-colors"
                    >
                      <ChevronLeft className="h-3 w-3" />
                    </button>
                    <span className="text-xs text-gray-500 min-w-[40px] text-center">
                      {currentPage + 1} / {totalPages}
                    </span>
                    <button
                      onClick={() => setCurrentPage((prev) => (prev + 1) % totalPages)}
                      className="p-1.5 rounded-md bg-gray-100 hover:bg-gray-200 transition-colors"
                    >
                      <ChevronRight className="h-3 w-3" />
                    </button>
                  </div>
                )}
              </div>

              {/* Ingredients Grid with Animation */}
              <div className="relative">
                <div 
                  className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 transition-all duration-500 ease-in-out"
                  key={currentPage} // Force re-render for smooth transition
                >
                  {currentPageIngredients.map(renderCompactIngredient)}
                </div>

                {/* Page Indicators */}
                {totalPages > 1 && (
                  <div className="flex justify-center mt-4 gap-2">
                    {Array.from({ length: totalPages }, (_, i) => (
                      <button
                        key={i}
                        onClick={() => setCurrentPage(i)}
                        className={cn(
                          "w-2 h-2 rounded-full transition-all duration-300",
                          i === currentPage 
                            ? "bg-brand-orange w-6" 
                            : "bg-gray-300 hover:bg-gray-400"
                        )}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'all' && (
            <div className="space-y-4">
              {/* Header with controls */}
              <div className="flex items-center justify-between py-2">
                <p className="text-sm text-gray-600">
                  Kompletan INCI spisak svih sastojaka
                </p>
                {totalAllPages > 1 && (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setCurrentAllPage((prev) => (prev - 1 + totalAllPages) % totalAllPages)}
                      className="p-1.5 rounded-md bg-gray-100 hover:bg-gray-200 transition-colors"
                    >
                      <ChevronLeft className="h-3 w-3" />
                    </button>
                    <span className="text-xs text-gray-500 min-w-[40px] text-center">
                      {currentAllPage + 1} / {totalAllPages}
                    </span>
                    <button
                      onClick={() => setCurrentAllPage((prev) => (prev + 1) % totalAllPages)}
                      className="p-1.5 rounded-md bg-gray-100 hover:bg-gray-200 transition-colors"
                    >
                      <ChevronRight className="h-3 w-3" />
                    </button>
                  </div>
                )}
              </div>

              {/* Ingredients Grid with Animation */}
              <div className="relative">
                <div 
                  className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 transition-all duration-500 ease-in-out"
                  key={`all-${currentAllPage}`} // Force re-render for smooth transition
                >
                  {currentAllPageIngredients.map(renderCompactIngredient)}
                </div>

                {/* Page Indicators */}
                {totalAllPages > 1 && (
                  <div className="flex justify-center mt-4 gap-2">
                    {Array.from({ length: totalAllPages }, (_, i) => (
                      <button
                        key={i}
                        onClick={() => setCurrentAllPage(i)}
                        className={cn(
                          "w-2 h-2 rounded-full transition-all duration-300",
                          i === currentAllPage 
                            ? "bg-brand-orange w-6" 
                            : "bg-gray-300 hover:bg-gray-400"
                        )}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  // Enhanced usage instructions
  const renderUsage = () => {
    return (
      <div className="space-y-4">
        <div className="prose prose-sm max-w-none">
          <p className="text-gray-700 leading-relaxed">{product.usage}</p>
        </div>
        
        <div className="grid gap-3 mt-4">
          <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg border border-blue-100">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-sm font-bold text-blue-600">1</span>
            </div>
            <span className="text-sm text-gray-700">{t('product.usage_step_1')}</span>
          </div>
          <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg border border-blue-100">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-sm font-bold text-blue-600">2</span>
            </div>
            <span className="text-sm text-gray-700">{t('product.usage_step_2')}</span>
          </div>
          <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg border border-blue-100">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-sm font-bold text-blue-600">3</span>
            </div>
            <span className="text-sm text-gray-700">{t('product.usage_step_3')}</span>
          </div>
        </div>
      </div>
    );
  };

  // Enhanced warnings section with danger styling
  const renderWarnings = () => {
    return (
      <div className="space-y-4">
        {/* Important warning header */}
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="h-5 w-5 text-red-600" />
            <h4 className="font-semibold text-red-800">
              {t('product.important_warnings')}
            </h4>
          </div>
          <p className="text-sm text-red-700">
            {t('product.read_carefully')}
            <br />
            {t('product.consult_doctor')}
          </p>
        </div>

        {/* Individual warnings */}
        <div className="space-y-3">
          {product.warnings.map((warning, index) => (
            <div 
              key={index}
              className="flex items-start gap-3 p-3 bg-amber-50 rounded-lg border border-amber-200"
            >
              <AlertTriangle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-amber-800 leading-relaxed">{warning}</p>
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
      defaultOpen: true
    },
    {
      id: 'usage',
      title: t('product.usage'),
      icon: <Book className="h-5 w-5" />,
      content: renderUsage()
    },
    {
      id: 'warnings',
      title: t('product.warnings'),
      icon: <AlertTriangle className="h-5 w-5" />,
      content: renderWarnings()
    }
  ];

  return (
    <div className={cn("w-full max-w-3xl mx-auto", className)}>
      <div className="space-y-2">
        {accordionItems.map((item, index) => {
          const isOpen = openItems.has(item.id);
          
          return (
            <div
              key={item.id}
              className="border border-gray-200 rounded-lg overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow"
            >
              {/* Accordion Header */}
              <button
                onClick={() => toggleItem(item.id)}
                className="w-full px-6 py-4 flex items-center justify-between bg-gray-50 hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className={cn(
                    "flex items-center justify-center w-8 h-8 rounded-full transition-colors",
                    isOpen 
                      ? item.id === 'ingredients' 
                        ? "bg-green-100 text-green-600" 
                        : "bg-orange-100 text-orange-600"
                      : "bg-gray-100 text-gray-500"
                  )}>
                    {item.icon}
                  </div>
                  <h3 className="font-semibold text-gray-900 text-left">
                    {item.title}
                  </h3>
                </div>
                
                <ChevronDown
                  className={cn(
                    "h-5 w-5 text-gray-500 transition-transform duration-200",
                    isOpen && "rotate-180"
                  )}
                />
              </button>

              {/* Accordion Content */}
              <div className={cn(
                "overflow-hidden transition-all duration-300 ease-in-out",
                isOpen ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0"
              )}>
                <div className="px-6 py-4 border-t border-gray-100">
                  {item.content}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
