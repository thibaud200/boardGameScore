import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Configuration Vitest pour les tests frontend React
export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    include: ['src/**/*.{test,spec}.{js,ts,jsx,tsx}'],
    globals: true,
    typecheck: {
      tsconfig: 'tsconfig.json'
    },
    coverage: {
      provider: 'v8',
      include: ['src/**/*.{ts,tsx}'],
      exclude: ['src/**/*.d.ts', 'src/test/**', 'src/**/*.test.{ts,tsx}']
    },
    testTimeout: 10000
  }
})
