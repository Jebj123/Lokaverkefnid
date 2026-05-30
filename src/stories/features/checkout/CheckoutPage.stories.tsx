import type { Meta, StoryObj } from '@storybook/react-vite'
import { CartProvider } from '@/features/cart/CartContext'
import CheckoutPage from '@/features/checkout/checkoutPage'

const product = {
  id: 1, name: 'Doom Eternal', slug: 'Doom Eternal', description: '',
  price_cents: 5999, currency: 'ISK', stock_quantity: 10, is_active: true,
  shop_id: 'shop1', image_url: null, image_url_2: null, image_url_3: null,
  youtube_url: null, genre: ['Shooter'], platforms: ['PC'],
}

const withCart = (items: object[]) => ({
  decorators: [
    (Story: React.ComponentType) => {
      localStorage.setItem('cart', JSON.stringify(items))
      return <CartProvider><Story /></CartProvider>
    },
  ],
})

const meta: Meta<typeof CheckoutPage> = {
  title: 'Features/Checkout/CheckoutPage',
  component: CheckoutPage,
}

export default meta
type Story = StoryObj<typeof CheckoutPage>

export const Empty: Story = {
  ...withCart([]),
}

export const WithItems: Story = {
  ...withCart([
    { product, quantity: 1, platform: 'PC' },
    { product: { ...product, id: 2, name: 'Mario Bros 3', price_cents: 6999 }, quantity: 2, platform: 'GBA' },
  ]),
}
