/**
 * Configuration setup pour les tests frontend
 * Configure React Testing Library et jest-dom
 */
import { expect } from 'vitest'
import * as matchers from '@testing-library/jest-dom/matchers'

// Étendre expect avec jest-dom matchers
expect.extend(matchers)

// Configuration globale pour les tests
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => {}
  })
})

// Mock global pour fetch si nécessaire
global.fetch =
  global.fetch ||
  ((() =>
    Promise.resolve({
      json: () => Promise.resolve({}),
      text: () => Promise.resolve(''),
      ok: true,
      status: 200
    })) as unknown as typeof global.fetch)
