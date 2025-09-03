import db from '../initDatabase'

export interface GameExtensionInput {
  extensions_name: string
  base_game_id: number
  extensions_description?: string
  add_max_players?: number
  year_published?: number
  image_url?: string
  thumbnail?: string
  publisher?: string
  designer?: string
  artist?: string
  category?: string
  mechanic?: string
  family?: string
  stats?: string
  tags?: string
  is_active?: boolean
}

export function getAllGameExtensions() {
  return db.prepare('SELECT * FROM game_extensions').all()
}

export function getGameExtensionById(id: number) {
  return db
    .prepare('SELECT * FROM game_extensions WHERE extensions_id = ?')
    .get(id)
}

export function createGameExtension(data: GameExtensionInput) {
  const stmt = db.prepare(`INSERT INTO game_extensions (
    extensions_name, base_game_id, extensions_description, add_max_players, year_published, image_url, thumbnail, publisher, designer, artist, category, mechanic, family, stats, tags, is_active
  ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`)
  const info = stmt.run(
    data.extensions_name,
    data.base_game_id,
    data.extensions_description ?? null,
    data.add_max_players ?? null,
    data.year_published ?? null,
    data.image_url ?? null,
    data.thumbnail ?? null,
    data.publisher ?? null,
    data.designer ?? null,
    data.artist ?? null,
    data.category ?? null,
    data.mechanic ?? null,
    data.family ?? null,
    data.stats ?? null,
    data.tags ?? null,
    data.is_active ? 1 : 0
  )
  return getGameExtensionById(info.lastInsertRowid as number)
}

export function deleteGameExtension(id: number) {
  return db
    .prepare('DELETE FROM game_extensions WHERE extensions_id = ?')
    .run(id)
}
