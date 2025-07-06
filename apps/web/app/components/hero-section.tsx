'use client'

import React from 'react'
import { Plane, Sparkles, Globe } from 'lucide-react'

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-indigo-700 to-purple-800">
      <div className="absolute inset-0 bg-black/20"></div>
      <div className="relative container mx-auto px-4 py-24 text-center text-white">
        <div className="flex justify-center mb-8">
          <div className="p-4 bg-white/10 backdrop-blur-sm rounded-full">
            <Plane className="w-16 h-16" />
          </div>
        </div>
        
        <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
          SkyScout AI
        </h1>
        
        <p className="text-xl md:text-2xl mb-8 text-blue-100 max-w-3xl mx-auto">
          Your intelligent flight discovery engine powered by AI—find the best deals, 
          predict prices, and explore destinations like never before.
        </p>
        
        <div className="flex flex-wrap justify-center gap-8 mt-12">
          <div className="flex items-center gap-3 text-blue-100">
            <Sparkles className="w-6 h-6" />
            <span className="text-lg">AI-Powered Predictions</span>
          </div>
          <div className="flex items-center gap-3 text-blue-100">
            <Globe className="w-6 h-6" />
            <span className="text-lg">Global Coverage</span>
          </div>
          <div className="flex items-center gap-3 text-blue-100">
            <Plane className="w-6 h-6" />
            <span className="text-lg">Real-time Deals</span>
          </div>
        </div>
      </div>
    </section>
  )
}
