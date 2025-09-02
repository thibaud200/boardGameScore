/**
 * Test d'intégration API /current-game
 */
import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import app from '../../backend/src/server';
import { wipeAllFixtures } from '../fixtures/injectFixtures';
import db from '../../backend/src/initDatabase';

describe('API /current-game', () => {
  beforeEach(async () => {
    await wipeAllFixtures(db);
  });

  it('récupère la partie en cours injectée', async () => {
    // Injecte les données nécessaires pour le GET
    await import('../fixtures/injectFixtures').then(f => {
      f.injectCurrentGameFixture(db);
    });
    
    const res = await request(app).get('/api/current-game');
    if (res.status !== 200) {
      console.error('Erreur:', res.body);
    }
    expect(res.status).toBe(200);
    // Vérifie que la structure est correcte sans vérifier les timestamps exacts
    expect(res.body).toHaveProperty('game_data');
    expect(res.body).toHaveProperty('created_at');
    expect(res.body).toHaveProperty('updated_at');
    // Vérifie que game_data contient les bonnes données
    const gameData = JSON.parse(res.body.game_data);
    expect(gameData).toHaveProperty('game_id');
    expect(gameData).toHaveProperty('session_id');
    expect(gameData).toHaveProperty('state');
  });
});
