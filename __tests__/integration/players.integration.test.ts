/**
 * Test d'intégration API /players
 * @description Vérifie la création et la récupération d'un joueur via l'API Express
 */
import { describe, it, expect, beforeEach } from 'vitest'
import request from 'supertest'
import app from '../../backend/src/server'
import { wipeAllFixtures } from '../fixtures/injectFixtures'
import db from '../../backend/src/initDatabase'

describe('API /players', () => {
  beforeEach(async () => {
    await wipeAllFixtures(db)
  })

  // ✅ TEST CORRECT : Teste la création ET la récupération du joueur créé
  it('crée un joueur et le retrouve', async () => {
    const playerData = {
      player_name: `Alice_${Date.now()}` // Nom unique pour éviter UNIQUE constraint
    }

    // 1. CRÉER le joueur
    const createRes = await request(app).post('/api/players').send(playerData)

    if (createRes.status !== 201) {
      console.error('Erreur création:', createRes.body)
    }
    expect(createRes.status).toBe(201)
    expect(createRes.body).toMatchObject(playerData)

    // Récupérer l'ID généré
    const createdPlayerId = createRes.body.player_id
    expect(createdPlayerId).toBeDefined()

    // 2. VÉRIFIER qu'on peut récupérer le joueur créé
    const getRes = await request(app).get('/api/players')
    expect(getRes.status).toBe(200)
    expect(Array.isArray(getRes.body)).toBe(true)

    // Le joueur créé doit être dans la liste
    expect(getRes.body).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          player_id: createdPlayerId,
          player_name: playerData.player_name // Utilise le nom réellement créé
        })
      ])
    )

    // Vérifier qu'il y a maintenant 4 joueurs (3 des fixtures + 1 créé)
    expect(getRes.body.length).toBe(4)
  })

  // ✅ TEST SÉPARÉ : Teste la récupération avec des fixtures pré-injectées
  it('récupère les joueurs injectés par les fixtures', async () => {
    // Pas besoin d'appeler injectPlayersFixture car déjà fait dans wipeAllFixtures
    const expectedPlayers = [
      { player_name: 'Alice' },
      { player_name: 'Bob' },
      { player_name: 'Charlie' }
    ]

    const res = await request(app).get('/api/players')
    expect(res.status).toBe(200)
    expect(Array.isArray(res.body)).toBe(true)

    // Vérifier que tous les joueurs des fixtures sont présents
    expectedPlayers.forEach((player) => {
      expect(res.body).toEqual(
        expect.arrayContaining([expect.objectContaining(player)])
      )
    })
  })

  // ✅ TEST BONUS : Teste la contrainte UNIQUE sur player_name
  it('rejette la création de joueurs avec le même nom', async () => {
    const playerData = {
      player_name: `UniqueTestPlayer_${Date.now()}`
    }

    // 1. Créer le premier joueur
    const firstRes = await request(app).post('/api/players').send(playerData)
    expect(firstRes.status).toBe(201)

    // 2. Essayer de créer un second joueur avec le même nom
    const secondRes = await request(app).post('/api/players').send(playerData)

    // Doit échouer à cause de la contrainte UNIQUE
    expect(secondRes.status).toBe(400)
    expect(secondRes.body).toHaveProperty('error')
  })

  // ✅ TEST BONUS : Teste la validation des données
  it('rejette les données invalides', async () => {
    // Test sans player_name (NOT NULL)
    const invalidData = {}

    const res = await request(app).post('/api/players').send(invalidData)

    expect(res.status).toBe(400)
    expect(res.body).toHaveProperty('error')
  })
})

// 🔥 SI VOUS VOULEZ TESTER UNIQUEMENT LES FIXTURES
describe('API /players - Fixtures', () => {
  beforeEach(async () => {
    await wipeAllFixtures(db)
    // Pas besoin d'injecter car wipeAllFixtures le fait déjà
  })

  it('récupère tous les joueurs des fixtures', async () => {
    const res = await request(app).get('/api/players')
    expect(res.status).toBe(200)
    expect(Array.isArray(res.body)).toBe(true)
    expect(res.body.length).toBeGreaterThan(0)

    // Vérifier qu'Alice des fixtures est présente
    expect(res.body).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ player_name: 'Alice' })
      ])
    )
  })
})
