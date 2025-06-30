import { z } from 'zod';

// Auth validations
export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export const registerSchema = z.object({
  full_name: z.string().min(2, 'Full name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

// Product validations
export const productCreateSchema = z.object({
  name: z.string().min(1, 'Product name is required'),
  description: z.string().optional(),
  price: z.number().min(0, 'Price must be positive'),
  category: z.string().min(1, 'Category is required'),
  image_url: z.string().url('Invalid image URL').optional(),
  stock: z.number().min(0, 'Stock must be positive').optional(),
});

export const productUpdateSchema = z.object({
  name: z.string().min(1, 'Product name is required').optional(),
  description: z.string().optional(),
  price: z.number().min(0, 'Price must be positive').optional(),
  category: z.string().min(1, 'Category is required').optional(),
  image_url: z.string().url('Invalid image URL').optional(),
  stock: z.number().min(0, 'Stock must be positive').optional(),
});

// Cart validations
export const addToCartSchema = z.object({
  product_id: z.number().positive('Product ID must be positive'),
  quantity: z.number().min(1, 'Quantity must be at least 1'),
});

// Order validations
export const orderCreateSchema = z.object({
  user_id: z.string().min(1, 'User ID is required'),
  items: z.array(z.object({
    product_id: z.string().min(1, 'Product ID is required'),
    quantity: z.number().min(1, 'Quantity must be at least 1'),
    price: z.number().min(0, 'Price must be positive'),
  })).min(1, 'At least one item is required'),
  total_amount: z.number().min(0, 'Total amount must be positive'),
  status: z.enum(['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled']).optional(),
});

// Payment validations
export const paymentVerificationSchema = z.object({
  razorpay_order_id: z.string().min(1, 'Order ID is required'),
  razorpay_payment_id: z.string().min(1, 'Payment ID is required'),
  razorpay_signature: z.string().min(1, 'Signature is required'),
});

// Admin validations
export const orderStatusUpdateSchema = z.object({
  status: z.enum(['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled']),
});

// Search and filter validations
export const productFilterSchema = z.object({
  category: z.string().optional(),
  search: z.string().optional(),
  minPrice: z.number().min(0).optional(),
  maxPrice: z.number().min(0).optional(),
  sortBy: z.enum(['name', 'price', 'created_at']).optional(),
  sortOrder: z.enum(['asc', 'desc']).optional(),
});

// User profile validations
export const userProfileSchema = z.object({
  full_name: z.string().min(2, 'Full name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
});

// Checkout validations
export const checkoutSchema = z.object({
  shipping_address: z.object({
    full_name: z.string().min(2, 'Full name must be at least 2 characters'),
    address_line1: z.string().min(1, 'Address is required'),
    address_line2: z.string().optional(),
    city: z.string().min(1, 'City is required'),
    state: z.string().min(1, 'State is required'),
    postal_code: z.string().min(1, 'Postal code is required'),
    country: z.string().min(1, 'Country is required'),
    phone: z.string().min(1, 'Phone number is required'),
  }),
  billing_address: z.object({
    full_name: z.string().min(2, 'Full name must be at least 2 characters'),
    address_line1: z.string().min(1, 'Address is required'),
    address_line2: z.string().optional(),
    city: z.string().min(1, 'City is required'),
    state: z.string().min(1, 'State is required'),
    postal_code: z.string().min(1, 'Postal code is required'),
    country: z.string().min(1, 'Country is required'),
    phone: z.string().min(1, 'Phone number is required'),
  }).optional(),
  payment_method: z.enum(['razorpay', 'cod']),
  use_shipping_for_billing: z.boolean().optional(),
});

// Review validations
export const reviewSchema = z.object({
  rating: z.number().min(1, 'Rating is required').max(5, 'Rating must be between 1 and 5'),
  title: z.string().min(1, 'Review title is required').max(100, 'Title must be less than 100 characters'),
  comment: z.string().min(10, 'Review comment must be at least 10 characters').max(500, 'Comment must be less than 500 characters'),
});

// Export types
export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
export type ProductCreateFormData = z.infer<typeof productCreateSchema>;
export type ProductUpdateFormData = z.infer<typeof productUpdateSchema>;
export type AddToCartFormData = z.infer<typeof addToCartSchema>;
export type OrderCreateFormData = z.infer<typeof orderCreateSchema>;
export type PaymentVerificationFormData = z.infer<typeof paymentVerificationSchema>;
export type OrderStatusUpdateFormData = z.infer<typeof orderStatusUpdateSchema>;
export type ProductFilterFormData = z.infer<typeof productFilterSchema>;
export type UserProfileFormData = z.infer<typeof userProfileSchema>;
export type CheckoutFormData = z.infer<typeof checkoutSchema>;
export type ReviewFormData = z.infer<typeof reviewSchema>; 