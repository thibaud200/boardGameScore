/**
 * Test d'intégration API /game-sessions
 */
import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import app from '../../backend/src/server';
import { injectGameSessionsFixture } from '../fixtures/injectFixtures';
import db from '../../backend/src/initDatabase';

describe('API /game-sessions', () => {
  beforeEach(() => {
    injectGameSessionsFixture(db);
  });

  it('crée une session de jeu et la retrouve', async () => {
    const res = await request(app)
      .post('/api/game-sessions')
      .send({
        sessions_game_id: 1,
        is_cooperative: 0,
        game_mode: 'competitive',
        sessions_players: '[1,2]',
        sessions_scores: '{"1":10,"2":8}',
        sessions_completed: 1,
        created_at: '2025-09-01T14:10:00Z'
      });
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('sessions_id');

    const getRes = await request(app).get('/api/game-sessions');
    expect(getRes.body).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ sessions_game_id: 1 })
      ])
    );
  });
});
