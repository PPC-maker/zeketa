'use client';

import { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
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

interface Category {
  id: string;
  nameHe: string;
  nameEn: string;
  slug: string;
  image?: string;
}

const categoryData: Record<string, Category> = {
  men: { id: 'men', nameHe: 'גברים', nameEn: 'Men', slug: 'men', image: '/images/categories/men.jpg' },
  women: { id: 'women', nameHe: 'נשים', nameEn: 'Women', slug: 'women', image: '/images/categories/women.jpg' },
  clothes: { id: 'clothes', nameHe: 'בגדים', nameEn: 'Clothes', slug: 'clothes', image: '/images/categories/clothes.jpg' },
  'tank-top': { id: 'tank-top', nameHe: 'גופיות', nameEn: 'Tank Tops', slug: 'tank-top', image: '/images/categories/tank-top.jpg' },
};

const subcategoryLabels: Record<string, { he: string; en: string }> = {
  'tank-top': { he: 'גופיות', en: 'Tank Tops' },
  'shirts': { he: 'חולצות', en: 'Shirts' },
  'hoodies': { he: 'הודיות', en: 'Hoodies' },
  'pants': { he: 'מכנסיים', en: 'Pants' },
  'dresses': { he: 'שמלות', en: 'Dresses' },
};

export default function CategoryPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const slug = params.slug as string;
  const type = searchParams.get('type');
  const { locale, currency } = useStore();
  const isRTL = locale === 'he';

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);

  const category = categoryData[slug];
  const subcategoryLabel = type && subcategoryLabels[type];

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const url = type
          ? `${getApiUrl()}/api/products/category/${slug}?type=${type}`
          : `${getApiUrl()}/api/products/category/${slug}`;
        const response = await fetch(url);
        const data = await response.json();
        setProducts(data.products || []);
        setTotal(data.total || 0);
      } catch (error) {
        console.error('Error fetching products:', error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchProducts();
    }
  }, [slug, type]);

  if (!category) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <h1 className="text-2xl text-gray-600">
          {isRTL ? 'קטגוריה לא נמצאה' : 'Category not found'}
        </h1>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Hero Banner */}
      <div className="relative h-64 md:h-80 bg-gray-900">
        {category.image && (
          <Image
            src={category.image}
            alt={isRTL ? category.nameHe : category.nameEn}
            fill
            className="object-cover opacity-60"
          />
        )}
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-black text-white text-center"
          >
            {subcategoryLabel
              ? (isRTL ? subcategoryLabel.he : subcategoryLabel.en)
              : (isRTL ? category.nameHe : category.nameEn)
            }
          </motion.h1>
        </div>
      </div>

      {/* Products Grid */}
      <div className="container mx-auto px-4 py-12">
        <div className="flex justify-between items-center mb-8">
          <p className="text-gray-600">
            {isRTL
              ? `${total} מוצרים`
              : `${total} products`
            }
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
          <div className="text-center py-20">
            <p className="text-xl text-gray-500">
              {isRTL ? 'אין מוצרים בקטגוריה זו' : 'No products in this category'}
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
                    {/* Product Image */}
                    <div className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden mb-4">
                      <Image
                        src={product.images?.[0] || '/images/placeholder.jpg'}
                        alt={isRTL ? product.nameHe : product.nameEn}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                      />

                      {/* Badges */}
                      <div className="absolute top-2 right-2 flex flex-col gap-1">
                        {product.isNew && (
                          <span className="bg-cyan-400 text-black text-xs font-bold px-2 py-1 rounded">
                            {isRTL ? 'חדש' : 'NEW'}
                          </span>
                        )}
                        {product.isBestSeller && (
                          <span className="bg-yellow-400 text-black text-xs font-bold px-2 py-1 rounded">
                            {isRTL ? 'נמכר ביותר' : 'BEST SELLER'}
                          </span>
                        )}
                        {product.salePrice && (
                          <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                            {isRTL ? 'מבצע' : 'SALE'}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Product Info */}
                    <h3 className="font-semibold text-gray-900 mb-1 group-hover:text-cyan-600 transition-colors line-clamp-2">
                      {isRTL ? product.nameHe : product.nameEn}
                    </h3>
                    <div className="flex items-center gap-2">
                      {product.salePrice ? (
                        <>
                          <p className="text-gray-900 font-bold">
                            {currency === 'ILS'
                              ? `₪${product.salePrice}`
                              : `$${product.salePrice}`
                            }
                          </p>
                          <p className="text-gray-400 line-through text-sm">
                            {currency === 'ILS'
                              ? `₪${product.priceIls}`
                              : `$${product.priceUsd}`
                            }
                          </p>
                        </>
                      ) : (
                        <p className="text-gray-900 font-bold">
                          {currency === 'ILS'
                            ? `₪${product.priceIls}`
                            : `$${product.priceUsd}`
                          }
                        </p>
                      )}
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
