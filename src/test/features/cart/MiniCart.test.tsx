import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, beforeEach } from 'vitest'
import { MemoryRouter } from 'react-router-dom'
import { useCart } from '@/features/cart/CartContext'
import MiniCart from '@/features/cart/MiniCart'

const product = {
  id: 1, name: 'Halo', slug: 'halo', description: '', price_cents: 2000,
  currency: 'ISK', stock_quantity: 10, is_active: true, shop_id: 'shop1',
  image_url: null, image_url_2: null, image_url_3: null, youtube_url: null,
  genre: ['Shooter'], platforms: ['PC'],
}

const renderWithCart = (cartItems = [{ product, quantity: 2, platform: 'PC' }]) => {
  useCart.setState({ items: cartItems, totalItems: cartItems.reduce((sum, i) => sum + i.quantity, 0) })
  return render(
    <MemoryRouter>
      <MiniCart />
    </MemoryRouter>
  )
}

beforeEach(() => {
  localStorage.clear()
  useCart.setState({ items: [], totalItems: 0 })
})

describe('MiniCart — empty cart', () => {
  it('shows empty message', () => {
    renderWithCart([])
    expect(screen.getByText('Your cart is empty.')).toBeInTheDocument()
  })
})

describe('MiniCart — cart with items', () => {
  it('shows product name and quantity', () => {
    renderWithCart()
    expect(screen.getByText('Halo')).toBeInTheDocument()
    expect(screen.getByText('Qty: 2 · PC')).toBeInTheDocument()
  })

  it('shows line price and total', () => {
    renderWithCart()
    // '4000 ISK' appears as line price and as total
    expect(screen.getAllByText('4000 ISK')).toHaveLength(2)
  })

  it('shows View Cart link and Go to Checkout button', () => {
    renderWithCart()
    expect(screen.getByRole('link', { name: 'View Cart' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Go to Checkout' })).toBeInTheDocument()
  })

  it('removes item when Remove is clicked', async () => {
    renderWithCart()
    await userEvent.click(screen.getByRole('button', { name: 'Remove' }))
    expect(screen.queryByText('Halo')).not.toBeInTheDocument()
    expect(screen.getByText('Your cart is empty.')).toBeInTheDocument()
  })
})
