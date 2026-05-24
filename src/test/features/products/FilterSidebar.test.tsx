import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import FilterSidebar from '@/features/products/FilterSidebar'

const onToggleGenre = vi.fn()
const onTogglePlatform = vi.fn()
const onClearFilters = vi.fn()
const onClose = vi.fn()

const defaultProps = {
  isOpen: true,
  onClose,
  genres: ['Action', 'RPG'],
  platforms: ['PC', 'PS5'],
  selectedGenres: [],
  selectedPlatforms: [],
  onToggleGenre,
  onTogglePlatform,
  onClearFilters,
}

beforeEach(() => vi.clearAllMocks())

describe('FilterSidebar', () => {
  it('renders nothing when closed', () => {
    render(<FilterSidebar {...defaultProps} isOpen={false} />)
    expect(screen.queryByText('Action')).not.toBeInTheDocument()
  })

  it('renders all genre and platform options when open', () => {
    render(<FilterSidebar {...defaultProps} />)
    expect(screen.getByText('Action')).toBeInTheDocument()
    expect(screen.getByText('RPG')).toBeInTheDocument()
    expect(screen.getByText('PC')).toBeInTheDocument()
    expect(screen.getByText('PS5')).toBeInTheDocument()
  })

  it('calls onToggleGenre with the genre when a genre checkbox is clicked', async () => {
    render(<FilterSidebar {...defaultProps} />)
    await userEvent.click(screen.getByRole('checkbox', { name: 'Action' }))
    expect(onToggleGenre).toHaveBeenCalledWith('Action')
  })

  it('calls onTogglePlatform with the platform when a platform checkbox is clicked', async () => {
    render(<FilterSidebar {...defaultProps} />)
    await userEvent.click(screen.getByRole('checkbox', { name: 'PC' }))
    expect(onTogglePlatform).toHaveBeenCalledWith('PC')
  })

  it('shows selected genres as checked', () => {
    render(<FilterSidebar {...defaultProps} selectedGenres={['Action']} />)
    expect(screen.getByRole('checkbox', { name: 'Action' })).toBeChecked()
    expect(screen.getByRole('checkbox', { name: 'RPG' })).not.toBeChecked()
  })

  it('shows Clear filters button when filters are active', () => {
    render(<FilterSidebar {...defaultProps} selectedGenres={['Action']} />)
    expect(screen.getByRole('button', { name: 'Clear filters' })).toBeInTheDocument()
  })

  it('hides Clear filters button when no filters are selected', () => {
    render(<FilterSidebar {...defaultProps} />)
    expect(screen.queryByRole('button', { name: 'Clear filters' })).not.toBeInTheDocument()
  })

  it('calls onClearFilters when Clear filters is clicked', async () => {
    render(<FilterSidebar {...defaultProps} selectedGenres={['Action']} />)
    await userEvent.click(screen.getByRole('button', { name: 'Clear filters' }))
    expect(onClearFilters).toHaveBeenCalledOnce()
  })

  it('calls onClose when the backdrop is clicked', async () => {
    const { container } = render(<FilterSidebar {...defaultProps} />)
    const backdrop = container.querySelector('.fixed.inset-0')!
    await userEvent.click(backdrop)
    expect(onClose).toHaveBeenCalled()
  })
})
