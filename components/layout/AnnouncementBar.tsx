'use client';

import React from 'react';
import { usePathname } from 'next/navigation';

export default function AnnouncementBar() {
  const pathname = usePathname();
  if (pathname?.startsWith('/admin')) return null;

  return (
    <div className="bg-gradient-to-r from-brand-red-dark via-brand-red to-brand-red-dark text-white text-xs md:text-sm font-bold py-2 text-center px-4 shadow-md flex items-center justify-center gap-2">
      <span className="animate-pulse">🔥</span>
      <span>طعم على أصوله! خدمة التوصيل السريع متوفرة لجميع المناطق - الخط الساخن: 01288883934</span>
      <span className="animate-pulse">🔥</span>
    </div>
  );
}
