import { useState, useEffect, useCallback, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Icon } from './ui/Icon';

interface HeroSlide {
  id: string;
  isFullBanner?: boolean;
  scriptText?: string;
  title: string;
  subtitle?: string;
  ctaText?: string;
  to: string;
  img: string;
  imgWebp?: string;
  mobileImg?: string;
  mobileImgWebp?: string;
  alt: string;
}

const HERO_SLIDES: HeroSlide[] = [
  {
    id: 'timeless-style',
    isFullBanner: true,
    scriptText: 'A Classic Redefined',
    title: 'STEP INTO TIMELESS STYLE',
    subtitle: 'RETRO SNEAKERS. EVERYDAY CHARACTER.',
    ctaText: 'EXPLORE THE COLLECTION',
    to: '/collections/men',
    img: '/hero/retro-timeless-landscape.jpg',
    imgWebp: '/hero/retro-timeless-landscape.webp',
    mobileImg: '/hero/retro-timeless-portrait.jpg',
    mobileImgWebp: '/hero/retro-timeless-portrait.webp',
    alt: 'Step Into Timeless Style - Retro Sneakers Everyday Character',
  },
  {
    id: 'retro-casuals',
    isFullBanner: true,
    scriptText: 'Too Fresh',
    title: 'TO FOLLOW',
    subtitle: 'RETRO CASUALS',
    ctaText: 'SHOP NOW',
    to: '/collections/all',
    img: '/hero/retro-casuals-hero-clean.jpg',
    alt: 'Too Fresh To Follow - Retro Casuals Sneakers Collection',
  },
  {
    id: 'festive-ethnic',
    isFullBanner: false,
    scriptText: 'Grand Festive Edit',
    title: 'THE ROYAL DESI\nHERITAGE EDITIONS',
    subtitle: 'HANDCRAFTED JUTTIS & MOJARIS',
    ctaText: 'EXPLORE FESTIVE',
    to: '/collections/festive-ethnic',
    img: 'https://images.unsplash.com/photo-1535043934128-cf0b28d52f95?q=80&w=1600&auto=format&fit=crop',
    alt: 'Handcrafted Royal Desi Ethnic Footwear Collection',
  },
  {
    id: 'daily-comfort',
    isFullBanner: false,
    scriptText: 'All-Day Everyday',
    title: 'CLOUD STEPPER\nDAILY WEAR',
    subtitle: 'FEATHERLIGHT SLIP-ONS & LOAFERS',
    ctaText: 'SHOP DAILY WEAR',
    to: '/collections/daily-comfort',
    img: 'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?q=80&w=1600&auto=format&fit=crop',
    alt: 'Cloud Stepper Daily Comfort Walking Shoes',
  },
  {
    id: 'gym-sports',
    isFullBanner: false,
    scriptText: 'Active Performance',
    title: 'AERO STRIDE\nPRO RUNNER',
    subtitle: 'HIGH-REBOUND ATHLETIC SNEAKERS',
    ctaText: 'SHOP ATHLETIC',
    to: '/collections/gym-sports',
    img: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=1600&auto=format&fit=crop',
    alt: 'Aero Stride Pro Athletic Running Shoes',
  },
];

export function Hero() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Touch swipe support for mobile
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
  }, []);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length);
  }, []);

  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(nextSlide, 6000);
    return () => clearInterval(interval);
  }, [isPaused, nextSlide]);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;
    const diff = touchStartX.current - touchEndX.current;
    const minSwipeDistance = 45;

    if (diff > minSwipeDistance) {
      nextSlide();
    } else if (diff < -minSwipeDistance) {
      prevSlide();
    }
    touchStartX.current = null;
    touchEndX.current = null;
  };

  return (
    <div className="w-full max-w-[1600px] mx-auto px-2 sm:px-4 md:px-6 pt-2 pb-3">
      <section
        className="relative w-full aspect-[9/16] sm:aspect-[16/9] max-h-[85vh] sm:max-h-none overflow-hidden rounded-xl sm:rounded-2xl md:rounded-3xl shadow-sm bg-neutral-900 group select-none"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        aria-label="Featured Releases Carousel"
      >
        {/* Slides Track */}
        <div
          className="flex h-full w-full transition-transform duration-700 ease-out"
          style={{ transform: `translateX(-${currentSlide * 100}%)` }}
        >
          {HERO_SLIDES.map((slide, idx) => (
            <div key={slide.id} className="min-w-full h-full relative shrink-0">
              {slide.isFullBanner ? (
                /* Full Graphic Creative Banner with Responsive Art Direction */
                <Link
                  to={slide.to}
                  className="block w-full h-full cursor-pointer relative"
                  aria-label={`${slide.scriptText || ''} ${slide.title} - ${slide.subtitle || 'Explore The Collection'}`}
                >
                  <picture className="w-full h-full block">
                    {/* Mobile WebP format */}
                    {slide.mobileImgWebp && (
                      <source
                        media="(max-width: 639px)"
                        type="image/webp"
                        srcSet={slide.mobileImgWebp}
                      />
                    )}
                    {/* Mobile standard image fallback */}
                    {slide.mobileImg && (
                      <source
                        media="(max-width: 639px)"
                        srcSet={slide.mobileImg}
                      />
                    )}
                    {/* Desktop WebP format */}
                    {slide.imgWebp && (
                      <source
                        media="(min-width: 640px)"
                        type="image/webp"
                        srcSet={slide.imgWebp}
                      />
                    )}
                    {/* Desktop standard image fallback */}
                    <source
                      media="(min-width: 640px)"
                      srcSet={slide.img}
                    />
                    <img
                      className="w-full h-full object-cover object-center"
                      src={slide.img}
                      alt={slide.alt}
                      loading={idx === 0 ? 'eager' : 'lazy'}
                    />
                  </picture>
                  {/* Subtle edge vignette for smooth transition */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none" />
                </Link>
              ) : (
                /* Dynamic Component Slide (HTML/CSS Typography + Background Image) */
                <div className="relative w-full h-full">
                  <img
                    className="w-full h-full object-cover object-[75%_center] md:object-center brightness-90"
                    src={slide.img}
                    alt={slide.alt}
                    loading={idx === 0 ? 'eager' : 'lazy'}
                  />

                  {/* Gradient & Walkaroo-inspired Typography Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t sm:bg-gradient-to-r from-black/85 via-black/45 to-transparent flex flex-col justify-end sm:justify-center px-6 sm:px-10 md:px-16 lg:px-24 pb-12 sm:pb-0 text-white z-10">
                    <div className="max-w-xl">
                      {/* Cursive / Script Accent Line */}
                      {slide.scriptText && (
                        <div className="font-['Alex_Brush',cursive] text-2xl sm:text-3xl md:text-5xl lg:text-6xl text-white/95 leading-none tracking-normal drop-shadow-md mb-1 md:mb-2">
                          {slide.scriptText}
                        </div>
                      )}

                      {/* Bold Condensed Title */}
                      <h2 className="font-anton text-2xl sm:text-4xl md:text-5xl lg:text-6xl uppercase leading-[0.98] tracking-wide text-white drop-shadow-lg mb-1 md:mb-2 whitespace-pre-line">
                        {slide.title}
                      </h2>

                      {/* Uppercase Letter-spaced Subtitle */}
                      {slide.subtitle && (
                        <p className="font-semibold text-[10px] sm:text-xs md:text-sm lg:text-base tracking-[0.22em] uppercase text-white/90 drop-shadow-sm mb-3 md:mb-5">
                          {slide.subtitle}
                        </p>
                      )}

                      {/* Solid Red Rectangular Button */}
                      <Link
                        to={slide.to}
                        className="inline-block bg-[#E31E24] hover:bg-[#C2161B] text-white px-5 py-2 sm:px-7 sm:py-2.5 md:px-8 md:py-3 font-bold uppercase tracking-wider text-[11px] sm:text-xs md:text-sm rounded-none shadow-md transition-all duration-200 hover:shadow-lg active:scale-95"
                      >
                        {slide.ctaText || 'SHOP NOW'}
                      </Link>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Navigation Arrows (Visible on sm+ screens, swipe on mobile) */}
        <button
          onClick={prevSlide}
          aria-label="Previous Slide"
          className="hidden sm:flex absolute left-2 sm:left-4 md:left-6 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-black/35 hover:bg-black/70 text-white backdrop-blur-xs items-center justify-center transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer z-20 opacity-80 hover:opacity-100"
        >
          <Icon name="chevron_left" className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>
        <button
          onClick={nextSlide}
          aria-label="Next Slide"
          className="hidden sm:flex absolute right-2 sm:right-4 md:right-6 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-black/35 hover:bg-black/70 text-white backdrop-blur-xs items-center justify-center transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer z-20 opacity-80 hover:opacity-100"
        >
          <Icon name="chevron_right" className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>

        {/* Slide Indicators (Centered Minimalist Dots) */}
        <div className="absolute bottom-3 md:bottom-5 left-1/2 -translate-x-1/2 flex items-center gap-2 z-20">
          {HERO_SLIDES.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              aria-label={`Go to slide ${idx + 1}`}
              className={`transition-all duration-300 rounded-full cursor-pointer ${
                currentSlide === idx
                  ? 'w-6 md:w-8 h-2 bg-white shadow-sm'
                  : 'w-2 h-2 bg-white/50 hover:bg-white/80'
              }`}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
