import { Branch, Category, Product, DeliveryZone, Offer, RestaurantSettings } from '@/types/database';
import {
  INITIAL_BRANCHES,
  INITIAL_CATEGORIES,
  INITIAL_PRODUCTS,
  INITIAL_DELIVERY_ZONES,
  INITIAL_OFFERS,
  INITIAL_SETTINGS,
} from './mockData';

function isSupabaseConfigured(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return false;
  if (url.includes('demo') || key.includes('demo')) return false;
  return true;
}

export async function getBranches(): Promise<Branch[]> {
  try {
    if (!isSupabaseConfigured()) return INITIAL_BRANCHES;

    const { createClient } = await import('@/lib/supabase/client');
    const supabase = createClient();
    const { data, error } = await supabase.from('branches').select('*').eq('is_active', true);
    if (error || !data || data.length === 0) return INITIAL_BRANCHES;
    return data as Branch[];
  } catch {
    return INITIAL_BRANCHES;
  }
}

export async function getCategories(): Promise<Category[]> {
  try {
    if (!isSupabaseConfigured()) return INITIAL_CATEGORIES;

    const { createClient } = await import('@/lib/supabase/client');
    const supabase = createClient();
    const { data, error } = await supabase.from('categories').select('*').eq('is_active', true).order('sort_order', { ascending: true });
    if (error || !data || data.length === 0) return INITIAL_CATEGORIES;
    return data as Category[];
  } catch {
    return INITIAL_CATEGORIES;
  }
}

export async function getProducts(): Promise<Product[]> {
  try {
    if (!isSupabaseConfigured()) return INITIAL_PRODUCTS;

    const { createClient } = await import('@/lib/supabase/client');
    const supabase = createClient();
    const { data, error } = await supabase.from('products').select('*, options:product_options(*, items:product_option_items(*))').eq('is_available', true);
    if (error || !data || data.length === 0) return INITIAL_PRODUCTS;
    return data as Product[];
  } catch {
    return INITIAL_PRODUCTS;
  }
}

export async function getDeliveryZones(branchId?: string): Promise<DeliveryZone[]> {
  try {
    if (!isSupabaseConfigured()) {
      if (!branchId) return INITIAL_DELIVERY_ZONES;
      return INITIAL_DELIVERY_ZONES.filter((dz) => dz.branch_id === branchId);
    }

    const { createClient } = await import('@/lib/supabase/client');
    const supabase = createClient();
    let query = supabase.from('delivery_zones').select('*').eq('is_active', true);
    if (branchId) query = query.eq('branch_id', branchId);
    const { data, error } = await query;
    if (error || !data || data.length === 0) {
      if (!branchId) return INITIAL_DELIVERY_ZONES;
      return INITIAL_DELIVERY_ZONES.filter((dz) => dz.branch_id === branchId);
    }
    return data as DeliveryZone[];
  } catch {
    if (!branchId) return INITIAL_DELIVERY_ZONES;
    return INITIAL_DELIVERY_ZONES.filter((dz) => dz.branch_id === branchId);
  }
}

export async function getOffers(): Promise<Offer[]> {
  try {
    if (!isSupabaseConfigured()) return INITIAL_OFFERS;

    const { createClient } = await import('@/lib/supabase/client');
    const supabase = createClient();
    const { data, error } = await supabase.from('offers').select('*').eq('is_active', true);
    if (error || !data || data.length === 0) return INITIAL_OFFERS;
    return data as Offer[];
  } catch {
    return INITIAL_OFFERS;
  }
}

export async function getRestaurantSettings(): Promise<RestaurantSettings> {
  try {
    if (!isSupabaseConfigured()) return INITIAL_SETTINGS;

    const { createClient } = await import('@/lib/supabase/client');
    const supabase = createClient();
    const { data, error } = await supabase.from('restaurant_settings').select('*');
    if (error || !data || data.length === 0) return INITIAL_SETTINGS;

    const settingsObj: Record<string, unknown> = {};
    data.forEach((row: { key: string; value: unknown }) => {
      settingsObj[row.key] = row.value;
    });

    return {
      restaurant_name: (settingsObj.restaurant_name as string) || INITIAL_SETTINGS.restaurant_name,
      restaurant_name_en: (settingsObj.restaurant_name_en as string) || INITIAL_SETTINGS.restaurant_name_en,
      primary_phone: (settingsObj.primary_phone as string) || INITIAL_SETTINGS.primary_phone,
      whatsapp_number: (settingsObj.whatsapp_number as string) || INITIAL_SETTINGS.whatsapp_number,
      currency: (settingsObj.currency as string) || INITIAL_SETTINGS.currency,
      announcement: (settingsObj.announcement as string) || INITIAL_SETTINGS.announcement,
      maintenance_mode: Boolean(settingsObj.maintenance_mode),
      minimum_order_default: Number(settingsObj.minimum_order_default) || INITIAL_SETTINGS.minimum_order_default,
      opening_hours: (settingsObj.opening_hours as string) || INITIAL_SETTINGS.opening_hours,
    };
  } catch {
    return INITIAL_SETTINGS;
  }
}
