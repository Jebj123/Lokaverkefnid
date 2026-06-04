import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { supabase } from '../../supabaseClient'
import type { Product } from '../../types'
import AdBanner from '../adBanner/AdBanner'
import FilterSidebar from './FilterSidebar'
const Home = () => {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [selectedGenres, setSelectedGenres] = useState<string[]>([])
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([])
  const [page, setPage] = useState(0)
  const [searchParams] = useSearchParams()
  const searchQuery = searchParams.get('q')?.toLowerCase() ?? ''
  const PAGE_SIZE = 15

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

  const genres = [...new Set(products.flatMap(p => p.genre ?? []))]

  const platforms = [...new Set(products.flatMap(p => p.platforms || []))] as string[]

  const toggleGenre = (genre: string) => {
    setPage(0)
    setSelectedGenres(prev =>
      prev.includes(genre) ? prev.filter(g => g !== genre) : [...prev, genre]
    )
  }

  const togglePlatform = (platform: string) => {
    setPage(0)
    setSelectedPlatforms(prev =>
      prev.includes(platform) ? prev.filter(p => p !== platform) : [...prev, platform]
    )
  }

  const filtered = products.filter(p => {
    const genreMatch = selectedGenres.length === 0 || (p.genre && p.genre.some(g => selectedGenres.includes(g)))
    const platformMatch = selectedPlatforms.length === 0 || (p.platforms && p.platforms.some(pl => selectedPlatforms.includes(pl)))
    const searchMatch = !searchQuery || p.name.toLowerCase().includes(searchQuery)
    return genreMatch && platformMatch && searchMatch
  })

  if (loading) return <div className="flex justify-center p-10">Loading...</div>
  if (error) return <div className="flex justify-center p-10 text-red-500">Error: {error}</div>

  return (
    <div className="px-2 sm:px-6 py-8 flex-1 max-w-7xl lg:mx-auto w-full">

      <FilterSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        genres={genres}
        platforms={platforms}
        selectedGenres={selectedGenres}
        selectedPlatforms={selectedPlatforms}
        onToggleGenre={toggleGenre}
        onTogglePlatform={togglePlatform}
        onClearFilters={() => { setSelectedGenres([]); setSelectedPlatforms([]) }}
      />

      <div className="w-full">
        <AdBanner />
        <button
          onClick={() => setSidebarOpen(true)}
          className="mb-4 px-4 py-2 rounded-lg text-sm font-medium hover:border transition-colors cursor-pointer bg-white shadow-gray-300"
        >
          Filter
        </button>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
        {filtered.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE).map((product) => (
          <div key={product.id} className="bg-white rounded-sm shadow-sm hover:shadow-md transition-shadow flex flex-col hover:border">
            <Link to={`/product/${product.id}`} className="flex flex-col flex-1">
              {product.image_url ? (
                <img src={product.image_url} alt={product.name} className="w-full h-36 object-contain p-2" />
              ) : (
                <div className="w-full h-36 bg-gray-100" />
              )}
              <div className="px-3 py-3 flex flex-col items-center justify-between flex-1">
                <div className="h-12 flex items-center">
                  <h2 className="font-semibold text-sm text-center line-clamp-2 pb-1">{product.name}</h2>
                </div>
                <p className="text-xs text-gray-500 mb-1">{product.platforms?.join(', ')}</p>
                <p className="font-bold text-sm text-black underline mb-1">
                  {product.price_cents != null ? `${product.price_cents} ${product.currency}` : 'N/A'}
                </p>
              </div>
            </Link>
          </div>
        ))}
      </div>
      <div className="flex items-center justify-center gap-4 mt-6">
        <button
          onClick={() => setPage(p => p - 1)}
          disabled={page === 0}
          className="px-4 py-2 text-sm border rounded-lg hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer bg-white"
        >←</button>
        <span className="text-sm text-gray-500">{page + 1} / {Math.ceil(filtered.length / PAGE_SIZE) || 1}</span>
        <button
          onClick={() => setPage(p => p + 1)}
          disabled={(page + 1) * PAGE_SIZE >= filtered.length}
          className="px-4 py-2 text-sm border rounded-lg hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer bg-white"
        >→</button>
      </div>
      </div>
      {filtered.length === 0 && (
        <p className="text-center text-gray-500 mt-10">No products found.</p>
      )}
    </div>
  )
}

export default Home
