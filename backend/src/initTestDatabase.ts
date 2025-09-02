import Database from 'better-sqlite3'
import fs from 'fs'

const TEST_DB_PATH = 'backend/database/test.db'

// Supprime l’ancienne base de test si elle existe
if (fs.existsSync(TEST_DB_PATH)) {
  fs.unlinkSync(TEST_DB_PATH)
}

const db = new Database(TEST_DB_PATH)

const schema = `

CREATE TABLE IF NOT EXISTS players (
  player_id INTEGER PRIMARY KEY,
  player_name TEXT NOT NULL UNIQUE,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS games (
  game_id INTEGER PRIMARY KEY AUTOINCREMENT,
  game_id_bgg TEXT,
  game_name TEXT UNIQUE NOT NULL,
  game_description TEXT,
  game_image TEXT,
  has_characters BOOLEAN NOT NULL,
  characters TEXT,
  min_players INTEGER,
  max_players INTEGER,
  supports_cooperative BOOLEAN,
  supports_competitive BOOLEAN,
  supports_campaign BOOLEAN,
  default_mode TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS game_sessions (
  sessions_id INTEGER PRIMARY KEY,
  sessions_game_id INTEGER NOT NULL,
  is_cooperative INTEGER DEFAULT 0,
  game_mode TEXT DEFAULT 'competitive',
  sessions_players TEXT NOT NULL,
  sessions_scores TEXT NOT NULL,
  sessions_characters TEXT,
  sessions_extensions TEXT,
  sessions_winner INTEGER,
  win_condition TEXT,
  sessions_date TEXT,
  sessions_duration TEXT,
  sessions_completed INTEGER DEFAULT 0,
  sessions_coop_result TEXT,
  sessions_dead_characters TEXT,
  sessions_new_character_names TEXT,
  sessions_character_history TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (sessions_game_id) REFERENCES games(game_id),
  FOREIGN KEY (sessions_winner) REFERENCES players(player_id)
);

CREATE TABLE IF NOT EXISTS game_characters (
  characters_id INTEGER PRIMARY KEY AUTOINCREMENT,
  game_id INTEGER NOT NULL,
  characters_name TEXT NOT NULL,
  characters_description TEXT,
  characters_abilities TEXT,
  characters_image_url TEXT,
  characters_source TEXT,
  characters_external_id TEXT,
  class_type TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (game_id) REFERENCES games(game_id)
);

CREATE TABLE IF NOT EXISTS game_extensions (
  extensions_id INTEGER PRIMARY KEY AUTOINCREMENT,
  extensions_name TEXT NOT NULL,
  base_game_id INTEGER NOT NULL,
  extensions_description TEXT,
  add_max_players INTEGER,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (base_game_id) REFERENCES games(game_id)
);

CREATE TABLE IF NOT EXISTS current_game (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  game_data TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS player_stats (
  stat_id INTEGER PRIMARY KEY AUTOINCREMENT,
  player_id INTEGER NOT NULL,
  total_games_played INTEGER DEFAULT 0,
  total_wins INTEGER DEFAULT 0,
  total_losses INTEGER DEFAULT 0,
  total_score INTEGER DEFAULT 0,
  average_score REAL DEFAULT 0,
  last_game_date DATETIME,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (player_id) REFERENCES players(player_id)
);

CREATE TABLE IF NOT EXISTS game_stats (
  stat_id INTEGER PRIMARY KEY AUTOINCREMENT,
  session_ids TEXT NOT NULL, -- JSON array des sessions concernées
  game_id INTEGER NOT NULL,
  duration INTEGER,
  total_players INTEGER,
  total_score INTEGER,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (game_id) REFERENCES games(game_id)
);

CREATE TABLE IF NOT EXISTS player_game_stats (
  stat_id INTEGER PRIMARY KEY AUTOINCREMENT,
  player_id INTEGER NOT NULL,
  game_id INTEGER NOT NULL,
  total_games_played INTEGER DEFAULT 0,
  total_wins INTEGER DEFAULT 0,
  total_losses INTEGER DEFAULT 0,
  total_score INTEGER DEFAULT 0,
  average_score REAL DEFAULT 0,
  last_game_date DATETIME,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (player_id) REFERENCES players(player_id),
  FOREIGN KEY (game_id) REFERENCES games(game_id)
);
` // Ajoute les autres tables ici

db.exec(schema)

console.log('Base de test initialisée avec le schéma.')
