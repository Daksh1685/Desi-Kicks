import { Navbar } from '../components/Navbar'
import { MobileSearch } from '../components/MobileSearch'
import { Recommendations } from '../components/Recommendations'
import { Hero } from '../components/Hero'
import { Categories } from '../components/Categories'
import { PromoBanner } from '../components/PromoBanner'
import { NewArrivals } from '../components/NewArrivals'
import { BottomNav } from '../components/BottomNav'
import { Footer } from '../components/Footer'

export function LandingPage() {
  return (
    <div className="min-h-screen bg-white pb-16 md:pb-0">
      <Navbar />
      <MobileSearch />
      <main>
        <Hero />
        <Recommendations />
        <Categories />
        <PromoBanner />
        <NewArrivals />
      </main>
      <BottomNav />
      <Footer />
    </div>
  )
}
