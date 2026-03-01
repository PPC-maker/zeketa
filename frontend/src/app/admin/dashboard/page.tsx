'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Package,
  ShoppingCart,
  Users,
  DollarSign,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  ArrowUpRight,
} from 'lucide-react';
import AdminLayout from '@/components/admin/AdminLayout';
import { useStore } from '@/stores/useStore';

interface StatCard {
  titleEn: string;
  titleHe: string;
  value: string;
  change: number;
  icon: any;
  color: string;
}

const stats: StatCard[] = [
  {
    titleEn: 'Total Revenue',
    titleHe: 'הכנסות',
    value: '$12,450',
    change: 12.5,
    icon: DollarSign,
    color: 'bg-green-500',
  },
  {
    titleEn: 'Orders',
    titleHe: 'הזמנות',
    value: '156',
    change: 8.2,
    icon: ShoppingCart,
    color: 'bg-blue-500',
  },
  {
    titleEn: 'Products',
    titleHe: 'מוצרים',
    value: '284',
    change: -2.4,
    icon: Package,
    color: 'bg-purple-500',
  },
  {
    titleEn: 'Customers',
    titleHe: 'לקוחות',
    value: '1,250',
    change: 15.3,
    icon: Users,
    color: 'bg-orange-500',
  },
];

const recentOrders = [
  { id: 'ZK-001', customer: 'John Doe', total: '$129.99', status: 'completed' },
  { id: 'ZK-002', customer: 'Jane Smith', total: '$89.50', status: 'processing' },
  { id: 'ZK-003', customer: 'Mike Johnson', total: '$245.00', status: 'pending' },
  { id: 'ZK-004', customer: 'Sarah Williams', total: '$67.99', status: 'completed' },
  { id: 'ZK-005', customer: 'David Brown', total: '$189.00', status: 'shipped' },
];

const lowStockProducts = [
  { name: 'Neon Wolf Hoodie', stock: 3, sku: 'NWH-001' },
  { name: 'Urban Camo Jacket', stock: 2, sku: 'UCJ-002' },
  { name: 'Cyber Punk Tee', stock: 5, sku: 'CPT-003' },
];

export default function DashboardPage() {
  const { locale } = useStore();
  const isRTL = locale === 'he';

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'shipped':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {isRTL ? 'דשבורד' : 'Dashboard'}
          </h1>
          <p className="text-gray-600">
            {isRTL ? 'סקירה כללית של החנות' : 'Overview of your store'}
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.titleEn}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
            >
              <div className="flex items-center justify-between">
                <div className={`p-3 rounded-lg ${stat.color}`}>
                  <stat.icon size={24} className="text-white" />
                </div>
                <div
                  className={`flex items-center gap-1 text-sm font-medium ${
                    stat.change >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}
                >
                  {stat.change >= 0 ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                  {Math.abs(stat.change)}%
                </div>
              </div>
              <div className="mt-4">
                <h3 className="text-gray-500 text-sm">
                  {isRTL ? stat.titleHe : stat.titleEn}
                </h3>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Orders */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-xl shadow-sm border border-gray-100"
          >
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-gray-900">
                  {isRTL ? 'הזמנות אחרונות' : 'Recent Orders'}
                </h2>
                <a
                  href="/admin/orders"
                  className="text-cyan-600 text-sm font-medium hover:underline flex items-center gap-1"
                >
                  {isRTL ? 'הצג הכל' : 'View All'}
                  <ArrowUpRight size={14} />
                </a>
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {recentOrders.map((order) => (
                  <div
                    key={order.id}
                    className="flex items-center justify-between py-2"
                  >
                    <div>
                      <p className="font-medium text-gray-900">{order.id}</p>
                      <p className="text-sm text-gray-500">{order.customer}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-gray-900">{order.total}</p>
                      <span
                        className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(
                          order.status
                        )}`}
                      >
                        {order.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Low Stock Alert */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white rounded-xl shadow-sm border border-gray-100"
          >
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <AlertTriangle className="text-orange-500" size={20} />
                <h2 className="text-lg font-bold text-gray-900">
                  {isRTL ? 'התראת מלאי נמוך' : 'Low Stock Alert'}
                </h2>
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {lowStockProducts.map((product) => (
                  <div
                    key={product.sku}
                    className="flex items-center justify-between py-2"
                  >
                    <div>
                      <p className="font-medium text-gray-900">{product.name}</p>
                      <p className="text-sm text-gray-500">SKU: {product.sku}</p>
                    </div>
                    <div className="text-right">
                      <span
                        className={`inline-block px-3 py-1 text-sm font-bold rounded-full ${
                          product.stock <= 2
                            ? 'bg-red-100 text-red-800'
                            : 'bg-orange-100 text-orange-800'
                        }`}
                      >
                        {product.stock} {isRTL ? 'יחידות' : 'left'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              <button className="w-full mt-4 py-3 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors">
                {isRTL ? 'עדכן מלאי' : 'Update Stock'}
              </button>
            </div>
          </motion.div>
        </div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
        >
          <h2 className="text-lg font-bold text-gray-900 mb-4">
            {isRTL ? 'פעולות מהירות' : 'Quick Actions'}
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <a
              href="/admin/products"
              className="flex flex-col items-center gap-2 p-4 bg-cyan-50 rounded-xl hover:bg-cyan-100 transition-colors"
            >
              <Package size={24} className="text-cyan-600" />
              <span className="font-medium text-gray-900">
                {isRTL ? 'הוסף מוצר' : 'Add Product'}
              </span>
            </a>
            <a
              href="/admin/import"
              className="flex flex-col items-center gap-2 p-4 bg-purple-50 rounded-xl hover:bg-purple-100 transition-colors"
            >
              <ArrowUpRight size={24} className="text-purple-600" />
              <span className="font-medium text-gray-900">
                {isRTL ? 'ייבוא CSV' : 'Import CSV'}
              </span>
            </a>
            <a
              href="/admin/orders"
              className="flex flex-col items-center gap-2 p-4 bg-blue-50 rounded-xl hover:bg-blue-100 transition-colors"
            >
              <ShoppingCart size={24} className="text-blue-600" />
              <span className="font-medium text-gray-900">
                {isRTL ? 'צפה בהזמנות' : 'View Orders'}
              </span>
            </a>
            <a
              href="/admin/logs"
              className="flex flex-col items-center gap-2 p-4 bg-orange-50 rounded-xl hover:bg-orange-100 transition-colors"
            >
              <AlertTriangle size={24} className="text-orange-600" />
              <span className="font-medium text-gray-900">
                {isRTL ? 'צפה בלוגים' : 'View Logs'}
              </span>
            </a>
          </div>
        </motion.div>
      </div>
    </AdminLayout>
  );
}
