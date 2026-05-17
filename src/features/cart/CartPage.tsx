import { useCart } from './CartContext'
import { Link, useNavigate } from 'react-router-dom'

const CartPage = () => {
  const { items, removeFromCart, updateQuantity, totalItems } = useCart()
  const navigate = useNavigate()

  if (totalItems === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-20 gap-4">
        <p className="text-gray-500 text-lg">Your cart is empty.</p>
        <Link to="/" className="bg-[#6c47ff] text-white rounded-full px-6 py-2 text-sm font-medium hover:opacity-90">
          Browse Products
        </Link>
      </div>
    )
  }

  const total = items.reduce((sum, i) => sum + i.product.price_cents * i.quantity, 0)
  const currency = items[0]?.product.currency ?? ''

  return (
    <div className="max-w-2xl mx-auto px-6 py-10">
      <h1 className="text-2xl font-bold mb-6">Your Cart</h1>
      <div className="flex flex-col gap-4">
        {items.map(({ product, quantity }) => (
          <div key={product.id} className="flex items-center gap-2 border rounded-sm p-2 shadow-sm">
            {product.image_url && (
              <img src={product.image_url} alt={product.name} className="h-16 w-16 object-contain" />
            )}
            <div className="flex-1">
              <h2 className="font-semibold">{product.name}</h2>
              <p className="font-bold">{product.price_cents * quantity} {product.currency}</p>
            </div>
            <div className="flex flex-col items-center border rounded overflow-hidden w-6">
              <button
                onClick={() => updateQuantity(product.id, quantity + 1)}
                className="w-full hover:bg-gray-100 cursor-pointer text-[9px] leading-none py-0.5"
              >▲</button>
              <span className="text-xs font-medium border-y w-full text-center py-0.5">{quantity}</span>
              <button
                onClick={() => updateQuantity(product.id, quantity - 1)}
                className="w-full hover:bg-gray-100 cursor-pointer text-[9px] leading-none py-0.5"
              >▼</button>
            </div>
            <button
              onClick={() => removeFromCart(product.id)}
              className="text-sm text-red-500 hover:text-red-700 cursor-pointer ml-2 border pl-1 pr-1 rounded-sm hover:bg-red-100"
            >
              Remove
            </button>
          </div>
        ))}
      </div>
      <div className="mt-6 flex justify-between items-center border-t pt-4">
        <p className="text-lg font-bold text-red-500 underline">Total: {total} {currency}</p>
        <button className="bg-[#6c47ff] text-white rounded-full px-6 py-2 font-medium hover:opacity-90 cursor-pointer" onClick={() => navigate('/checkout')}>
          Checkout
        </button>
      </div>
    </div>
  )
}

export default CartPage
