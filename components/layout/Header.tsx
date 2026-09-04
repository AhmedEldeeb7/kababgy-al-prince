'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ShoppingBag, MapPin, Menu as MenuIcon, X, PhoneCall, Flame } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import BranchSelectorModal from '@/components/home/BranchSelectorModal';

export default function Header() {
  const { totalItemCount, selectedBranch, setIsCartOpen } = useCart();
  const [isBranchModalOpen, setIsBranchModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-40 w-full glass-panel border-b border-brand-gold/20 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Right Side: Logo */}
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-brand-gold to-brand-gold-dark p-0.5 shadow-gold group-hover:scale-105 transition-transform">
                <div className="w-full h-full bg-brand-dark-900 rounded-full flex items-center justify-center border border-brand-gold/30">
                  <Flame className="w-7 h-7 text-brand-gold animate-flame-glow" />
                </div>
              </div>
              <div className="flex flex-col">
                <span className="font-extrabold text-xl md:text-2xl text-brand-cream tracking-tight group-hover:text-brand-gold transition-colors">
                  كبابجي البرنس
                </span>
                <span className="text-[10px] text-brand-gold font-medium tracking-widest">
                  SAEID EL-PRINCE GRILL
                </span>
              </div>
            </Link>

            {/* Branch Selector Pill (Desktop & Mobile) */}
            <button
              onClick={() => setIsBranchModalOpen(true)}
              className="flex items-center gap-2 bg-brand-dark-800 hover:bg-brand-dark-700 border border-brand-gold/30 hover:border-brand-gold px-3 py-1.5 md:px-4 md:py-2 rounded-full text-xs md:text-sm text-brand-cream transition-all shadow-sm group"
            >
              <MapPin className="w-4 h-4 text-brand-gold group-hover:animate-bounce" />
              <span className="font-semibold max-w-[120px] sm:max-w-none truncate">
                {selectedBranch ? selectedBranch.name_ar : 'اختر الفرع'}
              </span>
              <span className="text-[10px] text-brand-gold underline font-bold mr-1">
                تغيير
              </span>
            </button>

            {/* Middle Nav: Desktop Links */}
            <nav className="hidden lg:flex items-center gap-8 text-sm font-bold">
              <Link href="/" className="text-brand-cream hover:text-brand-gold transition-colors">
                الرئيسية
              </Link>
              <Link href="/menu" className="text-brand-cream hover:text-brand-gold transition-colors">
                المنيو
              </Link>
              <Link href="/#branches" className="text-brand-cream hover:text-brand-gold transition-colors">
                الفروع
              </Link>
              <Link href="/#offers" className="text-brand-cream hover:text-brand-gold transition-colors">
                العروض
              </Link>
              <Link href="/#about" className="text-brand-cream hover:text-brand-gold transition-colors">
                عن المطعم
              </Link>
              <Link href="/orders" className="text-brand-cream hover:text-brand-gold transition-colors">
                طلباتي
              </Link>
            </nav>

            {/* Left Actions */}
            <div className="flex items-center gap-3">
              {/* Hotline Button (Desktop) */}
              <a
                href="tel:01288883934"
                className="hidden xl:flex items-center gap-2 bg-brand-red/40 hover:bg-brand-red text-brand-cream px-3 py-2 rounded-lg text-xs font-bold border border-brand-red-bright/40 transition-all"
              >
                <PhoneCall className="w-3.5 h-3.5 text-red-400" />
                <span>01288883934</span>
              </a>

              {/* Cart Button */}
              <button
                onClick={() => setIsCartOpen(true)}
                className="relative flex items-center justify-center w-11 h-11 rounded-xl bg-brand-gold hover:bg-brand-gold-light text-brand-dark-900 shadow-gold transition-all hover:scale-105 active:scale-95"
                aria-label="سلة التسوق"
              >
                <ShoppingBag className="w-5 h-5 text-brand-dark-900 font-extrabold" />
                {totalItemCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-brand-red-bright text-white text-[11px] font-black w-5 h-5 rounded-full flex items-center justify-center border-2 border-brand-dark-900 animate-bounce">
                    {totalItemCount}
                  </span>
                )}
              </button>

              {/* Mobile Menu Toggle Button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden p-2 text-brand-cream hover:text-brand-gold focus:outline-none"
                aria-label="القائمة"
              >
                {isMobileMenuOpen ? <X className="w-7 h-7" /> : <MenuIcon className="w-7 h-7" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Dropdown Navigation */}
        {isMobileMenuOpen && (
          <div className="lg:hidden glass-panel border-t border-brand-gold/20 px-4 pt-4 pb-6 space-y-3 animate-fadeIn">
            <Link
              href="/"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block py-2 text-base font-bold text-brand-cream hover:text-brand-gold"
            >
              الرئيسية
            </Link>
            <Link
              href="/menu"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block py-2 text-base font-bold text-brand-cream hover:text-brand-gold"
            >
              المنيو الكامل
            </Link>
            <Link
              href="/#branches"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block py-2 text-base font-bold text-brand-cream hover:text-brand-gold"
            >
              فروع المطعم
            </Link>
            <Link
              href="/#offers"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block py-2 text-base font-bold text-brand-cream hover:text-brand-gold"
            >
              العروض والخصومات
            </Link>
            <Link
              href="/orders"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block py-2 text-base font-bold text-brand-cream hover:text-brand-gold"
            >
              متابعة طلباتي
            </Link>
            <Link
              href="/admin/login"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block py-2 text-xs font-semibold text-brand-cream-dim hover:text-brand-gold border-t border-brand-dark-600 pt-3"
            >
              لوحة تحكم الإدارة 🔐
            </Link>
          </div>
        )}
      </header>

      {/* Branch Selector Modal */}
      <BranchSelectorModal
        isOpen={isBranchModalOpen}
        onClose={() => setIsBranchModalOpen(false)}
      />
    </>
  );
}
