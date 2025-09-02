export interface Game {
  game_id: number
  game_id_bgg?: string
  game_name: string
  game_description?: string
  game_image?: string
  has_characters: boolean
  characters?: string // JSON string
  min_players?: number
  max_players?: number
  supports_cooperative?: boolean
  supports_competitive?: boolean
  supports_campaign?: boolean
  default_mode?: string
  created_at: string
}

export interface CreateGameRequest {
  game_id_bgg?: string
  game_name: string
  game_description?: string
  game_image?: string
  has_characters: boolean
  characters?: string
  min_players?: number
  max_players?: number
  supports_cooperative?: boolean
  supports_competitive?: boolean
  supports_campaign?: boolean
  default_mode?: string
}

export interface UpdateGameRequest {
  game_id_bgg?: string
  game_name?: string
  game_description?: string
  game_image?: string
  has_characters?: boolean
  characters?: string
  min_players?: number
  max_players?: number
  supports_cooperative?: boolean
  supports_competitive?: boolean
  supports_campaign?: boolean
  default_mode?: string
}
