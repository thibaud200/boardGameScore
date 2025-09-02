// Test simple du mock node-fetch
import { vi } from 'vitest'

vi.mock('node-fetch', () => ({
  default: vi.fn(() =>
    Promise.resolve({
      ok: true,
      text: () => Promise.resolve('<test>mock works</test>')
    })
  )
}))

import fetch from 'node-fetch'

console.log('Mock fetch:', typeof fetch)
console.log('Is mocked:', vi.isMockFunction(fetch))

const response = await fetch('test')
console.log('Response ok:', response.ok)
console.log('Response text:', await response.text())
