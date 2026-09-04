'use client';

import React from 'react';
import { Flame, ShieldCheck, Award, Bike } from 'lucide-react';

export default function WhyChooseUs() {
  const features = [
    {
      icon: ShieldCheck,
      title: 'لحوم بلدية 100% طازجة',
      description: 'نضمن لك أجود أنواع اللحوم البلدية الطازجة يومياً بدون أي إضافات مجمدة.',
    },
    {
      icon: Flame,
      title: 'شوي على الفحم بتتبيلة خاصة',
      description: 'التسوية المثالية على الفحم النباتي مع تتبيلة البرنس التاريخية السرية.',
    },
    {
      icon: Award,
      title: 'طواجن بالسمن البلدي الفاخر',
      description: 'طواجن فخار طازجة بطشة الثوم والكزبرة والسمن البلدي الأصيل.',
    },
    {
      icon: Bike,
      title: 'توصيل حراري سريع وساخن',
      description: 'تغليف حراري فاخر يضمن وصول طلبك سخن ومقرمش كأنك قاعد في المطعم.',
    },
  ];

  return (
    <section id="about" className="py-16 bg-brand-dark-900 border-t border-brand-gold/15">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <span className="text-xs font-extrabold text-brand-gold bg-brand-gold/10 px-3 py-1 rounded-full border border-brand-gold/20">
            سر جودة كبابجي البرنس 👑
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-brand-cream">
            ليه كبابجي البرنس الاختيار الأول دائماً؟
          </h2>
          <p className="text-sm text-brand-cream-muted leading-relaxed">
            خبرة عقود في عالم المشويات والطواجن المصرية، حافظنا فيها على أصالة الطعم وأعلى مستويات النظافة والجودة.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <div
                key={idx}
                className="glass-card p-6 rounded-2xl border border-brand-gold/20 text-right space-y-3 hover:border-brand-gold transition-all"
              >
                <div className="w-12 h-12 rounded-xl bg-brand-gold/15 flex items-center justify-center border border-brand-gold/30">
                  <Icon className="w-6 h-6 text-brand-gold" />
                </div>
                <h3 className="text-lg font-extrabold text-brand-cream">{feat.title}</h3>
                <p className="text-xs text-brand-cream-muted leading-relaxed">
                  {feat.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
