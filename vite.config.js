  import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // This allows external access
    allowedHosts: ['exameets.local'], 
    proxy: {
      '/api': {
        target: 'http://localhost:4000',
        changeOrigin: true
      }
    }
  },
  optimizeDeps: {
    include: ['js-cookie', 'react-cookie-consent']
  },
  build: {
    commonjsOptions: {
      include: [/firebase/, /node_modules/],
    },
  }
})
