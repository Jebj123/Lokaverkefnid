import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import ShopPage from '@/features/products/ShopPage'

const mockProduct = {
  id: 1, name: 'Halo', slug: 'halo', description: '', price_cents: 2000,
  currency: 'ISK', stock_quantity: 10, is_active: true, shop_id: 'shop1',
  image_url: null, image_url_2: null, image_url_3: null, youtube_url: null,
  genre: ['Shooter'], platforms: ['PC'],
}

const { mockQuery } = vi.hoisted(() => ({ mockQuery: vi.fn() }))

vi.mock('@/supabaseClient', () => ({
  supabase: {
    from: () => ({
      select: () => ({
        eq: () => ({
          eq: mockQuery,
        }),
      }),
    }),
  },
}))

beforeEach(() => {
  mockQuery.mockResolvedValue({ data: [mockProduct], error: null })
})

const renderShopPage = (shopId = 'shop1') =>
  render(
    <MemoryRouter initialEntries={[`/shop/${shopId}`]}>
      <Routes>
        <Route path="/shop/:shopId" element={<ShopPage />} />
      </Routes>
    </MemoryRouter>
  )

describe('ShopPage', () => {
  it('shows loading state initially', () => {
    renderShopPage()
    expect(screen.getByText('Loading...')).toBeInTheDocument()
  })

  it('renders products after fetch', async () => {
    renderShopPage()
    expect(await screen.findByText('Halo')).toBeInTheDocument()
    expect(screen.getByText('2000 ISK')).toBeInTheDocument()
  })

  it('shows empty message when no products', async () => {
    mockQuery.mockResolvedValue({ data: [], error: null })
    renderShopPage()
    expect(await screen.findByText('No products found for this shop.')).toBeInTheDocument()
  })

  it('shows error message on fetch failure', async () => {
    mockQuery.mockResolvedValue({ data: null, error: { message: 'Network error' } })
    renderShopPage()
    expect(await screen.findByText('Error: Network error')).toBeInTheDocument()
  })
})
