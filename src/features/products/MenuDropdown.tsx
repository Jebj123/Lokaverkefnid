import { Link } from 'react-router-dom'

interface Props {
  onClose: () => void
}

const NAV_LINKS = [
  { label: 'Games', to: '/'},
  { label: 'Retro Games', to: '/retro-product' },
]

const MenuDropdown = ({ onClose }: Props) => {
  return (
    <>
      <div
        className="fixed inset-0 bg-black/30 z-40 "
        onClick={onClose}
      />
      <div className="fixed top-0 left-0 h-full w-64 bg-white shadow-xl z-50 flex flex-col">
        <div className="flex items-center justify-between px-4 pt-2 pb-1">
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-black text-xl cursor-pointer ml-53"
          >
            ✕
          </button>
        </div>
          <div className="w-full border-b">
            <h2 className="font-semibold text-lg pl-4 pb-4">Menu</h2>
          </div>
        <nav className="flex flex-col gap-1 p-4">
          {NAV_LINKS.map(({ label, to }) => (
            <Link
              key={to}
              to={to}
              onClick={onClose}
              className="px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-50 hover:text-blue-700 transition-colors"
            >
              {label}
            </Link>
          ))}
        </nav>
      </div>
    </>
  )
}

export default MenuDropdown
