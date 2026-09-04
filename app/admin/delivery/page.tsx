'use client';

import React, { useState } from 'react';
import { INITIAL_DELIVERY_ZONES, INITIAL_BRANCHES } from '@/lib/mockData';
import { DeliveryZone } from '@/types/database';
import { formatCurrency } from '@/lib/utils';
import { Bike, Plus, Edit2 } from 'lucide-react';

export default function AdminDeliveryPage() {
  const [zones, setZones] = useState<DeliveryZone[]>(INITIAL_DELIVERY_ZONES);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingZone, setEditingZone] = useState<Partial<DeliveryZone>>({});

  const handleSaveZone = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingZone.area_name || !editingZone.delivery_fee) return;

    if (editingZone.id) {
      setZones((prev) =>
        prev.map((z) => (z.id === editingZone.id ? ({ ...z, ...editingZone } as DeliveryZone) : z))
      );
    } else {
      const newZone: DeliveryZone = {
        id: `dz_custom_${Date.now()}`,
        branch_id: editingZone.branch_id || INITIAL_BRANCHES[0].id,
        area_name: editingZone.area_name,
        delivery_fee: Number(editingZone.delivery_fee),
        min_order: Number(editingZone.min_order) || 100,
        est_time_mins: Number(editingZone.est_time_mins) || 35,
        is_active: true,
      };
      setZones((prev) => [newZone, ...prev]);
    }
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-brand-gold/20 pb-4">
        <div>
          <h1 className="text-3xl font-black text-brand-cream">إدارة مناطق ورسوم التوصيل 🛵</h1>
          <p className="text-xs text-brand-cream-muted">تحديد رسوم التوصيل والحد الأدنى للطلب لكل منطقة سكنية.</p>
        </div>

        <button
          onClick={() => {
            setEditingZone({ area_name: '', delivery_fee: 25, min_order: 100, est_time_mins: 35 });
            setIsModalOpen(true);
          }}
          className="btn-gold flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-xs font-extrabold shadow-gold"
        >
          <Plus className="w-4 h-4 text-brand-dark-900" />
          <span>إضافة منطقة توصيل جديدة ➕</span>
        </button>
      </div>

      <div className="glass-panel p-4 rounded-3xl border border-brand-gold/20 shadow-xl overflow-x-auto">
        <table className="w-full text-right text-xs">
          <thead>
            <tr className="border-b border-brand-dark-700 text-brand-cream-dim">
              <th className="py-3 px-3">المنطقة السكنية</th>
              <th className="py-3 px-3">الفرع التابع له</th>
              <th className="py-3 px-3">رسوم التوصيل</th>
              <th className="py-3 px-3">الحد الأدنى للطلب</th>
              <th className="py-3 px-3">الوقت المقدر</th>
              <th className="py-3 px-3 text-center">الإجراءات</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-brand-dark-700">
            {zones.map((z) => {
              const branchName = INITIAL_BRANCHES.find((b) => b.id === z.branch_id)?.name_ar || 'جميع الفروع';
              return (
                <tr key={z.id} className="hover:bg-brand-dark-800/60 transition-colors">
                  <td className="py-3 px-3 font-bold text-brand-cream">{z.area_name}</td>
                  <td className="py-3 px-3 text-brand-cream-muted">{branchName}</td>
                  <td className="py-3 px-3 font-black text-brand-gold">{formatCurrency(z.delivery_fee)}</td>
                  <td className="py-3 px-3 font-bold text-brand-cream">{formatCurrency(z.min_order)}</td>
                  <td className="py-3 px-3 text-brand-cream-dim">⏱️ {z.est_time_mins} دقيقة</td>
                  <td className="py-3 px-3 text-center">
                    <button
                      onClick={() => {
                        setEditingZone(z);
                        setIsModalOpen(true);
                      }}
                      className="p-1.5 bg-brand-dark-700 hover:bg-brand-gold hover:text-brand-dark-900 rounded-lg text-brand-cream transition-colors"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <form onSubmit={handleSaveZone} className="relative w-full max-w-md glass-panel p-6 rounded-3xl border border-brand-gold/30 space-y-4">
            <h3 className="text-lg font-black text-brand-cream border-b border-brand-gold/20 pb-3">
              {editingZone.id ? 'تعديل منطقة توصيل' : 'إضافة منطقة توصيل جديدة ➕'}
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-brand-cream block mb-1">اسم المنطقة السكنية *</label>
                <input
                  type="text"
                  required
                  value={editingZone.area_name || ''}
                  onChange={(e) => setEditingZone({ ...editingZone, area_name: e.target.value })}
                  className="w-full bg-brand-dark-800 border border-brand-dark-600 rounded-xl p-2.5 text-brand-cream font-bold outline-none"
                />
              </div>

              <div>
                <label className="font-bold text-brand-cream block mb-1">الفرع التابع له</label>
                <select
                  value={editingZone.branch_id || INITIAL_BRANCHES[0].id}
                  onChange={(e) => setEditingZone({ ...editingZone, branch_id: e.target.value })}
                  className="w-full bg-brand-dark-800 border border-brand-dark-600 rounded-xl p-2.5 text-brand-cream font-bold outline-none"
                >
                  {INITIAL_BRANCHES.map((b) => (
                    <option key={b.id} value={b.id}>{b.name_ar}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-brand-cream block mb-1">رسوم التوصيل *</label>
                  <input
                    type="number"
                    required
                    value={editingZone.delivery_fee || ''}
                    onChange={(e) => setEditingZone({ ...editingZone, delivery_fee: Number(e.target.value) })}
                    className="w-full bg-brand-dark-800 border border-brand-dark-600 rounded-xl p-2.5 text-brand-cream font-bold outline-none"
                  />
                </div>

                <div>
                  <label className="font-bold text-brand-cream block mb-1">الحد الأدنى للطلب</label>
                  <input
                    type="number"
                    value={editingZone.min_order || ''}
                    onChange={(e) => setEditingZone({ ...editingZone, min_order: Number(e.target.value) })}
                    className="w-full bg-brand-dark-800 border border-brand-dark-600 rounded-xl p-2.5 text-brand-cream font-bold outline-none"
                  />
                </div>
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
