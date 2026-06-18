import { Icon } from './ui/Icon';

export interface ProductCardProps {
  name: string;
  rating: number;
  price: string;
  img: string;
}

export function ProductCard({ name, rating, price, img }: ProductCardProps) {
  return (
    <div className="min-w-[220px] md:min-w-[240px] bg-white p-4 rounded-2xl border border-gray-200 flex flex-col snap-start shadow-sm hover:shadow-md transition-shadow cursor-pointer">
      <div className="aspect-[4/3] bg-gray-100 rounded-xl mb-4 overflow-hidden flex items-center justify-center p-2">
        <img className="w-full h-full object-cover rounded-lg mix-blend-multiply" src={img} alt={name} />
      </div>
      <h4 className="text-lg font-medium text-gray-900 truncate mb-1">{name}</h4>
      <div className="flex items-center gap-1 mb-2">
        <Icon name="star" className="w-4 h-4 text-primary" filled />
        <span className="text-sm font-bold text-gray-900">{rating}</span>
      </div>
      <span className="text-lg font-bold text-gray-900">{price}</span>
    </div>
  );
}
