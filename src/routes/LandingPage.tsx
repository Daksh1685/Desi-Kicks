import { MobileSearch } from '../components/MobileSearch';
import { Hero } from '../components/Hero';
import { GenderSelection } from '../components/GenderSelection';
import { BestSellers } from '../components/BestSellers';
import { WomensCollection } from '../components/WomensCollection';
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
        <GenderSelection />
        <BestSellers />
        <WomensCollection />
      </main>
    </div>
  );
}
