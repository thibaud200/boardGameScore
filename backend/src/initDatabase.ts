import Database from 'better-sqlite3'

const DB_PATH = 'backend/database/docs/database.db'

const db = new Database(DB_PATH)

// Schéma minimal, à compléter avec toutes les tables
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
` // Ajoute les autres tables ici

db.exec(schema)

console.log('Base de données initialisée avec le schéma.')
