import React from 'react';
import { SizeInventoryManager } from './SizeInventoryManager';
import { inputCls, GENDER_SIZE_PRESETS } from './adminTypes';
import { getAllCategories, getSubcategoriesForCategory } from '../../constants/taxonomy';
import type { ProductGender } from '../../types/product';

const CATEGORIES = getAllCategories();

export type ProductFormData = {
  name: string;
  category: string;
  subcategory: string;
  gender: ProductGender;
  tag: string;
  price: number;
  originalPrice: number;
  description: string;
  story: string;
  upperMaterial: string;
  soleMaterial: string;
  insoleType: string;
  idealFor: string;
  artisanRegion: string;
  img: string;
  additionalImg1: string;
  additionalImg2: string;
  additionalImg3: string;
  additionalImg4: string;
};

interface AddProductModalProps {
  isOpen: boolean;
  formData: ProductFormData;
  setFormData: React.Dispatch<React.SetStateAction<ProductFormData>>;
  selectedSizes: string[];
  setSelectedSizes: React.Dispatch<React.SetStateAction<string[]>>;
  sizeStocks: Record<string, number>;
  setSizeStocks: React.Dispatch<React.SetStateAction<Record<string, number>>>;
  onSubmit: (e: React.FormEvent) => void;
  onClose: () => void;
}

export function AddProductModal({
  isOpen,
  formData,
  setFormData,
  selectedSizes,
  setSelectedSizes,
  sizeStocks,
  setSizeStocks,
  onSubmit,
  onClose,
}: AddProductModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl w-full max-w-2xl shadow-xl border border-gray-200 flex flex-col my-auto animate-scale-up">
        {/* Header */}
        <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white z-10 rounded-t-2xl">
          <div>
            <h2 className="text-lg font-black text-gray-900 uppercase tracking-wide">Add New Product</h2>
            <p className="text-xs text-gray-500 mt-0.5">Will be published to your storefront immediately</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 font-bold cursor-pointer text-sm"
          >✕</button>
        </div>

        <form onSubmit={onSubmit} className="p-6 space-y-6 overflow-y-auto max-h-[76vh]">
          {/* Section 1 */}
          <div>
            <p className="text-xs font-bold text-primary uppercase tracking-wider mb-3">1. Basic Details & Pricing</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">Product Name *</label>
                <input type="text" required placeholder="e.g. Royal Zari Velvet Mojari" value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })} className={inputCls} />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">Category *</label>
                <select value={formData.category} onChange={(e) => { const c = e.target.value; setFormData({ ...formData, category: c, subcategory: getSubcategoriesForCategory(c)[0] || '' }); }} className={inputCls + ' cursor-pointer'}>
                  {CATEGORIES.map((cat) => <option key={cat} value={cat}>{cat}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">Subcategory</label>
                <select value={formData.subcategory} onChange={(e) => setFormData({ ...formData, subcategory: e.target.value })} className={inputCls + ' cursor-pointer'}>
                  {getSubcategoriesForCategory(formData.category).map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">Gender</label>
                <select
                  value={formData.gender}
                  onChange={(e) => {
                    const nextGender = e.target.value as ProductGender;
                    setFormData({ ...formData, gender: nextGender });
                    setSelectedSizes([...GENDER_SIZE_PRESETS[nextGender]]);
                  }}
                  className={inputCls + ' cursor-pointer'}
                >
                  <option value="Unisex">Unisex</option>
                  <option value="Men">Men's</option>
                  <option value="Women">Women's</option>
                  <option value="Kids">Kids'</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">Tag / Badge</label>
                <input type="text" placeholder="e.g. Bestseller, New Drop" value={formData.tag}
                  onChange={(e) => setFormData({ ...formData, tag: e.target.value })} className={inputCls} />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">Selling Price (₹) *</label>
                <input type="number" required min={100} value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })} className={inputCls + ' font-bold'} />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">MRP / Original Price (₹)</label>
                <input type="number" min={100} value={formData.originalPrice}
                  onChange={(e) => setFormData({ ...formData, originalPrice: Number(e.target.value) })} className={inputCls} />
              </div>
            </div>
          </div>

          {/* Section 2 */}
          <div className="border-t border-gray-100 pt-5">
            <p className="text-xs font-bold text-primary uppercase tracking-wider mb-3">2. Artisan Heritage & Materials</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">Artisan Region</label>
                <input type="text" placeholder="e.g. Jaipur, Rajasthan" value={formData.artisanRegion}
                  onChange={(e) => setFormData({ ...formData, artisanRegion: e.target.value })} className={inputCls} />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">Upper Material</label>
                <input type="text" placeholder="e.g. Pure Velvet with Zari" value={formData.upperMaterial}
                  onChange={(e) => setFormData({ ...formData, upperMaterial: e.target.value })} className={inputCls} />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">Sole Material</label>
                <input type="text" placeholder="e.g. Anti-Skid Rubber" value={formData.soleMaterial}
                  onChange={(e) => setFormData({ ...formData, soleMaterial: e.target.value })} className={inputCls} />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">Insole Type</label>
                <input type="text" placeholder="e.g. Memory Foam" value={formData.insoleType}
                  onChange={(e) => setFormData({ ...formData, insoleType: e.target.value })} className={inputCls} />
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">Product Story</label>
                <textarea rows={2} placeholder="Artisan backstory..." value={formData.story}
                  onChange={(e) => setFormData({ ...formData, story: e.target.value })}
                  className={inputCls + ' resize-none'} />
              </div>
            </div>
          </div>

          {/* Section 3 */}
          <div className="border-t border-gray-100 pt-5">
            <p className="text-xs font-bold text-primary uppercase tracking-wider mb-3">3. Images & Media</p>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">Primary Hero Image URL *</label>
                <input type="url" required placeholder="https://..." value={formData.img}
                  onChange={(e) => setFormData({ ...formData, img: e.target.value })} className={inputCls} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: 'Angle 2: Top View', key: 'additionalImg1' as const },
                  { label: 'Angle 3: Sole', key: 'additionalImg2' as const },
                  { label: 'Angle 4: Heel / Detail', key: 'additionalImg3' as const },
                  { label: 'Angle 5: Lifestyle', key: 'additionalImg4' as const },
                ].map((f) => (
                  <div key={f.key}>
                    <label className="block text-xs font-medium text-gray-500 mb-1">{f.label}</label>
                    <input type="url" placeholder="https://..." value={formData[f.key]}
                      onChange={(e) => setFormData({ ...formData, [f.key]: e.target.value })}
                      className={inputCls} />
                  </div>
                ))}
              </div>
              {formData.img && (
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-200">
                  <img src={formData.img} alt="Preview" className="w-14 h-14 rounded-lg object-cover border border-gray-200"
                    onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                  <div className="text-xs text-gray-500">
                    <p className="font-semibold text-gray-800">Image Preview</p>
                    <p>Thumbnail shown on product cards & catalog</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Section 4 */}
          <div className="border-t border-gray-100 pt-5">
            <p className="text-xs font-bold text-primary uppercase tracking-wider mb-1">
              4. Available Sizes & Stock Matrix (UK 1 – UK 12)
            </p>
            <p className="text-xs text-gray-400 mb-3">
              Toggle active sizes for this footwear model and set starting pair inventory:
            </p>
            <SizeInventoryManager
              gender={formData.gender}
              selectedSizes={selectedSizes}
              onChangeSelectedSizes={setSelectedSizes}
              sizeStocks={sizeStocks}
              onChangeStock={(size, stock) =>
                setSizeStocks((prev) => ({ ...prev, [size]: stock }))
              }
              onApplyStockToAll={(stock) =>
                setSizeStocks((prev) => {
                  const next = { ...prev };
                  selectedSizes.forEach((s) => {
                    next[s] = stock;
                  });
                  return next;
                })
              }
            />
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 pt-2 border-t border-gray-100 sticky bottom-0 bg-white pb-1">
            <button type="button" onClick={onClose}
              className="px-5 py-2.5 rounded-xl border border-gray-200 text-gray-700 text-sm font-semibold hover:bg-gray-50 transition cursor-pointer">
              Cancel
            </button>
            <button type="submit"
              className="px-6 py-2.5 rounded-xl bg-primary hover:bg-[#8a2600] text-white text-sm font-bold shadow-sm transition cursor-pointer">
              Publish Product →
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

interface EditProductModalProps {
  isOpen: boolean;
  formData: ProductFormData;
  setFormData: React.Dispatch<React.SetStateAction<ProductFormData>>;
  selectedSizes: string[];
  setSelectedSizes: React.Dispatch<React.SetStateAction<string[]>>;
  sizeStocks: Record<string, number>;
  setSizeStocks: React.Dispatch<React.SetStateAction<Record<string, number>>>;
  onSubmit: (e: React.FormEvent) => void;
  onClose: () => void;
}

export function EditProductModal({
  isOpen,
  formData,
  setFormData,
  selectedSizes,
  setSelectedSizes,
  sizeStocks,
  setSizeStocks,
  onSubmit,
  onClose,
}: EditProductModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl w-full max-w-2xl shadow-xl border border-gray-200 flex flex-col my-auto animate-scale-up">
        {/* Header */}
        <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white z-10 rounded-t-2xl">
          <div>
            <h2 className="text-lg font-black text-gray-900 uppercase tracking-wide">Edit Product</h2>
            <p className="text-xs text-gray-500 mt-0.5">Update details, pricing, and size inventory</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 font-bold cursor-pointer text-sm"
          >✕</button>
        </div>

        <form onSubmit={onSubmit} className="p-6 space-y-6 overflow-y-auto max-h-[76vh]">
          {/* Section 1 */}
          <div>
            <p className="text-xs font-bold text-primary uppercase tracking-wider mb-3">1. Basic Details & Pricing</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">Product Name *</label>
                <input type="text" required value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })} className={inputCls} />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">Category *</label>
                <select value={formData.category} onChange={(e) => { const c = e.target.value; setFormData({ ...formData, category: c, subcategory: getSubcategoriesForCategory(c)[0] || '' }); }} className={inputCls + ' cursor-pointer'}>
                  {CATEGORIES.map((cat) => <option key={cat} value={cat}>{cat}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">Subcategory</label>
                <select value={formData.subcategory} onChange={(e) => setFormData({ ...formData, subcategory: e.target.value })} className={inputCls + ' cursor-pointer'}>
                  {getSubcategoriesForCategory(formData.category).map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">Gender</label>
                <select
                  value={formData.gender}
                  onChange={(e) => {
                    const nextGender = e.target.value as ProductGender;
                    setFormData({ ...formData, gender: nextGender });
                  }}
                  className={inputCls + ' cursor-pointer'}
                >
                  <option value="Unisex">Unisex</option>
                  <option value="Men">Men's</option>
                  <option value="Women">Women's</option>
                  <option value="Kids">Kids'</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">Tag / Badge</label>
                <input type="text" placeholder="e.g. Bestseller" value={formData.tag}
                  onChange={(e) => setFormData({ ...formData, tag: e.target.value })} className={inputCls} />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">Selling Price (₹) *</label>
                <input type="number" required min={100} value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })} className={inputCls + ' font-bold'} />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">MRP (₹)</label>
                <input type="number" min={100} value={formData.originalPrice}
                  onChange={(e) => setFormData({ ...formData, originalPrice: Number(e.target.value) })} className={inputCls} />
              </div>
            </div>
          </div>

          {/* Section 2 */}
          <div className="border-t border-gray-100 pt-5">
            <p className="text-xs font-bold text-primary uppercase tracking-wider mb-3">2. Heritage & Materials</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">Artisan Region</label>
                <input type="text" value={formData.artisanRegion}
                  onChange={(e) => setFormData({ ...formData, artisanRegion: e.target.value })} className={inputCls} />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">Upper Material</label>
                <input type="text" value={formData.upperMaterial}
                  onChange={(e) => setFormData({ ...formData, upperMaterial: e.target.value })} className={inputCls} />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">Sole Material</label>
                <input type="text" value={formData.soleMaterial}
                  onChange={(e) => setFormData({ ...formData, soleMaterial: e.target.value })} className={inputCls} />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">Insole Type</label>
                <input type="text" value={formData.insoleType}
                  onChange={(e) => setFormData({ ...formData, insoleType: e.target.value })} className={inputCls} />
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">Artisan Story</label>
                <textarea rows={2} value={formData.story}
                  onChange={(e) => setFormData({ ...formData, story: e.target.value })}
                  className={inputCls + ' resize-none'} />
              </div>
            </div>
          </div>

          {/* Section 3 */}
          <div className="border-t border-gray-100 pt-5">
            <p className="text-xs font-bold text-primary uppercase tracking-wider mb-3">3. Images & Showcase</p>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">Primary Hero Image URL *</label>
                <input type="url" required value={formData.img}
                  onChange={(e) => setFormData({ ...formData, img: e.target.value })} className={inputCls} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: 'Angle 2: Top View', key: 'additionalImg1' as const },
                  { label: 'Angle 3: Sole', key: 'additionalImg2' as const },
                  { label: 'Angle 4: Heel', key: 'additionalImg3' as const },
                  { label: 'Angle 5: Lifestyle', key: 'additionalImg4' as const },
                ].map((f) => (
                  <div key={f.key}>
                    <label className="block text-xs font-medium text-gray-500 mb-1">{f.label}</label>
                    <input type="url" placeholder="https://..." value={formData[f.key]}
                      onChange={(e) => setFormData({ ...formData, [f.key]: e.target.value })}
                      className={inputCls} />
                  </div>
                ))}
              </div>
              {formData.img && (
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-200">
                  <img src={formData.img} alt="Preview" className="w-14 h-14 rounded-lg object-cover border border-gray-200"
                    onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                  <div className="text-xs text-gray-500">
                    <p className="font-semibold text-gray-800">Thumbnail Preview</p>
                    <p>Shown on product cards & checkout</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Section 4 */}
          <div className="border-t border-gray-100 pt-5">
            <p className="text-xs font-bold text-primary uppercase tracking-wider mb-1">
              4. Available Sizes & Stock Matrix (UK 1 – UK 12)
            </p>
            <p className="text-xs text-gray-400 mb-3">
              Adjust active sizes and current inventory pairs for this shoe:
            </p>
            <SizeInventoryManager
              gender={formData.gender}
              selectedSizes={selectedSizes}
              onChangeSelectedSizes={setSelectedSizes}
              sizeStocks={sizeStocks}
              onChangeStock={(size, stock) =>
                setSizeStocks((prev) => ({ ...prev, [size]: stock }))
              }
              onApplyStockToAll={(stock) =>
                setSizeStocks((prev) => {
                  const next = { ...prev };
                  selectedSizes.forEach((s) => {
                    next[s] = stock;
                  });
                  return next;
                })
              }
            />
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 pt-2 border-t border-gray-100 sticky bottom-0 bg-white pb-1">
            <button type="button" onClick={onClose}
              className="px-5 py-2.5 rounded-xl border border-gray-200 text-gray-700 text-sm font-semibold hover:bg-gray-50 transition cursor-pointer">
              Cancel
            </button>
            <button type="submit"
              className="px-6 py-2.5 rounded-xl bg-primary hover:bg-[#8a2600] text-white text-sm font-bold shadow-sm transition cursor-pointer">
              Save Changes ✓
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
