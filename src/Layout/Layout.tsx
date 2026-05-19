
import { Link, useNavigate } from "react-router-dom"
import joystick from "../assets/joystick.png"
import cartIcon from "../assets/Cart.png"
import { SignedIn, SignedOut, SignInButton, SignUpButton, UserButton, useAuth } from '@clerk/clerk-react';
import { useCart } from '../features/cart/CartContext';
import { useEffect, useRef, useState } from 'react';
import { Input } from '@/Components/ui/input'
import MiniCart from '../features/cart/MiniCart'
import SearchDropdown from '../features/products/SearchDropdown'

export default function Layout({ children }: { children: React.ReactNode }) {
  const { totalItems } = useCart()
  const { isSignedIn, isLoaded } = useAuth()
  const navigate = useNavigate()
  const wasSignedOut = useRef(false)
  const [search, setSearch] = useState('')
  const searchRef = useRef<HTMLDivElement>(null)

  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && search.trim()) {
      navigate(`/?q=${encodeURIComponent(search.trim())}`)
      setSearch('')
    }
    if (e.key === 'Escape') setSearch('')
  }

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setSearch('')
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      wasSignedOut.current = true
    }
  }, [isLoaded, isSignedIn])

  useEffect(() => {
    if (isSignedIn && wasSignedOut.current) {
      wasSignedOut.current = false
      const redirect = sessionStorage.getItem('redirectAfterAuth')
      if (redirect) {
        sessionStorage.removeItem('redirectAfterAuth')
        navigate(redirect)
      }
    }
  }, [isSignedIn, navigate])

  return (
    <div className="min-h-screen w-full bg-blue-50">
      <header >
        <div className="flex mb-6 border-b rounded-sm bg-linear-to-b from-blue-50 to-blue-200 shadow-[0_0_5px_gray]">
          <div className="grid grid-cols-3 items-center p-2 w-full">
            <div className="flex items-center ml-8">
              <div className="pl-5 pr-5 rounded-md pt-1 pb-1">
                <Link to="/" className="flex items-center">
                  <span className="text-xl font-extrabold text-blue-700 ">Game</span><span className="text-xl font-extrabold underline text-red-600">hub</span>
                  <img src={joystick} className="h-10 pl-3"/>
                </Link>
              </div>
            </div>
            <div className="flex justify-center">
              <div ref={searchRef} className="relative w-96">
                <Input
                  placeholder="🔍 Search games..." 
                  className="bg-white w-full h-8 text-sm bg-white shadow-[0_0_5px_gray]"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  onKeyDown={handleSearch}
                />
                <SearchDropdown query={search} onSelect={() => setSearch('')} />
              </div>
            </div>
            <div className="flex items-center justify-end gap-3">
              <div className="relative group p-2 ">
                <Link to="/cart" className="relative block bg-white rounded-sm ">
                  <img src={cartIcon} className="h-8 border rounded-sm" alt="Cart" />
                  {totalItems > 0 && (
                    <span className="absolute -top-1 -right-1 bg-black text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {totalItems}
                    </span>
                  )}
                </Link>
                <MiniCart />
              </div>
              <SignedOut>
                <SignInButton>
                  <button className="bg-gray-100 text-black rounded-sm font-medium text-sm sm:text-base h-8 px-4 sm:px-5 cursor-pointer border ">Sign In</button>
                </SignInButton>
                <SignUpButton>
                  <button className="bg-[#6c47ff] text-white rounded-sm font-medium text-sm sm:text-base h-8 w-28 px-4 sm:px-5 cursor-pointer">
                    Sign Up
                  </button>
                </SignUpButton>
              </SignedOut>
              <SignedIn>
                <UserButton />
              </SignedIn>
            </div>
          </div>
          </div>
      </header>
      <main className="flex min-h-[calc(100vh-180px)] w-full pb-10 ">
        <div className="min-w-0 flex-1 px-8 flex flex-col">
        {children}
        </div>
      </main>
      <footer className="flex justify-center items-center pl-20">
        <p className="text-sm text-gray-500">© 2024 GameHub. All rights reserved.</p>
      </footer>
    </div>
  )
}