import db from '../database'

export function getAllPlayerStats() {
  return db.prepare('SELECT * FROM player_stats').all()
}

export function getPlayerStatsById(id: number) {
  return db.prepare('SELECT * FROM player_stats WHERE stat_id = ?').get(id)
}
