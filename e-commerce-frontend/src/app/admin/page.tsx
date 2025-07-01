"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { adminService } from '@/lib/api/services';
import { DashboardResponse, Order, OrderStatus } from '@/types/api';
import { useAuthStore } from '@/store/auth-store';
import { useAdminAccess } from '@/lib/utils';
import Link from 'next/link';
import { 
  Users, 
  Package, 
  ShoppingCart, 
  DollarSign, 
  TrendingUp, 
  Clock,
  Eye,
  ArrowRight
} from 'lucide-react';

const STATUS_COLORS: Record<OrderStatus, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  confirmed: 'bg-blue-100 text-blue-800',
  processing: 'bg-purple-100 text-purple-800',
  shipped: 'bg-indigo-100 text-indigo-800',
  delivered: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
};

export default function AdminDashboardPage() {
  const { isAuthenticated, user, isAdmin } = useAdminAccess();
  const [dashboardData, setDashboardData] = useState<DashboardResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchDashboardData() {
      if (!isAuthenticated || !isAdmin) {
        return;
      }
      
      setLoading(true);
      setError(null);
      try {
        const data = await adminService.getDashboard();
        setDashboardData(data);
      } catch (err: any) {
        setError("Failed to load dashboard data.");
      } finally {
        setLoading(false);
      }
    }

    fetchDashboardData();
  }, [isAuthenticated, isAdmin]);

  if (!isAuthenticated || !isAdmin) {
    return (
      <div className="min-h-screen flex flex-col">
        <div className="container flex-1 py-12 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-red-600 mb-4">Access Denied</h1>
            <p className="text-muted-foreground">You don't have permission to access the admin dashboard.</p>
            <div className="mt-4 text-sm text-gray-500">
              <p>Debug Info:</p>
              <p>Authenticated: {isAuthenticated ? 'Yes' : 'No'}</p>
              <p>User Role: {user ? (user.is_admin ? 'admin' : 'user') : 'None'}</p>
              <p>Is Admin: {user?.is_admin ? 'Yes' : 'No'}</p>
              <p>User ID: {user?.id || 'None'}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <div className="container flex-1 py-12 flex items-center justify-center">
          <div className="text-center text-muted-foreground">Loading dashboard...</div>
        </div>
      </div>
    );
  }

  if (error || !dashboardData) {
    return (
      <div className="min-h-screen flex flex-col">
        <div className="container flex-1 py-12 flex items-center justify-center">
          <div className="text-center text-red-500">{error || "Failed to load dashboard data."}</div>
        </div>
      </div>
    );
  }

  const { stats, recent_orders } = dashboardData;

  return (
    <div className="min-h-screen flex flex-col">
      <div className="container flex-1 py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
          <p className="text-muted-foreground">Welcome back, {user && user.full_name}</p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total_users.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                <TrendingUp className="inline h-3 w-3 mr-1" />
                +12% from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Products</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total_products.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                <TrendingUp className="inline h-3 w-3 mr-1" />
                +5% from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
              <ShoppingCart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total_orders.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                <TrendingUp className="inline h-3 w-3 mr-1" />
                +8% from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${stats.total_revenue.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                <TrendingUp className="inline h-3 w-3 mr-1" />
                +15% from last month
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Link href="/admin/products">
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <Package className="h-8 w-8 text-primary" />
                  <div>
                    <h3 className="font-semibold">Manage Products</h3>
                    <p className="text-sm text-muted-foreground">Add, edit, or remove products</p>
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground ml-auto" />
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link href="/admin/orders">
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <ShoppingCart className="h-8 w-8 text-primary" />
                  <div>
                    <h3 className="font-semibold">Manage Orders</h3>
                    <p className="text-sm text-muted-foreground">View and update order status</p>
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground ml-auto" />
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link href="/admin/users">
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <Users className="h-8 w-8 text-primary" />
                  <div>
                    <h3 className="font-semibold">Manage Users</h3>
                    <p className="text-sm text-muted-foreground">View and manage user accounts</p>
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground ml-auto" />
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>

        {/* Recent Orders */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Recent Orders</CardTitle>
              <Link href="/admin/orders">
                <Button variant="outline" size="sm">
                  View All Orders
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            {recent_orders && recent_orders.length > 0 ? (
              <div className="space-y-4">
                {recent_orders.slice(0, 5).map((order: any) => {
                  // Handle different possible user data structures
                  const getUserDisplayName = (order: any) => {
                    if (order.user?.full_name) return order.user.full_name;
                    if (order.user?.email) return order.user.email;
                    if (order.user_id) return `User ${order.user_id.slice(-6)}`;
                    return 'Unknown User';
                  };

                  return (
                    <div key={order.order_id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div>
                          <p className="font-medium">Order #{order.order_id?.slice(-6)?.toUpperCase() || 'N/A'}</p>
                          <p className="text-sm text-muted-foreground">
                            {getUserDisplayName(order)}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <Badge className={STATUS_COLORS[order.status as OrderStatus] || 'bg-gray-100 text-gray-800'}>
                          {order.status}
                        </Badge>
                        <div className="text-right">
                          <p className="font-medium">${(order.total_amount || 0).toFixed(2)}</p>
                          <p className="text-sm text-muted-foreground">
                            {new Date(order.created_at).toLocaleDateString()}
                          </p>
                        </div>
                        <Link href={`/admin/orders/${order.order_id}`}>
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Clock className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No recent orders</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 