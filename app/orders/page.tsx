'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { formatCurrency } from '@/lib/utils';
import { Clock, ShoppingBag, ArrowRight, CheckCircle2, RotateCcw } from 'lucide-react';
import { useCart } from '@/context/CartContext';

export default function CustomerOrdersPage() {
  const { addToCart } = useCart();
  const [orders, setOrders] = useState<any[]>([]);

  useEffect(() => {
    // Collect cached orders from session or local storage
    const cachedOrders = [];
    try {
      for (let i = 0; i < sessionStorage.length; i++) {
        const key = sessionStorage.key(i);
        if (key && key.startsWith('order_')) {
          const item = sessionStorage.getItem(key);
          if (item) cachedOrders.push(JSON.parse(item));
        }
      }
    } catch {
      //
    }

    if (cachedOrders.length === 0) {
      // Demo mock orders for demonstration
      setOrders([
        {
          orderCode: 'KP-2026-981024',
          branchName: 'فرع المقطم',
          total: 650,
          statusLabel: 'تم التأكيد',
          createdAt: new Date().toISOString(),
          items: [
            { name: 'كباب ضاني بلدي', quantity: 1, price: 435 },
            { name: 'حمام محشي أرز', quantity: 1, price: 140 },
            { name: 'طحينة ومخلل', quantity: 1, price: 30 },
          ],
        },
      ]);
    } else {
      setOrders(cachedOrders);
    }
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 space-y-8 animate-fadeIn">
      {/* Title */}
      <div className="space-y-2 border-r-4 border-brand-gold pr-4">
        <h1 className="text-3xl font-black text-brand-cream">طلباتي السابقة 📜</h1>
        <p className="text-xs text-brand-cream-muted">
          عرض جميع الطلبات السابقة وإعادة الطلب بضغطة زر واحدة.
        </p>
      </div>

      {orders.length === 0 ? (
        <div className="glass-panel p-12 rounded-3xl text-center space-y-4 border border-brand-dark-700">
          <span className="text-5xl block">📜</span>
          <h3 className="text-xl font-bold text-brand-cream">لا توجد طلبات مسجلة بعد</h3>
          <p className="text-xs text-brand-cream-muted">عندما تقوم بعمل طلب سيظهر لك هنا فوراً لمتابعة حالته وإعادة الطلب.</p>
          <Link href="/menu" className="btn-gold inline-block px-8 py-3 rounded-xl font-extrabold text-xs">
            تصفح المنيو واطلب الآن
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((ord, i) => (
            <div
              key={i}
              className="glass-panel p-6 rounded-3xl border border-brand-gold/20 space-y-4 hover:border-brand-gold/50 transition-all shadow-lg"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-brand-dark-700 pb-3">
                <div className="space-y-1">
                  <span className="text-xs text-brand-gold font-bold">كود الطلب:</span>
                  <h3 className="text-lg font-black text-brand-cream">#{ord.orderCode || ord.order?.orderCode}</h3>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs bg-emerald-500/20 text-emerald-400 font-bold px-3 py-1 rounded-full">
                    {ord.statusLabel || 'تم التأكيد'} 🟢
                  </span>
                  <span className="text-xs text-brand-cream-dim">
                    {new Date(ord.createdAt || Date.now()).toLocaleDateString('ar-EG')}
                  </span>
                </div>
              </div>

              {/* Items summary */}
              <div className="space-y-2 text-xs">
                {ord.items && ord.items.map((it: any, idx: number) => (
                  <div key={idx} className="flex justify-between text-brand-cream-muted">
                    <span>{it.name || it.product_name_snapshot} × {it.quantity}</span>
                    <span className="font-bold text-brand-cream">{formatCurrency(it.price || it.subtotal || 150)}</span>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between border-t border-brand-dark-700 pt-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-brand-cream-dim">الإجمالي:</span>
                  <span className="text-lg font-black text-brand-gold">{formatCurrency(ord.total || ord.order?.total || 650)}</span>
                </div>

                <Link
                  href={`/orders/track/${ord.orderCode || ord.order?.orderCode}`}
                  className="btn-gold px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm"
                >
                  <Clock className="w-3.5 h-3.5 text-brand-dark-900" />
                  <span>تتبع الطلب</span>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
