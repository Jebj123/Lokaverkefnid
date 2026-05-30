import type { Preview } from '@storybook/react-vite'
import { MemoryRouter } from 'react-router-dom'
import { initialize, mswLoader } from 'msw-storybook-addon'
// @ts-ignore — .storybook/ is outside tsconfig.app.json's include, CSS types aren't resolved here
import '../src/index.css'

initialize()

const preview: Preview = {
  tags: ['test'],
  decorators: [
    (Story) => (
      <MemoryRouter>
        <Story />
      </MemoryRouter>
    ),
  ],
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    a11y: { test: 'todo' },
  },
  loaders: [mswLoader],
}

export default preview
