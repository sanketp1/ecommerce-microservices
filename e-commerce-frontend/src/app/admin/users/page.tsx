"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { adminService } from '@/lib/api/services';
import { useAdminAccess } from '@/lib/utils';
import { 
  Users, 
  Search, 
  Filter,
  User,
  Mail,
  Calendar,
  Shield,
  Eye,
  X,
  Phone,
  MapPin,
  Clock,
  Activity
} from 'lucide-react';

interface AdminUser {
  id: string;
  email: string;
  full_name?: string;
  is_admin?: boolean;
  created_at?: string;
  [key: string]: any; // For additional properties as per API docs
}

export default function AdminUsersPage() {
  const { isAuthenticated, user, isAdmin } = useAdminAccess();
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRole, setSelectedRole] = useState<string>("");
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
  const [showUserModal, setShowUserModal] = useState(false);

  useEffect(() => {
    async function fetchUsers() {
      if (!isAuthenticated || !isAdmin) {
        return;
      }
      
      setLoading(true);
      setError(null);
      try {
        const data = await adminService.getAllUsers();
        setUsers(data);
      } catch (err: any) {
        setError("Failed to load users.");
      } finally {
        setLoading(false);
      }
    }

    fetchUsers();
  }, [isAuthenticated, isAdmin]);

  const filteredUsers = users.filter(user => {
    const matchesSearch = (user.email?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
                         (user.full_name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
                         (user.id?.toLowerCase() || '').includes(searchTerm.toLowerCase());
    const matchesRole = !selectedRole || 
                       (selectedRole === 'admin' && user.is_admin) ||
                       (selectedRole === 'user' && !user.is_admin);
    return matchesSearch && matchesRole;
  });

  const getTotalUsers = () => users.length;
  const getAdminUsers = () => users.filter(user => user.is_admin).length;
  const getRegularUsers = () => users.filter(user => !user.is_admin).length;

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString();
    } catch {
      return 'Invalid Date';
    }
  };

  const formatDateTime = (dateString?: string) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleString();
    } catch {
      return 'Invalid Date';
    }
  };

  const handleViewUser = (user: AdminUser) => {
    setSelectedUser(user);
    setShowUserModal(true);
  };

  const closeUserModal = () => {
    setSelectedUser(null);
    setShowUserModal(false);
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
          <div className="text-center text-muted-foreground">Loading users...</div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <main className="container flex-1 py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">User Management</h1>
          <p className="text-muted-foreground">Manage user accounts and permissions</p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <Users className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Total Users</p>
                  <p className="text-2xl font-bold">{getTotalUsers()}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <Shield className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Admin Users</p>
                  <p className="text-2xl font-bold">{getAdminUsers()}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Regular Users</p>
                  <p className="text-2xl font-bold">{getRegularUsers()}</p>
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
                  placeholder="Search by email, name, or ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex gap-2">
                <select
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value)}
                  className="px-3 py-2 border border-input rounded-md bg-background"
                >
                  <option value="">All Roles</option>
                  <option value="admin">Admin</option>
                  <option value="user">User</option>
                </select>
                <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4 mr-2" />
                  Filter
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Users Table */}
        {error ? (
          <Card>
            <CardContent className="p-6">
              <div className="text-center text-red-500">{error}</div>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>Users ({filteredUsers.length})</CardTitle>
            </CardHeader>
            <CardContent>
              {filteredUsers.length === 0 ? (
                <div className="text-center text-muted-foreground py-8">
                  No users found matching your criteria.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-4 font-medium">User</th>
                        <th className="text-left py-3 px-4 font-medium">Email</th>
                        <th className="text-left py-3 px-4 font-medium">Role</th>
                        <th className="text-left py-3 px-4 font-medium">Joined</th>
                        <th className="text-left py-3 px-4 font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredUsers.map((user) => (
                        <tr key={user.id} className="border-b hover:bg-gray-50">
                          <td className="py-3 px-4">
                            <div className="flex items-center space-x-3">
                              <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center">
                                {user.full_name?.[0] || user.email?.[0] || 'U'}
                              </div>
                              <div>
                                <div className="font-medium">{user.full_name || 'N/A'}</div>
                                <div className="text-sm text-muted-foreground">ID: {user.id}</div>
                              </div>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-center space-x-2">
                              <Mail className="h-4 w-4 text-muted-foreground" />
                              <span>{user.email}</span>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <Badge variant={user.is_admin ? "default" : "secondary"}>
                              {user.is_admin ? "Admin" : "User"}
                            </Badge>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-center space-x-2">
                              <Calendar className="h-4 w-4 text-muted-foreground" />
                              <span>{formatDate(user.created_at)}</span>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleViewUser(user)}
                            >
                              <Eye className="h-4 w-4 mr-2" />
                              View
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* User Detail Modal */}
        {showUserModal && selectedUser && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between p-6 border-b">
                <h2 className="text-xl font-semibold">User Details</h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={closeUserModal}
                  className="h-8 w-8 p-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="p-6 space-y-6">
                {/* User Avatar and Basic Info */}
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-primary text-white rounded-full flex items-center justify-center text-xl font-semibold">
                    {selectedUser.full_name?.[0] || selectedUser.email?.[0] || 'U'}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">{selectedUser.full_name || 'N/A'}</h3>
                    <p className="text-muted-foreground">{selectedUser.email}</p>
                    <Badge variant={selectedUser.is_admin ? "default" : "secondary"} className="mt-1">
                      {selectedUser.is_admin ? "Administrator" : "Regular User"}
                    </Badge>
                  </div>
                </div>

                {/* User Information Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium">User ID</span>
                    </div>
                    <p className="text-sm text-muted-foreground font-mono">{selectedUser.id}</p>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium">Email Address</span>
                    </div>
                    <p className="text-sm text-muted-foreground">{selectedUser.email}</p>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium">Account Created</span>
                    </div>
                    <p className="text-sm text-muted-foreground">{formatDateTime(selectedUser.created_at)}</p>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <Activity className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium">Account Status</span>
                    </div>
                    <Badge variant="outline" className="text-green-600 border-green-600">
                      Active
                    </Badge>
                  </div>
                </div>

                {/* Additional User Data */}
                {Object.keys(selectedUser).length > 5 && (
                  <div className="space-y-3">
                    <h4 className="font-medium">Additional Information</h4>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <pre className="text-xs text-muted-foreground overflow-x-auto">
                        {JSON.stringify(selectedUser, null, 2)}
                      </pre>
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex justify-end space-x-3 pt-4 border-t">
                  <Button variant="outline" onClick={closeUserModal}>
                    Close
                  </Button>
                  <Button variant="outline" disabled>
                    Edit User
                  </Button>
                  <Button variant="outline" disabled>
                    Reset Password
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
} 