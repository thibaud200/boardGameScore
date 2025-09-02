/**
 * Test d'intégration API /games
 */
import { describe, it, expect, beforeEach } from 'vitest'
import request from 'supertest'
import app from '../../backend/src/server'
import { wipeAllFixtures } from '../fixtures/injectFixtures'
import db from '../../backend/src/initDatabase'

describe('API /games', () => {
  beforeEach(async () => {
    await wipeAllFixtures(db)
  })

  it('crée un jeu et le retrouve', async () => {
    const gameData = {
      game_id_bgg: '99999',
      game_name: `TestGame_${Date.now()}`,
      game_description: 'Un jeu de test.',
      game_image: '/images/testgame.png',
      has_characters: 0,
      characters: '[]',
      min_players: 2,
      max_players: 4,
      supports_cooperative: 0,
      supports_competitive: 1,
      supports_campaign: 0,
      default_mode: 'competitive'
    }
    const res = await request(app).post('/api/games').send(gameData)

    if (res.status !== 201) {
      console.error('Erreur:', res.body)
    }
    expect(res.status).toBe(201)
    expect(res.body).toMatchObject(gameData)

    const getRes = await request(app).get('/api/games')
    expect(getRes.body).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ game_name: gameData.game_name })
      ])
    )
  })
})
