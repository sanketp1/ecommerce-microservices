"use client";

import { useEffect, useState } from "react";
import { orderService } from "@/lib/api/services";
import { Order } from "@/types/api";
import { useAuthStore } from "@/store/auth-store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function OrdersPage() {
  const { isAuthenticated } = useAuthStore();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchOrders() {
      setLoading(true);
      setError(null);
      try {
        const data = await orderService.getOrders();
        setOrders(data);
      } catch (err: any) {
        setError("Failed to load orders.");
      } finally {
        setLoading(false);
      }
    }
    if (isAuthenticated) fetchOrders();
  }, [isAuthenticated]);

  return (
    <div className="min-h-screen flex flex-col">
      <main className="container flex-1 py-12">
        <div className="mb-12">
          <h1 className="text-2xl font-bold mb-4">Order History</h1>
          {loading ? (
            <div className="text-center text-muted-foreground">Loading orders...</div>
          ) : error ? (
            <div className="text-center text-red-500">{error}</div>
          ) : orders.length === 0 ? (
            <div className="text-center text-muted-foreground">No orders found.</div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <Card key={order.order_id || Math.random()}>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-base font-medium">
                      Order #{order.order_id ? order.order_id.slice(-6).toUpperCase() : 'UNKNOWN'}
                    </CardTitle>
                    <Badge variant="outline" className="capitalize">
                      {order.status}
                    </Badge>
                  </CardHeader>
                  <CardContent className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                    <div>
                      <div className="text-sm text-muted-foreground">
                        Placed on {order.created_at ? new Date(order.created_at).toLocaleDateString() : 'N/A'}
                      </div>
                      <div className="text-sm">
                        {order.items?.length ?? 0} item{order.items && order.items.length !== 1 ? "s" : ""}
                      </div>
                      <div className="text-sm font-semibold mt-1">
                        Total: ${order.total_amount != null ? Number(order.total_amount).toFixed(2) : '0.00'}
                      </div>
                    </div>
                    <div className="flex gap-2 mt-2 md:mt-0">
                      {order.order_id ? (
                        <Link href={`/dashboard/orders/${order.order_id}`}>
                          <Button size="sm" variant="outline">
                            View Details
                          </Button>
                        </Link>
                      ) : (
                        <Button size="sm" variant="outline" disabled>
                          No Details
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
} 