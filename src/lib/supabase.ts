import { createClient } from '@supabase/supabase-js';
import type { Order, OrderItem } from '../types/order';
import type { Product, NewProductInput, ProductGender } from '../types/product';
import type { HeroSlide } from '../context/HeroContext';

export interface AdminCoupon {
  id: string;
  code: string;
  discountType: 'PERCENT' | 'FLAT';
  value: number;
  minOrderValue: number;
  isActive: boolean;
  expiryDate?: string | null;
  createdAt: string;
}

export interface ReturnExchangeItem {
  id: string;
  requestNumber: string;
  orderNumber: string;
  productName: string;
  oldSize: string;
  requestedSize: string;
  reason: string;
  status: 'SCHEDULED_PICKUP' | 'IN_TRANSIT' | 'COMPLETED' | 'REJECTED';
  customerEmail?: string | null;
  createdAt: string;
}

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

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/**
 * Resolves a product's UUID from either a direct UUID, a slug, or a name.
 */
async function resolveProductId(idOrSlug: string): Promise<string | null> {
  if (!supabase) return null;
  if (UUID_REGEX.test(idOrSlug)) {
    return idOrSlug;
  }
  const cleanId = idOrSlug.split('-')[0];
  const { data } = await supabase
    .from('products')
    .select('id')
    .or(`slug.eq.${idOrSlug},slug.eq.${cleanId},name.eq.${idOrSlug}`)
    .maybeSingle();

  return data?.id || null;
}

/**
 * Fetch active products from Supabase with their size variant inventory
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
        gender: (item.gender as ProductGender) || 'Unisex',
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
 * Insert a new product into Supabase 'products' and seed its size variants
 */
export async function createProductInSupabase(
  input: NewProductInput,
  customSlug?: string
): Promise<Product | null> {
  if (!supabase) return null;
  try {
    const rawSlug = input.name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
    const slug = customSlug || `${rawSlug}-${Math.floor(1000 + Math.random() * 9000)}`;

    const { data: newProd, error } = await supabase
      .from('products')
      .insert([
        {
          slug,
          name: input.name,
          category: input.category,
          subcategory: input.subcategory || null,
          gender: input.gender || 'Unisex',
          tag: input.tag || null,
          price: input.price,
          original_price: input.originalPrice || input.price,
          rating: 5.0,
          reviews_count: 0,
          img: input.img,
          additional_images: input.additionalImages || [],
          description: input.description,
          story: input.story || '',
          upper_material: input.upperMaterial || 'Full-Grain Vegan Leather',
          sole_material: input.soleMaterial || 'TPR Anti-Skid Rubber',
          insole_type: input.insoleType || 'Orthopedic Memory Foam',
          ideal_for: input.idealFor || 'Festive & Daily Wear',
          artisan_region: input.artisanRegion || 'Agra & Kolhapur, India',
          is_active: input.isActive ?? true,
          total_sold: 0,
        },
      ])
      .select()
      .single();

    if (error || !newProd) {
      console.warn('[Supabase] Create product error:', error?.message);
      return null;
    }

    const rawVariants =
      input.variants && input.variants.length > 0
        ? input.variants
        : input.sizes && input.sizes.length > 0
        ? input.sizes.map((s) => ({ size: s, stock: 20 }))
        : ['UK 7', 'UK 8', 'UK 9', 'UK 10'].map((s) => ({ size: s, stock: 20 }));

    const variantRows = rawVariants.map((v) => ({
      product_id: newProd.id,
      size: v.size,
      stock: Math.max(0, v.stock),
    }));

    const { data: insertedVariants, error: variantError } = await supabase
      .from('product_variants')
      .insert(variantRows)
      .select('size, stock');

    if (variantError) {
      console.warn('[Supabase] Create variants error:', variantError.message);
    }

    const finalVariants = (insertedVariants || variantRows).map((v) => ({
      size: String(v.size),
      stock: Number(v.stock),
    }));

    return {
      id: String(newProd.id),
      slug: String(newProd.slug),
      name: String(newProd.name),
      category: String(newProd.category),
      subcategory: newProd.subcategory ? String(newProd.subcategory) : undefined,
      gender: (newProd.gender as ProductGender) || 'Unisex',
      tag: newProd.tag ? String(newProd.tag) : undefined,
      price: Number(newProd.price),
      originalPrice: Number(newProd.original_price || newProd.price),
      rating: Number(newProd.rating || 5.0),
      reviewsCount: Number(newProd.reviews_count || 0),
      img: String(newProd.img),
      additionalImages: Array.isArray(newProd.additional_images) ? (newProd.additional_images as string[]) : [],
      description: String(newProd.description || ''),
      story: String(newProd.story || ''),
      upperMaterial: String(newProd.upper_material || ''),
      soleMaterial: String(newProd.sole_material || ''),
      insoleType: String(newProd.insole_type || ''),
      idealFor: String(newProd.ideal_for || ''),
      artisanRegion: newProd.artisan_region ? String(newProd.artisan_region) : undefined,
      sizes: finalVariants.map((v) => v.size),
      variants: finalVariants,
      isActive: Boolean(newProd.is_active),
      totalSold: Number(newProd.total_sold || 0),
      createdAt: String(newProd.created_at || new Date().toISOString()),
    };
  } catch (err) {
    console.warn('[Supabase] createProduct exception:', err);
    return null;
  }
}

/**
 * Update an existing product and its variant inventory in Supabase
 */
export async function updateProductInSupabase(
  id: string,
  updates: Partial<Product>
): Promise<boolean> {
  if (!supabase) return false;
  try {
    const targetId = await resolveProductId(id);
    if (!targetId) {
      console.warn('[Supabase] Could not resolve product ID for update:', id);
      return false;
    }

    const dbUpdates: Record<string, unknown> = {};
    if (updates.name !== undefined) dbUpdates.name = updates.name;
    if (updates.slug !== undefined) dbUpdates.slug = updates.slug;
    if (updates.category !== undefined) dbUpdates.category = updates.category;
    if (updates.subcategory !== undefined) dbUpdates.subcategory = updates.subcategory;
    if (updates.gender !== undefined) dbUpdates.gender = updates.gender;
    if (updates.tag !== undefined) dbUpdates.tag = updates.tag;
    if (updates.price !== undefined) dbUpdates.price = updates.price;
    if (updates.originalPrice !== undefined) dbUpdates.original_price = updates.originalPrice;
    if (updates.rating !== undefined) dbUpdates.rating = updates.rating;
    if (updates.reviewsCount !== undefined) dbUpdates.reviews_count = updates.reviewsCount;
    if (updates.img !== undefined) dbUpdates.img = updates.img;
    if (updates.additionalImages !== undefined) dbUpdates.additional_images = updates.additionalImages;
    if (updates.description !== undefined) dbUpdates.description = updates.description;
    if (updates.story !== undefined) dbUpdates.story = updates.story;
    if (updates.upperMaterial !== undefined) dbUpdates.upper_material = updates.upperMaterial;
    if (updates.soleMaterial !== undefined) dbUpdates.sole_material = updates.soleMaterial;
    if (updates.insoleType !== undefined) dbUpdates.insole_type = updates.insoleType;
    if (updates.idealFor !== undefined) dbUpdates.ideal_for = updates.idealFor;
    if (updates.artisanRegion !== undefined) dbUpdates.artisan_region = updates.artisanRegion;
    if (updates.isActive !== undefined) dbUpdates.is_active = updates.isActive;
    if (updates.totalSold !== undefined) dbUpdates.total_sold = updates.totalSold;

    if (Object.keys(dbUpdates).length > 0) {
      const { error } = await supabase
        .from('products')
        .update(dbUpdates)
        .eq('id', targetId);

      if (error) {
        console.warn('[Supabase] Update product error:', error.message);
        return false;
      }
    }

    // Upsert variants if provided
    if (updates.variants && updates.variants.length > 0) {
      const variantRows = updates.variants.map((v) => ({
        product_id: targetId,
        size: v.size,
        stock: Math.max(0, v.stock),
      }));

      const { error: variantError } = await supabase
        .from('product_variants')
        .upsert(variantRows, { onConflict: 'product_id,size' });

      if (variantError) {
        console.warn('[Supabase] Upsert variants error:', variantError.message);
      }
    }

    return true;
  } catch (err) {
    console.warn('[Supabase] updateProduct exception:', err);
    return false;
  }
}

/**
 * Delete a product from Supabase (cascades to product_variants)
 */
export async function deleteProductInSupabase(id: string): Promise<boolean> {
  if (!supabase) return false;
  try {
    const targetId = await resolveProductId(id);
    if (!targetId) return false;

    const { error } = await supabase.from('products').delete().eq('id', targetId);
    if (error) {
      console.warn('[Supabase] Delete product error:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.warn('[Supabase] deleteProduct exception:', err);
    return false;
  }
}

/**
 * Toggle active status of a product in Supabase
 */
export async function toggleProductStatusInSupabase(
  id: string,
  newStatus: boolean
): Promise<boolean> {
  if (!supabase) return false;
  try {
    const targetId = await resolveProductId(id);
    if (!targetId) return false;

    const { error } = await supabase
      .from('products')
      .update({ is_active: newStatus })
      .eq('id', targetId);

    if (error) {
      console.warn('[Supabase] Toggle status error:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.warn('[Supabase] toggleProductStatus exception:', err);
    return false;
  }
}

/**
 * Deduct size variant stock & increment total_sold in Supabase on order placement
 */
export async function deductVariantStockInSupabase(
  items: { productId: string; size: string; quantity: number }[]
): Promise<boolean> {
  if (!supabase || items.length === 0) return false;
  try {
    for (const item of items) {
      const targetId = await resolveProductId(item.productId);
      if (!targetId) continue;

      // Increment total_sold on product
      const { data: prod } = await supabase
        .from('products')
        .select('total_sold')
        .eq('id', targetId)
        .maybeSingle();

      if (prod) {
        await supabase
          .from('products')
          .update({ total_sold: (prod.total_sold || 0) + item.quantity })
          .eq('id', targetId);
      }

      // Decrement variant stock
      const { data: variant } = await supabase
        .from('product_variants')
        .select('stock')
        .eq('product_id', targetId)
        .eq('size', item.size)
        .maybeSingle();

      if (variant) {
        const newStock = Math.max(0, Number(variant.stock) - item.quantity);
        await supabase
          .from('product_variants')
          .update({ stock: newStock })
          .eq('product_id', targetId)
          .eq('size', item.size);
      }
    }
    return true;
  } catch (err) {
    console.warn('[Supabase] deductVariantStock exception:', err);
    return false;
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
 * Update an order's status and payment status in Supabase
 */
export async function updateOrderStatusInSupabase(
  orderIdOrNumber: string,
  status: string,
  paymentStatus?: string
): Promise<boolean> {
  if (!supabase) return false;
  try {
    const updates: Record<string, unknown> = { order_status: status };
    if (paymentStatus) updates.payment_status = paymentStatus;

    const { error } = await supabase
      .from('orders')
      .update(updates)
      .or(`order_number.eq.${orderIdOrNumber},id.eq.${orderIdOrNumber}`);

    if (error) {
      console.warn('[Supabase] Update order status error:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.warn('[Supabase] updateOrderStatus exception:', err);
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

function mapRowToOrder(row: Record<string, unknown>): Order {
  return {
    id: String(row.id),
    orderNumber: String(row.order_number),
    customerName: String(row.customer_name),
    customerEmail: String(row.customer_email),
    customerPhone: String(row.customer_phone),
    shippingAddress: (row.shipping_address as Order['shippingAddress']) || {
      street: '',
      city: '',
      state: '',
      pincode: '',
    },
    items: Array.isArray(row.items) ? (row.items as OrderItem[]) : [],
    subtotal: Number(row.subtotal),
    discount: Number(row.discount || 0),
    shippingFee: Number(row.shipping_fee || 0),
    totalAmount: Number(row.total_amount),
    paymentMethod: (row.payment_method as Order['paymentMethod']) || 'UPI',
    paymentStatus: (row.payment_status as Order['paymentStatus']) || 'PENDING',
    orderStatus: (row.order_status as Order['orderStatus']) || 'PENDING',
    createdAt: String(row.created_at || new Date().toISOString()),
    estimatedDelivery: row.estimated_delivery ? String(row.estimated_delivery) : '3-5 Business Days',
  };
}

/**
 * Fetch all customer orders from Supabase (for Admin)
 */
export async function getAllOrdersFromSupabase(): Promise<Order[]> {
  if (!supabase) return [];
  try {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });

    if (error || !data) return [];
    return data.map(mapRowToOrder);
  } catch (err) {
    console.warn('[Supabase] getAllOrders exception:', err);
    return [];
  }
}

/**
 * Fetch orders for a specific customer email from Supabase (for customer Profile)
 */
export async function getCustomerOrdersFromSupabase(email: string): Promise<Order[]> {
  if (!supabase || !email) return [];
  try {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .ilike('customer_email', email.trim())
      .order('created_at', { ascending: false });

    if (error || !data) return [];
    return data.map(mapRowToOrder);
  } catch (err) {
    console.warn('[Supabase] getCustomerOrders exception:', err);
    return [];
  }
}

/**
 * Fetch all active coupons from Supabase
 */
export async function getActiveCouponsFromSupabase(): Promise<
  { code: string; label: string; discountType: string; value: number; minOrderValue: number }[]
> {
  if (!supabase) return [];
  try {
    const { data, error } = await supabase
      .from('coupons')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    if (error || !data) return [];

    return data.map((c) => {
      const isPercent = c.discount_type === 'PERCENT';
      const label = isPercent
        ? `${c.value}% OFF (Min ₹${c.min_order_value || 0})`
        : `₹${c.value} FLAT OFF (Min ₹${c.min_order_value || 0})`;
      return {
        code: String(c.code),
        label,
        discountType: String(c.discount_type),
        value: Number(c.value),
        minOrderValue: Number(c.min_order_value || 0),
      };
    });
  } catch (err) {
    console.warn('[Supabase] getActiveCoupons exception:', err);
    return [];
  }
}

/**
 * Record a size exchange / return request into Supabase 'returns_exchanges'
 */
export async function createReturnExchangeInSupabase(exchange: {
  orderNumber: string;
  productName: string;
  oldSize: string;
  requestedSize: string;
  reason: string;
  customerEmail?: string;
}): Promise<string | null> {
  if (!supabase) return null;
  try {
    const requestNumber = `EX-${Math.floor(100000 + Math.random() * 900000)}`;
    const { error } = await supabase.from('returns_exchanges').insert([
      {
        request_number: requestNumber,
        order_number: exchange.orderNumber,
        product_name: exchange.productName,
        old_size: exchange.oldSize,
        requested_size: exchange.requestedSize,
        reason: exchange.reason,
        status: 'SCHEDULED_PICKUP',
        customer_email: exchange.customerEmail || null,
      },
    ]);
    if (error) {
      console.warn('[Supabase] Create return exchange error:', error.message);
      return null;
    }
    return requestNumber;
  } catch (err) {
    console.warn('[Supabase] createReturnExchange exception:', err);
    return null;
  }
}

/**
 * Fetch all coupons from Supabase (for Admin)
 */
export async function getAllCouponsFromSupabase(): Promise<AdminCoupon[]> {
  if (!supabase) return [];
  try {
    const { data, error } = await supabase
      .from('coupons')
      .select('*')
      .order('created_at', { ascending: false });

    if (error || !data) return [];
    return data.map((c) => ({
      id: String(c.id),
      code: String(c.code),
      discountType: (c.discount_type as 'PERCENT' | 'FLAT') || 'FLAT',
      value: Number(c.value),
      minOrderValue: Number(c.min_order_value || 0),
      isActive: Boolean(c.is_active),
      expiryDate: c.expiry_date ? String(c.expiry_date) : null,
      createdAt: String(c.created_at || new Date().toISOString()),
    }));
  } catch (err) {
    console.warn('[Supabase] getAllCoupons exception:', err);
    return [];
  }
}

/**
 * Create a new coupon in Supabase
 */
export async function createCouponInSupabase(coupon: {
  code: string;
  discountType: 'PERCENT' | 'FLAT';
  value: number;
  minOrderValue?: number;
  expiryDate?: string | null;
  isActive?: boolean;
}): Promise<AdminCoupon | null> {
  if (!supabase) return null;
  try {
    const { data, error } = await supabase
      .from('coupons')
      .insert([
        {
          code: coupon.code.toUpperCase().trim(),
          discount_type: coupon.discountType,
          value: coupon.value,
          min_order_value: coupon.minOrderValue || 0,
          is_active: coupon.isActive ?? true,
          expiry_date: coupon.expiryDate || null,
        },
      ])
      .select()
      .single();

    if (error || !data) {
      console.warn('[Supabase] Create coupon error:', error?.message);
      return null;
    }

    return {
      id: String(data.id),
      code: String(data.code),
      discountType: data.discount_type,
      value: Number(data.value),
      minOrderValue: Number(data.min_order_value || 0),
      isActive: Boolean(data.is_active),
      expiryDate: data.expiry_date ? String(data.expiry_date) : null,
      createdAt: String(data.created_at),
    };
  } catch (err) {
    console.warn('[Supabase] createCoupon exception:', err);
    return null;
  }
}

/**
 * Toggle a coupon's active status in Supabase
 */
export async function toggleCouponStatusInSupabase(
  id: string,
  newStatus: boolean
): Promise<boolean> {
  if (!supabase) return false;
  try {
    const { error } = await supabase
      .from('coupons')
      .update({ is_active: newStatus })
      .eq('id', id);
    return !error;
  } catch {
    return false;
  }
}

/**
 * Delete a coupon from Supabase
 */
export async function deleteCouponInSupabase(id: string): Promise<boolean> {
  if (!supabase) return false;
  try {
    const { error } = await supabase.from('coupons').delete().eq('id', id);
    return !error;
  } catch {
    return false;
  }
}

/**
 * Fetch all size return & exchange requests from Supabase (for Admin)
 */
export async function getAllReturnExchangesFromSupabase(): Promise<ReturnExchangeItem[]> {
  if (!supabase) return [];
  try {
    const { data, error } = await supabase
      .from('returns_exchanges')
      .select('*')
      .order('created_at', { ascending: false });

    if (error || !data) return [];
    return data.map((r) => ({
      id: String(r.id),
      requestNumber: String(r.request_number),
      orderNumber: String(r.order_number),
      productName: String(r.product_name),
      oldSize: String(r.old_size),
      requestedSize: String(r.requested_size),
      reason: String(r.reason),
      status: (r.status as ReturnExchangeItem['status']) || 'SCHEDULED_PICKUP',
      customerEmail: r.customer_email ? String(r.customer_email) : null,
      createdAt: String(r.created_at || new Date().toISOString()),
    }));
  } catch (err) {
    console.warn('[Supabase] getAllReturnExchanges exception:', err);
    return [];
  }
}

/**
 * Update the status of a size exchange request in Supabase
 */
export async function updateReturnExchangeStatusInSupabase(
  id: string,
  status: string
): Promise<boolean> {
  if (!supabase) return false;
  try {
    const { error } = await supabase
      .from('returns_exchanges')
      .update({ status })
      .eq('id', id);
    return !error;
  } catch {
    return false;
  }
}

/**
 * Fetch hero slides from Supabase
 */
export async function getHeroSlidesFromSupabase(): Promise<HeroSlide[]> {
  if (!supabase) return [];
  try {
    const { data, error } = await supabase
      .from('hero_slides')
      .select('*')
      .order('display_order', { ascending: true });

    if (error || !data || data.length === 0) return [];

    return data.map((s) => ({
      id: String(s.id),
      isFullBanner: true,
      scriptText: s.tag ? String(s.tag) : undefined,
      title: String(s.title),
      subtitle: String(s.subtitle),
      ctaText: s.button_label ? String(s.button_label) : 'Explore Collection',
      to: String(s.target_path || '/collections'),
      img: String(s.desktop_img),
      mobileImg: String(s.mobile_img || s.desktop_img),
      alt: `${s.title} - ${s.subtitle}`,
      isActive: Boolean(s.is_active),
    }));
  } catch (err) {
    console.warn('[Supabase] getHeroSlides exception:', err);
    return [];
  }
}

/**
 * Save or update a hero slide in Supabase
 */
export async function saveHeroSlideToSupabase(
  slide: HeroSlide,
  displayOrder: number = 1
): Promise<boolean> {
  if (!supabase) return false;
  try {
    const { error } = await supabase.from('hero_slides').upsert(
      {
        id: slide.id,
        title: slide.title || 'STEP INTO TIMELESS STYLE',
        subtitle: slide.subtitle || 'RETRO SNEAKERS. EVERYDAY CHARACTER.',
        tag: slide.scriptText || null,
        desktop_img: slide.img,
        mobile_img: slide.mobileImg || slide.img,
        target_path: slide.to || '/collections',
        button_label: slide.ctaText || 'Explore Collection',
        is_active: slide.isActive ?? true,
        display_order: displayOrder,
      },
      { onConflict: 'id' }
    );
    return !error;
  } catch (err) {
    console.warn('[Supabase] saveHeroSlide exception:', err);
    return false;
  }
}

/**
 * Delete a hero slide from Supabase
 */
export async function deleteHeroSlideFromSupabase(id: string): Promise<boolean> {
  if (!supabase) return false;
  try {
    const { error } = await supabase.from('hero_slides').delete().eq('id', id);
    return !error;
  } catch {
    return false;
  }
}

/**
 * Toggle active status of a hero slide in Supabase
 */
export async function toggleHeroSlideStatusInSupabase(
  id: string,
  isActive: boolean
): Promise<boolean> {
  if (!supabase) return false;
  try {
    const { error } = await supabase
      .from('hero_slides')
      .update({ is_active: isActive })
      .eq('id', id);
    return !error;
  } catch {
    return false;
  }
}
