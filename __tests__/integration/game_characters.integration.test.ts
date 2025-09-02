/**
 * Test d'intégration API /game-characters
 */
import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import app from '../../backend/src/server';
import { wipeAllFixtures } from '../fixtures/injectFixtures';
import db from '../../backend/src/initDatabase';

describe('API /game-characters', () => {
  beforeEach(async () => {
    await wipeAllFixtures(db);
  });

  it('crée un personnage et le retrouve', async () => {
    // Les données sont déjà injectées par wipeAllFixtures
    
    const characterData = {
      game_id: 2,
      characters_name: 'Spellweaver',
      characters_description: 'Mage, contrôle les éléments.',
      characters_abilities: '["Fire","Ice"]',
      characters_image_url: '/images/spellweaver.png',
      characters_source: 'manual',
      class_type: 'Mage'
    };
    const res = await request(app)
      .post('/api/game-characters')
      .send(characterData);
    if (res.status !== 201) {
      console.error('Erreur:', res.body);
    }  
    expect(res.status).toBe(201);
    expect(res.body).toMatchObject(characterData);

    // Injecte les personnages pour le GET
    await import('../fixtures/injectFixtures').then(f => {
      f.injectGameCharactersFixture(db);
    });
    const getRes = await request(app).get('/api/game-characters');
    expect(getRes.body).toEqual(
      expect.arrayContaining([
        expect.objectContaining(characterData)
      ])
    );
  });
});
