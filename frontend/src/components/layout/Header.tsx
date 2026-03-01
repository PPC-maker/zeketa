'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { Search, ShoppingBag, User, Menu, X, ChevronDown } from 'lucide-react';
import { useStore } from '@/stores/useStore';
import { cn } from '@/lib/utils';

const navItems = [
  {
    href: '/category/men',
    label: 'Men',
    labelHe: 'גברים',
    submenu: [
      { href: '/category/men', label: 'All Men', labelHe: 'כל הבגדים' },
      { href: '/category/men?type=tank-top', label: 'Tank Tops', labelHe: 'גופיות' },
      { href: '/category/men?type=shirts', label: 'Shirts', labelHe: 'חולצות' },
      { href: '/category/men?type=hoodies', label: 'Hoodies', labelHe: 'הודיות' },
      { href: '/category/men?type=pants', label: 'Pants', labelHe: 'מכנסיים' },
    ],
  },
  {
    href: '/category/women',
    label: 'Women',
    labelHe: 'נשים',
    submenu: [
      { href: '/category/women', label: 'All Women', labelHe: 'כל הבגדים' },
      { href: '/category/women?type=tank-top', label: 'Tank Tops', labelHe: 'גופיות' },
      { href: '/category/women?type=shirts', label: 'Shirts', labelHe: 'חולצות' },
      { href: '/category/women?type=hoodies', label: 'Hoodies', labelHe: 'הודיות' },
      { href: '/category/women?type=dresses', label: 'Dresses', labelHe: 'שמלות' },
    ],
  },
  { href: '/best-sellers', label: 'Best Sellers', labelHe: 'הנמכרים ביותר' },
  { href: '/new-in', label: 'New In', labelHe: 'חדש באתר' },
  { href: '/contact', label: 'Contact', labelHe: 'צור קשר' },
];

export default function Header() {
  const { locale, setLocale, currency, setCurrency, setCartOpen, setSearchOpen, getCartCount, isMenuOpen, setMenuOpen } = useStore();
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSubmenu, setActiveSubmenu] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isRTL = locale === 'he';
  const cartCount = mounted ? getCartCount() : 0;

  return (
    <>
      {/* Announcement Bar - Marquee */}
      <div className="bg-black text-white py-2 overflow-hidden border-b border-gray-800">
        <motion.div
          className="flex whitespace-nowrap"
          animate={{ x: isRTL ? ['100%', '-100%'] : ['-100%', '100%'] }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
        >
          {[...Array(4)].map((_, i) => (
            <span key={i} className="flex items-center mx-8 text-sm">
              <span className="text-cyan-400 mr-2">✦</span>
              {locale === 'he' ? 'משלוח חינם בהזמנה מעל $70' : 'Free Worldwide Shipping Over $70'}
              <span className="text-cyan-400 mx-4">✦</span>
              {locale === 'he' ? 'החלפות והחזרות חינם' : 'Free Returns & Exchanges'}
            </span>
          ))}
        </motion.div>
      </div>

      {/* Main Header */}
      <header
        className={cn(
          'sticky top-0 z-50 transition-all duration-300',
          isScrolled ? 'bg-black/95 backdrop-blur-md shadow-lg' : 'bg-black'
        )}
        dir={isRTL ? 'rtl' : 'ltr'}
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Mobile Menu Button */}
            <button
              className="lg:hidden p-2 text-white hover:text-cyan-400 transition-colors"
              onClick={() => setMenuOpen(!isMenuOpen)}
              aria-label="Menu"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            {/* Logo */}
            <Link href="/" className="flex-shrink-0">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="relative"
              >
                <Image
                  src="/images/logo.png"
                  alt="ZEKETA"
                  width={150}
                  height={50}
                  className="h-8 lg:h-10 w-auto"
                  style={{
                    filter: 'drop-shadow(2px 2px 4px rgba(0,0,0,0.5))',
                  }}
                  priority
                />
              </motion.div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-1">
              {navItems.map((item) => (
                <div
                  key={item.href}
                  className="relative group"
                  onMouseEnter={() => item.submenu && setActiveSubmenu(item.href)}
                  onMouseLeave={() => setActiveSubmenu(null)}
                >
                  <Link
                    href={item.href}
                    className="flex items-center gap-1 px-4 py-2 text-white hover:text-cyan-400 transition-colors font-medium text-sm uppercase tracking-wide"
                  >
                    {isRTL ? item.labelHe : item.label}
                    {item.submenu && (
                      <ChevronDown
                        size={14}
                        className={cn(
                          'transition-transform duration-200',
                          activeSubmenu === item.href && 'rotate-180'
                        )}
                      />
                    )}
                  </Link>

                  {/* Dropdown Menu */}
                  {item.submenu && (
                    <AnimatePresence>
                      {activeSubmenu === item.href && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 10 }}
                          transition={{ duration: 0.2 }}
                          className="absolute top-full left-0 mt-2 w-56 bg-black/95 backdrop-blur-md border border-gray-800 rounded-lg shadow-xl overflow-hidden"
                        >
                          {item.submenu.map((subItem, index) => (
                            <motion.div
                              key={subItem.href}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: index * 0.05 }}
                            >
                              <Link
                                href={subItem.href}
                                className="block px-4 py-3 text-gray-300 hover:text-white hover:bg-cyan-400/10 transition-colors border-b border-gray-800/50 last:border-0"
                              >
                                {isRTL ? subItem.labelHe : subItem.label}
                              </Link>
                            </motion.div>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  )}
                </div>
              ))}
            </nav>

            {/* Right Icons */}
            <div className="flex items-center gap-2 lg:gap-4">
              {/* Currency Selector */}
              <button
                onClick={() => setCurrency(currency === 'USD' ? 'ILS' : 'USD')}
                className="hidden sm:flex items-center gap-1 px-2 py-1 text-white hover:text-cyan-400 transition-colors text-sm font-medium"
              >
                {currency === 'USD' ? '$ USD' : '₪ ILS'}
              </button>

              {/* Language Selector */}
              <button
                onClick={() => setLocale(locale === 'en' ? 'he' : 'en')}
                className="p-2 text-white hover:text-cyan-400 transition-colors"
                aria-label="Change Language"
              >
                <span className="text-lg">{locale === 'en' ? '🇮🇱' : '🇺🇸'}</span>
              </button>

              {/* Search */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setSearchOpen(true)}
                className="p-2 text-white hover:text-cyan-400 transition-colors"
                aria-label="Search"
              >
                <Search size={22} />
              </motion.button>

              {/* User */}
              <Link href="/admin">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="p-2 text-white hover:text-cyan-400 transition-colors"
                  aria-label="Account"
                >
                  <User size={22} />
                </motion.button>
              </Link>

              {/* Cart */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setCartOpen(true)}
                className="relative p-2 text-white hover:text-cyan-400 transition-colors"
                aria-label="Cart"
              >
                <ShoppingBag size={22} />
                {cartCount > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1 w-5 h-5 bg-cyan-400 text-black text-xs font-bold rounded-full flex items-center justify-center"
                  >
                    {cartCount > 9 ? '9+' : cartCount}
                  </motion.span>
                )}
              </motion.button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: isRTL ? '100%' : '-100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: isRTL ? '100%' : '-100%' }}
            transition={{ type: 'tween', duration: 0.3 }}
            className="fixed inset-0 z-40 bg-black lg:hidden"
            dir={isRTL ? 'rtl' : 'ltr'}
          >
            <div className="pt-20 px-6 pb-6 h-full overflow-y-auto">
              {navItems.map((item, index) => (
                <motion.div
                  key={item.href}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="border-b border-gray-800"
                >
                  <Link
                    href={item.href}
                    onClick={() => setMenuOpen(false)}
                    className="block py-4 text-white text-xl font-medium"
                  >
                    {isRTL ? item.labelHe : item.label}
                  </Link>
                  {item.submenu && (
                    <div className="pl-4 pb-4 space-y-2">
                      {item.submenu.map((subItem) => (
                        <Link
                          key={subItem.href}
                          href={subItem.href}
                          onClick={() => setMenuOpen(false)}
                          className="block py-2 text-gray-400 hover:text-cyan-400"
                        >
                          {isRTL ? subItem.labelHe : subItem.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </motion.div>
              ))}

              {/* Mobile Currency & Language */}
              <div className="mt-8 flex gap-4">
                <button
                  onClick={() => setCurrency(currency === 'USD' ? 'ILS' : 'USD')}
                  className="flex-1 py-3 bg-gray-900 text-white rounded-lg font-medium"
                >
                  {currency === 'USD' ? '$ USD' : '₪ ILS'}
                </button>
                <button
                  onClick={() => setLocale(locale === 'en' ? 'he' : 'en')}
                  className="flex-1 py-3 bg-gray-900 text-white rounded-lg font-medium"
                >
                  {locale === 'en' ? '🇮🇱 עברית' : '🇺🇸 English'}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
