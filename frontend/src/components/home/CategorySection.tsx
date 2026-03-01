'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { useStore } from '@/stores/useStore';

interface Category {
  id: string;
  slug: string;
  nameEn: string;
  nameHe: string;
  image: string;
}

const categories: Category[] = [
  { id: '1', slug: 'men', nameEn: 'Men', nameHe: 'גברים', image: '/images/categories/men.jpg' },
  { id: '2', slug: 'women', nameEn: 'Women', nameHe: 'נשים', image: '/images/categories/women.jpg' },
];

export default function CategorySection() {
  const { locale } = useStore();
  const isRTL = locale === 'he';

  return (
    <section className="py-16 bg-gray-50" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-2">
            {isRTL ? 'קנה לפי קטגוריה' : 'SHOP BY CATEGORY'}
          </h2>
          <p className="text-gray-600">
            {isRTL ? 'מצא את הסגנון המושלם שלך' : 'Find your perfect style'}
          </p>
        </motion.div>

        {/* Categories Grid - Men & Women */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {categories.map((category, index) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.15 }}
            >
              <Link href={`/category/${category.slug}`}>
                <motion.div
                  whileHover={{ y: -10, scale: 1.02 }}
                  className="group relative aspect-[4/5] rounded-2xl overflow-hidden bg-gray-200 shadow-lg"
                >
                  {/* Background Image */}
                  <div className="absolute inset-0">
                    <Image
                      src={category.image || '/images/placeholder.jpg'}
                      alt={isRTL ? category.nameHe : category.nameEn}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  </div>

                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                  {/* Hover Effect */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    whileHover={{ opacity: 1 }}
                    className="absolute inset-0 bg-cyan-400/20"
                  />

                  {/* Category Name */}
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <motion.h3
                      className="text-white font-black text-2xl md:text-4xl text-center uppercase tracking-wider"
                      initial={{ y: 0 }}
                      whileHover={{ y: -5 }}
                    >
                      {isRTL ? category.nameHe : category.nameEn}
                    </motion.h3>
                    <motion.div
                      initial={{ scaleX: 0 }}
                      whileHover={{ scaleX: 1 }}
                      className="h-1 bg-cyan-400 mt-3 mx-auto w-20"
                    />
                  </div>
                </motion.div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
