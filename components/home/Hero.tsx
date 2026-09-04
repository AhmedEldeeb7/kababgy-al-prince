'use client';

import React from 'react';
import Link from 'next/link';
import { Flame, ShoppingCart, BookOpen, ShieldCheck, Bike, Sparkles } from 'lucide-react';

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-brand-dark-900 via-brand-dark-800 to-brand-dark-900 border-b border-brand-gold/15 py-10 sm:py-16 lg:py-24">
      {/* Background Flame Glow Overlay */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand-gold/5 rounded-full blur-3xl pointer-events-none animate-pulse" />
      <div className="absolute top-1/3 right-10 w-[300px] h-[300px] bg-brand-red/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-12 items-center">
          {/* Right Text Column */}
          <div className="lg:col-span-7 space-y-4 sm:space-y-6 text-right">
            {/* Top Flame Badge */}
            <div className="inline-flex max-w-full items-center gap-2 px-3 sm:px-4 py-1.5 rounded-full bg-brand-red/30 border border-brand-red-bright/40 text-brand-gold text-[11px] sm:text-xs font-bold shadow-md">
              <Flame className="w-4 h-4 text-brand-gold animate-bounce" />
              <span>كباب سعيد البرنس — الخلطة والتتبيلة الأصلية</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-brand-cream leading-tight">
              كبابجي البرنس
              <span className="block mt-2 text-transparent bg-clip-text bg-gradient-to-l from-brand-gold via-brand-gold-light to-brand-gold-dark font-extrabold">
                طعم على أصوله 🔥
              </span>
            </h1>

            {/* Subheadline */}
            <p className="text-sm sm:text-lg text-brand-cream-muted leading-relaxed max-w-2xl font-medium">
              استمتع بأشهى قطع الكباب والريش الضاني الطازجة على الفحم، وطواجن السمن البلدي الدايبة، والحمام المحشي بأرز الخلطة السحرية. توصيل سريع ومباشر لباب البيت!
            </p>

            {/* Feature Badges */}
            <div className="flex flex-wrap gap-2 sm:gap-3 pt-2">
              <div className="flex items-center gap-2 bg-brand-dark-700/60 border border-brand-gold/20 px-2.5 sm:px-3 py-1.5 rounded-lg text-[11px] sm:text-xs font-semibold">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>لحوم بلدية طازجة 100%</span>
              </div>
              <div className="flex items-center gap-2 bg-brand-dark-700/60 border border-brand-gold/20 px-2.5 sm:px-3 py-1.5 rounded-lg text-[11px] sm:text-xs font-semibold">
                <Bike className="w-4 h-4 text-brand-gold" />
                <span>توصيل سريع لكافة المناطق</span>
              </div>
              <div className="flex items-center gap-2 bg-brand-dark-700/60 border border-brand-gold/20 px-2.5 sm:px-3 py-1.5 rounded-lg text-[11px] sm:text-xs font-semibold">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>سمن بلدي وطشة حكاية</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-4">
              <Link
                href="/menu"
                className="btn-gold flex items-center justify-center gap-3 px-8 py-4 rounded-xl text-base font-extrabold shadow-gold hover:scale-105 transition-all"
              >
                <ShoppingCart className="w-5 h-5 text-brand-dark-900" />
                <span>اطلب أونلاين الآن</span>
              </Link>

              <Link
                href="/#menu-section"
                className="flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-brand-dark-700 hover:bg-brand-dark-600 border border-brand-cream-muted/20 text-brand-cream text-base font-bold transition-all"
              >
                <BookOpen className="w-5 h-5 text-brand-gold" />
                <span>تصفح أصناف المنيو</span>
              </Link>
            </div>
          </div>

          {/* Left Visual Banner Card */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative w-full max-w-md aspect-square rounded-3xl glass-panel p-2.5 sm:p-4 border border-brand-gold/30 shadow-2xl overflow-hidden group">
              {/* Image Frame */}
              <div className="w-full h-full rounded-2xl overflow-hidden relative">
                <img
                  src="https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=1000&q=80"
                  alt="كبابجي البرنس - مشويات الفحم"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-dark-900 via-transparent to-transparent opacity-80" />

                {/* Floating Dish Badge */}
                <div className="absolute bottom-2.5 right-2.5 left-2.5 sm:bottom-4 sm:right-4 sm:left-4 glass-panel p-2.5 sm:p-3 rounded-xl border border-brand-gold/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                  <div className="text-right">
                    <span className="text-xs text-brand-gold font-extrabold block">الأكثر طلباً 👑</span>
                    <span className="text-xs sm:text-sm font-bold text-brand-cream">كباب ضاني وسجق بلدي</span>
                  </div>
                  <span className="bg-brand-gold text-brand-dark-900 font-black text-xs px-3 py-1.5 rounded-lg shadow-sm">
                    طازج على الفحم
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
