import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../../supabaseClient'
import type { Product } from '../../types'

const Home = () => {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchProducts = async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('shop_id', 'a95c999d-f19e-4335-8302-696193934e87')
        .eq('is_active', true)
      if (error) {
        setError(error.message)
      } else {
        setProducts(data)
      }
      setLoading(false)
    }
    fetchProducts()
  }, [])

  if (loading) return <div className="flex justify-center p-10">Loading...</div>
  if (error) return <div className="flex justify-center p-10 text-red-500">Error: {error}</div>

  return (
    <div className="px-6 py-8">
      <div className="flex flex-wrap gap-6">
        {products.map((product) => (
          <Link key={product.id} to={`/product/${product.id}`} className="border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow w-44">
            {product.image_url && (
              <img src={product.image_url} alt={product.name} className="w-full h-40 object-contain p-2" />
            )}
            <div className="p-4">
              <h2 className="font-semibold text-lg">{product.name}</h2>
              <p className="font-bold mt-1">
                {product.price_cents != null ? `${product.price_cents} ${product.currency}` : 'N/A'}
              </p>
            </div>
          </Link>
        ))}
      </div>
      {products.length === 0 && (
        <p className="text-center text-gray-500 mt-10">No products found.</p>
      )}
    </div>
  )
}

export default Home
