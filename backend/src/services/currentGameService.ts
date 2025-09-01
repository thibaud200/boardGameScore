import db from '../database'

export interface CurrentGameInput {
  game_data: string
}

export function getCurrentGame() {
  return db
    .prepare('SELECT * FROM current_game ORDER BY updated_at DESC LIMIT 1')
    .get()
}

export function saveCurrentGame(data: CurrentGameInput) {
  const stmt = db.prepare(`INSERT INTO current_game (game_data) VALUES (?)`)
  stmt.run(data.game_data)
  return getCurrentGame()
}

export function updateCurrentGame(id: number, game_data: string) {
  const stmt = db.prepare(
    `UPDATE current_game SET game_data = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`
  )
  stmt.run(game_data, id)
  return getCurrentGame()
}
