import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { MemoryRouter } from 'react-router-dom'
import { ProtectedRoute } from '@/features/auth/protectedRoute'

vi.mock('@clerk/clerk-react', () => ({
  useAuth: vi.fn(),
  RedirectToSignUp: () => <div>Redirecting to sign up</div>,
}))

import { useAuth } from '@clerk/clerk-react'

describe('ProtectedRoute', () => {
  it('renders children when signed in', () => {
    vi.mocked(useAuth).mockReturnValue({ isSignedIn: true, isLoaded: true } as unknown as ReturnType<typeof useAuth>)
    render(
      <MemoryRouter>
        <ProtectedRoute><div>Protected content</div></ProtectedRoute>
      </MemoryRouter>
    )
    expect(screen.getByText('Protected content')).toBeInTheDocument()
  })

  it('redirects when not signed in', () => {
    vi.mocked(useAuth).mockReturnValue({ isSignedIn: false, isLoaded: true } as unknown as ReturnType<typeof useAuth>)
    render(
      <MemoryRouter>
        <ProtectedRoute><div>Protected content</div></ProtectedRoute>
      </MemoryRouter>
    )
    expect(screen.queryByText('Protected content')).not.toBeInTheDocument()
    expect(screen.getByText('Redirecting to sign up')).toBeInTheDocument()
  })

  it('renders nothing while auth is loading', () => {
    vi.mocked(useAuth).mockReturnValue({ isSignedIn: false, isLoaded: false } as unknown as ReturnType<typeof useAuth>)
    const { container } = render(
      <MemoryRouter>
        <ProtectedRoute><div>Protected content</div></ProtectedRoute>
      </MemoryRouter>
    )
    expect(container.firstChild).toBeNull()
  })
})
