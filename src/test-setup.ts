import '@testing-library/jest-dom'
import { vi, beforeEach } from 'vitest'
import createFetchMock from 'vitest-fetch-mock'

// Configuration vitest-fetch-mock
const fetchMocker = createFetchMock(vi)
fetchMocker.enableMocks()

// Mock global window.confirm pour les tests
Object.defineProperty(window, 'confirm', {
  writable: true,
  value: vi.fn()
})

// Mock global window.alert pour les tests
Object.defineProperty(window, 'alert', {
  writable: true,
  value: vi.fn()
})

// Mock du localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
  length: 0,
  key: vi.fn()
}

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
})

// Mock fetch pour les tests qui en ont besoin
// Note: vitest-fetch-mock gère maintenant le mock fetch automatiquement

// Configuration globale pour tous les tests
beforeEach(() => {
  // Reset des mocks avant chaque test
  vi.clearAllMocks()

  // Reset fetch mock - fetchMocker gère cela
  fetchMocker.resetMocks()

  // Reset localStorage mock
  localStorageMock.getItem.mockClear()
  localStorageMock.setItem.mockClear()
  localStorageMock.removeItem.mockClear()
  localStorageMock.clear.mockClear()
})
