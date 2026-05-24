import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, beforeEach } from 'vitest'
import { MemoryRouter } from 'react-router-dom'
import { CartProvider } from '@/features/cart/CartContext'
import CheckoutPage from '@/features/checkout/checkoutPage'

const product = {
  id: 1, name: 'Halo', slug: 'halo', description: '', price_cents: 2000,
  currency: 'ISK', stock_quantity: 10, is_active: true, shop_id: 'shop1',
  image_url: null, image_url_2: null, image_url_3: null, youtube_url: null,
  genre: ['Shooter'], platforms: ['PC'],
}

const renderWithCart = (cartItems = [{ product, quantity: 2 }]) => {
  localStorage.setItem('cart', JSON.stringify(cartItems))
  return render(
    <MemoryRouter>
      <CartProvider>
        <CheckoutPage />
      </CartProvider>
    </MemoryRouter>
  )
}

beforeEach(() => localStorage.clear())

describe('CheckoutPage — empty cart', () => {
  it('shows empty state message', () => {
    renderWithCart([])
    expect(screen.getByText('No items to checkout.')).toBeInTheDocument()
  })
})

describe('CheckoutPage — cart with items', () => {
  it('shows the product name and quantity', () => {
    renderWithCart()
    expect(screen.getByText('Halo')).toBeInTheDocument()
    expect(screen.getByText('Qty: 2')).toBeInTheDocument()
  })

  it('shows the correct total', () => {
    renderWithCart()
    // 2000 * 2 = 4000; appears as line price and total
    expect(screen.getAllByText('4000 ISK')).toHaveLength(2)
  })

  it('renders all form fields', () => {
    renderWithCart()
    expect(screen.getByPlaceholderText('John Doe')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('john@example.com')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('123 Main St')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Reykjavik')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('101')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('1234567812345678')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('MM/YY')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('123')).toBeInTheDocument()
  })

  it('shows validation errors when submitting empty form', async () => {
    renderWithCart()
    await userEvent.click(screen.getByRole('button', { name: 'Place Order' }))
    expect(await screen.findByText('Full name is required')).toBeInTheDocument()
  })
})
