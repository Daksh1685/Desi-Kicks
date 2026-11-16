import { Icon } from '../../components/ui/Icon';
import type { HeroSlide } from '../../context/HeroContext';

interface BannersSectionProps {
  heroSlides: HeroSlide[];
  activeHeroSlides: HeroSlide[];
  onMove: (idx: number, dir: 'up' | 'down') => void;
  onToggleActive: (id: string) => void;
  onEdit: (slide: HeroSlide) => void;
  onDelete: (id: string, title: string) => void;
  onAdd: () => void;
  onReset: () => void;
  showToast: (msg: string) => void;
}

export function BannersSection({
  heroSlides,
  activeHeroSlides,
  onMove,
  onToggleActive,
  onEdit,
  onDelete,
  onAdd,
  onReset,
  showToast,
}: BannersSectionProps) {
  return (
    <div className="space-y-6 max-w-6xl">
      {/* Top Header Card */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-gray-900">Hero Carousel Banners</h2>
            <span className="bg-primary/10 text-primary text-xs font-bold px-2.5 py-0.5 rounded-full">
              {activeHeroSlides.length} Live / {heroSlides.length} Total
            </span>
          </div>
          <p className="text-xs text-gray-500 mt-1 max-w-2xl">
            Customize the rotating banners displayed at the top of your homepage. Slides adapt dynamically: if you configure 2 slides, exactly 2 will rotate; if you add 7, all 7 rotate smoothly with autoplay, indicator dots, and touch gestures.
          </p>
        </div>

        <div className="flex items-center gap-2.5 self-stretch md:self-auto">
          <button
            type="button"
            onClick={() => {
              if (confirm('Reset hero carousel to default factory slides? Any custom slides will be replaced.')) {
                onReset();
                showToast('Hero banners reset to factory defaults.');
              }
            }}
            className="flex-1 md:flex-initial px-3.5 py-2.5 rounded-xl border border-gray-200 text-gray-600 hover:text-gray-900 hover:bg-gray-50 text-xs font-semibold transition cursor-pointer"
          >
            Reset Defaults
          </button>
          <button
            type="button"
            onClick={onAdd}
            className="flex-1 md:flex-initial flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-primary hover:bg-[#8a2600] text-white text-xs font-bold transition shadow-sm cursor-pointer"
          >
            <span className="text-base leading-none font-black">+</span>
            <span>Add Banner Slide</span>
          </button>
        </div>
      </div>

      {/* Responsive Tip Banner */}
      <div className="bg-gradient-to-r from-amber-50 to-orange-50/50 border border-amber-200/80 rounded-2xl p-4 flex items-start gap-3 text-xs text-amber-900">
        <div className="w-6 h-6 rounded-lg bg-amber-500 text-white flex items-center justify-center shrink-0 mt-0.5 font-bold">
          💡
        </div>
        <div className="flex-1">
          <p className="font-semibold text-amber-950">Art Direction & Image Dimensions Guide</p>
          <p className="text-amber-800/90 mt-0.5">
            For crystal-clear rendering across all devices: provide a <strong>16:9 Landscape</strong> image (recommended: 1920×1080px or 1600×900px) for desktop laptops, and optionally a <strong>9:16 Portrait</strong> image (recommended: 1080×1920px) for mobile smartphones. If mobile image is omitted, the desktop image automatically covers mobile screens.
          </p>
        </div>
      </div>

      {/* Banners List */}
      <div className="space-y-4">
        {heroSlides.map((slide, idx) => {
          const isFirst = idx === 0;
          const isLast = idx === heroSlides.length - 1;
          const isLive = slide.isActive !== false;

          return (
            <div
              key={slide.id}
              className={`bg-white rounded-2xl border transition-all ${
                isLive ? 'border-gray-200 hover:border-gray-300' : 'border-dashed border-gray-300 opacity-75'
              } p-5 shadow-xs flex flex-col md:flex-row gap-5 items-stretch md:items-center`}
            >
              {/* Position + Reorder Controls */}
              <div className="flex md:flex-col items-center justify-between md:justify-center gap-1 shrink-0">
                <span className="w-8 h-8 rounded-lg bg-gray-100 text-gray-700 font-extrabold text-xs flex items-center justify-center">
                  #{idx + 1}
                </span>
                <div className="flex md:flex-col gap-1">
                  <button
                    type="button"
                    disabled={isFirst}
                    onClick={() => onMove(idx, 'up')}
                    title="Move slide earlier in rotation"
                    className={`p-1.5 rounded-lg border text-xs transition ${
                      isFirst
                        ? 'border-gray-100 text-gray-300 cursor-not-allowed'
                        : 'border-gray-200 text-gray-600 hover:bg-gray-100 cursor-pointer'
                    }`}
                  >
                    ▲
                  </button>
                  <button
                    type="button"
                    disabled={isLast}
                    onClick={() => onMove(idx, 'down')}
                    title="Move slide later in rotation"
                    className={`p-1.5 rounded-lg border text-xs transition ${
                      isLast
                        ? 'border-gray-100 text-gray-300 cursor-not-allowed'
                        : 'border-gray-200 text-gray-600 hover:bg-gray-100 cursor-pointer'
                    }`}
                  >
                    ▼
                  </button>
                </div>
              </div>

              {/* Thumbnail Preview */}
              <div className="relative w-full md:w-56 h-32 rounded-xl overflow-hidden bg-gray-100 border border-gray-200 shrink-0 group">
                <img
                  src={slide.img}
                  alt={slide.alt || slide.title}
                  className="w-full h-full object-cover transition duration-300 group-hover:scale-105"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=800&auto=format&fit=crop';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 flex flex-col justify-between p-2.5">
                  <div className="flex items-center justify-between gap-1">
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-black/60 text-white backdrop-blur-xs">
                      16:9 Desktop
                    </span>
                    {slide.mobileImg && (
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-primary/90 text-white backdrop-blur-xs">
                        + 9:16 Mobile
                      </span>
                    )}
                  </div>
                  <div>
                    {slide.scriptText && (
                      <p className="text-[11px] font-handwriting text-primary-light italic line-clamp-1 drop-shadow">
                        {slide.scriptText}
                      </p>
                    )}
                    <p className="text-xs font-black text-white line-clamp-1 drop-shadow">
                      {slide.title || 'Untitled Banner'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Details & Target */}
              <div className="flex-1 min-w-0 space-y-1.5">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="font-extrabold text-gray-900 text-sm truncate">
                    {slide.title || 'Full-Bleed Visual Banner'}
                  </h3>
                  {slide.isFullBanner ? (
                    <span className="bg-blue-50 text-blue-700 text-[10px] font-bold px-2 py-0.5 rounded border border-blue-200">
                      Full-Bleed Banner
                    </span>
                  ) : (
                    <span className="bg-purple-50 text-purple-700 text-[10px] font-bold px-2 py-0.5 rounded border border-purple-200">
                      Split Card Style
                    </span>
                  )}
                  <button
                    type="button"
                    onClick={() => onToggleActive(slide.id)}
                    className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full transition cursor-pointer ${
                      isLive
                        ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                        : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                    }`}
                  >
                    {isLive ? '● Live on Store' : '○ Draft (Hidden)'}
                  </button>
                </div>

                {slide.subtitle && (
                  <p className="text-xs text-gray-600 line-clamp-1">
                    {slide.subtitle}
                  </p>
                )}

                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-500 pt-1">
                  <span className="flex items-center gap-1 font-mono text-[11px] bg-gray-50 px-2 py-0.5 rounded border border-gray-100">
                    <span className="text-gray-400">Link:</span> {slide.to}
                  </span>
                  <span className="flex items-center gap-1 text-[11px]">
                    <span className="text-gray-400">CTA:</span> "{slide.ctaText || 'EXPLORE'}"
                  </span>
                  <span className="flex items-center gap-1 text-[11px] text-gray-400 truncate max-w-xs" title={slide.img}>
                    Src: {slide.img}
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end md:flex-col gap-2 shrink-0 pt-3 md:pt-0 border-t md:border-t-0 border-gray-100">
                <button
                  type="button"
                  onClick={() => onEdit(slide)}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-gray-200 text-gray-700 hover:bg-orange-50 hover:text-primary hover:border-orange-200 text-xs font-semibold transition cursor-pointer"
                >
                  <Icon name="edit" className="w-3.5 h-3.5" />
                  <span>Edit</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    if (confirm(`Delete banner "${slide.title || 'Untitled'}"?`)) {
                      onDelete(slide.id, slide.title || 'Untitled');
                      showToast('Hero banner deleted.');
                    }
                  }}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-gray-200 text-gray-500 hover:bg-red-50 hover:text-red-600 hover:border-red-200 text-xs font-semibold transition cursor-pointer"
                >
                  <Icon name="trash" className="w-3.5 h-3.5" />
                  <span>Delete</span>
                </button>
              </div>
            </div>
          );
        })}

        {heroSlides.length === 0 && (
          <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center">
            <div className="w-14 h-14 bg-gray-100 text-gray-400 rounded-2xl flex items-center justify-center mx-auto mb-3">
              <Icon name="photo_camera" className="w-7 h-7" />
            </div>
            <h3 className="font-bold text-gray-800 mb-1">No Hero Banners</h3>
            <p className="text-xs text-gray-400 max-w-sm mx-auto mb-4">
              You currently have no hero slides configured. Click below to add one or reset defaults.
            </p>
            <div className="flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={onReset}
                className="px-4 py-2 rounded-xl border border-gray-200 text-xs font-bold text-gray-700 hover:bg-gray-50 cursor-pointer"
              >
                Reset Factory Slides
              </button>
              <button
                type="button"
                onClick={onAdd}
                className="px-4 py-2 rounded-xl bg-primary text-white text-xs font-bold hover:bg-[#8a2600] cursor-pointer"
              >
                + Add First Banner
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
