/**
 * Service d'intégration BoardGameGeek
 * Gère les requêtes API, le parsing XML et le cache
 */
import fetch from 'node-fetch'
import { parseString } from 'xml2js'
import { promisify } from 'util'

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
  $: { type: string; value: string }
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
    await this.rateLimit()

    try {
      const url = `${this.BASE_URL}/search?query=${encodeURIComponent(query)}&type=boardgame`
      const response = await fetch(url)

      if (!response.ok) {
        throw new Error(`BGG API error: ${response.status}`)
      }

      const xmlData = await response.text()
      const parsed = (await parseXML(xmlData)) as BGGXMLSearchResponse

      if (!parsed.items || !parsed.items.item) {
        return []
      }

      const items = Array.isArray(parsed.items.item)
        ? parsed.items.item
        : [parsed.items.item]

      return items.map(
        (item: BGGXMLSearchItem): BGGSearchResult => ({
          id: item.$.id,
          name: item.name?.[0]?.$.value || 'Unknown',
          yearPublished: item.yearpublished?.[0]?.$.value
            ? parseInt(item.yearpublished[0].$.value)
            : undefined
        })
      )
    } catch (error) {
      console.error('Erreur recherche BGG:', error)
      throw new Error('Erreur lors de la recherche sur BoardGameGeek')
    }
  }

  /**
   * Récupère les détails d'un jeu BGG
   */
  async getGameDetails(gameId: string): Promise<BGGGameDetails> {
    // Vérifier le cache
    const cached = this.cache.get(gameId)
    if (cached && cached.expiresAt > Date.now()) {
      return cached.data
    }

    await this.rateLimit()

    try {
      const url = `${this.BASE_URL}/thing?id=${gameId}&stats=1`
      const response = await fetch(url)

      if (!response.ok) {
        throw new Error(`BGG API error: ${response.status}`)
      }

      const xmlData = await response.text()
      const parsed = (await parseXML(xmlData)) as BGGXMLDetailsResponse

      if (!parsed.items || !parsed.items.item) {
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

      return details
    } catch (error) {
      console.error('Erreur détails BGG:', error)
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

    // Extraction des catégories, mécaniques, etc.
    const categories = this.extractLinks(item.link || [], 'boardgamecategory')
    const mechanics = this.extractLinks(item.link || [], 'boardgamemechanic')
    const families = this.extractLinks(item.link || [], 'boardgamefamily')

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
      families
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
   * Convertit un jeu BGG vers notre format
   */
  convertToGameFormat(bggGame: BGGGameDetails): {
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
  } {
    // Détection des personnages basée sur la description et les mécaniques
    const description = (bggGame.description || '').toLowerCase()
    const mechanics = bggGame.mechanics?.map((m) => m.toLowerCase()) || []

    const hasCharacters =
      description.includes('character') ||
      description.includes('hero') ||
      description.includes('player character') ||
      mechanics.some(
        (m) =>
          m.includes('role playing') ||
          m.includes('character') ||
          m.includes('hero')
      )

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
      characters: null, // À remplir manuellement
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
