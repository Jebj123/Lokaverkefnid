import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../../supabaseClient'

const RETRO_SHOP_ID = 'a95c999d-f19e-4335-8302-696193934e86'
const MAIN_SHOP_ID = 'a95c999d-f19e-4335-8302-696193934e87'

type SearchProduct = {
  id: number
  name: string
  price_cents: number
  currency: string
  image_url: string | null
  platforms: string[] | null
  shop_id: string
}

type Props = {
  query: string
  onSelect: () => void
}

export default function SearchDropdown({ query, onSelect }: Props) {
  const [results, setResults] = useState<SearchProduct[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!query.trim()) {
      setResults([])
      return
    }
    let cancelled = false
    setLoading(true)
    const fetchShop = (shopId: string) =>
      supabase
        .from('products')
        .select('id, name, price_cents, currency, image_url, platforms, shop_id')
        .ilike('name', `%${query}%`)
        .eq('is_active', true)
        .eq('shop_id', shopId)
        .limit(3)
    Promise.all([fetchShop(MAIN_SHOP_ID), fetchShop(RETRO_SHOP_ID)]).then(([main, retro]) => {
      if (!cancelled) {
        setResults([...(main.data ?? []), ...(retro.data ?? [])])
        setLoading(false)
      }
    })
    return () => { cancelled = true }
  }, [query])

  if (!query.trim()) return null

  return (
    <div data-testid="search-dropdown" className="absolute top-full left-0 right-0  bg-white border rounded-b-sm shadow-lg z-50 overflow-hidden">
      {loading ? (
        <p className="text-sm text-gray-400 text-center py-4">Searching...</p>
      ) : results.length === 0 ? (
        <p className="text-sm text-gray-400 text-center py-4">No results for "{query}"</p>
      ) : (
        <>
          <ul>
            {results.map(product => (
              <li key={product.id} className='border'>
                <Link
                  to={product.shop_id === RETRO_SHOP_ID ? `/retro-product/${product.id}` : `/product/${product.id}`}
                  onClick={onSelect}
                  className="flex items-center gap-3 px-3 py-2 hover:bg-blue-50 transition-colors"
                >
                  {product.image_url ? (
                    <img src={product.image_url} alt={product.name} className="h-12 w-12 object-contain rounded shrink-0" />
                  ) : (
                    <div className="h-12 w-12 bg-gray-100 rounded shrink-0" />
                  )}
                  <div className="flex-1 min-w-0">
                    <span className="text-base font-medium truncate text-black block">{product.name}</span>
                    {product.platforms && <span className="text-xs text-gray-500">{product.platforms.join(', ')}</span>}
                  </div>
                  <span className="text-base font-bold text-gray-700 whitespace-nowrap underline">
                    {product.price_cents} {product.currency}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
          <div className="border">
            <Link
              to={`/search?q=${encodeURIComponent(query.trim())}`}
              onClick={onSelect}
              className="flex justify-baseline ml-4 items-center py-0.5 text-sm font-medium text-blue-600 transition-colors"
            >
              <h3 className="hover:underline hover:scale-101">See more results →</h3>
              
            </Link>
          </div>
        </>
      )}
    </div>
  )
}
