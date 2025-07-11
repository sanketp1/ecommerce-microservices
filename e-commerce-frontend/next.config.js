/** @type {import('next').NextConfig} */


console.log(process.env.NEXT_PUBLIC_PRODUCT_SERVICE_URL);
console.log(process.env.NEXT_PUBLIC_AUTH_SERVICE_URL);
console.log(process.env.NEXT_PUBLIC_CART_SERVICE_URL);
console.log(process.env.NEXT_PUBLIC_ORDER_SERVICE_URL);
console.log(process.env.NEXT_PUBLIC_PAYMENT_SERVICE_URL);
console.log(process.env.NEXT_PUBLIC_ADMIN_SERVICE_URL);
console.log(process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID);
console.log(process.env.RAZORPAY_KEY_SECRET);
console.log(process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID);
console.log(process.env.NEXT_PUBLIC_GOOGLE_CLIENT_SECRET);

const nextConfig = {
  images: {
    domains: ['images.unsplash.com', 'localhost', 'fmzqhgyfpkifsbymzdoy.supabase.co'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'fmzqhgyfpkifsbymzdoy.supabase.co',
        port: '',
        pathname: '/**',
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: '/api/products/:path*',
        destination: process.env.NEXT_PUBLIC_PRODUCT_SERVICE_URL || 'http://localhost',
      },
      {
        source: '/api/auth/:path*',
        destination: process.env.NEXT_PUBLIC_AUTH_SERVICE_URL || 'http://localhost',
      },
      {
        source: '/api/cart/:path*',
        destination: process.env.NEXT_PUBLIC_CART_SERVICE_URL || 'http://localhost',
      },
      {
        source: '/api/orders/:path*',
        destination: process.env.NEXT_PUBLIC_ORDER_SERVICE_URL || 'http://localhost',
      },
      {
        source: '/api/payments/:path*',
        destination: process.env.NEXT_PUBLIC_PAYMENT_SERVICE_URL || 'http://localhost',
      },
      {
        source: '/api/admin/:path*',
        destination: process.env.NEXT_PUBLIC_ADMIN_SERVICE_URL || 'http://localhost',
      },
    ]
  },
}

module.exports = nextConfig 