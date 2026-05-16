export type Product = {
  id: number
  name: string
  slug: string
  description: string
  price_cents: number
  currency: string
  stock_quantity: number
  is_active: boolean
  shop_id: string
  image_url: string | null
}
