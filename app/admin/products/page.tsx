'use client';

import React, { useState } from 'react';
import { INITIAL_PRODUCTS, INITIAL_CATEGORIES } from '@/lib/mockData';
import { Product } from '@/types/database';
import { formatCurrency } from '@/lib/utils';
import { Plus, Edit2, Trash2, Eye, EyeOff, Search, Utensils, Check } from 'lucide-react';

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [search, setSearch] = useState('');
  const [selectedCat, setSelectedCat] = useState('all');
  const [editingProduct, setEditingProduct] = useState<Partial<Product> | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const filtered = products.filter((p) => {
    if (selectedCat !== 'all' && p.category_id !== selectedCat) return false;
    if (search.trim() && !p.name_ar.includes(search.trim())) return false;
    return true;
  });

  const handleToggleAvailable = (id: string) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, is_available: !p.is_available } : p))
    );
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct?.name_ar || !editingProduct?.base_price) return;

    if (editingProduct.id) {
      // Update
      setProducts((prev) =>
        prev.map((p) => (p.id === editingProduct.id ? ({ ...p, ...editingProduct } as Product) : p))
      );
    } else {
      // Create new
      const newProd: Product = {
        id: `p_custom_${Date.now()}`,
        category_id: editingProduct.category_id || INITIAL_CATEGORIES[0].id,
        name_ar: editingProduct.name_ar,
        description_ar: editingProduct.description_ar || '',
        base_price: Number(editingProduct.base_price),
        image_url: editingProduct.image_url || 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=800&q=80',
        is_available: true,
        is_popular: editingProduct.is_popular || false,
        is_featured: editingProduct.is_featured || false,
        prep_time_mins: Number(editingProduct.prep_time_mins) || 25,
      };
      setProducts((prev) => [newProd, ...prev]);
    }
    setIsModalOpen(false);
    setEditingProduct(null);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-brand-gold/20 pb-4">
        <div>
          <h1 className="text-3xl font-black text-brand-cream">إدارة أصناف المنيو 🍔</h1>
          <p className="text-xs text-brand-cream-muted">إضافة، تعديل الأسعار، وتفعيل/إيقاف الأصناف فوراً.</p>
        </div>

        <button
          onClick={() => {
            setEditingProduct({
              name_ar: '',
              description_ar: '',
              base_price: 150,
              category_id: INITIAL_CATEGORIES[0].id,
              prep_time_mins: 25,
            });
            setIsModalOpen(true);
          }}
          className="btn-gold flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-xs font-extrabold shadow-gold"
        >
          <Plus className="w-4 h-4 text-brand-dark-900" />
          <span>إضافة صنف جديد ➕</span>
        </button>
      </div>

      {/* Filter Row */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-brand-cream-dim absolute right-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="بحث باسم الصنف..."
            className="w-full bg-brand-dark-800 border border-brand-dark-600 rounded-xl py-2 pr-9 pl-3 text-xs font-bold text-brand-cream outline-none"
          />
        </div>

        <select
          value={selectedCat}
          onChange={(e) => setSelectedCat(e.target.value)}
          className="bg-brand-dark-800 border border-brand-dark-600 rounded-xl py-2 px-3 text-xs font-bold text-brand-cream outline-none"
        >
          <option value="all">جميع الأقسام</option>
          {INITIAL_CATEGORIES.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name_ar}
            </option>
          ))}
        </select>
      </div>

      {/* Products Table */}
      <div className="glass-panel p-4 rounded-3xl border border-brand-gold/20 shadow-xl overflow-x-auto">
        <table className="w-full text-right text-xs">
          <thead>
            <tr className="border-b border-brand-dark-700 text-brand-cream-dim">
              <th className="py-3 px-3">الصورة</th>
              <th className="py-3 px-3">اسم الصنف</th>
              <th className="py-3 px-3">السعر الأساسي</th>
              <th className="py-3 px-3">متاح للطلب</th>
              <th className="py-3 px-3">الشارات</th>
              <th className="py-3 px-3 text-center">الإجراءات</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-brand-dark-700">
            {filtered.map((prod) => (
              <tr key={prod.id} className="hover:bg-brand-dark-800/60 transition-colors">
                <td className="py-2.5 px-3">
                  <img
                    src={prod.image_url || 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=100&q=80'}
                    alt={prod.name_ar}
                    className="w-10 h-10 rounded-lg object-cover border border-brand-gold/20"
                  />
                </td>
                <td className="py-2.5 px-3 font-bold text-brand-cream">{prod.name_ar}</td>
                <td className="py-2.5 px-3 font-black text-brand-gold">{formatCurrency(prod.base_price)}</td>
                <td className="py-2.5 px-3">
                  <button
                    onClick={() => handleToggleAvailable(prod.id)}
                    className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${
                      prod.is_available
                        ? 'bg-emerald-500/20 text-emerald-400'
                        : 'bg-red-500/20 text-red-400'
                    }`}
                  >
                    {prod.is_available ? 'متاح 🟢' : 'غير متاح 🔴'}
                  </button>
                </td>
                <td className="py-2.5 px-3 space-x-1 space-x-reverse">
                  {prod.is_popular && <span className="text-[10px] bg-brand-gold text-brand-dark-900 font-extrabold px-2 py-0.5 rounded-md">الأكثر طلباً</span>}
                  {prod.is_featured && <span className="text-[10px] bg-brand-red text-white font-bold px-2 py-0.5 rounded-md">مميز</span>}
                </td>
                <td className="py-2.5 px-3 text-center">
                  <button
                    onClick={() => {
                      setEditingProduct(prod);
                      setIsModalOpen(true);
                    }}
                    className="p-1.5 bg-brand-dark-700 hover:bg-brand-gold hover:text-brand-dark-900 rounded-lg text-brand-cream transition-colors"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add / Edit Modal */}
      {isModalOpen && editingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <form onSubmit={handleSaveProduct} className="relative w-full max-w-md glass-panel p-6 rounded-3xl border border-brand-gold/30 space-y-4">
            <h3 className="text-lg font-black text-brand-cream border-b border-brand-gold/20 pb-3">
              {editingProduct.id ? 'تعديل الصنف' : 'إضافة صنف جديد ➕'}
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-brand-cream block mb-1">اسم الصنف باللغة العربية *</label>
                <input
                  type="text"
                  required
                  value={editingProduct.name_ar || ''}
                  onChange={(e) => setEditingProduct({ ...editingProduct, name_ar: e.target.value })}
                  className="w-full bg-brand-dark-800 border border-brand-dark-600 rounded-xl p-2.5 text-brand-cream outline-none font-bold"
                />
              </div>

              <div>
                <label className="font-bold text-brand-cream block mb-1">السعر (بالجنيه المصري) *</label>
                <input
                  type="number"
                  required
                  value={editingProduct.base_price || ''}
                  onChange={(e) => setEditingProduct({ ...editingProduct, base_price: Number(e.target.value) })}
                  className="w-full bg-brand-dark-800 border border-brand-dark-600 rounded-xl p-2.5 text-brand-cream outline-none font-bold"
                />
              </div>

              <div>
                <label className="font-bold text-brand-cream block mb-1">وصف الصنف</label>
                <textarea
                  rows={2}
                  value={editingProduct.description_ar || ''}
                  onChange={(e) => setEditingProduct({ ...editingProduct, description_ar: e.target.value })}
                  className="w-full bg-brand-dark-800 border border-brand-dark-600 rounded-xl p-2.5 text-brand-cream outline-none resize-none"
                />
              </div>

              <div>
                <label className="font-bold text-brand-cream block mb-1">رابط صورة الطعام (URL)</label>
                <input
                  type="url"
                  value={editingProduct.image_url || ''}
                  onChange={(e) => setEditingProduct({ ...editingProduct, image_url: e.target.value })}
                  placeholder="https://..."
                  className="w-full bg-brand-dark-800 border border-brand-dark-600 rounded-xl p-2.5 text-brand-cream outline-none"
                />
              </div>

              <div className="flex items-center gap-4 pt-2">
                <label className="flex items-center gap-2 cursor-pointer font-bold text-brand-cream">
                  <input
                    type="checkbox"
                    checked={editingProduct.is_popular || false}
                    onChange={(e) => setEditingProduct({ ...editingProduct, is_popular: e.target.checked })}
                  />
                  <span>علم كأكثر طلباً 🔥</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer font-bold text-brand-cream">
                  <input
                    type="checkbox"
                    checked={editingProduct.is_featured || false}
                    onChange={(e) => setEditingProduct({ ...editingProduct, is_featured: e.target.checked })}
                  />
                  <span>صنف مميز ⭐</span>
                </label>
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
                حفظ البيانات
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
