'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, ShoppingBag, CreditCard, Truck, Shield } from 'lucide-react';
import { useStore } from '@/stores/useStore';
import { formatPrice, generateOrderNumber } from '@/lib/utils';
// @ts-ignore
import Swal from 'sweetalert2';

interface ShippingForm {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
}

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, currency, locale, getCartTotal, clearCart } = useStore();
  const isRTL = locale === 'he';
  const total = getCartTotal();
  const ArrowIcon = isRTL ? ArrowRight : ArrowLeft;

  const [isProcessing, setIsProcessing] = useState(false);
  const [form, setForm] = useState<ShippingForm>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    country: isRTL ? 'ישראל' : 'Israel',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = (): boolean => {
    const requiredFields = ['firstName', 'lastName', 'email', 'phone', 'address', 'city'];
    for (const field of requiredFields) {
      if (!form[field as keyof ShippingForm].trim()) {
        Swal.fire({
          icon: 'error',
          title: isRTL ? 'שגיאה' : 'Error',
          text: isRTL ? 'יש למלא את כל השדות הנדרשים' : 'Please fill in all required fields',
          confirmButtonColor: '#06b6d4',
        });
        return false;
      }
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) {
      Swal.fire({
        icon: 'error',
        title: isRTL ? 'שגיאה' : 'Error',
        text: isRTL ? 'כתובת אימייל לא תקינה' : 'Invalid email address',
        confirmButtonColor: '#06b6d4',
      });
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (cart.length === 0) {
      Swal.fire({
        icon: 'warning',
        title: isRTL ? 'העגלה ריקה' : 'Cart is Empty',
        text: isRTL ? 'יש להוסיף מוצרים לפני ביצוע הזמנה' : 'Please add items to your cart before checkout',
        confirmButtonColor: '#06b6d4',
      });
      return;
    }

    if (!validateForm()) return;

    setIsProcessing(true);

    try {
      const orderNumber = generateOrderNumber();

      // Simulate payment processing
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Here you would typically send the order to your backend
      const orderData = {
        orderNumber,
        items: cart,
        shipping: form,
        total,
        currency,
      };

      console.log('Order submitted:', orderData);

      clearCart();

      Swal.fire({
        icon: 'success',
        title: isRTL ? 'ההזמנה בוצעה בהצלחה!' : 'Order Placed Successfully!',
        html: `
          <p>${isRTL ? 'מספר הזמנה:' : 'Order Number:'} <strong>${orderNumber}</strong></p>
          <p>${isRTL ? 'אישור נשלח לאימייל שלך' : 'Confirmation sent to your email'}</p>
        `,
        confirmButtonText: isRTL ? 'חזרה לדף הבית' : 'Back to Home',
        confirmButtonColor: '#06b6d4',
      }).then(() => {
        router.push('/');
      });
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: isRTL ? 'שגיאה' : 'Error',
        text: isRTL ? 'אירעה שגיאה בעיבוד ההזמנה. אנא נסה שוב.' : 'An error occurred processing your order. Please try again.',
        confirmButtonColor: '#06b6d4',
      });
    } finally {
      setIsProcessing(false);
    }
  };

  if (cart.length === 0) {
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
          {isRTL ? 'הוסף מוצרים לעגלה כדי להמשיך לתשלום' : 'Add items to your cart to proceed to checkout'}
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
          <span>{isRTL ? 'חזרה לחנות' : 'Back to Store'}</span>
        </Link>

        <h1 className="text-3xl md:text-4xl font-black text-gray-900 mb-8">
          {isRTL ? 'השלמת הזמנה' : 'Checkout'}
        </h1>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Shipping Form */}
          <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Truck size={24} className="text-cyan-500" />
              {isRTL ? 'פרטי משלוח' : 'Shipping Details'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {isRTL ? 'שם פרטי *' : 'First Name *'}
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={form.firstName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
                    placeholder={isRTL ? 'ישראל' : 'John'}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {isRTL ? 'שם משפחה *' : 'Last Name *'}
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={form.lastName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
                    placeholder={isRTL ? 'ישראלי' : 'Doe'}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {isRTL ? 'אימייל *' : 'Email *'}
                </label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
                  placeholder="email@example.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {isRTL ? 'טלפון *' : 'Phone *'}
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={form.phone}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
                  placeholder={isRTL ? '050-1234567' : '+1 (555) 123-4567'}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {isRTL ? 'כתובת *' : 'Address *'}
                </label>
                <input
                  type="text"
                  name="address"
                  value={form.address}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
                  placeholder={isRTL ? 'רחוב הרצל 1, דירה 5' : '123 Main Street, Apt 4'}
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {isRTL ? 'עיר *' : 'City *'}
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={form.city}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
                    placeholder={isRTL ? 'תל אביב' : 'New York'}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {isRTL ? 'מיקוד' : 'Postal Code'}
                  </label>
                  <input
                    type="text"
                    name="postalCode"
                    value={form.postalCode}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
                    placeholder={isRTL ? '6100000' : '10001'}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {isRTL ? 'מדינה' : 'Country'}
                </label>
                <select
                  name="country"
                  value={form.country}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
                >
                  <option value={isRTL ? 'ישראל' : 'Israel'}>{isRTL ? 'ישראל' : 'Israel'}</option>
                  <option value="United States">United States</option>
                  <option value="United Kingdom">United Kingdom</option>
                  <option value="Germany">Germany</option>
                  <option value="France">France</option>
                </select>
              </div>

              {/* Trust Badges */}
              <div className="flex items-center justify-center gap-6 py-4 border-t border-b border-gray-100 my-6">
                <div className="flex items-center gap-2 text-gray-600">
                  <Shield size={20} className="text-green-500" />
                  <span className="text-sm">{isRTL ? 'תשלום מאובטח' : 'Secure Payment'}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <CreditCard size={20} className="text-blue-500" />
                  <span className="text-sm">{isRTL ? 'כל כרטיסי האשראי' : 'All Cards'}</span>
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={isProcessing}
                className={`w-full py-4 rounded-xl font-bold text-lg transition-all ${
                  isProcessing
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-gradient-to-r from-cyan-500 to-cyan-600 text-white hover:from-cyan-600 hover:to-cyan-700 shadow-lg'
                }`}
              >
                {isProcessing ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    {isRTL ? 'מעבד...' : 'Processing...'}
                  </span>
                ) : (
                  <>
                    {isRTL ? 'בצע הזמנה' : 'Place Order'} - {formatPrice(total, currency)}
                  </>
                )}
              </motion.button>
            </form>
          </div>

          {/* Order Summary */}
          <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 h-fit lg:sticky lg:top-8">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <ShoppingBag size={24} className="text-cyan-500" />
              {isRTL ? 'סיכום הזמנה' : 'Order Summary'}
              <span className="px-2 py-1 bg-cyan-100 text-cyan-700 text-sm font-bold rounded-full">
                {cart.length}
              </span>
            </h2>

            <div className="space-y-4 mb-6">
              {cart.map((item) => (
                <div key={item.id} className="flex gap-4">
                  <div className="relative w-16 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                    <Image
                      src={item.image || '/images/placeholder.jpg'}
                      alt={isRTL ? item.nameHe : item.name}
                      fill
                      className="object-cover"
                    />
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-cyan-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
                      {item.quantity}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-gray-900 truncate">
                      {isRTL ? item.nameHe : item.name}
                    </h3>
                    {(item.size || item.color) && (
                      <p className="text-sm text-gray-500">
                        {item.size && `${isRTL ? 'מידה' : 'Size'}: ${item.size}`}
                        {item.size && item.color && ' | '}
                        {item.color && `${isRTL ? 'צבע' : 'Color'}: ${item.color}`}
                      </p>
                    )}
                    <p className="font-bold text-gray-900">
                      {formatPrice(
                        (currency === 'ILS' ? item.priceIls : item.price) * item.quantity,
                        currency
                      )}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-gray-200 pt-4 space-y-2">
              <div className="flex justify-between text-gray-600">
                <span>{isRTL ? 'סכום ביניים' : 'Subtotal'}</span>
                <span>{formatPrice(total, currency)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>{isRTL ? 'משלוח' : 'Shipping'}</span>
                <span className="text-green-600">{isRTL ? 'חינם' : 'Free'}</span>
              </div>
              <div className="flex justify-between text-xl font-bold text-gray-900 pt-2 border-t">
                <span>{isRTL ? 'סה"כ' : 'Total'}</span>
                <span>{formatPrice(total, currency)}</span>
              </div>
            </div>

            {/* Free Shipping Banner */}
            <div className="mt-6 p-4 bg-gradient-to-r from-cyan-50 to-cyan-100 rounded-xl text-center">
              <p className="text-cyan-700 font-medium">
                {isRTL ? 'משלוח חינם בכל הזמנה!' : 'Free Shipping on All Orders!'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
