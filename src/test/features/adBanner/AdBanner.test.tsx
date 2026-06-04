import { render, screen, act } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import AdBanner from '@/features/adBanner/AdBanner'

const renderWithRouter = () => render(<MemoryRouter><AdBanner /></MemoryRouter>)

beforeEach(() => vi.useFakeTimers())
afterEach(() => vi.useRealTimers())

describe('AdBanner', () => {
  it('renders an ad image', () => {
    renderWithRouter()
    expect(screen.getByRole('img', { name: 'Ad banner' })).toBeInTheDocument()
  })

  it('starts visible (opacity 1)', () => {
    renderWithRouter()
    const img = screen.getByRole('img', { name: 'Ad banner' })
    expect(img).toHaveStyle({ opacity: '1' })
  })

  it('fades out after 10 seconds', () => {
    renderWithRouter()
    act(() => vi.advanceTimersByTime(10000))
    const img = screen.getByRole('img', { name: 'Ad banner' })
    expect(img).toHaveStyle({ opacity: '0' })
  })

  it('fades back in after the slide transition completes', () => {
    renderWithRouter()
    act(() => vi.advanceTimersByTime(10000 + 400))
    const img = screen.getByRole('img', { name: 'Ad banner' })
    expect(img).toHaveStyle({ opacity: '1' })
  })

  it('cleans up the interval on unmount', () => {
    const clearSpy = vi.spyOn(globalThis, 'clearInterval')
    const { unmount } = renderWithRouter()
    unmount()
    expect(clearSpy).toHaveBeenCalled()
  })
})
