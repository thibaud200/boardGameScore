import db from '../initDatabase'

export function getAllPlayers() {
  return db.prepare('SELECT * FROM players').all()
}

export function getPlayerById(id: number) {
  return db.prepare('SELECT * FROM players WHERE player_id = ?').get(id)
}
