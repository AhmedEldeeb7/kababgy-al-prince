'use client';

import React, { useState } from 'react';
import { INITIAL_OFFERS } from '@/lib/mockData';
import { Offer } from '@/types/database';
import { formatCurrency } from '@/lib/utils';
import { Tag, Plus, Edit2, Trash2 } from 'lucide-react';

export default function AdminOffersPage() {
  const [offers, setOffers] = useState<Offer[]>(INITIAL_OFFERS);

  const handleToggleOffer = (id: string) => {
    setOffers((prev) =>
      prev.map((o) => (o.id === id ? { ...o, is_active: !o.is_active } : o))
    );
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-brand-gold/20 pb-4">
        <div>
          <h1 className="text-3xl font-black text-brand-cream">إدارة العروض والخصومات 🏷️</h1>
          <p className="text-xs text-brand-cream-muted">إنشاء وتفعيل عروض الوجبات وصواني العائلة في الصفحة الرئيسية.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {offers.map((off) => (
          <div key={off.id} className="glass-panel p-6 rounded-3xl border border-brand-gold/20 space-y-4 shadow-xl flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-extrabold text-lg text-brand-cream">{off.title_ar}</h3>
                <button
                  onClick={() => handleToggleOffer(off.id)}
                  className={`px-3 py-1 rounded-full text-xs font-bold ${
                    off.is_active ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'
                  }`}
                >
                  {off.is_active ? 'عرض نشط 🟢' : 'معطل 🔴'}
                </button>
              </div>

              <p className="text-xs text-brand-cream-muted leading-relaxed">
                {off.description_ar}
              </p>

              <div className="flex items-center gap-3">
                {off.old_price && (
                  <span className="text-xs text-brand-cream-dim line-through">
                    {formatCurrency(off.old_price)}
                  </span>
                )}
                <span className="text-xl font-black text-brand-gold">
                  {formatCurrency(off.new_price)}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
