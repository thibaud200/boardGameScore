import db from '../initDatabase'

interface GameRecord {
  game_id: number
  game_id_bgg?: string | null
  game_name: string
  game_description?: string | null
  game_image?: string | null
  has_characters: boolean
  min_players?: number | null
  max_players?: number | null
  supports_cooperative?: boolean | null
  supports_competitive?: boolean | null
  supports_campaign?: boolean | null
  default_mode?: string | null
  created_at: string
}

export function getAllGames(): GameRecord[] {
  return db.prepare('SELECT * FROM games').all() as GameRecord[]
}

export function getGameById(id: number): GameRecord | undefined {
  return db.prepare('SELECT * FROM games WHERE game_id = ?').get(id) as
    | GameRecord
    | undefined
}

export function createGame(data: {
  game_id_bgg?: string
  game_name: string
  game_description?: string
  game_image?: string
  thumbnail?: string
  year_published?: number
  min_players?: number
  max_players?: number
  playing_time?: number
  min_play_time?: number
  max_play_time?: number
  age?: number
  has_characters: boolean
  supports_cooperative?: boolean
  supports_competitive?: boolean
  supports_campaign?: boolean
  default_mode?: string
  publisher?: string
  designer?: string
  artist?: string
  category?: string
  mechanic?: string
  family?: string
  accessories?: string
  polls?: string
  stats?: string
}) {
  const stmt = db.prepare(`INSERT INTO games (
    game_id_bgg, game_name, game_description, game_image, thumbnail, year_published, min_players, max_players, playing_time, min_play_time, max_play_time, age, has_characters, supports_cooperative, supports_competitive, supports_campaign, default_mode, publisher, designer, artist, category, mechanic, family, accessories, polls, stats
  ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`)
  const info = stmt.run(
    data.game_id_bgg ?? null,
    data.game_name,
    data.game_description ?? null,
    data.game_image ?? null,
    data.thumbnail ?? null,
    data.year_published ?? null,
    data.min_players ?? null,
    data.max_players ?? null,
    data.playing_time ?? null,
    data.min_play_time ?? null,
    data.max_play_time ?? null,
    data.age ?? null,
    data.has_characters ? 1 : 0,
    data.supports_cooperative ? 1 : 0,
    data.supports_competitive ? 1 : 0,
    data.supports_campaign ? 1 : 0,
    data.default_mode ?? null,
    data.publisher ?? null,
    data.designer ?? null,
    data.artist ?? null,
    data.category ?? null,
    data.mechanic ?? null,
    data.family ?? null,
    data.accessories ?? null,
    data.polls ?? null,
    data.stats ?? null
  )
  return getGameById(info.lastInsertRowid as number)
}

export function deleteGame(id: number) {
  return db.prepare('DELETE FROM games WHERE game_id = ?').run(id)
}

export function updateGame(
  id: number,
  data: {
    game_id_bgg?: string
    game_name: string
    game_description?: string
    game_image?: string
    thumbnail?: string
    year_published?: number
    min_players?: number
    max_players?: number
    playing_time?: number
    min_play_time?: number
    max_play_time?: number
    age?: number
    has_characters: boolean
    supports_cooperative?: boolean
    supports_competitive?: boolean
    supports_campaign?: boolean
    default_mode?: string
    publisher?: string
    designer?: string
    artist?: string
    category?: string
    mechanic?: string
    family?: string
    accessories?: string
    polls?: string
    stats?: string
  }
) {
  const stmt = db.prepare(`UPDATE games SET
    game_id_bgg = ?,
    game_name = ?,
    game_description = ?,
    game_image = ?,
    thumbnail = ?,
    year_published = ?,
    min_players = ?,
    max_players = ?,
    playing_time = ?,
    min_play_time = ?,
    max_play_time = ?,
    age = ?,
    has_characters = ?,
    supports_cooperative = ?,
    supports_competitive = ?,
    supports_campaign = ?,
    default_mode = ?,
    publisher = ?,
    designer = ?,
    artist = ?,
    category = ?,
    mechanic = ?,
    family = ?,
    accessories = ?,
    polls = ?,
    stats = ?,
    updated_at = CURRENT_TIMESTAMP
  WHERE game_id = ?`)
  stmt.run(
    data.game_id_bgg ?? null,
    data.game_name,
    data.game_description ?? null,
    data.game_image ?? null,
    data.thumbnail ?? null,
    data.year_published ?? null,
    data.min_players ?? null,
    data.max_players ?? null,
    data.playing_time ?? null,
    data.min_play_time ?? null,
    data.max_play_time ?? null,
    data.age ?? null,
    data.has_characters ? 1 : 0,
    data.supports_cooperative ? 1 : 0,
    data.supports_competitive ? 1 : 0,
    data.supports_campaign ? 1 : 0,
    data.default_mode ?? null,
    data.publisher ?? null,
    data.designer ?? null,
    data.artist ?? null,
    data.category ?? null,
    data.mechanic ?? null,
    data.family ?? null,
    data.accessories ?? null,
    data.polls ?? null,
    data.stats ?? null,
    id
  )
  return getGameById(id)
}
