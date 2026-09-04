'use client';

import React, { use } from 'react';
import Link from 'next/link';
import { Clock, CheckCircle2, Flame, Bike, Package, ArrowRight, RotateCcw } from 'lucide-react';
import { OrderStatus } from '@/types/database';

interface OrderTrackPageProps {
  params: Promise<{ orderId: string }>;
  searchParams: Promise<{ token?: string }>;
}

export default function OrderTrackPage({ params, searchParams }: OrderTrackPageProps) {
  const { orderId } = use(params);
  const { token } = use(searchParams);

  // Status step progression
  const statuses: { key: OrderStatus; label: string; icon: any }[] = [
    { key: 'pending', label: 'جديد', icon: Clock },
    { key: 'whatsapp_prepared', label: 'تم تجهيز واتساب', icon: Clock },
    { key: 'confirmed', label: 'تم التأكيد', icon: CheckCircle2 },
    { key: 'preparing', label: 'جاري التحضير', icon: Flame },
    { key: 'ready', label: 'جاهز', icon: Package },
    { key: 'out_for_delivery', label: 'خرج للتوصيل', icon: Bike },
    { key: 'delivered', label: 'تم التسليم', icon: CheckCircle2 },
  ];

  // Current active status
  const currentStatusIndex = 2; // Default confirmed demo status

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 space-y-8 animate-fadeIn">
      {/* Header Title */}
      <div className="space-y-2 border-r-4 border-brand-gold pr-4">
        <div className="flex items-center gap-2">
          <Clock className="w-6 h-6 text-brand-gold" />
          <h1 className="text-3xl font-black text-brand-cream">متابعة حالة الطلب ⏱️</h1>
        </div>
        <p className="text-xs text-brand-cream-muted">
          تابع مرحلة تجهيز طلبك في فرع كبابجي البرنس لحظة بلحظة.
        </p>
      </div>

      {/* Order Status Card */}
      <div className="glass-panel p-8 rounded-3xl border border-brand-gold/30 space-y-8 shadow-2xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-brand-gold/20 pb-4">
          <div>
            <span className="text-xs text-brand-gold font-bold">كود الطلب:</span>
            <h2 className="text-2xl font-black text-brand-cream">#{orderId}</h2>
          </div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 font-extrabold text-xs border border-emerald-500/30">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>جاري المتابعة في المطعم</span>
          </div>
        </div>

        {/* Visual Timeline Steps */}
        <div className="space-y-6">
          <h3 className="text-sm font-extrabold text-brand-cream">خطوات سير الطلب:</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-3">
            {statuses.map((st, idx) => {
              const Icon = st.icon;
              const isPassed = idx <= currentStatusIndex;
              const isCurrent = idx === currentStatusIndex;

              return (
                <div
                  key={st.key}
                  className={`p-3 rounded-2xl border text-center space-y-2 flex flex-col items-center justify-center transition-all ${
                    isCurrent
                      ? 'bg-brand-gold/20 border-brand-gold shadow-gold text-brand-gold'
                      : isPassed
                      ? 'bg-brand-dark-800 border-brand-gold/40 text-brand-cream font-bold'
                      : 'bg-brand-dark-900 border-brand-dark-700 text-brand-cream-dim'
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      isCurrent
                        ? 'bg-brand-gold text-brand-dark-900 font-black'
                        : isPassed
                        ? 'bg-brand-dark-700 text-brand-gold'
                        : 'bg-brand-dark-800 text-brand-cream-dim'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="text-[11px] font-bold block">{st.label}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-between pt-4">
        <Link
          href="/menu"
          className="btn-gold inline-flex items-center gap-2 px-6 py-3 rounded-xl text-xs font-extrabold shadow-gold"
        >
          <RotateCcw className="w-4 h-4 text-brand-dark-900" />
          <span>طلب وجبة جديدة 🍽️</span>
        </Link>

        <Link
          href="/orders"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-brand-dark-800 hover:bg-brand-dark-700 text-brand-cream text-xs font-bold"
        >
          <span>عرض كل طلباتي</span>
          <ArrowRight className="w-4 h-4 text-brand-cream-muted rotate-180" />
        </Link>
      </div>
    </div>
  );
}
