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
        className="fixed inset-0 bg-black/30 z-40"
        onClick={onClose}
      />
      <div className="fixed top-0 left-0 h-full w-64 bg-white shadow-xl z-50 flex flex-col">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="font-semibold text-lg">Menu</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-black text-xl cursor-pointer"
          >
            ✕
          </button>
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
