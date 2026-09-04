import React from 'react';
import MenuSection from '@/components/home/MenuSection';
import { getCategories, getProducts } from '@/lib/dataService';

export const revalidate = 60;

export default async function MenuPage() {
  const [categories, products] = await Promise.all([
    getCategories(),
    getProducts(),
  ]);

  return (
    <div className="pt-6 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6">
        <h1 className="text-3xl sm:text-4xl font-black text-brand-cream border-r-4 border-brand-gold pr-4">
          منيو كبابجي البرنس الكامل 📜
        </h1>
        <p className="text-xs text-brand-cream-muted mt-2 pr-4">
          تصفح جميع أقسام الأصناف، المشويات على الفحم، صواني العائلة، وطواجن السمن البلدي.
        </p>
      </div>

      <MenuSection categories={categories} products={products} />
    </div>
  );
}
