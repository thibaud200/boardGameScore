import db from '../database'

export function getAllGameStats() {
  return db.prepare('SELECT * FROM game_stats').all()
}

export function getGameStatsById(id: number) {
  return db.prepare('SELECT * FROM game_stats WHERE stat_id = ?').get(id)
}
