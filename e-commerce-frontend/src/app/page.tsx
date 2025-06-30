import { HeroSection } from '@/components/sections/hero-section'
import { FeaturedProducts } from '@/components/sections/featured-products'
import { CategoryShowcase } from '@/components/sections/category-showcase'
import { TestimonialsSection } from '@/components/sections/testimonials-section'

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <main className="flex-1 overflow-x-hidden">
        <HeroSection />
        <CategoryShowcase />
        <FeaturedProducts />
        <TestimonialsSection />
      </main>
    </div>
  )
} 