'use client';

import React from 'react';
import { Product } from '@/types/database';
import { formatCurrency } from '@/lib/utils';
import { Plus, Flame, Sparkles } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onSelectProduct: (product: Product) => void;
}

export default function ProductCard({ product, onSelectProduct }: ProductCardProps) {
  const hasOptions = product.options && product.options.length > 0;

  return (
    <div
      onClick={() => onSelectProduct(product)}
      className="group relative bg-brand-dark-800/90 rounded-2xl border border-brand-gold/15 hover:border-brand-gold/50 shadow-lg hover:shadow-gold transition-all duration-300 overflow-hidden flex flex-col cursor-pointer"
    >
      {/* Image Container */}
      <div className="relative aspect-[4/3] w-full bg-brand-dark-900 overflow-hidden">
        <img
          src={product.image_url || 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=600&q=80'}
          alt={product.name_ar}
          className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-brand-dark-900/90 via-transparent to-transparent" />

        {/* Badges */}
        <div className="absolute top-3 right-3 flex flex-col gap-1">
          {product.is_popular && (
            <span className="inline-flex items-center gap-1 bg-brand-gold text-brand-dark-900 font-extrabold text-[11px] px-2.5 py-1 rounded-full shadow-md">
              <Flame className="w-3 h-3 text-brand-dark-900" />
              <span>الأكثر طلباً</span>
            </span>
          )}
          {product.is_featured && !product.is_popular && (
            <span className="inline-flex items-center gap-1 bg-brand-red text-brand-cream font-bold text-[11px] px-2.5 py-1 rounded-full shadow-md">
              <Sparkles className="w-3 h-3 text-amber-300" />
              <span>مميز</span>
            </span>
          )}
        </div>

        {/* Preparation Time */}
        <span className="absolute bottom-2 left-2 text-[10px] bg-brand-dark-900/80 text-brand-cream-dim px-2 py-0.5 rounded-md backdrop-blur-sm">
          ⏱️ {product.prep_time_mins} دقيقة
        </span>
      </div>

      {/* Content Body */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
        <div className="space-y-1">
          <h3 className="text-lg font-black text-brand-cream group-hover:text-brand-gold transition-colors line-clamp-1">
            {product.name_ar}
          </h3>
          <p className="text-xs text-brand-cream-muted line-clamp-2 leading-relaxed">
            {product.description_ar || 'أشهى مكونات الطعم البلدي الأصلي بتتبيلة خاصة من كبابجي البرنس'}
          </p>
        </div>

        {/* Price & Action Row */}
        <div className="pt-2 flex items-center justify-between border-t border-brand-dark-700">
          <div className="flex flex-col">
            <span className="text-[10px] text-brand-cream-dim font-bold">يبدأ من</span>
            <span className="text-base font-black text-brand-gold">
              {formatCurrency(product.base_price)}
            </span>
          </div>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onSelectProduct(product);
            }}
            className="flex items-center gap-1.5 bg-brand-gold/10 hover:bg-brand-gold text-brand-gold hover:text-brand-dark-900 border border-brand-gold/40 px-3 py-1.5 rounded-xl font-bold text-xs transition-all shadow-sm group-hover:bg-brand-gold group-hover:text-brand-dark-900"
          >
            <Plus className="w-4 h-4" />
            <span>{hasOptions ? 'تخصيص الطلب' : 'أضف للسلة'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
