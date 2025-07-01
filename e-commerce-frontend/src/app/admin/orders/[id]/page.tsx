"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { adminService } from '@/lib/api/services';
import { OrderStatus } from '@/types/api';
import { useAdminAccess } from '@/lib/utils';
import { 
  ArrowLeft,
  User,
  Calendar,
  Package,
  DollarSign,
  Clock,
  MapPin,
  Phone,
  Mail,
  Edit
} from 'lucide-react';
import Link from 'next/link';

const STATUS_COLORS: Record<OrderStatus, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  confirmed: 'bg-blue-100 text-blue-800',
  processing: 'bg-purple-100 text-purple-800',
  shipped: 'bg-indigo-100 text-indigo-800',
  delivered: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
};

const STATUS_OPTIONS: OrderStatus[] = [
  'pending',
  'confirmed', 
  'processing',
  'shipped',
  'delivered',
  'cancelled'
];

interface AdminOrder {
  order_id?: string;
  user_id?: string;
  items?: any[];
  total_amount?: number;
  status?: OrderStatus;
  created_at?: string;
  updated_at?: string;
  shipping_address?: string;
  user?: {
    email?: string;
    full_name?: string;
    phone?: string;
  };
  [key: string]: any;
}

export default function AdminOrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { id } = params;
  const { isAuthenticated, user, isAdmin } = useAdminAccess();
  const [order, setOrder] = useState<AdminOrder | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  useEffect(() => {
    async function fetchOrder() {
      if (!isAuthenticated || !isAdmin) {
        setError("Access denied. isAuthenticated: " + isAuthenticated + " isAdmin: " + isAdmin);
        setLoading(false);
        return;
      }
      
      if (!id || typeof id !== 'string') {
        setError("Invalid order ID");
        setLoading(false);
        return;
      }
      
      setLoading(true);
      setError(null);
      try {
        // Since admin API doesn't have a GET single order endpoint, 
        // we'll fetch all orders and find the specific one
        const allOrders = await adminService.getAllOrders();
        
        const foundOrder = allOrders.find((o: AdminOrder) => o.order_id === id);
        if (foundOrder) {
          setOrder(foundOrder);
        } else {
          setError("Order not found");
        }
      } catch (err: any) {
        console.error('Admin Order Detail - Error fetching order:', err);
        setError("Failed to load order details.");
      } finally {
        setLoading(false);
      }
    }

    fetchOrder();
  }, [isAuthenticated, isAdmin, id]);

  const handleStatusUpdate = async (newStatus: OrderStatus) => {
    if (!order?.order_id) return;
    
    try {
      setUpdatingStatus(true);
      await adminService.updateOrderStatus(order.order_id, { status: newStatus });
      setOrder(prev => prev ? { ...prev, status: newStatus, updated_at: new Date().toISOString() } : null);
    } catch (err: any) {
      console.error('Error updating order status:', err);
      alert("Failed to update order status.");
    } finally {
      setUpdatingStatus(false);
    }
  };

  const getStatusBadge = (status: OrderStatus) => (
    <Badge className={STATUS_COLORS[status]}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </Badge>
  );

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleString();
    } catch {
      return 'Invalid Date';
    }
  };

  const formatPrice = (price?: number) => {
    if (price === undefined || price === null) return '$0.00';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  if (!isAuthenticated || !isAdmin) {
    return (
      <div className="min-h-screen flex flex-col">
        <main className="container flex-1 py-12 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-red-600 mb-4">Access Denied</h1>
            <p className="text-muted-foreground">You don't have permission to access the admin panel.</p>
            <div className="mt-4 text-sm text-gray-500">
              <p>Debug Info:</p>
              <p>Authenticated: {isAuthenticated ? 'Yes' : 'No'}</p>
              <p>User Role: {user ? (user.is_admin ? 'admin' : 'user') : 'None'}</p>
              <p>Is Admin: {user?.is_admin ? 'Yes' : 'No'}</p>
              <p>User ID: {user?.id || 'None'}</p>
            </div>
          </div>
        </main>
      </div>
    );
  }

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
          <div className="text-center">
            <h1 className="text-2xl font-bold text-red-600 mb-4">Order Not Found</h1>
            <p className="text-muted-foreground mb-6">{error || "The requested order could not be found."}</p>
            <Link href="/admin/orders">
              <Button>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Orders
              </Button>
            </Link>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <main className="container flex-1 py-12">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/admin/orders">
                <Button variant="outline" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Orders
                </Button>
              </Link>
              <div>
                <h1 className="text-3xl font-bold">Order #{order.order_id}</h1>
                <p className="text-muted-foreground">Order details and management</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              {getStatusBadge(order.status || 'pending')}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Order Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Package className="h-5 w-5" />
                  <span>Order Information</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Order ID</label>
                    <p className="font-mono text-sm">{order.order_id}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Status</label>
                    <div className="mt-1">
                      {getStatusBadge(order.status || 'pending')}
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Created</label>
                    <p className="text-sm">{formatDate(order.created_at)}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Updated</label>
                    <p className="text-sm">{formatDate(order.updated_at)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Order Items */}
            <Card>
              <CardHeader>
                <CardTitle>Order Items</CardTitle>
              </CardHeader>
              <CardContent>
                {order.items && order.items.length > 0 ? (
                  <div className="space-y-4">
                    {order.items.map((item: any, index: number) => (
                      <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                            {item.product?.image_url ? (
                              <img 
                                src={item.product.image_url} 
                                alt={item.product.name} 
                                className="w-full h-full object-cover rounded-lg"
                              />
                            ) : (
                              <Package className="h-6 w-6 text-gray-400" />
                            )}
                          </div>
                          <div>
                            <p className="font-medium">{item.product?.name || 'Product'}</p>
                            <p className="text-sm text-muted-foreground">
                              Quantity: {item.quantity} × {formatPrice(item.price)}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">{formatPrice((item.price || 0) * (item.quantity || 0))}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center text-muted-foreground py-8">
                    No items found in this order.
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Customer Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <User className="h-5 w-5" />
                  <span>Customer</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Customer ID</label>
                  <p className="font-mono text-sm">{order.user_id}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Name</label>
                  <p className="text-sm">{order.user?.full_name || 'N/A'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Email</label>
                  <p className="text-sm">{order.user?.email || 'N/A'}</p>
                </div>
                {order.user?.phone && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Phone</label>
                    <p className="text-sm">{order.user.phone}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Order Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <DollarSign className="h-5 w-5" />
                  <span>Order Summary</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>{formatPrice(order.total_amount)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span>Free</span>
                  </div>
                  <div className="border-t pt-2">
                    <div className="flex justify-between font-bold">
                      <span>Total</span>
                      <span>{formatPrice(order.total_amount)}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Status Update */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Edit className="h-5 w-5" />
                  <span>Update Status</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <select
                    value={order.status || 'pending'}
                    onChange={(e) => handleStatusUpdate(e.target.value as OrderStatus)}
                    disabled={updatingStatus}
                    className="w-full px-3 py-2 border border-input rounded-md bg-background"
                  >
                    {STATUS_OPTIONS.map(status => (
                      <option key={status} value={status}>
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                      </option>
                    ))}
                  </select>
                  {updatingStatus && (
                    <p className="text-sm text-muted-foreground">Updating status...</p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Shipping Information */}
            {order.shipping_address && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <MapPin className="h-5 w-5" />
                    <span>Shipping Address</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm">{order.shipping_address}</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>
    </div>
  );
} 