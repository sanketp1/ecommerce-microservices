"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { adminService } from '@/lib/api/services';
import { OrderStatus } from '@/types/api';
import { useAdminAccess } from '@/lib/utils';
import { 
  Search, 
  Filter,
  Eye,
  Clock,
  ShoppingCart,
  DollarSign,
  User,
  Calendar
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
  [key: string]: any; // For additional properties as per API docs
}

export default function AdminOrdersPage() {
  const { isAuthenticated, user, isAdmin } = useAdminAccess();
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<OrderStatus | "">("");
  const [selectedDateRange, setSelectedDateRange] = useState("");

  useEffect(() => {
    async function fetchOrders() {
      if (!isAuthenticated || !isAdmin) {
        return;
      }
      
      setLoading(true);
      setError(null);
      try {
        const data = await adminService.getAllOrders();
        setOrders(data);
      } catch (err: any) {
        setError("Failed to load orders.");
      } finally {
        setLoading(false);
      }
    }

    fetchOrders();
  }, [isAuthenticated, isAdmin]);

  const filteredOrders = orders.filter(order => {
    const matchesSearch = (order.order_id?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
                         (order.user_id?.toLowerCase() || '').includes(searchTerm.toLowerCase());
    const matchesStatus = !selectedStatus || order.status === selectedStatus;
    
    let matchesDate = true;
    if (selectedDateRange) {
      try {
        const orderDate = new Date(order.created_at || '');
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);
        const lastWeek = new Date(today);
        lastWeek.setDate(lastWeek.getDate() - 7);
        const lastMonth = new Date(today);
        lastMonth.setMonth(lastMonth.getMonth() - 1);

        switch (selectedDateRange) {
          case 'today':
            matchesDate = orderDate.toDateString() === today.toDateString();
            break;
          case 'yesterday':
            matchesDate = orderDate.toDateString() === yesterday.toDateString();
            break;
          case 'last-week':
            matchesDate = orderDate >= lastWeek;
            break;
          case 'last-month':
            matchesDate = orderDate >= lastMonth;
            break;
        }
      } catch (error) {
        matchesDate = false;
      }
    }

    return matchesSearch && matchesStatus && matchesDate;
  });

  const handleStatusUpdate = async (orderId: string, newStatus: OrderStatus) => {
    try {
      await adminService.updateOrderStatus(orderId, { status: newStatus });
      setOrders(orders.map(order => 
        order.order_id === orderId 
          ? { ...order, status: newStatus, updated_at: new Date().toISOString() }
          : order
      ));
    } catch (err: any) {
      alert("Failed to update order status.");
    }
  };

  const getStatusBadge = (status: OrderStatus) => (
    <Badge className={STATUS_COLORS[status]}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </Badge>
  );

  const getTotalRevenue = () => {
    return orders.reduce((total, order) => total + (order.total_amount || 0), 0);
  };

  const getOrdersByStatus = (status: OrderStatus) => {
    return orders.filter(order => order.status === status).length;
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
          <div className="text-center text-muted-foreground">Loading orders...</div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <main className="container flex-1 py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Order Management</h1>
          <p className="text-muted-foreground">Manage and track customer orders</p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Total Orders</p>
                  <p className="text-2xl font-bold">{orders.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <DollarSign className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Total Revenue</p>
                  <p className="text-2xl font-bold">${getTotalRevenue().toFixed(2)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Pending</p>
                  <p className="text-2xl font-bold">{getOrdersByStatus('pending')}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Delivered</p>
                  <p className="text-2xl font-bold">{getOrdersByStatus('delivered')}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by order ID or user ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex gap-2">
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value as OrderStatus | "")}
                  className="px-3 py-2 border border-input rounded-md bg-background"
                >
                  <option value="">All Statuses</option>
                  {STATUS_OPTIONS.map(status => (
                    <option key={status} value={status}>
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </option>
                  ))}
                </select>
                <select
                  value={selectedDateRange}
                  onChange={(e) => setSelectedDateRange(e.target.value)}
                  className="px-3 py-2 border border-input rounded-md bg-background"
                >
                  <option value="">All Time</option>
                  <option value="today">Today</option>
                  <option value="yesterday">Yesterday</option>
                  <option value="last-week">Last Week</option>
                  <option value="last-month">Last Month</option>
                </select>
                <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4 mr-2" />
                  Filter
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Orders Table */}
        {error ? (
          <Card>
            <CardContent className="p-6">
              <div className="text-center text-red-500">{error}</div>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>Orders ({filteredOrders.length})</CardTitle>
            </CardHeader>
            <CardContent>
              {filteredOrders.length > 0 ? (
                <div className="space-y-4">
                  {filteredOrders.map((order) => (
                    <div key={order.order_id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-4">
                          <div>
                            <h3 className="font-semibold">Order #{order.order_id?.slice(-6).toUpperCase()}</h3>
                            <p className="text-sm text-muted-foreground">
                              User ID: {order.user_id}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-4">
                          {getStatusBadge(order.status || 'pending')}
                          <div className="text-right">
                            <p className="font-semibold">${(order.total_amount || 0).toFixed(2)}</p>
                            <p className="text-sm text-muted-foreground">
                              {new Date(order.created_at || '').toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                          <Calendar className="h-4 w-4" />
                          <span>Created: {new Date(order.created_at || '').toLocaleString()}</span>
                          <span>•</span>
                          <span>Updated: {new Date(order.updated_at || '').toLocaleString()}</span>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <select
                            value={order.status || 'pending'}
                            onChange={(e) => handleStatusUpdate(order.order_id || '', e.target.value as OrderStatus)}
                            className="px-2 py-1 text-sm border border-input rounded bg-background"
                          >
                            {STATUS_OPTIONS.map(status => (
                              <option key={status} value={status}>
                                {status.charAt(0).toUpperCase() + status.slice(1)}
                              </option>
                            ))}
                          </select>
                          <Link href={`/admin/orders/${order.order_id}`}>
                            <Button variant="outline" size="sm">
                              <Eye className="h-4 w-4 mr-2" />
                              View Details
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <ShoppingCart className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No orders found</p>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  )
} 