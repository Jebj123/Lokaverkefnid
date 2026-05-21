import { useEffect, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { supabase } from '../../supabaseClient'
import type { Product } from '../../types'
import FilterSidebar from './FilterSidebar'

const RETRO_SHOP_ID = 'a95c999d-f19e-4335-8302-696193934e86'
const MAIN_SHOP_ID = 'a95c999d-f19e-4335-8302-696193934e87'

type ResultProduct = Product & { shop_id: string }

const SearchResultsPage = () => {
  const [searchParams] = useSearchParams()
  const query = searchParams.get('q') ?? ''
  const [results, setResults] = useState<ResultProduct[]>([])
  const [loading, setLoading] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [selectedGenres, setSelectedGenres] = useState<string[]>([])
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([])
  const PAGE_SIZE = 15
  const [page, setPage] = useState(0)
  const navigate = useNavigate()

  useEffect(() => {
    if (!query.trim()) return
    setLoading(true)
    setPage(0)
    const fetchShop = (shopId: string) =>
      supabase
        .from('products')
        .select('*')
        .ilike('name', `%${query}%`)
        .eq('is_active', true)
        .eq('shop_id', shopId)
    Promise.all([fetchShop(MAIN_SHOP_ID), fetchShop(RETRO_SHOP_ID)]).then(([main, retro]) => {
      setResults([...(main.data ?? []), ...(retro.data ?? [])])
      setLoading(false)
    })
  }, [query])

  const genres = [...new Set(results.flatMap(p => p.genre ?? []))]
  const platforms = [...new Set(results.flatMap(p => p.platforms ?? []))] as string[]

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

  const filtered = results.filter(p => {
    const genreMatch = selectedGenres.length === 0 || (p.genre && p.genre.some(g => selectedGenres.includes(g)))
    const platformMatch = selectedPlatforms.length === 0 || (p.platforms && p.platforms.some(pl => selectedPlatforms.includes(pl)))
    return genreMatch && platformMatch
  })

  if (loading) return <div className="flex justify-center p-10">Searching...</div>

  return (
    <div className="px-6 py-8 border-gray-500 min-h-full w-fit mx-auto">
      <button
        onClick={() => navigate(-1)}
        className="text-sm text-gray-500 hover:text-gray-800 mb-6 flex items-center gap-1"
      >
        ← Back
      </button>
      <h1 className="text-lg font-semibold mb-6">
        Results for <span className="text-blue-700">"{query}"</span>
        <span className="text-sm font-normal underline text-gray-600 ml-5 ">({filtered.length} found)</span>
      </h1>
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
      <button
        onClick={() => setSidebarOpen(true)}
        className="mb-4 px-4 py-2 rounded-lg text-sm font-medium hover:border transition-colors cursor-pointer bg-white shadow-gray-300"
      >
        Filter
      </button>
      {filtered.length === 0 ? (
        <p className="text-center text-gray-500 mt-10">No products found.</p>
      ) : (
        <div className="grid grid-cols-5 gap-3">
          {filtered.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE).map(product => {
            const isRetro = product.shop_id === RETRO_SHOP_ID
            return (
              <div key={product.id} className="bg-white rounded-sm shadow-sm hover:shadow-md transition-shadow flex flex-col w-55 h-68 hover:border">
                <Link to={isRetro ? `/retro-product/${product.id}` : `/product/${product.id}`} className="flex flex-col flex-1">
                  {product.image_url && (
                    <img src={product.image_url} alt={product.name} className="w-full h-36 object-contain p-2" />
                  )}
                  <div className="px-3 py-3 flex flex-col items-center justify-between flex-1">
                    <div className="h-12 flex items-center">
                      <h2 className="font-semibold text-sm text-center line-clamp-2 pb-1">{product.name}</h2>
                    </div>
                    <p className="text-xs text-gray-500 mb-1">{product.platforms?.join(', ')}</p>
                    {isRetro && <span className="text-xs text-purple-500 font-medium mb-1">Retro</span>}
                    <p className="font-bold text-sm text-black underline mb-1">
                      {product.price_cents != null ? `${product.price_cents} ${product.currency}` : 'N/A'}
                    </p>
                  </div>
                </Link>
              </div>
            )
          })}
        </div>  
      )}
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
  )
}

export default SearchResultsPage
