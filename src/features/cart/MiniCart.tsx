import { Link } from 'react-router-dom'
import { useCart } from './CartContext'
import { useNavigate } from 'react-router-dom'

export default function MiniCart() {
  const { items, totalItems, removeFromCart } = useCart()
  const navigate = useNavigate()
  const total = items.reduce((sum, i) => sum + i.product.price_cents * i.quantity, 0)
  const currency = items[0]?.product.currency ?? ''

  return (
    <div className="absolute right-0 top-full mt-1 w-72 bg-white border rounded-xl shadow-lg z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-150">
      {totalItems === 0 ? (
        <p className="text-sm text-gray-400 text-center py-6">Your cart is empty.</p>
      ) : (
        <>
          <div className="flex flex-col gap-2 p-3 max-h-64 overflow-y-auto ">
            {items.map(({ product, quantity, platform }) => (
              <div key={`${product.id}-${platform}`} className="flex items-start gap-3 border-b pb-3 last:border-0">
                {product.image_url && (
                  <img src={product.image_url} alt={product.name} className="h-10 w-10 object-contain rounded shrink-0" />
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate text-black">{product.name}</p>
                  <p className="text-xs text-gray-500">Qty: {quantity}{platform ? ` · ${platform}` : ''}</p>
                  <p className="text-sm font-bold text-black underline">{product.price_cents * quantity} {product.currency}</p>
                </div>
                <button className="text-xs text-red-400 border rounded-sm px-1 hover:bg-red-100 shrink-0 mt-4" onClick={() => removeFromCart(product.id, platform)}>
                  Remove
                </button>
              </div>
            ))}
          </div>
          <div className="border-t px-3 py-2 flex justify-between items-center">
            <p className="text-sm font-bold underline text-black">Total:</p>
            <span className="text-sm font-bold underline text-red-500">{total} {currency}</span>
          </div>
          <div className="border-t px-3 py-2 flex justify-center gap-4">
            <Link to="/cart" className="text-xs bg-[#6c47ff] text-white rounded-sm px-3 py-1 hover:opacity-90">View Cart</Link>
            <p className="text-sm text-black font-bold pt-1 ">or</p>
            <button
              onClick={() => navigate('/checkout')}
              className="text-xs bg-[#481df8] text-white rounded-sm px-3 py-1 hover:opacity-90"
            >
              Go to Checkout
            </button>
          </div>
        </>
      )}
    </div>
  )
}
