'use client';

import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useRef, useState, useEffect } from 'react';
import { useStore } from '@/stores/useStore';
import ProductCard from '@/components/ui/ProductCard';
import Link from 'next/link';
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
  isNew?: boolean;
  isBestSeller?: boolean;
}

export default function BestSellers() {
  const { locale } = useStore();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const isRTL = locale === 'he';

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(`${getApiUrl()}/api/products/best-sellers?limit=10`);
        const data = await response.json();
        if (data.products && data.products.length > 0) {
          setProducts(data.products);
        }
      } catch (error) {
        console.error('Error fetching best sellers:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 300;
      const newScroll = direction === 'left'
        ? scrollRef.current.scrollLeft - scrollAmount
        : scrollRef.current.scrollLeft + scrollAmount;
      scrollRef.current.scrollTo({ left: newScroll, behavior: 'smooth' });
    }
  };

  return (
    <section className="py-16 bg-white overflow-hidden" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-8">
          <motion.div
            initial={{ opacity: 0, x: isRTL ? 20 : -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-black text-gray-900">
              {isRTL ? 'הנמכרים ביותר' : 'BEST SELLERS'}
            </h2>
            <p className="text-gray-600 mt-1">
              {isRTL ? 'המוצרים הכי אהובים שלנו' : 'Our most loved products'}
            </p>
          </motion.div>

          <div className="flex items-center gap-4">
            <Link
              href="/best-sellers"
              className="hidden md:block text-sm font-medium text-gray-600 hover:text-cyan-600 transition-colors"
            >
              {isRTL ? 'צפה בכל' : 'View All'}
            </Link>

            {/* Navigation Buttons */}
            <div className="flex gap-2">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => scroll('left')}
                disabled={!canScrollLeft}
                className="p-2 bg-gray-100 rounded-full hover:bg-cyan-400 hover:text-black transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                aria-label="Scroll left"
              >
                <ChevronLeft size={20} />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => scroll('right')}
                disabled={!canScrollRight}
                className="p-2 bg-gray-100 rounded-full hover:bg-cyan-400 hover:text-black transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                aria-label="Scroll right"
              >
                <ChevronRight size={20} />
              </motion.button>
            </div>
          </div>
        </div>

        {/* Products Carousel */}
        <div
          ref={scrollRef}
          onScroll={checkScroll}
          className="flex gap-6 overflow-x-auto scrollbar-hide pb-4 -mx-4 px-4"
          style={{ scrollSnapType: 'x mandatory' }}
        >
          {loading ? (
            // Loading skeleton
            [...Array(6)].map((_, i) => (
              <div key={i} className="flex-shrink-0 w-[240px] md:w-[280px] animate-pulse">
                <div className="aspect-square bg-gray-200 rounded-lg mb-4" />
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
                <div className="h-4 bg-gray-200 rounded w-1/2" />
              </div>
            ))
          ) : products.length > 0 ? (
            products.map((product) => (
              <div
                key={product.id}
                className="flex-shrink-0 w-[240px] md:w-[280px]"
                style={{ scrollSnapAlign: 'start' }}
              >
                <ProductCard
                  id={product.id}
                  slug={product.sku}
                  image={product.images?.[0] || '/images/placeholder.jpg'}
                  images={product.images}
                  nameEn={product.nameEn}
                  nameHe={product.nameHe}
                  priceUsd={product.priceUsd}
                  priceIls={product.priceIls}
                  salePrice={product.salePrice || undefined}
                  isNew={product.isNew}
                  isBestSeller={product.isBestSeller}
                />
              </div>
            ))
          ) : (
            <div className="w-full text-center py-10 text-gray-500">
              {isRTL ? 'אין מוצרים להצגה' : 'No products to display'}
            </div>
          )}
        </div>

        {/* Mobile View All Button */}
        <div className="mt-8 text-center md:hidden">
          <Link href="/best-sellers">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="px-8 py-3 bg-black text-white font-medium rounded-lg"
            >
              {isRTL ? 'צפה בכל המוצרים' : 'View All Products'}
            </motion.button>
          </Link>
        </div>
      </div>
    </section>
  );
}
