'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import CartDrawer from '@/components/layout/CartDrawer';
import SearchModal from '@/components/layout/SearchModal';
import PageLoader from '@/components/layout/PageLoader';
import AccessibilityWidget from '@/components/ui/AccessibilityWidget';
import { useStore } from '@/stores/useStore';

export default function ClientProviders({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdminPage = pathname?.startsWith('/admin');

  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000,
            refetchOnWindowFocus: false,
          },
        },
      })
  );

  const { isLoading, setLoading, locale, _hasHydrated } = useStore();
  const [initialLoad, setInitialLoad] = useState(true);

  // Initial page load animation
  useEffect(() => {
    const timer = setTimeout(() => {
      setInitialLoad(false);
    }, isAdminPage ? 500 : 1500);
    return () => clearTimeout(timer);
  }, [isAdminPage]);

  // Sync document direction with locale
  useEffect(() => {
    if (_hasHydrated) {
      document.documentElement.dir = locale === 'he' ? 'rtl' : 'ltr';
      document.documentElement.lang = locale;
    }
  }, [locale, _hasHydrated]);

  // Handle route change loading
  useEffect(() => {
    const handleStart = () => setLoading(true);

    // Listen for route changes
    window.addEventListener('beforeunload', handleStart);

    return () => {
      window.removeEventListener('beforeunload', handleStart);
    };
  }, [setLoading]);

  // Admin pages - no header/footer
  if (isAdminPage) {
    return (
      <QueryClientProvider client={queryClient}>
        <PageLoader isLoading={initialLoad} />
        <div className={initialLoad ? 'invisible' : 'visible'}>
          {children}
        </div>
      </QueryClientProvider>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      {/* Initial Page Loader */}
      <PageLoader isLoading={initialLoad} />

      {/* Main Content */}
      <div className={initialLoad ? 'invisible' : 'visible'}>
        <Header />
        <main className="min-h-screen">{children}</main>
        <Footer />
        <CartDrawer />
        <SearchModal />
        <AccessibilityWidget />
      </div>

      {/* Loading indicator for route changes */}
      {isLoading && !initialLoad && (
        <div className="fixed top-0 left-0 right-0 z-[100]">
          <div className="h-1 bg-cyan-400 animate-pulse" />
        </div>
      )}
    </QueryClientProvider>
  );
}
