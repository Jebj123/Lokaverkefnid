import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { SelectField } from '@/Components/ui/select'

const meta: Meta<typeof SelectField> = {
  title: 'Components/UI/Select',
  component: SelectField,
  args: {
    options: [
      { label: 'Pc', value: 'pc' },
      { label: 'Ps5', value: 'Ps5' },
      { label: 'Nintendo Switch', value: 'Nintendo Switch' },
    ],
    value: '',
    onChange: () => {},
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
type Story = StoryObj<typeof SelectField>

export const Default: Story = {
  args: { placeholder: 'Select a platform...' },
}

export const WithLabel: Story = {
  args: { label: 'Platform', placeholder: 'Select a platform...' },
}

export const WithSelection: Story = {
  args: { label: 'Platform', value: 'ps5' },
}

export const Interactive: Story = {
  args: { label: 'Platform', placeholder: 'Select a platform...' },
  render: (args) => {
    const [value, setValue] = useState('')
    return <SelectField {...args} value={value} onChange={setValue} />
  },
}
