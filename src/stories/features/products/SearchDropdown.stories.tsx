import type { Meta, StoryObj } from '@storybook/react-vite'
import { http, HttpResponse, delay } from 'msw'
import SearchDropdown from '@/features/products/SearchDropdown'

const meta: Meta<typeof SearchDropdown> = {
  title: 'Features/Products/SearchDropdown',
  component: SearchDropdown,
  args: {
    query: 's',
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
  { id: 1, name: 'The First Berserker: Khazan', price_cents: 5999, currency: 'ISK', image_url: null, platforms: ['PC', 'Ps5'], shop_id: 'a95c999d-f19e-4335-8302-696193934e87' },
  { id: 2, name: 'Halo 3', price_cents: 2999, currency: 'ISK', image_url: null, platforms: ['PC'], shop_id: 'a95c999d-f19e-4335-8302-696193934e87' },
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
