
import { Link } from "react-router-dom"
import joystick from "../assets/joystick.png"
import cartIcon from "../assets/Cart.png"
import { NavLink, Outlet } from "react-router-dom"
import { SignedIn, SignedOut, SignInButton, SignUpButton, UserButton } from '@clerk/clerk-react';
import { useCart } from '../features/cart/CartContext';

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
  return (
    <div className="min-h-screen w-full">
      <header>
        <div className="flex mb-6  border-white border-b-4 pb-4pt-5 rounded-lg">
          <div className="flex items-center p-5 border w-full justify-between">
          <Link to="/" className="flex items-center gap-2">
          <span className="text-xl font-bold text-black underline">Gamehub</span>
          <img src={joystick} className="h-15"/>
          </Link>
          <div className="flex items-center gap-3">
          <Link to="/cart" className="relative p-2">
            <img src={cartIcon} className="h-8 border rounded-sm" alt="Cart" />
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-1 bg-[#6c47ff] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </Link>
          <NavLink to="/"
          end
          className={({isActive}) => navButtonClassName(isActive)}>
            Home
          </NavLink>
          <SignedOut>
              <SignInButton className="bg-gray-100 text-black rounded-full font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 cursor-pointer" />
              <SignUpButton>
                <button className="bg-[#6c47ff] text-white rounded-full font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 cursor-pointer">
                  Sign Up
                </button>
              </SignUpButton>
            </SignedOut>
            <SignedIn>
              <NavLink
                to="/members"
                className={({ isActive }) => navButtonClassName(isActive)}
              >
                Members
              </NavLink>
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