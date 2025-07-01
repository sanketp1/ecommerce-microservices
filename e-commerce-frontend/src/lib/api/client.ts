import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { toast } from 'react-hot-toast';

// API Base URLs - Update these with actual microservice ports
const API_BASE_URLS = {
  PRODUCT_SERVICE: process.env.NEXT_PUBLIC_PRODUCT_SERVICE_URL || 'http://localhost',
  AUTH_SERVICE: process.env.NEXT_PUBLIC_AUTH_SERVICE_URL || 'http://localhost',
  CART_SERVICE: process.env.NEXT_PUBLIC_CART_SERVICE_URL || 'http://localhost',
  ORDER_SERVICE: process.env.NEXT_PUBLIC_ORDER_SERVICE_URL || 'http://localhost',
  PAYMENT_SERVICE: process.env.NEXT_PUBLIC_PAYMENT_SERVICE_URL || 'http://localhost',
  ADMIN_SERVICE: process.env.NEXT_PUBLIC_ADMIN_SERVICE_URL || 'http://localhost',
};

// Create axios instances for each service
const createApiClient = (baseURL: string): AxiosInstance => {
  const client = axios.create({
    baseURL,
    timeout: 10000,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  // Request interceptor to add auth token
  client.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem('access_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  // Response interceptor for error handling
  client.interceptors.response.use(
    (response: AxiosResponse) => {
      return response;
    },
    (error) => {
      const { response } = error;
      
      if (response) {
        const { status, data } = response;
        
        switch (status) {
          case 401:
            // Unauthorized - redirect to login
            localStorage.removeItem('access_token');
            localStorage.removeItem('user');
            window.location.href = '/auth/login';
            break;
          case 403:
            toast.error('Access denied. You do not have permission to perform this action.');
            break;
          case 404:
            toast.error('Resource not found.');
            break;
          case 422:
            // Validation error
            if (data?.detail) {
              const errors = data.detail.map((err: any) => err.msg).join(', ');
              toast.error(errors);
            } else {
              toast.error('Validation error occurred.');
            }
            break;
          case 500:
            toast.error('Internal server error. Please try again later.');
            break;
          default:
            toast.error('An unexpected error occurred.');
        }
      } else {
        // Network error
        toast.error('Network error. Please check your connection.');
      }
      
      return Promise.reject(error);
    }
  );

  return client;
};

// Create service-specific clients
export const productApi = createApiClient(API_BASE_URLS.PRODUCT_SERVICE);
export const authApi = createApiClient(API_BASE_URLS.AUTH_SERVICE);
export const cartApi = createApiClient(API_BASE_URLS.CART_SERVICE);
export const orderApi = createApiClient(API_BASE_URLS.ORDER_SERVICE);
export const paymentApi = createApiClient(API_BASE_URLS.PAYMENT_SERVICE);
export const adminApi = createApiClient(API_BASE_URLS.ADMIN_SERVICE);

// Generic API wrapper for better error handling
export const apiWrapper = async <T>(
  apiCall: () => Promise<AxiosResponse<T>>,
  successMessage?: string
): Promise<T> => {
  try {
    const response = await apiCall();
    if (successMessage) {
      toast.success(successMessage);
    }
    return response.data;
  } catch (error) {
    // Error is already handled by interceptor
    throw error;
  }
};

// Health check function
export const checkServiceHealth = async (service: keyof typeof API_BASE_URLS): Promise<boolean> => {
  try {
    const client = createApiClient(API_BASE_URLS[service]);
    await client.get('/api/health');
    return true;
  } catch (error) {
    console.error(`${service} health check failed:`, error);
    return false;
  }
}; 