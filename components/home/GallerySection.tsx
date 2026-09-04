'use client';

import React from 'react';
import { Camera } from 'lucide-react';

export default function GallerySection() {
  const images = [
    {
      url: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=800&q=80',
      title: 'كباب وريش ضاني مشوية',
    },
    {
      url: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=800&q=80',
      title: 'حمام محشي أرز بالخلطة',
    },
    {
      url: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80',
      title: 'صواني البرنس العائلية',
    },
    {
      url: 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?auto=format&fit=crop&w=800&q=80',
      title: 'كفتة مشوية على الفحم',
    },
  ];

  return (
    <section className="py-16 bg-gradient-to-b from-brand-dark-900 to-brand-dark-800 border-t border-brand-gold/15">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 text-xs font-bold text-brand-gold bg-brand-gold/10 px-3 py-1 rounded-full border border-brand-gold/20">
            <Camera className="w-3.5 h-3.5" />
            <span>معرض الصور الأسبوعي</span>
          </div>
          <h2 className="text-3xl font-black text-brand-cream">
            من قلب مطبخ وسفرة البرنس 📸
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {images.map((img, i) => (
            <div
              key={i}
              className="relative aspect-square rounded-2xl overflow-hidden glass-panel border border-brand-gold/20 group hover:border-brand-gold transition-all"
            >
              <img
                src={img.url}
                alt={img.title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-dark-900/90 via-transparent to-transparent" />
              <div className="absolute bottom-3 right-3 left-3">
                <span className="text-xs font-bold text-brand-cream block line-clamp-1">
                  {img.title}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
