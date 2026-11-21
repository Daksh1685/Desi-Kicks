import { createClient } from '@supabase/supabase-js';
import type { Order } from '../types/order';
import type { Product, NewProductInput, ProductGender } from '../types/product';

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
