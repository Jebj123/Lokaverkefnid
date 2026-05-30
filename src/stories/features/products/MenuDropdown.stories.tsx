import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, within } from 'storybook/test'
import MenuDropdown from '@/features/products/MenuDropdown'

const meta: Meta<typeof MenuDropdown> = {
  title: 'Features/Products/MenuDropdown',
  component: MenuDropdown,
  args: { onClose: () => {} },
}

export default meta
type Story = StoryObj<typeof MenuDropdown>

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    expect(canvas.getByText('Games')).toBeInTheDocument()
    expect(canvas.getByText('Retro Games')).toBeInTheDocument()
  },
}
