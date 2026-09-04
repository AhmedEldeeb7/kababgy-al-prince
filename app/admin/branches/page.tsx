'use client';

import React, { useState } from 'react';
import { INITIAL_BRANCHES } from '@/lib/mockData';
import { Branch } from '@/types/database';
import { MapPin, Phone, Clock, Plus, Edit2 } from 'lucide-react';

export default function AdminBranchesPage() {
  const [branches, setBranches] = useState<Branch[]>(INITIAL_BRANCHES);

  const handleToggleBranch = (id: string) => {
    setBranches((prev) =>
      prev.map((b) => (b.id === id ? { ...b, is_active: !b.is_active } : b))
    );
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-brand-gold/20 pb-4">
        <div>
          <h1 className="text-3xl font-black text-brand-cream">إدارة فروع المطعم 📍</h1>
          <p className="text-xs text-brand-cream-muted">تنشيط أو إيقاف استلام الطلبات لكل فرع من فروع كبابجي البرنس.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {branches.map((b) => (
          <div key={b.id} className="glass-panel p-6 rounded-3xl border border-brand-gold/20 space-y-4 shadow-xl">
            <div className="flex items-center justify-between">
              <h3 className="font-extrabold text-lg text-brand-cream">{b.name_ar}</h3>
              <button
                onClick={() => handleToggleBranch(b.id)}
                className={`px-3 py-1 rounded-full text-xs font-bold ${
                  b.is_active ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'
                }`}
              >
                {b.is_active ? 'نشط 🟢' : 'معطل 🔴'}
              </button>
            </div>

            <div className="space-y-2 text-xs text-brand-cream-muted">
              <p className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-brand-gold shrink-0" />
                <span>{b.address}</span>
              </p>
              <p className="flex items-center gap-1.5">
                <Phone className="w-4 h-4 text-brand-gold shrink-0" />
                <span>{b.phone}</span>
              </p>
              <p className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-brand-cream-dim shrink-0" />
                <span>المواعيد: {b.opening_time} - {b.closing_time}</span>
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
