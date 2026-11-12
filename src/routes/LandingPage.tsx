import { MobileSearch } from '../components/MobileSearch';
import { Recommendations } from '../components/Recommendations';
import { Hero } from '../components/Hero';
import { TrustBadges } from '../components/TrustBadges';
import { Categories } from '../components/Categories';
import { PromoBanner } from '../components/PromoBanner';
import { NewArrivals } from '../components/NewArrivals';
import { SeoHead } from '../components/SeoHead';

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
        <TrustBadges />
        <Recommendations />
        <Categories />
        <PromoBanner />
        <NewArrivals />
      </main>
    </div>
  );
}
