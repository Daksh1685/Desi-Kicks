import React from 'react';
import { inputCls } from './adminTypes';

export type BannerFormData = {
  title: string;
  scriptText: string;
  subtitle: string;
  ctaText: string;
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
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Desktop Landscape Image URL (16:9) *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. /hero/retro-timeless-landscape.jpg or https://images.unsplash.com/..."
                  value={bannerFormData.img}
                  onChange={(e) => setBannerFormData({ ...bannerFormData, img: e.target.value })}
                  className={inputCls}
                />
                <p className="text-[11px] text-gray-400 mt-1">
                  Recommended: 1672 × 941px or 1920 × 1080px (16:9 ratio). Local files in <code className="bg-gray-100 px-1 py-0.5 rounded">public/hero/</code> or external CDN links.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Desktop WebP URL (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. /hero/retro-timeless-landscape.webp"
                    value={bannerFormData.imgWebp}
                    onChange={(e) => setBannerFormData({ ...bannerFormData, imgWebp: e.target.value })}
                    className={inputCls}
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Mobile Portrait Image URL (9:16 Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. /hero/retro-timeless-portrait.jpg"
                    value={bannerFormData.mobileImg}
                    onChange={(e) => setBannerFormData({ ...bannerFormData, mobileImg: e.target.value })}
                    className={inputCls}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Mobile WebP URL (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. /hero/retro-timeless-portrait.webp"
                  value={bannerFormData.mobileImgWebp}
                  onChange={(e) => setBannerFormData({ ...bannerFormData, mobileImgWebp: e.target.value })}
                  className={inputCls}
                />
              </div>

              {/* Live preview inside modal */}
              {bannerFormData.img && (
                <div className="p-3 bg-gray-50 rounded-xl border border-gray-200">
                  <p className="text-xs font-bold text-gray-700 mb-2">Live Slide Preview</p>
                  <div className="relative aspect-video w-full rounded-lg overflow-hidden bg-black/10">
                    <img
                      src={bannerFormData.img}
                      alt="Preview"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=800&auto=format&fit=crop';
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-black/20 p-4 flex flex-col justify-end text-white">
                      {bannerFormData.scriptText && (
                        <p className="font-handwriting text-primary-light italic text-sm">
                          {bannerFormData.scriptText}
                        </p>
                      )}
                      <p className="font-extrabold text-base sm:text-lg leading-tight">
                        {bannerFormData.title || 'YOUR SLIDE TITLE'}
                      </p>
                      {bannerFormData.subtitle && (
                        <p className="text-xs text-white/80 mt-0.5 uppercase tracking-wider font-medium">
                          {bannerFormData.subtitle}
                        </p>
                      )}
                      <div className="mt-2">
                        <span className="inline-block bg-primary text-white text-[11px] font-bold px-3 py-1 rounded-full">
                          {bannerFormData.ctaText || 'EXPLORE NOW'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Section 2: Copy & Content */}
          <div className="border-t border-gray-100 pt-5">
            <p className="text-xs font-bold text-primary uppercase tracking-wider mb-3">
              2. Slide Copy & Headings
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  Main Heading (Title)
                </label>
                <input
                  type="text"
                  placeholder="e.g. STEP INTO TIMELESS STYLE"
                  value={bannerFormData.title}
                  onChange={(e) => setBannerFormData({ ...bannerFormData, title: e.target.value })}
                  className={inputCls}
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  Script Accent Text (Cursive)
                </label>
                <input
                  type="text"
                  placeholder="e.g. A Classic Redefined"
                  value={bannerFormData.scriptText}
                  onChange={(e) => setBannerFormData({ ...bannerFormData, scriptText: e.target.value })}
                  className={inputCls}
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  Subtitle / Eyebrow Text
                </label>
                <input
                  type="text"
                  placeholder="e.g. RETRO SNEAKERS. EVERYDAY CHARACTER."
                  value={bannerFormData.subtitle}
                  onChange={(e) => setBannerFormData({ ...bannerFormData, subtitle: e.target.value })}
                  className={inputCls}
                />
              </div>
            </div>
          </div>

          {/* Section 3: Call to Action & Link */}
          <div className="border-t border-gray-100 pt-5">
            <p className="text-xs font-bold text-primary uppercase tracking-wider mb-3">
              3. Button & Link Destination
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  Button Text (CTA)
                </label>
                <input
                  type="text"
                  placeholder="e.g. EXPLORE THE COLLECTION"
                  value={bannerFormData.ctaText}
                  onChange={(e) => setBannerFormData({ ...bannerFormData, ctaText: e.target.value })}
                  className={inputCls}
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  Target Destination Path / URL
                </label>
                <input
                  type="text"
                  placeholder="e.g. /collections/men, /collections, etc."
                  value={bannerFormData.to}
                  onChange={(e) => setBannerFormData({ ...bannerFormData, to: e.target.value })}
                  className={inputCls}
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  Image Alt Text (SEO & Accessibility)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Step Into Timeless Style - Retro Sneakers Everyday Character"
                  value={bannerFormData.alt}
                  onChange={(e) => setBannerFormData({ ...bannerFormData, alt: e.target.value })}
                  className={inputCls}
                />
              </div>
            </div>
          </div>

          {/* Section 4: Display Options */}
          <div className="border-t border-gray-100 pt-5">
            <p className="text-xs font-bold text-primary uppercase tracking-wider mb-3">
              4. Layout & Visibility
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
