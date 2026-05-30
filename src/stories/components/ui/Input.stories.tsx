import type { Meta, StoryObj } from '@storybook/react-vite'
import { Input } from '@/Components/ui/input'

const meta: Meta<typeof Input> = {
  title: 'Components/UI/Input',
  component: Input,
  args: {
    placeholder: 'Enter text...',
  },
  decorators: [
    (Story) => (
      <div className="w-72 p-4">
        <Story />
      </div>
    ),
  ],
}

export default meta
type Story = StoryObj<typeof Input>

export const Default: Story = {}

export const WithValue: Story = {
  args: { defaultValue: 'Halo Infinite' },
}

export const Placeholder: Story = {
  args: { placeholder: 'Search for a game...' },
}

export const Email: Story = {
  args: { type: 'email', placeholder: 'jon@example.com' },
}

export const Password: Story = {
  args: { type: 'password', placeholder: '••••••••' },
}

export const Disabled: Story = {
  args: { disabled: true, defaultValue: 'Cannot edit this' },
}

export const WithError: Story = {
  args: { 'aria-invalid': true, defaultValue: 'bad@email' },
}
