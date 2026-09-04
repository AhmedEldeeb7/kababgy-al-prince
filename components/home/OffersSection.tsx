'use client';

import React from 'react';
import Link from 'next/link';
import { Offer } from '@/types/database';
import { formatCurrency } from '@/lib/utils';
import { Tag, Sparkles, ShoppingBag } from 'lucide-react';

interface OffersSectionProps {
  offers: Offer[];
}

export default function OffersSection({ offers }: OffersSectionProps) {
  if (!offers || offers.length === 0) return null;

  return (
    <section id="offers" className="py-12 bg-gradient-to-b from-brand-dark-900 via-brand-dark-800 to-brand-dark-900 border-t border-b border-brand-gold/15">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 text-xs font-bold text-brand-gold bg-brand-gold/10 px-3 py-1 rounded-full border border-brand-gold/20">
              <Tag className="w-3.5 h-3.5" />
              <span>عروض كبابجي البرنس الحصرية</span>
            </div>
            <h2 className="text-3xl font-black text-brand-cream">
              عروض الخصم وصواني العائلة 🔥
            </h2>
          </div>
          <Link href="/menu" className="text-xs font-bold text-brand-gold hover:underline">
            عرض جميع العروض والمجموعات ←
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {offers.map((offer) => (
            <div
              key={offer.id}
              className="relative glass-card rounded-3xl p-6 border border-brand-gold/30 flex flex-col sm:flex-row items-center gap-6 group hover:border-brand-gold transition-all"
            >
              {/* Offer Image */}
              <div className="relative w-full sm:w-44 aspect-square rounded-2xl overflow-hidden shrink-0">
                <img
                  src={offer.image_url || 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=500&q=80'}
                  alt={offer.title_ar}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute top-2 right-2 bg-brand-red text-white text-[11px] font-black px-2.5 py-1 rounded-full shadow-md">
                  توفير كبير 🔥
                </span>
              </div>

              {/* Offer Info */}
              <div className="flex-1 space-y-3 text-right">
                <h3 className="text-xl font-black text-brand-cream">{offer.title_ar}</h3>
                <p className="text-xs text-brand-cream-muted leading-relaxed">
                  {offer.description_ar}
                </p>

                <div className="flex items-center gap-3 pt-2">
                  {offer.old_price && (
                    <span className="text-xs text-brand-cream-dim line-through">
                      {formatCurrency(offer.old_price)}
                    </span>
                  )}
                  <span className="text-2xl font-black text-brand-gold">
                    {formatCurrency(offer.new_price)}
                  </span>
                </div>

                <Link
                  href="/menu"
                  className="btn-gold inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-extrabold shadow-gold"
                >
                  <ShoppingBag className="w-4 h-4 text-brand-dark-900" />
                  <span>اطلب العرض الآن</span>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
