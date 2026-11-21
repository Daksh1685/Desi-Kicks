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
    ('SOLEFIRST', 'FLAT', 300.00, 1500.00),
    ('FESTIVE500', 'FLAT', 500.00, 2500.00)
ON CONFLICT (code) DO NOTHING;

-- 6. HERO SLIDES TABLE (Global Hero Banners CMS)
CREATE TABLE IF NOT EXISTS public.hero_slides (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    subtitle TEXT NOT NULL,
    tag TEXT,
    desktop_img TEXT NOT NULL,
    mobile_img TEXT NOT NULL,
    target_path TEXT NOT NULL DEFAULT '/collections',
    button_label TEXT DEFAULT 'Explore Collection',
    is_active BOOLEAN DEFAULT TRUE,
    display_order INTEGER DEFAULT 1,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 7. RETURNS & EXCHANGES TABLE (Self-Serve Size Exchanges)
CREATE TABLE IF NOT EXISTS public.returns_exchanges (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    request_number TEXT UNIQUE NOT NULL,
    order_number TEXT NOT NULL,
    product_name TEXT NOT NULL,
    old_size TEXT NOT NULL,
    requested_size TEXT NOT NULL,
    reason TEXT NOT NULL,
    status TEXT DEFAULT 'SCHEDULED_PICKUP',
    customer_email TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 8. ENABLE ROW LEVEL SECURITY (RLS)
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coupons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hero_slides ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.returns_exchanges ENABLE ROW LEVEL SECURITY;

-- 9. RLS POLICIES (Safe for re-running)

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

-- Hero Slides Policies
DROP POLICY IF EXISTS "Allow public read on hero_slides" ON public.hero_slides;
CREATE POLICY "Allow public read on hero_slides" 
    ON public.hero_slides FOR SELECT 
    USING (true);

DROP POLICY IF EXISTS "Allow manage hero_slides" ON public.hero_slides;
CREATE POLICY "Allow manage hero_slides" 
    ON public.hero_slides FOR ALL 
    USING (true)
    WITH CHECK (true);

-- Returns & Exchanges Policies
DROP POLICY IF EXISTS "Allow public insert on returns_exchanges" ON public.returns_exchanges;
CREATE POLICY "Allow public insert on returns_exchanges" 
    ON public.returns_exchanges FOR INSERT 
    WITH CHECK (true);

DROP POLICY IF EXISTS "Allow view returns_exchanges" ON public.returns_exchanges;
CREATE POLICY "Allow view returns_exchanges" 
    ON public.returns_exchanges FOR SELECT 
    USING (true);

-- 10. STORAGE BUCKET FOR PRODUCT IMAGES (Multi-Angle Photography)
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

-- ==============================================================================
-- 11. SEED INITIAL SIGNATURE FOOTWEAR CATALOG & VARIANT INVENTORY
-- ==============================================================================
DO $$
DECLARE
    v_prod_id UUID;
BEGIN
    -- 1. Retro Timeless Casual Sneaker
    INSERT INTO public.products (slug, name, category, subcategory, gender, tag, price, original_price, rating, reviews_count, img, description, story, upper_material, sole_material, insole_type, ideal_for, artisan_region, is_active, total_sold)
    VALUES (
        'retro-timeless-street-sneaker',
        'Retro Timeless Casual Sneaker',
        'Men',
        'Casual Sneakers',
        'Men',
        'Best Seller',
        2499.00,
        3999.00,
        4.9,
        428,
        '/hero/retro-casuals-hero-clean.jpg',
        'Iconic low-top retro sneaker with dual-density cushioned sole and suede accents.',
        'Designed for effortless everyday character and all-day street comfort.',
        'Full-Grain Vegan Suede & Breathable Canvas',
        'Vulcanized Anti-Skid Gum Rubber',
        'Dual-Layer Memory Foam Cushion',
        'Daily Casuals, College, Street Style & Weekend Outings',
        'Agra, India',
        true,
        642
    )
    ON CONFLICT (slug) DO UPDATE SET is_active = true
    RETURNING id INTO v_prod_id;

    IF v_prod_id IS NOT NULL THEN
        INSERT INTO public.product_variants (product_id, size, stock) VALUES
            (v_prod_id, 'UK 7', 15),
            (v_prod_id, 'UK 8', 24),
            (v_prod_id, 'UK 9', 32),
            (v_prod_id, 'UK 10', 18),
            (v_prod_id, 'UK 11', 9)
        ON CONFLICT (product_id, size) DO UPDATE SET stock = EXCLUDED.stock;
    END IF;

    -- 2. Men's Heritage Street Sneaker
    INSERT INTO public.products (slug, name, category, subcategory, gender, tag, price, original_price, rating, reviews_count, img, description, story, upper_material, sole_material, insole_type, ideal_for, artisan_region, is_active, total_sold)
    VALUES (
        'mens-heritage-street-sneaker',
        'Men''s Heritage Street Sneaker',
        'Men',
        'Casual Sneakers',
        'Men',
        'Best Seller',
        2699.00,
        4199.00,
        4.9,
        385,
        '/hero/category-men.webp',
        'Vintage olive and cream retro sneaker with gum sole and plush collar.',
        'Tailored for relaxed tailoring, chinos, and everyday urban street style.',
        'Suede Overlays with Soft Action Leather',
        'Vintage Gum Rubber Sole',
        'High-Density Arch Cushion',
        'Smart Casuals, Chinos & Daily Street Style',
        'Agra, India',
        true,
        590
    )
    ON CONFLICT (slug) DO UPDATE SET is_active = true
    RETURNING id INTO v_prod_id;

    IF v_prod_id IS NOT NULL THEN
        INSERT INTO public.product_variants (product_id, size, stock) VALUES
            (v_prod_id, 'UK 7', 12),
            (v_prod_id, 'UK 8', 20),
            (v_prod_id, 'UK 9', 28),
            (v_prod_id, 'UK 10', 16),
            (v_prod_id, 'UK 11', 8)
        ON CONFLICT (product_id, size) DO UPDATE SET stock = EXCLUDED.stock;
    END IF;

    -- 3. Women's In Bloom Pastel Sneaker
    INSERT INTO public.products (slug, name, category, subcategory, gender, tag, price, original_price, rating, reviews_count, img, description, story, upper_material, sole_material, insole_type, ideal_for, artisan_region, is_active, total_sold)
    VALUES (
        'womens-dusty-rose-bloom-sneaker',
        'Women''s In Bloom Pastel Sneaker',
        'Women',
        'Casual Sneakers',
        'Women',
        'Trending Pick',
        2299.00,
        3499.00,
        4.8,
        315,
        '/hero/category-women.webp',
        'Soft dusty rose casual trainer with plush ankle collar and ultra-lightweight sole.',
        'Blends playful floral undertones with cloud-like walking comfort.',
        'Pastel Microfiber & Breathable Knit',
        'Featherlight Cushion Rebound EVA',
        'Ortho-Soft Anatomical Foam',
        'Brunch, Travel, Daily Walks & Casual Styling',
        'Jaipur, India',
        true,
        518
    )
    ON CONFLICT (slug) DO UPDATE SET is_active = true
    RETURNING id INTO v_prod_id;

    IF v_prod_id IS NOT NULL THEN
        INSERT INTO public.product_variants (product_id, size, stock) VALUES
            (v_prod_id, 'UK 4', 12),
            (v_prod_id, 'UK 5', 20),
            (v_prod_id, 'UK 6', 28),
            (v_prod_id, 'UK 7', 16),
            (v_prod_id, 'UK 8', 8)
        ON CONFLICT (product_id, size) DO UPDATE SET stock = EXCLUDED.stock;
    END IF;

    -- 4. Playful Kids' Easy-Strap Sneaker
    INSERT INTO public.products (slug, name, category, subcategory, gender, tag, price, original_price, rating, reviews_count, img, description, story, upper_material, sole_material, insole_type, ideal_for, artisan_region, is_active, total_sold)
    VALUES (
        'playful-kids-active-sneaker',
        'Playful Kids'' Easy-Strap Sneaker',
        'Kids',
        'Casual Sneakers',
        'Kids',
        'Kids Choice',
        1799.00,
        2599.00,
        4.9,
        240,
        '/hero/category-kids.webp',
        'Lightweight easy-strap sneaker built for running, active recess, and park play.',
        'Dual hook-and-loop velcro closures allow quick self-fastening for energetic kids.',
        'Durable Breathable Mesh with Anti-Scuff Overlays',
        'Non-Marking Flexible EVA Flex-Grip',
        'Shock-Absorbing Comfort KidFoam',
        'School Play, Running, Sports & Everyday Active Wear',
        'Kanpur, India',
        true,
        425
    )
    ON CONFLICT (slug) DO UPDATE SET is_active = true
    RETURNING id INTO v_prod_id;

    IF v_prod_id IS NOT NULL THEN
        INSERT INTO public.product_variants (product_id, size, stock) VALUES
            (v_prod_id, 'UK 1', 14),
            (v_prod_id, 'UK 2', 18),
            (v_prod_id, 'UK 3', 25),
            (v_prod_id, 'UK 4', 20),
            (v_prod_id, 'UK 5', 10)
        ON CONFLICT (product_id, size) DO UPDATE SET stock = EXCLUDED.stock;
    END IF;

    -- 5. Royal Velvet Embroidered Mojari
    INSERT INTO public.products (slug, name, category, subcategory, gender, tag, price, original_price, rating, reviews_count, img, description, story, upper_material, sole_material, insole_type, ideal_for, artisan_region, is_active, total_sold)
    VALUES (
        'royal-velvet-embroidered-mojari',
        'Royal Velvet Embroidered Mojari',
        'Festive & Ethnic',
        'Juttis & Mojaris',
        'Unisex',
        'Festive Edit',
        2499.00,
        3499.00,
        4.9,
        348,
        'https://images.unsplash.com/photo-1535043934128-cf0b28d52f95?q=80&w=800&auto=format&fit=crop',
        'A masterpiece of traditional craftsmanship paired with modern foot mechanics.',
        'Handcrafted by generational mojari artisans in Jaipur using rich royal velvet and intricate gold Zari threadwork.',
        'Pure Royal Velvet with Hand-Embroidered Gold Zari',
        'Buff-Tanned Leather Sole with Anti-Skid Heel Grip',
        'Ortho-Cushion Double Memory Foam',
        'Weddings, Sangeet Nights, Diwali & Kurtas',
        'Jaipur, Rajasthan',
        true,
        710
    )
    ON CONFLICT (slug) DO UPDATE SET is_active = true
    RETURNING id INTO v_prod_id;

    IF v_prod_id IS NOT NULL THEN
        INSERT INTO public.product_variants (product_id, size, stock) VALUES
            (v_prod_id, 'UK 6', 15),
            (v_prod_id, 'UK 7', 22),
            (v_prod_id, 'UK 8', 30),
            (v_prod_id, 'UK 9', 25),
            (v_prod_id, 'UK 10', 14)
        ON CONFLICT (product_id, size) DO UPDATE SET stock = EXCLUDED.stock;
    END IF;

    -- 6. Handcrafted Heritage Penny Loafer
    INSERT INTO public.products (slug, name, category, subcategory, gender, tag, price, original_price, rating, reviews_count, img, description, story, upper_material, sole_material, insole_type, ideal_for, artisan_region, is_active, total_sold)
    VALUES (
        'handcrafted-heritage-penny-loafer',
        'Handcrafted Heritage Penny Loafer',
        'Work & Formal',
        'Penny & Tassel Loafers',
        'Men',
        'Formal Leather',
        2899.00,
        4299.00,
        4.9,
        195,
        'https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?q=80&w=800&auto=format&fit=crop',
        'Classic penny strap saddle silhouette with modern lightweight dress sole.',
        'Masterfully hand-burnished crust leather crafted in Agra with a 72-hour manual tanning process.',
        '100% Genuine Full-Grain Burnished Leather',
        'Durable Hand-Stitched Welt with Rubber Grip Inset',
        'Breathable Leather Sockliner with High-Density Heel Cushion',
        'Boardrooms, Formal Meetings, Suits & Semi-Formals',
        'Agra, Uttar Pradesh',
        true,
        340
    )
    ON CONFLICT (slug) DO UPDATE SET is_active = true
    RETURNING id INTO v_prod_id;

    IF v_prod_id IS NOT NULL THEN
        INSERT INTO public.product_variants (product_id, size, stock) VALUES
            (v_prod_id, 'UK 7', 10),
            (v_prod_id, 'UK 8', 18),
            (v_prod_id, 'UK 9', 24),
            (v_prod_id, 'UK 10', 15),
            (v_prod_id, 'UK 11', 6)
        ON CONFLICT (product_id, size) DO UPDATE SET stock = EXCLUDED.stock;
    END IF;

END $$;
