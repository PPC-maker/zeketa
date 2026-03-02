'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { ShoppingBag, Heart, Eye } from 'lucide-react';
import { useState } from 'react';
import { useStore } from '@/stores/useStore';
import { formatPrice } from '@/lib/utils';

interface ProductCardProps {
  id: string;
  slug: string;
  image: string;
  images?: string[];
  nameEn: string;
  nameHe: string;
  priceUsd: number;
  priceIls: number;
  salePrice?: number;
  isNew?: boolean;
  isBestSeller?: boolean;
}

export default function ProductCard({
  id,
  slug,
  image,
  images,
  nameEn,
  nameHe,
  priceUsd,
  priceIls,
  salePrice,
  isNew,
  isBestSeller,
}: ProductCardProps) {
  const { locale, currency, addToCart } = useStore();
  const [isHovered, setIsHovered] = useState(false);
  const [currentImage, setCurrentImage] = useState(image);
  const isRTL = locale === 'he';

  const name = isRTL ? nameHe : nameEn;
  const price = currency === 'ILS' ? priceIls : priceUsd;
  const formattedPrice = formatPrice(price, currency);
  const formattedSalePrice = salePrice ? formatPrice(salePrice, currency) : null;

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart({
      productId: id,
      name: nameEn,
      nameHe,
      price: priceUsd,
      priceIls,
      image,
      quantity: 1,
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="group relative"
      onMouseEnter={() => {
        setIsHovered(true);
        if (images && images[1]) setCurrentImage(images[1]);
      }}
      onMouseLeave={() => {
        setIsHovered(false);
        setCurrentImage(image);
      }}
    >
      <Link href={`/product/${slug}`}>
        {/* Image Container */}
        <div className="relative aspect-[3/4] overflow-hidden bg-gray-100 rounded-lg">
          {/* Product Image */}
          <motion.div
            animate={{ scale: isHovered ? 1.05 : 1 }}
            transition={{ duration: 0.4 }}
            className="w-full h-full"
          >
            <Image
              src={currentImage || '/images/placeholder.jpg'}
              alt={name}
              fill
              className="object-cover transition-opacity duration-300"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            />
          </motion.div>

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-2">
            {isNew && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="px-2 py-1 bg-cyan-400 text-black text-xs font-bold rounded"
              >
                {isRTL ? 'חדש' : 'NEW'}
              </motion.span>
            )}
            {isBestSeller && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.1 }}
                className="px-2 py-1 bg-orange-500 text-white text-xs font-bold rounded"
              >
                {isRTL ? 'נמכר' : 'HOT'}
              </motion.span>
            )}
            {salePrice && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2 }}
                className="px-2 py-1 bg-red-500 text-white text-xs font-bold rounded"
              >
                {isRTL ? 'מבצע' : 'SALE'}
              </motion.span>
            )}
          </div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : 20 }}
            transition={{ duration: 0.3 }}
            className="absolute bottom-3 left-3 right-3 flex gap-2"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleQuickAdd}
              className="flex-1 flex items-center justify-center gap-2 py-3 bg-black text-white font-medium text-sm rounded-lg hover:bg-cyan-400 hover:text-black transition-colors"
            >
              <ShoppingBag size={16} />
              <span>{isRTL ? 'הוסף לסל' : 'Add to Cart'}</span>
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="p-3 bg-white text-black rounded-lg hover:bg-gray-100 transition-colors"
              aria-label="Add to wishlist"
            >
              <Heart size={16} />
            </motion.button>
          </motion.div>

          {/* Quick View Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: isHovered ? 1 : 0 }}
            className="absolute inset-0 bg-black/10 flex items-center justify-center pointer-events-none"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: isHovered ? 1 : 0 }}
              className="p-3 bg-white rounded-full"
            >
              <Eye size={20} className="text-black" />
            </motion.div>
          </motion.div>
        </div>

        {/* Product Info */}
        <div className="mt-4 space-y-1">
          <h3 className="font-medium text-gray-900 group-hover:text-cyan-600 transition-colors line-clamp-2">
            {name}
          </h3>
          <div className="flex items-center gap-2">
            {salePrice ? (
              <>
                <span className="font-bold text-red-500">{formattedSalePrice}</span>
                <span className="text-gray-400 line-through text-sm">{formattedPrice}</span>
              </>
            ) : (
              <span className="font-bold text-gray-900">{formattedPrice}</span>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
