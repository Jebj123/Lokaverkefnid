import type { Meta, StoryObj } from '@storybook/react-vite'
import OrderCompletePage from '@/features/order/OrderCompletePage'

const product = {
  id: 1, name: 'Halo Infinite', slug: 'Halo Infinite', description: '',
  price_cents: 5999, currency: 'ISK', stock_quantity: 10, is_active: true,
  shop_id: 'shop1', image_url: 'https://upload.wikimedia.org/wikipedia/en/1/14/Halo_Infinite.png', image_url_2: null, image_url_3: null,
  youtube_url: null, genre: ['Shooter'], platforms: ['PC'],
}

const withSnapshot = (items: object[]) => ({
  decorators: [
    (Story: React.ComponentType) => {
      sessionStorage.setItem('orderSnapshot', JSON.stringify(items))
      return <Story />
    },
  ],
})

const meta: Meta<typeof OrderCompletePage> = {
  title: 'Features/Order/OrderCompletePage',
  component: OrderCompletePage,
}

export default meta
type Story = StoryObj<typeof OrderCompletePage>

export const WithOrder: Story = {
  ...withSnapshot([
    { product, quantity: 2, platform: 'PC' },
    { product: { ...product, id: 2, name: 'Zelda BOTW', price_cents: 6999, image_url:'https://upload.wikimedia.org/wikipedia/en/c/c6/The_Legend_of_Zelda_Breath_of_the_Wild.jpg' }, quantity: 1, platform: 'Switch' },
  ]),
}

export const NoOrder: Story = {}
