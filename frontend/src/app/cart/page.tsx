'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, ShoppingBag, Minus, Plus, Trash2, Tag } from 'lucide-react';
import { useStore } from '@/stores/useStore';
import { formatPrice } from '@/lib/utils';

export default function CartPage() {
  const { cart, currency, locale, getCartTotal, removeFromCart, updateQuantity } = useStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isRTL = locale === 'he';
  const total = mounted ? getCartTotal() : 0;
  const cartItems = mounted ? cart : [];
  const ArrowIcon = isRTL ? ArrowRight : ArrowLeft;

  // Free shipping threshold
  const freeShippingThreshold = currency === 'ILS' ? 250 : 70;
  const remainingForFreeShipping = freeShippingThreshold - total;

  // Show loading state before hydration
  if (!mounted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4" dir={isRTL ? 'rtl' : 'ltr'}>
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6"
        >
          <ShoppingBag size={40} className="text-gray-400" />
        </motion.div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          {isRTL ? 'העגלה ריקה' : 'Your Cart is Empty'}
        </h1>
        <p className="text-gray-600 mb-6 text-center">
          {isRTL ? 'נראה שעוד לא הוספת מוצרים לעגלה' : "Looks like you haven't added any items yet"}
        </p>
        <Link href="/">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="px-8 py-3 bg-black text-white font-medium rounded-lg hover:bg-cyan-500 transition-colors"
          >
            {isRTL ? 'המשך לקנות' : 'Continue Shopping'}
          </motion.button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Back Link */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-black mb-8 transition-colors"
        >
          <ArrowIcon size={20} />
          <span>{isRTL ? 'המשך לקנות' : 'Continue Shopping'}</span>
        </Link>

        <h1 className="text-3xl md:text-4xl font-black text-gray-900 mb-8">
          {isRTL ? 'עגלת הקניות' : 'Shopping Cart'}
          <span className="text-cyan-500 mr-2 ml-2">({cartItems.length})</span>
        </h1>

        {/* Free Shipping Progress */}
        {remainingForFreeShipping > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 p-4 bg-gradient-to-r from-cyan-50 to-cyan-100 rounded-xl"
          >
            <div className="flex items-center gap-2 mb-2">
              <Tag size={20} className="text-cyan-600" />
              <p className="text-cyan-700 font-medium">
                {isRTL
                  ? `עוד ${formatPrice(remainingForFreeShipping, currency)} למשלוח חינם!`
                  : `Add ${formatPrice(remainingForFreeShipping, currency)} more for free shipping!`}
              </p>
            </div>
            <div className="w-full bg-cyan-200 rounded-full h-2">
              <div
                className="bg-cyan-500 h-2 rounded-full transition-all duration-500"
                style={{ width: `${Math.min((total / freeShippingThreshold) * 100, 100)}%` }}
              />
            </div>
          </motion.div>
        )}

        {remainingForFreeShipping <= 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 p-4 bg-green-50 rounded-xl flex items-center gap-2"
          >
            <span className="text-2xl">🎉</span>
            <p className="text-green-700 font-medium">
              {isRTL ? 'מזל טוב! קיבלת משלוח חינם!' : 'Congratulations! You get free shipping!'}
            </p>
          </motion.div>
        )}

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl shadow-lg p-4 md:p-6 flex gap-4"
              >
                {/* Product Image */}
                <Link href={`/product/${item.productId}`} className="relative w-24 h-32 md:w-32 md:h-40 bg-gray-100 rounded-xl overflow-hidden flex-shrink-0 group">
                  <Image
                    src={item.image || '/images/placeholder.jpg'}
                    alt={isRTL ? item.nameHe : item.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </Link>

                {/* Product Details */}
                <div className="flex-1 flex flex-col justify-between min-w-0">
                  <div>
                    <Link href={`/product/${item.productId}`}>
                      <h3 className="font-bold text-gray-900 text-lg hover:text-cyan-500 transition-colors truncate">
                        {isRTL ? item.nameHe : item.name}
                      </h3>
                    </Link>
                    {(item.size || item.color) && (
                      <p className="text-sm text-gray-500 mt-1">
                        {item.size && (
                          <span className="inline-block px-2 py-0.5 bg-gray-100 rounded mr-2 ml-2">
                            {isRTL ? 'מידה' : 'Size'}: {item.size}
                          </span>
                        )}
                        {item.color && (
                          <span className="inline-block px-2 py-0.5 bg-gray-100 rounded">
                            {isRTL ? 'צבע' : 'Color'}: {item.color}
                          </span>
                        )}
                      </p>
                    )}
                    <p className="text-xl font-bold text-gray-900 mt-2">
                      {formatPrice(currency === 'ILS' ? item.priceIls : item.price, currency)}
                    </p>
                  </div>

                  {/* Quantity Controls */}
                  <div className="flex items-center justify-between mt-4">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
                      >
                        <Minus size={16} />
                      </button>
                      <span className="w-8 text-center font-bold">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
                      >
                        <Plus size={16} />
                      </button>
                    </div>

                    <div className="flex items-center gap-4">
                      <p className="font-bold text-lg text-cyan-600">
                        {formatPrice(
                          (currency === 'ILS' ? item.priceIls : item.price) * item.quantity,
                          currency
                        )}
                      </p>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-8">
              <h2 className="text-xl font-bold text-gray-900 mb-6">
                {isRTL ? 'סיכום הזמנה' : 'Order Summary'}
              </h2>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-gray-600">
                  <span>{isRTL ? 'סכום ביניים' : 'Subtotal'}</span>
                  <span>{formatPrice(total, currency)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>{isRTL ? 'משלוח' : 'Shipping'}</span>
                  <span className={remainingForFreeShipping <= 0 ? 'text-green-600' : ''}>
                    {remainingForFreeShipping <= 0
                      ? (isRTL ? 'חינם' : 'Free')
                      : (isRTL ? 'יחושב בקופה' : 'Calculated at checkout')}
                  </span>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-4 mb-6">
                <div className="flex justify-between text-xl font-bold text-gray-900">
                  <span>{isRTL ? 'סה"כ' : 'Total'}</span>
                  <span>{formatPrice(total, currency)}</span>
                </div>
              </div>

              <Link href="/checkout">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full py-4 bg-gradient-to-r from-cyan-500 to-cyan-600 text-white font-bold text-lg rounded-xl hover:from-cyan-600 hover:to-cyan-700 transition-all shadow-lg"
                >
                  {isRTL ? 'המשך לתשלום' : 'Proceed to Checkout'}
                </motion.button>
              </Link>

              <Link href="/">
                <button className="w-full py-3 mt-3 text-gray-600 font-medium hover:text-cyan-500 transition-colors">
                  {isRTL ? 'המשך לקנות' : 'Continue Shopping'}
                </button>
              </Link>

              {/* Trust Badges */}
              <div className="mt-6 pt-6 border-t border-gray-100">
                <div className="flex items-center justify-center gap-4 text-gray-400 text-sm">
                  <span>🔒 {isRTL ? 'תשלום מאובטח' : 'Secure'}</span>
                  <span>💳 {isRTL ? 'כל הכרטיסים' : 'All Cards'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
