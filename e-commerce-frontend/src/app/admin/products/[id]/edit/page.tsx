"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { adminService, productService } from '@/lib/api/services';
import { Product, ProductUpdate } from '@/types/api';
import { useAdminAccess } from '@/lib/utils';
import { 
  ArrowLeft,
  Save,
  Upload,
  Package,
  DollarSign,
  Hash,
  FileText,
  Tag
} from 'lucide-react';
import Link from 'next/link';

export default function EditProductPage() {
  const params = useParams();
  const router = useRouter();
  const { id } = params;
  const { isAuthenticated, user, isAdmin } = useAdminAccess();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [categories, setCategories] = useState<string[]>([]);
  const [product, setProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState<ProductUpdate>({
    name: '',
    description: '',
    price: 0,
    category: '',
    stock: 0,
    image_url: ''
  });

  useEffect(() => {
    async function loadData() {
      if (!isAuthenticated || !isAdmin) {
        setError("Access denied. isAuthenticated: No, isAdmin: No");
        setLoading(false);
        return;
      }
      
      if (!id || typeof id !== 'string') {
        setError("Invalid product ID");
        setLoading(false);
        return;
      }
      
      setLoading(true);
      setError(null);
      try {
        const [productData, categoriesData] = await Promise.all([
          productService.getProduct(id),
          productService.getCategories()
        ]);
        
        setProduct(productData);
        setCategories(categoriesData);
        
        // Pre-populate form with existing product data
        setFormData({
          name: productData.name || '',
          description: productData.description || '',
          price: productData.price || 0,
          category: productData.category || '',
          stock: productData.stock || 0,
          image_url: productData.image_url || ''
        });
      } catch (err: any) {
        console.error('Admin Edit Product - Error loading data:', err);
        setError("Failed to load product data.");
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [isAuthenticated, isAdmin, id]);

  const handleInputChange = (field: keyof ProductUpdate, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!id || typeof id !== 'string') {
      setError("Invalid product ID");
      return;
    }
    
    if (!formData.name || !formData.category || formData.price == null || formData.price <= 0) {
      setError("Please fill in all required fields.");
      return;
    }

    setSaving(true);
    setError(null);

    try {
      await adminService.updateProduct(id, formData);
      router.push('/admin/products');
    } catch (err: any) {
      console.error('Error updating product:', err);
      setError(err.message || "Failed to update product.");
    } finally {
      setSaving(false);
    }
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
              <p>User Role: {user?.is_admin ? 'Yes' : 'No'}</p>
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
          <div className="text-center text-muted-foreground">Loading product...</div>
        </main>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen flex flex-col">
        <main className="container flex-1 py-12 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-red-600 mb-4">Product Not Found</h1>
            <p className="text-muted-foreground mb-6">{error || "The requested product could not be found."}</p>
            <Link href="/admin/products">
              <Button>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Products
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
          <div className="flex items-center space-x-4">
            <Link href="/admin/products">
              <Button variant="outline" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Products
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold">Edit Product</h1>
              <p className="text-muted-foreground">Update product information</p>
            </div>
          </div>
        </div>

        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Package className="h-5 w-5" />
                <span>Product Information</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-md">
                    <p className="text-red-600 text-sm">{error}</p>
                  </div>
                )}

                {/* Product Name */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Product Name <span className="text-red-500">*</span>
                  </label>
                  <Input
                    type="text"
                    value={formData.name || ''}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="Enter product name"
                    required
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Description
                  </label>
                  <textarea
                    value={formData.description || ''}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    placeholder="Enter product description"
                    rows={4}
                    className="w-full px-3 py-2 border border-input rounded-md bg-background resize-none"
                  />
                </div>

                {/* Category */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Category <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.category || ''}
                    onChange={(e) => handleInputChange('category', e.target.value)}
                    required
                    className="w-full px-3 py-2 border border-input rounded-md bg-background"
                  >
                    <option value="">Select a category</option>
                    {categories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>

                {/* Price and Stock */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Price <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        type="number"
                        step="0.01"
                        min="0"
                        value={formData.price || 0}
                        onChange={(e) => handleInputChange('price', parseFloat(e.target.value) || 0)}
                        placeholder="0.00"
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Stock Quantity
                    </label>
                    <div className="relative">
                      <Hash className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        type="number"
                        min="0"
                        value={formData.stock || 0}
                        onChange={(e) => handleInputChange('stock', parseInt(e.target.value) || 0)}
                        placeholder="0"
                        className="pl-10"
                      />
                    </div>
                  </div>
                </div>

                {/* Image URL */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Image URL
                  </label>
                  <div className="relative">
                    <Upload className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="url"
                      value={formData.image_url || ''}
                      onChange={(e) => handleInputChange('image_url', e.target.value)}
                      placeholder="https://example.com/image.jpg"
                      className="pl-10"
                    />
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Enter a valid image URL for the product
                  </p>
                </div>

                {/* Preview */}
                {formData.image_url && (
                  <div>
                    <label className="block text-sm font-medium mb-2">Image Preview</label>
                    <div className="w-32 h-32 border rounded-md overflow-hidden">
                      <img
                        src={formData.image_url}
                        alt="Product preview"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.src = '/placeholder-product.jpg';
                        }}
                      />
                    </div>
                  </div>
                )}

                {/* Submit Buttons */}
                <div className="flex gap-4 pt-4">
                  <Button
                    type="submit"
                    disabled={saving}
                    className="flex-1"
                  >
                    {saving ? (
                      <div className="flex items-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Saving...
                      </div>
                    ) : (
                      <>
                        <Save className="h-4 w-4 mr-2" />
                        Update Product
                      </>
                    )}
                  </Button>
                  <Link href="/admin/products">
                    <Button type="button" variant="outline">
                      Cancel
                    </Button>
                  </Link>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
} 