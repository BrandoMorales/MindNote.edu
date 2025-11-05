import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/MindNote.edu/', // 👈 nombre exacto del repo
  build: {
    outDir: 'dist'
  }
})
