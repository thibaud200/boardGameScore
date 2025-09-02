/**
 * Test d  it('crée une extension et la retrouve', async () => {
    // Les données sont déjà injectées par wipeAllFixtures
    
    const extensionData = {ation API /game-extensions
 */
import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import app from '../../backend/src/server';
import { wipeAllFixtures } from '../fixtures/injectFixtures';
import db from '../../backend/src/initDatabase';

describe('API /game-extensions', () => {
  beforeEach(async () => {
    await wipeAllFixtures(db);
  });

  it('crée une extension et la retrouve', async () => {
    // Les fixtures sont déjà injectées par wipeAllFixtures, incluant les jeux
    
    const extData = {
      extensions_name: 'Forgotten Circles',
      base_game_id: 2,
      extensions_description: 'Extension campagne Gloomhaven.',
      add_max_players: 0
    };
    const res = await request(app)
      .post('/api/game-extensions')
      .send(extData);
    if (res.status !== 201) {
      console.error('Erreur:', res.body);
    }  
    expect(res.status).toBe(201);
    expect(res.body).toMatchObject(extData);

    // Les extensions sont déjà injectées par wipeAllFixtures
    const getRes = await request(app).get('/api/game-extensions');
    expect(getRes.body).toEqual(
      expect.arrayContaining([
        expect.objectContaining(extData)
      ])
    );
  });
});
