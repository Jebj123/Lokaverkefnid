import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { supabase } from '../../supabaseClient'
import type { Product } from '../../types'
const ShopPage = () => {
  const { shopId } = useParams<{ shopId: string }>()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchProducts = async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('shop_id', shopId)
        .eq('is_active', true)

      if (error) {
        setError(error.message)
      } else {
        setProducts(data)
      }
      setLoading(false)
    }
    fetchProducts()
  }, [shopId])

  if (loading) return <div className="flex justify-center p-10">Loading...</div>
  if (error) return <div className="flex justify-center p-10 text-red-500">Error: {error}</div>

  return (
    <div className="px-6 py-8 border-x border-gray-500 min-h-full">
      <div className="flex flex-wrap gap-6">
        {products.map((product) => (
          <div key={product.id} className="border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col w-44 h-64">
            <Link to={`/product/${product.id}`} className="flex flex-col flex-1">
              {product.image_url ? (
                <img src={product.image_url} alt={product.name} className="w-full h-36 object-contain p-2" />
              ) : (
                <div className="w-full h-36 bg-gray-100" />
              )}
              <div className="px-3 py-3 flex flex-col items-center justify-between flex-1">
                <h2 className="font-semibold text-sm text-center line-clamp-2 pb-1">{product.name}</h2>
                <p className="font-bold text-sm text-gray-800">
                  {product.price_cents != null ? `${product.price_cents} ${product.currency}` : 'N/A'}
                </p>
              </div>
            </Link>
          </div>
        ))}
      </div>
      {products.length === 0 && (
        <p className="text-center text-gray-500 mt-10">No products found for this shop.</p>
      )}
    </div>
  )
}

export default ShopPage
