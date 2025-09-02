import db from '../initDatabase'

export interface GameSessionInput {
  sessions_game_id: number
  is_cooperative?: number
  game_mode?: string
  sessions_players: string
  sessions_scores: string
  sessions_characters?: string
  sessions_extensions?: string
  sessions_winner?: number
  win_condition?: string
  sessions_date?: string
  sessions_duration?: string
  sessions_completed?: number
  sessions_coop_result?: string
  sessions_dead_characters?: string
  sessions_new_character_names?: string
  sessions_character_history?: string
}

export interface GameSessionRecord extends GameSessionInput {
  sessions_id: number
  game_id?: number // May be joined from games table
}

export function getAllGameSessions() {
  return db.prepare('SELECT * FROM game_sessions').all()
}

export function getGameSessionById(id: number) {
  return db.prepare('SELECT * FROM game_sessions WHERE sessions_id = ?').get(id)
}

export function createGameSession(data: GameSessionInput) {
  const stmt = db.prepare(`INSERT INTO game_sessions (
    sessions_game_id, is_cooperative, game_mode, sessions_players, sessions_scores, sessions_characters, sessions_extensions, sessions_winner, win_condition, sessions_date, sessions_duration, sessions_completed, sessions_coop_result, sessions_dead_characters, sessions_new_character_names, sessions_character_history
  ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`)
  const info = stmt.run(
    data.sessions_game_id,
    data.is_cooperative ?? 0,
    data.game_mode ?? 'competitive',
    data.sessions_players,
    data.sessions_scores,
    data.sessions_characters ?? null,
    data.sessions_extensions ?? null,
    data.sessions_winner ?? null,
    data.win_condition ?? null,
    data.sessions_date ?? null,
    data.sessions_duration ?? null,
    data.sessions_completed ?? 0,
    data.sessions_coop_result ?? null,
    data.sessions_dead_characters ?? null,
    data.sessions_new_character_names ?? null,
    data.sessions_character_history ?? null
  )
  return getGameSessionById(info.lastInsertRowid as number)
}

export function deleteGameSession(id: number) {
  return db.prepare('DELETE FROM game_sessions WHERE sessions_id = ?').run(id)
}
