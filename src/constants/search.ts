export const SEARCH_KEYWORDS = [
  'festive juttis',
  'running shoes',
  'women heels',
  'leather loafers',
  'daily slip-ons',
  'kolhapuris',
  'gym sneakers',
  'formal oxfords',
  'comfort slides',
];

export interface SearchProductItem {
  name: string;
  category: string;
  price: string;
  originalPrice: string;
  rating: number;
  tag: string;
  img: string;
}

export const ALL_PRODUCTS: SearchProductItem[] = [
  {
    name: 'Royal Velvet Embroidered Mojari',
    category: 'Festive & Ethnic',
    price: '₹3,495',
    originalPrice: '₹5,495',
    rating: 4.9,
    tag: 'Festive Edit',
    img: 'https://images.unsplash.com/photo-1535043934128-cf0b28d52f95?q=80&w=600&auto=format&fit=crop',
  },
  {
    name: 'CloudKnit Daily Slip-On Loafer',
    category: 'Daily Comfort',
    price: '₹2,295',
    originalPrice: '₹3,495',
    rating: 4.7,
    tag: 'Daily Comfort',
    img: 'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?q=80&w=600&auto=format&fit=crop',
  },
  {
    name: 'Aura Metallic Block Heel Sandal',
    category: "Women's Festive",
    price: '₹2,995',
    originalPrice: '₹4,495',
    rating: 4.8,
    tag: "Women's Pick",
    img: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?q=80&w=600&auto=format&fit=crop',
  },
  {
    name: 'Vortex Flex Gym & Pro Runner',
    category: 'Gym & Sports',
    price: '₹3,995',
    originalPrice: '₹5,995',
    rating: 4.8,
    tag: 'Gym & Sports',
    img: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=600&auto=format&fit=crop',
  },
  {
    name: 'Handcrafted Heritage Penny Loafer',
    category: 'Work & Formal',
    price: '₹4,995',
    originalPrice: '₹7,495',
    rating: 4.9,
    tag: 'Formal Leather',
    img: 'https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?q=80&w=600&auto=format&fit=crop',
  },
  {
    name: 'AirSlide Ortho Comfort Chappal',
    category: 'Daily Comfort',
    price: '₹1,495',
    originalPrice: '₹2,295',
    rating: 4.6,
    tag: 'Everyday Ease',
    img: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?q=80&w=600&auto=format&fit=crop',
  },
  {
    name: 'Maharaja Velvet Zari Mojari',
    category: 'Festive Spotlight',
    price: '₹3,495',
    originalPrice: '₹5,995',
    rating: 4.9,
    tag: 'Festive Spotlight',
    img: 'https://images.unsplash.com/photo-1535043934128-cf0b28d52f95?q=80&w=800&auto=format&fit=crop',
  },
  {
    name: 'BreezeStep Knit Slip-On',
    category: 'Daily Wear',
    price: '₹2,295',
    originalPrice: '₹3,495',
    rating: 4.7,
    tag: 'Daily Wear',
    img: 'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?q=80&w=600&auto=format&fit=crop',
  },
  {
    name: 'Stella Shimmer Block Heel',
    category: "Women's Festive",
    price: '₹2,995',
    originalPrice: '₹4,495',
    rating: 4.8,
    tag: "Women's Festive",
    img: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?q=80&w=600&auto=format&fit=crop',
  },
];
