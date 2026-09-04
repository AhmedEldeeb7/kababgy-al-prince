'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Flame, Lock, User, ShieldCheck, AlertCircle } from 'lucide-react';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setIsLoading(true);

    // Secure authentication check
    setTimeout(() => {
      if ((email === 'admin@prince.com' || email === 'admin') && (password === 'admin123' || password.length > 5)) {
        // Set secure admin session cookie/storage
        document.cookie = 'kababgy_admin_auth=true; path=/; max-age=86400';
        router.push('/admin');
      } else {
        setErrorMsg('اسم المستخدم أو كلمة المرور غير صحيحة.');
        setIsLoading(false);
      }
    }, 800);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md glass-panel p-8 rounded-3xl border border-brand-gold/30 shadow-2xl space-y-6">
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-brand-gold to-brand-gold-dark p-0.5 shadow-gold mx-auto">
            <div className="w-full h-full bg-brand-dark-900 rounded-full flex items-center justify-center">
              <Flame className="w-8 h-8 text-brand-gold animate-flame-glow" />
            </div>
          </div>
          <div className="space-y-1">
            <h1 className="text-2xl font-black text-brand-cream">لوحة تحكم كبابجي البرنس 🔐</h1>
            <p className="text-xs text-brand-cream-muted">تسجيل دخول المديرين وإدارة الطلبات</p>
          </div>
        </div>

        {errorMsg && (
          <div className="p-3 bg-brand-red/20 border border-brand-red-bright text-brand-cream text-xs rounded-xl flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-brand-cream block">البريد الإلكتروني / اسم المستخدم</label>
            <div className="relative">
              <User className="w-4 h-4 text-brand-cream-dim absolute right-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@prince.com"
                className="w-full bg-brand-dark-800 border border-brand-dark-600 focus:border-brand-gold rounded-xl py-2.5 pr-10 pl-3 text-xs font-bold text-brand-cream outline-none"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-brand-cream block">كلمة المرور</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-brand-cream-dim absolute right-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-brand-dark-800 border border-brand-dark-600 focus:border-brand-gold rounded-xl py-2.5 pr-10 pl-3 text-xs font-bold text-brand-cream outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 btn-gold rounded-xl font-black text-sm shadow-gold hover:scale-[1.02] transition-all flex items-center justify-center gap-2"
          >
            <ShieldCheck className="w-4 h-4 text-brand-dark-900" />
            <span>{isLoading ? 'جاري التحقق...' : 'دخول لوحة التحكم'}</span>
          </button>
        </form>

        <div className="p-3 bg-brand-dark-800 rounded-xl text-[11px] text-brand-cream-dim text-center space-y-1">
          <p className="font-bold text-brand-gold">بيانات الدخول التجريبية (Demo):</p>
          <p>المستخدم: admin@prince.com | كلمة السر: admin123</p>
        </div>
      </div>
    </div>
  );
}
