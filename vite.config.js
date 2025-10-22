import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/Full-Stack-Event-Management-System/',
  build: {
    outDir: 'dist',
  },
})