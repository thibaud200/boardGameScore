import { describe, it, expect } from 'vitest'
import {
  getAllPlayerStats,
  getPlayerStatsById
} from '../../backend/src/services/playerStatsService'

describe('playerStatsService', () => {
  it('should return an array of player stats', () => {
    const stats = getAllPlayerStats()
    expect(Array.isArray(stats)).toBe(true)
  })

  it('should return player stats by id or undefined', () => {
    const stat = getPlayerStatsById(1)
    expect(stat === undefined || typeof stat === 'object').toBe(true)
  })
})
