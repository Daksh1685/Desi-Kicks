import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Icon } from './ui/Icon';

const HERO_SLIDES = [
  {
    tag: 'Grand Festive Edit',
    title: 'THE ROYAL DESI\nETHNIC EDITIONS',
    subtitle: 'Handcrafted Juttis, Embroidered Mojaris & Kolhapuris with double-cushioned comfort for weddings & celebrations.',
    cta: 'Shop Festive & Ethnic',
    to: '/collections/festive-ethnic',
    img: 'https://images.unsplash.com/photo-1535043934128-cf0b28d52f95?q=80&w=1400&auto=format&fit=crop',
  },
  {
    tag: 'All-Day Everyday',
    title: 'CLOUD STEPPER\nDAILY WEAR',
    subtitle: 'Featherlight slip-ons, breathable loafers, and walking chappals engineered for effortless 12+ hour daily comfort.',
    cta: 'Shop Daily Comfort',
    to: '/collections/daily-comfort',
    img: 'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?q=80&w=1400&auto=format&fit=crop',
  },
  {
    tag: 'Active Performance',
    title: 'AERO STRIDE\nPRO RUNNER',
    subtitle: 'High-rebound shock absorption and breathable mesh for gym workouts, morning walks, and sports training.',
    cta: 'Shop Gym & Sports',
    to: '/collections/gym-sports',
    img: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=1400&auto=format&fit=crop',
  },
];

export function Hero() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
  }, []);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length);
  }, []);

  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(nextSlide, 5000);
    return () => clearInterval(interval);
  }, [isPaused, nextSlide]);

  return (
    <section
      className="relative w-full aspect-[4/3] sm:aspect-[16/9] md:aspect-[25/8] overflow-hidden bg-gray-900 group"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      aria-label="Featured Releases Carousel"
    >
      {/* Slides Container */}
      <div
        className="flex h-full w-full transition-transform duration-700 ease-out"
        style={{ transform: `translateX(-${currentSlide * 100}%)` }}
      >
        {HERO_SLIDES.map((slide, idx) => (
          <div key={idx} className="min-w-full h-full relative shrink-0">
            <img
              className="w-full h-full object-cover object-[80%_center] md:object-center brightness-90"
              src={slide.img}
              alt={slide.title.replace('\n', ' ')}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent flex flex-col justify-center px-5 md:px-12 lg:px-24 text-white">
              <span className="bg-primary px-2 py-0.5 md:px-3 md:py-1 text-[9px] md:text-[11px] font-bold w-fit uppercase tracking-wider rounded-sm mb-2 shadow-sm">
                {slide.tag}
              </span>
              <h2 className="font-anton text-3xl sm:text-4xl md:text-[56px] lg:text-[64px] leading-[1.05] mb-2 md:mb-3 tracking-wide whitespace-pre-line drop-shadow-md">
                {slide.title}
              </h2>
              <p className="text-xs sm:text-sm md:text-lg max-w-[280px] sm:max-w-sm md:max-w-md mb-4 md:mb-6 text-white/90 leading-snug">
                {slide.subtitle}
              </p>
              <Link
                to={slide.to}
                className="bg-primary hover:bg-[#8A2600] active:scale-95 text-white px-5 py-2.5 md:px-8 md:py-3.5 rounded-full font-bold transition-all w-fit uppercase tracking-wider text-xs md:text-sm shadow-lg hover:shadow-primary/30 cursor-pointer"
              >
                {slide.cta}
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        aria-label="Previous Slide"
        className="absolute left-3 md:left-6 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-900 p-2 md:p-3 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all hover:scale-110 active:scale-95 cursor-pointer z-10"
      >
        <Icon name="chevron_left" className="w-5 h-5 md:w-6 md:h-6" />
      </button>
      <button
        onClick={nextSlide}
        aria-label="Next Slide"
        className="absolute right-3 md:right-6 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-900 p-2 md:p-3 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all hover:scale-110 active:scale-95 cursor-pointer z-10"
      >
        <Icon name="chevron_right" className="w-5 h-5 md:w-6 md:h-6" />
      </button>

      {/* Slide Indicators */}
      <div className="absolute bottom-3 md:bottom-5 left-1/2 -translate-x-1/2 flex items-center gap-2 z-10">
        {HERO_SLIDES.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentSlide(idx)}
            aria-label={`Go to slide ${idx + 1}`}
            className={`transition-all duration-300 rounded-full cursor-pointer ${
              currentSlide === idx
                ? 'w-7 md:w-8 h-2 bg-primary shadow-sm'
                : 'w-2 h-2 bg-white/60 hover:bg-white'
            }`}
          />
        ))}
      </div>
    </section>
  );
}
