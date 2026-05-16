import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../../supabaseClient'
import type { Product } from '../../types'
import { useCart } from '../cart/CartContext'

const Home = () => {
  const { addToCart } = useCart()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [selectedGenres, setSelectedGenres] = useState<string[]>([])

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

  const genres = [...new Set(products.map(p => p.Genre).filter(Boolean))] as string[]

  const toggleGenre = (genre: string) => {
    setSelectedGenres(prev =>
      prev.includes(genre) ? prev.filter(g => g !== genre) : [...prev, genre]
    )
  }

  const filtered = selectedGenres.length === 0
    ? products
    : products.filter(p => p.Genre && selectedGenres.includes(p.Genre))

  if (loading) return <div className="flex justify-center p-10">Loading...</div>
  if (error) return <div className="flex justify-center p-10 text-red-500">Error: {error}</div>

  return (
    <div className="px-6 py-8">
      <button
        onClick={() => setSidebarOpen(true)}
        className="mb-6 ml-77 border px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-100 transition-colors cursor-pointer"
      >
        Filter
      </button>

      {sidebarOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/30 z-40"
            onClick={() => setSidebarOpen(false)}
          />
          <div className="fixed top-0 left-0 h-full w-64 bg-white shadow-xl z-50 flex flex-col">
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="font-semibold text-lg">Genre</h2>
              <button onClick={() => setSidebarOpen(false)} className="text-gray-500 hover:text-black cursor-pointer text-xl">✕</button>
            </div>
            <div className="flex flex-col gap-3 p-4 overflow-y-auto flex-1">
              {genres.length === 0 && (
                <p className="text-sm text-gray-400">No genres available.</p>
              )}
              {genres.map(genre => (
                <label key={genre} className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedGenres.includes(genre)}
                    onChange={() => toggleGenre(genre)}
                    className="w-4 h-4 accent-[#6c47ff]"
                  />
                  <span className="text-sm">{genre}</span>
                </label>
              ))}
            </div>
            {selectedGenres.length > 0 && (
              <div className="p-4 border-t">
                <button
                  onClick={() => setSelectedGenres([])}
                  className="w-full text-sm text-[#6c47ff] hover:underline cursor-pointer"
                >
                  Clear filters
                </button>
              </div>
            )}
          </div>
        </>
      )}

      <div className="flex flex-wrap gap-6 justify-center">
        {filtered.map((product) => (
          <div key={product.id} className="relative group border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col w-44 h-64">
            <Link to={`/product/${product.id}`} className="flex flex-col flex-1">
              {product.image_url && (
                <img src={product.image_url} alt={product.name} className="w-full h-36 object-contain p-2" />
              )}
              <div className="px-3 py-3 flex flex-col items-center justify-between flex-1">
                <h2 className="font-semibold text-sm text-center line-clamp-2 pb-1">{product.name}</h2>
                <p className="font-bold text-sm text-black underline">
                  {product.price_cents != null ? `${product.price_cents} ${product.currency}` : 'N/A'}
                </p>
              </div>
            </Link>
            <button
              onClick={() => addToCart(product)}
              className="absolute bottom-0 left-0 right-0 bg-[#6c47ff] text-white text-sm font-medium py-2 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
            >
              Add to Cart
            </button>
          </div>
        ))}
      </div>
      {filtered.length === 0 && (
        <p className="text-center text-gray-500 mt-10">No products found.</p>
      )}
    </div>
  )
}

export default Home
