import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
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
