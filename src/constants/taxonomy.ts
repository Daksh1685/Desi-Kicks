export interface CategoryTaxonomy {
  id: string;
  name: string;
  slug: string;
  targetGender: 'Men' | 'Women' | 'Kids' | 'Unisex';
  subcategories: string[];
  description: string;
}

export const PRODUCT_TAXONOMY: CategoryTaxonomy[] = [
  {
    id: 'festive-ethnic',
    name: 'Festive & Ethnic',
    slug: 'festive-ethnic',
    targetGender: 'Unisex',
    subcategories: [
      'Juttis & Mojaris',
      'Kolhapuri Chappals',
      'Sherwani Shoes',
      'Embroidered Flats & Wedges',
      'Royal Velvet Slippers',
    ],
    description: 'Handcrafted Zari mojaris, royal velvet juttis, and wedding-ready ethnic footwear.',
  },
  {
    id: 'men',
    name: "Men's Footwear",
    slug: 'men',
    targetGender: 'Men',
    subcategories: [
      'Loafers & Slip-Ons',
      'Formal Oxfords & Derbies',
      'Boots & Chelsea',
      'Casual Sneakers',
      'Ethnic Mojaris',
      'Comfort Chappals & Sandals',
    ],
    description: "Men's burnished leather loafers, formal shoes, ethnic mojaris, and daily trainers.",
  },
  {
    id: 'women',
    name: "Women's Footwear",
    slug: 'women',
    targetGender: 'Women',
    subcategories: [
      'Block Heels & Wedges',
      'Embroidered Juttis',
      'Flats & Mules',
      'Comfort Slides',
      'Casual Sneakers',
    ],
    description: "Women's cushioned block heels, metallic evening sandals, and festive flats.",
  },
  {
    id: 'kids',
    name: "Kids' Footwear",
    slug: 'kids',
    targetGender: 'Kids',
    subcategories: [
      'Casual Sneakers',
      'School & Sports Shoes',
      'Comfort Sandals & Chappals',
      'Ethnic & Festive Shoes',
    ],
    description: "Lightweight, shock-absorbing sneakers and durable footwear for boys and girls.",
  },
  {
    id: 'work-formal',
    name: 'Work & Formal',
    slug: 'work-formal',
    targetGender: 'Unisex',
    subcategories: [
      'Penny & Tassel Loafers',
      'Oxford & Brogues',
      'Monk Straps',
      'Formal Slip-Ons',
    ],
    description: 'Executive burnished leather formals and comfortable office slip-ons.',
  },
  {
    id: 'daily-comfort',
    name: 'Daily & Casual',
    slug: 'daily-comfort',
    targetGender: 'Unisex',
    subcategories: [
      'AirKnit Slip-Ons',
      'Casual Sneakers',
      'Orthopedic Arch Slides',
      'Comfort Chappals',
    ],
    description: 'Breathable slip-ons and doctor-recommended arch-support slides for all-day wear.',
  },
  {
    id: 'gym-sports',
    name: 'Gym & Sports',
    slug: 'gym-sports',
    targetGender: 'Unisex',
    subcategories: [
      'Road Running Shoes',
      'Training & Gym Sneakers',
      'Walking Shoes',
    ],
    description: 'High-rebound shock absorbing trainers engineered for running and workouts.',
  },
];

export const STANDARD_UK_SIZES = ['UK 6', 'UK 7', 'UK 8', 'UK 9', 'UK 10', 'UK 11'] as const;
export const EXTENDED_UK_SIZES = ['UK 3', 'UK 4', 'UK 5', 'UK 6', 'UK 7', 'UK 8', 'UK 9', 'UK 10', 'UK 11', 'UK 12'] as const;

export const SIZES_BY_GENDER: Record<'Men' | 'Women' | 'Kids' | 'Unisex', readonly string[]> = {
  Men: ['UK 6', 'UK 7', 'UK 8', 'UK 9', 'UK 10', 'UK 11', 'UK 12'],
  Women: ['UK 3', 'UK 4', 'UK 5', 'UK 6', 'UK 7', 'UK 8'],
  Kids: ['UK 1', 'UK 2', 'UK 3', 'UK 4', 'UK 5'],
  Unisex: ['UK 4', 'UK 5', 'UK 6', 'UK 7', 'UK 8', 'UK 9', 'UK 10', 'UK 11'],
};

export const PRICE_RANGES = [
  { id: 'all', label: 'All Prices', min: 0, max: Infinity },
  { id: 'under-2000', label: 'Under ₹2,000', min: 0, max: 2000 },
  { id: '2000-3500', label: '₹2,000 – ₹3,500', min: 2000, max: 3500 },
  { id: 'above-3500', label: '₹3,500 & Above', min: 3500, max: Infinity },
] as const;

export function getAllCategories(): string[] {
  return PRODUCT_TAXONOMY.map((c) => c.name);
}

export function getSubcategoriesForCategory(categoryName: string): string[] {
  const match = PRODUCT_TAXONOMY.find(
    (c) => c.name.toLowerCase() === categoryName.toLowerCase() || c.slug === categoryName.toLowerCase()
  );
  return match ? match.subcategories : [];
}

export function getAllSubcategories(): string[] {
  const all = new Set<string>();
  PRODUCT_TAXONOMY.forEach((c) => c.subcategories.forEach((s) => all.add(s)));
  return Array.from(all);
}

