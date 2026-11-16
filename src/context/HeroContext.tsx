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
    id: 'retro-casuals',
    isFullBanner: true,
    scriptText: 'Too Fresh',
    title: 'TO FOLLOW',
    subtitle: 'RETRO CASUALS',
    ctaText: 'SHOP NOW',
    to: '/collections',
    img: '/hero/retro-casuals-hero-clean.jpg',
    alt: 'Too Fresh To Follow - Retro Casuals Sneakers Collection',
    isActive: true,
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
    isActive: true,
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
    isActive: true,
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
