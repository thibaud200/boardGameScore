import { describe, it, expect } from 'vitest'
import {
  getAllPlayers,
  getPlayerById
} from '../../backend/src/services/playerService'

describe('playerService', () => {
  it('should return an array of players', () => {
    const players = getAllPlayers()
    expect(Array.isArray(players)).toBe(true)
  })

  it('should return a player by id or undefined', () => {
    const player = getPlayerById(1)
    expect(player === undefined || typeof player === 'object').toBe(true)
  })
})
