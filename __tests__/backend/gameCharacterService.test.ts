import { describe, it, expect } from 'vitest'
import {
  getAllGameCharacters,
  getGameCharacterById
} from '../../backend/src/services/gameCharacterService'

describe('gameCharacterService', () => {
  it('should return an array of game characters', () => {
    const characters = getAllGameCharacters()
    expect(Array.isArray(characters)).toBe(true)
  })

  it('should return a game character by id or undefined', () => {
    const character = getGameCharacterById(1)
    expect(character === undefined || typeof character === 'object').toBe(true)
  })
})
