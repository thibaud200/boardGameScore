/**
 * Test d'intégration API /games
 */
import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import app from '../../backend/src/server';
import { injectGamesFixture } from '../fixtures/injectFixtures';
import db from '../../backend/src/initDatabase';

describe('API /games', () => {
  beforeEach(() => {
    injectGamesFixture(db);
  });

  it('crée un jeu et le retrouve', async () => {
    const res = await request(app)
      .post('/api/games')
      .send({
        game_id_bgg: '99999',
        game_name: 'TestGame',
        game_description: 'Un jeu de test.',
        game_image: '/images/testgame.png',
        has_characters: false,
        characters: null,
        min_players: 2,
        max_players: 4,
        supports_cooperative: false,
        supports_competitive: true,
        supports_campaign: false,
        default_mode: 'competitive',
        created_at: '2025-09-01T14:00:00Z'
      });
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('game_id');

    const getRes = await request(app).get('/api/games');
    expect(getRes.body).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ game_name: 'TestGame' })
      ])
    );
  });
});
