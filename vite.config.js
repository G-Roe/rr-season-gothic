import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import raw from 'vite-plugin-raw'

export default defineConfig({
  plugins: [
    react(),
    raw({ match: /\.md$/ }),
  ],
})
