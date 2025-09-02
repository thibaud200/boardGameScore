/**
 * Tests unitaires pour BGGService Backend - Version vitest-fetch-mock
 * Tests critiques : parsing XML, cache, rate limiting, conversion BGG
 */
import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'

// vitest-fetch-mock est configuré globalement dans test-setup.ts
// Import du service BGG original
const { bggService } = await import('../../backend/src/services/bggService')

// Cast pour obtenir les méthodes de mock
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const mockFetch = fetch as any

describe('BGGService Backend', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.useFakeTimers()
    // Le fetch mock est reseté automatiquement par test-setup.ts
    mockFetch.resetMocks()
    bggService.cleanExpiredCache()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  describe('Rate Limiting', () => {
    it('devrait respecter le délai de 1 seconde entre les requêtes', async () => {
      const mockXmlResponse = `<?xml version="1.0" encoding="utf-8"?>
        <items total="1">
          <item type="boardgame" id="174430">
            <name type="primary" sortindex="1" value="Gloomhaven" />
          </item>
        </items>`

      mockFetch.mockResponse(mockXmlResponse)

      const startTime = Date.now()

      // Première requête
      await bggService.searchGames('gloomhaven')
      expect(mockFetch).toHaveBeenCalledTimes(1)

      // Deuxième requête immédiate
      await bggService.searchGames('wingspan')
      expect(mockFetch).toHaveBeenCalledTimes(2)

      // Vérifier que le délai de rate limit a été respecté
      const elapsed = Date.now() - startTime
      expect(elapsed).toBeGreaterThanOrEqual(1000)
    })
  })

  describe('Search Games', () => {
    it('devrait parser correctement les résultats de recherche XML BGG', async () => {
      const mockXmlResponse = `<?xml version="1.0" encoding="utf-8"?>
        <items total="2">
          <item type="boardgame" id="174430">
            <name type="primary" sortindex="1" value="Gloomhaven" />
            <yearpublished value="2017" />
          </item>
          <item type="boardgame" id="266192">
            <name type="primary" sortindex="1" value="Wingspan" />
            <yearpublished value="2019" />
          </item>
        </items>`

      mockFetch.mockResponseOnce(mockXmlResponse)

      const results = await bggService.searchGames('board games')

      expect(results).toHaveLength(2)
      expect(results[0]).toEqual({
        id: '174430',
        name: 'Gloomhaven',
        yearPublished: 2017
      })
      expect(results[1]).toEqual({
        id: '266192',
        name: 'Wingspan',
        yearPublished: 2019
      })
    })

    it('devrait gérer une réponse vide BGG', async () => {
      const mockXmlResponse = `<?xml version="1.0" encoding="utf-8"?>
        <items total="0">
        </items>`

      mockFetch.mockResponseOnce(mockXmlResponse)

      const results = await bggService.searchGames('nonexistent game')
      expect(results).toEqual([])
    })

    it('devrait gérer les erreurs API BGG', async () => {
      mockFetch.mockRejectOnce(new Error('BGG API error: 503'))

      await expect(bggService.searchGames('error game')).rejects.toThrow(
        'Erreur lors de la recherche sur BoardGameGeek'
      )
    })

    it('devrait gérer les erreurs réseau', async () => {
      mockFetch.mockRejectOnce(new Error('Network error'))

      await expect(bggService.searchGames('network error')).rejects.toThrow(
        'Erreur lors de la recherche sur BoardGameGeek'
      )
    })
  })

  describe('Game Details', () => {
    it("devrait parser correctement les détails complets d'un jeu BGG", async () => {
      const mockXmlResponse = `<?xml version="1.0" encoding="utf-8"?>
        <items termsofuse="https://boardgamegeek.com/xmlapi/termsofuse">
          <item type="boardgame" id="174430">
            <name type="primary" sortindex="1" value="Gloomhaven" />
            <name type="alternate" sortindex="1" value="暗影大陆" />
            <description>Gloomhaven is a game of Euro-inspired tactical combat in a persistent world of shifting motives.</description>
            <yearpublished value="2017" />
            <minplayers value="1" />
            <maxplayers value="4" />
            <playingtime value="120" />
            <minplaytime value="60" />
            <maxplaytime value="120" />
            <minage value="14" />
            <image>https://cf.geekdo-images.com/original/img/lDN358RgcYvQfYYN6Oy2TXpifyM=/0x0/pic2437871.jpg</image>
            <thumbnail>https://cf.geekdo-images.com/thumb/img/e7GyV3RgcYvQfYYN6Oy2TXpifyM=/fit-in/200x150/pic2437871.jpg</thumbnail>
            <link type="boardgamecategory" id="1022" value="Adventure" />
            <link type="boardgamecategory" id="1010" value="Fantasy" />
            <link type="boardgamemechanic" id="2001" value="Action Point Allowance System" />
            <link type="boardgamemechanic" id="2023" value="Co-operative Play" />
            <link type="boardgamefamily" id="25158" value="Campaign Games" />
            <statistics>
              <ratings>
                <average value="8.75726" />
                <averageweight value="3.8756" />
              </ratings>
            </statistics>
          </item>
        </items>`

      mockFetch.mockResponseOnce(mockXmlResponse)

      const details = await bggService.getGameDetails('174430')

      expect(details).toBeDefined()
      expect(details?.id).toBe('174430')
      expect(details?.name).toBe('Gloomhaven')
      expect(details?.yearPublished).toBe(2017)
      expect(details?.minPlayers).toBe(1)
      expect(details?.maxPlayers).toBe(4)
      expect(details?.playingTime).toBe(120)
      expect(details?.age).toBe(14) // Corrigé: age au lieu de minAge
      expect(details?.image).toContain('pic2437871.jpg')
      expect(details?.thumbnail).toContain('pic2437871.jpg')
      expect(details?.description).toContain('Gloomhaven is a game')
      expect(details?.complexity).toBe(3.8756)
      expect(details?.rating).toBe(8.75726)
      expect(details?.categories).toContain('Adventure')
      expect(details?.categories).toContain('Fantasy')
      expect(details?.mechanics).toContain('Action Point Allowance System')
      expect(details?.mechanics).toContain('Co-operative Play')
      expect(details?.families).toContain('Campaign Games')
    })

    it('devrait gérer les jeux sans image', async () => {
      const mockXmlResponse = `<?xml version="1.0" encoding="utf-8"?>
        <items>
          <item type="boardgame" id="123456">
            <name type="primary" value="Test Game" />
            <yearpublished value="2020" />
          </item>
        </items>`

      mockFetch.mockResponseOnce(mockXmlResponse)

      const details = await bggService.getGameDetails('123456')

      expect(details).toBeDefined()
      expect(details?.image).toBeUndefined()
      expect(details?.thumbnail).toBeUndefined()
      expect(details?.name).toBe('Test Game')
    })

    it('devrait gérer les jeux non trouvés', async () => {
      const mockXmlResponse = `<?xml version="1.0" encoding="utf-8"?>
        <items>
        </items>`

      mockFetch.mockResponseOnce(mockXmlResponse)

      await expect(bggService.getGameDetails('999999')).rejects.toThrow(
        'Jeu non trouvé sur BGG'
      )
    })
  })

  describe('Cache System', () => {
    it('devrait mettre en cache les détails de jeu pendant 24h', async () => {
      const mockXmlResponse = `<?xml version="1.0" encoding="utf-8"?>
        <items>
          <item type="boardgame" id="174430">
            <name type="primary" value="Gloomhaven" />
          </item>
        </items>`

      mockFetch.mockResponse(mockXmlResponse)

      // Premier appel
      const details1 = await bggService.getGameDetails('174430')
      expect(mockFetch).toHaveBeenCalledTimes(1)

      // Deuxième appel - devrait utiliser le cache
      const details2 = await bggService.getGameDetails('174430')
      expect(mockFetch).toHaveBeenCalledTimes(1) // Pas d'appel supplémentaire

      expect(details1).toEqual(details2)
    })

    it('devrait expirer le cache après 24h', async () => {
      const mockXmlResponse = `<?xml version="1.0" encoding="utf-8"?>
        <items>
          <item type="boardgame" id="174430">
            <name type="primary" value="Gloomhaven" />
          </item>
        </items>`

      mockFetch.mockResponse(mockXmlResponse)

      // Premier appel
      await bggService.getGameDetails('174430')
      expect(mockFetch).toHaveBeenCalledTimes(1)

      // Avancer le temps de 24h + 1ms
      vi.advanceTimersByTime(24 * 60 * 60 * 1000 + 1)

      // Deuxième appel après expiration - devrait faire un nouvel appel API
      await bggService.getGameDetails('174430')
      expect(mockFetch).toHaveBeenCalledTimes(2)
    })

    it('devrait nettoyer le cache expiré', async () => {
      const mockXmlResponse = `<?xml version="1.0" encoding="utf-8"?>
        <items>
          <item type="boardgame" id="174430">
            <name type="primary" value="Gloomhaven" />
          </item>
        </items>`

      mockFetch.mockResponse(mockXmlResponse)

      // Créer une entrée de cache
      await bggService.getGameDetails('174430')

      // Avancer le temps pour expirer le cache
      vi.advanceTimersByTime(25 * 60 * 60 * 1000) // 25h

      // Nettoyer le cache expiré
      bggService.cleanExpiredCache()

      // Vérifier que le cache est vide en faisant un nouvel appel
      await bggService.getGameDetails('174430')
      expect(mockFetch).toHaveBeenCalledTimes(2) // Nouvel appel car cache nettoyé
    })
  })

  describe('Convert To Game Format', () => {
    it('devrait convertir correctement un jeu BGG vers notre format', () => {
      const bggGame = {
        id: '174430',
        name: 'Gloomhaven',
        minPlayers: 1,
        maxPlayers: 4,
        playingTime: 120,
        complexity: 3.8756,
        rating: 8.75726,
        yearPublished: 2017,
        image: 'https://example.com/image.jpg',
        description: 'Great game',
        categories: ['Adventure', 'Fantasy'],
        mechanics: ['Action Point Allowance System', 'Co-operative Play']
      }

      const converted = bggService.convertToGameFormat(bggGame)

      expect(converted).toEqual({
        game_id_bgg: '174430',
        game_name: 'Gloomhaven',
        game_description: 'Great game',
        game_image: 'https://example.com/image.jpg',
        has_characters: false,
        characters: null,
        min_players: 1,
        max_players: 4,
        supports_cooperative: true,
        supports_competitive: true,
        supports_campaign: false,
        default_mode: 'cooperative'
      })
    })

    it('devrait détecter le mode coopératif', () => {
      const bggGame = {
        id: '123',
        name: 'Coop Game',
        mechanics: ['Cooperative Game', 'Hand Management']
      }

      const converted = bggService.convertToGameFormat(bggGame)
      expect(converted.supports_cooperative).toBe(true)
    })

    it('devrait détecter le mode campagne', () => {
      const bggGame = {
        id: '456',
        name: 'Campaign Game',
        mechanics: ['Campaign / Battle Card Driven', 'Hand Management']
      }

      const converted = bggService.convertToGameFormat(bggGame)
      expect(converted.supports_campaign).toBe(true)
    })

    it('devrait gérer les valeurs nulles et undefined', () => {
      const bggGame = {
        id: '789',
        name: 'Minimal Game'
      }

      const converted = bggService.convertToGameFormat(bggGame)

      expect(converted.game_id_bgg).toBe('789')
      expect(converted.game_name).toBe('Minimal Game')
      expect(converted.min_players).toBe(null) // null car non défini
      expect(converted.max_players).toBe(null) // null car non défini
      expect(converted.supports_cooperative).toBe(false)
      expect(converted.supports_campaign).toBe(false)
      expect(converted.default_mode).toBe('competitive')
      expect(converted.game_image).toBeNull()
      expect(converted.game_description).toBeNull()
    })
  })
})
