import type { Meta, StoryObj } from '@storybook/react-vite'
import { CartProvider } from '@/features/cart/CartContext'
import MiniCart from '@/features/cart/MiniCart'

const product = {
  id: 1, name: 'Halo Infinite', slug: 'halo-infinite', description: '',
  price_cents: 5999, currency: 'ISK', stock_quantity: 10, is_active: true,
  shop_id: 'shop1', image_url: 'https://upload.wikimedia.org/wikipedia/en/1/14/Halo_Infinite.png', image_url_2: null, image_url_3: null,
  youtube_url: null, genre: ['Shooter'], platforms: ['PC', 'Xbox X/S'],
}

// MiniCart uses group-hover to toggle visibility — force it open in Storybook
const ForceVisible = ({ children }: { children: React.ReactNode }) => (
  <>
    <style>{`
      .opacity-0 { opacity: 1 !important; }
      .invisible { visibility: visible !important; }
      .absolute { position: relative !important; }
    `}</style>
    {children}
  </>
)

const meta: Meta<typeof MiniCart> = {
  title: 'Features/Cart/MiniCart',
  component: MiniCart,
  decorators: [
    (Story) => (
      <ForceVisible>
        <Story />
      </ForceVisible>
    ),
  ],
}

export default meta
type Story = StoryObj<typeof MiniCart>

export const Empty: Story = {
  decorators: [
    (Story) => {
      localStorage.setItem('cart', JSON.stringify([]))
      return <CartProvider><Story /></CartProvider>
    },
  ],
}

export const WithItems: Story = {
  decorators: [
    (Story) => {
      localStorage.setItem('cart', JSON.stringify([
        { product, quantity: 2, platform: 'PC' },
        { product: { ...product, id: 2, name: 'Doom Eternal', price_cents: 4999, image_url: 'https://upload.wikimedia.org/wikipedia/en/thumb/9/9d/Cover_Art_of_Doom_Eternal.png/250px-Cover_Art_of_Doom_Eternal.png' }, quantity: 1, platform: ['Ps5', 'Xbox X/S'] },
      ]))
      return <CartProvider><Story /></CartProvider>
    },
  ],
}
