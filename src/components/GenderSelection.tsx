import { Link } from 'react-router-dom';

export interface GenderCategoryCard {
  id: string;
  title: string;
  to: string;
  img: string;
  imgWebp?: string;
  alt: string;
}

export const GENDER_CARDS: GenderCategoryCard[] = [
  {
    id: 'men',
    title: "Men's Collection",
    to: '/collections/men',
    img: '/hero/category-men.jpg',
    imgWebp: '/hero/category-men.webp',
    alt: "Men's Collection - Handcrafted Retro Casual Sneakers",
  },
  {
    id: 'women',
    title: "Women's Collection",
    to: '/collections/women',
    img: '/hero/category-women.jpg',
    imgWebp: '/hero/category-women.webp',
    alt: "Women's Collection - Dusty Rose Retro Casual Sneakers",
  },
  {
    id: 'kids',
    title: "Kids' Collection",
    to: '/collections/kids',
    img: '/hero/category-kids.jpg',
    imgWebp: '/hero/category-kids.webp',
    alt: "Playful Kids' Sneaker Collection",
  },
];

export function GenderSelection() {
  return (
    <section
      className="w-full max-w-[1600px] mx-auto px-2 sm:px-4 md:px-6 py-3 sm:py-5 md:py-6"
      aria-label="Shop by Category"
    >
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 sm:gap-4 md:gap-6">
        {GENDER_CARDS.map((card) => (
          <Link
            key={card.id}
            to={card.to}
            className="group relative block w-full aspect-[4/5] rounded-2xl md:rounded-3xl overflow-hidden shadow-xs hover:shadow-xl transition-all duration-500 hover:-translate-y-1 bg-neutral-100 cursor-pointer border border-neutral-200/60"
            aria-label={`Shop ${card.title}`}
          >
            <picture className="w-full h-full block">
              {card.imgWebp && (
                <source type="image/webp" srcSet={card.imgWebp} />
              )}
              <img
                src={card.img}
                alt={card.alt}
                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                loading="lazy"
              />
            </picture>

            {/* Subtle interactive hover highlight */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300 pointer-events-none" />
          </Link>
        ))}
      </div>
    </section>
  );
}
