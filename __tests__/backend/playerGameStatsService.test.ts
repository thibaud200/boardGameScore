import { describe, it, expect } from 'vitest'
import {
  getAllPlayerGameStats,
  getPlayerGameStatsById
} from '../../backend/src/services/playerGameStatsService'

describe('playerGameStatsService', () => {
  it('should return an array of player game stats', () => {
    const stats = getAllPlayerGameStats()
    expect(Array.isArray(stats)).toBe(true)
  })

  it('should return player game stats by id or undefined', () => {
    const stat = getPlayerGameStatsById(1)
    expect(stat === undefined || typeof stat === 'object').toBe(true)
  })
})
