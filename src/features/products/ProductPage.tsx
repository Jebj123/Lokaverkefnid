import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { SelectField } from '@/Components/ui/select'
import { supabase } from '../../supabaseClient'
import type { Product } from '../../types'
import { useCart } from '../cart/CartContext'

type MediaOption = { label: string; value: string; type: 'image' | 'youtube' }

function getYouTubeEmbedUrl(url: string) {
  const match = url.match(/(?:v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/)
  return match ? `https://www.youtube.com/embed/${match[1]}` : null
}

const ProductPage = () => {
  const { productId } = useParams<{ productId: string }>()
  const navigate = useNavigate()
  const { addToCart } = useCart()
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedMedia, setSelectedMedia] = useState<MediaOption | null>(null)
  const [selectedPlatform, setSelectedPlatform] = useState('')
  const [platformError, setPlatformError] = useState(false)

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

  useEffect(() => {
    if (!product) return
    const options = buildMediaOptions(product)
    if (options.length > 0) setSelectedMedia(options[0])
    if (product.platforms?.length === 1) setSelectedPlatform(product.platforms[0])
  }, [product])

  if (loading) return <div className="flex justify-center p-10">Loading...</div>
  if (error) return <div className="flex justify-center p-10 text-red-500">Error: {error}</div>
  if (!product) return <div className="flex justify-center p-10">Product not found.</div>

  const mediaOptions = buildMediaOptions(product)

  return (
    <div className="px-6 py-10">
      <button
        onClick={() => navigate(-1)}
        className="text-sm text-gray-500 hover:text-gray-800 mb-6 flex items-center gap-1"
      >
        ← Back
      </button>
      <div className="flex gap-6">
        <div className="w-1/2 flex flex-col">
          <div className="h-130 flex items-center justify-center p-8 bg-gray-100 rounded-t-sm">
            {selectedMedia?.type === 'youtube' ? (
              <iframe
                src={getYouTubeEmbedUrl(selectedMedia.value) ?? ''}
                className="w-full h-full rounded-lg"
                allowFullScreen
              />
            ) : selectedMedia?.type === 'image' ? (
              <img src={selectedMedia.value} alt={product.name} className="w-full h-full object-contain" />
            ) : null}
          </div>
          {mediaOptions.length > 1 && (
            <div className="flex gap-2 flex-wrap px-6 py-4 justify-center bg-white border rounded-b-sm">
              {mediaOptions.map(opt => {
                const isSelected = selectedMedia?.value === opt.value
                const thumb = opt.type === 'youtube'
                  ? `https://img.youtube.com/vi/${getYouTubeEmbedUrl(opt.value)?.split('/embed/')[1]}/0.jpg`
                  : opt.value
                return (
                  <button
                    key={opt.value}
                    onClick={() => setSelectedMedia(opt)}
                    className={`w-16 h-16 rounded-lg overflow-hidden border-2 cursor-pointer transition-all ${isSelected ? 'border-[#6c47ff]' : 'border-transparent hover:border-gray-300'}`}
                  >
                    <img src={thumb} alt={opt.label} className="w-full h-full object-cover" />
                  </button>
                )
              })}
            </div>
          )}
        </div>

        <div className="flex flex-col justify-between px-8 pb-8 flex-1">
          <div>
            <div className="text-center mb-4">
              <h1 className="text-3xl font-bold underline pb-10">{product.name}</h1>
              <p className="text-lg text-black uppercase tracking-wide">{product.slug}</p>
            </div>
            <p className="text-gray-600 mt-2 border-b pb-3">{product.description}</p>
            {product.platforms && product.platforms.length > 0 && (
              <div className="mt-4 w-50">
                <p className="text-sm text-black mb-1 underline pb-2 pl-1">Select Platform:</p>
                <SelectField
                  options={product.platforms.map(p => ({ label: p, value: p }))}
                  value={selectedPlatform}
                  onChange={v => { setSelectedPlatform(v); setPlatformError(false) }}
                  placeholder='Select platform'
                  className='text-black'
                />
              </div>
            )}
            {platformError && (
              <p className="text-red-500 text-sm mt-2">Please select a platform.</p>
            )}
          </div>
          <div>
            <div className="flex items-center justify-between mt-6">
              <p className="text-2xl font-bold text-black underline pl-3">
                {product.price_cents != null ? `${product.price_cents} ${product.currency}` : 'N/A'}
              </p>
              <p className="text-sm text-gray-500">{product.stock_quantity} in stock</p>
            </div>
            <button
              onClick={() => {
                if (product.platforms && product.platforms.length > 0 && !selectedPlatform) {
                  setPlatformError(true)
                  return
                }
                setPlatformError(false)
                addToCart(product, selectedPlatform || undefined)
              }}
              className="mt-4 w-full bg-[#6c47ff] text-white rounded-sm py-3 font-medium hover:opacity-90 transition-opacity cursor-pointer"
            >
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

function buildMediaOptions(product: Product): MediaOption[] {
  const options: MediaOption[] = []
  if (product.image_url) options.push({ label: 'Image 1', value: product.image_url, type: 'image' })
  if (product.image_url_2) options.push({ label: 'Image 2', value: product.image_url_2, type: 'image' })
  if (product.image_url_3) options.push({ label: 'Image 3', value: product.image_url_3, type: 'image' })
  if (product.youtube_url) options.push({ label: 'Video', value: product.youtube_url, type: 'youtube' })
  return options
}

export default ProductPage
