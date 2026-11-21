/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import {
  DEFAULT_FOOTER_CONTENT,
  type FooterContent,
} from '../types/footer';
import {
  getFooterContentFromSupabase,
  saveFooterContentToSupabase,
  isSupabaseConfigured,
} from '../lib/supabase';

const STORAGE_KEY = 'craftyoursole_footer_content';

interface FooterContextType {
  footerContent: FooterContent;
  updateFooterContent: (newContent: FooterContent) => Promise<boolean>;
  resetToDefaultFooterContent: () => Promise<void>;
  isSaving: boolean;
}

const FooterContext = createContext<FooterContextType | undefined>(undefined);

export function FooterProvider({ children }: { children: ReactNode }) {
  const [footerContent, setFooterContent] = useState<FooterContent>(() => {
    try {
      const cached = localStorage.getItem(STORAGE_KEY);
      if (cached) {
        return { ...DEFAULT_FOOTER_CONTENT, ...JSON.parse(cached) };
      }
    } catch {
      // ignore
    }
    return DEFAULT_FOOTER_CONTENT;
  });

  const [isSaving, setIsSaving] = useState(false);

  // Sync with Supabase on mount
  useEffect(() => {
    let mounted = true;
    if (isSupabaseConfigured) {
      getFooterContentFromSupabase()
        .then((remote) => {
          if (mounted && remote) {
            setFooterContent((prev) => ({ ...prev, ...remote }));
            try {
              localStorage.setItem(STORAGE_KEY, JSON.stringify(remote));
            } catch {
              // ignore
            }
          }
        })
        .catch((err) => {
          console.warn('[FooterContext] Hydration error:', err);
        });
    }
    return () => {
      mounted = false;
    };
  }, []);

  const updateFooterContent = async (newContent: FooterContent): Promise<boolean> => {
    setIsSaving(true);
    setFooterContent(newContent);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newContent));
      window.dispatchEvent(new Event('storage'));
    } catch {
      // ignore
    }

    let success = true;
    if (isSupabaseConfigured) {
      success = await saveFooterContentToSupabase(newContent);
    }
    setIsSaving(false);
    return success;
  };

  const resetToDefaultFooterContent = async (): Promise<void> => {
    setIsSaving(true);
    setFooterContent(DEFAULT_FOOTER_CONTENT);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_FOOTER_CONTENT));
      window.dispatchEvent(new Event('storage'));
    } catch {
      // ignore
    }

    if (isSupabaseConfigured) {
      await saveFooterContentToSupabase(DEFAULT_FOOTER_CONTENT);
    }
    setIsSaving(false);
  };

  return (
    <FooterContext.Provider
      value={{
        footerContent,
        updateFooterContent,
        resetToDefaultFooterContent,
        isSaving,
      }}
    >
      {children}
    </FooterContext.Provider>
  );
}

export function useFooter(): FooterContextType {
  const context = useContext(FooterContext);
  if (!context) {
    throw new Error('useFooter must be used within a FooterProvider');
  }
  return context;
}
