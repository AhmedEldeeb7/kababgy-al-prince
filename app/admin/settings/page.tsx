'use client';

import React, { useState } from 'react';
import { INITIAL_SETTINGS } from '@/lib/mockData';
import { RestaurantSettings } from '@/types/database';
import { Settings, Save, CheckCircle2, Phone, MessageSquare, AlertTriangle } from 'lucide-react';

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<RestaurantSettings>(INITIAL_SETTINGS);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-4xl animate-fadeIn">
      {/* Header Title */}
      <div className="border-b border-brand-gold/20 pb-4">
        <h1 className="text-3xl font-black text-brand-cream">إعدادات كبابجي البرنس العامة ⚙️</h1>
        <p className="text-xs text-brand-cream-muted">
          إدارة رقم الواتساب المباشر، الخط الساخن، شريط الإعلانات، ونمط الصيانة.
        </p>
      </div>

      {savedSuccess && (
        <div className="p-4 bg-emerald-500/20 border border-emerald-500 text-emerald-300 text-xs rounded-2xl flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span>تم حفظ إعدادات المطعم بنجاح وتحديث رقم الواتساب المباشر!</span>
        </div>
      )}

      <form onSubmit={handleSaveSettings} className="glass-panel p-6 rounded-3xl border border-brand-gold/20 space-y-6 shadow-xl">
        <div className="space-y-4 text-xs">
          <h3 className="font-extrabold text-sm text-brand-cream border-r-4 border-brand-gold pr-3">
            بيانات الهاتف والواتساب المباشر
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="font-bold text-brand-cream block flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-brand-gold" />
                <span>الخط الساخن للمطعم *</span>
              </label>
              <input
                type="text"
                required
                value={settings.primary_phone}
                onChange={(e) => setSettings({ ...settings, primary_phone: e.target.value })}
                className="w-full bg-brand-dark-800 border border-brand-dark-600 rounded-xl p-3 text-brand-cream font-bold outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-brand-cream block flex items-center gap-1.5">
                <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />
                <span>رقم استقبال طلبات الواتساب (بالكود الدولي 20) *</span>
              </label>
              <input
                type="text"
                required
                value={settings.whatsapp_number}
                onChange={(e) => setSettings({ ...settings, whatsapp_number: e.target.value })}
                placeholder="201288883934"
                className="w-full bg-brand-dark-800 border border-brand-gold/30 focus:border-brand-gold rounded-xl p-3 text-brand-cream font-bold outline-none"
              />
            </div>
          </div>
        </div>

        <div className="space-y-4 text-xs border-t border-brand-dark-700 pt-6">
          <h3 className="font-extrabold text-sm text-brand-cream border-r-4 border-brand-gold pr-3">
            هوية وشريط إعلانات الموقع
          </h3>

          <div className="space-y-3">
            <div className="space-y-1">
              <label className="font-bold text-brand-cream block">اسم المطعم باللغة العربية</label>
              <input
                type="text"
                value={settings.restaurant_name}
                onChange={(e) => setSettings({ ...settings, restaurant_name: e.target.value })}
                className="w-full bg-brand-dark-800 border border-brand-dark-600 rounded-xl p-3 text-brand-cream font-bold outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-brand-cream block">نص شريط الإعلانات العليوي (Hero Banner Notice)</label>
              <input
                type="text"
                value={settings.announcement}
                onChange={(e) => setSettings({ ...settings, announcement: e.target.value })}
                className="w-full bg-brand-dark-800 border border-brand-dark-600 rounded-xl p-3 text-brand-cream font-bold outline-none"
              />
            </div>
          </div>
        </div>

        <div className="space-y-4 text-xs border-t border-brand-dark-700 pt-6">
          <h3 className="font-extrabold text-sm text-brand-cream border-r-4 border-brand-gold pr-3">
            قواعد الطلبات وتفعيل وضع الصيانة
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="font-bold text-brand-cream block">الحد الأدنى الافتراضي للطلب (جنيه)</label>
              <input
                type="number"
                value={settings.minimum_order_default}
                onChange={(e) => setSettings({ ...settings, minimum_order_default: Number(e.target.value) })}
                className="w-full bg-brand-dark-800 border border-brand-dark-600 rounded-xl p-3 text-brand-cream font-bold outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-brand-cream block">ساعات العمل الرسمية</label>
              <input
                type="text"
                value={settings.opening_hours}
                onChange={(e) => setSettings({ ...settings, opening_hours: e.target.value })}
                className="w-full bg-brand-dark-800 border border-brand-dark-600 rounded-xl p-3 text-brand-cream font-bold outline-none"
              />
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-400" />
              <div>
                <span className="font-bold text-brand-cream block">وضع الصيانة المؤقت</span>
                <span className="text-[11px] text-brand-cream-muted">إغلاق استقبال الطلبات أونلاين مؤقتاً عند الإنعاش أو الضغط.</span>
              </div>
            </div>
            <input
              type="checkbox"
              checked={settings.maintenance_mode}
              onChange={(e) => setSettings({ ...settings, maintenance_mode: e.target.checked })}
              className="w-5 h-5 accent-brand-gold"
            />
          </div>
        </div>

        <div className="pt-4 border-t border-brand-dark-700 flex justify-end">
          <button
            type="submit"
            className="btn-gold px-8 py-3 rounded-xl font-black text-xs shadow-gold hover:scale-105 transition-all flex items-center gap-2"
          >
            <Save className="w-4 h-4 text-brand-dark-900" />
            <span>حفظ جميع الإعدادات</span>
          </button>
        </div>
      </form>
    </div>
  );
}
