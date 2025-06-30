'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { loginSchema, LoginFormData } from '@/lib/validations'
import { useAuthStore } from '@/store/auth-store'
import { authService } from '@/lib/api/services'
import { toast } from 'react-hot-toast'
import { Loader2, Mail, Lock, Eye, EyeOff } from 'lucide-react'
import { useGoogleLogin, GoogleOAuthProvider } from '@react-oauth/google'
import { FcGoogle } from 'react-icons/fc'
import axios from 'axios'

function LoginPageInner() {
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [isGoogleLoading, setIsGoogleLoading] = useState(false)
  const router = useRouter()
  const { setUser, setToken } = useAuthStore()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  })

  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setIsGoogleLoading(true);
      console.log('[Google OAuth] onSuccess tokenResponse:', tokenResponse);
      try {
        const res = await axios.post('http://localhost/api/auth/google', {
          token: (tokenResponse as any).credential || (tokenResponse as any).access_token,
        });
        console.log('[Google OAuth] Backend /api/auth/google response:', res);
        setToken(res.data.access_token);
        setUser({
          id: res.data.user.id,
          email: res.data.user.email,
          full_name: res.data.user.full_name,
          is_admin: res.data.user.is_admin,
        });
        toast.success('Google login successful!');
        router.push('/dashboard');
      } catch (err) {
        console.error('[Google OAuth] Error during backend /api/auth/google:', err);
        toast.error('Google login failed. Please try again.');
      } finally {
        setIsGoogleLoading(false);
      }
    },
    onError: (err) => {
      console.error('[Google OAuth] onError:', err);
      toast.error('Google login failed. Please try again.');
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true)
    try {
      const response = await authService.login({
        email: data.email,
        password: data.password,
      })

      // authService.login returns TokenResponse directly via apiWrapper
      const { access_token, user } = response
      
      // Store token and user in Zustand store
      setToken(access_token)
      setUser({
        id: user.id,
        email: user.email,
        full_name: user.full_name,
        is_admin: user.is_admin,
      })
      
      toast.success('Login successful!')
      router.push('/dashboard')
    } catch (error: any) {
      console.error('Login error:', error)
      if (error.response?.data?.detail) {
        // Handle validation errors
        const details = error.response.data.detail
        if (Array.isArray(details)) {
          toast.error(details[0]?.msg || 'Invalid credentials')
        } else {
          toast.error(details || 'Invalid credentials')
        }
      } else {
        toast.error('An error occurred during login')
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <main className="container flex-1 py-12 flex items-center justify-center">
        <div className="w-full max-w-md mx-auto space-y-6">
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-bold">Welcome Back</CardTitle>
              <p className="text-muted-foreground">
                Sign in to your account to continue
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Custom Google OAuth Button */}
              <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!}>
                <button
                  type="button"
                  onClick={() => googleLogin()}
                  className="w-full flex items-center justify-center border rounded-lg py-2 px-4 bg-white hover:bg-gray-50 transition"
                  disabled={isGoogleLoading}
                >
                  <FcGoogle className="mr-2 h-5 w-5" />
                  {isGoogleLoading ? 'Loading...' : 'Continue with Google'}
                </button>
              </GoogleOAuthProvider>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">
                    Or continue with
                  </span>
                </div>
              </div>

              {/* Login Form */}
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input
                      type="email"
                      placeholder="Email"
                      className="pl-10"
                      {...register('email')}
                    />
                  </div>
                  {errors.email && (
                    <p className="text-sm text-red-500 mt-1">{errors.email.message}</p>
                  )}
                </div>

                <div>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Password"
                      className="pl-10 pr-10"
                      {...register('password')}
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="text-sm text-red-500 mt-1">{errors.password.message}</p>
                  )}
                </div>

                <div className="flex items-center justify-between">
                  <Link
                    href="/auth/forgot-password"
                    className="text-sm text-primary hover:underline"
                  >
                    Forgot password?
                  </Link>
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Signing in...
                    </>
                  ) : (
                    'Sign In'
                  )}
                </Button>
              </form>

              <div className="text-center text-sm">
                <span className="text-muted-foreground">Don't have an account? </span>
                <Link href="/auth/register" className="text-primary hover:underline">
                  Sign up
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}

export default function LoginPage() {
  return (
    <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!}>
      <LoginPageInner />
    </GoogleOAuthProvider>
  );
} 