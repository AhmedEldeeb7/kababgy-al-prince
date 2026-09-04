'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { formatCurrency } from '@/lib/utils';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight, AlertCircle, MapPin } from 'lucide-react';

export default function CartDrawer() {
  const {
    cart,
    isCartOpen,
    setIsCartOpen,
    updateQuantity,
    removeFromCart,
    subtotal,
    selectedBranch,
  } = useCart();

  // Lock body scroll when drawer is open
  useEffect(() => {
    if (isCartOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isCartOpen]);

  // Handle Escape key
  useEffect(() => {
    if (!isCartOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsCartOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isCartOpen, setIsCartOpen]);

  if (!isCartOpen) return null;

  const minOrder = 100;
  const isMinOrderMet = subtotal >= minOrder;
  const remainingForMinOrder = Math.max(0, minOrder - subtotal);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden" role="dialog" aria-modal="true" aria-label="سلة التسوق">
      {/* Backdrop */}
      <div
        onClick={() => setIsCartOpen(false)}
        className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity animate-fadeIn"
      />

      <div className="fixed inset-y-0 left-0 max-w-full flex">
        <div className="w-full sm:w-screen max-w-md glass-panel border-r border-brand-gold/30 shadow-2xl flex flex-col justify-between">
          {/* Header */}
          <div className="p-3 sm:p-4 border-b border-brand-gold/20 flex items-center justify-between gap-2 bg-brand-dark-900/90">
            <div className="min-w-0 flex items-center gap-2">
              <ShoppingBag className="w-6 h-6 text-brand-gold" />
              <h2 className="truncate font-black text-base sm:text-lg text-brand-cream">سلة طلباتك 🍽️</h2>
              <span className="shrink-0 text-[10px] sm:text-xs bg-brand-gold text-brand-dark-900 font-extrabold px-2 py-0.5 rounded-full">
                {cart.reduce((acc, item) => acc + item.quantity, 0)} منتج
              </span>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              aria-label="إغلاق السلة"
              className="p-1 rounded-full text-brand-cream-muted hover:text-brand-cream hover:bg-brand-dark-700"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Active Branch Info */}
          {selectedBranch && (
            <div className="px-4 py-2 bg-brand-dark-800/80 border-b border-brand-dark-700 flex items-center justify-between text-xs">
              <div className="min-w-0 flex flex-wrap items-center gap-1.5 text-brand-cream-muted">
                <MapPin className="w-3.5 h-3.5 text-brand-gold" />
                <span>الفرع المختار:</span>
                <span className="font-bold text-brand-cream break-words">{selectedBranch.name_ar}</span>
              </div>
            </div>
          )}

          {/* Items Container */}
          <div className="flex-1 min-h-0 overflow-y-auto p-3 sm:p-4 space-y-4">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-4 my-12">
                <div className="w-20 h-20 rounded-full bg-brand-dark-800 border border-brand-gold/20 flex items-center justify-center text-4xl shadow-inner">
                  🍽️
                </div>
                <div className="space-y-1">
                  <h3 className="text-lg font-bold text-brand-cream">السلة فاضية 🍽️</h3>
                  <p className="text-xs text-brand-cream-muted">اختر حاجة حلوة من المنيو ونبدأ جهز طلبك!</p>
                </div>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="btn-gold px-6 py-2.5 rounded-xl text-xs font-extrabold shadow-gold"
                >
                  تصفح المنيو الآن
                </button>
              </div>
            ) : (
              cart.map((item) => (
                <div
                  key={item.cart_item_id}
                  className="p-3 rounded-2xl bg-brand-dark-800/90 border border-brand-dark-600 space-y-2 relative"
                >
                  <div className="flex items-start justify-between gap-3">
                    <img
                      src={
                        item.product.image_url ||
                        'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=200&q=80'
                      }
                      alt={item.product.name_ar}
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src =
                          'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=200&q=80';
                      }}
                      className="w-16 h-16 rounded-xl object-cover border border-brand-gold/20 shrink-0"
                    />

                    <div className="min-w-0 flex-1 space-y-1">
                      <h4 className="font-bold text-sm text-brand-cream leading-tight break-words">
                        {item.product.name_ar}
                      </h4>
                      {item.selected_options && item.selected_options.length > 0 && (
                        <p className="text-[11px] text-brand-gold leading-normal break-words">
                          {item.selected_options.map((o) => o.item_name).join(' • ')}
                        </p>
                      )}
                      <span className="text-xs font-black text-brand-cream block">
                        {formatCurrency(item.unit_price)} × {item.quantity}
                      </span>
                    </div>

                    <button
                      onClick={() => removeFromCart(item.cart_item_id)}
                      className="text-brand-cream-dim hover:text-brand-red p-1"
                      aria-label={`حذف ${item.product.name_ar} من السلة`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Quantity Stepper & Subtotal Row */}
                  <div className="flex items-center justify-between border-t border-brand-dark-700 pt-2">
                    <div className="flex items-center gap-2 bg-brand-dark-900 border border-brand-dark-600 px-2 py-1 rounded-lg">
                      <button
                        onClick={() => updateQuantity(item.cart_item_id, item.quantity - 1)}
                        aria-label="تقليل الكمية"
                        className="w-6 h-6 rounded bg-brand-dark-700 hover:bg-brand-dark-600 text-brand-cream flex items-center justify-center"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="w-6 text-center font-bold text-xs text-brand-gold">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.cart_item_id, item.quantity + 1)}
                        aria-label="زيادة الكمية"
                        className="w-6 h-6 rounded bg-brand-gold text-brand-dark-900 flex items-center justify-center font-bold"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    <span className="font-extrabold text-sm text-brand-gold">
                      {formatCurrency(item.total_price)}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Drawer Footer & Checkout */}
          {cart.length > 0 && (
            <div className="p-3 sm:p-4 bg-brand-dark-900 border-t border-brand-gold/20 space-y-3">
              {/* Minimum order status badge */}
              {!isMinOrderMet ? (
                <div className="flex items-center gap-2 text-xs bg-amber-500/10 border border-amber-500/30 text-amber-300 p-2.5 rounded-xl">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>
                    أضف <strong className="text-brand-gold">{remainingForMinOrder} جنيه</strong> كمان لإكمال الحد الأدنى للطلب ({minOrder} جنيه)
                  </span>
                </div>
              ) : (
                <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-semibold">
                  <span>✓ حققت الحد الأدنى للطلب! يمكنك إتمام الطلب الآن.</span>
                </div>
              )}

              {/* Cost Summary */}
              <div className="space-y-1 text-xs">
                <div className="flex items-start justify-between gap-3 text-brand-cream-muted">
                  <span>مجموع المنتجات:</span>
                  <span className="font-bold text-brand-cream">{formatCurrency(subtotal)}</span>
                </div>
                <div className="flex items-start justify-between gap-3 text-brand-cream-muted">
                  <span>رسوم التوصيل المحسوبة:</span>
                  <span className="text-brand-gold font-bold">تتحدد عند عنوان التوصيل</span>
                </div>
                <div className="flex items-start justify-between gap-3 text-sm font-black text-brand-cream pt-2 border-t border-brand-dark-700">
                  <span>المجموع الفرعي:</span>
                  <span className="text-brand-gold text-base">{formatCurrency(subtotal)}</span>
                </div>
              </div>

              {/* Checkout Button */}
              <Link
                href={isMinOrderMet ? '/checkout' : '#'}
                onClick={(e) => {
                  if (!isMinOrderMet) e.preventDefault();
                  else setIsCartOpen(false);
                }}
                className={`w-full py-4 rounded-xl font-black text-sm flex items-center justify-center gap-2 shadow-gold transition-all ${
                  isMinOrderMet
                    ? 'btn-gold hover:scale-[1.02]'
                    : 'bg-brand-dark-700 text-brand-cream-dim cursor-not-allowed border border-brand-dark-600'
                }`}
              >
                <span>الانتقال لإتمام الطلب</span>
                <ArrowRight className={`w-5 h-5 rotate-180 ${isMinOrderMet ? 'text-brand-dark-900' : 'text-brand-cream-dim'}`} />
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
