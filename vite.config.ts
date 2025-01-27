import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(),
  VitePWA({
    registerType: 'autoUpdate', // Automatically update the Service Worker
    injectRegister: 'auto',     // Automatically inject the Service Worker in the HTML
    workbox: {
      // You can configure workbox options here if necessary
      globPatterns: ['**/*.{html,js,css,png,jpg}'],
      maximumFileSizeToCacheInBytes: 30 * 1024 * 1024,
      runtimeCaching: [
        {
          urlPattern: ({ url }) => url.origin === 'https://api.example.com', // replace with your API URL
          handler: 'StaleWhileRevalidate',
          options: {
            cacheName: 'api-cache',
          },
        },
      ],
    },
  }),
  ],
})
