'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { useAuthStore } from '@/store/auth-store'
import { useCartStore } from '@/store/cart-store'
import { useState, useEffect } from 'react'
import { 
  ShoppingCart, 
  Search, 
  User, 
  LogOut, 
  Settings, 
  Package,
  ChevronDown,
  Menu,
  X
} from 'lucide-react'

// Custom hook to check if component has mounted (for hydration fix)
function useHasMounted() {
  const [hasMounted, setHasMounted] = useState(false);
  useEffect(() => {
    setHasMounted(true);
  }, []);
  return hasMounted;
}

// Custom ShopHub Logo Component
function ShopHubLogo() {
  return (
    <svg
      width="32"
      height="32"
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="mr-2"
    >
      {/* Shopping Bag */}
      <path
        d="M8 10C8 7.79086 9.79086 6 12 6H20C22.2091 6 24 7.79086 24 10V12H26C27.1046 12 28 12.8954 28 14V26C28 27.1046 27.1046 28 26 28H6C4.89543 28 4 27.1046 4 26V14C4 12.8954 4.89543 12 6 12H8V10Z"
        fill="currentColor"
        className="text-primary"
      />
      {/* Bag Handle */}
      <path
        d="M10 12H22V10C22 8.89543 21.1046 8 20 8H12C10.8954 8 10 8.89543 10 10V12Z"
        fill="white"
      />
      {/* Shopping Cart Wheels */}
      <circle cx="10" cy="24" r="2" fill="currentColor" className="text-primary" />
      <circle cx="22" cy="24" r="2" fill="currentColor" className="text-primary" />
      {/* Hub Center */}
      <circle cx="16" cy="18" r="3" fill="white" stroke="currentColor" strokeWidth="1.5" className="text-primary" />
      <circle cx="16" cy="18" r="1" fill="currentColor" className="text-primary" />
    </svg>
  )
}

export function Header() {
  const { user, isAuthenticated, logout } = useAuthStore()
  const { getItemCount, syncCart } = useCartStore()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const hasMounted = useHasMounted();

  // Sync cart with backend when component mounts and user is authenticated
  useEffect(() => {
    if (isAuthenticated && hasMounted) {
      syncCart();
    }
  }, [isAuthenticated, hasMounted, syncCart]);

  const handleLogout = () => {
    logout()
    // Clear cart when user logs out
    const { clearCart } = useCartStore.getState();
    clearCart();
    setIsUserMenuOpen(false)
  }

  return (
    <header className="bg-white shadow-sm border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Navigation */}
          <div className="flex items-center h-16 space-x-4 lg:space-x-8">
            {/* Logo */}
            <Link href="/" className="flex items-center text-xl sm:text-2xl font-bold text-primary hover:text-primary/80 transition-colors">
              <ShopHubLogo />
              <span className="hidden sm:inline">ShopHub</span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center h-16 space-x-6">
              <Link href="/" className="text-gray-700 hover:text-primary transition-colors font-medium">
                Home
              </Link>
              <Link href="/products" className="text-gray-700 hover:text-primary transition-colors font-medium">
                Products
              </Link>
              <Link href="/categories" className="text-gray-700 hover:text-primary transition-colors font-medium">
                Categories
              </Link>
              <Link href="/about" className="text-gray-700 hover:text-primary transition-colors font-medium">
                About
              </Link>
              <Link href="/contact" className="text-gray-700 hover:text-primary transition-colors font-medium">
                Contact
              </Link>
            </nav>
          </div>

          {/* Search Bar - Hidden on mobile, shown on tablet and up */}
          <div className="hidden md:flex items-center h-16 flex-1 max-w-md mx-4 lg:mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search products..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center h-16 space-x-2 sm:space-x-4">
            {/* Cart */}
            <Link href="/cart">
              <Button variant="ghost" size="sm" className="relative p-2 sm:p-2">
                <ShoppingCart className="h-5 w-5" />
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {hasMounted ? getItemCount() : ""}
                </span>
              </Button>
            </Link>

            {/* User Menu */}
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center space-x-2 text-gray-700 hover:text-primary transition-colors p-1"
                >
                  <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center text-sm">
                    {user?.full_name?.[0] || user?.email?.[0] || 'U'}
                  </div>
                  <span className="hidden sm:block text-sm">{user?.full_name || user?.email}</span>
                  <ChevronDown className="h-4 w-4 hidden sm:block" />
                </button>

                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border">
                    <Link
                      href="/dashboard"
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      <User className="h-4 w-4 mr-3" />
                      Profile
                    </Link>
                    <Link
                      href="/dashboard/orders"
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      <Package className="h-4 w-4 mr-3" />
                      Orders
                    </Link>
                    {user?.is_admin && (
                      <Link
                        href="/admin"
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        <Settings className="h-4 w-4 mr-3" />
                        Admin Panel
                      </Link>
                    )}
                    <button
                      onClick={handleLogout}
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <LogOut className="h-4 w-4 mr-3" />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-1 sm:space-x-2">
                <Link href="/auth/login">
                  <Button variant="ghost" size="sm" className="text-xs sm:text-sm px-2 sm:px-3">
                    Sign In
                  </Button>
                </Link>
                <Link href="/auth/register">
                  <Button size="sm" className="text-xs sm:text-sm px-2 sm:px-3">
                    Sign Up
                  </Button>
                </Link>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden p-2 ml-1"
            >
              {isMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden py-4 border-t bg-white">
            <nav className="flex flex-col space-y-4">
              <Link
                href="/"
                className="text-gray-700 hover:text-primary transition-colors font-medium py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                href="/products"
                className="text-gray-700 hover:text-primary transition-colors font-medium py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Products
              </Link>
              <Link
                href="/categories"
                className="text-gray-700 hover:text-primary transition-colors font-medium py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Categories
              </Link>
              <Link
                href="/about"
                className="text-gray-700 hover:text-primary transition-colors font-medium py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                About
              </Link>
              <Link
                href="/contact"
                className="text-gray-700 hover:text-primary transition-colors font-medium py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Contact
              </Link>
              
              {/* Mobile Search */}
              <div className="relative pt-2">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="text"
                  placeholder="Search products..."
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>

              {/* Mobile User Actions */}
              {!isAuthenticated && (
                <div className="flex flex-col space-y-2 pt-2">
                  <Link href="/auth/login">
                    <Button variant="outline" className="w-full">
                      Sign In
                    </Button>
                  </Link>
                  <Link href="/auth/register">
                    <Button className="w-full">
                      Sign Up
                    </Button>
                  </Link>
                </div>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  )
} 