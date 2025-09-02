import db from '../initDatabase'

export interface GameExtensionInput {
  extensions_name: string
  base_game_id: number
  extensions_description?: string
  add_max_players?: number
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
    extensions_name, base_game_id, extensions_description, add_max_players
  ) VALUES (?, ?, ?, ?)`)
  const info = stmt.run(
    data.extensions_name,
    data.base_game_id,
    data.extensions_description ?? null,
    data.add_max_players ?? null
  )
  return getGameExtensionById(info.lastInsertRowid as number)
}

export function deleteGameExtension(id: number) {
  return db
    .prepare('DELETE FROM game_extensions WHERE extensions_id = ?')
    .run(id)
}
