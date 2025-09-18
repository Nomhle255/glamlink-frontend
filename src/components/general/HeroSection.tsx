import React from 'react'
import HeroBackground from "../assets/bg.png"; 
import Link from "next/link"
import Image from "next/image"

export default function HeroSection() {
  return (
    <div>
       {/* Hero Section */}
      <section className="flex-1 relative flex items-center justify-center text-center px-6 py-24">
        {/* Hero Image */}
        <Image
        width={500}
        height={500}
         src="/assets/Bg.png"
          alt="GlamLink Hero"
          className="absolute inset-0 w-full h-full object-cover"
        />

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/30 to-black/60"></div>

        {/* Text container */}
        <div className="relative z-10 max-w-3xl bg-black/40 rounded-lg p-8">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            GlamLink connects <br />
            <span className="text-pink-400">beauty service providers to customers effortlessly</span>
          </h1>

          <h2 className="text-lg md:text-xl text-white mb-8">
            From Spas, Salons, and many other beauty services, we cater for all. 
            Our WhatsApp-based booking tool streamlines appointments and payments for all types of beauty services, 
            allowing customers to view and choose from multiple providers in their area.
          </h2>

          <div className="flex gap-4 justify-center flex-wrap">
            <Link
              href="/login"
              className="bg-pink-600 text-white px-6 py-3 rounded-lg hover:bg-pink-700 shadow"
            >
              Get Started
            </Link>
            <a
              href="#features"
              className="bg-gray-200 text-gray-800 px-6 py-3 rounded-lg hover:bg-gray-300"
            >
              Learn More
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}
