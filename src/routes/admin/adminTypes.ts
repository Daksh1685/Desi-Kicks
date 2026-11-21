import type { ProductGender } from '../../types/product';
import type { IconName } from '../../components/ui/Icon';

export type AdminSection = 'dashboard' | 'catalog' | 'orders' | 'returns' | 'coupons' | 'banners' | 'footer';

export interface AdminNavItem {
  id: AdminSection;
  label: string;
  icon: IconName;
  path: string;
  count?: number;
}

export const inputCls =
  'w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition';

export const ALL_ADMIN_SIZES = [
  'UK 1', 'UK 2', 'UK 3', 'UK 4', 'UK 5', 'UK 6',
  'UK 7', 'UK 8', 'UK 9', 'UK 10', 'UK 11', 'UK 12',
] as const;

export const GENDER_SIZE_PRESETS: Record<ProductGender, readonly string[]> = {
  Women: ['UK 3', 'UK 4', 'UK 5', 'UK 6', 'UK 7', 'UK 8'],
  Men: ['UK 6', 'UK 7', 'UK 8', 'UK 9', 'UK 10', 'UK 11', 'UK 12'],
  Kids: ['UK 1', 'UK 2', 'UK 3', 'UK 4', 'UK 5'],
  Unisex: ['UK 4', 'UK 5', 'UK 6', 'UK 7', 'UK 8', 'UK 9', 'UK 10', 'UK 11'],
};
