'use client'

import Link from 'next/link'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ShoppingCart, Heart, Star } from 'lucide-react'
import { Product } from '@/types/api'
import { formatPrice } from '@/lib/utils'
import { useCartStore } from '@/store/cart-store'
import { useAuthStore } from '@/store/auth-store'
import { cartService } from '@/lib/api/services'
import { useState } from 'react'
import { toast } from 'react-hot-toast'

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const { isAuthenticated } = useAuthStore()
  const { addItem } = useCartStore()
  const [isAddingToCart, setIsAddingToCart] = useState(false)

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      toast.error('Please login to add items to cart')
      return
    }

    try {
      setIsAddingToCart(true)
      await cartService.addToCart({
        product_id: product.id || '',
        quantity: 1,
      })
      
      addItem({
        product_id: product.id || '',
        quantity: 1,
        product: product,
      })
      
      // Sync cart with backend to ensure consistency
      const { syncCart } = useCartStore.getState();
      await syncCart();
      
      toast.success('Added to cart!')
    } catch (error) {
      toast.error('Failed to add to cart')
    } finally {
      setIsAddingToCart(false)
    }
  }

  return (
    <Card className="group card-hover overflow-hidden h-full flex flex-col">
      <Link href={`/products/${product.id}`}>
        <div className="relative aspect-square overflow-hidden">
          <img
            src={product.image_url}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <button className="absolute top-2 right-2 p-2 sm:p-2.5 bg-white/80 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white touch-manipulation">
            <Heart className="h-4 w-4 text-gray-600" />
          </button>
          {product.stock <= 0 && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <span className="text-white font-semibold text-sm sm:text-base">Out of Stock</span>
            </div>
          )}
        </div>
      </Link>

      <CardContent className="p-3 sm:p-4 flex-1 flex flex-col">
        <Link href={`/products/${product.id}`}>
          <div className="space-y-2 flex-1">
            <div className="text-xs text-muted-foreground uppercase tracking-wide">
              {product.category}
            </div>
            <h3 className="font-semibold text-sm sm:text-base line-clamp-2 group-hover:text-primary transition-colors leading-tight">
              {product.name}
            </h3>
            <div className="flex items-center space-x-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-3 w-3 ${
                    i < 4 ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                  }`}
                />
              ))}
              <span className="text-xs text-muted-foreground ml-1">(4.5)</span>
            </div>
            <div className="flex items-center justify-between mt-2">
              <span className="font-bold text-base sm:text-lg">{formatPrice(product.price)}</span>
              {product.stock > 0 && (
                <span className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full">In Stock</span>
              )}
            </div>
          </div>
        </Link>
      </CardContent>

      <CardFooter className="p-3 sm:p-4 pt-0">
        <Button
          onClick={handleAddToCart}
          disabled={product.stock <= 0 || isAddingToCart}
          className="w-full h-10 sm:h-9 text-sm"
          size="sm"
        >
          <ShoppingCart className="h-4 w-4 mr-2" />
          {isAddingToCart ? 'Adding...' : 'Add to Cart'}
        </Button>
      </CardFooter>
    </Card>
  )
} 