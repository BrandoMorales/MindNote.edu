import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Configuración para GitHub Pages
export default defineConfig({
  plugins: [react()],
  base: '/MindNote.edu/', // 👈 debe coincidir EXACTAMENTE con el nombre del repo
})
