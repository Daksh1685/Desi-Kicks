export interface FooterLink {
  label: string;
  path: string;
}

export interface FooterPerk {
  icon: string;
  text: string;
}

export interface FooterSocialLinks {
  instagram: string;
  facebook: string;
  x: string;
  youtube: string;
}

export interface FooterContent {
  brandDescription: string;
  perks: FooterPerk[];
  socialLinks: FooterSocialLinks;
  collectionsHeading: string;
  collectionsLinks: FooterLink[];
  supportHeading: string;
  supportLinks: FooterLink[];
  supportEmail: string;
  supportHours: string;
  newsletterHeading: string;
  newsletterSubtitle: string;
  newsletterButtonText: string;
  paymentBadges: string[];
  copyrightText: string;
  legalLinks: FooterLink[];
}

export const DEFAULT_FOOTER_CONTENT: FooterContent = {
  brandDescription:
    "India's handcrafted footwear destination. Celebrating every walk of life — from wedding festivities and formal elegance to everyday orthopedic comfort and street style.",
  perks: [
    { icon: '🇮🇳', text: 'Pan-India Shipping across 28,000+ Pin Codes' },
    { icon: 'dot', text: '100% Handcrafted • 36-Hour Size Exchange' },
  ],
  socialLinks: {
    instagram: 'https://instagram.com',
    facebook: 'https://facebook.com',
    x: 'https://x.com',
    youtube: 'https://youtube.com',
  },
  collectionsHeading: 'Footwear Collections',
  collectionsLinks: [
    { label: "Men's Collection — Retro Casuals", path: '/collections/men' },
    { label: "Women's Collection in Bloom", path: '/collections/women' },
    { label: "Kids' Playful Sneaker Collection", path: '/collections/kids' },
    { label: 'Best Sellers Showcase', path: '/#best-sellers' },
    { label: 'Festive Juttis & Mojaris', path: '/collections/festive-ethnic' },
    { label: 'Daily Comfort & Ortho Slides', path: '/collections/daily-comfort' },
  ],
  supportHeading: 'Customer Support',
  supportLinks: [
    { label: 'Track Your Order', path: '/track-order' },
    { label: 'Shipping & Dispatch Policy', path: '/shipping-policy' },
    { label: '36-Hour Doorstep Size Exchange', path: '/returns-exchange' },
    { label: 'Indian & UK Size Guide', path: '/size-guide' },
    { label: 'Authenticity Verification', path: '/authenticity' },
    { label: 'Our Story & Craftsmanship', path: '/about' },
    { label: 'Contact Us & Help Desk', path: '/contact' },
  ],
  supportEmail: 'care@craftyoursole.in',
  supportHours: 'Mon – Sat: 9:30 AM – 6:30 PM IST',
  newsletterHeading: 'Stay In The Loop',
  newsletterSubtitle:
    'Be the first to hear about secret festival drops, handcrafted restocks, and exclusive member discounts.',
  newsletterButtonText: 'Join',
  paymentBadges: ['UPI', 'RuPay', 'Cards', 'NetBanking', 'COD Available'],
  copyrightText: 'Handcrafted Indian Footwear Culture. All rights reserved.',
  legalLinks: [
    { label: 'Privacy Policy', path: '/privacy-policy' },
    { label: 'Terms of Service', path: '/terms' },
    { label: 'Sitemap', path: '/sitemap.xml' },
  ],
};
