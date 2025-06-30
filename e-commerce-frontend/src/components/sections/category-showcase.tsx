'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Smartphone, Laptop, Headphones, Camera, Watch, Gamepad2, Package, Loader2 } from 'lucide-react'
import { productService } from '@/lib/api/services'

// Icon mapping for categories
const categoryIcons: Record<string, any> = {
  electronics: Smartphone,
  computers: Laptop,
  audio: Headphones,
  photography: Camera,
  wearables: Watch,
  gaming: Gamepad2,
  default: Package,
}

// Color mapping for categories
const categoryColors: Record<string, string> = {
  electronics: 'from-blue-500 to-cyan-500',
  computers: 'from-purple-500 to-pink-500',
  audio: 'from-green-500 to-emerald-500',
  photography: 'from-orange-500 to-red-500',
  wearables: 'from-indigo-500 to-purple-500',
  gaming: 'from-yellow-500 to-orange-500',
  default: 'from-gray-500 to-slate-500',
}

// Description mapping for categories
const categoryDescriptions: Record<string, string> = {
  electronics: 'Latest gadgets and devices',
  computers: 'Laptops, desktops & accessories',
  audio: 'Headphones, speakers & more',
  photography: 'Cameras, lenses & equipment',
  wearables: 'Smartwatches & fitness trackers',
  gaming: 'Consoles, games & accessories',
  default: 'Explore amazing products',
}

interface Category {
  id: string
  name: string
  icon: any
  description: string
  image: string
  color: string
}

export function CategoryShowcase() {
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setIsLoading(true)
        setError(null)
        const categoryNames = await productService.getCategories()
        
        // Transform API categories into our format
        const transformedCategories = categoryNames.map((categoryName: string) => {
          const categoryId = categoryName.toLowerCase().replace(/\s+/g, '-')
          const IconComponent = categoryIcons[categoryId] || categoryIcons.default
          const color = categoryColors[categoryId] || categoryColors.default
          const description = categoryDescriptions[categoryId] || categoryDescriptions.default
          
          return {
            id: categoryId,
            name: categoryName,
            icon: IconComponent,
            description,
            image: `https://images.unsplash.com/photo-${getRandomImageId()}?w=400&h=300&fit=crop`,
            color,
          }
        })
        
        setCategories(transformedCategories)
      } catch (err) {
        setError('Failed to load categories')
        console.error('Error fetching categories:', err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchCategories()
  }, [])

  // Function to get random image IDs for categories
  const getRandomImageId = () => {
    const imageIds = [
      '1498049794561-7780e7231661', // electronics
      '1517336714731-489689fd1ca8', // computers
      '1505740420928-5e560c06d30e', // audio
      '1516035069371-29a1b244cc32', // photography
      '1523275335684-37898b6baf30', // wearables
      '1542751371-adc38448a05e', // gaming
      '1441986300917-64674bd600d8', // general shopping
    ]
    return imageIds[Math.floor(Math.random() * imageIds.length)]
  }

  if (isLoading) {
    return (
      <section className="py-20 bg-muted/30">
        <div className="container">
          <div className="text-center space-y-4 mb-12">
            <h2 className="text-3xl md:text-4xl font-bold">Shop by Category</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Explore our wide range of categories and find exactly what you're looking for
            </p>
          </div>
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        </div>
      </section>
    )
  }

  if (error) {
    return (
      <section className="py-20 bg-muted/30">
        <div className="container">
          <div className="text-center space-y-4 mb-12">
            <h2 className="text-3xl md:text-4xl font-bold">Shop by Category</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              {error}. Please try again later.
            </p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-20 bg-muted/30">
      <div className="container">
        <div className="text-center space-y-4 mb-12">
          <h2 className="text-3xl md:text-4xl font-bold">Shop by Category</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Explore our wide range of categories and find exactly what you're looking for
          </p>
        </div>

        {categories.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {categories.map((category) => (
                <Link key={category.id} href={`/products?category=${category.name}`}>
                  <Card className="group cursor-pointer card-hover overflow-hidden">
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={category.image}
                        alt={category.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className={`absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent`} />
                      <div className="absolute bottom-4 left-4 right-4">
                        <div className="flex items-center space-x-3">
                          <div className={`p-2 rounded-lg bg-gradient-to-r ${category.color} text-white`}>
                            <category.icon className="h-5 w-5" />
                          </div>
                          <div className="text-white">
                            <h3 className="font-semibold text-lg">{category.name}</h3>
                            <p className="text-sm text-white/80">{category.description}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>

            <div className="text-center mt-12">
              <Link href="/categories">
                <button className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary hover:bg-primary/90 transition-colors">
                  View All Categories
                </button>
              </Link>
            </div>
          </>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No categories available at the moment.</p>
          </div>
        )}
      </div>
    </section>
  )
} 