# 🗄️ Structure de la Base de Données - Board Game Score Tracker v1.0.2

## 📊 Vue d'ensemble

Cette documentation décrit la structure actuelle de la base de données SQLite utilisée par l'application Board Game Score Tracker.

**Base de données** : `database/database.db` (production) + `database/test.db` (tests)  
**Type** : SQLite 3.x avec better-sqlite3  
**Version du schéma** : v1.0.2  
**Tests** : Infrastructure complète avec 33/33 tests réussissent ✅  
**Isolation** : Base de test séparée avec fixtures automatiques

## ⚠️ Contraintes Techniques Importantes

### 🔧 Gestion des Types SQLite

**SQLite ne supporte que** : `INTEGER`, `TEXT`, `REAL`, `BLOB`, `NULL`

#### Booléens
- **Stockage** : `INTEGER` avec valeurs 0 (false) ou 1 (true)
- **JavaScript** : Conversion automatique nécessaire
- **Backend** : `data.has_characters ? 1 : 0`

#### Valeurs Nulles
- **SQLite** : Accepte `NULL` uniquement
- **JavaScript** : Convertir `undefined` → `null`
- **Backend** : `data.game_description ?? null`

#### JSON
- **Stockage** : `TEXT` avec `JSON.stringify()`
- **Récupération** : `JSON.parse()` côté application
- **Exemples** : `sessions_players`, `sessions_scores`

## 📋 Tables Principales

### 1. 👥 `players` - Gestion des Joueurs

```sql
CREATE TABLE players (
    player_id INTEGER PRIMARY KEY,
    player_name TEXT NOT NULL UNIQUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

**Description** : Stockage des joueurs enregistrés dans l'application.

| Colonne       | Type     | Contraintes               | Description                  | JSON Format attendu |
| --------------| -------- | ------------------------- | ---------------------------- | --------------------|
| `player_id`   | INTEGER  | PRIMARY KEY               | Identifiant unique du joueur |                     |
| `player_name` | TEXT     | NOT NULL, UNIQUE          | Nom du joueur (unique)       |                     |
| `created_at`  | DATETIME | DEFAULT CURRENT_TIMESTAMP | Date de création             |                     |

### 2. 🎮 `game_sessions` - Sessions de Jeu Complétées

```sql
CREATE TABLE game_sessions (
    sessions_id INTEGER PRIMARY KEY,
    sessions_game_id INTEGER NOT NULL,
    is_cooperative INTEGER DEFAULT 0,
    sessions_game_mode TEXT DEFAULT 'competitive',
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
```

**Description** : Historique complet des parties terminées avec tous les détails.

| Colonne                      | Type     | Contraintes | Description                                | JSON Format attendu |
| ---------------------------- | -------- | ----------- | ------------------------------------------ | --------------------|
| `sessions_id`                | INTEGER  | PRIMARY KEY | Identifiant unique de la session           |                     |
| `sessions_game_id`           | INTEGER  | FOREIGN KEY | Id du jeu (mappé `games` frontend)         |                     |
| `is_cooperative`             | INTEGER  |             | 1 si coopératif, 0 sinon (legacy)          |                     |
| `sessions_game_mode`         | TEXT     |             | Mode de jeu : 'coop', 'compet', 'campaign' |                     |
| `sessions_players`           | TEXT     |             | JSON array des IDs de joueurs              | [player_id,player_id] |
| `sessions_scores`            | TEXT     |             | JSON object des scores par joueur          | {"player_id": <score>, "player_id": <score>} |
| `sessions_characters`        | TEXT     |             | JSON object des personnages assignés       | {"player_id": <character_id>, "player_id": <character_id>} |
| `sessions_extensions`        | TEXT     |             | JSON array ext :UI session, stats, joueur) | [extension_id,extension_id] |
| `sessions_winner`            | INTEGER  |             | ID du joueur gagnant (si compétitif)       |                     |
| `win_condition`              | TEXT     |             | Condition de victoire utilisée             |                     |
| `sessions_date`              | TEXT     |             | Date de la partie (format ISO)             |                     |
| `sessions_duration`          | TEXT     |             | Durée en minutes                           |                     |
| `sessions_completed`         | INTEGER  |             | 1 si terminée, 0 sinon                     |                     |
| `sessions_coop_result`       | TEXT     |             | 'won'/'lost' pour parties coopératives     |                     |
| `sessions_dead_characters`   | TEXT     |             | JSON object des personnages morts          | {"player_id": <character_id>, "player_id": <character_id>} |
| `sessions_new_character`     | TEXT     |             | JSON object des nouveaux noms              | {"player_id": <character_id>, "player_id": <character_id>} |
| `sessions_character_history` | TEXT     |             | JSON array de l'historique des événements  | [event1, event2]    |
| `created_at`                 | DATETIME |             | DEFAULT CURRENT_TIMESTAMP                  | Date création       |

### 3. 🎲 `games` - Templates de Jeux

```sql
CREATE TABLE games (
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
```

**Description** : jeux avec leurs caractéristiques.

⚠️ **Attention Types** : Les colonnes `BOOLEAN` sont stockées comme `INTEGER` (0/1) en SQLite.

| Colonne                | Type     | Contraintes | Description                           | Valeurs SQLite | JSON Format attendu |
| ---------------------- | -------- | ----------- | ------------------------------------- | -------------- | --------------------|
| `game_id`              | INTEGER  | PRIMARY KEY | Clé primaire auto-incrémentée         | 1, 2, 3...     |                     |
| `game_id_bgg`          | TEXT     |             | Identifiant BoardGameGeek (optionnel) | NULL ou "123"  |                     |
| `game_name`            | TEXT     |             | Nom du jeu (unique, non null)         | "Splendor"     |                     |
| `game_description`     | TEXT     |             | Description du jeu                    | NULL ou "..."  |                     |
| `game_image`           | TEXT     |             | URL ou chemin de l'image              | NULL ou URL    |                     |
| `has_characters`       | BOOLEAN  |             | **INTEGER**: 1 si le jeu a des personnages | 0 ou 1     |                     |
| `characters`           | TEXT     |             | Liste des personnages (JSON)          | NULL ou JSON   |                     |
| `min_players`          | INTEGER  |             | Nombre minimum de joueurs             | NULL ou 1-10   |                     |
| `max_players`          | INTEGER  |             | Nombre maximum de joueurs             | NULL ou 1-10   |                     |
| `supports_cooperative` | BOOLEAN  |             | **INTEGER**: 1 si supporte le mode coopératif | 0 ou 1  |                     |
| `supports_competitive` | BOOLEAN  |             | **INTEGER**: 1 si supporte le mode compétitif | 0 ou 1  |                     |
| `supports_campaign`    | BOOLEAN  |             | **INTEGER**: 1 si supporte le mode campagne   | 0 ou 1  |                     |
| `default_mode`         | TEXT     |             | Mode par défaut du jeu                | NULL ou "competitive" |            |
| `created_at`           | DATETIME |             | Date de création du template          | ISO timestamp  |                     |

### 4. 🎲 `game_characters`

```sql
CREATE TABLE game_characters (
    characters_id INTEGER PRIMARY KEY AUTOINCREMENT,
    game_id INTEGER NOT NULL,
    characters_name TEXT NOT NULL,
    characters_description TEXT,
    characters_abilities TEXT,
    characters_image_url TEXT,
    characters_source TEXT,
    characters_external_id TEXT,
    class_type TEXT,        -- Classe/Métier du personnage
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (game_id) REFERENCES games(game_id)
);
```

**Description** : personnages des jeux avec leurs caractéristiques.

| Colonne                  | Type     | Contraintes | Description                    | JSON Format attendu |
| ------------------------ | -------- | ----------- | ------------------------------ | --------------------|
| `characters_id`          | INTEGER  | PRIMARY KEY | Clé primaire auto-incrémentée  |                     |
| `game_id`                | INTEGER  | FOREIGN KEY | Référence du jeu               |                     |
| `characters_name`        | TEXT     | NOT NULL    | Nom du personnage              |                     |
| `characters_description` | TEXT     |             | Description du personnage      |                     |
| `characters_abilities`   | TEXT     |             | characteristique du personnage |                     |
| `characters_image_url`   | TEXT     |             | URL ou chemin de l'image       |                     |
| `characters_source`      | TEXT     |             | site de provenance             |                     |
| `characters_external_id` | TEXT     |             | id du site de provenance       |                     |
| `class_type`             | TEXT     |             | Classe du personnage           |                     |
| `created_at`             | DATETIME |             | Date de création du personnage |                     |

### 5. 🎲 `game_extensions`

```sql
CREATE TABLE game_extensions (
    extensions_id INTEGER PRIMARY KEY AUTOINCREMENT,
    extensions_name TEXT NOT NULL,
    base_game_id INTEGER NOT NULL,
    extensions_description TEXT,
    add_max_players INTEGER,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (base_game_id) REFERENCES games(game_id)
);
```

**Description** : Extension desjeux avec leurs caractéristiques.

| Colonne                  | Type     | Contraintes | Description                     | JSON Format attendu |
| ------------------------ | -------- | ----------- | ------------------------------- | --------------------|
| `extensions_id`          | INTEGER  | PRIMARY KEY | Clé primaire auto-incrémentée   |                     |
| `extensions_name`        | TEXT     | NOT NULL    | Nom du jeu                      |                     |
| `base_game_id`           | INTEGER  | FOREIGN KEY | Nom du jeu de base              |                     |
| `extensions_description` | TEXT     |             | Description de l'extension      |                     |
| `max_players`            | INTEGER  |             | Nombre maximum de joueurs       |                     |
| `created_at`             | DATETIME |             | Date de création de l'extension |                     |

### 4. ⚡ `current_game` - Partie en Cours

```sql
CREATE TABLE current_game (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    game_data TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

**Description** : Sauvegarde de l'état de la partie actuellement en cours.

| Colonne      | Type     | Contraintes | Description                            | JSON Format attendu |
| ------------ | -------- | ----------- | -------------------------------------- | --------------------|
| `id`         | INTEGER  | PRIMARY KEY | Toujours 1 (une seule partie en cours) |                     |
| `game_data`  | TEXT     | NOT NULL    | JSON complet de l'état de la partie    |                     |
| `created_at` | DATETIME |             | Date de création de la partie          |                     |
| `updated_at` | DATETIME |             | Dernière mise à jour                   |                     |

### 6. 📈 player_stats — Statistiques des joueurs

```sql
CREATE TABLE player_stats (
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
```

**Description** : Statistiques globales agrégées pour chaque joueur.

| Colonne              | Type     | Contraintes | Description                        | JSON Format attendu |
| -------------------- | -------- | ----------- | ---------------------------------- | --------------------|
| `stat_id`            | INTEGER  | PRIMARY KEY | Clé primaire auto-incrémentée      |                     |
| `player_id`          | INTEGER  | FOREIGN KEY | Référence au joueur                |                     |
| `total_games_played` | INTEGER  |             | Nombre total de parties jouées     |                     |
| `total_wins`         | INTEGER  |             | Nombre total de victoires          |                     |
| `total_losses`       | INTEGER  |             | Nombre total de défaites           |                     |
| `total_score`        | INTEGER  |             | Score cumulé                       |                     |
| `average_score`      | REAL     |             | Score moyen                        |                     |
| `last_game_date`     | DATETIME |             | Date de la dernière partie         |                     |
| `created_at`         | DATETIME |             | Date de création de la statistique |                     |

### 7. 📊 game_stats — Statistiques des parties

```sql
CREATE TABLE game_stats (
    stat_id INTEGER PRIMARY KEY AUTOINCREMENT,
    session_ids TEXT NOT NULL, -- JSON array des sessions concernées
    game_id INTEGER NOT NULL,
    duration INTEGER,
    total_players INTEGER,
    total_score INTEGER,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (game_id) REFERENCES games(game_id)
);
```

**Description** : Statistiques agrégées pour chaque session de jeu.

| Colonne         | Type     | Contraintes | Description                           | JSON Format attendu |
| --------------- | -------- | ----------- | ------------------------------------- | --------------------|
| `stat_id`       | INTEGER  | PRIMARY KEY | Clé primaire auto-incrémentée         |                     |
| `session_ids`   | TEXT     | NOT NULL    | JSON array des sessions agrégées      | [player_id,player_id] |
| `game_id`       | INTEGER  | FOREIGN KEY | Référence au jeu                      |                     |
| `duration`      | INTEGER  |             | Durée totale (minutes, agrégée)       |                     |
| `total_players` | INTEGER  |             | Nombre total de joueurs (agrégé)      |                     |
| `total_score`   | INTEGER  |             | Score total (agrégé)                  |                     |
| `created_at`    | DATETIME |             | Date de création de la statistique    |                     |

### 8. 📊 player_game_stats — Statistiques d’un joueur pour un jeu donné

```sql
CREATE TABLE player_game_stats (
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
```

**Description** : Statistiques d’un joueur pour un jeu donné.

| Colonne              | Type     | Contraintes | Description                           | JSON Format attendu |
| -------------------- | -------- | ----------- | ------------------------------------- | --------------------|
| `stat_id`            | INTEGER  | PRIMARY KEY | Clé primaire auto-incrémentée         |                     |
| `player_id`          | INTEGER  | FOREIGN KEY | Référence au joueur                   |                     |
| `game_id`            | INTEGER  | FOREIGN KEY | Référence au jeu                      |                     |
| `total_games_played` | INTEGER  |             | Nombre total de parties jouées        |                     |
| `total_wins`         | INTEGER  |             | Nombre total de victoires sur ce jeu  |                     |
| `total_losses`       | INTEGER  |             | Nombre de défaites sur ce jeu         |                     |
| `total_score`        | INTEGER  |             | Score cumulé sur ce jeu               |                     |
| `average_score`      | REAL     |             | Score moyen sur ce jeu                |                     |
| `last_game_date`     | DATETIME |             | Date de la dernière partie sur ce jeu |                     |
| `created_at`         | DATETIME |             | Date de création de la statistique    |                     |

## 🔄 Migrations Appliquées

### Migration 1 : Support Multi-Modes

## 📈 Relations et Index

### Relations Principales

- `game_sessions.players` → références vers `players.id` (JSON array)
- `game_sessions.game_type` → `game_templates.name`
- `game_sessions.winner` → `players.id`

### Index Recommandés

```sql
-- Performance pour les requêtes fréquentes
CREATE INDEX idx_characters_game_name ON game_characters(game_name);
CREATE INDEX idx_game_name ON games(game_name);
CREATE INDEX idx_extensions_base_game ON game_extensions(base_game_id);
CREATE INDEX idx_game_sessions_mode ON game_sessions(game_mode);
CREATE INDEX idx_game_sessions_date ON game_sessions(sessions_date);
CREATE INDEX idx_game_sessions_completed ON game_sessions(sessions_completed);
CREATE INDEX idx_player_stats_player_id ON player_stats(player_id);
CREATE INDEX idx_game_stats_game_id ON game_stats(game_id);
CREATE INDEX idx_game_stats_session_id ON game_stats(session_id);
CREATE INDEX idx_player_game_stats_player_id_game_id ON player_game_stats(player_id, game_id);
```

## 🚨 Limitations Actuelles et Évolutions Nécessaires

### ⚠️ Problèmes Identifiés

### 🔮 Structure Cible (Future)

## 🛠️ Scripts de Maintenance

### Sauvegarde

```bash
# Sauvegarde de la base
cp database/board-game-tracker.db database/backup-$(date +%Y%m%d).db
```

### Vérification d'Intégrité

```sql
-- Vérifier l'intégrité de la base
PRAGMA integrity_check;

-- Analyser les statistiques
ANALYZE;
```

### Nettoyage

```sql
-- Nettoyer les parties non terminées anciennes
DELETE FROM current_game WHERE created_at < datetime('now', '-7 days');

-- Vérifier les références orphelines
SELECT * FROM game_sessions
WHERE game_type NOT IN (SELECT name FROM game_templates);
```

## 📊 Statistiques de Données

### Requêtes Utiles

```sql
-- Nombre total de parties par jeu
SELECT g.game_name, COUNT(gs.sessions_id) AS total_games
FROM games g
LEFT JOIN game_sessions gs ON gs.sessions_game_id = g.game_id
WHERE gs.sessions_completed = 1
GROUP BY g.game_id, g.game_name
ORDER BY total_games DESC;

-- Joueurs les plus actifs
SELECT p.player_name, COUNT(gs.sessions_id) AS games_played
FROM players p
JOIN game_sessions gs ON gs.sessions_players LIKE '%' || p.player_id || '%'
WHERE gs.sessions_completed = 1
GROUP BY p.player_id, p.player_name
ORDER BY games_played DESC;

-- Durée moyenne par type de jeu
SELECT g.game_name,
       ROUND(AVG(CAST(gs.sessions_duration AS INTEGER)), 2) AS avg_duration_minutes
FROM games g
JOIN game_sessions gs ON gs.sessions_game_id = g.game_id
WHERE gs.sessions_completed = 1 AND gs.sessions_duration IS NOT NULL
GROUP BY g.game_id, g.game_name;

-- Score moyen par joueur
SELECT p.player_name,
       AVG(ps.average_score) AS avg_score
FROM players p
JOIN player_stats ps ON ps.player_id = p.player_id
GROUP BY p.player_id, p.player_name
ORDER BY avg_score DESC;

-- Statistiques d’un joueur pour un jeu donné
SELECT p.player_name, g.game_name, pgs.total_games_played, pgs.total_wins, pgs.total_losses, pgs.average_score
FROM player_game_stats pgs
JOIN players p ON pgs.player_id = p.player_id
JOIN games g ON pgs.game_id = g.game_id
ORDER BY p.player_name, g.game_name;
```

---

**📅 Dernière mise à jour** : 22 août 2025  
**📝 Version** : 1.0.1  
**🧪 Tests** : Infrastructure complète (52/52 tests ✅)  
**📊 État** : Base de données opérationnelle avec intégration BGG et validation complète  
**👨‍💻 Maintenance** : Équipe de développement Board Game Score Tracker
