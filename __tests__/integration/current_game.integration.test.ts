/**
 * Test d'intégration API /current-game
 */
import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import app from '../../backend/src/server';
import { injectCurrentGameFixture } from '../fixtures/injectFixtures';
import db from '../../backend/src/initDatabase';

describe('API /current-game', () => {
  beforeEach(() => {
    injectCurrentGameFixture(db);
  });

  it('crée et récupère la partie en cours', async () => {
    const res = await request(app)
      .post('/api/current-game')
      .send({ game_data: '{"state":"test"}' });
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('id');

    const getRes = await request(app).get('/api/current-game');
    expect(getRes.body).toHaveProperty('game_data');
  });
});
