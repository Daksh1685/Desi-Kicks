export const SITE_URL = 'https://craftyoursole.in';
export const SITE_NAME = 'CraftYourSole';
export const SUPPORT_EMAIL = 'support@craftyoursole.in';
export const DEFAULT_OG_IMAGE =
  'https://images.unsplash.com/photo-1535043934128-cf0b28d52f95?q=80&w=1200&auto=format&fit=crop';

export interface CollectionMeta {
  slug: string;
  name: string;
  headline: string;
  description: string;
  seoTitle: string;
  seoDescription: string;
  countLabel: string;
  img: string;
  categoryKeywords: string[];
  roadmapNote: string;
}

export const COLLECTIONS_CONFIG: CollectionMeta[] = [
  {
    slug: 'festive-ethnic',
    name: 'Festive & Ethnic',
    headline: 'Festive Juttis & Embroidered Mojaris',
    description:
      'Handcrafted Zari mojaris, royal velvet juttis, and wedding-ready ethnic footwear built with double-padded orthopedic memory foam.',
    seoTitle: 'Festive Juttis & Embroidered Mojaris | CraftYourSole',
    seoDescription:
      'Shop handcrafted Indian festive mojaris and embroidered juttis with double-padded arch support at CraftYourSole. Pan-India delivery & 7-day size exchange.',
    countLabel: '120+ Planned Styles',
    img: 'https://images.unsplash.com/photo-1535043934128-cf0b28d52f95?q=80&w=800&auto=format&fit=crop',
    categoryKeywords: ['festive', 'ethnic', 'mojari', 'jutti'],
    roadmapNote:
      'Our Jaipur and Amritsar artisan workshops are uploading additional bridal, groom, and regional Kolhapuri SKUs. Launch signature pairs are ready to explore below.',
  },
  {
    slug: 'men',
    name: 'Men',
    headline: "Men's Heritage & Everyday Footwear",
    description:
      'Full-grain burnished leather loafers, festive sherwani mojaris, breathable daily slip-ons, and high-rebound athletic trainers.',
    seoTitle: "Men's Loafers, Mojaris & Comfort Footwear | CraftYourSole",
    seoDescription:
      "Explore CraftYourSole men's footwear: Agra burnished leather loafers, Jaipur festive mojaris, daily slip-ons, and gym runners with COD & free delivery.",
    countLabel: '210+ Planned Styles',
    img: 'https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?q=80&w=800&auto=format&fit=crop',
    categoryKeywords: ['formal', 'loafer', 'mojari', 'daily', 'gym', 'runner', 'chappal'],
    roadmapNote:
      'Size-by-size filtering, leather patina previews, and bespoke width selectors for men are currently under development.',
  },
  {
    slug: 'women',
    name: 'Women',
    headline: "Women's Heels, Festive Flats & Daily Comfort",
    description:
      'Cushioned block heels, metallic evening sandals, embroidered juttis, and featherlight everyday slip-ons crafted for Indian feet.',
    seoTitle: "Women's Block Heels, Festive Flats & Comfort Wear | CraftYourSole",
    seoDescription:
      "Shop CraftYourSole women's cushioned block heels, shimmer evening sandals, and everyday slip-ons designed for wedding celebrations and all-day wear.",
    countLabel: '185+ Planned Styles',
    img: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?q=80&w=800&auto=format&fit=crop',
    categoryKeywords: ['women', 'heel', 'sandal', 'daily', 'festive'],
    roadmapNote:
      'New women-exclusive jutti embroidery drops, kitten heels, and wide-fit ethnic wedges are currently in active development.',
  },
  {
    slug: 'daily-comfort',
    name: 'Daily Comfort',
    headline: 'Daily Comfort Slip-Ons & Ortho Slides',
    description:
      'Breathable 3D AirKnit slip-ons and doctor-recommended orthopedic comfort chappals engineered for 12+ hour commutes.',
    seoTitle: 'Daily Comfort Slip-Ons & Orthopedic Chappals | CraftYourSole',
    seoDescription:
      'Discover ultra-lightweight AirKnit slip-on loafers and orthopedic arch-support chappals for daily commuting and home comfort at CraftYourSole.',
    countLabel: '95+ Planned Styles',
    img: 'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?q=80&w=800&auto=format&fit=crop',
    categoryKeywords: ['daily', 'comfort', 'slip-on', 'chappal', 'ortho'],
    roadmapNote:
      'Monsoon-ready water-repellent slip-ons and arch-type recommendation filters are currently under development.',
  },
  {
    slug: 'gym-sports',
    name: 'Gym & Sports',
    headline: 'Gym Trainers & Road Running Shoes',
    description:
      'Dual-density shock-absorbing midsoles, carbon rubber traction pods, and seamless breathable mesh built for high-intensity training.',
    seoTitle: 'Gym Trainers & Pro Running Shoes | CraftYourSole',
    seoDescription:
      'Shop CraftYourSole athletic footwear engineered with Ortholite insoles and high-rebound shock absorption for road running and gym training.',
    countLabel: '80+ Planned Styles',
    img: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=800&auto=format&fit=crop',
    categoryKeywords: ['gym', 'sports', 'runner', 'running'],
    roadmapNote:
      'Pronation guides, marathon-mileage trackers, and upcoming trail-running editions are currently under development.',
  },
  {
    slug: 'work-formal',
    name: 'Work & Formal',
    headline: 'Handcrafted Leather Formals & Loafers',
    description:
      'Agra-crafted full-grain burnished leather penny loafers and dress shoes finished with a 72-hour manual polishing process.',
    seoTitle: "Handcrafted Leather Formal Shoes & Penny Loafers | CraftYourSole",
    seoDescription:
      'Shop Agra-handcrafted full-grain leather penny loafers and formal shoes with breathable leather sockliners at CraftYourSole.',
    countLabel: '70+ Planned Styles',
    img: 'https://images.unsplash.com/photo-1533867617858-e7b97e060509?q=80&w=800&auto=format&fit=crop',
    categoryKeywords: ['work', 'formal', 'leather', 'loafer'],
    roadmapNote:
      'Oxford, Derby, and Goodyear-welted formal silhouettes from our Agra studio are currently under development.',
  },
  {
    slug: 'sale',
    name: 'Launch Offers & Sale',
    headline: 'CraftYourSole Launch Offers & Value Picks',
    description:
      'Special launch pricing across festive mojaris, daily slip-ons, leather loafers, and athletic footwear — up to 35% off MRP.',
    seoTitle: 'Footwear Launch Offers & Value Picks | CraftYourSole',
    seoDescription:
      'Save up to 35% on handcrafted CraftYourSole launch editions including embroidered mojaris, leather loafers, block heels, and daily slip-ons.',
    countLabel: 'Limited Launch Deals',
    img: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=800&auto=format&fit=crop',
    categoryKeywords: ['festive', 'daily', 'women', 'gym', 'work', 'ortho'],
    roadmapNote:
      'Automated festival bundle builder and CraftYourSole Club member flash-drop alerts are currently under development.',
  },
];

