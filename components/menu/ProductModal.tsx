'use client';

import React, { useState, useEffect } from 'react';
import { Product, CartItemOption } from '@/types/database';
import { formatCurrency } from '@/lib/utils';
import { useCart } from '@/context/CartContext';
import { X, Minus, Plus, ShoppingBag, Flame, Check } from 'lucide-react';

interface ProductModalProps {
  product: Product | null;
  onClose: () => void;
}

export default function ProductModal({ product, onClose }: ProductModalProps) {
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState<number>(1);
  const [selectedOptions, setSelectedOptions] = useState<CartItemOption[]>([]);
  const [specialInstructions, setSpecialInstructions] = useState<string>('');

  // Reset state when a new product is selected
  useEffect(() => {
    if (!product) return;
    setQuantity(1);
    setSpecialInstructions('');

    // Preselect defaults
    const defaults: CartItemOption[] = [];
    if (product.options) {
      product.options.forEach((opt) => {
        const defaultItem = opt.items.find((i) => i.is_default) || opt.items[0];
        if (defaultItem) {
          defaults.push({
            option_id: opt.id,
            option_title: opt.title_ar,
            item_id: defaultItem.id,
            item_name: defaultItem.name_ar,
            price_modifier: defaultItem.price_modifier,
          });
        }
      });
    }
    setSelectedOptions(defaults);
  }, [product]);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (product) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [product]);

  // Handle Escape key
  useEffect(() => {
    if (!product) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [product, onClose]);

  if (!product) return null;

  const handleOptionToggle = (
    optionId: string,
    optionTitle: string,
    itemId: string,
    itemName: string,
    priceModifier: number,
    allowMultiple: boolean
  ) => {
    setSelectedOptions((prev) => {
      if (allowMultiple) {
        const exists = prev.some((o) => o.item_id === itemId);
        if (exists) {
          return prev.filter((o) => o.item_id !== itemId);
        } else {
          return [
            ...prev,
            { option_id: optionId, option_title: optionTitle, item_id: itemId, item_name: itemName, price_modifier: priceModifier },
          ];
        }
      } else {
        // Single selection radio mode
        const filtered = prev.filter((o) => o.option_id !== optionId);
        return [
          ...filtered,
          { option_id: optionId, option_title: optionTitle, item_id: itemId, item_name: itemName, price_modifier: priceModifier },
        ];
      }
    });
  };

  const optionExtras = selectedOptions.reduce((acc, opt) => acc + (opt.price_modifier || 0), 0);
  const unitPrice = product.base_price + optionExtras;
  const totalPrice = unitPrice * quantity;

  const handleAddToCart = () => {
    addToCart(product, quantity, selectedOptions);
    onClose();
  };

  return (
    <div
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={product.name_ar}
      className="fixed inset-0 z-50 flex items-start sm:items-center justify-center p-2 sm:p-4 bg-black/80 backdrop-blur-md animate-fadeIn overflow-y-auto"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-xl max-h-[calc(100dvh-1rem)] sm:max-h-[calc(100dvh-4rem)] glass-panel rounded-2xl sm:rounded-3xl overflow-hidden border border-brand-gold/30 shadow-2xl my-2 sm:my-8 flex flex-col"
      >
        {/* Header Image */}
        <div className="relative h-48 sm:h-64 w-full shrink-0 bg-brand-dark-900">
          <img
            src={product.image_url || 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=800&q=80'}
            alt={product.name_ar}
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).src =
                'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=800&q=80';
            }}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-brand-dark-900 via-brand-dark-900/40 to-transparent" />

          {/* Close Button */}
          <button
            onClick={onClose}
            aria-label="إغلاق النافذة"
            className="absolute top-4 left-4 p-2 rounded-full bg-brand-dark-900/80 text-brand-cream hover:bg-brand-red transition-colors border border-brand-gold/20"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Title Overlay */}
          <div className="absolute bottom-4 right-4 left-4 space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs bg-brand-gold text-brand-dark-900 font-extrabold px-2.5 py-0.5 rounded-full">
                كبابجي البرنس 👑
              </span>
              {product.is_popular && (
                <span className="text-xs bg-brand-red text-white font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                  <Flame className="w-3 h-3" /> الأكثر طلباً
                </span>
              )}
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-brand-cream break-words">{product.name_ar}</h2>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 space-y-5 sm:space-y-6 overflow-y-auto min-h-0">
          <p className="text-sm text-brand-cream-muted leading-relaxed">
            {product.description_ar || 'أشهى مكونات اللحم البلدي الطازج بتتبيلة البرنس الخاصة، مطهوة ومحضرة طازجة بعناية عالية.'}
          </p>

          {/* Product Options */}
          {product.options && product.options.map((opt) => (
            <div key={opt.id} className="space-y-3 border-t border-brand-dark-700 pt-4">
              <div className="flex items-start justify-between gap-3">
                <h4 className="min-w-0 font-extrabold text-sm text-brand-cream flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-brand-gold" />
                  <span>{opt.title_ar}</span>
                </h4>
                <span className="shrink-0 text-[11px] text-brand-gold font-semibold">
                  {opt.is_required ? '(إجباري)' : '(اختياري)'}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {opt.items.map((item) => {
                  const isSelected = selectedOptions.some((so) => so.item_id === item.id);
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() =>
                        handleOptionToggle(
                          opt.id,
                          opt.title_ar,
                          item.id,
                          item.name_ar,
                          item.price_modifier,
                          opt.allow_multiple
                        )
                      }
                      className={`min-w-0 p-3 rounded-xl border text-right transition-all flex items-center justify-between gap-2 ${
                        isSelected
                          ? 'bg-brand-gold/15 border-brand-gold text-brand-cream font-bold'
                          : 'bg-brand-dark-800 border-brand-dark-600 text-brand-cream-muted hover:border-brand-gold/40'
                      }`}
                    >
                      <div className="min-w-0 flex items-center gap-2">
                        <div
                          className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                            isSelected ? 'bg-brand-gold border-brand-gold' : 'border-brand-cream-dim'
                          }`}
                        >
                          {isSelected && <Check className="w-3 h-3 text-brand-dark-900 font-bold" />}
                        </div>
                        <span className="text-xs break-words">{item.name_ar}</span>
                      </div>
                      {item.price_modifier > 0 && (
                        <span className="text-[11px] text-brand-gold font-bold">
                          +{item.price_modifier} جنيه
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}

          {/* Quantity Controls */}
          <div className="border-t border-brand-dark-700 pt-4 flex items-center justify-between">
            <span className="font-extrabold text-sm text-brand-cream">الكمية:</span>
            <div className="flex items-center gap-3 bg-brand-dark-800 border border-brand-dark-600 p-1.5 rounded-xl">
              <button
                type="button"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                aria-label="تقليل الكمية"
                className="w-8 h-8 rounded-lg bg-brand-dark-700 hover:bg-brand-dark-600 text-brand-cream flex items-center justify-center transition-colors"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="w-8 text-center font-extrabold text-base text-brand-gold">
                {quantity}
              </span>
              <button
                type="button"
                onClick={() => setQuantity(Math.min(99, quantity + 1))}
                aria-label="زيادة الكمية"
                className="w-8 h-8 rounded-lg bg-brand-gold hover:bg-brand-gold-light text-brand-dark-900 flex items-center justify-center font-bold transition-colors"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-brand-dark-900 border-t border-brand-gold/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 shrink-0">
          <div className="flex flex-col">
            <span className="text-[11px] text-brand-cream-dim font-semibold">الإجمالي</span>
            <span className="text-xl font-black text-brand-gold">{formatCurrency(totalPrice)}</span>
          </div>

          <button
            type="button"
            onClick={handleAddToCart}
            className="btn-gold w-full sm:flex-1 flex items-center justify-center gap-2 py-3.5 px-4 sm:px-6 rounded-xl font-black text-sm shadow-gold"
          >
            <ShoppingBag className="w-5 h-5 text-brand-dark-900" />
            <span>أضف إلى السلة</span>
          </button>
        </div>
      </div>
    </div>
  );
}
