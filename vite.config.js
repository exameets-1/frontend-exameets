import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    include: ['js-cookie', 'react-cookie-consent']
  },
  build: {
    commonjsOptions: {
      include: [/firebase/, /node_modules/],
    },
  }
})
