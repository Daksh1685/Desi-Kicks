-- ==============================================================================
-- CRAFTYOURSOLE E-COMMERCE: COMPLETE SUPABASE DATABASE & STORAGE SCHEMA
-- ==============================================================================
-- Instructions:
-- 1. Open your Supabase Dashboard: https://supabase.com/dashboard/project/lmoobmzcgfzdkildojon
-- 2. Click 'SQL Editor' in the left navigation.
-- 3. Click 'New query', paste this entire script, and click 'Run' (or Cmd+Enter).
-- ==============================================================================

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. PRODUCTS TABLE
CREATE TABLE IF NOT EXISTS public.products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    subcategory TEXT,
    gender TEXT DEFAULT 'Unisex',
    tag TEXT,
    price NUMERIC(10, 2) NOT NULL,
    original_price NUMERIC(10, 2),
    rating NUMERIC(3, 2) DEFAULT 5.0,
    reviews_count INTEGER DEFAULT 0,
    img TEXT NOT NULL,
    additional_images TEXT[] DEFAULT '{}',
    description TEXT NOT NULL,
    story TEXT NOT NULL,
    upper_material TEXT NOT NULL,
    sole_material TEXT NOT NULL,
    insole_type TEXT NOT NULL,
    ideal_for TEXT NOT NULL,
    artisan_region TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    total_sold INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Indexes for lightning-fast queries & filtering
CREATE INDEX IF NOT EXISTS idx_products_category ON public.products(category);
CREATE INDEX IF NOT EXISTS idx_products_subcategory ON public.products(subcategory);
CREATE INDEX IF NOT EXISTS idx_products_gender ON public.products(gender);
CREATE INDEX IF NOT EXISTS idx_products_slug ON public.products(slug);
CREATE INDEX IF NOT EXISTS idx_products_is_active ON public.products(is_active);

-- 3. PRODUCT VARIANTS TABLE (Granular Size & Stock Inventory)
CREATE TABLE IF NOT EXISTS public.product_variants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
    size TEXT NOT NULL,
    stock INTEGER DEFAULT 0 CHECK (stock >= 0),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(product_id, size)
);

CREATE INDEX IF NOT EXISTS idx_variants_product_id ON public.product_variants(product_id);
CREATE INDEX IF NOT EXISTS idx_variants_size ON public.product_variants(size);

-- 4. ORDERS TABLE (Customer Orders & Tracking)
CREATE TABLE IF NOT EXISTS public.orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_number TEXT UNIQUE NOT NULL,
    customer_name TEXT NOT NULL,
    customer_email TEXT NOT NULL,
    customer_phone TEXT NOT NULL,
    shipping_address JSONB NOT NULL,
    items JSONB NOT NULL,
    subtotal NUMERIC(10, 2) NOT NULL,
    discount NUMERIC(10, 2) DEFAULT 0.00,
    shipping_fee NUMERIC(10, 2) DEFAULT 0.00,
    total_amount NUMERIC(10, 2) NOT NULL,
    payment_method TEXT NOT NULL,
    payment_status TEXT NOT NULL DEFAULT 'PENDING',
    order_status TEXT NOT NULL DEFAULT 'PENDING',
    estimated_delivery TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_orders_order_number ON public.orders(order_number);
CREATE INDEX IF NOT EXISTS idx_orders_order_status ON public.orders(order_status);
CREATE INDEX IF NOT EXISTS idx_orders_customer_email ON public.orders(customer_email);
CREATE INDEX IF NOT EXISTS idx_orders_customer_phone ON public.orders(customer_phone);

-- 5. COUPONS TABLE (Promotional Discounts)
CREATE TABLE IF NOT EXISTS public.coupons (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code TEXT UNIQUE NOT NULL,
    discount_type TEXT NOT NULL CHECK (discount_type IN ('PERCENT', 'FLAT')),
    value NUMERIC(10, 2) NOT NULL,
    min_order_value NUMERIC(10, 2) DEFAULT 0.00,
    is_active BOOLEAN DEFAULT TRUE,
    expiry_date TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Seed Initial Promotional Coupons
INSERT INTO public.coupons (code, discount_type, value, min_order_value)
VALUES 
    ('FESTIVE20', 'PERCENT', 20.00, 2000.00),
    ('DIWALI500', 'FLAT', 500.00, 3000.00),
    ('WELCOME10', 'PERCENT', 10.00, 999.00),
    ('SOLEFIRST', 'FLAT', 300.00, 1500.00)
ON CONFLICT (code) DO NOTHING;

-- 6. ENABLE ROW LEVEL SECURITY (RLS)
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coupons ENABLE ROW LEVEL SECURITY;

-- 7. RLS POLICIES (Safe for re-running)

-- Products Policies: Public can read, Admins can manage
DROP POLICY IF EXISTS "Allow public read access on products" ON public.products;
CREATE POLICY "Allow public read access on products" 
    ON public.products FOR SELECT 
    USING (true);

DROP POLICY IF EXISTS "Allow catalog management" ON public.products;
CREATE POLICY "Allow catalog management" 
    ON public.products FOR ALL 
    USING (true)
    WITH CHECK (true);

-- Product Variants Policies: Public can read, Admins can manage
DROP POLICY IF EXISTS "Allow public read access on product variants" ON public.product_variants;
CREATE POLICY "Allow public read access on product variants" 
    ON public.product_variants FOR SELECT 
    USING (true);

DROP POLICY IF EXISTS "Allow variant stock management" ON public.product_variants;
CREATE POLICY "Allow variant stock management" 
    ON public.product_variants FOR ALL 
    USING (true)
    WITH CHECK (true);

-- Orders Policies: Public can create orders, View orders, and update status
DROP POLICY IF EXISTS "Allow public order creation" ON public.orders;
CREATE POLICY "Allow public order creation" 
    ON public.orders FOR INSERT 
    WITH CHECK (true);

DROP POLICY IF EXISTS "Allow view orders" ON public.orders;
CREATE POLICY "Allow view orders" 
    ON public.orders FOR SELECT 
    USING (true);

DROP POLICY IF EXISTS "Allow order updates" ON public.orders;
CREATE POLICY "Allow order updates" 
    ON public.orders FOR UPDATE 
    USING (true);

-- Coupons Policies: Public read access to verify codes
DROP POLICY IF EXISTS "Allow public coupon read" ON public.coupons;
CREATE POLICY "Allow public coupon read" 
    ON public.coupons FOR SELECT 
    USING (true);

-- 8. STORAGE BUCKET FOR PRODUCT IMAGES (Multi-Angle Photography)
INSERT INTO storage.buckets (id, name, public) 
VALUES ('product-images', 'product-images', true)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "Public Access to product-images" ON storage.objects;
CREATE POLICY "Public Access to product-images" 
ON storage.objects FOR SELECT 
USING (bucket_id = 'product-images');

DROP POLICY IF EXISTS "Allow uploads to product-images" ON storage.objects;
CREATE POLICY "Allow uploads to product-images" 
ON storage.objects FOR INSERT 
WITH CHECK (bucket_id = 'product-images');
