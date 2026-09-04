export type OrderStatus =
  | 'pending'
  | 'whatsapp_prepared'
  | 'customer_sent'
  | 'confirmed'
  | 'preparing'
  | 'ready'
  | 'out_for_delivery'
  | 'delivered'
  | 'cancelled';

export interface Branch {
  id: string;
  name_ar: string;
  name_en?: string;
  address: string;
  phone: string;
  whatsapp_number: string;
  opening_time: string;
  closing_time: string;
  is_active: boolean;
  lat?: number;
  lng?: number;
}

export interface Category {
  id: string;
  name_ar: string;
  name_en?: string;
  slug: string;
  image_url?: string;
  sort_order: number;
  is_active: boolean;
}

export interface ProductOptionItem {
  id: string;
  option_id: string;
  name_ar: string;
  price_modifier: number;
  is_default: boolean;
}

export interface ProductOption {
  id: string;
  product_id: string;
  title_ar: string;
  is_required: boolean;
  allow_multiple: boolean;
  sort_order: number;
  items: ProductOptionItem[];
}

export interface Product {
  id: string;
  category_id: string;
  name_ar: string;
  name_en?: string;
  description_ar?: string;
  base_price: number;
  image_url?: string;
  is_available: boolean;
  is_popular: boolean;
  is_featured: boolean;
  prep_time_mins: number;
  options?: ProductOption[];
}

export interface DeliveryZone {
  id: string;
  branch_id: string;
  area_name: string;
  delivery_fee: number;
  min_order: number;
  est_time_mins: number;
  is_active: boolean;
}

export interface CustomerAddress {
  id?: string;
  governorate: string;
  area: string;
  street: string;
  building?: string;
  floor?: string;
  apartment?: string;
  landmark?: string;
  notes?: string;
}

export interface CartItemOption {
  option_id: string;
  option_title: string;
  item_id: string;
  item_name: string;
  price_modifier: number;
}

export interface CartItem {
  cart_item_id: string; // Unique string for item + options combination
  product: Product;
  quantity: number;
  selected_options: CartItemOption[];
  unit_price: number;
  total_price: number;
}

export interface Order {
  id: string;
  order_code: string;
  customer_id?: string;
  guest_access_token: string;
  branch_id: string;
  delivery_zone_id: string;
  customer_name: string;
  customer_phone: string;
  address_details: CustomerAddress;
  status: OrderStatus;
  subtotal: number;
  delivery_fee: number;
  discount: number;
  total: number;
  customer_notes?: string;
  admin_notes?: string;
  created_at: string;
  items?: OrderItem[];
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id?: string;
  product_name_snapshot: string;
  unit_price_snapshot: number;
  quantity: number;
  subtotal: number;
  options?: {
    option_name_snapshot: string;
    option_price_snapshot: number;
  }[];
}

export interface Offer {
  id: string;
  title_ar: string;
  description_ar?: string;
  image_url?: string;
  old_price?: number;
  new_price: number;
  branch_id?: string;
  is_active: boolean;
  expires_at?: string;
}

export interface RestaurantSettings {
  restaurant_name: string;
  restaurant_name_en: string;
  primary_phone: string;
  whatsapp_number: string;
  currency: string;
  announcement: string;
  maintenance_mode: boolean;
  minimum_order_default: number;
  opening_hours: string;
}
