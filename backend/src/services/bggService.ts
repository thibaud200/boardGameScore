/**
 * Service d'intégration BoardGameGeek
 * Gère les requêtes API, le parsing XML et le cache
 */
import { parseString } from 'xml2js'
import { promisify } from 'util'
import LoggerService from './loggerService.js'
import { BGGLogMeta } from '../types/logging.js'

const parseXML = promisify(parseString)

// Types pour la structure XML de BGG
interface BGGXMLSearchResponse {
  items?: {
    item?: BGGXMLSearchItem | BGGXMLSearchItem[]
  }
}

interface BGGXMLSearchItem {
  $: { id: string }
  name?: [{ $: { value: string } }]
  yearpublished?: [{ $: { value: string } }]
}

interface BGGXMLDetailsResponse {
  items?: {
    item?: BGGXMLGameItem[]
  }
}

interface BGGXMLGameItem {
  $: { id: string }
  name?: BGGXMLName[]
  yearpublished?: [{ $: { value: string } }]
  minplayers?: [{ $: { value: string } }]
  maxplayers?: [{ $: { value: string } }]
  playingtime?: [{ $: { value: string } }]
  minplaytime?: [{ $: { value: string } }]
  maxplaytime?: [{ $: { value: string } }]
  minage?: [{ $: { value: string } }]
  description?: string[]
  image?: string[]
  thumbnail?: string[]
  link?: BGGXMLLink[]
  statistics?: [
    {
      ratings?: [
        {
          averageweight?: [{ $: { value: string } }]
          average?: [{ $: { value: string } }]
        }
      ]
    }
  ]
}

interface BGGXMLName {
  $: { type?: string; value: string }
}

interface BGGXMLLink {
  $: { type: string; value: string; id?: string }
}

interface BGGSearchResult {
  id: string
  name: string
  yearPublished?: number
}

interface BGGGameDetails {
  id: string
  name: string
  yearPublished?: number
  minPlayers?: number
  maxPlayers?: number
  playingTime?: number
  minPlayingTime?: number
  maxPlayingTime?: number
  age?: number
  description?: string
  image?: string
  thumbnail?: string
  complexity?: number
  rating?: number
  categories?: string[]
  mechanics?: string[]
  families?: string[]
  extensions?: Array<{ id: number; name: string }>
}

interface BGGCacheEntry {
  data: BGGGameDetails
  cachedAt: number
  expiresAt: number
}

class BGGService {
  private cache = new Map<string, BGGCacheEntry>()
  private readonly CACHE_DURATION = 24 * 60 * 60 * 1000 // 24 heures
  private readonly BASE_URL = 'https://boardgamegeek.com/xmlapi2'
  private readonly RATE_LIMIT_DELAY = 1000 // 1 seconde entre les requêtes

  private lastRequestTime = 0

  /**
   * Applique un rate limiting pour respecter les limites BGG
   */
  private async rateLimit(): Promise<void> {
    const now = Date.now()
    const timeSinceLastRequest = now - this.lastRequestTime

    if (timeSinceLastRequest < this.RATE_LIMIT_DELAY) {
      const delay = this.RATE_LIMIT_DELAY - timeSinceLastRequest
      await new Promise((resolve) => setTimeout(resolve, delay))
    }

    this.lastRequestTime = Date.now()
  }

  /**
   * Recherche des jeux sur BGG par nom
   */
  async searchGames(query: string): Promise<BGGSearchResult[]> {
    const startTime = Date.now()
    await this.rateLimit()

    try {
      const url = `${this.BASE_URL}/search?query=${encodeURIComponent(query)}&type=boardgame`

      LoggerService.debug('BGG search initiated', {
        context: 'BGG_SEARCH',
        searchTerm: query,
        url
      } as BGGLogMeta)

      const response = await fetch(url)
      const apiCallTime = Date.now() - startTime

      if (!response.ok) {
        LoggerService.error('BGG API search failed', {
          context: 'BGG_SEARCH',
          searchTerm: query,
          statusCode: response.status,
          apiCallTime
        } as BGGLogMeta)
        throw new Error(`BGG API error: ${response.status}`)
      }

      const xmlData = await response.text()
      const responseSize = Buffer.byteLength(xmlData, 'utf8')

      LoggerService.debug('BGG search response received', {
        context: 'BGG_SEARCH',
        searchTerm: query,
        responseSize,
        apiCallTime
      } as BGGLogMeta)

      const parseStartTime = Date.now()
      const parsed = (await parseXML(xmlData)) as BGGXMLSearchResponse
      const parseTime = Date.now() - parseStartTime

      if (!parsed.items || !parsed.items.item) {
        LoggerService.info('BGG search returned no results', {
          context: 'BGG_SEARCH',
          searchTerm: query,
          resultCount: 0,
          parseTime,
          apiCallTime
        } as BGGLogMeta)
        return []
      }

      const items = Array.isArray(parsed.items.item)
        ? parsed.items.item
        : [parsed.items.item]

      const results = items.map(
        (item: BGGXMLSearchItem): BGGSearchResult => ({
          id: item.$.id,
          name: item.name?.[0]?.$.value || 'Unknown',
          yearPublished: item.yearpublished?.[0]?.$.value
            ? parseInt(item.yearpublished[0].$.value)
            : undefined
        })
      )

      const totalTime = Date.now() - startTime
      LoggerService.info('BGG search completed successfully', {
        context: 'BGG_SEARCH',
        searchTerm: query,
        resultCount: results.length,
        parseTime,
        apiCallTime,
        totalTime
      } as BGGLogMeta)

      return results
    } catch (error) {
      const totalTime = Date.now() - startTime
      LoggerService.error('BGG search failed with error', {
        context: 'BGG_SEARCH',
        searchTerm: query,
        error: error instanceof Error ? error.message : String(error),
        totalTime
      } as BGGLogMeta)
      throw new Error('Erreur lors de la recherche sur BoardGameGeek')
    }
  }

  /**
   * Récupère les détails d'un jeu BGG
   */
  async getGameDetails(gameId: string): Promise<BGGGameDetails> {
    const startTime = Date.now()

    // Vérifier le cache
    const cached = this.cache.get(gameId)
    if (cached && cached.expiresAt > Date.now()) {
      LoggerService.debug('BGG game details cache hit', {
        context: 'BGG_DETAILS',
        gameId: parseInt(gameId),
        cacheHit: true
      } as BGGLogMeta)
      return cached.data
    }

    await this.rateLimit()

    try {
      const url = `${this.BASE_URL}/thing?id=${gameId}&stats=1`

      LoggerService.debug('BGG game details request initiated', {
        context: 'BGG_DETAILS',
        gameId: parseInt(gameId),
        url,
        cacheHit: false
      } as BGGLogMeta)

      const response = await fetch(url)
      const apiCallTime = Date.now() - startTime

      if (!response.ok) {
        LoggerService.error('BGG API game details failed', {
          context: 'BGG_DETAILS',
          gameId: parseInt(gameId),
          statusCode: response.status,
          apiCallTime
        } as BGGLogMeta)
        throw new Error(`BGG API error: ${response.status}`)
      }

      const xmlData = await response.text()
      const responseSize = Buffer.byteLength(xmlData, 'utf8')

      LoggerService.debug('BGG game details response received', {
        context: 'BGG_DETAILS',
        gameId: parseInt(gameId),
        responseSize,
        apiCallTime
      } as BGGLogMeta)

      const parseStartTime = Date.now()
      const parsed = (await parseXML(xmlData)) as BGGXMLDetailsResponse
      const parseTime = Date.now() - parseStartTime

      if (!parsed.items || !parsed.items.item) {
        LoggerService.warn('BGG game not found', {
          context: 'BGG_DETAILS',
          gameId: parseInt(gameId),
          parseTime,
          apiCallTime
        } as BGGLogMeta)
        throw new Error('Jeu non trouvé sur BGG')
      }

      const item = parsed.items.item[0]
      const details = this.parseGameDetails(item)

      // Mettre en cache
      this.cache.set(gameId, {
        data: details,
        cachedAt: Date.now(),
        expiresAt: Date.now() + this.CACHE_DURATION
      })

      const totalTime = Date.now() - startTime
      LoggerService.info('BGG game details completed successfully', {
        context: 'BGG_DETAILS',
        gameId: parseInt(gameId),
        gameName: details.name,
        parseTime,
        apiCallTime,
        totalTime,
        categories: details.categories,
        mechanics: details.mechanics,
        families: details.families,
        extensionCount: details.extensions?.length || 0,
        hasExtensions: (details.extensions?.length || 0) > 0
      } as BGGLogMeta)

      return details
    } catch (error) {
      const totalTime = Date.now() - startTime
      LoggerService.error('BGG game details failed with error', {
        context: 'BGG_DETAILS',
        gameId: parseInt(gameId),
        error: error instanceof Error ? error.message : String(error),
        totalTime
      } as BGGLogMeta)
      throw new Error('Erreur lors de la récupération des détails du jeu')
    }
  }

  /**
   * Parse les détails d'un jeu depuis la réponse XML BGG
   */
  private parseGameDetails(item: BGGXMLGameItem): BGGGameDetails {
    const names = Array.isArray(item.name)
      ? item.name
      : item.name
        ? [item.name]
        : []
    const primaryName =
      names.find((n: BGGXMLName) => n.$.type === 'primary')?.$.value ||
      names[0]?.$.value ||
      'Unknown'

    // Investigation des types de liens disponibles (pour debugging)
    this.investigateLinkTypes(item.link || [])

    // Extraction des catégories, mécaniques, familles et extensions
    const categories = this.extractLinks(item.link || [], 'boardgamecategory')
    const mechanics = this.extractLinks(item.link || [], 'boardgamemechanic')
    const families = this.extractLinks(item.link || [], 'boardgamefamily')
    const extensions = this.extractExpansions(item.link || [])

    return {
      id: item.$.id,
      name: primaryName,
      yearPublished: item.yearpublished?.[0]?.$.value
        ? parseInt(item.yearpublished[0].$.value)
        : undefined,
      minPlayers: item.minplayers?.[0]?.$.value
        ? parseInt(item.minplayers[0].$.value)
        : undefined,
      maxPlayers: item.maxplayers?.[0]?.$.value
        ? parseInt(item.maxplayers[0].$.value)
        : undefined,
      playingTime: item.playingtime?.[0]?.$.value
        ? parseInt(item.playingtime[0].$.value)
        : undefined,
      minPlayingTime: item.minplaytime?.[0]?.$.value
        ? parseInt(item.minplaytime[0].$.value)
        : undefined,
      maxPlayingTime: item.maxplaytime?.[0]?.$.value
        ? parseInt(item.maxplaytime[0].$.value)
        : undefined,
      age: item.minage?.[0]?.$.value
        ? parseInt(item.minage[0].$.value)
        : undefined,
      description: item.description?.[0] || undefined,
      image: item.image?.[0] || undefined,
      thumbnail: item.thumbnail?.[0] || undefined,
      complexity: item.statistics?.[0]?.ratings?.[0]?.averageweight?.[0]?.$
        .value
        ? parseFloat(item.statistics[0].ratings[0].averageweight[0].$.value)
        : undefined,
      rating: item.statistics?.[0]?.ratings?.[0]?.average?.[0]?.$.value
        ? parseFloat(item.statistics[0].ratings[0].average[0].$.value)
        : undefined,
      categories,
      mechanics,
      families,
      extensions
    }
  }

  /**
   * Extrait les liens d'un type spécifique depuis la réponse BGG
   */
  private extractLinks(links: BGGXMLLink[], linkType: string): string[] {
    if (!links) return []

    const linksArray = Array.isArray(links) ? links : [links]
    return linksArray
      .filter((link: BGGXMLLink) => link.$.type === linkType)
      .map((link: BGGXMLLink) => link.$.value)
  }

  /**
   * Extrait les extensions d'un jeu depuis les liens BGG
   */
  private extractExpansions(
    links: BGGXMLLink[]
  ): Array<{ id: number; name: string }> {
    if (!links || links.length === 0) {
      return []
    }

    const expansions: Array<{ id: number; name: string }> = []

    links.forEach((link) => {
      if (link.$ && link.$.type === 'boardgameexpansion') {
        const expansionId = parseInt(link.$.id || '0')
        const expansionName = link.$.value || 'Unknown Extension'

        // Validation basique de l'ID
        if (expansionId > 0 && expansionName.trim()) {
          expansions.push({
            id: expansionId,
            name: expansionName.trim()
          })
        }
      }
    })

    // Log des extensions trouvées pour le monitoring
    if (expansions.length > 0) {
      LoggerService.debug('Extensions extracted successfully', {
        context: 'BGG_EXTENSIONS',
        extensionCount: expansions.length,
        extensionNames: expansions.map((ext) => ext.name).slice(0, 5) // Premiers 5 noms
      } as BGGLogMeta)
    }

    return expansions
  }

  /**
   * Fonction de debugging pour investiguer tous les types de liens disponibles
   */
  private investigateLinkTypes(links: BGGXMLLink[]): void {
    if (!links) {
      LoggerService.debug('No links found in BGG response', {
        context: 'BGG_DETAILS'
      })
      return
    }

    const linksArray = Array.isArray(links) ? links : [links]
    const linkTypes = new Set<string>()
    const linksByType: { [key: string]: string[] } = {}

    linksArray.forEach((link: BGGXMLLink) => {
      const type = link.$.type
      const value = link.$.value

      linkTypes.add(type)
      if (!linksByType[type]) {
        linksByType[type] = []
      }
      linksByType[type].push(value)
    })

    LoggerService.info('BGG Link Types Investigation', {
      context: 'BGG_DETAILS',
      totalLinks: linksArray.length,
      uniqueTypes: Array.from(linkTypes),
      linksByType: Object.fromEntries(
        Object.entries(linksByType).map(([type, values]) => [
          type,
          { count: values.length, samples: values.slice(0, 3) }
        ])
      )
    })
  }

  /**
   * Récupère uniquement les extensions d'un jeu BGG (plus léger que getGameDetails)
   */
  async getGameExtensions(
    gameId: string
  ): Promise<Array<{ id: number; name: string }>> {
    const startTime = Date.now()
    await this.rateLimit()

    try {
      const url = `${this.BASE_URL}/thing?id=${gameId}`

      LoggerService.debug('BGG extensions request initiated', {
        context: 'BGG_EXTENSIONS',
        gameId: parseInt(gameId),
        url
      } as BGGLogMeta)

      const response = await fetch(url)
      const apiCallTime = Date.now() - startTime

      if (!response.ok) {
        LoggerService.error('BGG API extensions request failed', {
          context: 'BGG_EXTENSIONS',
          gameId: parseInt(gameId),
          statusCode: response.status,
          apiCallTime
        } as BGGLogMeta)
        throw new Error(`BGG API error: ${response.status}`)
      }

      const xmlData = await response.text()
      const parseStartTime = Date.now()
      const parsed = (await parseXML(xmlData)) as BGGXMLDetailsResponse
      const parseTime = Date.now() - parseStartTime

      if (!parsed.items || !parsed.items.item) {
        LoggerService.warn('BGG game not found for extensions', {
          context: 'BGG_EXTENSIONS',
          gameId: parseInt(gameId),
          parseTime,
          apiCallTime
        } as BGGLogMeta)
        return []
      }

      const item = parsed.items.item[0]
      const extensions = this.extractExpansions(item.link || [])

      const totalTime = Date.now() - startTime
      LoggerService.info('BGG extensions request completed', {
        context: 'BGG_EXTENSIONS',
        gameId: parseInt(gameId),
        extensionCount: extensions.length,
        parseTime,
        apiCallTime,
        totalTime
      } as BGGLogMeta)

      return extensions
    } catch (error) {
      const totalTime = Date.now() - startTime
      LoggerService.error('BGG extensions request failed', {
        context: 'BGG_EXTENSIONS',
        gameId: parseInt(gameId),
        error: error instanceof Error ? error.message : String(error),
        totalTime
      } as BGGLogMeta)
      throw new Error('Erreur lors de la récupération des extensions')
    }
  }

  /**
   * Analyse les patterns d'extensions pour plusieurs jeux
   */
  async analyzeExtensionPatterns(gameIds: string[]): Promise<{
    totalGames: number
    gamesWithExtensions: number
    averageExtensionsPerGame: number
    mostExtensions: { gameId: string; count: number; gameName?: string }
    extensionPatterns: Array<{
      gameId: string
      extensionCount: number
      extensionNames: string[]
    }>
  }> {
    const startTime = Date.now()
    LoggerService.info('Extension pattern analysis started', {
      context: 'BGG_ANALYSIS',
      gameCount: gameIds.length
    } as BGGLogMeta)

    const results: Array<{
      gameId: string
      extensionCount: number
      extensionNames: string[]
      gameName?: string
    }> = []

    for (const gameId of gameIds) {
      try {
        const extensions = await this.getGameExtensions(gameId)
        results.push({
          gameId,
          extensionCount: extensions.length,
          extensionNames: extensions.map((ext) => ext.name)
        })
      } catch (error) {
        LoggerService.warn('Failed to get extensions for game in analysis', {
          context: 'BGG_ANALYSIS',
          gameId: parseInt(gameId),
          error: error instanceof Error ? error.message : String(error)
        } as BGGLogMeta)

        results.push({
          gameId,
          extensionCount: 0,
          extensionNames: []
        })
      }
    }

    const gamesWithExtensions = results.filter(
      (r) => r.extensionCount > 0
    ).length
    const totalExtensions = results.reduce(
      (sum, r) => sum + r.extensionCount,
      0
    )
    const averageExtensions =
      gameIds.length > 0 ? totalExtensions / gameIds.length : 0

    const mostExtensionsGame = results.reduce(
      (max, current) =>
        current.extensionCount > max.extensionCount ? current : max,
      results[0] || { gameId: '', extensionCount: 0 }
    )

    const analysisTime = Date.now() - startTime
    LoggerService.info('Extension pattern analysis completed', {
      context: 'BGG_ANALYSIS',
      totalGames: gameIds.length,
      gamesWithExtensions,
      averageExtensions: Math.round(averageExtensions * 100) / 100,
      analysisTime
    } as BGGLogMeta)

    return {
      totalGames: gameIds.length,
      gamesWithExtensions,
      averageExtensionsPerGame: Math.round(averageExtensions * 100) / 100,
      mostExtensions: {
        gameId: mostExtensionsGame.gameId,
        count: mostExtensionsGame.extensionCount,
        gameName: mostExtensionsGame.gameName
      },
      extensionPatterns: results.map((r) => ({
        gameId: r.gameId,
        extensionCount: r.extensionCount,
        extensionNames: r.extensionNames
      }))
    }
  }

  /**
   * Compare les extensions entre différentes versions d'un même jeu
   */
  async compareGameExtensions(gameIds: string[]): Promise<{
    gamesCompared: Array<{
      gameId: string
      gameName?: string
      extensionCount: number
      extensions: Array<{ id: number; name: string }>
    }>
    summary: {
      totalUniqueExtensions: number
      sharedExtensions: Array<{ name: string; gamesWithExtension: string[] }>
      exclusiveExtensions: Array<{ gameId: string; extensions: string[] }>
    }
  }> {
    const startTime = Date.now()
    LoggerService.info('Game extension comparison started', {
      context: 'BGG_ANALYSIS',
      gameCount: gameIds.length
    } as BGGLogMeta)

    const gameData: Array<{
      gameId: string
      gameName?: string
      extensionCount: number
      extensions: Array<{ id: number; name: string }>
    }> = []

    // Récupérer les extensions pour chaque jeu
    for (const gameId of gameIds) {
      try {
        const extensions = await this.getGameExtensions(gameId)
        gameData.push({
          gameId,
          extensionCount: extensions.length,
          extensions
        })
      } catch (error) {
        LoggerService.warn('Failed to get extensions for comparison', {
          context: 'BGG_ANALYSIS',
          gameId: parseInt(gameId),
          error: error instanceof Error ? error.message : String(error)
        } as BGGLogMeta)

        gameData.push({
          gameId,
          extensionCount: 0,
          extensions: []
        })
      }
    }

    // Analyser les extensions
    const allExtensionNames = new Set<string>()
    const extensionsByGame = new Map<string, Set<string>>()

    gameData.forEach((game) => {
      const extensionNames = new Set<string>()
      game.extensions.forEach((ext) => {
        allExtensionNames.add(ext.name)
        extensionNames.add(ext.name)
      })
      extensionsByGame.set(game.gameId, extensionNames)
    })

    // Trouver les extensions partagées
    const sharedExtensions: Array<{
      name: string
      gamesWithExtension: string[]
    }> = []
    allExtensionNames.forEach((extensionName) => {
      const gamesWithExtension = gameIds.filter((gameId) =>
        extensionsByGame.get(gameId)?.has(extensionName)
      )
      if (gamesWithExtension.length > 1) {
        sharedExtensions.push({
          name: extensionName,
          gamesWithExtension
        })
      }
    })

    // Trouver les extensions exclusives
    const exclusiveExtensions: Array<{ gameId: string; extensions: string[] }> =
      []
    gameData.forEach((game) => {
      const exclusives = game.extensions
        .map((ext) => ext.name)
        .filter((extName) => {
          const gamesWithThis = gameIds.filter((gameId) =>
            extensionsByGame.get(gameId)?.has(extName)
          )
          return gamesWithThis.length === 1
        })

      if (exclusives.length > 0) {
        exclusiveExtensions.push({
          gameId: game.gameId,
          extensions: exclusives
        })
      }
    })

    const analysisTime = Date.now() - startTime
    LoggerService.info('Game extension comparison completed', {
      context: 'BGG_ANALYSIS',
      totalGames: gameIds.length,
      totalUniqueExtensions: allExtensionNames.size,
      analysisTime
    } as BGGLogMeta)

    return {
      gamesCompared: gameData,
      summary: {
        totalUniqueExtensions: allExtensionNames.size,
        sharedExtensions,
        exclusiveExtensions
      }
    }
  }

  /**
   * Convertit un jeu BGG vers notre format avec détection automatique des personnages
   */
  async convertToGameFormat(bggGame: BGGGameDetails): Promise<{
    game_id_bgg: string
    game_name: string
    game_description: string | null
    game_image: string | null
    has_characters: boolean
    characters: null
    min_players: number | null
    max_players: number | null
    supports_cooperative: boolean
    supports_competitive: boolean
    supports_campaign: boolean
    default_mode: string
  }> {
    // Détection des personnages basée sur la description et les mécaniques
    const description = (bggGame.description || '').toLowerCase()
    const mechanics = bggGame.mechanics?.map((m) => m.toLowerCase()) || []

    let hasCharacters =
      description.includes('character') ||
      description.includes('hero') ||
      description.includes('player character') ||
      mechanics.some(
        (m) =>
          m.includes('role playing') ||
          m.includes('character') ||
          m.includes('hero')
      )

    // Vérification supplémentaire via l'API externe si supporté
    try {
      const { externalGameDataService } = await import(
        './externalGameDataService.js'
      )
      if (externalGameDataService.isGameSupported(parseInt(bggGame.id))) {
        LoggerService.debug('Checking external data for character detection', {
          context: 'BGG_CHARACTER_DETECTION',
          gameId: parseInt(bggGame.id),
          gameName: bggGame.name
        })

        const externalData = await externalGameDataService.scrapeGameData(
          parseInt(bggGame.id)
        )
        if (externalData && externalData.characters.length > 0) {
          hasCharacters = true
          LoggerService.info('Characters detected via external data', {
            context: 'BGG_CHARACTER_DETECTION',
            gameId: parseInt(bggGame.id),
            gameName: bggGame.name,
            characterCount: externalData.characters.length,
            detectionMethod: 'external_api'
          })
        }
      }
    } catch (error) {
      LoggerService.warn('Failed to check external data for characters', {
        context: 'BGG_CHARACTER_DETECTION',
        gameId: parseInt(bggGame.id),
        error: error instanceof Error ? error.message : String(error)
      })
    }

    // Détection des modes
    const mechanicNames = mechanics
    const supportsCooperative = mechanicNames.some(
      (m) =>
        m.includes('cooperative') || m.includes('co-op') || m.includes('team')
    )
    const supportsCampaign = mechanicNames.some(
      (m) =>
        m.includes('campaign') || m.includes('legacy') || m.includes('story')
    )

    // Mode par défaut
    let defaultMode = 'competitive'
    if (supportsCooperative && !supportsCampaign) {
      defaultMode = 'cooperative'
    } else if (supportsCampaign) {
      defaultMode = 'campaign'
    }

    return {
      game_id_bgg: bggGame.id,
      game_name: bggGame.name,
      game_description: bggGame.description || null,
      game_image: bggGame.image || null,
      has_characters: hasCharacters,
      characters: null, // À remplir manuellement ou via import automatique
      min_players: bggGame.minPlayers || null,
      max_players: bggGame.maxPlayers || null,
      supports_cooperative: supportsCooperative || false,
      supports_competitive: true, // Par défaut, la plupart des jeux sont compétitifs
      supports_campaign: supportsCampaign || false,
      default_mode: defaultMode
    }
  }

  /**
   * Nettoie le cache expiré
   */
  cleanExpiredCache(): void {
    const now = Date.now()
    for (const [key, entry] of this.cache.entries()) {
      if (entry.expiresAt <= now) {
        this.cache.delete(key)
      }
    }
  }
}

export const bggService = new BGGService()

// Nettoyage du cache toutes les heures
setInterval(
  () => {
    bggService.cleanExpiredCache()
  },
  60 * 60 * 1000
)
