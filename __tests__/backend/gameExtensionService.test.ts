import { describe, it, expect } from 'vitest'
import {
  getAllGameExtensions,
  getGameExtensionById
} from '../../backend/src/services/gameExtensionService'

describe('gameExtensionService', () => {
  it('should return an array of game extensions', () => {
    const extensions = getAllGameExtensions()
    expect(Array.isArray(extensions)).toBe(true)
  })

  it('should return a game extension by id or undefined', () => {
    const ext = getGameExtensionById(1)
    expect(ext === undefined || typeof ext === 'object').toBe(true)
  })
})
