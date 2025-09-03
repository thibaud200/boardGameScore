import db from '../initDatabase'

export interface GameCharacterInput {
  game_id: number
  characters_name: string
  characters_description?: string
  characters_abilities?: string
  characters_image_url?: string
  characters_source?: string
  characters_external_id?: string
  class_type?: string
  color?: string
  avatar_url?: string
  role?: string
  version?: string
  stats?: string
  tags?: string
  equipment?: string
  is_active?: boolean
}

export function getAllGameCharacters() {
  return db.prepare('SELECT * FROM game_characters').all()
}

export function getGameCharacterById(id: number) {
  return db
    .prepare('SELECT * FROM game_characters WHERE characters_id = ?')
    .get(id)
}

export function createGameCharacter(data: GameCharacterInput) {
  const stmt = db.prepare(`INSERT INTO game_characters (
    game_id, characters_name, characters_description, characters_abilities, characters_image_url, characters_source, characters_external_id, class_type, color, avatar_url, role, version, stats, tags, equipment, is_active
  ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`)
  const info = stmt.run(
    data.game_id,
    data.characters_name,
    data.characters_description ?? null,
    data.characters_abilities ?? null,
    data.characters_image_url ?? null,
    data.characters_source ?? null,
    data.characters_external_id ?? null,
    data.class_type ?? null,
    data.color ?? null,
    data.avatar_url ?? null,
    data.role ?? null,
    data.version ?? null,
    data.stats ?? null,
    data.tags ?? null,
    data.equipment ?? null,
    data.is_active ? 1 : 0
  )
  return getGameCharacterById(info.lastInsertRowid as number)
}

export function deleteGameCharacter(id: number) {
  return db
    .prepare('DELETE FROM game_characters WHERE characters_id = ?')
    .run(id)
}
