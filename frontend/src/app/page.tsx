'use client';

import HeroSlider from '@/components/home/HeroSlider';
import BestSellers from '@/components/home/BestSellers';
import TrendingCollections from '@/components/home/TrendingCollections';
import CategorySection from '@/components/home/CategorySection';
import { motion } from 'framer-motion';
import { useStore } from '@/stores/useStore';
import Image from 'next/image';

// "Shop the Look" Section Component
function ShopTheLook() {
  const { locale } = useStore();
  const isRTL = locale === 'he';

  const looks = [
    { id: 1, image: '/images/looks/look1.jpg', products: ['hoodie1', 'pants1'] },
    { id: 2, image: '/images/looks/look2.jpg', products: ['jacket1', 'tee1'] },
    { id: 3, image: '/images/looks/look3.jpg', products: ['sweatshirt1', 'pants2'] },
    { id: 4, image: '/images/looks/look4.jpg', products: ['bomber1', 'pants3'] },
  ];

  return (
    <section className="py-16 bg-gray-900" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-5xl font-black text-white mb-2" style={{ fontFamily: 'var(--font-bebas)' }}>
            {isRTL ? 'השלם את המראה' : 'SHOP THE LOOK'}
          </h2>
          <p className="text-gray-400">
            {isRTL ? 'קנה את המראה השלם' : 'Get the complete outfit'}
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {looks.map((look, index) => (
            <motion.div
              key={look.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group relative aspect-[3/4] rounded-2xl overflow-hidden bg-gray-800"
            >
              <Image
                src={look.image || '/images/placeholder.jpg'}
                alt={`Look ${look.id}`}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
              />

              {/* Overlay */}
              <div className="absolute inset-0 bg-black/30 group-hover:bg-black/50 transition-colors" />

              {/* Shop Button */}
              <motion.button
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 + index * 0.1, type: 'spring' }}
                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-green-400 rounded-full flex items-center justify-center text-black font-bold text-2xl shadow-lg hover:scale-110 transition-transform"
              >
                +
              </motion.button>

              {/* Product count badge */}
              <div className="absolute bottom-4 left-4 right-4">
                <div className="bg-white/90 backdrop-blur-sm rounded-lg p-3 text-center">
                  <span className="text-sm font-medium text-gray-900">
                    {look.products.length} {isRTL ? 'מוצרים' : 'items'}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// Banner Section - "Rebel the Ordinary"
function PromoBanner() {
  return (
    <section className="py-16 bg-black overflow-hidden">
      <motion.div
        animate={{ x: [0, -1920, 0] }}
        transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
        className="whitespace-nowrap"
      >
        <span
          className="inline-block text-6xl md:text-8xl font-black text-transparent mx-8"
          style={{ WebkitTextStroke: '2px rgba(255,255,255,0.2)' }}
        >
          REBEL THE ORDINARY • CHASE EXTRAORDINARY •
        </span>
        <span
          className="inline-block text-6xl md:text-8xl font-black text-transparent mx-8"
          style={{ WebkitTextStroke: '2px rgba(255,255,255,0.2)' }}
        >
          REBEL THE ORDINARY • CHASE EXTRAORDINARY •
        </span>
      </motion.div>
    </section>
  );
}

// Instagram Feed Section
function InstagramFeed() {
  const { locale } = useStore();
  const isRTL = locale === 'he';

  const instagramImages = [
    '/images/instagram/post1.jpg',
    '/images/instagram/post2.jpg',
    '/images/instagram/post3.jpg',
    '/images/instagram/post4.jpg',
    '/images/instagram/post5.jpg',
    '/images/instagram/post6.jpg',
  ];

  return (
    <section className="py-16 bg-white" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-2">
            @zeketa_official
          </h2>
          <p className="text-gray-600">
            {isRTL ? 'עקבו אחרינו באינסטגרם' : 'Follow us on Instagram'}
          </p>
        </motion.div>

        <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
          {instagramImages.map((imageUrl, index) => (
            <motion.a
              key={index}
              href="https://instagram.com/zeketa_official"
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ scale: 1.05 }}
              className="relative aspect-square bg-gray-200 rounded-lg overflow-hidden group"
            >
              <Image
                src={imageUrl}
                alt={`Instagram post ${index + 1}`}
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                <motion.div
                  initial={{ opacity: 0, scale: 0 }}
                  whileHover={{ opacity: 1, scale: 1 }}
                  className="text-white text-3xl"
                >
                  ♥
                </motion.div>
              </div>
            </motion.a>
          ))}
        </div>

        <div className="text-center mt-8">
          <motion.a
            href="https://instagram.com/zeketa_official"
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="inline-flex items-center gap-2 px-8 py-3 bg-black text-white font-medium rounded-lg hover:bg-gray-900 transition-colors"
          >
            <span>Instagram</span>
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
            </svg>
          </motion.a>
        </div>
      </div>
    </section>
  );
}

// Features Section
function Features() {
  const { locale } = useStore();
  const isRTL = locale === 'he';

  const features = [
    {
      icon: '🚚',
      titleEn: 'Free Shipping',
      titleHe: 'משלוח חינם',
      descEn: 'On orders over $70',
      descHe: 'בהזמנות מעל $70',
    },
    {
      icon: '↩️',
      titleEn: 'Easy Returns',
      titleHe: 'החזרות קלות',
      descEn: '30-day return policy',
      descHe: '30 יום להחזרה',
    },
    {
      icon: '🔒',
      titleEn: 'Secure Payment',
      titleHe: 'תשלום מאובטח',
      descEn: '100% secure checkout',
      descHe: 'קנייה מאובטחת 100%',
    },
    {
      icon: '💬',
      titleEn: '24/7 Support',
      titleHe: 'תמיכה 24/7',
      descEn: 'We are here to help',
      descHe: 'אנחנו כאן לעזור',
    },
  ];

  return (
    <section className="py-12 bg-gray-100" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="text-center"
            >
              <div className="text-3xl mb-2">{feature.icon}</div>
              <h3 className="font-bold text-gray-900">
                {isRTL ? feature.titleHe : feature.titleEn}
              </h3>
              <p className="text-sm text-gray-600">
                {isRTL ? feature.descHe : feature.descEn}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function HomePage() {
  return (
    <>
      <HeroSlider />
      <Features />
      <BestSellers />
      <TrendingCollections />
      <CategorySection />
      <ShopTheLook />
      <PromoBanner />
      <InstagramFeed />
    </>
  );
}
