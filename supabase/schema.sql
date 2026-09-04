-- PostgreSQL Schema for Kababgy Al Prince (كبابجي البرنس)

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Table: branches
CREATE TABLE IF NOT EXISTS branches (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name_ar VARCHAR(255) NOT NULL,
  name_en VARCHAR(255),
  address TEXT NOT NULL,
  phone VARCHAR(50) NOT NULL,
  whatsapp_number VARCHAR(50) NOT NULL,
  opening_time VARCHAR(20) DEFAULT '12:00 PM',
  closing_time VARCHAR(20) DEFAULT '04:00 AM',
  is_active BOOLEAN DEFAULT true,
  lat DOUBLE PRECISION,
  lng DOUBLE PRECISION,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table: categories
CREATE TABLE IF NOT EXISTS categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name_ar VARCHAR(255) NOT NULL,
  name_en VARCHAR(255),
  slug VARCHAR(255) UNIQUE NOT NULL,
  image_url TEXT,
  sort_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table: products
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  name_ar VARCHAR(255) NOT NULL,
  name_en VARCHAR(255),
  description_ar TEXT,
  base_price NUMERIC(10,2) NOT NULL CHECK (base_price >= 0),
  image_url TEXT,
  is_available BOOLEAN DEFAULT true,
  is_popular BOOLEAN DEFAULT false,
  is_featured BOOLEAN DEFAULT false,
  prep_time_mins INT DEFAULT 25,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table: product_options
CREATE TABLE IF NOT EXISTS product_options (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  title_ar VARCHAR(255) NOT NULL,
  is_required BOOLEAN DEFAULT false,
  allow_multiple BOOLEAN DEFAULT false,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table: product_option_items
CREATE TABLE IF NOT EXISTS product_option_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  option_id UUID REFERENCES product_options(id) ON DELETE CASCADE,
  name_ar VARCHAR(255) NOT NULL,
  price_modifier NUMERIC(10,2) DEFAULT 0.00,
  is_default BOOLEAN DEFAULT false
);

-- Table: delivery_zones
CREATE TABLE IF NOT EXISTS delivery_zones (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  branch_id UUID REFERENCES branches(id) ON DELETE CASCADE,
  area_name VARCHAR(255) NOT NULL,
  delivery_fee NUMERIC(10,2) NOT NULL CHECK (delivery_fee >= 0),
  min_order NUMERIC(10,2) DEFAULT 0.00 CHECK (min_order >= 0),
  est_time_mins INT DEFAULT 45,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table: customers
CREATE TABLE IF NOT EXISTS customers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  auth_user_id UUID,
  full_name VARCHAR(255),
  phone VARCHAR(50),
  email VARCHAR(255),
  guest_token VARCHAR(255) UNIQUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table: customer_addresses
CREATE TABLE IF NOT EXISTS customer_addresses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
  governorate VARCHAR(100) DEFAULT 'القاهرة',
  area VARCHAR(255) NOT NULL,
  street VARCHAR(255) NOT NULL,
  building VARCHAR(100),
  floor VARCHAR(50),
  apartment VARCHAR(50),
  landmark TEXT,
  notes TEXT,
  is_default BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table: orders
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_code VARCHAR(100) UNIQUE NOT NULL,
  customer_id UUID REFERENCES customers(id) ON DELETE SET NULL,
  guest_access_token VARCHAR(255) UNIQUE NOT NULL,
  branch_id UUID REFERENCES branches(id) ON DELETE SET NULL,
  delivery_zone_id UUID REFERENCES delivery_zones(id) ON DELETE SET NULL,
  customer_name VARCHAR(255) NOT NULL,
  customer_phone VARCHAR(50) NOT NULL,
  address_details JSONB NOT NULL,
  status VARCHAR(50) NOT NULL DEFAULT 'pending',
  subtotal NUMERIC(10,2) NOT NULL CHECK (subtotal >= 0),
  delivery_fee NUMERIC(10,2) NOT NULL CHECK (delivery_fee >= 0),
  discount NUMERIC(10,2) DEFAULT 0.00 CHECK (discount >= 0),
  total NUMERIC(10,2) NOT NULL CHECK (total >= 0),
  customer_notes TEXT,
  admin_notes TEXT,
  idempotency_key VARCHAR(255) UNIQUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table: order_items
CREATE TABLE IF NOT EXISTS order_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE SET NULL,
  product_name_snapshot VARCHAR(255) NOT NULL,
  unit_price_snapshot NUMERIC(10,2) NOT NULL CHECK (unit_price_snapshot >= 0),
  quantity INT NOT NULL CHECK (quantity > 0),
  subtotal NUMERIC(10,2) NOT NULL CHECK (subtotal >= 0)
);

-- Table: order_item_options
CREATE TABLE IF NOT EXISTS order_item_options (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_item_id UUID REFERENCES order_items(id) ON DELETE CASCADE,
  option_id UUID,
  option_name_snapshot VARCHAR(255) NOT NULL,
  option_price_snapshot NUMERIC(10,2) NOT NULL DEFAULT 0.00,
  quantity INT DEFAULT 1 CHECK (quantity > 0)
);

-- Table: offers
CREATE TABLE IF NOT EXISTS offers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title_ar VARCHAR(255) NOT NULL,
  description_ar TEXT,
  image_url TEXT,
  old_price NUMERIC(10,2),
  new_price NUMERIC(10,2) NOT NULL CHECK (new_price >= 0),
  branch_id UUID REFERENCES branches(id) ON DELETE CASCADE,
  is_active BOOLEAN DEFAULT true,
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table: restaurant_settings
CREATE TABLE IF NOT EXISTS restaurant_settings (
  key VARCHAR(100) PRIMARY KEY,
  value JSONB NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table: admin_profiles
CREATE TABLE IF NOT EXISTS admin_profiles (
  id UUID PRIMARY KEY,
  role VARCHAR(50) DEFAULT 'manager',
  full_name VARCHAR(255),
  email VARCHAR(255) UNIQUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table: gallery_images
CREATE TABLE IF NOT EXISTS gallery_images (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(255),
  image_url TEXT NOT NULL,
  category VARCHAR(100) DEFAULT 'dishes',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- INDEXES FOR HIGH-PERFORMANCE QUERYING
CREATE INDEX IF NOT EXISTS idx_orders_order_code ON orders(order_code);
CREATE INDEX IF NOT EXISTS idx_orders_customer_id ON orders(customer_id);
CREATE INDEX IF NOT EXISTS idx_orders_branch_id ON orders(branch_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_delivery_zones_branch_id ON delivery_zones(branch_id);
CREATE INDEX IF NOT EXISTS idx_products_category_id ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_is_available ON products(is_available);

-- ROW LEVEL SECURITY (RLS) POLICIES
ALTER TABLE branches ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_options ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_option_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE delivery_zones ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE customer_addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_item_options ENABLE ROW LEVEL SECURITY;
ALTER TABLE offers ENABLE ROW LEVEL SECURITY;
ALTER TABLE restaurant_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery_images ENABLE ROW LEVEL SECURITY;

-- Public READ access for menu, categories, branches, delivery zones, offers & settings
CREATE POLICY "Public Read Branches" ON branches FOR SELECT USING (true);
CREATE POLICY "Public Read Categories" ON categories FOR SELECT USING (true);
CREATE POLICY "Public Read Products" ON products FOR SELECT USING (true);
CREATE POLICY "Public Read Product Options" ON product_options FOR SELECT USING (true);
CREATE POLICY "Public Read Option Items" ON product_option_items FOR SELECT USING (true);
CREATE POLICY "Public Read Delivery Zones" ON delivery_zones FOR SELECT USING (true);
CREATE POLICY "Public Read Offers" ON offers FOR SELECT USING (true);
CREATE POLICY "Public Read Settings" ON restaurant_settings FOR SELECT USING (true);
CREATE POLICY "Public Read Gallery" ON gallery_images FOR SELECT USING (true);

-- Customers can view their own orders via guest access token or auth customer ID
CREATE POLICY "Customer Read Orders" ON orders FOR SELECT USING (
  guest_access_token = current_setting('request.headers', true)::json->>'x-guest-token'
  OR (auth.uid() IS NOT NULL AND customer_id IN (SELECT id FROM customers WHERE auth_user_id = auth.uid()))
);

-- Admin Full Access (If user in admin_profiles)
CREATE POLICY "Admin All Branches" ON branches FOR ALL USING (EXISTS (SELECT 1 FROM admin_profiles WHERE id = auth.uid()));
CREATE POLICY "Admin All Categories" ON categories FOR ALL USING (EXISTS (SELECT 1 FROM admin_profiles WHERE id = auth.uid()));
CREATE POLICY "Admin All Products" ON products FOR ALL USING (EXISTS (SELECT 1 FROM admin_profiles WHERE id = auth.uid()));
CREATE POLICY "Admin All Delivery Zones" ON delivery_zones FOR ALL USING (EXISTS (SELECT 1 FROM admin_profiles WHERE id = auth.uid()));
CREATE POLICY "Admin All Orders" ON orders FOR ALL USING (EXISTS (SELECT 1 FROM admin_profiles WHERE id = auth.uid()));
CREATE POLICY "Admin All Offers" ON offers FOR ALL USING (EXISTS (SELECT 1 FROM admin_profiles WHERE id = auth.uid()));
CREATE POLICY "Admin All Settings" ON restaurant_settings FOR ALL USING (EXISTS (SELECT 1 FROM admin_profiles WHERE id = auth.uid()));
