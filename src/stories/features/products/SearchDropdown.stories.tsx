import type { Meta, StoryObj } from '@storybook/react-vite'
import { http, HttpResponse, delay } from 'msw'
import SearchDropdown from '@/features/products/SearchDropdown'

const meta: Meta<typeof SearchDropdown> = {
  title: 'Features/Products/SearchDropdown',
  component: SearchDropdown,
  args: {
    query: 'Halo',
    onSelect: () => {},
  },
  decorators: [
    (Story) => (
      <div className="relative w-96 p-4">
        <Story />
      </div>
    ),
  ],
}

export default meta
type Story = StoryObj<typeof SearchDropdown>

const mockProducts = [
  { id: 2, name: 'Halo Infinite', price_cents: 2999, currency: 'ISK', image_url: 'https://upload.wikimedia.org/wikipedia/en/1/14/Halo_Infinite.png', platforms: ['PC', 'Xbox X/S'], shop_id: 'a95c999d-f19e-4335-8302-696193934e87' },
]

const productsHandler = (data: typeof mockProducts) =>
  http.get(/rest\/v1\/products/, ({ request }) => {
    const shopId = new URL(request.url).searchParams.get('shop_id')?.replace('eq.', '')
    return HttpResponse.json(shopId ? data.filter(p => p.shop_id === shopId) : data)
  })

export const WithResults: Story = {
  parameters: {
    msw: { handlers: [productsHandler(mockProducts)] },
  },
}

export const NoResults: Story = {
  args: { query: 'zzznomatch' },
  parameters: {
    msw: { handlers: [productsHandler([])] },
  },
}

export const Loading: Story = {
  parameters: {
    msw: {
      handlers: [
        http.get(/rest\/v1\/products/, async () => {
          await delay('infinite')
          return HttpResponse.json([])
        }),
      ],
    },
  },
}

export const EmptyQuery: Story = {
  args: { query: '' },
}
