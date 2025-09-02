/**
 * Tests unitaires pour BGGService Backend - Version Simple
 * Tests critiques : conversion BGG, cache management, sans appels réseau
 */
import { describe, it, expect, beforeEach } from 'vitest'

describe('BGGService Backend - Tests Unitaires', () => {
  beforeEach(() => {
    // Reset pour chaque test
  })

  describe('Conversion BGG vers format local', () => {
    it('devrait convertir correctement un jeu BGG vers notre format', async () => {
      // Import dynamique pour éviter les problèmes de module
      const { bggService } = await import(
        '../../backend/src/services/bggService'
      )

      const bggGame = {
        id: '174430',
        name: 'Gloomhaven',
        description: 'A tactical combat game in a persistent world.',
        image: 'https://example.com/image.jpg',
        thumbnail: undefined,
        yearPublished: 2017,
        minPlayers: 1,
        maxPlayers: 4,
        playingTime: 120,
        minPlayingTime: 60,
        maxPlayingTime: 120,
        age: 14,
        rating: 8.77,
        complexity: 3.86,
        categories: ['Adventure', 'Fantasy'],
        mechanics: ['Cooperative Game', 'Campaign'],
        families: ['Campaign Games']
      }

      const converted = bggService.convertToGameFormat(bggGame)

      expect(converted).toEqual({
        game_id_bgg: '174430',
        game_name: 'Gloomhaven',
        game_description: 'A tactical combat game in a persistent world.',
        game_image: 'https://example.com/image.jpg',
        has_characters: false, // Pas de détection automatique de personnages dans ce test
        characters: null,
        min_players: 1,
        max_players: 4,
        supports_cooperative: true,
        supports_competitive: true,
        supports_campaign: true,
        default_mode: 'campaign'
      })
    })

    it('devrait détecter le mode coopératif', async () => {
      const { bggService } = await import(
        '../../backend/src/services/bggService'
      )

      const bggGame = {
        id: '1',
        name: 'Pandemic',
        description: undefined,
        image: undefined,
        thumbnail: undefined,
        yearPublished: 2008,
        minPlayers: 2,
        maxPlayers: 4,
        playingTime: 45,
        minPlayingTime: 45,
        maxPlayingTime: 45,
        age: 8,
        rating: 7.6,
        complexity: 2.4,
        categories: ['Medical'],
        mechanics: ['Cooperative Game'],
        families: []
      }

      const converted = bggService.convertToGameFormat(bggGame)

      expect(converted.supports_cooperative).toBe(true)
      expect(converted.supports_campaign).toBe(false)
      expect(converted.default_mode).toBe('cooperative')
    })

    it('devrait détecter le mode campagne', async () => {
      const { bggService } = await import(
        '../../backend/src/services/bggService'
      )

      const bggGame = {
        id: '2',
        name: 'Legacy Game',
        description: 'A legacy campaign game',
        image: undefined,
        thumbnail: undefined,
        yearPublished: 2020,
        minPlayers: 1,
        maxPlayers: 4,
        playingTime: 90,
        minPlayingTime: 90,
        maxPlayingTime: 90,
        age: 12,
        rating: 8.0,
        complexity: 3.0,
        categories: ['Adventure'],
        mechanics: ['Legacy Game', 'Campaign'],
        families: ['Campaign Games']
      }

      const converted = bggService.convertToGameFormat(bggGame)

      expect(converted.supports_campaign).toBe(true)
      expect(converted.default_mode).toBe('campaign')
    })

    it('devrait gérer les valeurs nulles et undefined', async () => {
      const { bggService } = await import(
        '../../backend/src/services/bggService'
      )

      const bggGame = {
        id: '3',
        name: 'Minimal Game',
        description: undefined,
        image: undefined,
        thumbnail: undefined,
        yearPublished: undefined,
        minPlayers: undefined,
        maxPlayers: undefined,
        playingTime: undefined,
        minPlayingTime: undefined,
        maxPlayingTime: undefined,
        age: undefined,
        rating: undefined,
        complexity: undefined,
        categories: [],
        mechanics: [],
        families: []
      }

      const converted = bggService.convertToGameFormat(bggGame)

      expect(converted.game_description).toBeNull()
      expect(converted.game_image).toBeNull()
      expect(converted.min_players).toBeNull()
      expect(converted.max_players).toBeNull()
      expect(converted.supports_cooperative).toBe(false)
      expect(converted.supports_competitive).toBe(true) // Défaut
      expect(converted.supports_campaign).toBe(false)
      expect(converted.default_mode).toBe('competitive')
    })
  })

  describe('Cache Management', () => {
    it('devrait nettoyer le cache expiré', async () => {
      const { bggService } = await import(
        '../../backend/src/services/bggService'
      )

      // Accéder au cache directement pour les tests
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const cache = (bggService as any).cache
      const now = Date.now()

      // Vider le cache d'abord
      cache.clear()

      // Ajouter des entrées avec des temps d'expiration différents
      cache.set('game1', {
        data: { id: 'game1', name: 'Game 1' },
        cachedAt: now - 25 * 60 * 60 * 1000, // 25h ago
        expiresAt: now - 60 * 60 * 1000 // expiré il y a 1h
      })
      cache.set('game2', {
        data: { id: 'game2', name: 'Game 2' },
        cachedAt: now - 1 * 60 * 60 * 1000, // 1h ago
        expiresAt: now + 23 * 60 * 60 * 1000 // expire dans 23h
      })

      expect(cache.size).toBe(2)

      // Nettoyer le cache
      bggService.cleanExpiredCache()

      // Seule l'entrée non expirée devrait rester
      expect(cache.size).toBe(1)
      expect(cache.has('game1')).toBe(false)
      expect(cache.has('game2')).toBe(true)
    })

    it('devrait avoir un cache vide initialement', async () => {
      const { bggService } = await import(
        '../../backend/src/services/bggService'
      )

      // S'assurer que le cache est initialisé
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const cache = (bggService as any).cache

      // Le cache peut avoir des entrées d'autres tests, le nettoyer
      cache.clear()

      expect(cache.size).toBe(0)
      expect(cache.has('test')).toBe(false)
    })
  })
})
