import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import FilterSidebar from '@/features/products/FilterSidebar'

const meta: Meta<typeof FilterSidebar> = {
  title: 'Features/Products/FilterSidebar',
  component: FilterSidebar,
  args: {
    isOpen: true,
    onClose: () => {},
    genres: ['Action', 'RPG', 'Sports', 'Shooter', 'Adventure'],
    platforms: ['PC', 'PS5', 'Switch'],
    selectedGenres: [],
    selectedPlatforms: [],
    onToggleGenre: () => {},
    onTogglePlatform: () => {},
    onClearFilters: () => {},
  },
}

export default meta
type Story = StoryObj<typeof FilterSidebar>

export const Open: Story = {}

export const WithSelections: Story = {
  args: {
    selectedGenres: ['Action', 'RPG'],
    selectedPlatforms: ['PC'],
  },
}

export const Closed: Story = {
  args: { isOpen: false },
}

export const Empty: Story = {
  args: {
    genres: [],
    platforms: [],
  },
}

export const Interactive: Story = {
  render: (args) => {
    const [selectedGenres, setSelectedGenres] = useState<string[]>([])
    const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([])
    const toggle = (list: string[], item: string) =>
      list.includes(item) ? list.filter(i => i !== item) : [...list, item]
    return (
      <FilterSidebar
        {...args}
        selectedGenres={selectedGenres}
        selectedPlatforms={selectedPlatforms}
        onToggleGenre={g => setSelectedGenres(prev => toggle(prev, g))}
        onTogglePlatform={p => setSelectedPlatforms(prev => toggle(prev, p))}
        onClearFilters={() => { setSelectedGenres([]); setSelectedPlatforms([]) }}
      />
    )
  },
}
