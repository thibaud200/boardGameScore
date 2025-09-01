/**
 * Test d'intégration API /player-game-stats
 */
import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import app from '../../backend/src/server';
import { injectPlayerGameStatsFixture } from '../fixtures/injectFixtures';
import db from '../../backend/src/initDatabase';

describe('API /player-game-stats', () => {
  beforeEach(() => {
    injectPlayerGameStatsFixture(db);
  });

  it('récupère les stats joueur-jeu', async () => {
    const res = await request(app).get('/api/player-game-stats');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
  });
});
