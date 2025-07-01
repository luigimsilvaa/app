import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: './', // <- ISSO É FUNDAMENTAL PARA FUNCIONAR NA NETLIFY
})
