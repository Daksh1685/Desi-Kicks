import React, { useState, useEffect, useRef } from 'react';
import { Icon } from './ui/Icon';

interface MenCollectionShowcaseProps {
  selectedSubcategory: string;
  onSelectSubcategory: (subcategory: string) => void;
}

interface BannerSlide {
  id: string;
  img: string;
  alt: string;
  headline?: string;
  subheading?: string;
  targetSubcategory?: string;
}

const MEN_HERO_SLIDES: BannerSlide[] = [
  {
    id: 'premium-picks',
    img: '/hero/walkaroo-men-premium-banner.jpg',
    alt: "Premium Picks for Every Step - Men's Handcrafted Footwear Collection",
    targetSubcategory: 'All',
  },
  {
    id: 'comfort-crafted',
    img: '/hero/walkaroo-men-comfort-banner.jpg',
    alt: "Comfort Crafted for Every Step - Men's Sandal & Slide Collection",
    targetSubcategory: 'Comfort Chappals & Sandals',
  },
];

interface CuratedMenCategory {
  id: string;
  title: string;
  img: string;
  subcategory: string;
  alt: string;
}

const CURATED_MEN_CATEGORIES: CuratedMenCategory[] = [
  {
    id: 'casual-wear',
    title: "Men's Casual Wear",
    img: '/hero/men-cat-casual.jpg',
    subcategory: 'Loafers & Slip-Ons',
    alt: "Men's Casual Wear Footwear & Everyday Loafers",
  },
  {
    id: 'rain-ready',
    title: 'Rain Ready',
    img: '/hero/men-cat-rain.jpg',
    subcategory: 'Comfort Chappals & Sandals',
    alt: 'Rain Ready All-Weather Water-Resistant Clogs & Sandals',
  },
  {
    id: 'mens-slides',
    title: "Men's Slides",
    img: '/hero/men-cat-slides.jpg',
    subcategory: 'Comfort Chappals & Sandals',
    alt: "Men's Contoured Orthopedic Arch Slides & Slippers",
  },
  {
    id: 'sports-shoes',
    title: "Men's Sports Shoes",
    img: '/hero/men-cat-sports.jpg',
    subcategory: 'Casual Sneakers',
    alt: "Men's High-Rebound Sports Shoes & Running Trainers",
  },
  {
    id: 'heritage-formal',
    title: 'Heritage & Formals',
    img: '/hero/category-men.webp',
    subcategory: 'Formal Oxfords & Derbies',
    alt: "Men's Heritage Burnished Leather Formal Shoes",
  },
];

export function MenCollectionShowcase({
  selectedSubcategory,
  onSelectSubcategory,
}: MenCollectionShowcaseProps) {
  // Hero Banner Slide State
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  // Category Carousel Ref
  const categoriesScrollRef = useRef<HTMLDivElement>(null);

  // Auto-advance banner slides
  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % MEN_HERO_SLIDES.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [isPaused]);

  const handleNextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % MEN_HERO_SLIDES.length);
  };

  const handlePrevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + MEN_HERO_SLIDES.length) % MEN_HERO_SLIDES.length);
  };

  // Touch swipe support for banner
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (touchStartX.current !== null && touchEndX.current !== null) {
      const diff = touchStartX.current - touchEndX.current;
      if (diff > 50) {
        handleNextSlide();
      } else if (diff < -50) {
        handlePrevSlide();
      }
    }
    touchStartX.current = null;
    touchEndX.current = null;
  };

  // Category horizontal scroll buttons
  const scrollCategories = (direction: 'left' | 'right') => {
    if (categoriesScrollRef.current) {
      const scrollAmount = direction === 'left' ? -320 : 320;
      categoriesScrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const handleCategoryClick = (subcategory: string) => {
    if (selectedSubcategory.toLowerCase() === subcategory.toLowerCase()) {
      onSelectSubcategory('All');
    } else {
      onSelectSubcategory(subcategory);
    }
    const gridElem = document.getElementById('men-products-grid');
    if (gridElem) {
      gridElem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="w-full space-y-8 sm:space-y-12">
      {/* 1. Curated Men's Hero Banner Carousel (Matching Reference Design) */}
      <section
        aria-label="Men's Footwear Featured Showcase"
        className="w-full relative"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        <div
          className="w-full aspect-[16/7] sm:aspect-[21/9] md:aspect-[2.4/1] rounded-2xl sm:rounded-3xl md:rounded-[32px] overflow-hidden shadow-xs border border-neutral-200/80 relative bg-neutral-100 select-none"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {MEN_HERO_SLIDES.map((slide, idx) => (
            <div
              key={slide.id}
              className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                idx === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
              }`}
            >
              <img
                src={slide.img}
                alt={slide.alt}
                className="w-full h-full object-cover object-center"
                loading={idx === 0 ? 'eager' : 'lazy'}
              />
            </div>
          ))}

          {/* Left / Right Carousel Controls */}
          {MEN_HERO_SLIDES.length > 1 && (
            <>
              <button
                onClick={handlePrevSlide}
                aria-label="Previous Slide"
                className="absolute left-3 sm:left-5 top-1/2 -translate-y-1/2 z-20 w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-white/80 hover:bg-white text-gray-800 shadow-md backdrop-blur-xs flex items-center justify-center transition-all duration-200 cursor-pointer active:scale-95 border border-white/60"
              >
                <Icon name="chevron_left" className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
              <button
                onClick={handleNextSlide}
                aria-label="Next Slide"
                className="absolute right-3 sm:right-5 top-1/2 -translate-y-1/2 z-20 w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-white/80 hover:bg-white text-gray-800 shadow-md backdrop-blur-xs flex items-center justify-center transition-all duration-200 cursor-pointer active:scale-95 border border-white/60"
              >
                <Icon name="chevron_right" className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>

              {/* Indicator Dots */}
              <div className="absolute bottom-3 sm:bottom-5 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2 bg-black/20 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/20">
                {MEN_HERO_SLIDES.map((slide, idx) => (
                  <button
                    key={slide.id}
                    onClick={() => setCurrentSlide(idx)}
                    aria-label={`Jump to slide ${idx + 1}`}
                    className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                      idx === currentSlide ? 'w-6 bg-white' : 'w-2 bg-white/50 hover:bg-white/80'
                    }`}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </section>

      {/* 2. "Footwear for Men" Curated Categories Shelf (Matching Reference Design) */}
      <section aria-label="Footwear for Men" className="space-y-4 sm:space-y-6">
        {/* Header with Title, Description, and Circular Nav Buttons */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 tracking-tight">
              Footwear for Men
            </h1>
            <p className="text-gray-600 text-xs sm:text-sm mt-1.5 leading-relaxed">
              Comfortable footwear for men: sandals, slippers, clogs and more. Looking for closed styles?{' '}
              <button
                onClick={() => handleCategoryClick('Casual Sneakers')}
                className="text-gray-900 font-semibold underline underline-offset-2 hover:text-primary transition-colors cursor-pointer"
              >
                Shop Shoes for Men
              </button>
              .
            </p>
          </div>

          {/* Carousel Scroll Controls */}
          <div className="flex items-center gap-2 self-end md:self-auto shrink-0">
            <button
              onClick={() => scrollCategories('left')}
              aria-label="Previous Category"
              className="w-10 h-10 rounded-full border border-gray-300 hover:border-gray-900 text-gray-600 hover:text-gray-900 flex items-center justify-center transition-all duration-200 cursor-pointer active:scale-95 bg-white shadow-2xs"
            >
              <Icon name="chevron_left" className="w-5 h-5" />
            </button>
            <button
              onClick={() => scrollCategories('right')}
              aria-label="Next Category"
              className="w-10 h-10 rounded-full border border-gray-300 hover:border-gray-900 text-gray-600 hover:text-gray-900 flex items-center justify-center transition-all duration-200 cursor-pointer active:scale-95 bg-white shadow-2xs"
            >
              <Icon name="chevron_right" className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Horizontal Category Cards Snap Carousel */}
        <div
          ref={categoriesScrollRef}
          className="flex items-center gap-4 sm:gap-6 overflow-x-auto pb-4 scroll-smooth scrollbar-none snap-x snap-mandatory"
        >
          {CURATED_MEN_CATEGORIES.map((cat) => {
            const isSelected = selectedSubcategory.toLowerCase() === cat.subcategory.toLowerCase();
            return (
              <div
                key={cat.id}
                onClick={() => handleCategoryClick(cat.subcategory)}
                className="snap-start shrink-0 w-[220px] sm:w-[260px] md:w-[280px] group cursor-pointer"
              >
                {/* Poster Card Container */}
                <div
                  className={`w-full aspect-[4/5] rounded-2xl md:rounded-3xl overflow-hidden shadow-xs group-hover:shadow-xl transition-all duration-500 group-hover:-translate-y-1 bg-neutral-100 border ${
                    isSelected
                      ? 'border-primary ring-2 ring-primary/40 shadow-md'
                      : 'border-neutral-200/80 group-hover:border-neutral-400'
                  }`}
                >
                  <img
                    src={cat.img}
                    alt={cat.alt}
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                    loading="lazy"
                  />
                </div>

                {/* Card Title & Arrow at Bottom */}
                <div className="mt-3 flex items-center justify-between px-1">
                  <span
                    className={`text-sm sm:text-base font-bold transition-colors ${
                      isSelected ? 'text-primary' : 'text-gray-900 group-hover:text-primary'
                    }`}
                  >
                    {cat.title}
                  </span>
                  <span
                    className={`text-base font-bold transition-transform duration-300 group-hover:translate-x-1 ${
                      isSelected ? 'text-primary' : 'text-gray-900 group-hover:text-primary'
                    }`}
                  >
                    →
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
