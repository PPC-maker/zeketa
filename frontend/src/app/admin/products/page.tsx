'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { Search, Filter, Eye, Edit, Trash2, Star, TrendingUp } from 'lucide-react';
import AdminLayout from '@/components/admin/AdminLayout';
import { useStore } from '@/stores/useStore';

interface Product {
  id: string;
  sku: string;
  nameHe: string;
  nameEn: string;
  priceUsd: number;
  priceIls: number;
  salePrice?: number | null;
  images: string[];
  sizes: string[];
  tags: string[];
  stock: number;
  isNew: boolean;
  isBestSeller: boolean;
  isFeatured: boolean;
  isActive: boolean;
  category?: {
    nameHe: string;
    nameEn: string;
  };
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export default function AdminProductsPage() {
  const { locale } = useStore();
  const isRTL = locale === 'he';
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<'all' | 'active' | 'inactive' | 'bestseller' | 'new'>('all');

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch(`${API_URL}/api/products?limit=100`);
      const data = await response.json();
      setProducts(data.products || []);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch =
      product.nameHe.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.nameEn.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.sku.toLowerCase().includes(searchTerm.toLowerCase());

    switch (filter) {
      case 'active':
        return matchesSearch && product.isActive;
      case 'inactive':
        return matchesSearch && !product.isActive;
      case 'bestseller':
        return matchesSearch && product.isBestSeller;
      case 'new':
        return matchesSearch && product.isNew;
      default:
        return matchesSearch;
    }
  });

  const toggleBestSeller = async (productId: string, currentValue: boolean) => {
    // TODO: Implement API call to update product
    setProducts(prev => prev.map(p =>
      p.id === productId ? { ...p, isBestSeller: !currentValue } : p
    ));
  };

  const toggleNew = async (productId: string, currentValue: boolean) => {
    // TODO: Implement API call to update product
    setProducts(prev => prev.map(p =>
      p.id === productId ? { ...p, isNew: !currentValue } : p
    ));
  };

  return (
    <AdminLayout>
      <div className="space-y-6" dir={isRTL ? 'rtl' : 'ltr'}>
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {isRTL ? 'ניהול מוצרים' : 'Products'}
            </h1>
            <p className="text-gray-600">
              {isRTL ? `${products.length} מוצרים` : `${products.length} products`}
            </p>
          </div>

          <div className="flex gap-3">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder={isRTL ? 'חיפוש...' : 'Search...'}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400 w-64"
              />
            </div>

            {/* Filter */}
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value as typeof filter)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400"
            >
              <option value="all">{isRTL ? 'הכל' : 'All'}</option>
              <option value="active">{isRTL ? 'פעיל' : 'Active'}</option>
              <option value="inactive">{isRTL ? 'לא פעיל' : 'Inactive'}</option>
              <option value="bestseller">{isRTL ? 'נמכרים ביותר' : 'Best Sellers'}</option>
              <option value="new">{isRTL ? 'חדש' : 'New'}</option>
            </select>
          </div>
        </div>

        {/* Products Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          {loading ? (
            <div className="p-8 text-center">
              <div className="animate-spin w-8 h-8 border-4 border-cyan-400 border-t-transparent rounded-full mx-auto"></div>
              <p className="mt-4 text-gray-500">{isRTL ? 'טוען...' : 'Loading...'}</p>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              {isRTL ? 'לא נמצאו מוצרים' : 'No products found'}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    <th className="px-6 py-4 text-right text-sm font-medium text-gray-600">
                      {isRTL ? 'תמונה' : 'Image'}
                    </th>
                    <th className="px-6 py-4 text-right text-sm font-medium text-gray-600">
                      {isRTL ? 'שם' : 'Name'}
                    </th>
                    <th className="px-6 py-4 text-right text-sm font-medium text-gray-600">
                      {isRTL ? 'מק"ט' : 'SKU'}
                    </th>
                    <th className="px-6 py-4 text-right text-sm font-medium text-gray-600">
                      {isRTL ? 'מחיר' : 'Price'}
                    </th>
                    <th className="px-6 py-4 text-right text-sm font-medium text-gray-600">
                      {isRTL ? 'מלאי' : 'Stock'}
                    </th>
                    <th className="px-6 py-4 text-right text-sm font-medium text-gray-600">
                      {isRTL ? 'תגיות' : 'Tags'}
                    </th>
                    <th className="px-6 py-4 text-right text-sm font-medium text-gray-600">
                      {isRTL ? 'פעולות' : 'Actions'}
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredProducts.map((product, index) => (
                    <motion.tr
                      key={product.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: Math.min(index * 0.02, 0.5) }}
                      className="hover:bg-gray-50"
                    >
                      {/* Image */}
                      <td className="px-6 py-4">
                        <div className="w-16 h-16 relative rounded-lg overflow-hidden bg-gray-100">
                          <Image
                            src={product.images?.[0] || '/images/placeholder.jpg'}
                            alt={isRTL ? product.nameHe : product.nameEn}
                            fill
                            className="object-cover"
                          />
                        </div>
                      </td>

                      {/* Name */}
                      <td className="px-6 py-4">
                        <p className="font-medium text-gray-900">
                          {isRTL ? product.nameHe : product.nameEn}
                        </p>
                        <p className="text-sm text-gray-500">
                          {isRTL ? product.nameEn : product.nameHe}
                        </p>
                      </td>

                      {/* SKU */}
                      <td className="px-6 py-4">
                        <code className="text-sm bg-gray-100 px-2 py-1 rounded">
                          {product.sku}
                        </code>
                      </td>

                      {/* Price */}
                      <td className="px-6 py-4">
                        <p className="font-medium text-gray-900">
                          ${product.priceUsd}
                        </p>
                        <p className="text-sm text-gray-500">
                          ₪{product.priceIls}
                        </p>
                        {product.salePrice && (
                          <p className="text-sm text-red-500">
                            {isRTL ? 'מבצע:' : 'Sale:'} ₪{product.salePrice}
                          </p>
                        )}
                      </td>

                      {/* Stock */}
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          product.stock > 10
                            ? 'bg-green-100 text-green-700'
                            : product.stock > 0
                            ? 'bg-yellow-100 text-yellow-700'
                            : 'bg-red-100 text-red-700'
                        }`}>
                          {product.stock}
                        </span>
                      </td>

                      {/* Tags */}
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-1">
                          {product.isBestSeller && (
                            <span className="px-2 py-0.5 bg-yellow-100 text-yellow-700 rounded text-xs">
                              {isRTL ? 'נמכר' : 'Best'}
                            </span>
                          )}
                          {product.isNew && (
                            <span className="px-2 py-0.5 bg-cyan-100 text-cyan-700 rounded text-xs">
                              {isRTL ? 'חדש' : 'New'}
                            </span>
                          )}
                          {product.tags?.slice(0, 2).map((tag, i) => (
                            <span key={i} className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-xs">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => toggleBestSeller(product.id, product.isBestSeller)}
                            className={`p-2 rounded-lg transition-colors ${
                              product.isBestSeller
                                ? 'bg-yellow-100 text-yellow-600'
                                : 'bg-gray-100 text-gray-400 hover:text-yellow-600'
                            }`}
                            title={isRTL ? 'נמכר ביותר' : 'Best Seller'}
                          >
                            <Star size={16} fill={product.isBestSeller ? 'currentColor' : 'none'} />
                          </button>
                          <button
                            onClick={() => toggleNew(product.id, product.isNew)}
                            className={`p-2 rounded-lg transition-colors ${
                              product.isNew
                                ? 'bg-cyan-100 text-cyan-600'
                                : 'bg-gray-100 text-gray-400 hover:text-cyan-600'
                            }`}
                            title={isRTL ? 'חדש' : 'New'}
                          >
                            <TrendingUp size={16} />
                          </button>
                          <button
                            className="p-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-blue-100 hover:text-blue-600 transition-colors"
                            title={isRTL ? 'צפה' : 'View'}
                          >
                            <Eye size={16} />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
