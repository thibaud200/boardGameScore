import { describe, it, expect } from 'vitest'
import {
  getAllGameStats,
  getGameStatsById
} from '../../backend/src/services/gameStatsService'

describe('gameStatsService', () => {
  it('should return an array of game stats', () => {
    const stats = getAllGameStats()
    expect(Array.isArray(stats)).toBe(true)
  })

  it('should return game stats by id or undefined', () => {
    const stat = getGameStatsById(1)
    expect(stat === undefined || typeof stat === 'object').toBe(true)
  })
})
