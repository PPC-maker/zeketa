'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useStore } from '@/stores/useStore';
import { getApiUrl } from '@/lib/config';
// @ts-ignore
import Swal from 'sweetalert2';

interface Product {
  id: string;
  sku: string;
  name_he: string;
  name_en: string;
  desc_he: string;
  desc_en: string;
  price_usd: number;
  price_ils: number;
  sale_price: number | null;
  images: string[];
  sizes: string[];
  colors: string[];
  stock: number;
  is_active: boolean;
}

export default function ProductPage() {
  const params = useParams();
  const slug = params?.slug as string;
  const { locale, currency, addToCart } = useStore();
  const isRTL = locale === 'he';

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (!slug) return;

    const fetchProduct = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${getApiUrl()}/api/products/${slug}`);
        if (!res.ok) throw new Error('Product not found');
        const data = await res.json();
        setProduct(data);
        if (data.sizes?.length > 0) setSelectedSize(data.sizes[0]);
        if (data.colors?.length > 0) setSelectedColor(data.colors[0]);

        // Save to recently viewed
        const recentlyViewed = JSON.parse(localStorage.getItem('recentlyViewed') || '[]');
        const productToSave = {
          id: data.id,
          sku: data.sku,
          nameHe: data.name_he,
          nameEn: data.name_en,
          priceUsd: data.price_usd,
          priceIls: data.price_ils,
          salePrice: data.sale_price,
          images: data.images,
          viewedAt: Date.now()
        };
        // Remove if already exists
        const filtered = recentlyViewed.filter((p: { sku: string }) => p.sku !== data.sku);
        // Add to beginning
        filtered.unshift(productToSave);
        // Keep only last 10
        const limited = filtered.slice(0, 10);
        localStorage.setItem('recentlyViewed', JSON.stringify(limited));
      } catch (err) {
        setError(isRTL ? 'המוצר לא נמצא' : 'Product not found');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [slug, isRTL]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500"></div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center" dir={isRTL ? 'rtl' : 'ltr'}>
        <h1 className="text-2xl font-bold text-gray-800 mb-4">
          {error || (isRTL ? 'המוצר לא נמצא' : 'Product not found')}
        </h1>
        <Link href="/" className="text-cyan-600 hover:underline">
          {isRTL ? 'חזרה לדף הבית' : 'Back to Home'}
        </Link>
      </div>
    );
  }

  const name = isRTL ? product.name_he : product.name_en;
  const description = isRTL ? product.desc_he : product.desc_en;
  const price = currency === 'ILS' ? product.price_ils : product.price_usd;
  const currencySymbol = currency === 'ILS' ? '₪' : '$';
  const images = product.images?.length > 0 ? product.images : ['/images/placeholder.jpg'];

  const handleAddToCart = () => {
    if (!selectedSize) {
      Swal.fire({
        icon: 'warning',
        title: isRTL ? 'בחר מידה' : 'Select Size',
        text: isRTL ? 'יש לבחור מידה לפני הוספה לסל' : 'Please select a size before adding to cart',
        confirmButtonColor: '#06b6d4',
      });
      return;
    }

    addToCart({
      productId: product.id,
      name: product.name_en,
      nameHe: product.name_he,
      price: product.price_usd,
      priceIls: product.price_ils,
      image: images[0],
      size: selectedSize,
      color: selectedColor,
      quantity: quantity,
    });

    Swal.fire({
      icon: 'success',
      title: isRTL ? 'נוסף לסל!' : 'Added to Cart!',
      text: isRTL ? `${name} נוסף לסל הקניות שלך` : `${name} has been added to your cart`,
      showConfirmButton: true,
      confirmButtonText: isRTL ? 'המשך לקנות' : 'Continue Shopping',
      showCancelButton: true,
      cancelButtonText: isRTL ? 'לסל הקניות' : 'View Cart',
      confirmButtonColor: '#06b6d4',
      cancelButtonColor: '#10b981',
      timer: 5000,
      timerProgressBar: true,
    }).then((result: { dismiss?: unknown }) => {
      if (result.dismiss === Swal.DismissReason.cancel) {
        window.location.href = '/cart';
      }
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="container mx-auto px-4">
        {/* Breadcrumb */}
        <nav className="mb-8 text-sm">
          <Link href="/" className="text-gray-500 hover:text-cyan-600">
            {isRTL ? 'דף הבית' : 'Home'}
          </Link>
          <span className="mx-2 text-gray-400">/</span>
          <span className="text-gray-800">{name}</span>
        </nav>

        <div className="grid md:grid-cols-2 gap-12">
          {/* Images */}
          <div className="space-y-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="relative aspect-square rounded-2xl overflow-hidden bg-white shadow-lg"
            >
              <Image
                src={images[selectedImage]}
                alt={name}
                fill
                className="object-cover"
                priority
              />
              {product.sale_price && (
                <span className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                  {isRTL ? 'מבצע' : 'SALE'}
                </span>
              )}
            </motion.div>

            {/* Thumbnails */}
            {images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={`relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 border-2 transition-all ${
                      selectedImage === idx ? 'border-cyan-500' : 'border-transparent'
                    }`}
                  >
                    <Image src={img} alt={`${name} ${idx + 1}`} fill className="object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <p className="text-sm text-gray-500 mb-2">SKU: {product.sku}</p>
              <h1 className="text-3xl md:text-4xl font-black text-gray-900 mb-4">{name}</h1>

              <div className="flex items-center gap-4">
                {product.sale_price ? (
                  <>
                    <span className="text-3xl font-bold text-red-600">
                      {currencySymbol}{product.sale_price}
                    </span>
                    <span className="text-xl text-gray-400 line-through">
                      {currencySymbol}{price}
                    </span>
                  </>
                ) : (
                  <span className="text-3xl font-bold text-gray-900">
                    {currencySymbol}{price}
                  </span>
                )}
              </div>
            </div>

            {description && (
              <p className="text-gray-600 leading-relaxed">{description}</p>
            )}

            {/* Sizes */}
            {product.sizes && product.sizes.length > 0 && (
              <div>
                <h3 className="font-semibold text-gray-800 mb-3">
                  {isRTL ? 'מידה' : 'Size'}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`px-4 py-2 rounded-lg border-2 font-medium transition-all ${
                        selectedSize === size
                          ? 'border-cyan-500 bg-cyan-50 text-cyan-700'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Colors */}
            {product.colors && product.colors.length > 0 && (
              <div>
                <h3 className="font-semibold text-gray-800 mb-3">
                  {isRTL ? 'צבע' : 'Color'}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {product.colors.map((color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`px-4 py-2 rounded-lg border-2 font-medium transition-all ${
                        selectedColor === color
                          ? 'border-cyan-500 bg-cyan-50 text-cyan-700'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div>
              <h3 className="font-semibold text-gray-800 mb-3">
                {isRTL ? 'כמות' : 'Quantity'}
              </h3>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 rounded-lg border-2 border-gray-200 flex items-center justify-center hover:border-gray-300"
                >
                  -
                </button>
                <span className="text-xl font-semibold w-12 text-center">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-10 h-10 rounded-lg border-2 border-gray-200 flex items-center justify-center hover:border-gray-300"
                >
                  +
                </button>
              </div>
            </div>

            {/* Add to Cart */}
            <div className="flex gap-4 pt-4">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className={`flex-1 py-4 rounded-xl font-bold text-lg transition-all ${
                  product.stock > 0
                    ? 'bg-gradient-to-r from-cyan-500 to-cyan-600 text-white hover:from-cyan-600 hover:to-cyan-700 shadow-lg'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                {product.stock > 0
                  ? isRTL ? 'הוסף לסל' : 'Add to Cart'
                  : isRTL ? 'אזל מהמלאי' : 'Out of Stock'}
              </motion.button>
            </div>

            {/* Stock Status */}
            <div className="flex items-center gap-2 text-sm">
              <span className={`w-2 h-2 rounded-full ${product.stock > 10 ? 'bg-green-500' : product.stock > 0 ? 'bg-yellow-500' : 'bg-red-500'}`}></span>
              <span className="text-gray-600">
                {product.stock > 10
                  ? isRTL ? 'במלאי' : 'In Stock'
                  : product.stock > 0
                  ? isRTL ? `נותרו ${product.stock} יחידות` : `Only ${product.stock} left`
                  : isRTL ? 'אזל מהמלאי' : 'Out of Stock'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
