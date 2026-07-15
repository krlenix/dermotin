'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  LayoutDashboard,
  Package,
  FlaskConical,
  MessageSquareQuote,
  BadgePercent,
  TicketPercent,
  LogOut,
  Menu,
  ExternalLink,
} from 'lucide-react';

const NAV_ITEMS = [
  { href: '/admin', label: 'Početna', icon: LayoutDashboard, exact: true },
  { href: '/admin/products', label: 'Proizvodi', icon: Package, exact: false },
  { href: '/admin/ingredients', label: 'Sastojci', icon: FlaskConical, exact: false },
  { href: '/admin/testimonials', label: 'Testimonijali', icon: MessageSquareQuote, exact: false },
  { href: '/admin/akcije', label: 'Akcije i bundlovi', icon: BadgePercent, exact: false },
  { href: '/admin/kuponi', label: 'Kuponi', icon: TicketPercent, exact: false },
];

export function AdminShell({ email, children }: { email: string; children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = async () => {
    await fetch('/api/admin/auth/logout', { method: 'POST' });
    router.push('/admin/login');
    router.refresh();
  };

  const nav = (
    <nav className="flex flex-col gap-1 p-3">
      {NAV_ITEMS.map((item) => {
        const active = item.exact ? pathname === item.href : pathname.startsWith(item.href);
        const Icon = item.icon;
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={() => setMobileOpen(false)}
            className={cn(
              'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
              active ? 'bg-brand-green text-white' : 'text-gray-700 hover:bg-gray-100'
            )}
          >
            <Icon className="h-4 w-4" />
            {item.label}
          </Link>
        );
      })}
      <a
        href="/rs"
        target="_blank"
        rel="noreferrer"
        className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
      >
        <ExternalLink className="h-4 w-4" />
        Otvori sajt
      </a>
    </nav>
  );

  return (
    <div className="min-h-screen flex">
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex w-60 flex-col border-r bg-white shrink-0">
        <div className="flex items-center gap-2 px-4 h-14 border-b">
          <Image src="/images/main/logo.png" alt="DERMOTIN" width={120} height={32} className="h-7 w-auto" />
          <span className="text-xs font-semibold text-brand-orange uppercase tracking-wide">Admin</span>
        </div>
        <div className="flex-1 overflow-y-auto">{nav}</div>
        <div className="border-t p-3 space-y-2">
          <p className="text-xs text-muted-foreground truncate px-1" title={email}>
            {email}
          </p>
          <Button variant="outline" size="sm" className="w-full justify-start gap-2" onClick={handleLogout}>
            <LogOut className="h-4 w-4" /> Odjavi se
          </Button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile header */}
        <header className="lg:hidden flex items-center justify-between border-b bg-white px-4 h-14 sticky top-0 z-40">
          <div className="flex items-center gap-2">
            <Image src="/images/main/logo.png" alt="DERMOTIN" width={100} height={28} className="h-6 w-auto" />
            <span className="text-xs font-semibold text-brand-orange uppercase">Admin</span>
          </div>
          <Button variant="ghost" size="sm" onClick={() => setMobileOpen((open) => !open)} aria-label="Meni">
            <Menu className="h-5 w-5" />
          </Button>
        </header>
        {mobileOpen && (
          <div className="lg:hidden border-b bg-white shadow-sm">
            {nav}
            <div className="border-t p-3">
              <Button variant="outline" size="sm" className="w-full justify-start gap-2" onClick={handleLogout}>
                <LogOut className="h-4 w-4" /> Odjavi se
              </Button>
            </div>
          </div>
        )}

        <main className="flex-1 p-4 lg:p-8 max-w-[1400px] w-full mx-auto">{children}</main>
      </div>
    </div>
  );
}
