import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Cart Item Type
interface CartItem {
  id: string;
  productId: string;
  name: string;
  nameHe: string;
  price: number;
  priceIls: number;
  image: string;
  quantity: number;
  size?: string;
  color?: string;
}

// Store State
interface StoreState {
  // Cart
  cart: CartItem[];
  addToCart: (item: Omit<CartItem, 'id'>) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  getCartCount: () => number;

  // Currency
  currency: 'USD' | 'ILS';
  setCurrency: (currency: 'USD' | 'ILS') => void;

  // Language
  locale: 'en' | 'he';
  setLocale: (locale: 'en' | 'he') => void;

  // UI State
  isCartOpen: boolean;
  setCartOpen: (open: boolean) => void;
  isSearchOpen: boolean;
  setSearchOpen: (open: boolean) => void;
  isMenuOpen: boolean;
  setMenuOpen: (open: boolean) => void;
  isLoading: boolean;
  setLoading: (loading: boolean) => void;
}

export const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      // Cart
      cart: [],

      addToCart: (item) => {
        const cart = get().cart;
        const existingIndex = cart.findIndex(
          (i) => i.productId === item.productId && i.size === item.size && i.color === item.color
        );

        if (existingIndex > -1) {
          const newCart = [...cart];
          newCart[existingIndex].quantity += item.quantity;
          set({ cart: newCart });
        } else {
          const id = `${item.productId}-${item.size || ''}-${item.color || ''}-${Date.now()}`;
          set({ cart: [...cart, { ...item, id }] });
        }
      },

      removeFromCart: (id) => {
        set({ cart: get().cart.filter((item) => item.id !== id) });
      },

      updateQuantity: (id, quantity) => {
        if (quantity <= 0) {
          get().removeFromCart(id);
          return;
        }
        const newCart = get().cart.map((item) =>
          item.id === id ? { ...item, quantity } : item
        );
        set({ cart: newCart });
      },

      clearCart: () => set({ cart: [] }),

      getCartTotal: () => {
        const { cart, currency } = get();
        return cart.reduce((total, item) => {
          const price = currency === 'ILS' ? item.priceIls : item.price;
          return total + price * item.quantity;
        }, 0);
      },

      getCartCount: () => {
        return get().cart.reduce((count, item) => count + item.quantity, 0);
      },

      // Currency
      currency: 'USD',
      setCurrency: (currency) => set({ currency }),

      // Language
      locale: 'en',
      setLocale: (locale) => set({ locale }),

      // UI State
      isCartOpen: false,
      setCartOpen: (open) => set({ isCartOpen: open }),
      isSearchOpen: false,
      setSearchOpen: (open) => set({ isSearchOpen: open }),
      isMenuOpen: false,
      setMenuOpen: (open) => set({ isMenuOpen: open }),
      isLoading: false,
      setLoading: (loading) => set({ isLoading: loading }),
    }),
    {
      name: 'zeketa-store',
      partialize: (state) => ({
        cart: state.cart,
        currency: state.currency,
        locale: state.locale,
      }),
    }
  )
);
