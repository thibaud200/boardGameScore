/**
 * Test d'intégration API /player-stats
 */
import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import app from '../../backend/src/server';
import { injectPlayerStatsFixture } from '../fixtures/injectFixtures';
import db from '../../backend/src/initDatabase';

describe('API /player-stats', () => {
  beforeEach(() => {
    injectPlayerStatsFixture(db);
  });

  it('récupère les stats des joueurs', async () => {
    const res = await request(app).get('/api/player-stats');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
  });
});
