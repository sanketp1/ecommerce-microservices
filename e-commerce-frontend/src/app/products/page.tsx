'use client'

import { useState, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { ProductCard } from '@/components/products/product-card'
import { ProductFilters } from '@/components/products/product-filters'
import { ProductSearch } from '@/components/products/product-search'
import { Pagination } from '@/components/ui/pagination'
import { productService } from '@/lib/api/services'
import { Product } from '@/types/api'
import { Loader2, Grid, List } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function ProductsPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  // URL params
  const category = searchParams.get('category') || undefined
  const search = searchParams.get('search') || undefined
  const page = parseInt(searchParams.get('page') || '1')
  const sortBy = searchParams.get('sortBy') || undefined
  const sortOrder = searchParams.get('sortOrder') || undefined

  // Local state
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filters, setFilters] = useState<{
    category?: string;
    search?: string;
    minPrice?: number;
    maxPrice?: number;
    sortBy?: string;
    sortOrder?: string;
  }>({
    category,
    search,
    minPrice: undefined,
    maxPrice: undefined,
    sortBy,
    sortOrder,
  })

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true)
        setError(null)
        const data = await productService.getProducts({
          category: filters.category,
          search: filters.search,
        })
        setProducts(data || [])
      } catch (err) {
        setError('Failed to load products')
        console.error('Error fetching products:', err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchProducts()
  }, [filters.category, filters.search])

  // Update URL when filters change
  useEffect(() => {
    const params = new URLSearchParams()
    if (filters.category) params.set('category', filters.category)
    if (filters.search) params.set('search', filters.search)
    if (filters.minPrice) params.set('minPrice', filters.minPrice.toString())
    if (filters.maxPrice) params.set('maxPrice', filters.maxPrice.toString())
    if (filters.sortBy) params.set('sortBy', filters.sortBy)
    if (filters.sortOrder) params.set('sortOrder', filters.sortOrder)
    if (page > 1) params.set('page', page.toString())
    
    const newUrl = params.toString() ? `?${params.toString()}` : '/products'
    router.push(newUrl)
  }, [filters, page, router])

  const handleFilterChange = (newFilters: Partial<typeof filters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }))
  }

  const handleSearch = (searchTerm: string) => {
    handleFilterChange({ search: searchTerm || undefined })
  }

  const handleCategoryChange = (category: string) => {
    handleFilterChange({ category: category || undefined })
  }

  const handleSortChange = (sortBy: string, sortOrder: string) => {
    handleFilterChange({ sortBy, sortOrder })
  }

  const handlePageChange = (newPage: number) => {
    router.push(`/products?page=${newPage}`)
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col">
        <main className="container flex-1 py-12">
          <div className="text-center text-muted-foreground">
            {error}. Please try again later.
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col">
      <main className="container flex-1 py-12">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Products</h1>
          <p className="text-muted-foreground">
            Discover our amazing collection of products
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <ProductSearch 
            value={filters.search || ''} 
            onSearch={handleSearch}
            placeholder="Search products..."
          />
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className="lg:w-64 flex-shrink-0">
            <ProductFilters
              filters={filters}
              onFilterChange={handleFilterChange}
              onCategoryChange={handleCategoryChange}
              onSortChange={handleSortChange}
            />
          </div>

          {/* Products Grid */}
          <div className="flex-1">
            {/* Toolbar */}
            <div className="flex items-center justify-between mb-6">
              <div className="text-sm text-muted-foreground">
                {!isLoading ? `${products.length} products found` : 'Loading...'}
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                >
                  <Grid className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Loading State */}
            {isLoading && (
              <div className="flex justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            )}

            {/* Products Grid */}
            {!isLoading && (
              <>
                <div className={`grid gap-6 ${
                  viewMode === 'grid' 
                    ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
                    : 'grid-cols-1'
                }`}>
                  {products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>

                {/* Empty State */}
                {products.length === 0 && (
                  <div className="text-center py-12">
                    <div className="text-muted-foreground mb-4">
                      No products found matching your criteria.
                    </div>
                    <Button 
                      variant="outline" 
                      onClick={() => {
                        setFilters({})
                        router.push('/products')
                      }}
                    >
                      Clear Filters
                    </Button>
                  </div>
                )}

                {/* Pagination */}
                {products.length > 0 && (
                  <div className="mt-12 flex justify-center">
                    <Pagination
                      currentPage={page}
                      totalPages={Math.ceil(products.length / 12)} // Assuming 12 items per page
                      onPageChange={handlePageChange}
                    />
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  )
} 