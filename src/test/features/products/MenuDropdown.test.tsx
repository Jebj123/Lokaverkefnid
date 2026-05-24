import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { MemoryRouter } from 'react-router-dom'
import MenuDropdown from '@/features/products/MenuDropdown'

describe('MenuDropdown', () => {
  it('renders nav links', () => {
    render(
      <MemoryRouter>
        <MenuDropdown onClose={vi.fn()} />
      </MemoryRouter>
    )
    expect(screen.getByText('Games')).toBeInTheDocument()
    expect(screen.getByText('Retro Games')).toBeInTheDocument()
  })

  it('calls onClose when close button is clicked', async () => {
    const onClose = vi.fn()
    render(
      <MemoryRouter>
        <MenuDropdown onClose={onClose} />
      </MemoryRouter>
    )
    await userEvent.click(screen.getByRole('button'))
    expect(onClose).toHaveBeenCalledOnce()
  })
})
