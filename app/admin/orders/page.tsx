'use client';

import React, { useState } from 'react';
import { formatCurrency } from '@/lib/utils';
import { ShoppingBag, Search, Filter, CheckCircle2, Flame, Bike, Package, Clock, Phone } from 'lucide-react';

export default function AdminOrdersPage() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const [orders, setOrders] = useState([
    {
      id: 'ord_1',
      orderCode: 'KP-2026-981024',
      customerName: 'أحمد محمود العبد',
      phone: '01123456789',
      branch: 'فرع المقطم',
      address: 'المقطم - الهضبة الوسطى - ش 15 عمارة 4',
      total: 650,
      subtotal: 620,
      deliveryFee: 30,
      status: 'pending',
      statusLabel: 'جديد 🟡',
      createdAt: new Date().toISOString(),
      items: [
        { name: 'كباب ضاني بلدي (ثلت ك)', quantity: 1, price: 435 },
        { name: 'حمام محشي أرز بالخلطة', quantity: 1, price: 140 },
        { name: 'طحينة ومخلل زيادة', quantity: 1, price: 45 },
      ],
    },
    {
      id: 'ord_2',
      orderCode: 'KP-2026-981023',
      customerName: 'مصطفى كامل',
      phone: '01098765432',
      branch: 'فرع فيصل',
      address: 'فيصل - حسن محمد - شارع العشرين عمارة 12 شقة 4',
      total: 1950,
      subtotal: 1920,
      deliveryFee: 30,
      status: 'confirmed',
      statusLabel: 'تم التأكيد 🔵',
      createdAt: new Date(Date.now() - 3600000).toISOString(),
      items: [
        { name: 'صينية العائلة المشكلة', quantity: 1, price: 1950 },
      ],
    },
  ]);

  const filteredOrders = orders.filter((o) => {
    if (statusFilter !== 'all' && o.status !== statusFilter) return false;
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      return (
        o.orderCode.toLowerCase().includes(q) ||
        o.customerName.toLowerCase().includes(q) ||
        o.phone.includes(q)
      );
    }
    return true;
  });

  const handleUpdateStatus = (id: string, newStatus: string, label: string) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === id ? { ...o, status: newStatus, statusLabel: label } : o))
    );
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-brand-gold/20 pb-4">
        <div>
          <h1 className="text-3xl font-black text-brand-cream">إدارة ومتابعة الطلبات 🛒</h1>
          <p className="text-xs text-brand-cream-muted">متابعة طلبات الواتساب، وتغيير حالات التجهيز والتوصيل مباشرة.</p>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-brand-cream-dim absolute right-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="بحث بكود الطلب أو اسم العميل أو الهاتف..."
            className="w-full bg-brand-dark-800 border border-brand-dark-600 rounded-xl py-2.5 pr-9 pl-3 text-xs font-bold text-brand-cream outline-none"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="bg-brand-dark-800 border border-brand-dark-600 rounded-xl py-2.5 px-3 text-xs font-bold text-brand-cream outline-none"
        >
          <option value="all">جميع الحالات</option>
          <option value="pending">جديد 🟡</option>
          <option value="confirmed">تم التأكيد 🔵</option>
          <option value="preparing">جاري التحضير 🔥</option>
          <option value="ready">جاهز للتوصيل 📦</option>
          <option value="delivered">تم التسليم 🟢</option>
          <option value="cancelled">ملغي 🔴</option>
        </select>
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {filteredOrders.map((ord) => (
          <div key={ord.id} className="glass-panel p-6 rounded-3xl border border-brand-gold/20 space-y-4 shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-brand-dark-700 pb-3">
              <div className="space-y-1">
                <span className="text-xs text-brand-gold font-bold">كود الطلب:</span>
                <h3 className="text-xl font-black text-brand-cream">#{ord.orderCode}</h3>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs bg-brand-dark-700 text-brand-gold font-extrabold px-3 py-1 rounded-full border border-brand-gold/30">
                  {ord.statusLabel}
                </span>
                <span className="text-xs text-brand-cream-dim">
                  {new Date(ord.createdAt).toLocaleTimeString('ar-EG')}
                </span>
              </div>
            </div>

            {/* Customer Details */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs bg-brand-dark-800/80 p-3 rounded-2xl border border-brand-dark-700">
              <div>
                <span className="text-brand-cream-dim block">العميل:</span>
                <span className="font-bold text-brand-cream">{ord.customerName}</span>
              </div>
              <div>
                <span className="text-brand-cream-dim block">الهاتف:</span>
                <a href={`tel:${ord.phone}`} className="font-bold text-brand-gold underline flex items-center gap-1">
                  <Phone className="w-3 h-3" /> {ord.phone}
                </a>
              </div>
              <div>
                <span className="text-brand-cream-dim block">الفرع والعنوان:</span>
                <span className="font-bold text-brand-cream">{ord.branch} — {ord.address}</span>
              </div>
            </div>

            {/* Items */}
            <div className="space-y-1.5 text-xs">
              <span className="font-bold text-brand-cream block">تفاصيل الاصناف:</span>
              {ord.items.map((it, idx) => (
                <div key={idx} className="flex justify-between text-brand-cream-muted">
                  <span>{it.name} × {it.quantity}</span>
                  <span className="font-bold text-brand-cream">{formatCurrency(it.price)}</span>
                </div>
              ))}
            </div>

            {/* Price Footer & Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-between border-t border-brand-dark-700 pt-3 gap-3">
              <div className="flex items-center gap-4 text-xs">
                <span>المجموع الفرعي: <strong className="text-brand-cream">{formatCurrency(ord.subtotal)}</strong></span>
                <span>التوصيل: <strong className="text-brand-gold">{formatCurrency(ord.deliveryFee)}</strong></span>
                <span>الإجمالي: <strong className="text-xl font-black text-brand-gold">{formatCurrency(ord.total)}</strong></span>
              </div>

              {/* Status transition action toolbar */}
              <div className="flex flex-wrap items-center gap-1.5 text-xs">
                <button
                  onClick={() => handleUpdateStatus(ord.id, 'confirmed', 'تم التأكيد 🔵')}
                  className="px-3 py-1.5 rounded-xl bg-blue-500/20 text-blue-300 font-bold hover:bg-blue-500 hover:text-white transition-colors"
                >
                  تأكيد 🔵
                </button>
                <button
                  onClick={() => handleUpdateStatus(ord.id, 'preparing', 'جاري التحضير 🔥')}
                  className="px-3 py-1.5 rounded-xl bg-amber-500/20 text-amber-300 font-bold hover:bg-amber-500 hover:text-white transition-colors"
                >
                  تحضير 🔥
                </button>
                <button
                  onClick={() => handleUpdateStatus(ord.id, 'ready', 'جاهز للتوصيل 📦')}
                  className="px-3 py-1.5 rounded-xl bg-purple-500/20 text-purple-300 font-bold hover:bg-purple-500 hover:text-white transition-colors"
                >
                  جاهز 📦
                </button>
                <button
                  onClick={() => handleUpdateStatus(ord.id, 'delivered', 'تم التسليم 🟢')}
                  className="px-3 py-1.5 rounded-xl bg-emerald-500/20 text-emerald-300 font-bold hover:bg-emerald-500 hover:text-white transition-colors"
                >
                  تسليم 🟢
                </button>
                <button
                  onClick={() => handleUpdateStatus(ord.id, 'cancelled', 'ملغي 🔴')}
                  className="px-3 py-1.5 rounded-xl bg-red-500/20 text-red-300 font-bold hover:bg-red-500 hover:text-white transition-colors"
                >
                  إلغاء 🔴
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
