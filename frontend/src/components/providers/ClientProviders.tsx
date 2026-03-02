'use client';

import { useState, useEffect } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import CartDrawer from '@/components/layout/CartDrawer';
import SearchModal from '@/components/layout/SearchModal';
import PageLoader from '@/components/layout/PageLoader';
import { useStore } from '@/stores/useStore';

export default function ClientProviders({ children }: { children: React.ReactNode }) {
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

  const { isLoading, setLoading } = useStore();
  const [initialLoad, setInitialLoad] = useState(true);

  // Initial page load animation
  useEffect(() => {
    const timer = setTimeout(() => {
      setInitialLoad(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  // Handle route change loading
  useEffect(() => {
    const handleStart = () => setLoading(true);
    const handleComplete = () => setLoading(false);

    // Listen for route changes
    window.addEventListener('beforeunload', handleStart);

    return () => {
      window.removeEventListener('beforeunload', handleStart);
    };
  }, [setLoading]);

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
