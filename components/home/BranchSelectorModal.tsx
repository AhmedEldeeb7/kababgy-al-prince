'use client';

import React from 'react';
import { X, MapPin, Phone, Clock, CheckCircle2 } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { Branch } from '@/types/database';
import { INITIAL_BRANCHES } from '@/lib/mockData';

interface BranchSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function BranchSelectorModal({ isOpen, onClose }: BranchSelectorModalProps) {
  const { selectedBranch, setSelectedBranch } = useCart();

  if (!isOpen) return null;

  const handleSelectBranch = (branch: Branch) => {
    setSelectedBranch(branch);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-lg glass-panel rounded-3xl p-6 border border-brand-gold/30 shadow-2xl space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-brand-gold/20 pb-4">
          <div className="flex items-center gap-2">
            <MapPin className="w-6 h-6 text-brand-gold" />
            <h3 className="text-xl font-black text-brand-cream">اختر الفرع الأقرب ليك 📍</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-brand-cream-muted hover:text-brand-cream hover:bg-brand-dark-700 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <p className="text-xs text-brand-cream-muted leading-relaxed">
          تعتمد أصناف المنيو ورسوم التوصيل والحد الأدنى للطلب على الفرع الذي يتم اختياره.
        </p>

        {/* Branch List */}
        <div className="space-y-3">
          {INITIAL_BRANCHES.map((branch) => {
            const isSelected = selectedBranch?.id === branch.id;
            return (
              <button
                key={branch.id}
                onClick={() => handleSelectBranch(branch)}
                className={`w-full text-right p-4 rounded-2xl border transition-all flex items-start justify-between ${
                  isSelected
                    ? 'bg-brand-gold/10 border-brand-gold shadow-gold'
                    : 'bg-brand-dark-800/80 border-brand-dark-600 hover:border-brand-gold/50 hover:bg-brand-dark-700'
                }`}
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-base text-brand-cream">
                      {branch.name_ar}
                    </span>
                    <span className="text-[10px] bg-emerald-500/20 text-emerald-400 font-bold px-2 py-0.5 rounded-full">
                      مفتوح الآن 🟢
                    </span>
                  </div>
                  <p className="text-xs text-brand-cream-muted flex items-center gap-1.5 pt-1">
                    <MapPin className="w-3.5 h-3.5 text-brand-gold shrink-0" />
                    <span>{branch.address}</span>
                  </p>
                  <p className="text-xs text-brand-cream-muted flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-brand-gold shrink-0" />
                    <span>{branch.phone}</span>
                  </p>
                  <p className="text-[11px] text-brand-cream-dim flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-brand-cream-dim shrink-0" />
                    <span>مواعيد العمل: {branch.opening_time} - {branch.closing_time}</span>
                  </p>
                </div>

                {isSelected ? (
                  <CheckCircle2 className="w-6 h-6 text-brand-gold shrink-0 mt-1" />
                ) : (
                  <span className="text-xs text-brand-gold font-bold underline shrink-0 mt-1">
                    اختيار
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Footer info */}
        <div className="pt-2 border-t border-brand-gold/20 text-center">
          <button
            onClick={onClose}
            className="w-full py-3 bg-brand-dark-700 hover:bg-brand-dark-600 rounded-xl text-sm font-bold text-brand-cream transition-colors"
          >
            تأكيد وإغلاق
          </button>
        </div>
      </div>
    </div>
  );
}
