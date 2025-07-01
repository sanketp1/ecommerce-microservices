"use client";

import { useEffect, useState } from "react";
import { cartService } from "@/lib/api/services";
import { CartItemResponse, CartResponse } from "@/types/api";
import { useAuthStore } from "@/store/auth-store";
import { useCartStore } from "@/store/cart-store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { toast } from "react-hot-toast";

export default function CartPage() {
  const { isAuthenticated } = useAuthStore();
  const { items, setCart, updateQuantity, removeItem, syncCart } = useCartStore();
  const [cart, setCartState] = useState<CartResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const fetchCart = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await cartService.getCart();
      setCartState(data);
      setCart(data.items, data.total);
    } catch (err: any) {
      setError("Failed to load cart.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      // Sync cart with backend first, then fetch detailed cart data
      syncCart().then(() => {
        fetchCart();
      });
    }
    // eslint-disable-next-line
  }, [isAuthenticated]);

  const handleUpdateQuantity = async (product_id: string, quantity: number) => {
    if (quantity < 1) return;
    setUpdatingId(product_id);
    // Optimistic update
    const prevItems = [...items];
    updateQuantity(product_id, quantity);
    const updatedItems = items.map((item) =>
      item.product_id === product_id ? { ...item, quantity } : item
    );
    const newTotal = updatedItems.reduce(
      (sum, item) => sum + (item.product?.price || 0) * item.quantity,
      0
    );
    setCart(updatedItems, newTotal);
    setCartState({ items: updatedItems, total: newTotal });
    try {
      await cartService.updateQuantity(product_id, quantity);
      // Sync cart with backend to ensure consistency
      await syncCart();
      toast.success("Cart updated");
    } catch {
      // Revert on error
      setCart(prevItems, cart?.total || 0);
      setCartState((prev) => prev ? { ...prev, items: prevItems } : prev);
      toast.error("Failed to update cart");
    } finally {
      setUpdatingId(null);
    }
  };

  const handleRemove = async (product_id: string) => {
    setUpdatingId(product_id);
    // Optimistic update
    const prevItems = [...items];
    removeItem(product_id);
    const updatedItems = items.filter((item) => item.product_id !== product_id);
    const newTotal = updatedItems.reduce(
      (sum, item) => sum + (item.product?.price || 0) * item.quantity,
      0
    );
    setCart(updatedItems, newTotal);
    setCartState({ items: updatedItems, total: newTotal });
    try {
      await cartService.removeFromCart(product_id);
      // Sync cart with backend to ensure consistency
      await syncCart();
      toast.success("Item removed");
    } catch {
      // Revert on error
      setCart(prevItems, cart?.total || 0);
      setCartState((prev) => prev ? { ...prev, items: prevItems } : prev);
      toast.error("Failed to remove item");
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <main className="container flex-1 py-12 max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Your Cart</h1>
        {loading ? (
          <div className="text-center text-muted-foreground">Loading cart...</div>
        ) : error ? (
          <div className="text-center text-red-500">{error}</div>
        ) : !cart || cart.items.length === 0 ? (
          <div className="text-center text-muted-foreground">Your cart is empty.</div>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>Cart Items</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col min-h-[400px]">
              <div className="divide-y flex-1">
                {cart.items.map((item) => (
                  <div key={item.product_id} className="py-4 flex items-center justify-between gap-4">
                    <div className="w-16 h-16 flex-shrink-0 rounded-md overflow-hidden bg-gray-100 border">
                      {item.product?.image_url ? (
                        <img
                          src={item.product.image_url}
                          alt={item.product.name}
                          className="object-cover w-full h-full"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-xs text-gray-400">No Image</div>
                      )}
                    </div>
                    <div className="flex-1 ml-4">
                      <div className="font-medium">{item.product?.name || "Product"}</div>
                      <div className="text-xs text-muted-foreground">${item.product?.price?.toFixed(2) || "-"}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        size="icon"
                        variant="outline"
                        disabled={updatingId === item.product_id}
                        onClick={() => handleUpdateQuantity(item.product_id, item.quantity - 1)}
                        aria-label="Decrease quantity"
                      >
                        -
                      </Button>
                      <Input
                        type="number"
                        min={1}
                        value={item.quantity}
                        onChange={(e) => handleUpdateQuantity(item.product_id, Number(e.target.value))}
                        className="w-16 text-center"
                        disabled={updatingId === item.product_id}
                      />
                      <Button
                        size="icon"
                        variant="outline"
                        disabled={updatingId === item.product_id}
                        onClick={() => handleUpdateQuantity(item.product_id, item.quantity + 1)}
                        aria-label="Increase quantity"
                      >
                        +
                      </Button>
                    </div>
                    <div className="w-20 text-right font-semibold">
                      ${item.product && item.product.price ? (item.product.price * item.quantity).toFixed(2) : "-"}
                    </div>
                    <Button
                      size="icon"
                      variant="destructive"
                      disabled={updatingId === item.product_id}
                      onClick={() => handleRemove(item.product_id)}
                      aria-label="Remove item"
                    >
                      ×
                    </Button>
                  </div>
                ))}
              </div>
              <div className="flex justify-between items-center mt-6">
                <span className="font-bold text-lg">Total:</span>
                <span className="font-bold text-lg">${cart.total.toFixed(2)}</span>
              </div>
              <div className="flex justify-end mt-6 border-t pt-6 bg-white sticky bottom-0 z-10">
                <Link href="/checkout" className="w-full">
                  <Button size="lg" className="w-full" disabled={loading || !cart || cart.items.length === 0}>
                    Proceed to Checkout
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
} 