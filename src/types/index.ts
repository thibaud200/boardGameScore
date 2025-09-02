/**
 * Types TypeScript pour l'application Board Game Score Tracker
 * Synchronisés avec le schéma de base de données backend
 */

// Types de base partagés avec le backend
export interface Player {
  player_id: number
  player_name: string
  created_at: string
}

export interface Game {
  game_id: number
  game_id_bgg?: number
  game_name: string
  min_players: number
  max_players: number
  play_time_min?: number
  complexity?: number
  year_published?: number
  game_description?: string
  image_url?: string
  manual_url?: string
  bgg_url?: string
  supports_campaign: boolean
  default_mode: string
  created_at: string
}

export interface GameSession {
  sessions_id: number
  sessions_game_id: number
  is_cooperative: boolean
  sessions_game_mode: string
  sessions_players: string
  sessions_scores: string
  sessions_characters?: string
  sessions_extensions?: string
  sessions_winner?: number
  win_condition?: string
  sessions_date?: string
  sessions_duration?: string
  sessions_completed: boolean
  sessions_coop_result?: string
  sessions_dead_characters?: string
  created_at: string
}

export interface GameCharacter {
  character_id: number
  game_id: number
  character_name: string
  character_description?: string
  character_abilities?: string
  character_image_url?: string
  created_at: string
}

export interface GameExtension {
  extension_id: number
  extensions_name: string
  base_game_id: number
  extensions_description?: string
  add_max_players: number
  created_at: string
}

// Types pour les formulaires
export interface CreatePlayerRequest {
  player_name: string
}

export interface UpdatePlayerRequest {
  player_name?: string
}

export interface CreateGameRequest {
  game_name: string
  min_players: number
  max_players: number
  play_time_min?: number
  complexity?: number
  year_published?: number
  game_description?: string
  image_url?: string
  manual_url?: string
  bgg_url?: string
  supports_campaign?: boolean
  default_mode?: string
}

export interface UpdateGameRequest extends Partial<CreateGameRequest> {}

// Types d'état pour l'UI
export interface ApiState<T> {
  data: T | null
  loading: boolean
  error: string | null
}

export interface ListState<T> {
  items: T[]
  loading: boolean
  error: string | null
}
