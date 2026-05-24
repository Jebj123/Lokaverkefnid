import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { MemoryRouter } from 'react-router-dom'
import SearchDropdown from '@/features/products/SearchDropdown'

vi.mock('@/supabaseClient', () => ({
  supabase: {
    from: () => ({
      select: () => ({
        ilike: () => ({
          eq: () => ({
            eq: () => ({
              limit: () => Promise.resolve({ data: [] }),
            }),
          }),
        }),
      }),
    }),
  },
}))

describe('SearchDropdown', () => {
  it('renders nothing when query is empty', () => {
    const { container } = render(
      <MemoryRouter>
        <SearchDropdown query="" onSelect={vi.fn()} />
      </MemoryRouter>
    )
    expect(container.firstChild).toBeNull()
  })

  it('shows no results message for unmatched query', async () => {
    render(
      <MemoryRouter>
        <SearchDropdown query="zzznomatch" onSelect={vi.fn()} />
      </MemoryRouter>
    )
    expect(await screen.findByText(/No results for/)).toBeInTheDocument()
  })
})
