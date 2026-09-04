'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutDashboard, ShoppingBag, Utensils, FolderTree, MapPin, Bike, Tag, Settings, LogOut, Flame } from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  // If on login page, render without sidebar
  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  const handleLogout = () => {
    document.cookie = 'kababgy_admin_auth=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    router.push('/admin/login');
  };

  const navItems = [
    { href: '/admin', label: 'لوحة القيادة', icon: LayoutDashboard },
    { href: '/admin/orders', label: 'إدارة الطلبات', icon: ShoppingBag, badge: 'جديد' },
    { href: '/admin/products', label: 'إدارة الاصناف والمنيو', icon: Utensils },
    { href: '/admin/categories', label: 'إدارة الأقسام', icon: FolderTree },
    { href: '/admin/branches', label: 'إدارة الفروع', icon: MapPin },
    { href: '/admin/delivery', label: 'مناطق ورسوم التوصيل', icon: Bike },
    { href: '/admin/offers', label: 'العروض والخصومات', icon: Tag },
    { href: '/admin/settings', label: 'إعدادات المطعم', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-brand-dark-900 flex flex-col md:flex-row">
      {/* Admin Sidebar */}
      <aside className="w-full md:w-64 glass-panel border-l border-brand-gold/20 p-4 flex flex-col justify-between shrink-0">
        <div className="space-y-6">
          {/* Logo Header */}
          <div className="flex items-center gap-3 border-b border-brand-gold/20 pb-4">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-brand-gold to-brand-gold-dark p-0.5 shadow-gold">
              <div className="w-full h-full bg-brand-dark-900 rounded-full flex items-center justify-center">
                <Flame className="w-5 h-5 text-brand-gold animate-flame-glow" />
              </div>
            </div>
            <div>
              <h2 className="font-black text-sm text-brand-cream">لوحة الإدارة 👑</h2>
              <span className="text-[10px] text-brand-gold font-bold">كبابجي البرنس</span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1 text-xs font-bold">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center justify-between p-3 rounded-xl transition-all ${
                    isActive
                      ? 'bg-brand-gold text-brand-dark-900 font-extrabold shadow-gold'
                      : 'text-brand-cream-muted hover:bg-brand-dark-800 hover:text-brand-gold'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className="text-[10px] bg-brand-red text-white px-2 py-0.5 rounded-full font-black">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Footer Logout */}
        <div className="pt-4 border-t border-brand-dark-700 space-y-2">
          <button
            onClick={handleLogout}
            className="w-full p-2.5 rounded-xl bg-brand-red/20 text-brand-red-bright hover:bg-brand-red hover:text-white transition-colors text-xs font-bold flex items-center justify-center gap-2"
          >
            <LogOut className="w-4 h-4" />
            <span>تسجيل الخروج</span>
          </button>
          <p className="text-[10px] text-brand-cream-dim text-center">نظام كبابجي البرنس v1.0</p>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-6 md:p-8 overflow-y-auto max-w-7xl">{children}</main>
    </div>
  );
}
