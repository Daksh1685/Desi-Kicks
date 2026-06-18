import React from 'react'
import { Navbar } from '../components/Navbar'

export function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Welcome to Desi Kicks</h1>
        <p className="text-gray-600">The best sneakers in town.</p>
      </main>
    </div>
  )
}
