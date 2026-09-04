'use client';

import React, { useState } from 'react';
import { formatCurrency } from '@/lib/utils';
import { ShoppingBag, DollarSign, Clock, Flame, CheckCircle2, TrendingUp, Filter, Eye } from 'lucide-react';

export default function AdminDashboardPage() {
  const [orders, setOrders] = useState([
    {
      id: 'ord_101',
      orderCode: 'KP-2026-981024',
      customerName: 'أحمد محمود',
      phone: '01123456789',
      branch: 'فرع المقطم',
      total: 650,
      status: 'pending',
      statusLabel: 'جديد 🟡',
      createdAt: 'منذ 5 دقائق',
    },
    {
      id: 'ord_102',
      orderCode: 'KP-2026-981023',
      customerName: 'مصطفى كامل',
      phone: '01098765432',
      branch: 'فرع فيصل',
      total: 1950,
      status: 'confirmed',
      statusLabel: 'تم التأكيد 🔵',
      createdAt: 'منذ 15 دقيقة',
    },
    {
      id: 'ord_103',
      orderCode: 'KP-2026-981022',
      customerName: 'سارة السيد',
      phone: '01234567890',
      branch: 'فرع إمبابة',
      total: 320,
      status: 'delivered',
      statusLabel: 'تم التسليم 🟢',
      createdAt: 'منذ 45 دقيقة',
    },
  ]);

  const handleUpdateStatus = (orderId: string, newStatus: string, label: string) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: newStatus, statusLabel: label } : o))
    );
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-brand-gold/20 pb-4">
        <div>
          <h1 className="text-3xl font-black text-brand-cream">لوحة قيادة كبابجي البرنس 📊</h1>
          <p className="text-xs text-brand-cream-muted">ملخص الأداء والمبيعات والطلبات اليومية الحية.</p>
        </div>
        <span className="text-xs bg-brand-gold/10 border border-brand-gold/30 text-brand-gold font-bold px-3 py-1.5 rounded-full">
          آخر تحديث: {new Date().toLocaleTimeString('ar-EG')}
        </span>
      </div>

      {/* Stats Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="glass-panel p-5 rounded-2xl border border-brand-gold/30 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-brand-cream-muted font-bold">طلبات اليوم</span>
            <div className="w-9 h-9 rounded-xl bg-brand-gold/10 flex items-center justify-center">
              <ShoppingBag className="w-5 h-5 text-brand-gold" />
            </div>
          </div>
          <div className="text-3xl font-black text-brand-cream">24 طلب</div>
          <span className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" /> +15% عن الأمس
          </span>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-brand-gold/30 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-brand-cream-muted font-bold">إيرادات اليوم</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-emerald-400" />
            </div>
          </div>
          <div className="text-3xl font-black text-brand-gold">{formatCurrency(14850)}</div>
          <span className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" /> متوسط الطلب: 618 جنيه
          </span>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-brand-gold/30 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-brand-cream-muted font-bold">طلبات تنتظر التأكيد</span>
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 flex items-center justify-center">
              <Clock className="w-5 h-5 text-amber-400" />
            </div>
          </div>
          <div className="text-3xl font-black text-amber-400">3 طلبات</div>
          <span className="text-[11px] text-amber-300 font-semibold">يلزم تأكيدها على الواتساب</span>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-brand-gold/30 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-brand-cream-muted font-bold">الأكثر مبيعاً</span>
            <div className="w-9 h-9 rounded-xl bg-brand-red/20 flex items-center justify-center">
              <Flame className="w-5 h-5 text-brand-gold" />
            </div>
          </div>
          <div className="text-xl font-black text-brand-cream truncate">كباب ضاني بلدي</div>
          <span className="text-[11px] text-brand-gold font-bold">38 طلب هذا الأسبوع 👑</span>
        </div>
      </div>

      {/* Recent Orders Section */}
      <div className="glass-panel p-6 rounded-3xl border border-brand-gold/20 space-y-4 shadow-xl">
        <div className="flex items-center justify-between border-b border-brand-dark-700 pb-3">
          <h2 className="text-lg font-black text-brand-cream flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-brand-gold" />
            <span>الطلبات الأخيرة والحالة</span>
          </h2>
          <span className="text-xs text-brand-gold font-bold">إجمالي الطلبات النشطة: {orders.length}</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs">
            <thead>
              <tr className="border-b border-brand-dark-700 text-brand-cream-dim">
                <th className="py-3 px-3">كود الطلب</th>
                <th className="py-3 px-3">العميل والهاتف</th>
                <th className="py-3 px-3">الفرع</th>
                <th className="py-3 px-3">الإجمالي</th>
                <th className="py-3 px-3">الحالة الحالية</th>
                <th className="py-3 px-3 text-center">إجراءات الإدارة</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-dark-700">
              {orders.map((ord) => (
                <tr key={ord.id} className="hover:bg-brand-dark-800/60 transition-colors">
                  <td className="py-3.5 px-3 font-extrabold text-brand-gold">#{ord.orderCode}</td>
                  <td className="py-3.5 px-3">
                    <span className="font-bold text-brand-cream block">{ord.customerName}</span>
                    <span className="text-brand-cream-dim text-[11px]">{ord.phone}</span>
                  </td>
                  <td className="py-3.5 px-3 text-brand-cream-muted">{ord.branch}</td>
                  <td className="py-3.5 px-3 font-black text-brand-cream">{formatCurrency(ord.total)}</td>
                  <td className="py-3.5 px-3">
                    <span className="font-bold px-2.5 py-1 rounded-full text-[11px] bg-brand-dark-700 text-brand-gold border border-brand-gold/30">
                      {ord.statusLabel}
                    </span>
                  </td>
                  <td className="py-3.5 px-3 text-center">
                    <div className="flex items-center justify-center gap-1.5">
                      <button
                        onClick={() => handleUpdateStatus(ord.id, 'confirmed', 'تم التأكيد 🔵')}
                        className="px-2.5 py-1 rounded-lg bg-blue-500/20 text-blue-300 font-bold hover:bg-blue-500 hover:text-white transition-colors"
                      >
                        تأكيد
                      </button>
                      <button
                        onClick={() => handleUpdateStatus(ord.id, 'delivered', 'تم التسليم 🟢')}
                        className="px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 font-bold hover:bg-emerald-500 hover:text-white transition-colors"
                      >
                        تسليم
                      </button>
                      <button
                        onClick={() => handleUpdateStatus(ord.id, 'cancelled', 'ملغي 🔴')}
                        className="px-2.5 py-1 rounded-lg bg-red-500/20 text-red-300 font-bold hover:bg-red-500 hover:text-white transition-colors"
                      >
                        إلغاء
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
