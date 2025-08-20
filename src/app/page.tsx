import Link from 'next/link';
import { getProductsForCountry } from '@/config/products';
import { getCountryConfig } from '@/config/countries';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export default function HomePage() {
  const countryConfig = getCountryConfig('rs'); // Only Serbian now
  const products = getProductsForCountry('rs');

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-brand-green mb-2">DERMOTIN</h1>
            <p className="text-xl text-gray-600">Prirodni proizvodi za zdravu kožu</p>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <section className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">
            Otkrijte našu ekskluzivnu kolekciju
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Prirodni dermatološki proizvodi za sve tipove kože. Klinički testirani i sigurni za svakodnevnu upotrebu.
          </p>
        </section>

        {/* Products Grid */}
        <section>
          <h3 className="text-2xl font-bold mb-8 text-center">Izdvojeni proizvodi</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product) => (
              <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="aspect-square relative bg-gray-100">
                  {/* Placeholder for product image */}
                  <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-brand-green to-brand-orange text-white font-bold text-xl">
                    {product.name}
                  </div>
                </div>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-lg">{product.name}</CardTitle>
                    {product.urgencyElements.limitedStock && (
                      <Badge variant="destructive" className="text-xs">
                        Ograničeno
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-gray-600">{product.shortDescription}</p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-2xl font-bold text-brand-orange">
                        {product.variants[0].discountPrice || product.variants[0].price} {countryConfig.currencySymbol}
                      </span>
                      {product.variants[0].discountPrice && (
                        <span className="text-sm text-gray-500 line-through ml-2">
                          {product.variants[0].price} {countryConfig.currencySymbol}
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2">
                    <Button asChild variant="outline" size="sm">
                      <Link href={`/checkouts/${product.slug}`}>
                        Pogledaj
                      </Link>
                    </Button>
                    <Button asChild size="sm" className="bg-brand-orange hover:bg-brand-orange/90">
                      <Link href={`/checkouts/${product.slug}`}>
                        Kupi odmah
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Features Section */}
        <section className="mt-16 grid md:grid-cols-3 gap-8">
          <div className="text-center p-6">
            <div className="w-16 h-16 bg-brand-green rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-white text-2xl">🚚</span>
            </div>
            <h3 className="text-xl font-semibold mb-2">Besplatna dostava</h3>
            <p className="text-gray-600">Za sve porudžbine preko 3000 {countryConfig.currencySymbol}</p>
          </div>
          
          <div className="text-center p-6">
            <div className="w-16 h-16 bg-brand-orange rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-white text-2xl">🛡️</span>
            </div>
            <h3 className="text-xl font-semibold mb-2">Garancija povraćaja</h3>
            <p className="text-gray-600">30 dana garancije zadovoljstva ili povraćaj novca</p>
          </div>
          
          <div className="text-center p-6">
            <div className="w-16 h-16 bg-brand-green rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-white text-2xl">⭐</span>
            </div>
            <h3 className="text-xl font-semibold mb-2">Klinički testirani</h3>
            <p className="text-gray-600">Svi proizvodi su dermatološki testirani i odobreni</p>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8 mt-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <h3 className="font-bold mb-4">Informacije o kompaniji</h3>
              <div className="space-y-1 text-sm">
                <p>{countryConfig.company.name}</p>
                <p>{countryConfig.company.address}</p>
                <p>{countryConfig.company.city}, {countryConfig.company.postalCode}</p>
                <p>{countryConfig.company.phone}</p>
                <p>{countryConfig.company.email}</p>
              </div>
            </div>
            <div>
              <h3 className="font-bold mb-4">Korisnička podrška</h3>
              <div className="space-y-2 text-sm">
                <p>Kontakt</p>
                <p>Dostava</p>
                <p>Povraćaj</p>
                <p>Uslovi korišćenja</p>
              </div>
            </div>
            <div>
              <h3 className="font-bold mb-4">DERMOTIN</h3>
              <p className="text-sm text-gray-300">
                © 2024 {countryConfig.company.name}. Sva prava zadržana.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
