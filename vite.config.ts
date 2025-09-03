import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src')
    }
  },
  test: {
    // Configuration de l'environnement DOM pour les tests React
    environment: 'jsdom',

    // Setup pour les tests
    setupFiles: ['./src/test-setup.ts'],

    // Globals pour fetch et les assertions
    globals: true,

    // Exécuter les tests d'intégration en série pour éviter les conflits de DB
    pool: 'forks',
    poolOptions: {
      forks: {
        singleFork: true
      }
    },

    // Augmenter le timeout pour les tests d'intégration
    testTimeout: 10000
  }
})
