export interface ProductVariant {
  size: string;
  stock: number;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  category: string;
  tag?: string;
  price: number;
  originalPrice: number;
  rating: number;
  reviewsCount: number;
  img: string;
  additionalImages?: string[];
  description: string;
  story: string;
  upperMaterial: string;
  soleMaterial: string;
  insoleType: string;
  idealFor: string;
  artisanRegion?: string;
  sizes: string[];
  variants?: ProductVariant[];
  isActive: boolean;
  totalSold: number;
  createdAt: string;
}

export type NewProductInput = Omit<Product, 'id' | 'slug' | 'rating' | 'reviewsCount' | 'totalSold' | 'createdAt'>;

export interface ProductReview {
  id: string;
  author: string;
  city: string;
  rating: number;
  date: string;
  title: string;
  comment: string;
  fitFeedback: 'Runs Small' | 'True to Size' | 'Runs Large';
  verifiedBuyer: boolean;
  sizePurchased: string;
  helpfulCount: number;
  userImages?: string[];
}


