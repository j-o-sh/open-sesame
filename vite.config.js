import { defineConfig } from 'vite'
import { viteApiServer } from './src/vite-api-server'
import api from './src/api'

export default defineConfig({
  plugins: [viteApiServer(api)]
})

