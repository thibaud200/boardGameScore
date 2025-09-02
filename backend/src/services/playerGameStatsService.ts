import db from '../initDatabase'

export function getAllPlayerGameStats() {
  return db.prepare('SELECT * FROM player_game_stats').all()
}

export function getPlayerGameStatsById(id: number) {
  return db.prepare('SELECT * FROM player_game_stats WHERE stat_id = ?').get(id)
}
