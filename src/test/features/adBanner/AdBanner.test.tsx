import { render, screen, act } from '@testing-library/react'
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import AdBanner from '@/features/adBanner/AdBanner'

beforeEach(() => vi.useFakeTimers())
afterEach(() => vi.useRealTimers())

describe('AdBanner', () => {
  it('renders an ad image', () => {
    render(<AdBanner />)
    expect(screen.getByRole('img', { name: 'Ad banner' })).toBeInTheDocument()
  })

  it('starts visible (opacity 1)', () => {
    render(<AdBanner />)
    const img = screen.getByRole('img', { name: 'Ad banner' })
    expect(img).toHaveStyle({ opacity: '1' })
  })

  it('fades out after 13 seconds', () => {
    render(<AdBanner />)
    act(() => vi.advanceTimersByTime(13000))
    const img = screen.getByRole('img', { name: 'Ad banner' })
    expect(img).toHaveStyle({ opacity: '0' })
  })

  it('fades back in after the slide transition completes', () => {
    render(<AdBanner />)
    act(() => vi.advanceTimersByTime(13000 + 400))
    const img = screen.getByRole('img', { name: 'Ad banner' })
    expect(img).toHaveStyle({ opacity: '1' })
  })

  it('cleans up the interval on unmount', () => {
    const clearSpy = vi.spyOn(globalThis, 'clearInterval')
    const { unmount } = render(<AdBanner />)
    unmount()
    expect(clearSpy).toHaveBeenCalled()
  })
})
