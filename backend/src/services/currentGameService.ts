import db from '../initDatabase'

export interface CurrentGameInput {
  game_id: number
  is_cooperative?: boolean
  game_mode?: string
  players: string
  scores: string
  characters?: string
  extensions?: string
  winner?: number
  win_condition?: string
  date?: string
  duration?: string
  completed?: boolean
  coop_result?: string
  dead_characters?: string
  new_character_names?: string
  character_history?: string
}

export interface CurrentGameRecord {
  id: number
  game_id: number
  is_cooperative: boolean
  game_mode: string
  players: string
  scores: string
  characters?: string
  extensions?: string
  winner?: number
  win_condition?: string
  date?: string
  duration?: string
  completed?: boolean
  coop_result?: string
  dead_characters?: string
  new_character_names?: string
  character_history?: string
  created_at: string
  updated_at: string
}

export interface FinalScores {
  [playerId: string]: number
}

export function getCurrentGame() {
  const result = db
    .prepare('SELECT * FROM current_game ORDER BY updated_at DESC LIMIT 1')
    .get()
  return result || null
}

export function saveCurrentGame(data: CurrentGameInput) {
  const stmt = db.prepare(`INSERT INTO current_game (
    game_id, is_cooperative, game_mode, players, scores, characters, extensions, winner, win_condition, date, duration, completed, coop_result, dead_characters, new_character_names, character_history
  ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`)
  stmt.run(
    data.game_id,
    data.is_cooperative ? 1 : 0,
    data.game_mode ?? 'competitive',
    data.players,
    data.scores,
    data.characters ?? null,
    data.extensions ?? null,
    data.winner ?? null,
    data.win_condition ?? null,
    data.date ?? new Date().toISOString(),
    data.duration ?? null,
    data.completed ? 1 : 0,
    data.coop_result ?? null,
    data.dead_characters ?? null,
    data.new_character_names ?? null,
    data.character_history ?? null
  )
  return getCurrentGame()
}

// Pour simplifier, on attend un objet CurrentGameInput
// (on peut adapter pour un patch partiel si besoin)
// Ici, on met à jour tous les champs sauf id/created_at
export function updateCurrentGame(id: number, data: CurrentGameInput) {
  const stmt = db.prepare(`UPDATE current_game SET
    game_id = ?,
    is_cooperative = ?,
    game_mode = ?,
    players = ?,
    scores = ?,
    characters = ?,
    extensions = ?,
    winner = ?,
    win_condition = ?,
    date = ?,
    duration = ?,
    completed = ?,
    coop_result = ?,
    dead_characters = ?,
    new_character_names = ?,
    character_history = ?,
    updated_at = CURRENT_TIMESTAMP
    WHERE id = ?`)
  stmt.run(
    data.game_id,
    data.is_cooperative ? 1 : 0,
    data.game_mode ?? 'competitive',
    data.players,
    data.scores,
    data.characters ?? null,
    data.extensions ?? null,
    data.winner ?? null,
    data.win_condition ?? null,
    data.date ?? new Date().toISOString(),
    data.duration ?? null,
    data.completed ? 1 : 0,
    data.coop_result ?? null,
    data.dead_characters ?? null,
    data.new_character_names ?? null,
    data.character_history ?? null,
    id
  )
  return getCurrentGame()
}

export function deleteCurrentGame(id: number) {
  const stmt = db.prepare(`DELETE FROM current_game WHERE id = ?`)
  return stmt.run(id)
}

export function finishCurrentGameAsSession(
  id: number,
  finalScores?: FinalScores
) {
  // 1. Récupérer la partie en cours
  const currentGame = db
    .prepare('SELECT * FROM current_game WHERE id = ?')
    .get(id) as CurrentGameRecord
  if (!currentGame) {
    throw new Error('Partie en cours introuvable')
  }

  // 2. Créer la session dans game_sessions
  const sessionStmt = db.prepare(`
    INSERT INTO game_sessions (
      sessions_game_id,
      is_cooperative,
      game_mode,
      sessions_players,
      sessions_scores,
      sessions_characters,
      sessions_extensions,
      sessions_winner,
      win_condition,
      sessions_date,
      sessions_duration,
      sessions_completed,
      sessions_coop_result,
      sessions_dead_characters,
      sessions_new_character_names,
      sessions_character_history
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `)

  const sessionResult = sessionStmt.run(
    currentGame.game_id,
    currentGame.is_cooperative ? 1 : 0,
    currentGame.game_mode,
    currentGame.players,
    finalScores ? JSON.stringify(finalScores) : currentGame.scores,
    currentGame.characters ?? null,
    currentGame.extensions ?? null,
    currentGame.winner ?? null,
    currentGame.win_condition ?? null,
    currentGame.date ?? new Date().toISOString(),
    currentGame.duration ?? null,
    1, // sessions_completed = 1
    currentGame.coop_result ?? null,
    currentGame.dead_characters ?? null,
    currentGame.new_character_names ?? null,
    currentGame.character_history ?? null
  )

  // 3. Supprimer la partie en cours
  deleteCurrentGame(id)

  // 4. Retourner les infos de la session créée
  return {
    sessionId: sessionResult.lastInsertRowid,
    gameData: currentGame
  }
}
