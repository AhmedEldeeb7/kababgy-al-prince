'use client';

import React, { useState } from 'react';
import { INITIAL_CATEGORIES } from '@/lib/mockData';
import { Category } from '@/types/database';
import { Plus, Edit2, FolderTree, Trash2 } from 'lucide-react';

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>(INITIAL_CATEGORIES);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCat, setEditingCat] = useState<Partial<Category>>({});

  const handleSaveCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCat.name_ar) return;

    if (editingCat.id) {
      setCategories((prev) =>
        prev.map((c) => (c.id === editingCat.id ? ({ ...c, ...editingCat } as Category) : c))
      );
    } else {
      const newCat: Category = {
        id: `c_custom_${Date.now()}`,
        name_ar: editingCat.name_ar,
        name_en: editingCat.name_en || '',
        slug: editingCat.slug || editingCat.name_ar.toLowerCase().replace(/\s+/g, '-'),
        sort_order: categories.length + 1,
        is_active: true,
      };
      setCategories((prev) => [...prev, newCat]);
    }
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-brand-gold/20 pb-4">
        <div>
          <h1 className="text-3xl font-black text-brand-cream">إدارة أقسام المنيو 📁</h1>
          <p className="text-xs text-brand-cream-muted">ترتيب وإضافة الأقسام التي تظهر في شريط المنيو.</p>
        </div>

        <button
          onClick={() => {
            setEditingCat({ name_ar: '', slug: '' });
            setIsModalOpen(true);
          }}
          className="btn-gold flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-xs font-extrabold shadow-gold"
        >
          <Plus className="w-4 h-4 text-brand-dark-900" />
          <span>إضافة قسم جديد ➕</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map((cat) => (
          <div key={cat.id} className="glass-panel p-5 rounded-2xl border border-brand-gold/20 space-y-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-brand-gold/15 border border-brand-gold/30 flex items-center justify-center text-brand-gold font-bold">
                {cat.sort_order}
              </div>
              <div>
                <h3 className="font-bold text-sm text-brand-cream">{cat.name_ar}</h3>
                <span className="text-[10px] text-brand-cream-dim block">Slug: {cat.slug}</span>
              </div>
            </div>

            <button
              onClick={() => {
                setEditingCat(cat);
                setIsModalOpen(true);
              }}
              className="p-2 bg-brand-dark-700 hover:bg-brand-gold hover:text-brand-dark-900 rounded-xl text-brand-cream transition-colors"
            >
              <Edit2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <form onSubmit={handleSaveCategory} className="relative w-full max-w-md glass-panel p-6 rounded-3xl border border-brand-gold/30 space-y-4">
            <h3 className="text-lg font-black text-brand-cream border-b border-brand-gold/20 pb-3">
              {editingCat.id ? 'تعديل قسم' : 'إضافة قسم جديد ➕'}
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-brand-cream block mb-1">اسم القسم باللغة العربية *</label>
                <input
                  type="text"
                  required
                  value={editingCat.name_ar || ''}
                  onChange={(e) => setEditingCat({ ...editingCat, name_ar: e.target.value })}
                  className="w-full bg-brand-dark-800 border border-brand-dark-600 rounded-xl p-2.5 text-brand-cream font-bold outline-none"
                />
              </div>

              <div>
                <label className="font-bold text-brand-cream block mb-1">الرمز التعريفي (Slug)</label>
                <input
                  type="text"
                  value={editingCat.slug || ''}
                  onChange={(e) => setEditingCat({ ...editingCat, slug: e.target.value })}
                  placeholder="e.g. grills"
                  className="w-full bg-brand-dark-800 border border-brand-dark-600 rounded-xl p-2.5 text-brand-cream outline-none"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-brand-dark-700">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-brand-dark-700 text-brand-cream text-xs font-bold"
              >
                إلغاء
              </button>
              <button type="submit" className="btn-gold px-6 py-2 rounded-xl text-xs font-black shadow-gold">
                حفظ
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
