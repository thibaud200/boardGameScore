/**
 * Types pour l'intégration BoardGameGeek API
 */

// Types de base BGG
export interface BGGGame {
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

// Réponse de recherche BGG
export interface BGGSearchResult {
  id: string
  name: string
  yearPublished?: number
}

// Réponse détaillée BGG
export interface BGGGameDetails extends BGGGame {
  expansions?: BGGExpansion[]
  designers?: string[]
  artists?: string[]
  publishers?: string[]
}

// Extension BGG
export interface BGGExpansion {
  id: string
  name: string
  yearPublished?: number
}

// Types pour la conversion vers notre format
export interface BGGToGameConversion {
  game_id_bgg: string
  game_name: string
  game_description?: string
  game_image?: string
  has_characters: boolean
  min_players?: number
  max_players?: number
  supports_cooperative?: boolean
  supports_competitive?: boolean
  supports_campaign?: boolean
  default_mode: string
}

// Service de cache BGG
export interface BGGCacheEntry {
  id: string
  data: BGGGameDetails
  cachedAt: number
  expiresAt: number
}
