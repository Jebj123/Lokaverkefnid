import { renderHook, act } from '@testing-library/react'
import { describe, it, expect, beforeEach } from 'vitest'
import { CartProvider, useCart } from '@/features/cart/CartContext'

const product = {
  id: 1, name: 'Halo', slug: 'halo', description: '', price_cents: 5000,
  currency: 'ISK', stock_quantity: 10, is_active: true, shop_id: 'shop1',
  image_url: null, image_url_2: null, image_url_3: null, youtube_url: null,
  genre: ['Shooter'], platforms: ['PC'],
}

beforeEach(() => localStorage.clear())

describe('useCart', () => {
  it('throws when used outside CartProvider', () => {
    expect(() => renderHook(() => useCart())).toThrow('useCart must be used inside CartProvider')
  })
})

describe('addToCart', () => {
  it('adds a new item', () => {
    const { result } = renderHook(() => useCart(), { wrapper: CartProvider })
    act(() => result.current.addToCart(product))
    expect(result.current.items).toHaveLength(1)
    expect(result.current.items[0].quantity).toBe(1)
  })

  it('increments quantity for existing item', () => {
    const { result } = renderHook(() => useCart(), { wrapper: CartProvider })
    act(() => result.current.addToCart(product))
    act(() => result.current.addToCart(product))
    expect(result.current.items).toHaveLength(1)
    expect(result.current.items[0].quantity).toBe(2)
  })

  it('treats same product on different platforms as separate items', () => {
    const { result } = renderHook(() => useCart(), { wrapper: CartProvider })
    act(() => result.current.addToCart(product, 'PC'))
    act(() => result.current.addToCart(product, 'PS5'))
    expect(result.current.items).toHaveLength(2)
  })
})

describe('removeFromCart', () => {
  it('removes the matching item', () => {
    const { result } = renderHook(() => useCart(), { wrapper: CartProvider })
    act(() => result.current.addToCart(product))
    act(() => result.current.removeFromCart(product.id))
    expect(result.current.items).toHaveLength(0)
  })
})

describe('updateQuantity', () => {
  it('updates quantity', () => {
    const { result } = renderHook(() => useCart(), { wrapper: CartProvider })
    act(() => result.current.addToCart(product))
    act(() => result.current.updateQuantity(product.id, 5))
    expect(result.current.items[0].quantity).toBe(5)
  })

  it('ignores update when quantity is less than 1', () => {
    const { result } = renderHook(() => useCart(), { wrapper: CartProvider })
    act(() => result.current.addToCart(product))
    act(() => result.current.updateQuantity(product.id, 0))
    expect(result.current.items[0].quantity).toBe(1)
  })
})

describe('clearCart', () => {
  it('empties all items', () => {
    const { result } = renderHook(() => useCart(), { wrapper: CartProvider })
    act(() => result.current.addToCart(product))
    act(() => result.current.clearCart())
    expect(result.current.items).toHaveLength(0)
  })
})

describe('totalItems', () => {
  it('sums quantities across all items', () => {
    const product2 = { ...product, id: 2 }
    const { result } = renderHook(() => useCart(), { wrapper: CartProvider })
    act(() => result.current.addToCart(product))
    act(() => result.current.addToCart(product))
    act(() => result.current.addToCart(product2))
    expect(result.current.totalItems).toBe(3)
  })
})

describe('localStorage persistence', () => {
  it('restores cart from localStorage on mount', () => {
    const saved = [{ product, quantity: 3 }]
    localStorage.setItem('cart', JSON.stringify(saved))
    const { result } = renderHook(() => useCart(), { wrapper: CartProvider })
    expect(result.current.items[0].quantity).toBe(3)
  })
})
