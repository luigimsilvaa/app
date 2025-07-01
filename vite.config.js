import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: './', // ESSENCIAL para que os caminhos relativos funcionem na Netlify
})
