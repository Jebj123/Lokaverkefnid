import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { MemoryRouter } from 'react-router-dom'
import SearchResultsPage from '@/features/products/SearchResultsPage'

const MAIN_SHOP_ID = 'a95c999d-f19e-4335-8302-696193934e87'
const RETRO_SHOP_ID = 'a95c999d-f19e-4335-8302-696193934e86'

const mainProduct = {
  id: 1, name: 'Halo', slug: 'halo', description: '', price_cents: 1000,
  currency: 'ISK', stock_quantity: 5, is_active: true, shop_id: MAIN_SHOP_ID,
  image_url: null, image_url_2: null, image_url_3: null, youtube_url: null,
  genre: ['Action'], platforms: ['PC'],
}

const retroProduct = {
  id: 2, name: 'Pac-Man', slug: 'pac-man', description: '', price_cents: 500,
  currency: 'ISK', stock_quantity: 5, is_active: true, shop_id: RETRO_SHOP_ID,
  image_url: null, image_url_2: null, image_url_3: null, youtube_url: null,
  genre: ['Arcade'], platforms: ['Arcade'],
}

// vi.hoisted runs before vi.mock factory so mockQuery is available in the factory
const { mockQuery } = vi.hoisted(() => ({ mockQuery: vi.fn() }))

vi.mock('@/supabaseClient', () => ({
  supabase: {
    from: () => ({
      select: () => ({
        ilike: () => ({
          eq: () => ({
            eq: mockQuery,
          }),
        }),
      }),
    }),
  },
}))

beforeEach(() => {
  mockQuery.mockImplementation((_: string, shopId: string) =>
    Promise.resolve({
      data: shopId === MAIN_SHOP_ID ? [mainProduct] : [retroProduct],
      error: null,
    })
  )
})

const renderPage = (query = 'halo') =>
  render(
    <MemoryRouter initialEntries={[`/search?q=${query}`]}>
      <SearchResultsPage />
    </MemoryRouter>
  )

describe('SearchResultsPage', () => {
  it('shows results from both main and retro shops', async () => {
    renderPage()
    expect(await screen.findByText('Halo')).toBeInTheDocument()
    expect(screen.getByText('Pac-Man')).toBeInTheDocument()
  })

  it('shows Retro badge for retro shop products', async () => {
    renderPage()
    await screen.findByText('Pac-Man')
    expect(screen.getByText('Retro')).toBeInTheDocument()
  })

  it('shows result count in heading', async () => {
    renderPage()
    await screen.findByText('Halo')
    expect(screen.getByText('(2 found)')).toBeInTheDocument()
  })

  it('shows no products message when results are empty', async () => {
    mockQuery.mockResolvedValue({ data: [], error: null })
    renderPage('zzznomatch')
    expect(await screen.findByText('No products found.')).toBeInTheDocument()
  })
})
