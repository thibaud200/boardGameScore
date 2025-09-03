/**
 * Types TypeScript pour l'application Board Game Score Tracker
 * Synchronisés avec le schéma de base de données backend
 */

// Types de base partagés avec le backend
export interface Player {
  player_id: number
  player_name: string
  avatar_url?: string | null
  color?: string | null
  created_at: string
}

export interface Game {
  game_id: number
  game_id_bgg?: string | null
  game_name: string
  game_description?: string | null
  game_image?: string | null
  has_characters: boolean
  characters?: string | null
  min_players?: number | null
  max_players?: number | null
  supports_cooperative?: boolean | null
  supports_competitive?: boolean | null
  supports_campaign?: boolean | null
  default_mode?: string | null
  created_at: string
}

export interface GameSession {
  sessions_id: number
  sessions_game_id: number
  is_cooperative: boolean
  game_mode: string
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
// Types de requêtes pour les opérations CRUD
export interface CreatePlayerRequest {
  player_name: string
  avatar_url?: string | null
  color?: string | null
}

export type UpdatePlayerRequest = Partial<CreatePlayerRequest>

export interface CreateGameRequest {
  game_id_bgg?: string | null
  game_name: string
  game_description?: string | null
  game_image?: string | null
  has_characters: boolean
  characters?: string | null
  min_players?: number | null
  max_players?: number | null
  supports_cooperative?: boolean | null
  supports_competitive?: boolean | null
  supports_campaign?: boolean | null
  default_mode?: string | null
}

export type UpdateGameRequest = Partial<CreateGameRequest>

// Types BGG
export * from './bgg.types'

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

// Types pour current_game
export interface CurrentGame {
  id: number
  game_data: string // JSON string
  created_at: string
  updated_at: string
}

export interface CurrentGameData {
  game_id: number
  game_name: string
  players: Player[]
  current_mode: string
  started_at: string
  current_round?: number
  game_state?: Record<string, unknown> // État spécifique au jeu
}

// Types pour les statistiques
export interface PlayerStats {
  stat_id: number
  player_id: number
  total_games_played: number
  total_wins: number
  total_losses: number
  total_score: number
  average_score: number
  last_game_date?: string
  created_at: string
}

export interface GameStats {
  stat_id: number
  session_ids: string // JSON array
  game_id: number
  duration?: number
  total_players: number
  total_score: number
  created_at: string
}

export interface PlayerGameStats {
  stat_id: number
  player_id: number
  game_id: number
  total_games_played: number
  total_wins: number
  total_losses: number
  total_score: number
  average_score: number
  last_game_date?: string
  created_at: string
}

// Types de requêtes pour les statistiques
export interface CreateCurrentGameRequest {
  game_id: number
  players: number[] // IDs des joueurs
  game_mode: string
}

export interface UpdateCurrentGameRequest {
  game_state?: Record<string, unknown>
  current_round?: number
}

// Types étendus avec relations
export interface PlayerWithStats extends Player {
  stats?: PlayerStats
}

export interface GameWithStats extends Game {
  stats?: GameStats
  sessions_count?: number
}

export interface SessionWithDetails extends GameSession {
  game?: Game
  players_details?: Player[]
  winner_details?: Player
}
