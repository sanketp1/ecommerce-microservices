'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ChevronDown, Filter, Loader2 } from 'lucide-react'
import { productService } from '@/lib/api/services'

interface ProductFiltersProps {
  filters: {
    category?: string
    search?: string
    minPrice?: number
    maxPrice?: number
    sortBy?: string
    sortOrder?: string
  }
  onFilterChange: (filters: any) => void
  onCategoryChange: (category: string) => void
  onSortChange: (sortBy: string, sortOrder: string) => void
}

const sortOptions = [
  { value: 'name_asc', label: 'Name A-Z' },
  { value: 'name_desc', label: 'Name Z-A' },
  { value: 'price_asc', label: 'Price Low to High' },
  { value: 'price_desc', label: 'Price High to Low' },
]

export function ProductFilters({ filters, onFilterChange, onCategoryChange, onSortChange }: ProductFiltersProps) {
  const [isOpen, setIsOpen] = useState(true)
  const [categories, setCategories] = useState<string[]>([])
  const [isLoadingCategories, setIsLoadingCategories] = useState(true)

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setIsLoadingCategories(true)
        const categoryNames = await productService.getCategories()
        setCategories(categoryNames || [])
      } catch (error) {
        console.error('Error fetching categories:', error)
        setCategories([])
      } finally {
        setIsLoadingCategories(false)
      }
    }

    fetchCategories()
  }, [])

  const handlePriceChange = (type: 'min' | 'max', value: string) => {
    const numValue = value ? parseFloat(value) : undefined
    onFilterChange({
      ...filters,
      [type === 'min' ? 'minPrice' : 'maxPrice']: numValue
    })
  }

  const handleSortChange = (value: string) => {
    const [sortBy, sortOrder] = value.split('_')
    onSortChange(sortBy, sortOrder)
  }

  return (
    <div className="space-y-4">
      {/* Mobile Filter Toggle */}
      <Button
        variant="outline"
        className="lg:hidden w-full"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Filter className="h-4 w-4 mr-2" />
        Filters
        <ChevronDown className={`h-4 w-4 ml-2 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </Button>

      {/* Filters */}
      <div className={`lg:block ${isOpen ? 'block' : 'hidden'}`}>
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Filters</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Categories */}
            <div>
              <h3 className="font-semibold mb-3">Categories</h3>
              {isLoadingCategories ? (
                <div className="flex items-center justify-center py-4">
                  <Loader2 className="h-4 w-4 animate-spin text-primary" />
                </div>
              ) : (
                <div className="space-y-2">
                  <Button
                    variant={!filters.category ? 'default' : 'ghost'}
                    size="sm"
                    className="w-full justify-start"
                    onClick={() => onCategoryChange('')}
                  >
                    All Categories
                  </Button>
                  {categories.map((category) => (
                    <Button
                      key={category}
                      variant={filters.category === category ? 'default' : 'ghost'}
                      size="sm"
                      className="w-full justify-start"
                      onClick={() => onCategoryChange(category)}
                    >
                      {category}
                    </Button>
                  ))}
                </div>
              )}
            </div>

            {/* Price Range */}
            <div>
              <h3 className="font-semibold mb-3">Price Range</h3>
              <div className="space-y-2">
                <Input
                  type="number"
                  placeholder="Min Price"
                  value={filters.minPrice || ''}
                  onChange={(e) => handlePriceChange('min', e.target.value)}
                />
                <Input
                  type="number"
                  placeholder="Max Price"
                  value={filters.maxPrice || ''}
                  onChange={(e) => handlePriceChange('max', e.target.value)}
                />
              </div>
            </div>

            {/* Sort */}
            <div>
              <h3 className="font-semibold mb-3">Sort By</h3>
              <div className="space-y-2">
                {sortOptions.map((option) => (
                  <Button
                    key={option.value}
                    variant={filters.sortBy === option.value.split('_')[0] && filters.sortOrder === option.value.split('_')[1] ? 'default' : 'ghost'}
                    size="sm"
                    className="w-full justify-start"
                    onClick={() => handleSortChange(option.value)}
                  >
                    {option.label}
                  </Button>
                ))}
              </div>
            </div>

            {/* Clear Filters */}
            <Button
              variant="outline"
              size="sm"
              className="w-full"
              onClick={() => {
                onFilterChange({})
                onCategoryChange('')
              }}
            >
              Clear All Filters
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 