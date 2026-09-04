'use client';

import React, { useEffect, useState, use } from 'react';
import Link from 'next/link';
import confetti from 'canvas-confetti';
import { formatCurrency } from '@/lib/utils';
import { CheckCircle2, MessageSquare, Clock, ArrowRight, ExternalLink, ShieldCheck } from 'lucide-react';

interface SuccessPageProps {
  params: Promise<{ orderId: string }>;
  searchParams: Promise<{ token?: string }>;
}

export default function OrderSuccessPage({ params, searchParams }: SuccessPageProps) {
  const { orderId } = use(params);
  const { token } = use(searchParams);
  const [orderData, setOrderData] = useState<any>(null);

  useEffect(() => {
    // Fire festive celebration confetti
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#D4A72C', '#7A1F1F', '#F5EBDD', '#F3C649'],
    });

    try {
      const cached = sessionStorage.getItem(`order_${orderId}`);
      if (cached) {
        setOrderData(JSON.parse(cached));
      }
    } catch {
      // Fallback
    }
  }, [orderId]);

  const order = orderData?.order || {
    orderCode: orderId,
    status: 'whatsapp_prepared',
    createdAt: new Date().toISOString(),
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-12 md:py-16 space-y-8 animate-fadeIn">
      {/* Top Success Banner */}
      <div className="glass-panel p-8 rounded-3xl border border-brand-gold/40 text-center space-y-4 shadow-2xl relative overflow-hidden">
        <div className="w-20 h-20 bg-emerald-500/10 border-2 border-emerald-500 text-emerald-400 rounded-full flex items-center justify-center mx-auto shadow-gold">
          <CheckCircle2 className="w-10 h-10 animate-bounce" />
        </div>

        <div className="space-y-1">
          <span className="text-xs font-black text-brand-gold bg-brand-gold/10 px-3 py-1 rounded-full border border-brand-gold/20">
            رقم الطلب: #{order.orderCode}
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-brand-cream pt-2">
            تم تجهيز الطلب على WhatsApp 🎉
          </h1>
          <p className="text-xs sm:text-sm text-brand-cream-muted max-w-lg mx-auto">
            من فضلك اضغط على زر إرسال في تطبيق الواتساب لتأكيد الطلب مباشرة مع كبابجي البرنس.
          </p>
        </div>

        {/* Status notice */}
        <div className="p-3 rounded-xl bg-brand-dark-800/80 border border-brand-dark-600 text-xs text-brand-cream-muted inline-flex items-center gap-2">
          <Clock className="w-4 h-4 text-brand-gold" />
          <span>حالة الطلب الحالية: <strong className="text-brand-gold font-bold">تم تجهيز الواتساب (في انتظار تأكيد المطعم)</strong></span>
        </div>

        {/* WhatsApp Direct Action Button */}
        {orderData?.whatsappUrl && (
          <div className="pt-2">
            <a
              href={orderData.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-gold inline-flex items-center justify-center gap-3 px-8 py-4 rounded-xl text-base font-extrabold shadow-gold hover:scale-105 transition-all"
            >
              <MessageSquare className="w-5 h-5 text-brand-dark-900" />
              <span>إعادة فتح رسالة WhatsApp الآن 📲</span>
              <ExternalLink className="w-4 h-4 text-brand-dark-900" />
            </a>
          </div>
        )}
      </div>

      {/* Order Summary Snapshot */}
      <div className="glass-panel p-6 rounded-3xl border border-brand-gold/20 space-y-4">
        <h3 className="font-extrabold text-base text-brand-cream border-r-4 border-brand-gold pr-3">
          ملخص الطلب المسجل
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-3 rounded-xl bg-brand-dark-800 border border-brand-dark-600 space-y-1">
            <span className="text-brand-cream-dim block">رقم كود الطلب:</span>
            <span className="font-extrabold text-brand-gold text-sm">#{order.orderCode}</span>
          </div>

          <div className="p-3 rounded-xl bg-brand-dark-800 border border-brand-dark-600 space-y-1">
            <span className="text-brand-cream-dim block">تاريخ وساعة الطلب:</span>
            <span className="font-bold text-brand-cream">
              {new Date(order.createdAt).toLocaleString('ar-EG')}
            </span>
          </div>

          {order.customerName && (
            <div className="p-3 rounded-xl bg-brand-dark-800 border border-brand-dark-600 space-y-1">
              <span className="text-brand-cream-dim block">اسم العميل:</span>
              <span className="font-bold text-brand-cream">{order.customerName}</span>
            </div>
          )}

          {order.customerPhone && (
            <div className="p-3 rounded-xl bg-brand-dark-800 border border-brand-dark-600 space-y-1">
              <span className="text-brand-cream-dim block">رقم الهاتف:</span>
              <span className="font-bold text-brand-cream">{order.customerPhone}</span>
            </div>
          )}
        </div>

        {order.total && (
          <div className="p-4 rounded-xl bg-brand-dark-900 border border-brand-gold/30 flex items-center justify-between">
            <span className="font-extrabold text-sm text-brand-cream">الإجمالي الكلي شامل التوصيل:</span>
            <span className="font-black text-xl text-brand-gold">{formatCurrency(order.total)}</span>
          </div>
        )}
      </div>

      {/* Navigation Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
        <Link
          href={`/orders/track/${order.orderCode}${token ? `?token=${token}` : ''}`}
          className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-brand-dark-700 hover:bg-brand-dark-600 border border-brand-gold/30 text-brand-cream text-xs font-bold transition-all w-full sm:w-auto"
        >
          <Clock className="w-4 h-4 text-brand-gold" />
          <span>متابعة حالة الطلب ⏱️</span>
        </Link>

        <Link
          href="/"
          className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-brand-dark-800 hover:bg-brand-dark-700 text-brand-cream text-xs font-bold transition-all w-full sm:w-auto"
        >
          <span>العودة للرئيسية</span>
          <ArrowRight className="w-4 h-4 text-brand-cream-muted rotate-180" />
        </Link>
      </div>

      <div className="text-center text-[11px] text-brand-cream-dim flex items-center justify-center gap-1">
        <ShieldCheck className="w-4 h-4 text-emerald-400" />
        <span>شكراً لاختياركم كبابجي البرنس! طعم على أصوله 🔥</span>
      </div>
    </div>
  );
}
