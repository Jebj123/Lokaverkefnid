
import { Link, useNavigate } from "react-router-dom"
import joystick from "../assets/joystick.png"
import cartIcon from "../assets/Cart.png"
import { SignedIn, SignedOut, SignInButton, SignUpButton, UserButton, useAuth } from '@clerk/clerk-react';
import { useCart } from '../features/cart/CartContext';
import { useEffect, useRef } from 'react';


function MiniCart() {
  const { items, totalItems, removeFromCart} = useCart()
  const total = items.reduce((sum, i) => sum + i.product.price_cents * i.quantity, 0)
  const currency = items[0]?.product.currency ?? ''

  return (
    <div className="absolute right-0 top-full mt-1 w-72 bg-white border rounded-xl shadow-lg z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-150">
      {totalItems === 0 ? (
        <p className="text-sm text-gray-400 text-center py-6">Your cart is empty.</p>
      ) : (
        <>
          <div className="flex flex-col gap-2 p-3 max-h-64 overflow-y-auto">
            {items.map(({ product, quantity }) => (
              <div key={product.id} className="flex items-center gap-3">
                {product.image_url && (
                  <img src={product.image_url} alt={product.name} className="h-10 w-10 object-contain rounded" />
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{product.name}</p>
                  <div className="flex items-center gap-2">
                    <p className="text-xs text-gray-500">Qty: {quantity}</p>
                    <button className="text-xs text-red-400 border rounded-sm px-1 hover:bg-red-100" onClick={() => removeFromCart(product.id)}>
                      Remove
                    </button>
                  </div>
                </div>
                <p className="text-sm font-bold whitespace-nowrap text-black">{product.price_cents * quantity} {product.currency}</p>
              </div>
            ))}
          </div>
          <div className="border-t px-3 py-2 flex justify-between items-center">
            <span className="text-sm font-bold underline text-red-500">Total: {total} {currency}</span>
            <Link to="/cart" className="text-xs bg-[#6c47ff] text-white rounded-full px-3 py-1 hover:opacity-90">View Cart</Link>
          </div>
        </>
      )}
    </div>
  )
}

function navButtonClassName(isActive: boolean) {
  return [
    'rounded-md px-3 py-2 text-sm font-medium transition-colors',
    isActive
      ? 'bg-primary text-primary-foreground'
      : 'text-muted-foreground hover:bg-muted hover:text-foreground',
  ].join(' ');
}

export default function Layout({ children }: { children: React.ReactNode }) {
  const { totalItems } = useCart()
  const { isSignedIn, isLoaded } = useAuth()
  const navigate = useNavigate()
  const wasSignedOut = useRef(false)

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
    <div className="min-h-screen w-full">
      <header>
        <div className="flex mb-6  border-white border-b-4 pb-4pt-5 rounded-sm">
          <div className="flex items-center p-2 border w-full">
            <div className="flex-1" />
            <div className="border-4 pl-10 pr-10 rounded-md pt-3 pb-3 border-black bg-white">
            <Link to="/" className="flex items-center gap-2">
              <span className="text-xl font-bold text-black underline">Gamehub</span>
              <img src={joystick} className="h-15"/>
            </Link>
            </div>
            <div className="flex-1 flex items-center justify-end gap-3">
              <div className="relative group p-2">
                <Link to="/cart" className="relative block">
                  <img src={cartIcon} className="h-8 border rounded-sm" alt="Cart" />
                  {totalItems > 0 && (
                    <span className="absolute -top-1 -right-1 bg-[#6c47ff] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {totalItems}
                    </span>
                  )}
                </Link>
                <MiniCart />
              </div>
              <SignedOut>
                <SignInButton>
                  <button className="bg-gray-100 text-black rounded-full font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 cursor-pointer">Sign In</button>
                </SignInButton>
                <SignUpButton>
                  <button className="bg-[#6c47ff] text-white rounded-full font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 cursor-pointer">
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
      <main className="flex min-h-[calc(100vh-180px)] w-full pb-10">
        <div className="min-w-0 flex-1 px-8">
        {children}
        </div>
      </main>
      <footer className="flex justify-center items-center pl-20">
        <p className="text-sm text-gray-500">© 2024 GameHub. All rights reserved.</p>
      </footer>
    </div>
  )
}