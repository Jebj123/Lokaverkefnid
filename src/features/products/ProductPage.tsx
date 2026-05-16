import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { supabase } from '../../supabaseClient'
import type { Product } from '../../types'
import { useCart } from '../cart/CartContext'

const ProductPage = () => {
  const { productId } = useParams<{ productId: string }>()
  const navigate = useNavigate()
  const { addToCart } = useCart()
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchProduct = async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', productId)
        .single()

      if (error) {
        setError(error.message)
      } else {
        setProduct(data)
      }
      setLoading(false)
    }
    fetchProduct()
  }, [productId])

  if (loading) return <div className="flex justify-center p-10">Loading...</div>
  if (error) return <div className="flex justify-center p-10 text-red-500">Error: {error}</div>
  if (!product) return <div className="flex justify-center p-10">Product not found.</div>

  return (
    <div className="max-w-2xl mx-auto px-6 py-10">
      <button
        onClick={() => navigate(-1)}
        className="text-sm text-gray-500 hover:text-gray-800 mb-6 flex items-center gap-1"
      >
        ← Back
      </button>
      <div className="border rounded-xl overflow-hidden shadow-sm">
        {product.image_url && (
          <img src={product.image_url} alt={product.name} className="w-full h-64 object-contain p-4" />
        )}
        <div className="p-6">
          <p className="text-xs text-gray-400 uppercase tracking-wide">{product.slug}</p>
          <h1 className="text-3xl font-bold mt-1">{product.name}</h1>
          <p className="text-gray-600 mt-4">{product.description}</p>
          <div className="flex items-center justify-between mt-6">
            <p className="text-2xl font-bold">
              {product.price_cents != null ? `${product.price_cents} ${product.currency}` : 'N/A'}
            </p>
            <p className="text-sm text-gray-500">{product.stock_quantity} in stock</p>
          </div>
          <button
            onClick={() => addToCart(product)}
            className="mt-6 w-full bg-[#6c47ff] text-white rounded-full py-3 font-medium hover:opacity-90 transition-opacity cursor-pointer"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  )
}

export default ProductPage
