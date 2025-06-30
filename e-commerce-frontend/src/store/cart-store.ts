import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CartItemResponse, Product } from '@/types/api';
import { cartService } from '@/lib/api/services';

interface CartState {
  items: CartItemResponse[];
  total: number;
  isLoading: boolean;
}

interface CartActions {
  setCart: (items: CartItemResponse[], total: number) => void;
  addItem: (item: CartItemResponse) => void;
  removeItem: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
  setLoading: (loading: boolean) => void;
  getItemCount: () => number;
  getItemQuantity: (productId: number) => number;
  syncCart: () => Promise<void>;
}

type CartStore = CartState & CartActions;

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      // State
      items: [],
      total: 0,
      isLoading: false,

      // Actions
      setCart: (items, total) =>
        set({
          items,
          total,
        }),

      addItem: (item) =>
        set((state) => {
          const existingItem = state.items.find(
            (i) => i.product_id === item.product_id
          );

          if (existingItem) {
            const updatedItems = state.items.map((i) =>
              i.product_id === item.product_id
                ? { ...i, quantity: i.quantity + item.quantity }
                : i
            );
            return {
              items: updatedItems,
              total: updatedItems.reduce(
                (sum, item) => sum + (item.product?.price || 0) * item.quantity,
                0
              ),
            };
          } else {
            const newItems = [...state.items, item];
            return {
              items: newItems,
              total: newItems.reduce(
                (sum, item) => sum + (item.product?.price || 0) * item.quantity,
                0
              ),
            };
          }
        }),

      removeItem: (productId) =>
        set((state) => {
          const updatedItems = state.items.filter(
            (item) => item.product_id !== productId
          );
          return {
            items: updatedItems,
            total: updatedItems.reduce(
              (sum, item) => sum + (item.product?.price || 0) * item.quantity,
              0
            ),
          };
        }),

      updateQuantity: (productId, quantity) =>
        set((state) => {
          const updatedItems = state.items.map((item) =>
            item.product_id === productId ? { ...item, quantity } : item
          );
          return {
            items: updatedItems,
            total: updatedItems.reduce(
              (sum, item) => sum + (item.product?.price || 0) * item.quantity,
              0
            ),
          };
        }),

      clearCart: () =>
        set({
          items: [],
          total: 0,
        }),

      setLoading: (isLoading) =>
        set({
          isLoading,
        }),

      getItemCount: () => {
        const state = get();
        return state.items.reduce((sum, item) => sum + item.quantity, 0);
      },

      getItemQuantity: (productId) => {
        const state = get();
        const item = state.items.find((i) => i.product_id === productId);
        return item?.quantity || 0;
      },

      syncCart: async () => {
        try {
          const response = await cartService.getCart();
          set({
            items: response.items || [],
            total: response.total || 0,
          });
        } catch (error) {
          console.error('Error syncing cart:', error);
          // If there's an error, clear the local cart to avoid inconsistency
          set({
            items: [],
            total: 0,
          });
        }
      },
    }),
    {
      name: 'cart-storage',
      partialize: (state) => ({
        items: state.items,
        total: state.total,
      }),
    }
  )
); 