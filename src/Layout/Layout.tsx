
import { Link } from "react-router-dom"
import joystick from "../assets/joystick.png"
import { NavLink, Outlet } from "react-router-dom"

function navButtonClassName(isActive: boolean) {
  return [
    'rounded-md px-3 py-2 text-sm font-medium transition-colors',
    isActive
      ? 'bg-primary text-primary-foreground'
      : 'text-muted-foreground hover:bg-muted hover:text-foreground',
  ].join(' ');
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen w-full">
      <header>
        <div className="flex mb-6  border-white border-b-4 pb-4pt-5 rounded-lg">
          <div className="flex pl-10 p-5  border w-full">
          <Link to="/" className="flex items-center gap-2 ">
          <span className="flex pl-10 text-xl font-bold text-black underline">Gamehub</span>
          <img src={joystick} className="h-15"/>
          </Link>
          <div className="flex items-center justify-items-center pl-30">
          <NavLink to="/"
          end
          className={({isActive}) => navButtonClassName(isActive)}>
            Home
          </NavLink>
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