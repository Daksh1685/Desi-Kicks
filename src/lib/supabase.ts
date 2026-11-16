import { createClient } from '@supabase/supabase-js';
import type { Order } from '../types/order';
import type { Product } from '../types/product';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
  supabaseAnonKey &&
  supabaseUrl.startsWith('https://') &&
  !supabaseUrl.includes('YOUR_SUPABASE')
);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    })
  : null;

/**
 * Fetch active products from Supabase
 */
export async function getProductsFromSupabase(): Promise<Product[]> {
  if (!supabase) return [];
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*, product_variants(size, stock)')
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    if (error) {
      console.warn('[Supabase] Products query error:', error.message);
      return [];
    }

    if (!data) return [];

    return data.map((item: Record<string, unknown>) => {
      const rawVariants = Array.isArray(item.product_variants) ? item.product_variants : [];
      const variants = rawVariants.map((v: Record<string, unknown>) => ({
        size: String(v.size || ''),
        stock: Number(v.stock || 0),
      }));

      return {
        id: String(item.id),
        slug: String(item.slug),
        name: String(item.name),
        category: String(item.category),
        subcategory: item.subcategory ? String(item.subcategory) : undefined,
        gender: (item.gender as 'Men' | 'Women' | 'Unisex') || 'Unisex',
        tag: item.tag ? String(item.tag) : undefined,
        price: Number(item.price),
        originalPrice: Number(item.original_price || item.price),
        rating: Number(item.rating || 5.0),
        reviewsCount: Number(item.reviews_count || 0),
        img: String(item.img),
        additionalImages: Array.isArray(item.additional_images) ? (item.additional_images as string[]) : [],
        description: String(item.description || ''),
        story: String(item.story || ''),
        upperMaterial: String(item.upper_material || 'Full-Grain Vegan Leather'),
        soleMaterial: String(item.sole_material || 'TPR Anti-Skid Rubber'),
        insoleType: String(item.insole_type || 'Orthopedic Memory Foam'),
        idealFor: String(item.ideal_for || 'Festive & Daily Wear'),
        artisanRegion: item.artisan_region ? String(item.artisan_region) : 'Agra & Kolhapur, India',
        sizes: variants.length > 0 ? variants.map((v) => v.size) : ['UK 7', 'UK 8', 'UK 9', 'UK 10'],
        variants,
        isActive: Boolean(item.is_active),
        totalSold: Number(item.total_sold || 0),
        createdAt: String(item.created_at || new Date().toISOString()),
      };
    });
  } catch (err) {
    console.warn('[Supabase] getProducts exception:', err);
    return [];
  }
}

/**
 * Save an order to Supabase
 */
export async function saveOrderToSupabase(order: Order): Promise<boolean> {
  if (!supabase) return false;
  try {
    const { error } = await supabase.from('orders').insert([
      {
        order_number: order.orderNumber,
        customer_name: order.customerName,
        customer_email: order.customerEmail,
        customer_phone: order.customerPhone,
        shipping_address: order.shippingAddress,
        items: order.items,
        subtotal: order.subtotal,
        discount: order.discount,
        shipping_fee: order.shippingFee,
        total_amount: order.totalAmount,
        payment_method: order.paymentMethod,
        payment_status: order.paymentStatus,
        order_status: order.orderStatus,
        estimated_delivery: order.estimatedDelivery,
      },
    ]);

    if (error) {
      console.warn('[Supabase] Save order error:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.warn('[Supabase] saveOrder exception:', err);
    return false;
  }
}

/**
 * Validate a promo coupon code from Supabase
 */
export async function validateCouponInSupabase(
  code: string,
  cartTotal: number
): Promise<{ valid: boolean; discountAmount: number; message: string }> {
  if (!supabase) {
    return { valid: false, discountAmount: 0, message: 'Database not connected' };
  }

  try {
    const { data, error } = await supabase
      .from('coupons')
      .select('*')
      .eq('code', code.toUpperCase())
      .eq('is_active', true)
      .single();

    if (error || !data) {
      return { valid: false, discountAmount: 0, message: 'Invalid or inactive coupon code' };
    }

    if (data.min_order_value && cartTotal < data.min_order_value) {
      return {
        valid: false,
        discountAmount: 0,
        message: `Requires minimum order of ₹${data.min_order_value}`,
      };
    }

    let discount = 0;
    if (data.discount_type === 'PERCENT') {
      discount = Math.round((cartTotal * data.value) / 100);
    } else {
      discount = Math.min(data.value, cartTotal);
    }

    return {
      valid: true,
      discountAmount: discount,
      message: `Coupon ${code} applied successfully!`,
    };
  } catch {
    return { valid: false, discountAmount: 0, message: 'Error checking coupon' };
  }
}

/**
 * Upload an image file directly to Supabase Storage bucket ('product-images').
 * Returns the public CDN URL on success, or null on error.
 */
export async function uploadImageToSupabase(
  file: File,
  folder: 'products' | 'hero' = 'products'
): Promise<string | null> {
  if (!supabase) return null;
  try {
    const fileExt = file.name.split('.').pop()?.toLowerCase() || 'jpg';
    const cleanName = file.name
      .replace(/\.[^/.]+$/, '')
      .replace(/[^a-zA-Z0-9_-]/g, '-')
      .substring(0, 30);
    const filePath = `${folder}/${cleanName}-${Date.now()}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from('product-images')
      .upload(filePath, file, {
        cacheControl: '31536000',
        upsert: false,
      });

    if (uploadError) {
      console.warn('[Supabase Storage] Upload error:', uploadError.message);
      return null;
    }

    const { data } = supabase.storage
      .from('product-images')
      .getPublicUrl(filePath);

    return data?.publicUrl || null;
  } catch (err) {
    console.warn('[Supabase Storage] uploadImage exception:', err);
    return null;
  }
}
