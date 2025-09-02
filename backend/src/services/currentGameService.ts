import db from '../initDatabase'

export interface CurrentGameInput {
  game_data: string
}

export interface CurrentGameRecord {
  id: number
  game_data: string
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
  // Si aucune partie en cours, retourner null plutôt qu'undefined
  return result || null
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

  // 2. Parser les données de la partie
  const gameData = JSON.parse(currentGame.game_data)

  // 3. Créer la session dans game_sessions
  const sessionStmt = db.prepare(`
    INSERT INTO game_sessions (
      sessions_game_id,
      game_mode,
      sessions_players,
      sessions_scores,
      sessions_date,
      sessions_completed
    ) VALUES (?, ?, ?, ?, ?, ?)
  `)

  // Préparer les données de la session
  const sessionPlayers = JSON.stringify(gameData.players || [])
  const sessionScores = JSON.stringify(finalScores || {})
  const sessionDate = new Date().toISOString()

  const sessionResult = sessionStmt.run(
    gameData.game_id,
    gameData.game_mode || 'competitive',
    sessionPlayers,
    sessionScores,
    sessionDate,
    1 // sessions_completed = 1
  )

  // 4. Supprimer la partie en cours
  deleteCurrentGame(id)

  // 5. Retourner les infos de la session créée
  return {
    sessionId: sessionResult.lastInsertRowid,
    gameData: gameData
  }
}
