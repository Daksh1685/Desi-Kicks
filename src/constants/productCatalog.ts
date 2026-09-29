import type { ProductDetails } from '../context/ProductModalContext';

export const PRODUCT_CATALOG_DETAILS: Record<string, Partial<ProductDetails>> = {
  'Royal Velvet Embroidered Mojari': {
    category: 'Festive & Ethnic',
    tag: 'Festive Edit',
    rating: 4.9,
    reviewsCount: 348,
    story:
      'Handcrafted by generational mojari artisans in Jaipur using rich royal velvet and intricate gold Zari threadwork. Engineered specifically for Indian weddings and traditional celebrations with double-padded orthopedic cushioning.',
    description:
      'A masterpiece of traditional craftsmanship paired with modern foot mechanics. Designed to prevent the traditional heel-bite common in ethnic footwear, our Mojari features a softened inner lining, curved back collar, and high-density memory foam footbed.',
    upperMaterial: 'Pure Royal Velvet with Hand-Embroidered Gold Zari',
    soleMaterial: 'Buff-Tanned Leather Sole with Anti-Skid Rubber Heel Grip',
    insoleType: 'Ortho-Cushion Double Memory Foam (6mm Arch Support)',
    idealFor: 'Weddings, Sangeet Nights, Diwali, Festive Gatherings & Kurtas',
    sizes: ['UK 6', 'UK 7', 'UK 8', 'UK 9', 'UK 10', 'UK 11'],
    additionalImages: [
      'https://images.unsplash.com/photo-1535043934128-cf0b28d52f95?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=800&auto=format&fit=crop',
    ],
  },
  'CloudKnit Daily Slip-On Loafer': {
    category: 'Daily Comfort',
    tag: 'Daily Comfort',
    rating: 4.7,
    reviewsCount: 512,
    story:
      'Engineered for 12+ hour Indian daily commutes, metro walking, and casual office wear. Features our signature 3D air-permeable knit upper and featherlight rebound EVA midsole.',
    description:
      'Step into cloud-like ease with our lightweight slip-on loafer. The elasticated stretch collar hugs your foot without pressure points, while the moisture-wicking bamboo insole keeps feet fresh in Indian tropical weather.',
    upperMaterial: 'Engineered 3D Breathable AirKnit Yarn',
    soleMaterial: 'Ultra-Lightweight Molded EVA with Hexa-Flex Grooves',
    insoleType: 'Ergonomic Removable Memory Foam with Micro-Perforations',
    idealFor: 'Daily Office, College, Walking, Weekend Errands & Travel',
    sizes: ['UK 6', 'UK 7', 'UK 8', 'UK 9', 'UK 10', 'UK 11'],
    additionalImages: [
      'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1560769629-975ec94e6a86?q=80&w=800&auto=format&fit=crop',
    ],
  },
  'Aura Metallic Block Heel Sandal': {
    category: "Women's Festive & Evening",
    tag: "Women's Pick",
    rating: 4.8,
    reviewsCount: 289,
    story:
      'A glamorous 2.5-inch block heel designed for all-night comfort at cocktail parties and wedding receptions. Blends metallic sheen with anatomical foot support.',
    description:
      'No more carrying backup flats to parties. The Aura Block Heel distributes body weight evenly across the foot with an anatomical gel arch pad, while the metallic strap prevents toe friction and blisters.',
    upperMaterial: 'Shimmer Metallic Finish Vegan Leather with Soft Microfiber Lining',
    soleMaterial: 'Non-Slip Textured Resin Outsole',
    insoleType: 'Dual-Layer CloudGel Forefoot & Heel Cushioning',
    idealFor: 'Cocktails, Receptions, Evening Wear, Sarees & Lehengas',
    sizes: ['UK 4', 'UK 5', 'UK 6', 'UK 7', 'UK 8', 'UK 9'],
    additionalImages: [
      'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1535043934128-cf0b28d52f95?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1515347619252-60a4bf4fff4f?q=80&w=800&auto=format&fit=crop',
    ],
  },
  'Vortex Flex Gym & Pro Runner': {
    category: 'Gym & Sports',
    tag: 'Gym & Sports',
    rating: 4.8,
    reviewsCount: 421,
    story:
      'Built for maximum propulsion, gym conditioning, and road running. Features a dual-density midsole that absorbs 70% of ground impact shock on hard concrete.',
    description:
      'The Vortex Flex is precision-tuned for athletic movement. Reinforced heel TPU stability counter prevents ankle roll, while high-abrasion carbon rubber tread pods ensure maximum traction on wet pavements and gym rubber floors.',
    upperMaterial: 'Seamless Multi-Zone Engineered Performance Mesh',
    soleMaterial: 'High-Abrasion Carbon Rubber with Forefoot Propulsion Plate',
    insoleType: 'Ortholite High-Rebound Shock Absorption Insole',
    idealFor: 'Running, Gym Training, HIIT, Cardio & Active Workouts',
    sizes: ['UK 6', 'UK 7', 'UK 8', 'UK 9', 'UK 10', 'UK 11'],
    additionalImages: [
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1514989940723-e8e51635b782?q=80&w=800&auto=format&fit=crop',
    ],
  },
  'Handcrafted Heritage Penny Loafer': {
    category: 'Work & Formal',
    tag: 'Formal Leather',
    rating: 4.9,
    reviewsCount: 195,
    story:
      'Masterfully hand-burnished crust leather crafted in Agra, India’s footwear capital. Classic penny strap saddle silhouette with a modern lightweight dress sole.',
    description:
      'Elevate your formal suits and smart casual chinos. Each pair undergoes a 72-hour manual tanning and polishing process, creating a rich patina that grows even more beautiful over years of boardroom use.',
    upperMaterial: '100% Genuine Full-Grain Burnished Leather',
    soleMaterial: 'Durable Hand-Stitched Leather Welt with Rubber Grip Inset',
    insoleType: 'Breathable Leather Sockliner with High-Density Heel Cushion',
    idealFor: 'Boardrooms, Formal Meetings, Suits, Blazers & Semi-Formals',
    sizes: ['UK 6', 'UK 7', 'UK 8', 'UK 9', 'UK 10', 'UK 11'],
    additionalImages: [
      'https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1533867617858-e7b97e060509?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=800&auto=format&fit=crop',
    ],
  },
  'AirSlide Ortho Comfort Chappal': {
    category: 'Daily Comfort',
    tag: 'Everyday Ease',
    rating: 4.6,
    reviewsCount: 680,
    story:
      'Doctor-recommended contoured footbed designed to cradle heel arches and alleviate plant-fasciitis strain. Water-resistant and easy to wash.',
    description:
      'The ultimate comfort slipper for relaxed mornings, home lounging, and post-workout foot recovery. Features a deep heel cup and wide toe room engineered for wide Indian feet.',
    upperMaterial: 'Water-Resistant Quick-Dry Contoured Soft EVA',
    soleMaterial: 'Anti-Skid Wave-Traction Rubberized Outsole',
    insoleType: 'Anatomical Orthopedic Arch Cradle Footbed',
    idealFor: 'Home Lounging, Post-Workout Recovery, Casual Walks & Monsoons',
    sizes: ['UK 6', 'UK 7', 'UK 8', 'UK 9', 'UK 10', 'UK 11'],
    additionalImages: [
      'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?q=80&w=800&auto=format&fit=crop',
    ],
  },
  'Maharaja Velvet Zari Mojari': {
    category: 'Festive Spotlight',
    tag: 'Festive Spotlight',
    rating: 4.9,
    reviewsCount: 215,
    story:
      'Regal heritage silhouette adorned with handcrafted dabka and zari embroidery on deep velvet. Created for groom wear, royal festivals, and grand weddings.',
    description:
      'Our most luxurious festive creation. Features reinforced arch support so you can dance throughout the baraat without foot soreness. Comes with a complimentary velvet storage pouch and cedar shoe inserts.',
    upperMaterial: 'Heritage Velvet with Antique Gold Zari Embroidery',
    soleMaterial: 'Genuine Buff Leather Sole with Protective Rubber Cap',
    insoleType: 'Double-Layered Orthopedic Cushioning',
    idealFor: 'Groom Wear, Sherwanis, Kurtas, Weddings & Grand Festivities',
    sizes: ['UK 6', 'UK 7', 'UK 8', 'UK 9', 'UK 10', 'UK 11'],
    additionalImages: [
      'https://images.unsplash.com/photo-1535043934128-cf0b28d52f95?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=800&auto=format&fit=crop',
    ],
  },
  'BreezeStep Knit Slip-On': {
    category: 'Daily Wear',
    tag: 'Daily Wear',
    rating: 4.7,
    reviewsCount: 310,
    story:
      'Ultra-breathable slip-on designed for fast-paced modern urban lifestyles. Slide in with zero hands needed.',
    description:
      'Lightweight flexibility with maximum ventilation. Machine washable and designed with an adaptive knit upper that expands with your natural foot movement.',
    upperMaterial: 'Elasticated Engineered Knit Mesh',
    soleMaterial: 'Flex-Response Molded Cushion EVA',
    insoleType: 'Memory Comfort Foam Cushion',
    idealFor: 'Everyday Wear, College, Commutes & Airport Travel',
    sizes: ['UK 6', 'UK 7', 'UK 8', 'UK 9', 'UK 10', 'UK 11'],
    additionalImages: [
      'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=800&auto=format&fit=crop',
    ],
  },
  'Stella Shimmer Block Heel': {
    category: "Women's Festive",
    tag: 'Festive Glamour',
    rating: 4.8,
    reviewsCount: 184,
    story:
      'Stunning 2-inch block heel crafted with fine crystal shimmer coating. Stability meets high fashion.',
    description:
      'Engineered with an ergonomic heel angle to prevent strain on knees and lower back. Perfectly coordinates with both modern cocktail dresses and traditional lehengas.',
    upperMaterial: 'Crystalline Shimmer Fabric with Padded Microfiber Backing',
    soleMaterial: 'Slip-Resistant Textured Resin Outsole',
    insoleType: 'Plush Ball-of-Foot Gel Cushioning',
    idealFor: 'Weddings, Sangeet, Cocktail Evenings & Dinner Dates',
    sizes: ['UK 4', 'UK 5', 'UK 6', 'UK 7', 'UK 8', 'UK 9'],
    additionalImages: [
      'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1535043934128-cf0b28d52f95?q=80&w=800&auto=format&fit=crop',
    ],
  },
};

export function getEnrichedProductDetails(product: ProductDetails): ProductDetails {
  const catalogData = PRODUCT_CATALOG_DETAILS[product.name] || {};

  const cleanPrice =
    typeof product.price === 'number'
      ? product.price
      : parseInt(String(product.price).replace(/[^0-9]/g, ''), 10) || 2995;

  const cleanOriginalPrice =
    typeof product.originalPrice === 'number'
      ? product.originalPrice
      : product.originalPrice
      ? parseInt(String(product.originalPrice).replace(/[^0-9]/g, ''), 10)
      : Math.round(cleanPrice * 1.45);

  const images = [
    product.img,
    ...(catalogData.additionalImages || []),
    ...(product.additionalImages || []),
  ].filter((url, index, self) => Boolean(url) && self.indexOf(url) === index);

  return {
    ...product,
    ...catalogData,
    price: cleanPrice,
    originalPrice: cleanOriginalPrice,
    rating: catalogData.rating || product.rating || 4.8,
    reviewsCount: catalogData.reviewsCount || product.reviewsCount || 280,
    category: catalogData.category || product.category || 'All-Occasion Footwear',
    tag: catalogData.tag || product.tag || 'Popular Pick',
    story:
      catalogData.story ||
      'Handcrafted with pride in India using premium materials tailored for lasting durability and Indian weather conditions.',
    description:
      catalogData.description ||
      'Engineered with anatomical footbed cushioning and reinforced materials to deliver the ultimate combination of elegance, craftsmanship, and all-day comfort.',
    upperMaterial: catalogData.upperMaterial || 'Premium Grade Handcrafted Upper',
    soleMaterial: catalogData.soleMaterial || 'Anti-Skid Vulcanized Rubber Grip Sole',
    insoleType: catalogData.insoleType || 'High-Density Orthopedic Memory Foam Footbed',
    idealFor: catalogData.idealFor || 'All-day comfort, festive occasions & daily style',
    sizes: catalogData.sizes || ['UK 6', 'UK 7', 'UK 8', 'UK 9', 'UK 10', 'UK 11'],
    additionalImages: images,
  };
}
