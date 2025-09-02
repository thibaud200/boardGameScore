/**
 * Test d'intégration API /player-game-stats
 */
import { describe, it, expect, beforeEach } from 'vitest'
import request from 'supertest'
import app from '../../backend/src/server'
import { wipeAllFixtures } from '../fixtures/injectFixtures'
import db from '../../backend/src/initDatabase'

describe('API /player-game-stats', () => {
  beforeEach(async () => {
    await wipeAllFixtures(db)
  })

  it('récupère les stats joueur-jeu injectées', async () => {
    // Les données sont déjà injectées par wipeAllFixtures

    const statData = {
      stat_id: 1,
      player_id: 1,
      game_id: 1,
      total_games_played: 3,
      total_wins: 2,
      total_losses: 1,
      total_score: 30,
      average_score: 10,
      last_game_date: '2025-09-01T11:00:00Z',
      created_at: '2025-09-01T11:00:00Z'
    }
    const res = await request(app).get('/api/player-game-stats')
    if (res.status !== 200) {
      console.error('Erreur:', res.body)
    }
    expect(res.status).toBe(200)
    expect(Array.isArray(res.body)).toBe(true)
    expect(res.body).toEqual(
      expect.arrayContaining([expect.objectContaining(statData)])
    )
  })
})
