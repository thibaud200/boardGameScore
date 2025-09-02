/**
 * Test d'intégration API /player-stats
 */
import { describe, it, expect, beforeEach } from 'vitest'
import request from 'supertest'
import app from '../../backend/src/server'
import { wipeAllFixtures } from '../fixtures/injectFixtures'
import db from '../../backend/src/initDatabase'

describe('API /player-stats', () => {
  beforeEach(async () => {
    // Réinitialise la base avant chaque test
    await wipeAllFixtures(db)
  })

  it('récupère les stats des joueurs injectées', async () => {
    // Les données sont déjà injectées par wipeAllFixtures

    const statData = {
      stat_id: 1,
      player_id: 1,
      total_games_played: 5,
      total_wins: 3,
      total_losses: 2,
      total_score: 50,
      average_score: 10,
      last_game_date: '2025-09-01T13:00:00Z',
      created_at: '2025-09-01T13:00:00Z'
    }
    const res = await request(app).get('/api/player-stats')
    console.log('Réponse GET /api/player-stats:', res.body)
    expect(res.status).toBe(200)
    expect(Array.isArray(res.body)).toBe(true)
    expect(res.body).toEqual(
      expect.arrayContaining([expect.objectContaining(statData)])
    )
  })
})
