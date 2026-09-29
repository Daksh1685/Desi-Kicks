import { MobileSearch } from '../components/MobileSearch';
import { Recommendations } from '../components/Recommendations';
import { Hero } from '../components/Hero';
import { TrustBadges } from '../components/TrustBadges';
import { Categories } from '../components/Categories';
import { PromoBanner } from '../components/PromoBanner';
import { NewArrivals } from '../components/NewArrivals';

export function LandingPage() {
  return (
    <div>
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


