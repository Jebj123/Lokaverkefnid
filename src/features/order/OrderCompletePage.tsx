import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import type { Product } from '../../types'

type OrderItem = { product: Product; quantity: number; platform?: string }

const OrderCompletePage = () => {
  const navigate = useNavigate()
  const [items, setItems] = useState<OrderItem[]>([])

  useEffect(() => {
    const snapshot = sessionStorage.getItem('orderSnapshot')
    if (snapshot) {
      setItems(JSON.parse(snapshot))
      sessionStorage.removeItem('orderSnapshot')
    }
  }, [])

  const total = items.reduce((sum, i) => sum + i.product.price_cents * i.quantity, 0)
  const currency = items[0]?.product.currency ?? ''

  return (
    <div className="max-w-xl mx-auto px-6 py-10 flex flex-col items-center gap-6">
      <div className="flex flex-col gap-3 w-full">
        {items.map(({ product, quantity, platform }) => (
          <div key={`${product.id}-${platform}`} className="flex items-center gap-4 border rounded-xl p-4 shadow-sm">
            {product.image_url && (
              <img src={product.image_url} alt={product.name} className="h-14 w-14 object-contain" />
            )}
            <div className="flex-1">
              <p className="font-semibold">{product.name}</p>
              {platform && <p className="text-xs text-gray-500">{platform}</p>}
              <p className="text-sm text-gray-500">Qty: {quantity}</p>
            </div>
            <p className="font-bold text-black">{product.price_cents * quantity} {product.currency}</p>
          </div>
        ))}
        {items.length > 0 && (
          <div className="flex justify-between items-center border-t pt-3 mt-1">
            <p className="font-bold">Total :</p>
            <p className="font-bold text-red-500 underline">{total} {currency}</p>
          </div>
        )}
      </div>

      <h1 className="text-3xl font-bold">Order Complete</h1>
      <p className="text-gray-500 text-lg">Thank you for your order!</p>
      <button
        onClick={() => navigate('/')}
        className="bg-[#6c47ff] text-white rounded-full px-6 py-2 text-sm font-medium hover:opacity-90 cursor-pointer"
      >
        Continue Shopping
      </button>
    </div>
  )
}

export default OrderCompletePage
