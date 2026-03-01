'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { useStore } from '@/stores/useStore';

interface Collection {
  id: string;
  slug: string;
  nameEn: string;
  nameHe: string;
  image: string;
}

const collections: Collection[] = [
  {
    id: '1',
    slug: 'summer-2024',
    nameEn: 'Summer Collection',
    nameHe: 'קולקציית קיץ',
    image: '/images/collections/summer.jpg',
  },
  {
    id: '2',
    slug: 'streetwear',
    nameEn: 'Streetwear',
    nameHe: 'סטריטוור',
    image: '/images/collections/streetwear.jpg',
  },
  {
    id: '3',
    slug: 'limited-edition',
    nameEn: 'Limited Edition',
    nameHe: 'מהדורה מוגבלת',
    image: '/images/collections/limited.jpg',
  },
];

export default function TrendingCollections() {
  const { locale } = useStore();
  const isRTL = locale === 'he';

  return (
    <section className="py-16 bg-white" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-2">
            {isRTL ? 'טרנדים עכשיו' : 'TRENDING NOW'}
          </h2>
          <p className="text-gray-600">
            {isRTL ? 'הקולקציות הכי חמות' : 'Our hottest collections'}
          </p>
        </motion.div>

        {/* Collections Grid */}
        <div className="grid md:grid-cols-3 gap-6">
          {collections.map((collection, index) => (
            <motion.div
              key={collection.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.15 }}
            >
              <Link href={`/collections/${collection.slug}`}>
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="group relative aspect-[4/5] rounded-2xl overflow-hidden"
                >
                  {/* Background Image */}
                  <Image
                    src={collection.image || '/images/placeholder.jpg'}
                    alt={isRTL ? collection.nameHe : collection.nameEn}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />

                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

                  {/* Animated Border */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    whileHover={{ opacity: 1 }}
                    className="absolute inset-4 border-2 border-cyan-400 rounded-xl"
                  />

                  {/* Content */}
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <motion.h3
                      className="text-white text-2xl md:text-3xl font-black mb-2"
                      style={{
                        textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
                      }}
                    >
                      {isRTL ? collection.nameHe : collection.nameEn}
                    </motion.h3>

                    <motion.div
                      initial={{ width: 0 }}
                      whileHover={{ width: '100px' }}
                      className="h-1 bg-cyan-400 mb-4"
                    />

                    <motion.span
                      initial={{ opacity: 0, y: 10 }}
                      whileHover={{ opacity: 1, y: 0 }}
                      className="inline-flex items-center text-white font-medium"
                    >
                      {isRTL ? 'גלה עכשיו' : 'Explore Now'}
                      <svg
                        className={`w-5 h-5 ${isRTL ? 'mr-2 rotate-180' : 'ml-2'}`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17 8l4 4m0 0l-4 4m4-4H3"
                        />
                      </svg>
                    </motion.span>
                  </div>

                  {/* Glitch Effect on Hover */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    whileHover={{ opacity: [0, 0.1, 0] }}
                    transition={{ duration: 0.2, repeat: 2 }}
                    className="absolute inset-0 bg-cyan-400 mix-blend-overlay pointer-events-none"
                  />
                </motion.div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
