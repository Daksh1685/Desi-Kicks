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
    slug: 'men',
    name: 'Men',
    headline: "Men's Retro Casuals & Street Sneakers",
    description:
      'Handcrafted retro timeless low-tops, vintage gum sole sneakers, and everyday street casuals engineered with high-density memory foam.',
    seoTitle: "Men's Sneakers, Casuals & Street Footwear | CraftYourSole",
    seoDescription:
      "Explore CraftYourSole men's footwear: handcrafted retro timeless sneakers, vintage street low-tops, and daily casuals with COD & free pan-India delivery.",
    countLabel: '210+ Planned Styles',
    img: '/hero/category-men.webp',
    categoryKeywords: ['men', 'retro', 'sneaker', 'casual', 'street', 'timeless', 'heritage', 'loafer', 'formal', 'chappal'],
    roadmapNote:
      'Size-by-size filtering, vintage patina previews, and bespoke width selectors for men are currently under development.',
  },
  {
    slug: 'women',
    name: 'Women',
    headline: "Women's Collection in Bloom — Pastels & Slides",
    description:
      'Contoured botanical cork slides, pastel retro sneakers, and cushioned block heels crafted for all-day comfort and elegance.',
    seoTitle: "Women's Sneakers, Slides & Block Heels | CraftYourSole",
    seoDescription:
      "Shop CraftYourSole women's collection: floral botanical cork slides, pastel retro sneakers, and comfortable block heels designed for all-day wear.",
    countLabel: '185+ Planned Styles',
    img: '/hero/category-women.webp',
    categoryKeywords: ['women', 'bloom', 'flora', 'slide', 'pastel', 'sneaker', 'heel', 'cork', 'botanical', 'sandal', 'daily', 'festive'],
    roadmapNote:
      'New women-exclusive pastel colorways, floral botanical slides, and wide-fit comfort wedges are currently in active development.',
  },
  {
    slug: 'kids',
    name: 'Kids',
    headline: "Playful Kids' Sneaker Collection",
    description:
      'Lightweight, shock-absorbing easy-strap sneakers designed with flexible soles and non-stop playground durability.',
    seoTitle: "Kids' Easy-Strap Sneakers & Playful Shoes | CraftYourSole",
    seoDescription:
      "Explore CraftYourSole kids' footwear: featherlight easy-strap sneakers, shock-absorbing playground shoes, and playful active designs for boys and girls.",
    countLabel: '60+ Planned Styles',
    img: '/hero/category-kids.webp',
    categoryKeywords: ['kid', 'playful', 'sneaker', 'strap', 'playground', 'boy', 'girl', 'junior', 'youth', 'child'],
    roadmapNote:
      'Growing-feet sizing guidance and high-durability school & sports collections are currently under development.',
  },
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

