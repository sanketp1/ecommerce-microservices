import { 
  productApi, 
  authApi, 
  cartApi, 
  orderApi, 
  paymentApi, 
  adminApi,
  apiWrapper 
} from './client';
import {
  Product,
  ProductCreate,
  ProductUpdate,
  UserCreate,
  UserLogin,
  TokenResponse,
  UserResponse,
  CartItem,
  CartResponse,
  OrderCreate,
  Order,
  PaymentVerification,
  DashboardResponse,
  OrderStatusUpdate,
  GoogleAuthRequest
} from '@/types/api';

// Product Service API
export const productService = {
  // Get all products with optional filtering
  getProducts: async (params?: { category?: string; search?: string }) => {
    return apiWrapper(() => productApi.get<Product[]>('/api/products/', { params }));
  },

  // Get product by ID
  getProduct: async (id: string) => {
    return apiWrapper(() => productApi.get<Product>(`/api/products/${id}`));
  },

  // Create product
  createProduct: async (product: ProductCreate) => {
    return apiWrapper(() => productApi.post<Product>('/api/products/', product));
  },

  // Update product
  updateProduct: async (id: string, product: ProductUpdate) => {
    return apiWrapper(() => productApi.put<Product>(`/api/products/${id}`, product));
  },

  // Delete product
  deleteProduct: async (id: string) => {
    return apiWrapper(() => productApi.delete(`/api/products/${id}`));
  },

  // Get categories
  getCategories: async () => {
    return apiWrapper(() => productApi.get<string[]>('/api/products/categories'));
  },
};

// Auth Service API
export const authService = {
  // Register user
  register: async (userData: UserCreate) => {
    return apiWrapper(() => authApi.post<TokenResponse>('/api/auth/register', userData));
  },

  // Login user
  login: async (credentials: UserLogin) => {
    return apiWrapper(() => authApi.post<TokenResponse>('/api/auth/login', credentials));
  },

  // Google OAuth
  googleAuth: async (token: string) => {
    const googleData: GoogleAuthRequest = { token };
    return apiWrapper(() => authApi.post<TokenResponse>('/api/auth/google', googleData));
  },

  // Get current user
  getCurrentUser: async () => {
    return apiWrapper(() => authApi.get<UserResponse>('/api/auth/me'));
  },

  // Get user profile
  getUserProfile: async () => {
    return apiWrapper(() => authApi.get<UserResponse>('/api/auth/me'));
  },
};

// Cart Service API
export const cartService = {
  // Get cart
  getCart: async () => {
    return apiWrapper(() => cartApi.get<CartResponse>('/api/cart/'));
  },

  // Add to cart
  addToCart: async (item: CartItem) => {
    return apiWrapper(() => cartApi.post('/api/cart/add', item));
  },

  // Remove from cart
  removeFromCart: async (productId: number) => {
    return apiWrapper(() => cartApi.delete(`/api/cart/remove/${productId}`));
  },

  // Update quantity
  updateQuantity: async (productId: number, quantity: number) => {
    return apiWrapper(() => cartApi.put(`/api/cart/update/${productId}/${quantity}`));
  },

 
};

// Order Service API
export const orderService = {
  // Get user orders
  getOrders: async () => {
    return apiWrapper(() => orderApi.get<Order[]>('/api/orders'));
  },

  // Get specific order
  getOrder: async (orderId: string) => {
    return apiWrapper(() => orderApi.get<Order>(`/api/orders/${orderId}`));
  },

  // Create order
  createOrder: async (orderData: OrderCreate) => {
    return apiWrapper(() => orderApi.post<Order>('/api/orders', orderData));
  },

  // Update order status
  updateOrderStatus: async (orderId: string, status: string) => {
    return apiWrapper(() => orderApi.patch(`/api/orders/${orderId}/status?status=${status}`));
  },
};

// Payment Service API
export const paymentService = {
  // Create payment order
  createPaymentOrder: async () => {
    return apiWrapper(() => paymentApi.post('/api/payments/create-order'));
  },

  // Verify payment
  verifyPayment: async (verification: PaymentVerification) => {
    return apiWrapper(() => paymentApi.post('/api/payments/verify', verification));
  },
};

// Admin Service API
export const adminService = {
  // Get admin dashboard
  getDashboard: async () => {
    return apiWrapper(() => adminApi.get<DashboardResponse>('/api/admin/dashboard'));
  },

  // Get all users (returns generic objects as per API docs)
  getAllUsers: async () => {
    return apiWrapper(() => adminApi.get<any[]>('/api/admin/users'));
  },

  // Create product (admin)
  createProduct: async (product: ProductCreate) => {
    console.log('Admin service - creating product with data:', product);
    return apiWrapper(() => adminApi.post('/api/admin/products', product));
  },

  // Update product (admin)
  updateProduct: async (productId: string, product: ProductUpdate) => {
    return apiWrapper(() => adminApi.put(`/api/admin/products/${productId}`, product));
  },

  // Delete product (admin)
  deleteProduct: async (productId: string) => {
    return apiWrapper(() => adminApi.delete(`/api/admin/products/${productId}`));
  },

  // Get all orders (returns generic objects as per API docs)
  getAllOrders: async () => {
    return apiWrapper(() => adminApi.get<any[]>('/api/admin/orders'));
  },

  // Update order status (admin) - using regular order service endpoint
  updateOrderStatus: async (orderId: string, statusUpdate: OrderStatusUpdate) => {
    return apiWrapper(() => orderApi.patch(`/api/orders/${orderId}/status?status=${statusUpdate.status}`));
  },
}; 