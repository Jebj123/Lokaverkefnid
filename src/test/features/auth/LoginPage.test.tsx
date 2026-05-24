import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { MemoryRouter } from 'react-router-dom'
import LoginPage from '@/features/auth/LoginPage'

vi.mock('@clerk/clerk-react', () => ({
  useAuth: () => ({ isSignedIn: false, isLoaded: true }),
  SignIn: () => <div>Sign In Form</div>,
}))

describe('LoginPage', () => {
  it('renders sign in form when not signed in', () => {
    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>
    )
    expect(screen.getByText('Sign In Form')).toBeInTheDocument()
  })
})
