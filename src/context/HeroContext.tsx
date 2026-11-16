/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';

export interface HeroSlide {
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
  isActive?: boolean;
}

export const DEFAULT_HERO_SLIDES: HeroSlide[] = [
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
    isActive: true,
  },
  {
    id: 'nature-step',
    isFullBanner: true,
    scriptText: "The Women's Collection",
    title: 'NATURE IN EVERY STEP',
    subtitle: 'HANDCRAFTED FLORALS & ORTHOPEDIC COMFORT.',
    ctaText: "SHOP WOMEN'S",
    to: '/collections/women',
    img: '/hero/women-nature-landscape.jpg',
    imgWebp: '/hero/women-nature-landscape.webp',
    mobileImg: '/hero/women-nature-portrait.jpg',
    mobileImgWebp: '/hero/women-nature-portrait.webp',
    alt: "Nature in Every Step - Handcrafted Women's Footwear",
    isActive: true,
  },
  {
    id: 'heritage-street',
    isFullBanner: true,
    scriptText: 'Artisan Made in India',
    title: 'HERITAGE STREET SNEAKERS',
    subtitle: 'VINTAGE SILHOUETTES. MODERN MEMORY FOAM.',
    ctaText: 'EXPLORE ALL DROPS',
    to: '/collections',
    img: '/hero/retro-timeless-sports.jpg',
    mobileImg: '/products/retro-porsche-sneaker.jpg',
    alt: 'Heritage Street Sneakers - Vintage Silhouettes Modern Memory Foam',
    isActive: true,
  },
];

const STORAGE_KEY = 'craftyoursole_hero_slides_v1';

interface HeroContextType {
  slides: HeroSlide[];
  activeSlides: HeroSlide[];
  addSlide: (input: Omit<HeroSlide, 'id'>) => HeroSlide;
  updateSlide: (id: string, updates: Partial<HeroSlide>) => void;
  deleteSlide: (id: string) => void;
  moveSlide: (index: number, direction: 'up' | 'down') => void;
  toggleSlideActive: (id: string) => void;
  resetToDefaultSlides: () => void;
}

const HeroContext = createContext<HeroContextType | undefined>(undefined);

export function HeroProvider({ children }: { children: React.ReactNode }) {
  const [slides, setSlides] = useState<HeroSlide[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn('Failed to load hero slides from localStorage', e);
    }
    return DEFAULT_HERO_SLIDES;
  });

  // Persist to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(slides));
    } catch (e) {
      console.warn('Failed to save hero slides to localStorage', e);
    }
  }, [slides]);

  // Active slides only for storefront
  const activeSlides = useMemo(() => {
    const list = slides.filter((s) => s.isActive !== false);
    return list.length > 0 ? list : DEFAULT_HERO_SLIDES.slice(0, 1);
  }, [slides]);

  const addSlide = useCallback((input: Omit<HeroSlide, 'id'>): HeroSlide => {
    const newSlide: HeroSlide = {
      ...input,
      id: `hero-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      isActive: input.isActive ?? true,
    };
    setSlides((prev) => [...prev, newSlide]);
    return newSlide;
  }, []);

  const updateSlide = useCallback((id: string, updates: Partial<HeroSlide>) => {
    setSlides((prev) =>
      prev.map((s) => (s.id === id ? { ...s, ...updates } : s))
    );
  }, []);

  const deleteSlide = useCallback((id: string) => {
    setSlides((prev) => {
      const filtered = prev.filter((s) => s.id !== id);
      return filtered.length > 0 ? filtered : DEFAULT_HERO_SLIDES.slice(0, 1);
    });
  }, []);

  const moveSlide = useCallback((index: number, direction: 'up' | 'down') => {
    setSlides((prev) => {
      const targetIndex = direction === 'up' ? index - 1 : index + 1;
      if (targetIndex < 0 || targetIndex >= prev.length) return prev;
      const copy = [...prev];
      const [moved] = copy.splice(index, 1);
      copy.splice(targetIndex, 0, moved);
      return copy;
    });
  }, []);

  const toggleSlideActive = useCallback((id: string) => {
    setSlides((prev) =>
      prev.map((s) => (s.id === id ? { ...s, isActive: !s.isActive } : s))
    );
  }, []);

  const resetToDefaultSlides = useCallback(() => {
    setSlides(DEFAULT_HERO_SLIDES);
  }, []);

  const value = useMemo(
    () => ({
      slides,
      activeSlides,
      addSlide,
      updateSlide,
      deleteSlide,
      moveSlide,
      toggleSlideActive,
      resetToDefaultSlides,
    }),
    [
      slides,
      activeSlides,
      addSlide,
      updateSlide,
      deleteSlide,
      moveSlide,
      toggleSlideActive,
      resetToDefaultSlides,
    ]
  );

  return <HeroContext.Provider value={value}>{children}</HeroContext.Provider>;
}

export function useHero() {
  const context = useContext(HeroContext);
  if (!context) {
    throw new Error('useHero must be used within a HeroProvider');
  }
  return context;
}
