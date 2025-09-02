export function deleteGameStats(statId: number) {
  return db.prepare('DELETE FROM game_stats WHERE stat_id = ?').run(statId)
}
export function updateGameStats(
  statId: number,
  {
    sessionIds,
    gameId,
    duration,
    totalPlayers,
    totalScore
  }: {
    sessionIds?: number[]
    gameId?: number
    duration?: number
    totalPlayers?: number
    totalScore?: number
  }
) {
  // Récupère l'existant
  const current = getGameStatsById(statId)
  if (!current) return null
  const stmt = db.prepare(`UPDATE game_stats SET
    session_ids = ?,
    game_id = ?,
    duration = ?,
    total_players = ?,
    total_score = ?
    WHERE stat_id = ?`)
  stmt.run(
    sessionIds
      ? JSON.stringify(sessionIds)
      : JSON.stringify(current.session_ids),
    gameId ?? current.game_id,
    duration ?? current.duration,
    totalPlayers ?? current.total_players,
    totalScore ?? current.total_score,
    statId
  )
  return getGameStatsById(statId)
}
import db from '../initDatabase'

export function getAllGameStats() {
  const stats = db.prepare('SELECT * FROM game_stats').all() as Array<{
    stat_id: number
    session_ids: string
    game_id: number
    duration: number | null
    total_players: number | null
    total_score: number | null
    created_at: string
  }>

  // Parse session_ids de JSON string vers array
  return stats.map((stat) => ({
    ...stat,
    session_ids: JSON.parse(stat.session_ids)
  }))
}

export function getGameStatsById(id: number) {
  const stat = db
    .prepare('SELECT * FROM game_stats WHERE stat_id = ?')
    .get(id) as
    | {
        stat_id: number
        session_ids: string
        game_id: number
        duration: number | null
        total_players: number | null
        total_score: number | null
        created_at: string
      }
    | undefined

  if (!stat) return undefined

  // Parse session_ids de JSON string vers array
  return {
    ...stat,
    session_ids: JSON.parse(stat.session_ids)
  }
}

export function insertGameStats({
  sessionIds,
  gameId,
  duration,
  totalPlayers,
  totalScore
}: {
  sessionIds: number[]
  gameId: number
  duration?: number
  totalPlayers?: number
  totalScore?: number
}) {
  const stmt = db.prepare(`INSERT INTO game_stats (
    session_ids, game_id, duration, total_players, total_score
  ) VALUES (?, ?, ?, ?, ?)`)
  const info = stmt.run(
    JSON.stringify(sessionIds),
    gameId,
    duration ?? null,
    totalPlayers ?? null,
    totalScore ?? null
  )
  return getGameStatsById(info.lastInsertRowid as number)
}
