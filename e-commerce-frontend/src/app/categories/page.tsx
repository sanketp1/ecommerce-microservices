'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { productService } from '@/lib/api/services'
import { Smartphone, Laptop, Headphones, Camera, Watch, Gamepad2, Package, Loader2 } from 'lucide-react'
import Link from 'next/link'

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

interface Category {
  id: string
  name: string
  icon: any
  color: string
}

export default function CategoriesPage() {
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
          
          return {
            id: categoryId,
            name: categoryName,
            icon: IconComponent,
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

  return (
    <div className="min-h-screen flex flex-col">
      <main className="container flex-1 py-12">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Categories</h1>
          <p className="text-muted-foreground">
            Browse products by category
          </p>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">{error}. Please try again later.</p>
          </div>
        ) : categories.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {categories.map((category) => (
              <Link key={category.id} href={`/products?category=${category.name}`}>
                <Card className="group cursor-pointer card-hover overflow-hidden">
                  <CardHeader className="pb-3">
                    <div className="flex items-center space-x-3">
                      <div className={`p-3 rounded-lg bg-gradient-to-r ${category.color} text-white`}>
                        <category.icon className="h-6 w-6" />
                      </div>
                      <CardTitle className="text-lg group-hover:text-primary transition-colors">
                        {category.name}
                      </CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Button variant="outline" className="w-full group-hover:bg-primary group-hover:text-white transition-colors">
                      Browse Products
                    </Button>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No categories available at the moment.</p>
          </div>
        )}
      </main>
    </div>
  )
} 