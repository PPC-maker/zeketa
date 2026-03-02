'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, TrendingUp, Clock } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { useStore } from '@/stores/useStore';
import Image from 'next/image';
import Link from 'next/link';

const trendingSearches = ['Hoodies', 'Summer Collection', 'Jackets', 'New Arrivals'];
const recentSearches = ['Neon Wolf', 'Track Pants', 'Bomber'];

export default function SearchModal() {
  const { isSearchOpen, setSearchOpen, locale } = useStore();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const isRTL = locale === 'he';

  useEffect(() => {
    if (isSearchOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isSearchOpen]);

  useEffect(() => {
    if (query.length > 2) {
      setIsLoading(true);
      // Simulate API call
      const timer = setTimeout(() => {
        setResults([
          {
            id: '1',
            name: 'Neon Wolf Hoodie',
            nameHe: 'הודי זאב ניאון',
            price: 89.99,
            image: '/images/products/hoodie1.jpg',
            slug: 'neon-wolf-hoodie',
          },
          {
            id: '2',
            name: 'Urban Camo Jacket',
            nameHe: "ג'קט הסוואה",
            price: 129.99,
            image: '/images/products/jacket1.jpg',
            slug: 'urban-camo-jacket',
          },
        ]);
        setIsLoading(false);
      }, 500);
      return () => clearTimeout(timer);
    } else {
      setResults([]);
    }
  }, [query]);

  const handleClose = () => {
    setSearchOpen(false);
    setQuery('');
    setResults([]);
  };

  return (
    <AnimatePresence>
      {isSearchOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            transition={{ type: 'spring', damping: 25 }}
            className="fixed top-0 left-0 right-0 z-50 p-4 md:p-8"
            dir={isRTL ? 'rtl' : 'ltr'}
          >
            <div className="max-w-2xl mx-auto">
              {/* Search Input */}
              <div className="relative bg-white rounded-2xl shadow-2xl overflow-hidden">
                <div className="flex items-center gap-4 p-4 border-b">
                  <Search size={24} className="text-gray-400" />
                  <input
                    ref={inputRef}
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder={isRTL ? 'חפש מוצרים...' : 'Search products...'}
                    className="flex-1 text-lg outline-none bg-transparent"
                  />
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={handleClose}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <X size={20} />
                  </motion.button>
                </div>

                {/* Content */}
                <div className="max-h-[60vh] overflow-y-auto">
                  {/* Loading */}
                  {isLoading && (
                    <div className="p-8 text-center">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                        className="w-8 h-8 border-2 border-cyan-400 border-t-transparent rounded-full mx-auto"
                      />
                    </div>
                  )}

                  {/* Results */}
                  {!isLoading && results.length > 0 && (
                    <div className="p-4">
                      <h3 className="text-sm font-medium text-gray-500 mb-3">
                        {isRTL ? 'תוצאות' : 'Results'}
                      </h3>
                      <div className="space-y-2">
                        {results.map((product) => (
                          <Link
                            key={product.id}
                            href={`/product/${product.slug}`}
                            onClick={handleClose}
                          >
                            <motion.div
                              whileHover={{ backgroundColor: 'rgba(0,0,0,0.02)' }}
                              className="flex items-center gap-4 p-3 rounded-xl"
                            >
                              <div className="relative w-16 h-16 bg-gray-100 rounded-lg overflow-hidden">
                                <Image
                                  src={product.image || '/images/placeholder.jpg'}
                                  alt={isRTL ? product.nameHe : product.name}
                                  fill
                                  className="object-cover"
                                />
                              </div>
                              <div>
                                <h4 className="font-medium text-gray-900">
                                  {isRTL ? product.nameHe : product.name}
                                </h4>
                                <p className="text-cyan-600 font-bold">${product.price}</p>
                              </div>
                            </motion.div>
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* No query - show suggestions */}
                  {!isLoading && query.length <= 2 && results.length === 0 && (
                    <div className="p-4 space-y-6">
                      {/* Trending */}
                      <div>
                        <h3 className="flex items-center gap-2 text-sm font-medium text-gray-500 mb-3">
                          <TrendingUp size={16} />
                          {isRTL ? 'חיפושים פופולריים' : 'Trending Searches'}
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          {trendingSearches.map((term) => (
                            <motion.button
                              key={term}
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => setQuery(term)}
                              className="px-4 py-2 bg-gray-100 rounded-full text-sm hover:bg-cyan-400 hover:text-black transition-colors"
                            >
                              {term}
                            </motion.button>
                          ))}
                        </div>
                      </div>

                      {/* Recent */}
                      <div>
                        <h3 className="flex items-center gap-2 text-sm font-medium text-gray-500 mb-3">
                          <Clock size={16} />
                          {isRTL ? 'חיפושים אחרונים' : 'Recent Searches'}
                        </h3>
                        <div className="space-y-1">
                          {recentSearches.map((term) => (
                            <button
                              key={term}
                              onClick={() => setQuery(term)}
                              className="block w-full text-left px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                            >
                              {term}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* No results */}
                  {!isLoading && query.length > 2 && results.length === 0 && (
                    <div className="p-8 text-center">
                      <p className="text-gray-500">
                        {isRTL ? 'לא נמצאו תוצאות' : 'No results found'}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Hint */}
              <p className="text-center text-white/50 text-sm mt-4">
                {isRTL ? 'לחץ ESC לסגירה' : 'Press ESC to close'}
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
