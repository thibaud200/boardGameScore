import { describe, it, expect } from 'vitest'
import { getCurrentGame } from '../../backend/src/services/currentGameService'

describe('currentGameService', () => {
  it('should return the current game or undefined', () => {
    const current = getCurrentGame()
    expect(current === undefined || typeof current === 'object').toBe(true)
  })
})
