import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // proxy API calls during development to avoid CORS and hardcoded
    // ports.  We support both bare `/workouts` and the optional
    // `/api` prefix so that the axios baseURL config is flexible.
    proxy: {
      '/workouts': {
        target: 'http://localhost:3001',
        changeOrigin: true,
        secure: false,
      },
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    }
  }
})
