/**
 * Test d'intégration API /game-characters
 */
import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import app from '../../backend/src/server';
import { injectGameCharactersFixture } from '../fixtures/injectFixtures';
import db from '../../backend/src/initDatabase';

describe('API /game-characters', () => {
  beforeEach(() => {
    injectGameCharactersFixture(db);
  });

  it('crée un personnage et le retrouve', async () => {
    const res = await request(app)
      .post('/api/game-characters')
      .send({
        game_id: 2,
        characters_name: 'TestChar',
        characters_description: 'Un personnage de test.',
        characters_abilities: '["Test"]',
        characters_image_url: '/images/testchar.png',
        characters_source: 'manual',
        class_type: 'Test',
        created_at: '2025-09-01T14:20:00Z'
      });
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('characters_id');

    const getRes = await request(app).get('/api/game-characters');
    expect(getRes.body).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ characters_name: 'TestChar' })
      ])
    );
  });
});
