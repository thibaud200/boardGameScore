/**
 * Test d'intégration API /game-stats
 */
import { describe, it, expect, beforeEach } from 'vitest'
import request from 'supertest'
import app from '../../backend/src/server'
import { wipeAllFixtures } from '../fixtures/injectFixtures'
import db from '../../backend/src/initDatabase'

describe('API /game-stats', () => {
  beforeEach(async () => {
    await wipeAllFixtures(db)
  })

  it('récupère les stats des parties injectées', async () => {
    // Les données sont déjà injectées par wipeAllFixtures

    const statData = {
      stat_id: 1,
      session_ids: [1],
      game_id: 1,
      duration: 60,
      total_players: 2,
      total_score: 18,
      created_at: '2025-09-01T11:00:00Z'
    }
    const res = await request(app).get('/api/game-stats')
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
