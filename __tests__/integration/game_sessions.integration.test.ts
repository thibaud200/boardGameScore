/**
 * Test d'intégration API /game-sessions
 */
import { describe, it, expect, beforeEach } from 'vitest'
import request from 'supertest'
import app from '../../backend/src/server'
import { wipeAllFixtures } from '../fixtures/injectFixtures'
import db from '../../backend/src/initDatabase'

describe('API /game-sessions', () => {
  beforeEach(async () => {
    await wipeAllFixtures(db)
    // Les fixtures sont déjà injectées par wipeAllFixtures
  })

  it('crée une session de jeu et la retrouve', async () => {
    // 1. CRÉER LE JEU D'ABORD (pour sessions_game_id)
    const gameRes = await request(app)
      .post('/api/games')
      .send({
        game_id_bgg: '12345',
        game_name: `Test Game_${Date.now()}`,
        min_players: 2,
        max_players: 4,
        game_description: 'Test description',
        has_characters: 0,
        characters: JSON.stringify([]),
        supports_cooperative: 1,
        supports_competitive: 1,
        supports_campaign: 0,
        default_mode: 'competitive'
      })

    if (gameRes.status !== 201) {
      console.error('Erreur création jeu:', gameRes.body)
    }
    expect(gameRes.status).toBe(201)
    const gameId = gameRes.body.game_id

    // 2. UTILISER LES JOUEURS DES FIXTURES (Alice = ID 1, Bob = ID 2)
    const player1Id = 1 // Alice
    const player2Id = 2 // Bob

    console.log(
      'Using fixtures - player1Id =',
      player1Id,
      'player2Id =',
      player2Id
    )

    // 3. CRÉER LA SESSION avec les bonnes colonnes
    const sessionData = {
      sessions_game_id: gameId, // FK vers games
      is_cooperative: 0, // 0 = false
      game_mode: 'competitive', // CORRIGÉ: utilise game_mode pas sessions_game_mode
      sessions_players: JSON.stringify([player1Id, player2Id]), // JSON STRING
      sessions_scores: JSON.stringify({
        [player1Id]: 10,
        [player2Id]: 8
      }), // JSON STRING
      sessions_characters: null, // Peut être null
      sessions_extensions: null, // Peut être null
      sessions_winner: player1Id, // ID du gagnant
      win_condition: 'score',
      sessions_date: '2025-09-01',
      sessions_duration: '60', // TEXT selon votre schéma
      sessions_completed: 1, // 1 = true
      sessions_coop_result: null // null pour parties compétitives
    }

    const res = await request(app).post('/api/game-sessions').send(sessionData)

    if (res.status !== 201) {
      console.error('Erreur création session:', res.body)
    }
    expect(res.status).toBe(201)
    expect(res.body).toMatchObject({
      sessions_game_id: gameId,
      game_mode: 'competitive',
      sessions_winner: player1Id
    })

    // 4. VÉRIFIER LA RÉCUPÉRATION
    const getRes = await request(app).get('/api/game-sessions')
    expect(getRes.status).toBe(200)
    expect(Array.isArray(getRes.body)).toBe(true)
    expect(getRes.body.length).toBeGreaterThan(0)
  })
})

// EXEMPLE POUR GAME-CHARACTERS avec dépendances
describe('API /game-characters', () => {
  beforeEach(async () => {
    await wipeAllFixtures(db)
  })

  it('crée un personnage et le retrouve', async () => {
    // 1. CRÉER LE JEU D'ABORD
    const gameRes = await request(app)
      .post('/api/games')
      .send({
        game_id_bgg: '67890',
        game_name: `Gloomhaven_${Date.now()}`,
        min_players: 1,
        max_players: 4,
        game_description: 'Dungeon crawler',
        has_characters: 1,
        characters: JSON.stringify([]),
        supports_cooperative: 1,
        supports_competitive: 0,
        supports_campaign: 1,
        default_mode: 'cooperative'
      })

    expect(gameRes.status).toBe(201)
    const gameId = gameRes.body.game_id

    // 2. CRÉER LE PERSONNAGE
    const characterData = {
      game_id: gameId, // FK vers le jeu créé
      characters_name: 'Spellweaver',
      characters_description: 'Mage, contrôle les éléments.',
      characters_abilities: JSON.stringify(['Fire', 'Ice']), // JSON STRING
      characters_image_url: '/images/spellweaver.png',
      characters_source: 'manual',
      characters_external_id: null,
      class_type: 'Mage'
    }

    const res = await request(app)
      .post('/api/game-characters')
      .send(characterData)

    if (res.status !== 201) {
      console.error('Erreur création personnage:', res.body)
    }
    expect(res.status).toBe(201)
  })
})

// EXEMPLE POUR GAME-EXTENSIONS
describe('API /game-extensions', () => {
  beforeEach(async () => {
    await wipeAllFixtures(db)
  })

  it('crée une extension et la retrouve', async () => {
    // 1. CRÉER LE JEU BASE D'ABORD
    const gameRes = await request(app)
      .post('/api/games')
      .send({
        game_id_bgg: '67891',
        game_name: `Gloomhaven_${Date.now()}`,
        min_players: 1,
        max_players: 4,
        game_description: 'Base game',
        has_characters: 1,
        characters: JSON.stringify([]),
        supports_cooperative: 1,
        supports_competitive: 0,
        supports_campaign: 1,
        default_mode: 'cooperative'
      })

    expect(gameRes.status).toBe(201)
    const gameId = gameRes.body.game_id

    // 2. CRÉER L'EXTENSION
    const extensionData = {
      extensions_name: 'Forgotten Circles',
      base_game_id: gameId, // FK vers le jeu créé
      extensions_description: 'Extension campagne Gloomhaven.',
      add_max_players: 0
    }

    const res = await request(app)
      .post('/api/game-extensions')
      .send(extensionData)

    if (res.status !== 201) {
      console.error('Erreur création extension:', res.body)
    }
    expect(res.status).toBe(201)
  })
})

// GAMES TEST - Vérifiez vos types
describe('API /games', () => {
  beforeEach(async () => {
    await wipeAllFixtures(db)
  })

  it('crée un jeu et le retrouve', async () => {
    const gameData = {
      game_id_bgg: '12346',
      game_name: `Test Game_${Date.now()}`,
      min_players: 2,
      max_players: 4,
      game_description: 'Test desc',
      has_characters: 0,
      characters: JSON.stringify([]),
      supports_cooperative: 1,
      supports_competitive: 1,
      supports_campaign: 0,
      default_mode: 'competitive'
    }

    const res = await request(app).post('/api/games').send(gameData)

    if (res.status !== 201) {
      console.error('Erreur création jeu:', res.body)
    }
    expect(res.status).toBe(201)
    expect(res.body).toMatchObject(gameData)
  })
})
