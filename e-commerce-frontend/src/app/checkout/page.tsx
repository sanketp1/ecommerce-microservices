"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { cartService, orderService, paymentService } from "@/lib/api/services";
import { CartResponse, OrderCreate, PaymentVerification } from "@/types/api";
import { useAuthStore } from "@/store/auth-store";
import { useCartStore } from "@/store/cart-store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "react-hot-toast";
import { log } from "console";

// Razorpay script loader
function loadRazorpayScript() {
  console.log("RAZORPAY_KEY_ID: " + process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID);
  return new Promise((resolve) => {
    if (document.getElementById("razorpay-script")) return resolve(true);
    const script = document.createElement("script");
    script.id = "razorpay-script";
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

export default function CheckoutPage() {
  const { user, isAuthenticated } = useAuthStore();
  const { clearCart: clearLocalCart } = useCartStore();
  const [cart, setCart] = useState<CartResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [placingOrder, setPlacingOrder] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [shipping, setShipping] = useState({
    name: user?.full_name || "",
    address: "",
    phone: "",
  });
  const router = useRouter();

  useEffect(() => {
    async function fetchCart() {
      setLoading(true);
      setError(null);
      try {
        const data = await cartService.getCart();
        setCart(data);
      } catch {
        setError("Failed to load cart.");
      } finally {
        setLoading(false);
      }
    }
    if (isAuthenticated) fetchCart();
  }, [isAuthenticated]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setShipping((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handlePlaceOrder = async () => {

    console.log("RAZORPAY_KEY_ID: " + process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID);
    
    if (!shipping.name || !shipping.address || !shipping.phone) {
      toast.error("Please fill in all shipping fields.");
      return;
    }
    if (!cart || cart.items.length === 0) {
      toast.error("Your cart is empty.");
      return;
    }
    setPlacingOrder(true);
    setError(null);
    try {
      // 1. Load Razorpay script
      const loaded = await loadRazorpayScript();
      if (!loaded) {
        toast.error("Failed to load Razorpay. Please try again.");
        setPlacingOrder(false);
        return;
      }
      // 2. Create payment order on backend
      const paymentOrder = await paymentService.createPaymentOrder();
      // 3. Open Razorpay modal
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID, // Use backend-provided key
        amount: paymentOrder.amount,
        currency: paymentOrder.currency || "INR",
        name: "ShopHub",
        description: "Order Payment",
        order_id: paymentOrder.order_id, // Use backend-provided order_id
        handler: async function (response: any) {
          // 4. Verify payment
          const verification: PaymentVerification = {
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
          };
          try {
            console.log(verification);
            await paymentService.verifyPayment(verification);
            // 5. Place order
            const orderData: OrderCreate = {
              user_id: user?.id || "",
              items: cart.items.map((item) => ({
                product_id: String(item.product_id),
                quantity: item.quantity,
                price: item.product?.price || 0,
              })),
              total_amount: cart.total,
            };
            const order = await orderService.createOrder(orderData);
            console.log(order);
            
           
            clearLocalCart();
            
            toast.success("Order placed successfully!");
            router.push(`/dashboard/orders/${order.order_id}`);
          } catch (err) {
            setError("Payment verification or order placement failed.");
            toast.error("Payment verification or order placement failed.");
          } finally {
            setPlacingOrder(false);
          }
        },
        prefill: {
          name: shipping.name,
          email: user?.email,
          contact: shipping.phone,
        },
        notes: {
          address: shipping.address,
        },
        theme: {
          color: "#10b981",
        },
        modal: {
          ondismiss: () => setPlacingOrder(false),
        },
      };
      // @ts-ignore
      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err: any) {
      setError("Failed to initiate payment. Please try again.");
      toast.error("Failed to initiate payment.");
      setPlacingOrder(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <main className="container flex-1 py-12 max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Checkout</h1>
        {loading ? (
          <div className="text-center text-muted-foreground">Loading cart...</div>
        ) : error ? (
          <div className="text-center text-red-500">{error}</div>
        ) : !cart || cart.items.length === 0 ? (
          <div className="text-center text-muted-foreground">Your cart is empty.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Shipping Info */}
            <Card>
              <CardHeader>
                <CardTitle>Shipping Info</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Name</label>
                  <Input
                    name="name"
                    value={shipping.name}
                    onChange={handleInputChange}
                    placeholder="Full Name"
                    disabled={placingOrder}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Address</label>
                  <Input
                    name="address"
                    value={shipping.address}
                    onChange={handleInputChange}
                    placeholder="Shipping Address"
                    disabled={placingOrder}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Phone</label>
                  <Input
                    name="phone"
                    value={shipping.phone}
                    onChange={handleInputChange}
                    placeholder="Phone Number"
                    disabled={placingOrder}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Order Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  {cart.items.map((item) => (
                    <div key={item.product_id} className="flex justify-between">
                      <span className="text-sm">
                        {item.product?.name} x {item.quantity}
                      </span>
                      <span className="text-sm font-medium">
                        ${(item.product?.price || 0) * item.quantity}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="border-t pt-4">
                  <div className="flex justify-between font-bold">
                    <span>Total</span>
                    <span>${cart.total}</span>
                  </div>
                </div>
                <Button
                  onClick={handlePlaceOrder}
                  disabled={placingOrder}
                  className="w-full"
                >
                  {placingOrder ? "Processing..." : "Place Order"}
                </Button>
              </CardContent>
            </Card>
          </div>
        )}
      </main>
    </div>
  );
} 