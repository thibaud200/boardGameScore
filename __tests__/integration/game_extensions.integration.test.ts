/**
 * Test d'intégration API /game-extensions
 */
import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import app from '../../backend/src/server';
import { injectGameExtensionsFixture } from '../fixtures/injectFixtures';
import db from '../../backend/src/initDatabase';

describe('API /game-extensions', () => {
  beforeEach(() => {
    injectGameExtensionsFixture(db);
  });

  it('crée une extension et la retrouve', async () => {
    const res = await request(app)
      .post('/api/game-extensions')
      .send({
        base_game_id: 2,
        extensions_name: 'TestExt',
        extensions_description: 'Extension de test.',
        add_max_players: 0,
        created_at: '2025-09-01T14:30:00Z'
      });
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('extensions_id');

    const getRes = await request(app).get('/api/game-extensions');
    expect(getRes.body).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ extensions_name: 'TestExt' })
      ])
    );
  });
});
