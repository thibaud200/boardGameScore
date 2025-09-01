import { describe, it, expect } from 'vitest'
import {
  getAllGames,
  getGameById
} from '../../backend/src/services/gameService'

describe('gameService', () => {
  it('should return an array of games', () => {
    const games = getAllGames()
    expect(Array.isArray(games)).toBe(true)
  })

  it('should return a game by id or undefined', () => {
    const game = getGameById(1)
    expect(game === undefined || typeof game === 'object').toBe(true)
  })
})
