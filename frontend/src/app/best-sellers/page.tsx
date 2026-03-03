'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { useStore } from '@/stores/useStore';
import { getApiUrl } from '@/lib/config';

interface Product {
  id: string;
  sku: string;
  nameHe: string;
  nameEn: string;
  priceUsd: number;
  priceIls: number;
  salePrice?: number | null;
  images: string[];
  isNew: boolean;
  isBestSeller: boolean;
}

interface RecentlyViewedProduct {
  id: string;
  sku: string;
  nameHe: string;
  nameEn: string;
  priceUsd: number;
  priceIls: number;
  salePrice?: number | null;
  images: string[];
  viewedAt: number;
}

export default function BestSellersPage() {
  const { locale, currency } = useStore();
  const isRTL = locale === 'he';

  const [products, setProducts] = useState<Product[]>([]);
  const [recentlyViewed, setRecentlyViewed] = useState<RecentlyViewedProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${getApiUrl()}/api/products/best-sellers`);
        const data = await response.json();
        setProducts(data.products || []);
      } catch (error) {
        console.error('Error fetching products:', error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();

    // Load recently viewed from localStorage
    const saved = localStorage.getItem('recentlyViewed');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setRecentlyViewed(parsed.slice(0, 10));
      } catch {
        setRecentlyViewed([]);
      }
    }
  }, []);

  return (
    <div className="min-h-screen bg-white" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Hero Banner */}
      <div className="relative h-64 md:h-80 bg-gradient-to-r from-yellow-400 to-orange-500">
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-black text-white"
          >
            {isRTL ? 'הנמכרים ביותר' : 'BEST SELLERS'}
          </motion.h1>
        </div>
      </div>

      {/* Products Grid */}
      <div className="container mx-auto px-4 py-12">
        <div className="flex justify-between items-center mb-8">
          <p className="text-gray-600">
            {isRTL ? `${products.length} מוצרים` : `${products.length} products`}
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-square bg-gray-200 rounded-lg mb-4" />
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
                <div className="h-4 bg-gray-200 rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-xl text-gray-500">
              {isRTL ? 'אין מוצרים נמכרים כרגע' : 'No best sellers at the moment'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: Math.min(index * 0.05, 0.5) }}
              >
                <Link href={`/product/${product.sku}`}>
                  <div className="group">
                    <div className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden mb-4">
                      <Image
                        src={product.images?.[0] || '/images/placeholder.jpg'}
                        alt={isRTL ? product.nameHe : product.nameEn}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                      <div className="absolute top-2 right-2">
                        <span className="bg-yellow-400 text-black text-xs font-bold px-2 py-1 rounded">
                          {isRTL ? 'נמכר ביותר' : 'BEST SELLER'}
                        </span>
                      </div>
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-1 group-hover:text-cyan-600 transition-colors line-clamp-2">
                      {isRTL ? product.nameHe : product.nameEn}
                    </h3>
                    <p className="text-gray-900 font-bold">
                      {currency === 'ILS' ? `₪${product.priceIls}` : `$${product.priceUsd}`}
                    </p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}

        {/* Recently Viewed Section */}
        {recentlyViewed.length > 0 && (
          <div className="mt-16 border-t pt-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">
              {isRTL ? 'צפית לאחרונה' : 'Recently Viewed'}
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
              {recentlyViewed.map((product: RecentlyViewedProduct, index: number) => (
                <motion.div
                  key={product.sku}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: Math.min(index * 0.05, 0.5) }}
                >
                  <Link href={`/product/${product.sku}`}>
                    <div className="group">
                      <div className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden mb-3">
                        <Image
                          src={product.images?.[0] || '/images/placeholder.jpg'}
                          alt={isRTL ? product.nameHe : product.nameEn}
                          fill
                          className="object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                      </div>
                      <h3 className="font-medium text-gray-900 text-sm mb-1 group-hover:text-cyan-600 transition-colors line-clamp-2">
                        {isRTL ? product.nameHe : product.nameEn}
                      </h3>
                      <p className="text-gray-900 font-bold text-sm">
                        {currency === 'ILS' ? `₪${product.priceIls}` : `$${product.priceUsd}`}
                      </p>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
