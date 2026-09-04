'use client';

import React, { useState, useMemo } from 'react';
import { Category, Product } from '@/types/database';
import ProductCard from '@/components/menu/ProductCard';
import ProductModal from '@/components/menu/ProductModal';
import { Search, Flame, Sparkles, Utensils } from 'lucide-react';

interface MenuSectionProps {
  categories: Category[];
  products: Product[];
}

export default function MenuSection({ categories, products }: MenuSectionProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filterMode, setFilterMode] = useState<'all' | 'popular' | 'featured'>('all');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      // Category check
      if (selectedCategory !== 'all' && p.category_id !== selectedCategory) {
        return false;
      }
      // Filter mode check
      if (filterMode === 'popular' && !p.is_popular) return false;
      if (filterMode === 'featured' && !p.is_featured) return false;
      // Search query check
      if (searchQuery.trim().length > 0) {
        const query = searchQuery.trim().toLowerCase();
        const matchName = p.name_ar.toLowerCase().includes(query);
        const matchDesc = p.description_ar?.toLowerCase().includes(query) || false;
        if (!matchName && !matchDesc) return false;
      }
      return true;
    });
  }, [products, selectedCategory, searchQuery, filterMode]);

  return (
    <section id="menu-section" className="py-8 sm:py-12 lg:py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 sm:space-y-8">
      {/* Section Title */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-brand-gold/20 pb-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 text-xs font-bold text-brand-gold bg-brand-gold/10 px-3 py-1 rounded-full border border-brand-gold/20">
            <Utensils className="w-3.5 h-3.5" />
            <span>قائمة كبابجي البرنس الأصيلة</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-black text-brand-cream">
            اختر أكلتك المفضلة 🔥
          </h2>
        </div>

        {/* Live Search Input */}
        <div className="relative w-full md:w-80">
          <Search className="w-5 h-5 text-brand-cream-dim absolute right-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="بتدور على إيه؟ (كباب، كفتة، طرب...)"
            className="w-full bg-brand-dark-800 border border-brand-gold/20 focus:border-brand-gold rounded-xl py-2.5 pr-11 pl-4 text-xs font-bold text-brand-cream placeholder:text-brand-cream-dim focus:outline-none transition-colors"
          />
        </div>
      </div>

      {/* Horizontally Scrollable Category Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none border-b border-brand-dark-700">
        <button
          onClick={() => setSelectedCategory('all')}
          className={`px-5 py-2.5 rounded-xl font-bold text-xs whitespace-nowrap transition-all border shrink-0 ${
            selectedCategory === 'all'
              ? 'bg-brand-gold text-brand-dark-900 border-brand-gold shadow-gold'
              : 'bg-brand-dark-800 text-brand-cream-muted border-brand-dark-600 hover:border-brand-gold/40'
          }`}
        >
          جميع الأقسام 🍽️
        </button>

        {categories.map((cat) => {
          const isSelected = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-5 py-2.5 rounded-xl font-bold text-xs whitespace-nowrap transition-all border shrink-0 ${
                isSelected
                  ? 'bg-brand-gold text-brand-dark-900 border-brand-gold shadow-gold'
                  : 'bg-brand-dark-800 text-brand-cream-muted border-brand-dark-600 hover:border-brand-gold/40'
              }`}
            >
              {cat.name_ar}
            </button>
          );
        })}
      </div>

      {/* Quick Filter Badges */}
      <div className="flex flex-wrap items-center gap-2 text-xs">
        <span className="text-brand-cream-dim font-bold">تصفية حسب:</span>
        <button
          onClick={() => setFilterMode('all')}
          className={`px-3 py-1 rounded-lg font-bold border transition-colors ${
            filterMode === 'all'
              ? 'bg-brand-dark-700 border-brand-gold text-brand-gold'
              : 'bg-brand-dark-800 border-transparent text-brand-cream-muted'
          }`}
        >
          الكل
        </button>
        <button
          onClick={() => setFilterMode('popular')}
          className={`px-3 py-1 rounded-lg font-bold border flex items-center gap-1 transition-colors ${
            filterMode === 'popular'
              ? 'bg-brand-gold/20 border-brand-gold text-brand-gold'
              : 'bg-brand-dark-800 border-transparent text-brand-cream-muted'
          }`}
        >
          <Flame className="w-3 h-3 text-brand-gold" />
          <span>الأكثر طلباً</span>
        </button>
        <button
          onClick={() => setFilterMode('featured')}
          className={`px-3 py-1 rounded-lg font-bold border flex items-center gap-1 transition-colors ${
            filterMode === 'featured'
              ? 'bg-brand-red/20 border-brand-red-bright text-brand-cream'
              : 'bg-brand-dark-800 border-transparent text-brand-cream-muted'
          }`}
        >
          <Sparkles className="w-3 h-3 text-amber-300" />
          <span>المميز</span>
        </button>
      </div>

      {/* Product Grid */}
      {filteredProducts.length === 0 ? (
        <div className="py-16 text-center space-y-3 glass-panel rounded-2xl border border-brand-dark-700">
          <span className="text-4xl block">🔎</span>
          <h3 className="text-lg font-bold text-brand-cream">لا توجد منتجات مطابقة للبحث</h3>
          <p className="text-xs text-brand-cream-muted">جرب البحث بكلمة ثانية أو اختيار قسم آخر</p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('all');
              setFilterMode('all');
            }}
            className="text-xs text-brand-gold underline font-bold"
          >
            إعادة ضبط البحث
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6">
          {filteredProducts.map((prod) => (
            <ProductCard
              key={prod.id}
              product={prod}
              onSelectProduct={(p) => setSelectedProduct(p)}
            />
          ))}
        </div>
      )}

      {/* Product Customizer Modal */}
      <ProductModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />
    </section>
  );
}
