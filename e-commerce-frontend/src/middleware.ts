import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const token = request.cookies.get('access_token')?.value
  const isAuth = !!token
  const isAuthPage = request.nextUrl.pathname.startsWith('/auth')
  const isAdminPage = request.nextUrl.pathname.startsWith('/admin')
  const isDashboardPage = request.nextUrl.pathname.startsWith('/dashboard')
  const isCheckoutPage = request.nextUrl.pathname.startsWith('/checkout')

  // Redirect authenticated users away from auth pages
  if (isAuthPage && isAuth) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  // Protect admin routes (you'll need to decode JWT to check role)
  if (isAdminPage && !isAuth) {
    return NextResponse.redirect(new URL('/auth/login', request.url))
  }

  // Protect dashboard routes
  if (isDashboardPage && !isAuth) {
    return NextResponse.redirect(new URL('/auth/login', request.url))
  }

  // Protect checkout routes
  if (isCheckoutPage && !isAuth) {
    return NextResponse.redirect(new URL('/auth/login', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/admin/:path*',
    '/checkout/:path*',
    '/auth/:path*',
  ],
} 