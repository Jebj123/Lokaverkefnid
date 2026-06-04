import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Product } from '../../types'

type CartItem = {
  product: Product
  quantity: number
  platform?: string
}

type CartStore = {
  items: CartItem[]
  totalItems: number
  addToCart: (product: Product, platform?: string) => void
  removeFromCart: (productId: number, platform?: string) => void
  updateQuantity: (productId: number, quantity: number, platform?: string) => void
  clearCart: () => void
}

const computeTotal = (items: CartItem[]) => items.reduce((sum, i) => sum + i.quantity, 0)

export const useCart = create<CartStore>()(
  persist(
    (set) => ({
      items: [],
      totalItems: 0,

      addToCart: (product, platform) => set(state => {
        const existing = state.items.find(i => i.product.id === product.id && i.platform === platform)
        const items = existing
          ? state.items.map(i =>
              i.product.id === product.id && i.platform === platform
                ? { ...i, quantity: i.quantity + 1 }
                : i
            )
          : [...state.items, { product, quantity: 1, platform }]
        return { items, totalItems: computeTotal(items) }
      }),

      removeFromCart: (productId, platform) => set(state => {
        const items = state.items.filter(i => !(i.product.id === productId && i.platform === platform))
        return { items, totalItems: computeTotal(items) }
      }),

      updateQuantity: (productId, quantity, platform) => {
        if (quantity < 1) return
        set(state => {
          const items = state.items.map(i =>
            i.product.id === productId && i.platform === platform ? { ...i, quantity } : i
          )
          return { items, totalItems: computeTotal(items) }
        })
      },

      clearCart: () => set({ items: [], totalItems: 0 }),
    }),
    { name: 'cart' }
  )
)

