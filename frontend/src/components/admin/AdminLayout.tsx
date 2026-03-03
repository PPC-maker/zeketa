'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Package,
  FolderTree,
  ShoppingCart,
  Users,
  FileText,
  Upload,
  Settings,
  LogOut,
  Menu,
  X,
  Bell,
  Search,
  Globe,
} from 'lucide-react';
import { useStore } from '@/stores/useStore';

interface NavItem {
  href: string;
  icon: any;
  labelEn: string;
  labelHe: string;
  roles?: string[];
}

const navItems: NavItem[] = [
  { href: '/admin/dashboard', icon: LayoutDashboard, labelEn: 'Dashboard', labelHe: 'דשבורד' },
  { href: '/admin/products', icon: Package, labelEn: 'Products', labelHe: 'מוצרים' },
  { href: '/admin/categories', icon: FolderTree, labelEn: 'Categories', labelHe: 'קטגוריות' },
  { href: '/admin/orders', icon: ShoppingCart, labelEn: 'Orders', labelHe: 'הזמנות' },
  { href: '/admin/import', icon: Upload, labelEn: 'Import CSV', labelHe: 'ייבוא CSV' },
  { href: '/admin/users', icon: Users, labelEn: 'Users', labelHe: 'משתמשים', roles: ['ADMIN'] },
  { href: '/admin/logs', icon: FileText, labelEn: 'Logs', labelHe: 'לוגים', roles: ['ADMIN'] },
  { href: '/admin/settings', icon: Settings, labelEn: 'Settings', labelHe: 'הגדרות', roles: ['ADMIN'] },
];

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const { locale, setLocale } = useStore();
  const pathname = usePathname();
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const isRTL = locale === 'he';

  useEffect(() => {
    // Check authentication
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');

    if (!token || !userData) {
      router.push('/admin');
      return;
    }

    try {
      setUser(JSON.parse(userData));
    } catch {
      router.push('/admin');
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/admin');
  };

  const filteredNavItems = navItems.filter((item) => {
    if (!item.roles) return true;
    return user && item.roles.includes(user.role);
  });

  if (!user) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="w-8 h-8 border-2 border-cyan-400 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Sidebar - Desktop */}
      <motion.aside
        initial={false}
        animate={{ width: isSidebarOpen ? 256 : 80 }}
        className={`fixed top-0 ${isRTL ? 'right-0' : 'left-0'} h-full bg-gray-900 text-white z-40 hidden lg:block`}
      >
        {/* Logo */}
        <div className="p-4 border-b border-gray-800">
          <Link href="/admin/dashboard" className="flex items-center gap-3">
            <Image
              src="/images/logo.png"
              alt="ZEKETA"
              width={40}
              height={40}
              className="flex-shrink-0"
              style={{ filter: 'drop-shadow(0 0 5px rgba(0,255,255,0.5))' }}
            />
            <AnimatePresence>
              {isSidebarOpen && (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-lg font-bold"
                >
                  ZEKETA Admin
                </motion.span>
              )}
            </AnimatePresence>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-2">
          {filteredNavItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link key={item.href} href={item.href}>
                <motion.div
                  whileHover={{ x: isRTL ? -5 : 5 }}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-cyan-400 text-black'
                      : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                  }`}
                >
                  <item.icon size={20} />
                  <AnimatePresence>
                    {isSidebarOpen && (
                      <motion.span
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="font-medium"
                      >
                        {isRTL ? item.labelHe : item.labelEn}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </motion.div>
              </Link>
            );
          })}
        </nav>

        {/* Toggle Button */}
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className={`absolute bottom-4 ${isRTL ? 'left-4' : 'right-4'} p-2 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors`}
        >
          <Menu size={20} />
        </button>
      </motion.aside>

      {/* Mobile Header */}
      <header className="lg:hidden fixed top-0 left-0 right-0 bg-gray-900 text-white z-40">
        <div className="flex items-center justify-between p-4">
          <button onClick={() => setIsMobileMenuOpen(true)}>
            <Menu size={24} />
          </button>
          <Image
            src="/images/logo.png"
            alt="ZEKETA"
            width={100}
            height={30}
            style={{ filter: 'drop-shadow(0 0 5px rgba(0,255,255,0.5))' }}
          />
          <button onClick={handleLogout}>
            <LogOut size={24} />
          </button>
        </div>
      </header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="lg:hidden fixed inset-0 bg-black/50 z-50"
            />
            <motion.div
              initial={{ x: isRTL ? '100%' : '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: isRTL ? '100%' : '-100%' }}
              className={`lg:hidden fixed top-0 ${isRTL ? 'right-0' : 'left-0'} w-64 h-full bg-gray-900 text-white z-50 p-4`}
            >
              <div className="flex items-center justify-between mb-6">
                <span className="text-lg font-bold">Menu</span>
                <button onClick={() => setIsMobileMenuOpen(false)}>
                  <X size={24} />
                </button>
              </div>
              <nav className="space-y-2">
                {filteredNavItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <div
                      className={`flex items-center gap-3 px-4 py-3 rounded-lg ${
                        pathname === item.href
                          ? 'bg-cyan-400 text-black'
                          : 'text-gray-400 hover:bg-gray-800'
                      }`}
                    >
                      <item.icon size={20} />
                      <span>{isRTL ? item.labelHe : item.labelEn}</span>
                    </div>
                  </Link>
                ))}
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main
        className={`transition-all duration-300 ${
          isSidebarOpen ? 'lg:ml-64' : 'lg:ml-20'
        } ${isRTL ? 'lg:mr-64 lg:ml-0' : ''} pt-16 lg:pt-0`}
        style={isRTL ? { marginRight: isSidebarOpen ? '256px' : '80px', marginLeft: 0 } : {}}
      >
        {/* Top Bar */}
        <div className="bg-white shadow-sm p-4 hidden lg:flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder={isRTL ? 'חיפוש...' : 'Search...'}
                className="pl-10 pr-4 py-2 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400"
              />
            </div>
          </div>
          <div className="flex items-center gap-4">
            {/* Language Switcher */}
            <button
              onClick={() => setLocale(locale === 'he' ? 'en' : 'he')}
              className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
              title={isRTL ? 'החלף שפה' : 'Switch Language'}
            >
              <Globe size={18} />
              <span className="text-sm font-medium">{locale === 'he' ? 'EN' : 'עב'}</span>
            </button>
            <button className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-lg">
              <Bell size={20} />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
            </button>
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="font-medium text-gray-900">
                  {user.firstName || user.email}
                </p>
                <p className="text-sm text-gray-500">{user.role}</p>
              </div>
              <button
                onClick={handleLogout}
                className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                title={isRTL ? 'התנתק' : 'Logout'}
              >
                <LogOut size={20} />
              </button>
            </div>
          </div>
        </div>

        {/* Page Content */}
        <div className="p-4 lg:p-6">{children}</div>
      </main>
    </div>
  );
}
