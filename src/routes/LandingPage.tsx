import React from 'react'
import { Navbar } from '../components/Navbar'
import { MobileSearch } from '../components/MobileSearch'
import { Recommendations } from '../components/Recommendations'
import { Hero } from '../components/Hero'

export function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <MobileSearch />
      <main>
        <Hero />
        <Recommendations />
      </main>
    </div>
  )
}

