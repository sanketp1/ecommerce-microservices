"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { orderService } from "@/lib/api/services";
import { Order, OrderStatus } from "@/types/api";
import { useAuthStore } from "@/store/auth-store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const STATUS_STEPS: OrderStatus[] = [
  "pending",
  "confirmed",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
];

function StatusTimeline({ status }: { status: OrderStatus }) {
  const currentStep = STATUS_STEPS.indexOf(status);
  return (
    <div className="flex items-center gap-2 my-4 overflow-x-auto">
      {STATUS_STEPS.filter((s) => s !== "cancelled").map((step, idx) => (
        <div key={step} className="flex items-center">
          <div
            className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold
              ${idx <= currentStep ? "bg-primary text-white" : "bg-gray-200 text-gray-400"}
            `}
          >
            {idx + 1}
          </div>
          <span className={`ml-2 mr-4 text-sm ${idx <= currentStep ? "text-primary" : "text-gray-400"}`}>{step.charAt(0).toUpperCase() + step.slice(1)}</span>
          {idx < STATUS_STEPS.length - 2 && (
            <div className={`w-8 h-1 ${idx < currentStep ? "bg-primary" : "bg-gray-200"} rounded-full`} />
          )}
        </div>
      ))}
    </div>
  );
}

export default function OrderDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  if (!id || id === 'undefined') {
    return (
      <div className="min-h-screen flex flex-col">
        <main className="container flex-1 py-12 flex items-center justify-center">
          <div className="text-center text-red-500">Invalid order ID.</div>
        </main>
      </div>
    );
  }

  useEffect(() => {
    async function fetchOrder() {
      setLoading(true);
      setError(null);
      try {
        const data = await orderService.getOrder(id);
        setOrder(data);
      } catch (err: any) {
        setError("Failed to load order details.");
      } finally {
        setLoading(false);
      }
    }
    if (isAuthenticated && id && id !== 'undefined') fetchOrder();
  }, [isAuthenticated, id]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <main className="container flex-1 py-12 flex items-center justify-center">
          <div className="text-center text-muted-foreground">Loading order details...</div>
        </main>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen flex flex-col">
        <main className="container flex-1 py-12 flex items-center justify-center">
          <div className="text-center text-red-500">{error || "Order not found."}</div>
          <Button className="mt-4" onClick={() => router.back()}>Go Back</Button>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <main className="container flex-1 py-12 max-w-3xl mx-auto">
        <Card className="mb-8">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-lg font-bold">Order #{order.order_id.slice(-6).toUpperCase()}</CardTitle>
            <Badge variant="outline" className="capitalize">{order.status}</Badge>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-muted-foreground mb-2">
              Placed on {new Date(order.created_at).toLocaleDateString()}<br />
              Last updated {new Date(order.updated_at).toLocaleString()}
            </div>
            <StatusTimeline status={order.status} />
            <div className="mt-4">
              <h2 className="font-semibold mb-2">Order Items</h2>
              <div className="divide-y">
                {order.items.map((item) => (
                  <div key={item.product_id} className="py-2 flex items-center justify-between">
                    <div>
                      <div className="font-medium">{item.product?.name || "Product"}</div>
                      <div className="text-xs text-muted-foreground">Qty: {item.quantity}</div>
                    </div>
                    <div className="font-semibold">${(item.price || 0).toFixed(2)}</div>
                  </div>
                ))}
              </div>
              <div className="flex justify-end mt-4">
                <span className="font-bold">Total: ${(order.total_amount || 0).toFixed(2)}</span>
              </div>
            </div>
            <div className="mt-6">
              <h2 className="font-semibold mb-2">Shipping & Tracking</h2>
              <div className="text-sm text-muted-foreground">(Shipping info integration coming soon)</div>
              {/* You can add shipping address, tracking number, etc. here if available */}
            </div>
          </CardContent>
        </Card>
        <div className="flex gap-2">
          <Link href="/dashboard/orders">
            <Button variant="outline">Back to Orders</Button>
          </Link>
        </div>
      </main>
    </div>
  );
} 