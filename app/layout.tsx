import type { Metadata } from 'next';
import { Cairo, Tajawal } from 'next/font/google';
import './globals.css';
import { CartProvider } from '@/context/CartContext';
import AnnouncementBar from '@/components/layout/AnnouncementBar';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import StickyMobileNav from '@/components/layout/StickyMobileNav';
import CartDrawer from '@/components/cart/CartDrawer';

const cairo = Cairo({
  subsets: ['arabic', 'latin'],
  weight: ['400', '600', '700', '800', '900'],
  variable: '--font-cairo',
  display: 'swap',
});

const tajawal = Tajawal({
  subsets: ['arabic'],
  weight: ['400', '500', '700', '800'],
  variable: '--font-tajawal',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'كبابجي البرنس | اطلب مشويات وطواجن أونلاين 🔥',
  description: 'الموقع الرسمي لمطعم كبابجي البرنس. اطلب كباب، كفتة، طرب، طواجن بالسمن البلدي وحمام محشي أونلاين مع خدمة التوصيل السريع.',
  keywords: ['كبابجي البرنس', 'كباب سعيد البرنس', 'مشويات إمبابة', 'طواجن بالسمن البلدي', 'كباب وكفتة', 'حمام محشي', 'توصيل مشويات'],
  openGraph: {
    title: 'كبابجي البرنس - طعم على أصوله 🔥',
    description: 'الموقع الرسمي لمطعم كبابجي البرنس. اطلب أشهى المشويات والطواجن أونلاين بأسهل طريقة.',
    url: 'https://kababgy-al-prince.com',
    siteName: 'كبابجي البرنس',
    locale: 'ar_EG',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'كبابجي البرنس | طعم على أصوله 🔥',
    description: 'اطلب كباب، كفتة، طرب وحمام محشي أونلاين من كبابجي البرنس.',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" className={`${cairo.variable} ${tajawal.variable}`}>
      <body className="bg-brand-dark-900 text-brand-cream antialiased min-h-screen flex flex-col selection:bg-brand-gold selection:text-brand-dark-900">
        <CartProvider>
          <AnnouncementBar />
          <Header />
          
          <main className="flex-1 pb-[calc(5rem+env(safe-area-inset-bottom))] lg:pb-0">{children}</main>

          <Footer />
          <StickyMobileNav />
          <CartDrawer />
        </CartProvider>
      </body>
    </html>
  );
}


