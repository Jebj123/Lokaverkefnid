import { useCart } from './CartContext'
import { Link } from 'react-router-dom'

const CartPage = () => {
  const { items, removeFromCart, totalItems } = useCart()

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
          <div key={product.id} className="flex items-center gap-4 border rounded-xl p-4 shadow-sm">
            {product.image_url && (
              <img src={product.image_url} alt={product.name} className="h-16 w-16 object-contain" />
            )}
            <div className="flex-1">
              <h2 className="font-semibold">{product.name}</h2>
              <p className="text-sm text-gray-500">Qty: {quantity}</p>
              <p className="font-bold">{product.price_cents * quantity} {product.currency}</p>
            </div>
            <button
              onClick={() => removeFromCart(product.id)}
              className="text-sm text-red-500 hover:text-red-700 cursor-pointer"
            >
              Remove
            </button>
          </div>
        ))}
      </div>
      <div className="mt-6 flex justify-between items-center border-t pt-4">
        <p className="text-lg font-bold">Total: {total} {currency}</p>
        <button className="bg-[#6c47ff] text-white rounded-full px-6 py-2 font-medium hover:opacity-90 cursor-pointer">
          Checkout
        </button>
      </div>
    </div>
  )
}

export default CartPage
