// Product Service Types
export interface Product {
  id?: string | null;
  name: string;
  description: string;
  price: number;
  category: string;
  image_url: string;
  stock: number;
}

export interface ProductUpdate {
  name?: string | null;
  description?: string | null;
  price?: number | null;
  category?: string | null;
  image_url?: string | null;
  stock?: number | null;
}

export interface ProductCreate {
  name: string;
  description?: string | null;
  price: number;
  category: string;
  stock?: number;
  image_url?: string | null;
}

// Review Types
export interface Review {
  id: string;
  user_id: string;
  product_id: string;
  rating: number;
  comment: string;
  created_at: string;
  user: {
    name: string;
    email: string;
  };
}

export interface ReviewCreate {
  product_id: string;
  rating: number;
  comment: string;
}

// Auth Service Types
export interface UserCreate {
  email: string;
  full_name: string;
  password: string;
}

export interface UserLogin {
  email: string;
  password: string;
}

export interface UserResponse {
  id: string;
  email: string;
  full_name: string;
  is_admin?: boolean;
}

export interface TokenResponse {
  access_token: string;
  token_type?: string;
  user: UserResponse;
}

export interface GoogleAuthRequest {
  token: string;
}

// Cart Service Types
export interface CartItem {
  product_id: number;
  quantity: number;
}

export interface CartItemResponse {
  product_id: number;
  quantity: number;
  product?: Product | null;
}

export interface CartResponse {
  items: CartItemResponse[];
  total: number;
}

// Order Service Types
export type OrderStatus = 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

export interface OrderItem {
  product_id: string;
  quantity: number;
  price: number;
  product?: Product | null;
}

export interface OrderCreate {
  user_id: string;
  items: OrderItem[];
  total_amount: number;
  status?: OrderStatus;
}

export interface Order {
  order_id: string;
  user_id: string;
  items: OrderItem[];
  total_amount: number;
  status: OrderStatus;
  created_at: string;
  updated_at: string;
}

export interface OrderStatusUpdate {
  status: string;
}

// Payment Service Types
export interface PaymentVerification {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

// Admin Service Types
export interface DashboardStats {
  total_users: number;
  total_products: number;
  total_orders: number;
  total_revenue: number;
}

export interface DashboardResponse {
  stats: DashboardStats;
  recent_orders: any[];
}

// Common Types
export interface ValidationError {
  loc: (string | number)[];
  msg: string;
  type: string;
}

export interface HTTPValidationError {
  detail: ValidationError[];
}

// API Response Types
export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  total_pages: number;
} 