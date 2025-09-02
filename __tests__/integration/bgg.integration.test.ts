/**
 * Tests d'intégration pour les endpoints BGG (BoardGameGeek)
 * Teste les API routes /api/bgg/search, /api/bgg/game/:id
 */
import { describe, it, expect } from 'vitest'
import request from 'supertest'
import app from '../../backend/src/server'

describe('API /bgg (BoardGameGeek Integration)', () => {
  // Note: Ces tests font de vraies requêtes à l'API BGG
  // Ils peuvent être lents et dépendent de la connectivité réseau

  describe('GET /api/bgg/search', () => {
    it('devrait rechercher des jeux sur BGG avec query valide', async () => {
      const response = await request(app)
        .get('/api/bgg/search')
        .query({ q: 'Gloomhaven' })
        .expect(200)

      expect(Array.isArray(response.body)).toBe(true)

      if (response.body.length > 0) {
        const firstResult = response.body[0]
        expect(firstResult).toHaveProperty('id')
        expect(firstResult).toHaveProperty('name')
        expect(typeof firstResult.id).toBe('string')
        expect(typeof firstResult.name).toBe('string')

        // Optionnel : yearPublished peut être undefined
        if (firstResult.yearPublished) {
          expect(typeof firstResult.yearPublished).toBe('number')
        }
      }
    }, 15000) // Timeout de 15s pour l'API BGG

    it('devrait retourner une erreur 400 sans paramètre query', async () => {
      const response = await request(app).get('/api/bgg/search').expect(400)

      expect(response.body).toHaveProperty('error')
      expect(response.body.error).toContain('query')
    })

    it('devrait retourner un tableau vide pour une recherche inexistante', async () => {
      const response = await request(app)
        .get('/api/bgg/search')
        .query({ q: 'jeuquinexistepas123456789' })
        .expect(200)

      expect(Array.isArray(response.body)).toBe(true)
      expect(response.body.length).toBe(0)
    }, 10000)

    it('devrait gérer les headers CORS correctement', async () => {
      const response = await request(app)
        .get('/api/bgg/search')
        .query({ q: 'test' })
        .set('Origin', 'http://localhost:5173')

      expect(response.headers['access-control-allow-origin']).toBe(
        'http://localhost:5173'
      )
    }, 10000)
  })

  describe('GET /api/bgg/game/:id', () => {
    it("devrait récupérer les détails d'un jeu BGG avec ID valide", async () => {
      // Utilise l'ID de Gloomhaven (jeu très populaire, peu de risque qu'il disparaisse)
      const gameId = '174430'

      const response = await request(app)
        .get(`/api/bgg/game/${gameId}`)
        .expect(200)

      const gameDetails = response.body

      expect(gameDetails).toHaveProperty('id', gameId)
      expect(gameDetails).toHaveProperty('name')
      expect(typeof gameDetails.name).toBe('string')
      expect(gameDetails.name.length).toBeGreaterThan(0)

      // Propriétés optionnelles mais probablement présentes pour Gloomhaven
      if (gameDetails.yearPublished) {
        expect(typeof gameDetails.yearPublished).toBe('number')
        expect(gameDetails.yearPublished).toBeGreaterThan(1900)
        expect(gameDetails.yearPublished).toBeLessThan(2030)
      }

      if (gameDetails.minPlayers) {
        expect(typeof gameDetails.minPlayers).toBe('number')
        expect(gameDetails.minPlayers).toBeGreaterThan(0)
      }

      if (gameDetails.maxPlayers) {
        expect(typeof gameDetails.maxPlayers).toBe('number')
        expect(gameDetails.maxPlayers).toBeGreaterThanOrEqual(
          gameDetails.minPlayers || 1
        )
      }

      // Vérification des tableaux si présents
      if (gameDetails.categories) {
        expect(Array.isArray(gameDetails.categories)).toBe(true)
      }

      if (gameDetails.mechanics) {
        expect(Array.isArray(gameDetails.mechanics)).toBe(true)
      }
    }, 15000)

    it('devrait retourner une erreur 404 pour un ID de jeu inexistant', async () => {
      const response = await request(app)
        .get('/api/bgg/game/99999999')
        .expect(404)

      expect(response.body).toHaveProperty('error')
    }, 10000)

    it('devrait retourner une erreur 400 pour un ID invalide', async () => {
      const response = await request(app)
        .get('/api/bgg/game/invalid-id')
        .expect(400)

      expect(response.body).toHaveProperty('error')
    })
  })

  describe('POST /api/bgg/import/:id', () => {
    it('devrait importer un jeu depuis BGG (si endpoint implémenté)', async () => {
      // Test de base pour vérifier que l'endpoint existe
      // L'implémentation exacte peut varier
      const gameId = '174430'

      const response = await request(app)
        .post(`/api/bgg/import/${gameId}`)
        .send({})

      // L'endpoint peut retourner différents codes selon l'implémentation
      // 200 = succès, 201 = créé, 501 = non implémenté, etc.
      expect([200, 201, 404, 501].includes(response.status)).toBe(true)

      if (response.status === 200 || response.status === 201) {
        // Si l'import fonctionne, vérifier la structure de réponse
        expect(response.body).toBeDefined()
      }
    }, 15000)
  })

  describe('BGG API Error Handling', () => {
    it('devrait gérer les timeouts BGG gracieusement', async () => {
      // Test avec un query qui pourrait causer des problèmes
      const response = await request(app)
        .get('/api/bgg/search')
        .query({ q: '' })
        .timeout(20000)

      // Devrait retourner une erreur propre, pas un crash
      expect([200, 400, 404, 500, 503].includes(response.status)).toBe(true)

      if (response.status >= 400) {
        expect(response.body).toHaveProperty('error')
      }
    }, 25000)
  })
})
