export interface Player {
  player_id: number
  player_name: string
  nickname?: string
  color?: string
  avatar_url?: string
  stats_enabled?: boolean
  created_at: string
  updated_at: string
}
import db from '../initDatabase'

export function getAllPlayers() {
  return db.prepare('SELECT * FROM players').all()
}

export function getPlayerById(id: number) {
  return db.prepare('SELECT * FROM players WHERE player_id = ?').get(id)
}
