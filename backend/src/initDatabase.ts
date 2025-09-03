import Database from 'better-sqlite3'

const isTestEnv =
  process.env.VITEST ||
  process.env.JEST_WORKER_ID ||
  process.env.NODE_ENV === 'test'

const env = isTestEnv
  ? 'test'
  : process.env.DB_ENV || process.env.NODE_ENV || 'production'

const dbFile =
  env === 'test' ? 'backend/database/test.db' : 'backend/database/database.db'

// Sécurise l'accès : en mode test, interdit toute base autre que test.db
if (env === 'test' && dbFile !== 'backend/database/test.db') {
  throw new Error(
    'Environnement de test : accès à une base non test.db interdit !'
  )
}

const db = new Database(dbFile)

export default db

// Schéma minimal, à compléter avec toutes les tables
const schema = `

CREATE TABLE IF NOT EXISTS players (
  player_id INTEGER PRIMARY KEY,
  player_name TEXT NOT NULL UNIQUE,
  nickname TEXT,
  color TEXT,
  avatar_url TEXT,
  stats_enabled BOOLEAN DEFAULT 1,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS games (
  game_id INTEGER PRIMARY KEY AUTOINCREMENT,
  game_id_bgg TEXT,
  game_name TEXT UNIQUE NOT NULL,
  game_description TEXT,
  game_image TEXT,
  thumbnail TEXT,
  year_published INTEGER,
  min_players INTEGER,
  max_players INTEGER,
  playing_time INTEGER,
  min_play_time INTEGER,
  max_play_time INTEGER,
  age INTEGER,
  has_characters BOOLEAN NOT NULL,
  characters TEXT,
  supports_cooperative BOOLEAN,
  supports_competitive BOOLEAN,
  supports_campaign BOOLEAN,
  default_mode TEXT,
  publisher TEXT,
  designer TEXT,
  artist TEXT,
  category TEXT,
  mechanic TEXT,
  family TEXT,
  expansions TEXT,
  accessories TEXT,
  polls TEXT,
  stats TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
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
  class_type TEXT,
  color TEXT,
  avatar_url TEXT,
  characters_image_url TEXT,
  characters_source TEXT,
  characters_external_id TEXT,
  role TEXT,
  version TEXT,
  stats TEXT,
  tags TEXT,
  equipment TEXT,
  is_active BOOLEAN DEFAULT 1,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (game_id) REFERENCES games(game_id)
);

CREATE TABLE IF NOT EXISTS game_extensions (
  extensions_id INTEGER PRIMARY KEY AUTOINCREMENT,
  extensions_name TEXT NOT NULL,
  base_game_id INTEGER NOT NULL,
  extensions_description TEXT,
  add_max_players INTEGER,
  year_published INTEGER,
  image_url TEXT,
  thumbnail TEXT,
  publisher TEXT,
  designer TEXT,
  artist TEXT,
  category TEXT,
  mechanic TEXT,
  family TEXT,
  stats TEXT,
  tags TEXT,
  is_active BOOLEAN DEFAULT 1,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (base_game_id) REFERENCES games(game_id)
);

CREATE TABLE IF NOT EXISTS current_game (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  game_id INTEGER NOT NULL,
  is_cooperative INTEGER DEFAULT 0,
  game_mode TEXT DEFAULT 'competitive',
  players TEXT NOT NULL,
  scores TEXT NOT NULL,
  characters TEXT,
  extensions TEXT,
  winner INTEGER,
  win_condition TEXT,
  date TEXT,
  duration TEXT,
  completed INTEGER DEFAULT 0,
  coop_result TEXT,
  dead_characters TEXT,
  new_character_names TEXT,
  character_history TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (game_id) REFERENCES games(game_id),
  FOREIGN KEY (winner) REFERENCES players(player_id)
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
`

db.exec(schema)

console.log('Base de données initialisée avec le schéma.')
