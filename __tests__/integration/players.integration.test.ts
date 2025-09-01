/**
 * Test d'intégration API /players
 * @description Vérifie la création et la récupération d'un joueur via l'API Express
 */
import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import app from '../../backend/src/server';
import { injectPlayersFixture } from '../fixtures/injectFixtures';
import db from '../../backend/src/initDatabase';

describe('API /players', () => {
  beforeEach(() => {
    injectPlayersFixture(db);
  });

  it('crée un joueur et le retrouve', async () => {
    const res = await request(app)
      .post('/api/players')
      .send({ player_name: 'Alice' });
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('player_id');

    const getRes = await request(app).get('/api/players');
    expect(getRes.body).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ player_name: 'Alice' })
      ])
    );
  });
});
