import type { Meta, StoryObj } from '@storybook/react-vite'
import AdBanner from '@/features/adBanner/AdBanner'

const meta: Meta<typeof AdBanner> = {
  title: 'Features/AdBanner',
  component: AdBanner,
}

export default meta
type Story = StoryObj<typeof AdBanner>

export const Default: Story = {}
