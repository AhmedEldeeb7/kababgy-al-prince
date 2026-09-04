'use client';

import React from 'react';
import Link from 'next/link';
import { Flame, PhoneCall, MapPin, Clock, MessageSquare, ShieldCheck } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-brand-dark-900 border-t border-brand-gold/20 text-brand-cream-muted pt-12 pb-24 md:pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-brand-gold to-brand-gold-dark p-0.5 shadow-gold">
                <div className="w-full h-full bg-brand-dark-900 rounded-full flex items-center justify-center">
                  <Flame className="w-5 h-5 text-brand-gold animate-flame-glow" />
                </div>
              </div>
              <div>
                <h3 className="font-black text-xl text-brand-cream">كبابجي البرنس</h3>
                <p className="text-[10px] text-brand-gold font-bold tracking-widest">SAEID EL-PRINCE</p>
              </div>
            </div>
            <p className="text-xs text-brand-cream-muted leading-relaxed">
              أصل المشويات المصرية وطواجن السمن البلدي في مصر! طعم أصلي بتتبيلة خاصة وتسوية مثالية على الفحم الطازج يومياً.
            </p>
            <div className="flex items-center gap-2 text-xs text-brand-gold font-semibold pt-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>لحوم بلدية 100% طازجة يومياً</span>
            </div>
          </div>

          {/* Contact & Hotline */}
          <div className="space-y-3">
            <h4 className="font-extrabold text-base text-brand-cream border-r-4 border-brand-gold pr-3">
              الخط الساخن والتواصل
            </h4>
            <div className="space-y-2 pt-2 text-xs">
              <a
                href="tel:01288883934"
                className="flex items-center gap-2 text-brand-gold font-extrabold text-sm hover:underline"
              >
                <PhoneCall className="w-4 h-4 text-brand-gold" />
                <span>الخط الساخن: 01288883934</span>
              </a>
              <div className="flex items-center gap-2 text-brand-cream-muted">
                <Clock className="w-4 h-4 text-brand-gold" />
                <span>ساعات العمل: 12:00 ظهراً - 04:00 صباحاً</span>
              </div>
              <div className="flex items-center gap-2 text-brand-cream-muted">
                <MessageSquare className="w-4 h-4 text-emerald-400" />
                <span>طلب واتساب المباشر متاحة 24 ساعة</span>
              </div>
            </div>
          </div>

          {/* Branches */}
          <div className="space-y-3">
            <h4 className="font-extrabold text-base text-brand-cream border-r-4 border-brand-gold pr-3">
              فروعنا
            </h4>
            <ul className="space-y-2 text-xs">
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-brand-gold shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-brand-cream block">فرع المقطم:</span>
                  <span>الهضبة الوسطى - تح الجامعة الحديثة</span>
                </div>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-brand-gold shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-brand-cream block">فرع فيصل:</span>
                  <span>شارع فيصل الرئيسي - حسن محمد</span>
                </div>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-brand-gold shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-brand-cream block">فرع إمبابة:</span>
                  <span>شارع طلخا - الفرع التاريخي</span>
                </div>
              </li>
            </ul>
          </div>

          {/* Quick Links & Admin */}
          <div className="space-y-3">
            <h4 className="font-extrabold text-base text-brand-cream border-r-4 border-brand-gold pr-3">
              روابط سريعة
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/menu" className="hover:text-brand-gold transition-colors">
                  تصفح المنيو الكامل
                </Link>
              </li>
              <li>
                <Link href="/#offers" className="hover:text-brand-gold transition-colors">
                  أحدث العروض والخصومات
                </Link>
              </li>
              <li>
                <Link href="/orders" className="hover:text-brand-gold transition-colors">
                  متابعة الطلبات المفتوحة
                </Link>
              </li>
              <li className="pt-3 border-t border-brand-dark-700">
                <Link
                  href="/admin/login"
                  className="text-brand-cream-dim hover:text-brand-gold transition-colors text-[11px] flex items-center gap-1"
                >
                  <span>تسجيل دخول لوحة التحكم (Admin)</span>
                  <span>🔐</span>
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-brand-dark-700 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-brand-cream-dim gap-4">
          <p>© {new Date().getFullYear()} كبابجي البرنس (Kababgy Al Prince). جميع الحقوق محفوظة.</p>
          <p className="text-[11px]">طعم على أصوله 🔥 - صناعة مصرية بامتياز</p>
        </div>
      </div>
    </footer>
  );
}
