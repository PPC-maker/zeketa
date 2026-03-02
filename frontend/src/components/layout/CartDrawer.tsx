'use client';

import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { X, Minus, Plus, ShoppingBag, Trash2 } from 'lucide-react';
import { useStore } from '@/stores/useStore';
import { formatPrice } from '@/lib/utils';

export default function CartDrawer() {
  const {
    isCartOpen,
    setCartOpen,
    cart,
    removeFromCart,
    updateQuantity,
    getCartTotal,
    currency,
    locale,
    clearCart,
  } = useStore();

  const isRTL = locale === 'he';
  const total = getCartTotal();

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setCartOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: isRTL ? '-100%' : '100%' }}
            animate={{ x: 0 }}
            exit={{ x: isRTL ? '-100%' : '100%' }}
            transition={{ type: 'tween', duration: 0.3 }}
            className={`fixed top-0 ${isRTL ? 'left-0' : 'right-0'} h-full w-full max-w-md bg-white z-50 flex flex-col shadow-2xl`}
            dir={isRTL ? 'rtl' : 'ltr'}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b">
              <div className="flex items-center gap-2">
                <ShoppingBag size={24} />
                <h2 className="text-xl font-bold">
                  {isRTL ? 'עגלת קניות' : 'Shopping Cart'}
                </h2>
                <span className="px-2 py-1 bg-cyan-400 text-black text-xs font-bold rounded-full">
                  {cart.length}
                </span>
              </div>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setCartOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X size={24} />
              </motion.button>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto p-4">
              {cart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4"
                  >
                    <ShoppingBag size={40} className="text-gray-400" />
                  </motion.div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {isRTL ? 'העגלה ריקה' : 'Your cart is empty'}
                  </h3>
                  <p className="text-gray-600 mb-6">
                    {isRTL
                      ? 'הוסף מוצרים לעגלה כדי להמשיך'
                      : 'Add items to your cart to continue'}
                  </p>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setCartOpen(false)}
                    className="px-6 py-3 bg-black text-white font-medium rounded-lg"
                  >
                    {isRTL ? 'המשך לקנות' : 'Continue Shopping'}
                  </motion.button>
                </div>
              ) : (
                <div className="space-y-4">
                  <AnimatePresence>
                    {cart.map((item) => (
                      <motion.div
                        key={item.id}
                        layout
                        initial={{ opacity: 0, x: isRTL ? -20 : 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: isRTL ? -20 : 20 }}
                        className="flex gap-4 p-3 bg-gray-50 rounded-lg"
                      >
                        {/* Product Image */}
                        <div className="relative w-20 h-24 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                          <Image
                            src={item.image || '/images/placeholder.jpg'}
                            alt={isRTL ? item.nameHe : item.name}
                            fill
                            className="object-cover"
                          />
                        </div>

                        {/* Product Info */}
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-gray-900 truncate">
                            {isRTL ? item.nameHe : item.name}
                          </h4>
                          {(item.size || item.color) && (
                            <p className="text-sm text-gray-500">
                              {item.size && `${isRTL ? 'מידה' : 'Size'}: ${item.size}`}
                              {item.size && item.color && ' | '}
                              {item.color && `${isRTL ? 'צבע' : 'Color'}: ${item.color}`}
                            </p>
                          )}
                          <p className="font-bold text-gray-900 mt-1">
                            {formatPrice(currency === 'ILS' ? item.priceIls : item.price, currency)}
                          </p>

                          {/* Quantity Controls */}
                          <div className="flex items-center justify-between mt-2">
                            <div className="flex items-center gap-2 bg-white rounded-lg border">
                              <button
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                className="p-2 hover:bg-gray-100 transition-colors"
                              >
                                <Minus size={14} />
                              </button>
                              <span className="w-8 text-center font-medium">{item.quantity}</span>
                              <button
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                className="p-2 hover:bg-gray-100 transition-colors"
                              >
                                <Plus size={14} />
                              </button>
                            </div>

                            <button
                              onClick={() => removeFromCart(item.id)}
                              className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>

                  {/* Clear Cart */}
                  <button
                    onClick={clearCart}
                    className="w-full py-2 text-sm text-red-500 hover:text-red-600 transition-colors"
                  >
                    {isRTL ? 'נקה עגלה' : 'Clear Cart'}
                  </button>
                </div>
              )}
            </div>

            {/* Footer */}
            {cart.length > 0 && (
              <div className="border-t p-4 space-y-4 bg-gray-50">
                {/* Subtotal */}
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">
                    {isRTL ? 'סכום ביניים' : 'Subtotal'}
                  </span>
                  <span className="text-xl font-bold">
                    {formatPrice(total, currency)}
                  </span>
                </div>

                <p className="text-sm text-gray-500 text-center">
                  {isRTL
                    ? 'משלוח ומיסים יחושבו בקופה'
                    : 'Shipping and taxes calculated at checkout'}
                </p>

                {/* Checkout Button */}
                <Link href="/checkout" onClick={() => setCartOpen(false)}>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full py-4 bg-black text-white font-bold text-lg rounded-lg hover:bg-cyan-400 hover:text-black transition-colors"
                  >
                    {isRTL ? 'לתשלום' : 'Checkout'}
                  </motion.button>
                </Link>

                {/* Continue Shopping */}
                <button
                  onClick={() => setCartOpen(false)}
                  className="w-full py-3 text-gray-600 hover:text-black transition-colors"
                >
                  {isRTL ? 'המשך לקנות' : 'Continue Shopping'}
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
