import React from 'react';
import Hero from '@/components/home/Hero';
import MenuSection from '@/components/home/MenuSection';
import OffersSection from '@/components/home/OffersSection';
import WhyChooseUs from '@/components/home/WhyChooseUs';
import GallerySection from '@/components/home/GallerySection';
import { getCategories, getProducts, getOffers } from '@/lib/dataService';

export const revalidate = 60; // Revalidate every 60 seconds

export default async function HomePage() {
  const [categories, products, offers] = await Promise.all([
    getCategories(),
    getProducts(),
    getOffers(),
  ]);

  return (
    <div className="space-y-6">
      <Hero />
      <OffersSection offers={offers} />
      <MenuSection categories={categories} products={products} />
      <WhyChooseUs />
      <GallerySection />
    </div>
  );
}
