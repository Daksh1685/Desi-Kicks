import { MobileSearch } from '../components/MobileSearch';
import { Recommendations } from '../components/Recommendations';
import { Hero } from '../components/Hero';
import { GenderSelection } from '../components/GenderSelection';
import { BestSellers } from '../components/BestSellers';
import { TrustBadges } from '../components/TrustBadges';
import { Categories } from '../components/Categories';
import { PromoBanner } from '../components/PromoBanner';
import { NewArrivals } from '../components/NewArrivals';
import { SeoHead } from '../components/SeoHead';
import { useProductCatalog } from '../context/ProductContext';

function StoreLaunchTeaser() {
  const { activeProducts } = useProductCatalog();
  if (activeProducts.length > 0) return null;
  return (
    <div className="mx-4 sm:mx-6 lg:mx-8 my-4 max-w-7xl lg:mx-auto">
      <div className="bg-gray-900 border border-primary/40 rounded-2xl px-5 py-4 flex items-center gap-3 animate-pulse-border">
        <span className="text-xl">🎉</span>
        <p className="text-white text-sm font-medium">
          <span className="font-bold text-primary">Store launching soon</span> — Add products from the Admin panel to go live!
        </p>
      </div>
    </div>
  );
}

export function LandingPage() {
  return (
    <div>
      <SeoHead
        title="CraftYourSole | Handcrafted Indian Footwear — Juttis, Loafers, Heels & Sneakers"
        description="Shop CraftYourSole for handcrafted Indian footwear — festive juttis & mojaris, leather loafers, women's block heels, daily comfort slip-ons, and athletic runners with pan-India delivery."
        canonicalPath="/"
      />
      <MobileSearch />
      <main>
        <Hero />
        <GenderSelection />
        <BestSellers />
        <TrustBadges />
        <StoreLaunchTeaser />
        <Recommendations />
        <Categories />
        <PromoBanner />
        <NewArrivals />
      </main>
    </div>
  );
}
