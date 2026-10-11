import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CartItem } from '@/types';

interface CartState {
  items: CartItem[];
  isOpen: boolean;
  addItem: (item: Omit<CartItem, 'id'>) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, delta: number) => void;
  clearCart: () => void;
  setIsOpen: (isOpen: boolean) => void;
  getSubtotal: () => number;
  getTotalCount: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      addItem: (newItem) => {
        set((state) => {
          const existingIndex = state.items.findIndex(
            (i) =>
              i.productId === newItem.productId &&
              i.woodFinish === newItem.woodFinish &&
              i.fabricFinish === newItem.fabricFinish
          );

          if (existingIndex > -1) {
            const updated = [...state.items];
            updated[existingIndex].quantity += newItem.quantity;
            return { items: updated, isOpen: true };
          }

          const id = `${newItem.productId}-${Date.now()}`;
          return {
            items: [...state.items, { ...newItem, id }],
            isOpen: true,
          };
        });
      },
      removeItem: (id) => {
        set((state) => ({
          items: state.items.filter((item) => item.id !== id),
        }));
      },
      updateQuantity: (id, delta) => {
        set((state) => {
          const updated = state.items
            .map((item) => {
              if (item.id === id) {
                const newQty = item.quantity + delta;
                return newQty > 0 ? { ...item, quantity: newQty } : null;
              }
              return item;
            })
            .filter(Boolean) as CartItem[];
          return { items: updated };
        });
      },
      clearCart: () => set({ items: [] }),
      setIsOpen: (isOpen) => set({ isOpen }),
      getSubtotal: () => {
        return get().items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
      },
      getTotalCount: () => {
        return get().items.reduce((sum, item) => sum + item.quantity, 0);
      },
    }),
    {
      name: 'archetyp-cart-storage',
      partialize: (state) => ({ items: state.items }),
    }
  )
);

