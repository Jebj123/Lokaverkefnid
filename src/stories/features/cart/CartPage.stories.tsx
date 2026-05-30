import type { Meta, StoryObj } from '@storybook/react-vite'
import { CartProvider } from '@/features/cart/CartContext'
import CartPage from '@/features/cart/CartPage'

const product = {
  id: 1, name: 'Halo Infinite', slug: 'halo-infinite', description: '',
  price_cents: 5999, currency: 'ISK', stock_quantity: 10, is_active: true,
  shop_id: 'shop1', image_url: 'https://upload.wikimedia.org/wikipedia/en/1/14/Halo_Infinite.png', image_url_2: null, image_url_3: null,
  youtube_url: null, genre: ['Shooter'], platforms: ['PC', 'Xbox X/S'],
}

const withCart = (items: object[]) => ({
  decorators: [
    (Story: React.ComponentType) => {
      localStorage.setItem('cart', JSON.stringify(items))
      return <CartProvider><Story /></CartProvider>
    },
  ],
})

const meta: Meta<typeof CartPage> = {
  title: 'Features/Cart/CartPage',
  component: CartPage,
}

export default meta
type Story = StoryObj<typeof CartPage>

export const Empty: Story = {
  ...withCart([]),
}

export const WithItems: Story = {
  ...withCart([
    { product, quantity: 2, platform: 'PC' },
    { product: { ...product, id: 2, name: 'Doom Eternal', price_cents: 4999, image_url:'https://upload.wikimedia.org/wikipedia/en/thumb/9/9d/Cover_Art_of_Doom_Eternal.png/250px-Cover_Art_of_Doom_Eternal.png' }, quantity: 1, platform:['Ps5' , 'Xbox X/S'] },
  ]),
}
