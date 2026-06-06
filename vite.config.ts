import path from 'node:path'
import { defineConfig, loadEnv } from 'vite'
import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [
      react(),
      babel({ presets: [reactCompilerPreset()] }),
      tailwindcss(),
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    server: {
      proxy: {
        '/api/v1/search': {
          target: 'https://geocoding-api.open-meteo.com',
          changeOrigin: true,
          rewrite: (requestPath) => {
            const q = new URL(requestPath, 'http://localhost').searchParams.get('q') ?? ''
            return `/v1/search?name=${encodeURIComponent(q)}&count=8&language=en`
          },
        },
        '/api': {
          target: 'https://api.weather-ai.co',
          changeOrigin: true,
          rewrite: (requestPath) => requestPath.replace(/^\/api/, ''),
          configure: (proxy) => {
            proxy.on('proxyReq', (proxyReq) => {
              if (env.API_KEY) {
                proxyReq.setHeader('Authorization', `Bearer ${env.API_KEY}`)
              }
            })
          },
        },
      },
    },
  }
})
