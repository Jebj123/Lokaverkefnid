import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { MemoryRouter } from 'react-router-dom'
import Home from '@/features/products/Home'

const products = [
  { id: 1, name: 'Halo', slug: 'halo', description: '', price_cents: 1000, currency: 'ISK', stock_quantity: 10, is_active: true, shop_id: 'shop1', image_url: null, image_url_2: null, image_url_3: null, youtube_url: null, genre: ['Shooter'], platforms: ['PC'] },
  { id: 2, name: 'Zelda', slug: 'zelda', description: '', price_cents: 1000, currency: 'ISK', stock_quantity: 10, is_active: true, shop_id: 'shop1', image_url: null, image_url_2: null, image_url_3: null, youtube_url: null, genre: ['RPG'], platforms: ['Switch'] },
  { id: 3, name: 'FIFA', slug: 'fifa', description: '', price_cents: 1000, currency: 'ISK', stock_quantity: 10, is_active: true, shop_id: 'shop1', image_url: null, image_url_2: null, image_url_3: null, youtube_url: null, genre: ['Sports'], platforms: ['PS5'] },
]

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

vi.mock('@/features/adBanner/AdBanner', () => ({ default: () => null }))

beforeEach(() => {
  mockQuery.mockResolvedValue({ data: products, error: null })
})

const renderHome = (search = '') =>
  render(
    <MemoryRouter initialEntries={[`/${search}`]}>
      <Home />
    </MemoryRouter>
  )

describe('Home', () => {
  it('shows loading state initially', () => {
    renderHome()
    expect(screen.getByText('Loading...')).toBeInTheDocument()
  })

  it('renders all products after fetch', async () => {
    renderHome()
    expect(await screen.findByText('Halo')).toBeInTheDocument()
    expect(screen.getByText('Zelda')).toBeInTheDocument()
    expect(screen.getByText('FIFA')).toBeInTheDocument()
  })

  it('filters products by genre when sidebar is used', async () => {
    renderHome()
    await screen.findByText('Halo')
    await userEvent.click(screen.getByRole('button', { name: 'Filter' }))
    await userEvent.click(screen.getByRole('checkbox', { name: 'Shooter' }))
    expect(screen.getByText('Halo')).toBeInTheDocument()
    expect(screen.queryByText('Zelda')).not.toBeInTheDocument()
    expect(screen.queryByText('FIFA')).not.toBeInTheDocument()
  })

  it('filters products by platform', async () => {
    renderHome()
    await screen.findByText('Halo')
    await userEvent.click(screen.getByRole('button', { name: 'Filter' }))
    await userEvent.click(screen.getByRole('checkbox', { name: 'Switch' }))
    expect(screen.getByText('Zelda')).toBeInTheDocument()
    expect(screen.queryByText('Halo')).not.toBeInTheDocument()
  })

  it('shows no products message when filters match nothing', async () => {
    renderHome()
    await screen.findByText('Halo')
    await userEvent.click(screen.getByRole('button', { name: 'Filter' }))
    await userEvent.click(screen.getByRole('checkbox', { name: 'Shooter' }))
    await userEvent.click(screen.getByRole('checkbox', { name: 'Switch' }))
    expect(screen.getByText('No products found.')).toBeInTheDocument()
  })
})
