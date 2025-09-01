import db from '../database'

export function getAllGames() {
  return db.prepare('SELECT * FROM games').all()
}

export function getGameById(id: number) {
  return db.prepare('SELECT * FROM games WHERE game_id = ?').get(id)
}

export function createGame(data: {
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
}) {
  const stmt = db.prepare(`INSERT INTO games (
    game_id_bgg, game_name, game_description, game_image, has_characters, characters, min_players, max_players, supports_cooperative, supports_competitive, supports_campaign, default_mode
  ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`)
  const info = stmt.run(
    data.game_id_bgg ?? null,
    data.game_name,
    data.game_description ?? null,
    data.game_image ?? null,
    data.has_characters,
    data.characters ?? null,
    data.min_players ?? null,
    data.max_players ?? null,
    data.supports_cooperative ?? null,
    data.supports_competitive ?? null,
    data.supports_campaign ?? null,
    data.default_mode ?? null
  )
  return getGameById(info.lastInsertRowid as number)
}

export function deleteGame(id: number) {
  return db.prepare('DELETE FROM games WHERE game_id = ?').run(id)
}
