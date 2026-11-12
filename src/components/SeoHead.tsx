import { useEffect } from 'react';
import { DEFAULT_OG_IMAGE, SITE_NAME, SITE_URL } from '../constants/site';

interface SeoHeadProps {
  title: string;
  description: string;
  canonicalPath?: string;
  noindex?: boolean;
  ogType?: 'website' | 'product' | 'article';
  image?: string;
  jsonLd?: Record<string, unknown> | Record<string, unknown>[];
}

function upsertMetaTag(attribute: 'name' | 'property', key: string, content: string) {
  let tag = document.head.querySelector<HTMLMetaElement>(`meta[${attribute}="${key}"]`);
  if (!tag) {
    tag = document.createElement('meta');
    tag.setAttribute(attribute, key);
    document.head.appendChild(tag);
  }
  tag.setAttribute('content', content);
}

function upsertCanonical(href: string) {
  let link = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!link) {
    link = document.createElement('link');
    link.setAttribute('rel', 'canonical');
    document.head.appendChild(link);
  }
  link.setAttribute('href', href);
}

export function SeoHead({
  title,
  description,
  canonicalPath = '/',
  noindex = false,
  ogType = 'website',
  image = DEFAULT_OG_IMAGE,
  jsonLd,
}: SeoHeadProps) {
  const normalizedPath = canonicalPath.startsWith('/') ? canonicalPath : `/${canonicalPath}`;
  const canonicalUrl = `${SITE_URL}${normalizedPath === '/' ? '/' : normalizedPath.replace(/\/+$/, '')}`;
  const serializedJsonLd = jsonLd ? JSON.stringify(jsonLd) : '';

  useEffect(() => {
    document.title = title;

    upsertMetaTag('name', 'description', description);
    upsertMetaTag(
      'name',
      'robots',
      noindex
        ? 'noindex, nofollow'
        : 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1'
    );
    upsertCanonical(canonicalUrl);

    upsertMetaTag('property', 'og:type', ogType);
    upsertMetaTag('property', 'og:site_name', SITE_NAME);
    upsertMetaTag('property', 'og:title', title);
    upsertMetaTag('property', 'og:description', description);
    upsertMetaTag('property', 'og:url', canonicalUrl);
    upsertMetaTag('property', 'og:image', image);

    upsertMetaTag('name', 'twitter:card', 'summary_large_image');
    upsertMetaTag('name', 'twitter:title', title);
    upsertMetaTag('name', 'twitter:description', description);
    upsertMetaTag('name', 'twitter:image', image);

    // Manage route-specific JSON-LD cleanly
    const existingScript = document.head.querySelector('script[data-route-ld="true"]');
    if (serializedJsonLd) {
      const script = existingScript || document.createElement('script');
      script.setAttribute('type', 'application/ld+json');
      script.setAttribute('data-route-ld', 'true');
      script.textContent = serializedJsonLd;
      if (!existingScript) {
        document.head.appendChild(script);
      }
    } else if (existingScript) {
      existingScript.remove();
    }

    return () => {
      const routeScript = document.head.querySelector('script[data-route-ld="true"]');
      if (routeScript) {
        routeScript.remove();
      }
    };
  }, [title, description, canonicalUrl, noindex, ogType, image, serializedJsonLd]);

  return null;
}

