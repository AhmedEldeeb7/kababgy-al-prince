'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, UtensilsCrossed, Tag, ShoppingBag, Clock } from 'lucide-react';
import { useCart } from '@/context/CartContext';

export default function StickyMobileNav() {
  const pathname = usePathname();
  const { totalItemCount, setIsCartOpen } = useCart();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-30 lg:hidden glass-panel border-t border-brand-gold/20 shadow-2xl py-2 px-3">
      <div className="flex items-center justify-around">
        <Link
          href="/"
          className={`flex flex-col items-center gap-1 text-[11px] font-bold ${
            pathname === '/' ? 'text-brand-gold' : 'text-brand-cream-muted'
          }`}
        >
          <Home className="w-5 h-5" />
          <span>الرئيسية</span>
        </Link>

        <Link
          href="/menu"
          className={`flex flex-col items-center gap-1 text-[11px] font-bold ${
            pathname === '/menu' ? 'text-brand-gold' : 'text-brand-cream-muted'
          }`}
        >
          <UtensilsCrossed className="w-5 h-5" />
          <span>المنيو</span>
        </Link>

        {/* Central Prominent Cart Trigger */}
        <button
          onClick={() => setIsCartOpen(true)}
          className="relative flex flex-col items-center justify-center -mt-6 bg-gradient-to-tr from-brand-gold-dark to-brand-gold text-brand-dark-900 w-14 h-14 rounded-full shadow-gold border-4 border-brand-dark-900 hover:scale-105 active:scale-95 transition-transform"
        >
          <ShoppingBag className="w-6 h-6 text-brand-dark-900 font-black" />
          {totalItemCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-brand-red-bright text-white text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center border-2 border-brand-dark-900">
              {totalItemCount}
            </span>
          )}
        </button>

        <Link
          href="/#offers"
          className={`flex flex-col items-center gap-1 text-[11px] font-bold ${
            pathname.includes('offers') ? 'text-brand-gold' : 'text-brand-cream-muted'
          }`}
        >
          <Tag className="w-5 h-5" />
          <span>العروض</span>
        </Link>

        <Link
          href="/orders"
          className={`flex flex-col items-center gap-1 text-[11px] font-bold ${
            pathname === '/orders' ? 'text-brand-gold' : 'text-brand-cream-muted'
          }`}
        >
          <Clock className="w-5 h-5" />
          <span>طلباتي</span>
        </Link>
      </div>
    </nav>
  );
}
