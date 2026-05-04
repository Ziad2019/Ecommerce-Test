// src/store/cart-store.ts
import { create } from "zustand"
import { persist, createJSONStorage } from "zustand/middleware"

export interface CartItem {
  id: string
  name: string
  price: number
  image: string
  quantity: number
  stock: number
  slug: string
  variant?: Record<string, string>
}

interface CartStore {
  items: CartItem[]
  isOpen: boolean

  // Actions
  addItem: (item: CartItem) => void
  removeItem: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  clearCart: () => void
  toggleCart: () => void
  openCart: () => void
  closeCart: () => void

  // Computed
  getItemCount: () => number
  getSubtotal: () => number
  getItem: (id: string) => CartItem | undefined
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,

      addItem: (item) => {
        const currentItems = get().items
        const existingItem = currentItems.find((i) => i.id === item.id)

        if (existingItem) {
          const newQuantity = Math.min(
            existingItem.quantity + item.quantity,
            item.stock
          )
          set({
            items: currentItems.map((i) =>
              i.id === item.id ? { ...i, quantity: newQuantity } : i
            ),
          })
        } else {
          set({ items: [...currentItems, item] })
        }
      },

      removeItem: (id) => {
        set({ items: get().items.filter((i) => i.id !== id) })
      },

      updateQuantity: (id, quantity) => {
        if (quantity <= 0) {
          get().removeItem(id)
          return
        }
        set({
          items: get().items.map((i) =>
            i.id === id ? { ...i, quantity: Math.min(quantity, i.stock) } : i
          ),
        })
      },

      clearCart: () => set({ items: [] }),
      toggleCart: () => set({ isOpen: !get().isOpen }),
      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),

      getItemCount: () => get().items.reduce((acc, i) => acc + i.quantity, 0),
      getSubtotal: () =>
        get().items.reduce((acc, i) => acc + i.price * i.quantity, 0),
      getItem: (id) => get().items.find((i) => i.id === id),
    }),
    {
      name: "cart-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ items: state.items }),
    }
  )
)