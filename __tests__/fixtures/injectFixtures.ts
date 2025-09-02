/**
 * Injecte uniquement les données de la table players
 */
import type { Database } from 'better-sqlite3'
import { playersFixture } from './players.fixture'
import { gamesFixture } from './games.fixture'
import { gameSessionsFixture } from './game_sessions.fixture'
import { gameCharactersFixture } from './game_characters.fixture'
import { gameExtensionsFixture } from './game_extensions.fixture'
import { playerStatsFixture } from './player_stats.fixture'
import { gameStatsFixture } from './game_stats.fixture'
import { playerGameStatsFixture } from './player_game_stats.fixture'
import { currentGameFixture } from './current_game.fixture'

export function injectCurrentGameFixture(db: Database) {
  db.prepare('DELETE FROM current_game').run()
  for (const current of currentGameFixture) {
    db.prepare(
      `INSERT INTO current_game (
        id, game_data, created_at, updated_at) VALUES (?, ?, ?, ?)`
    ).run(
      current.id,
      Array.isArray(current.game_data) || typeof current.game_data === 'object'
        ? JSON.stringify(current.game_data)
        : current.game_data,
      current.created_at,
      current.updated_at
    )
  }
}
export function injectPlayersFixture(db: Database) {
  // Ne pas supprimer ici car wipeAllFixtures s'en charge déjà
  for (const player of playersFixture) {
    db.prepare(
      'INSERT INTO players (player_id, player_name, created_at) VALUES (?, ?, ?)'
    ).run(
      Array.isArray(player.player_id) || typeof player.player_id === 'object'
        ? JSON.stringify(player.player_id)
        : player.player_id,
      Array.isArray(player.player_name) ||
        typeof player.player_name === 'object'
        ? JSON.stringify(player.player_name)
        : player.player_name,
      Array.isArray(player.created_at) || typeof player.created_at === 'object'
        ? JSON.stringify(player.created_at)
        : player.created_at
    )
  }
}
export function injectGamesFixture(db: Database) {
  // Ne pas supprimer ici car wipeAllFixtures s'en charge déjà
  for (const game of gamesFixture) {
    db.prepare(
      `INSERT INTO games (
      game_id, game_id_bgg, game_name, game_description, game_image, has_characters,
      characters, min_players, max_players, supports_cooperative, supports_competitive,
      supports_campaign, default_mode, created_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    ).run(
      game.game_id,
      game.game_id_bgg,
      game.game_name,
      game.game_description,
      game.game_image,
      typeof game.has_characters === 'boolean'
        ? game.has_characters
          ? 1
          : 0
        : game.has_characters,
      Array.isArray(game.characters) || typeof game.characters === 'object'
        ? JSON.stringify(game.characters)
        : game.characters,
      game.min_players,
      game.max_players,
      typeof game.supports_cooperative === 'boolean'
        ? game.supports_cooperative
          ? 1
          : 0
        : game.supports_cooperative,
      typeof game.supports_competitive === 'boolean'
        ? game.supports_competitive
          ? 1
          : 0
        : game.supports_competitive,
      typeof game.supports_campaign === 'boolean'
        ? game.supports_campaign
          ? 1
          : 0
        : game.supports_campaign,
      Array.isArray(game.default_mode) || typeof game.default_mode === 'object'
        ? JSON.stringify(game.default_mode)
        : game.default_mode,
      game.created_at
    )
  }
}
export function injectGameCharactersFixture(db: Database) {
  db.prepare('DELETE FROM game_characters').run()
  for (const character of gameCharactersFixture) {
    db.prepare(
      `INSERT INTO game_characters (
      characters_id, game_id, characters_name, characters_description, characters_abilities, characters_image_url, characters_source, characters_external_id, class_type, created_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    ).run(
      character.characters_id,
      character.game_id,
      character.characters_name,
      character.characters_description,
      character.characters_abilities,
      character.characters_image_url,
      character.characters_source,
      character.characters_external_id,
      character.class_type,
      character.created_at
    )
  }
}
export function injectGameExtensionsFixture(db: Database) {
  db.prepare('DELETE FROM game_extensions').run()
  for (const ext of gameExtensionsFixture) {
    db.prepare(
      `INSERT INTO game_extensions (
      extensions_id, extensions_name, base_game_id, extensions_description, add_max_players, created_at
    ) VALUES (?, ?, ?, ?, ?, ?)`
    ).run(
      ext.extensions_id,
      ext.extensions_name,
      ext.base_game_id,
      Array.isArray(ext.extensions_description) ||
        typeof ext.extensions_description === 'object'
        ? JSON.stringify(ext.extensions_description)
        : ext.extensions_description,
      ext.add_max_players,
      ext.created_at
    )
  }
}

export function injectGameSessionsFixture(db: Database) {
  db.prepare('DELETE FROM game_sessions').run()
  for (const session of gameSessionsFixture) {
    db.prepare(
      `INSERT INTO game_sessions (
      sessions_id, sessions_game_id, is_cooperative, game_mode, sessions_players, sessions_scores,
      sessions_characters, sessions_extensions, sessions_winner, win_condition, sessions_date,
      sessions_duration, sessions_completed, sessions_coop_result, sessions_dead_characters,
      sessions_new_character_names, sessions_character_history, created_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    ).run(
      session.sessions_id,
      session.sessions_game_id,
      session.is_cooperative,
      session.game_mode,
      Array.isArray(session.sessions_players)
        ? JSON.stringify(session.sessions_players)
        : session.sessions_players,
      Array.isArray(session.sessions_scores)
        ? JSON.stringify(session.sessions_scores)
        : session.sessions_scores,
      Array.isArray(session.sessions_characters)
        ? JSON.stringify(session.sessions_characters)
        : session.sessions_characters,
      Array.isArray(session.sessions_extensions)
        ? JSON.stringify(session.sessions_extensions)
        : session.sessions_extensions,
      session.sessions_winner,
      session.win_condition,
      session.sessions_date,
      session.sessions_duration,
      session.sessions_completed,
      session.sessions_coop_result,
      Array.isArray(session.sessions_dead_characters)
        ? JSON.stringify(session.sessions_dead_characters)
        : session.sessions_dead_characters,
      Array.isArray(session.sessions_new_character_names)
        ? JSON.stringify(session.sessions_new_character_names)
        : session.sessions_new_character_names,
      Array.isArray(session.sessions_character_history)
        ? JSON.stringify(session.sessions_character_history)
        : session.sessions_character_history,
      session.created_at
    )
  }
}
export function injectGameStatsFixture(db: Database) {
  db.prepare('DELETE FROM game_stats').run()
  for (const stat of gameStatsFixture) {
    db.prepare(
      `INSERT INTO game_stats (
      stat_id, session_ids, game_id, duration, total_players, total_score, created_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?)`
    ).run(
      Array.isArray(stat.stat_id) || typeof stat.stat_id === 'object'
        ? JSON.stringify(stat.stat_id)
        : stat.stat_id,
      JSON.stringify(stat.session_ids),
      Array.isArray(stat.game_id) || typeof stat.game_id === 'object'
        ? JSON.stringify(stat.game_id)
        : stat.game_id,
      Array.isArray(stat.duration) || typeof stat.duration === 'object'
        ? JSON.stringify(stat.duration)
        : stat.duration,
      Array.isArray(stat.total_players) ||
        typeof stat.total_players === 'object'
        ? JSON.stringify(stat.total_players)
        : stat.total_players,
      Array.isArray(stat.total_score) || typeof stat.total_score === 'object'
        ? JSON.stringify(stat.total_score)
        : stat.total_score,
      Array.isArray(stat.created_at) || typeof stat.created_at === 'object'
        ? JSON.stringify(stat.created_at)
        : stat.created_at
    )
  }
}
export function injectPlayerStatsFixture(db: Database) {
  db.prepare('DELETE FROM player_stats').run()
  for (const stat of playerStatsFixture) {
    db.prepare(
      `INSERT INTO player_stats (
      stat_id, player_id, total_games_played, total_wins, total_losses, total_score,
      average_score, last_game_date, created_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
    ).run(
      Array.isArray(stat.stat_id) || typeof stat.stat_id === 'object'
        ? JSON.stringify(stat.stat_id)
        : stat.stat_id,
      Array.isArray(stat.player_id) || typeof stat.player_id === 'object'
        ? JSON.stringify(stat.player_id)
        : stat.player_id,
      Array.isArray(stat.total_games_played) ||
        typeof stat.total_games_played === 'object'
        ? JSON.stringify(stat.total_games_played)
        : stat.total_games_played,
      Array.isArray(stat.total_wins) || typeof stat.total_wins === 'object'
        ? JSON.stringify(stat.total_wins)
        : stat.total_wins,
      Array.isArray(stat.total_losses) || typeof stat.total_losses === 'object'
        ? JSON.stringify(stat.total_losses)
        : stat.total_losses,
      Array.isArray(stat.total_score) || typeof stat.total_score === 'object'
        ? JSON.stringify(stat.total_score)
        : stat.total_score,
      Array.isArray(stat.average_score) ||
        typeof stat.average_score === 'object'
        ? JSON.stringify(stat.average_score)
        : stat.average_score,
      Array.isArray(stat.last_game_date) ||
        typeof stat.last_game_date === 'object'
        ? JSON.stringify(stat.last_game_date)
        : stat.last_game_date,
      Array.isArray(stat.created_at) || typeof stat.created_at === 'object'
        ? JSON.stringify(stat.created_at)
        : stat.created_at
    )
  }
}
export function injectPlayerGameStatsFixture(db: Database) {
  db.prepare('DELETE FROM player_game_stats').run()
  for (const stat of playerGameStatsFixture) {
    db.prepare(
      `INSERT INTO player_game_stats (
      stat_id, player_id, game_id, total_games_played, total_wins, total_losses,
      total_score, average_score, last_game_date, created_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    ).run(
      Array.isArray(stat.stat_id) || typeof stat.stat_id === 'object'
        ? JSON.stringify(stat.stat_id)
        : stat.stat_id,
      Array.isArray(stat.player_id) || typeof stat.player_id === 'object'
        ? JSON.stringify(stat.player_id)
        : stat.player_id,
      Array.isArray(stat.game_id) || typeof stat.game_id === 'object'
        ? JSON.stringify(stat.game_id)
        : stat.game_id,
      Array.isArray(stat.total_games_played) ||
        typeof stat.total_games_played === 'object'
        ? JSON.stringify(stat.total_games_played)
        : stat.total_games_played,
      Array.isArray(stat.total_wins) || typeof stat.total_wins === 'object'
        ? JSON.stringify(stat.total_wins)
        : stat.total_wins,
      Array.isArray(stat.total_losses) || typeof stat.total_losses === 'object'
        ? JSON.stringify(stat.total_losses)
        : stat.total_losses,
      Array.isArray(stat.total_score) || typeof stat.total_score === 'object'
        ? JSON.stringify(stat.total_score)
        : stat.total_score,
      Array.isArray(stat.average_score) ||
        typeof stat.average_score === 'object'
        ? JSON.stringify(stat.average_score)
        : stat.average_score,
      Array.isArray(stat.last_game_date) ||
        typeof stat.last_game_date === 'object'
        ? JSON.stringify(stat.last_game_date)
        : stat.last_game_date,
      Array.isArray(stat.created_at) || typeof stat.created_at === 'object'
        ? JSON.stringify(stat.created_at)
        : stat.created_at
    )
  }
}
/**
 * Injection complète dans l'ordre correct
 */
export function wipeAllFixtures(db: Database) {
  // Désactiver temporairement les contraintes FK pour TOUT le processus
  db.pragma('foreign_keys = OFF')

  // Vider toutes les tables pour éviter les doublons
  db.prepare('DELETE FROM player_game_stats').run()
  db.prepare('DELETE FROM player_stats').run()
  db.prepare('DELETE FROM game_stats').run()
  db.prepare('DELETE FROM game_sessions').run()
  db.prepare('DELETE FROM game_extensions').run()
  db.prepare('DELETE FROM game_characters').run()
  db.prepare('DELETE FROM games').run()
  db.prepare('DELETE FROM players').run()
  db.prepare('DELETE FROM current_game').run()
  db.prepare('DELETE FROM sqlite_sequence').run()

  // Injection dans le bon ordre (toujours avec FK OFF)
  injectPlayersFixture(db)
  injectGamesFixture(db)

  injectGameCharactersFixture(db)
  injectGameExtensionsFixture(db)

  injectGameSessionsFixture(db)

  injectPlayerStatsFixture(db)
  injectPlayerGameStatsFixture(db)
  injectGameStatsFixture(db)

  injectCurrentGameFixture(db)

  // SEULEMENT maintenant réactiver les FK
  db.pragma('foreign_keys = ON')
}
