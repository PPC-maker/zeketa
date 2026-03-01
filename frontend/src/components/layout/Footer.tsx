'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { Instagram, Facebook, Twitter, Youtube, Send } from 'lucide-react';
import { useStore } from '@/stores/useStore';
import { useState } from 'react';

const footerLinks = {
  shop: [
    { href: '/new-in', label: 'New Arrivals', labelHe: 'חדשים' },
    { href: '/best-sellers', label: 'Best Sellers', labelHe: 'הנמכרים' },
    { href: '/clothing', label: 'All Clothing', labelHe: 'כל הבגדים' },
    { href: '/accessories', label: 'Accessories', labelHe: 'אקססוריז' },
    { href: '/sale', label: 'Sale', labelHe: 'מבצעים' },
  ],
  help: [
    { href: '/shipping', label: 'Shipping Info', labelHe: 'משלוחים' },
    { href: '/returns', label: 'Returns & Exchanges', labelHe: 'החזרות' },
    { href: '/size-guide', label: 'Size Guide', labelHe: 'מדריך מידות' },
    { href: '/faq', label: 'FAQ', labelHe: 'שאלות נפוצות' },
    { href: '/contact', label: 'Contact Us', labelHe: 'צור קשר' },
  ],
  company: [
    { href: '/about', label: 'About Us', labelHe: 'אודות' },
    { href: '/careers', label: 'Careers', labelHe: 'קריירה' },
    { href: '/privacy', label: 'Privacy Policy', labelHe: 'פרטיות' },
    { href: '/terms', label: 'Terms of Service', labelHe: 'תנאי שימוש' },
  ],
};

const socialLinks = [
  { icon: Instagram, href: 'https://instagram.com/zeketa', label: 'Instagram' },
  { icon: Facebook, href: 'https://facebook.com/zeketa', label: 'Facebook' },
  { icon: Twitter, href: 'https://twitter.com/zeketa', label: 'Twitter' },
  { icon: Youtube, href: 'https://youtube.com/zeketa', label: 'Youtube' },
];

export default function Footer() {
  const { locale } = useStore();
  const [email, setEmail] = useState('');
  const isRTL = locale === 'he';

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement newsletter subscription
    console.log('Subscribe:', email);
    setEmail('');
  };

  return (
    <footer className="bg-black text-white" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Newsletter Section */}
      <div className="border-t border-gray-800">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-2xl mx-auto text-center">
            <motion.h3
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-2xl md:text-3xl font-bold mb-2"
            >
              {isRTL ? 'הצטרפו למשפחה' : 'JOIN THE FAMILY'}
            </motion.h3>
            <p className="text-gray-400 mb-6">
              {isRTL
                ? 'קבלו 10% הנחה על ההזמנה הראשונה והישארו מעודכנים'
                : 'Get 10% off your first order and stay updated on new drops'}
            </p>
            <form onSubmit={handleSubscribe} className="flex gap-2 max-w-md mx-auto">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={isRTL ? 'הכניסו אימייל' : 'Enter your email'}
                className="flex-1 px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400 transition-colors"
                required
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="submit"
                className="px-6 py-3 bg-cyan-400 text-black font-bold rounded-lg hover:bg-cyan-300 transition-colors flex items-center gap-2"
              >
                <Send size={18} />
                <span className="hidden sm:inline">{isRTL ? 'הרשמה' : 'Subscribe'}</span>
              </motion.button>
            </form>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="border-t border-gray-800">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8">
            {/* Logo & Social */}
            <div className="col-span-2 md:col-span-4 lg:col-span-1 mb-8 lg:mb-0">
              <Link href="/">
                <Image
                  src="/images/logo.png"
                  alt="ZEKETA"
                  width={120}
                  height={40}
                  className="h-8 w-auto mb-4"
                  style={{
                    filter: 'drop-shadow(2px 2px 4px rgba(0,0,0,0.5))',
                  }}
                />
              </Link>
              <p className="text-gray-400 text-sm mb-4">
                {isRTL
                  ? 'אופנת רחוב לדור החדש'
                  : 'Streetwear for the next generation'}
              </p>
              <div className="flex gap-3">
                {socialLinks.map((social) => (
                  <motion.a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.2, color: '#22d3ee' }}
                    className="p-2 bg-gray-900 rounded-lg text-gray-400 hover:text-cyan-400 transition-colors"
                    aria-label={social.label}
                  >
                    <social.icon size={20} />
                  </motion.a>
                ))}
              </div>
            </div>

            {/* Shop Links */}
            <div>
              <h4 className="font-bold text-lg mb-4">{isRTL ? 'חנות' : 'Shop'}</h4>
              <ul className="space-y-2">
                {footerLinks.shop.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-gray-400 hover:text-cyan-400 transition-colors"
                    >
                      {isRTL ? link.labelHe : link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Help Links */}
            <div>
              <h4 className="font-bold text-lg mb-4">{isRTL ? 'עזרה' : 'Help'}</h4>
              <ul className="space-y-2">
                {footerLinks.help.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-gray-400 hover:text-cyan-400 transition-colors"
                    >
                      {isRTL ? link.labelHe : link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Company Links */}
            <div>
              <h4 className="font-bold text-lg mb-4">{isRTL ? 'חברה' : 'Company'}</h4>
              <ul className="space-y-2">
                {footerLinks.company.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-gray-400 hover:text-cyan-400 transition-colors"
                    >
                      {isRTL ? link.labelHe : link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Payment Methods */}
            <div>
              <h4 className="font-bold text-lg mb-4">{isRTL ? 'תשלום מאובטח' : 'Secure Payment'}</h4>
              <div className="flex flex-wrap gap-2">
                {['Visa', 'Mastercard', 'Amex', 'PayPal'].map((method) => (
                  <div
                    key={method}
                    className="px-3 py-2 bg-gray-900 rounded text-xs text-gray-400"
                  >
                    {method}
                  </div>
                ))}
              </div>
              <p className="text-gray-500 text-xs mt-4">
                {isRTL ? 'כל העסקאות מוצפנות ומאובטחות' : 'All transactions are encrypted and secure'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-500">
            <p>© 2024 ZEKETA. {isRTL ? 'כל הזכויות שמורות' : 'All rights reserved'}.</p>
            <div className="flex gap-4">
              <Link href="/privacy" className="hover:text-cyan-400 transition-colors">
                {isRTL ? 'מדיניות פרטיות' : 'Privacy Policy'}
              </Link>
              <Link href="/terms" className="hover:text-cyan-400 transition-colors">
                {isRTL ? 'תנאי שימוש' : 'Terms of Service'}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
