import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, beforeEach } from 'vitest'
import { MemoryRouter } from 'react-router-dom'
import { useCart } from '@/features/cart/CartContext'
import CartPage from '@/features/cart/CartPage'

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
      <CartPage />
    </MemoryRouter>
  )
}

beforeEach(() => {
  localStorage.clear()
  useCart.setState({ items: [], totalItems: 0 })
})

describe('CartPage — empty cart', () => {
  it('shows empty cart message', () => {
    renderWithCart([])
    expect(screen.getByText('Your cart is empty.')).toBeInTheDocument()
  })
})

describe('CartPage — cart with items', () => {
  it('shows product name, platform and price', () => {
    renderWithCart()
    expect(screen.getByText('Halo')).toBeInTheDocument()
    expect(screen.getByText('PC')).toBeInTheDocument()
    // '4000 ISK' appears twice: once as line price, once as total
    expect(screen.getAllByText('4000 ISK')).toHaveLength(2)
  })

  it('removes item when Remove is clicked', async () => {
    renderWithCart()
    await userEvent.click(screen.getByRole('button', { name: 'Remove' }))
    expect(screen.queryByText('Halo')).not.toBeInTheDocument()
  })

  it('shows Checkout button', () => {
    renderWithCart()
    expect(screen.getByRole('button', { name: 'Checkout' })).toBeInTheDocument()
  })
})
