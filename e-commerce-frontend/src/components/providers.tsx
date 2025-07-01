'use client'

import { useEffect } from 'react'
import { useAuthStore } from '@/store/auth-store'
import { useCartSync } from "@/lib/utils"
import { useCartStore } from "@/store/cart-store"

function AuthSync() {
  const { token, user, isAuthenticated, profileFetchAttempted } = useAuthStore()
  const { syncCart } = useCartStore()

  useEffect(() => {
    // Check if user is authenticated on app load
    if (token && user && !isAuthenticated) {
      // This handles the case where the user has a token but the store isn't synced
      // You might want to validate the token with your auth service here
    }
    
    // Fetch user profile when authenticated to get complete user data including admin status
    if (isAuthenticated && token && (!user?.is_admin) && !profileFetchAttempted) {
      const { fetchUserProfile } = useAuthStore.getState();
      fetchUserProfile();
    }
    
    // Sync cart when authentication state changes
    if (isAuthenticated) {
      syncCart();
    }
  }, [token, user, isAuthenticated, syncCart, profileFetchAttempted])

  return null
}

// Component to sync cart on app load
function CartSync() {
  useCartSync();
  return null;
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <>
      <AuthSync />
      <CartSync />
      {children}
    </>
  )
} 