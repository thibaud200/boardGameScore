/**
 * Test d'intégration API /game-stats
 */
import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import app from '../../backend/src/server';
import { injectGameStatsFixture } from '../fixtures/injectFixtures';
import db from '../../backend/src/initDatabase';

describe('API /game-stats', () => {
  beforeEach(() => {
    injectGameStatsFixture(db);
  });

  it('récupère les stats des parties', async () => {
    const res = await request(app).get('/api/game-stats');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
  });
});
