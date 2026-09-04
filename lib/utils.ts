import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { CustomerAddress, CartItem } from '@/types/database';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number): string {
  return `${amount.toLocaleString('ar-EG')} جنيه`;
}

export function generateOrderCode(): string {
  const dateStr = new Date().getFullYear();
  const randomNum = Math.floor(100000 + Math.random() * 900000);
  return `KP-${dateStr}-${randomNum}`;
}

export function generateSecureToken(): string {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

/**
 * Normalizes Egyptian phone number to international format: 20XXXXXXXXXX
 */
export function normalizeWhatsAppPhone(phone: string): string {
  let cleaned = phone.replace(/\D/g, '');
  if (cleaned.startsWith('0')) {
    cleaned = '2' + cleaned;
  } else if (!cleaned.startsWith('20') && cleaned.length === 10) {
    cleaned = '20' + cleaned;
  }
  return cleaned;
}

export function buildWhatsAppUrl(
  whatsappPhone: string,
  orderCode: string,
  branchName: string,
  customerName: string,
  customerPhone: string,
  address: CustomerAddress,
  items: CartItem[],
  subtotal: number,
  deliveryFee: number,
  total: number,
  notes?: string
): string {
  const normalizedPhone = normalizeWhatsAppPhone(whatsappPhone);

  let msg = `السلام عليكم 👋\n\n`;
  msg += `طلب جديد من كبابجي البرنس 🔥\n`;
  msg += `رقم الطلب: #${orderCode}\n`;
  msg += `الفرع: ${branchName}\n\n`;
  msg += `📋 *تفاصيل الطلب:*\n`;

  items.forEach((item, index) => {
    msg += `${index + 1}. *${item.product.name_ar}* × ${item.quantity}\n`;
    if (item.selected_options && item.selected_options.length > 0) {
      const opts = item.selected_options.map((o) => o.item_name).join(', ');
      msg += `   └ الإضافات: ${opts}\n`;
    }
    msg += `   └ السعر: ${item.total_price} جنيه\n`;
  });

  msg += `\n💰 *المجموع:* ${subtotal} جنيه\n`;
  msg += `🛵 *التوصيل:* ${deliveryFee} جنيه\n`;
  msg += `💵 *الإجمالي:* *${total} جنيه*\n\n`;

  msg += `👤 *بيانات العميل:*\n`;
  msg += `الاسم: ${customerName}\n`;
  msg += `الهاتف: ${customerPhone}\n`;
  msg += `العنوان: ${address.area} - شارع ${address.street}`;
  if (address.building) msg += ` - عمارة ${address.building}`;
  if (address.floor) msg += ` - دور ${address.floor}`;
  if (address.apartment) msg += ` - شقة ${address.apartment}`;
  if (address.landmark) msg += ` (علامة مميزة: ${address.landmark})`;
  msg += `\n`;

  if (notes && notes.trim().length > 0) {
    msg += `\n📝 *ملاحظات:* ${notes.trim()}\n`;
  }

  msg += `\nشكراً لاختياركم كبابجي البرنس! 👑`;

  const encodedMsg = encodeURIComponent(msg);
  return `https://wa.me/${normalizedPhone}?text=${encodedMsg}`;
}
