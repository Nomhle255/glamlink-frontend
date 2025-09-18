import AboutSection from '@/components/general/AboutUs'
import FAQSection from '@/components/general/AskedQuestions'
import FeaturesSection from '@/components/general/FeaturesSection'
import HeroSection from '@/components/general/HeroSection'
import React from 'react'

export default function page() {
  return (
    <div>
      <HeroSection />
      <AboutSection />
      <FeaturesSection />
      <FAQSection />
    </div>
  )
}
