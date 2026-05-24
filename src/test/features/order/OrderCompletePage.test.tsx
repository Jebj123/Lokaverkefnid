import { render, screen } from '@testing-library/react'
import { describe, it, expect, beforeEach } from 'vitest'
import { MemoryRouter } from 'react-router-dom'
import OrderCompletePage from '@/features/order/OrderCompletePage'

const product = {
  id: 1, name: 'Halo', slug: 'halo', description: '', price_cents: 2000,
  currency: 'ISK', stock_quantity: 10, is_active: true, shop_id: 'shop1',
  image_url: null, image_url_2: null, image_url_3: null, youtube_url: null,
  genre: ['Shooter'], platforms: ['PC'],
}

beforeEach(() => sessionStorage.clear())

describe('OrderCompletePage', () => {
  it('shows purchased product name, quantity and total', () => {
    sessionStorage.setItem('orderSnapshot', JSON.stringify([
      { product, quantity: 2, platform: 'PC' }
    ]))
    render(<MemoryRouter><OrderCompletePage /></MemoryRouter>)
    expect(screen.getByText('Halo')).toBeInTheDocument()
    expect(screen.getByText('Qty: 2')).toBeInTheDocument()
    // '4000 ISK' appears twice: once as the line price, once as the total
    expect(screen.getAllByText('4000 ISK')).toHaveLength(2)
  })

  it('shows total summed across multiple items', () => {
    const product2 = { ...product, id: 2, name: 'Doom', price_cents: 1000 }
    sessionStorage.setItem('orderSnapshot', JSON.stringify([
      { product, quantity: 1 },
      { product: product2, quantity: 3 },
    ]))
    render(<MemoryRouter><OrderCompletePage /></MemoryRouter>)
    expect(screen.getByText('Halo')).toBeInTheDocument()
    expect(screen.getByText('Doom')).toBeInTheDocument()
    expect(screen.getByText('5000 ISK')).toBeInTheDocument()
  })

  it('clears sessionStorage after reading the snapshot', () => {
    sessionStorage.setItem('orderSnapshot', JSON.stringify([{ product, quantity: 1 }]))
    render(<MemoryRouter><OrderCompletePage /></MemoryRouter>)
    expect(sessionStorage.getItem('orderSnapshot')).toBeNull()
  })

  it('shows Order Complete heading with no snapshot', () => {
    render(<MemoryRouter><OrderCompletePage /></MemoryRouter>)
    expect(screen.getByText('Order Complete')).toBeInTheDocument()
  })
})
