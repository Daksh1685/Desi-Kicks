import React, { useState, useMemo } from 'react';
import { ImageUploadField } from './ImageUploadField';
import { inputCls } from './adminTypes';
import { useProductCatalog } from '../../context/ProductContext';
import { Dropdown, type DropdownOption } from '../../components/ui/Dropdown';

export type BannerFormData = {
  to: string;
  img: string;
  imgWebp: string;
  mobileImg: string;
  mobileImgWebp: string;
  alt: string;
  isFullBanner: boolean;
  isActive: boolean;
};

interface BannerFormModalProps {
  isOpen: boolean;
  editingBannerId: string | null;
  bannerFormData: BannerFormData;
  setBannerFormData: React.Dispatch<React.SetStateAction<BannerFormData>>;
  onSubmit: (e: React.FormEvent) => void;
  onClose: () => void;
}

export function BannerFormModal({
  isOpen,
  editingBannerId,
  bannerFormData,
  setBannerFormData,
  onSubmit,
  onClose,
}: BannerFormModalProps) {
  const { activeProducts } = useProductCatalog();

  // Predefined site links grouped by department and customer service
  const destinationOptions = useMemo<DropdownOption[]>(() => {
    const list: DropdownOption[] = [
      {
        group: 'Collections & Categories',
        items: [
          { label: 'All Collections', value: '/collections', description: '/collections', badge: 'Catalog' },
          { label: "Men's Footwear", value: '/collections/men', description: '/collections/men' },
          { label: "Women's Footwear", value: '/collections/women', description: '/collections/women' },
          { label: "Kids' Collection", value: '/collections/kids', description: '/collections/kids' },
          { label: 'Festive & Ethnic Mojaris', value: '/collections/festive-ethnic', description: '/collections/festive-ethnic' },
          { label: 'Daily Comfort Slip-Ons', value: '/collections/daily-comfort', description: '/collections/daily-comfort' },
          { label: 'Gym & Sports Trainers', value: '/collections/gym-sports', description: '/collections/gym-sports' },
          { label: 'Work & Formal Leather', value: '/collections/work-formal', description: '/collections/work-formal' },
        ],
      },
      {
        group: 'Storefront & Customer Services',
        items: [
          { label: 'Homepage', value: '/', description: '/' },
          { label: 'Shopping Cart', value: '/cart', description: '/cart' },
          { label: 'Track Order Progress', value: '/track-order', description: '/track-order' },
          { label: 'Size Guide & Measurement Chart', value: '/size-guide', description: '/size-guide' },
          { label: 'Handcrafted Authenticity', value: '/authenticity', description: '/authenticity' },
          { label: 'Our Heritage Story', value: '/about', description: '/about' },
          { label: 'Contact Support & Concierge', value: '/contact', description: '/contact' },
          { label: 'Shipping & Delivery Policy', value: '/shipping-policy', description: '/shipping-policy' },
          { label: '36-Hour Size Exchange Policy (Exchange Only)', value: '/returns-exchange', description: '/returns-exchange' },
          { label: 'Privacy Policy', value: '/privacy-policy', description: '/privacy-policy' },
          { label: 'Terms of Service', value: '/terms', description: '/terms' },
        ],
      },
    ];

    if (activeProducts.length > 0) {
      list.push({
        group: 'Active Products',
        items: activeProducts.map((prod) => ({
          label: prod.name,
          value: `/products/${prod.slug}`,
          description: `/products/${prod.slug}`,
          badge: prod.category || undefined,
        })),
      });
    }

    list.push({
      group: 'Other',
      items: [
        {
          label: 'Custom Path / External URL...',
          value: '__custom__',
          description: 'Type a custom route or external website link',
        },
      ],
    });

    return list;
  }, [activeProducts]);

  // Check if current target path exists among predefined options
  const isKnownPreset = useMemo(() => {
    return destinationOptions.some((opt) => {
      if ('items' in opt && Array.isArray(opt.items)) {
        return opt.items.some((item) => item.value !== '__custom__' && item.value === bannerFormData.to);
      }
      return 'value' in opt && (opt as { value: string }).value !== '__custom__' && (opt as { value: string }).value === bannerFormData.to;
    });
  }, [destinationOptions, bannerFormData.to]);

  const [userWantsCustom, setUserWantsCustom] = useState<boolean>(false);
  const isCustomMode = userWantsCustom || (!isKnownPreset && Boolean(bannerFormData.to));

  const handleDropdownChange = (val: string) => {
    if (val === '__custom__') {
      setUserWantsCustom(true);
    } else {
      setUserWantsCustom(false);
      setBannerFormData({ ...bannerFormData, to: val });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl w-full max-w-2xl shadow-xl border border-gray-200 flex flex-col my-auto animate-scale-up">
        {/* Header */}
        <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white z-10 rounded-t-2xl">
          <div>
            <h2 className="text-lg font-black text-gray-900 uppercase tracking-wide">
              {editingBannerId ? 'Edit Hero Banner Slide' : 'Add New Hero Banner Slide'}
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">
              Changes will sync immediately to the homepage hero carousel
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 font-bold cursor-pointer text-sm"
          >
            ✕
          </button>
        </div>

        <form onSubmit={onSubmit} className="p-6 space-y-6 overflow-y-auto max-h-[76vh]">
          {/* Section 1: Images */}
          <div>
            <p className="text-xs font-bold text-primary uppercase tracking-wider mb-3">
              1. Imagery & Responsive Art Direction
            </p>
            <div className="space-y-4">
              <ImageUploadField
                label="Desktop Landscape Hero Banner (16:9)"
                value={bannerFormData.img}
                onChange={(url) => setBannerFormData({ ...bannerFormData, img: url })}
                folder="hero"
                required
                helperText="Recommended: 1672 × 941px or 1920 × 1080px (16:9 widescreen desktop ratio)."
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <ImageUploadField
                  label="Mobile Portrait Banner (9:16 Optional)"
                  value={bannerFormData.mobileImg}
                  onChange={(url) => setBannerFormData({ ...bannerFormData, mobileImg: url })}
                  folder="hero"
                  compact
                  helperText="Recommended: 941 × 1672px or 1080 × 1920px (9:16 mobile portrait ratio)."
                />
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Optimized WebP File Path (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. /hero/retro-timeless-landscape.webp"
                    value={bannerFormData.imgWebp}
                    onChange={(e) => setBannerFormData({ ...bannerFormData, imgWebp: e.target.value })}
                    className={inputCls}
                  />
                  <p className="text-[11px] text-gray-400 mt-1">
                    Serving WebP alongside JPG delivers maximum PageSpeed performance.
                  </p>
                </div>
              </div>

              {/* Live preview inside modal */}
              {bannerFormData.img && (
                <div className="p-3 bg-gray-50 rounded-xl border border-gray-200">
                  <p className="text-xs font-bold text-gray-700 mb-2">Live Slide Preview (Desktop 16:9)</p>
                  <div className="relative aspect-video w-full rounded-lg overflow-hidden bg-black/10 border border-gray-200">
                    <img
                      src={bannerFormData.img}
                      alt={bannerFormData.alt || "Preview"}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=800&auto=format&fit=crop';
                      }}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Section 2: Link Destination & SEO */}
          <div className="border-t border-gray-100 pt-5">
            <p className="text-xs font-bold text-primary uppercase tracking-wider mb-3">
              2. Link Destination & Accessibility
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Dropdown
                  label="Target Destination Link"
                  value={isCustomMode || !isKnownPreset ? '__custom__' : bannerFormData.to}
                  onChange={handleDropdownChange}
                  options={destinationOptions}
                  searchable
                  searchPlaceholder="Search collections, pages, or products..."
                  placeholder="Select a destination link..."
                  variant="default"
                />

                {isCustomMode || !isKnownPreset ? (
                  <div className="mt-2.5">
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-[11px] font-semibold text-gray-700">
                        Enter Custom Path or URL:
                      </label>
                      {isKnownPreset && (
                        <button
                          type="button"
                          onClick={() => setUserWantsCustom(false)}
                          className="text-[11px] text-primary hover:underline font-medium cursor-pointer"
                        >
                          Cancel custom URL
                        </button>
                      )}
                    </div>
                    <input
                      type="text"
                      placeholder="e.g. /collections/men?sort=new or https://..."
                      value={bannerFormData.to}
                      onChange={(e) => setBannerFormData({ ...bannerFormData, to: e.target.value })}
                      className={inputCls}
                      autoFocus
                    />
                  </div>
                ) : (
                  <p className="text-[11px] text-gray-500 mt-1.5 flex items-center justify-between">
                    <span>
                      Active: <code className="bg-gray-100 text-gray-700 font-mono px-1 py-0.5 rounded text-[10px]">{bannerFormData.to || '/collections'}</code>
                    </span>
                    <button
                      type="button"
                      onClick={() => setUserWantsCustom(true)}
                      className="text-[11px] text-primary hover:underline font-medium cursor-pointer"
                    >
                      Type custom URL
                    </button>
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  Banner Alt / Label (SEO & Accessibility)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Retro Timeless Sneakers - Artisanal Heritage Drop"
                  value={bannerFormData.alt}
                  onChange={(e) => setBannerFormData({ ...bannerFormData, alt: e.target.value })}
                  className={inputCls}
                />
                <p className="text-[11px] text-gray-400 mt-1">
                  Descriptive label for screen readers and SEO indexers.
                </p>
              </div>
            </div>
          </div>

          {/* Section 3: Display Options */}
          <div className="border-t border-gray-100 pt-5">
            <p className="text-xs font-bold text-primary uppercase tracking-wider mb-3">
              3. Layout & Visibility
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <label className="flex items-center gap-3 p-3 bg-gray-50 border border-gray-200 rounded-xl cursor-pointer">
                <input
                  type="checkbox"
                  checked={bannerFormData.isFullBanner}
                  onChange={(e) => setBannerFormData({ ...bannerFormData, isFullBanner: e.target.checked })}
                  className="w-4 h-4 rounded accent-primary cursor-pointer"
                />
                <div>
                  <p className="text-xs font-bold text-gray-800">Full-Bleed Banner</p>
                  <p className="text-[11px] text-gray-400">Expanded layout matching hero container width</p>
                </div>
              </label>

              <label className="flex items-center gap-3 p-3 bg-gray-50 border border-gray-200 rounded-xl cursor-pointer">
                <input
                  type="checkbox"
                  checked={bannerFormData.isActive}
                  onChange={(e) => setBannerFormData({ ...bannerFormData, isActive: e.target.checked })}
                  className="w-4 h-4 rounded accent-primary cursor-pointer"
                />
                <div>
                  <p className="text-xs font-bold text-gray-800">Active (Visible)</p>
                  <p className="text-[11px] text-gray-400">Included in the live rotating carousel on homepage</p>
                </div>
              </label>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100 sticky bottom-0 bg-white pb-1">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl border border-gray-200 text-gray-700 text-sm font-semibold hover:bg-gray-50 transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-primary hover:bg-[#8a2600] text-white text-sm font-bold shadow-sm transition cursor-pointer"
            >
              {editingBannerId ? 'Save Changes ✓' : 'Add Banner Slide ✓'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
