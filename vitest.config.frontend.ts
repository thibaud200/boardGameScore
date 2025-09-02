import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Configuration Vitest pour les tests frontend
export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    include: ['src/**/*.{test,spec}.{js,ts,jsx,tsx}'],
    coverage: {
      provider: 'v8',
      include: ['src/**/*.{ts,tsx}'],
      exclude: ['src/**/*.d.ts', 'src/test/**', 'src/**/*.test.{ts,tsx}']
    },
    // Tests frontend en parallèle OK (pas de conflit DB)
    pool: 'threads',
    testTimeout: 10000
  }
})
