import { describe, it, expect } from 'vitest'
import {
  getAllGameSessions,
  getGameSessionById
} from '../../backend/src/services/gameSessionService'

describe('gameSessionService', () => {
  it('should return an array of game sessions', () => {
    const sessions = getAllGameSessions()
    expect(Array.isArray(sessions)).toBe(true)
  })

  it('should return a game session by id or undefined', () => {
    const session = getGameSessionById(1)
    expect(session === undefined || typeof session === 'object').toBe(true)
  })
})
