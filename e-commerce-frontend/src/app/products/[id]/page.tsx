'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { 
  ShoppingCart, 
  Heart, 
  Star, 
  Share2, 
  ChevronLeft, 
  ChevronRight,
  Minus,
  Plus,
  Truck,
  Shield,
  RotateCcw,
  MessageCircle,
  User,
  Calendar,
  ThumbsUp,
  ThumbsDown
} from 'lucide-react'
import { productService, cartService } from '@/lib/api/services'
import { useAuthStore } from '@/store/auth-store'
import { useCartStore } from '@/store/cart-store'
import { Product, Review } from '@/types/api'
import { formatPrice } from '@/lib/utils'
import { toast } from 'react-hot-toast'
import { Loader2 } from 'lucide-react'
import Link from 'next/link'

interface ProductDetailPageProps {
  params: { id: string }
}

export default function ProductDetailPage({ params }: ProductDetailPageProps) {
  const router = useRouter()
  const { id } = params
  const { isAuthenticated } = useAuthStore()
  const { addItem, removeItem, getItemQuantity } = useCartStore()
  
  // Product state
  const [product, setProduct] = useState<Product | null>(null)
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([])
  const [reviews, setReviews] = useState<Review[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  // UI state
  const [selectedImage, setSelectedImage] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [isAddingToCart, setIsAddingToCart] = useState(false)
  const [isWishlisted, setIsWishlisted] = useState(false)
  const [activeTab, setActiveTab] = useState<'description' | 'reviews' | 'shipping'>('description')

  // Fetch product data
  useEffect(() => {
    const fetchProductData = async () => {
      try {
        setIsLoading(true)
        setError(null)
        
        // Fetch product details
        const productData = await productService.getProduct(id)
        setProduct(productData)
        
        // Fetch related products (same category)
        const allProducts = await productService.getProducts()
        const related = allProducts
          .filter(p => p.category === productData.category && p.id !== productData.id)
          .slice(0, 4)
        setRelatedProducts(related)
        
        // Mock reviews data (replace with actual API call)
        const mockReviews: Review[] = [
          {
            id: '1',
            user_id: 'user1',
            product_id: id,
            rating: 5,
            comment: 'Excellent product! The quality is outstanding and delivery was super fast.',
            created_at: '2024-01-15T10:30:00Z',
            user: { name: 'John Doe', email: 'john@example.com' }
          },
          {
            id: '2',
            user_id: 'user2',
            product_id: id,
            rating: 4,
            comment: 'Great product, very satisfied with the purchase. Would recommend!',
            created_at: '2024-01-10T14:20:00Z',
            user: { name: 'Jane Smith', email: 'jane@example.com' }
          },
          {
            id: '3',
            user_id: 'user3',
            product_id: id,
            rating: 5,
            comment: 'Perfect! Exactly what I was looking for. Fast shipping too.',
            created_at: '2024-01-05T09:15:00Z',
            user: { name: 'Mike Johnson', email: 'mike@example.com' }
          }
        ]
        setReviews(mockReviews)
        
      } catch (err) {
        setError('Failed to load product details')
        console.error('Error fetching product:', err)
      } finally {
        setIsLoading(false)
      }
    }

    if (id) {
      fetchProductData()
    }
  }, [id])

  // Handle quantity changes
  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity >= 1 && newQuantity <= (product?.stock || 1)) {
      setQuantity(newQuantity)
    }
  }

  // Handle add to cart
  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      toast.error('Please login to add items to cart')
      router.push('/auth/login')
      return
    }

    if (!product) return

    try {
      setIsAddingToCart(true)
      // Add to cart via API
      await cartService.addToCart({
        product_id: Number(product.id),
        quantity: quantity,
      })
      
      // Update local cart state
      addItem({
        product_id: Number(product.id),
        quantity: quantity,
        product: product,
      })
      
      // Sync cart with backend to ensure consistency
      const { syncCart } = useCartStore.getState();
      await syncCart();
      
      toast.success(`Added ${quantity} ${quantity === 1 ? 'item' : 'items'} to cart!`)
    } catch (error) {
      toast.error('Failed to add to cart')
    } finally {
      setIsAddingToCart(false)
    }
  }

  // Handle remove from cart
  const handleRemoveFromCart = async () => {
    if (!product) return
    
    try {
      // Remove from cart via API
      await cartService.removeFromCart(Number(product.id));
      
      // Update local cart state
      removeItem(Number(product.id));
      
      // Sync cart with backend to ensure consistency
      const { syncCart } = useCartStore.getState();
      await syncCart();
      
      toast.success('Removed from cart')
    } catch (error) {
      toast.error('Failed to remove from cart')
    }
  }

  // Get current cart quantity
  const cartQuantity = product ? getItemQuantity(Number(product.id)) : 0

  // Calculate average rating
  const averageRating = reviews.length > 0 
    ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length 
    : 0

  // Generate product images (mock data - replace with actual product images)
  const productImages = product ? [
    product.image_url,
    product.image_url.replace('w=400', 'w=600'),
    product.image_url.replace('w=400', 'w=800'),
    product.image_url.replace('w=400', 'w=1000'),
  ] : []

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <div className="container flex-1 py-12 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
            <p className="text-muted-foreground">Loading product details...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="min-h-screen flex flex-col">
        <div className="container flex-1 py-12 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
            <p className="text-muted-foreground mb-6">{error || 'The product you are looking for does not exist.'}</p>
            <Button onClick={() => router.push('/products')}>
              Back to Products
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col">
      <div className="container flex-1 py-12">
        {/* Breadcrumb */}
        <nav className="mb-8">
          <ol className="flex items-center space-x-2 text-sm text-muted-foreground">
            <li><Link href="/" className="hover:text-primary">Home</Link></li>
            <li>/</li>
            <li><Link href="/products" className="hover:text-primary">Products</Link></li>
            <li>/</li>
            <li><Link href={`/products?category=${product.category}`} className="hover:text-primary">{product.category}</Link></li>
            <li>/</li>
            <li className="text-foreground">{product.name}</li>
          </ol>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Product Gallery */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="relative aspect-square overflow-hidden rounded-lg border">
              <img
                src={productImages[selectedImage]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
              <button
                onClick={() => setIsWishlisted(!isWishlisted)}
                className={`absolute top-4 right-4 p-2 rounded-full transition-colors ${
                  isWishlisted 
                    ? 'bg-red-500 text-white' 
                    : 'bg-white/80 text-gray-600 hover:bg-white'
                }`}
              >
                <Heart className={`h-5 w-5 ${isWishlisted ? 'fill-current' : ''}`} />
              </button>
            </div>

            {/* Thumbnail Images */}
            {productImages.length > 1 && (
              <div className="flex space-x-2">
                {productImages.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`relative w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${
                      selectedImage === index 
                        ? 'border-primary' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${product.name} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            {/* Product Header */}
            <div>
              <Badge variant="secondary" className="mb-2">{product.category}</Badge>
              <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
              
              {/* Rating */}
              <div className="flex items-center space-x-2 mb-4">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${
                        i < Math.floor(averageRating) 
                          ? 'fill-yellow-400 text-yellow-400' 
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm text-muted-foreground">
                  {averageRating.toFixed(1)} ({reviews.length} reviews)
                </span>
              </div>

              {/* Price */}
              <div className="text-3xl font-bold text-primary mb-4">
                {formatPrice(product.price)}
              </div>

              {/* Stock Status */}
              <div className="flex items-center space-x-2 mb-6">
                {product.stock > 0 ? (
                  <Badge variant="default" className="bg-green-100 text-green-800">
                    In Stock ({product.stock} available)
                  </Badge>
                ) : (
                  <Badge variant="destructive">Out of Stock</Badge>
                )}
              </div>
            </div>

            {/* Add to Cart Section */}
            <div className="space-y-4">
              {/* Quantity Selector */}
              <div className="flex items-center space-x-4">
                <label className="text-sm font-medium">Quantity:</label>
                <div className="flex items-center border rounded-lg">
                  <button
                    onClick={() => handleQuantityChange(quantity - 1)}
                    disabled={quantity <= 1}
                    className="p-2 hover:bg-gray-100 disabled:opacity-50"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <Input
                    type="number"
                    value={quantity}
                    onChange={(e) => handleQuantityChange(parseInt(e.target.value) || 1)}
                    className="w-16 text-center border-0 focus:ring-0"
                    min="1"
                    max={product.stock}
                  />
                  <button
                    onClick={() => handleQuantityChange(quantity + 1)}
                    disabled={quantity >= product.stock}
                    className="p-2 hover:bg-gray-100 disabled:opacity-50"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-4">
                {cartQuantity > 0 ? (
                  <Button
                    variant="outline"
                    onClick={handleRemoveFromCart}
                    className="flex-1"
                  >
                    Remove from Cart ({cartQuantity})
                  </Button>
                ) : (
                  <Button
                    onClick={handleAddToCart}
                    disabled={product.stock <= 0 || isAddingToCart}
                    className="flex-1"
                  >
                    {isAddingToCart ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Adding...
                      </>
                    ) : (
                      <>
                        <ShoppingCart className="h-4 w-4 mr-2" />
                        Add to Cart
                      </>
                    )}
                  </Button>
                )}
                
                <Button variant="outline" size="icon">
                  <Share2 className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Product Features */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-6 border-t">
              <div className="flex items-center space-x-2">
                <Truck className="h-5 w-5 text-primary" />
                <span className="text-sm">Free Shipping</span>
              </div>
              <div className="flex items-center space-x-2">
                <Shield className="h-5 w-5 text-primary" />
                <span className="text-sm">1 Year Warranty</span>
              </div>
              <div className="flex items-center space-x-2">
                <RotateCcw className="h-5 w-5 text-primary" />
                <span className="text-sm">30 Day Returns</span>
              </div>
            </div>
          </div>
        </div>

        {/* Product Details Tabs */}
        <div className="mb-16">
          <div className="border-b">
            <nav className="flex space-x-8">
              {[
                { id: 'description', label: 'Description' },
                { id: 'reviews', label: `Reviews (${reviews.length})` },
                { id: 'shipping', label: 'Shipping & Returns' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'border-primary text-primary'
                      : 'border-transparent text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          <div className="py-8">
            {activeTab === 'description' && (
              <div className="prose max-w-none">
                <p className="text-muted-foreground leading-relaxed">
                  {product.description || 'No description available for this product.'}
                </p>
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="space-y-6">
                {reviews.length > 0 ? (
                  reviews.map((review) => (
                    <Card key={review.id}>
                      <CardContent className="pt-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                              <User className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                              <p className="font-medium">{review.user.name}</p>
                              <div className="flex items-center space-x-1">
                                {[...Array(5)].map((_, i) => (
                                  <Star
                                    key={i}
                                    className={`h-3 w-3 ${
                                      i < review.rating 
                                        ? 'fill-yellow-400 text-yellow-400' 
                                        : 'text-gray-300'
                                    }`}
                                  />
                                ))}
                              </div>
                            </div>
                          </div>
                          <span className="text-sm text-muted-foreground">
                            {new Date(review.created_at).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-muted-foreground">{review.comment}</p>
                        <div className="flex items-center space-x-4 mt-4 pt-4 border-t">
                          <button className="flex items-center space-x-1 text-sm text-muted-foreground hover:text-primary">
                            <ThumbsUp className="h-4 w-4" />
                            <span>Helpful</span>
                          </button>
                          <button className="flex items-center space-x-1 text-sm text-muted-foreground hover:text-primary">
                            <MessageCircle className="h-4 w-4" />
                            <span>Reply</span>
                          </button>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <div className="text-center py-12">
                    <MessageCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No reviews yet. Be the first to review this product!</p>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'shipping' && (
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold mb-2">Shipping Information</h3>
                  <ul className="space-y-2 text-muted-foreground">
                    <li>• Free standard shipping on orders over $50</li>
                    <li>• Standard delivery: 3-5 business days</li>
                    <li>• Express delivery: 1-2 business days (additional fee)</li>
                    <li>• International shipping available</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Return Policy</h3>
                  <ul className="space-y-2 text-muted-foreground">
                    <li>• 30-day return window for most items</li>
                    <li>• Items must be in original condition</li>
                    <li>• Return shipping is free for defective items</li>
                    <li>• Refunds processed within 5-7 business days</li>
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold mb-8">Related Products</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((relatedProduct) => (
                <Link key={relatedProduct.id} href={`/products/${relatedProduct.id}`}>
                  <Card className="group cursor-pointer card-hover overflow-hidden">
                    <div className="relative aspect-square overflow-hidden">
                      <img
                        src={relatedProduct.image_url}
                        alt={relatedProduct.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-semibold text-sm line-clamp-2 group-hover:text-primary transition-colors">
                        {relatedProduct.name}
                      </h3>
                      <p className="font-bold text-lg text-primary mt-2">
                        {formatPrice(relatedProduct.price)}
                      </p>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
} 