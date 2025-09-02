import express from 'express'
import { getAllPlayers, getPlayerById } from './services/playerService'
import {
  getAllGames,
  getGameById,
  createGame,
  deleteGame
} from './services/gameService'
import { bggService } from './services/bggService'

const app = express()

// Configuration CORS pour permettre les requêtes depuis le frontend
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:5173')
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization')

  // Gérer les requêtes OPTIONS (preflight)
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200)
  }

  next()
})

app.use(express.json())
import {
  getAllGameSessions,
  getGameSessionById,
  createGameSession,
  deleteGameSession,
  GameSessionInput
} from './services/gameSessionService'
import {
  getAllGameCharacters,
  getGameCharacterById,
  createGameCharacter,
  deleteGameCharacter,
  GameCharacterInput
} from './services/gameCharacterService'
import {
  getAllGameExtensions,
  getGameExtensionById,
  createGameExtension,
  deleteGameExtension,
  GameExtensionInput
} from './services/gameExtensionService'
import {
  getCurrentGame,
  saveCurrentGame,
  updateCurrentGame,
  CurrentGameInput
} from './services/currentGameService'
import {
  getAllPlayerStats,
  getPlayerStatsById
} from './services/playerStatsService'
import { getAllGameStats, getGameStatsById } from './services/gameStatsService'
import {
  getAllPlayerGameStats,
  getPlayerGameStatsById
} from './services/playerGameStatsService'
import db from './initDatabase'

// Initialisation de la base de données
// db est utilisé pour l'initialisation

app.get('/api/players', (req, res) => {
  res.json(getAllPlayers())
})

app.get('/api/players/:id', (req, res) => {
  const player = getPlayerById(Number(req.params.id))
  if (!player) return res.status(404).json({ error: 'Player not found' })
  res.json(player)
})

app.post('/api/players', (req, res) => {
  try {
    const { player_name } = req.body
    if (!player_name)
      return res.status(400).json({ error: 'player_name is required' })
    const stmt = db.prepare(
      'INSERT INTO players (player_name, created_at) VALUES (?, ?)'
    )
    const info = stmt.run(player_name, new Date().toISOString())
    const created = db
      .prepare('SELECT * FROM players WHERE player_id = ?')
      .get(info.lastInsertRowid)
    res.status(201).json(created)
  } catch (e) {
    res.status(400).json({ error: 'Insert failed', details: String(e) })
  }
})

app.put('/api/players/:id', (req, res) => {
  try {
    const playerId = Number(req.params.id)
    const { player_name } = req.body

    if (!player_name) {
      return res.status(400).json({ error: 'player_name is required' })
    }

    // Vérifier que le joueur existe
    const existingPlayer = db
      .prepare('SELECT * FROM players WHERE player_id = ?')
      .get(playerId)

    if (!existingPlayer) {
      return res.status(404).json({ error: 'Player not found' })
    }

    // Mettre à jour le joueur
    const stmt = db.prepare(
      'UPDATE players SET player_name = ? WHERE player_id = ?'
    )
    stmt.run(player_name, playerId)

    // Récupérer le joueur mis à jour
    const updated = db
      .prepare('SELECT * FROM players WHERE player_id = ?')
      .get(playerId)

    res.json(updated)
  } catch (e) {
    res.status(400).json({ error: 'Update failed', details: String(e) })
  }
})

app.delete('/api/players/:id', (req, res) => {
  try {
    const playerId = Number(req.params.id)

    // Vérifier que le joueur existe
    const existingPlayer = db
      .prepare('SELECT * FROM players WHERE player_id = ?')
      .get(playerId)

    if (!existingPlayer) {
      return res.status(404).json({ error: 'Player not found' })
    }

    // Supprimer le joueur
    const stmt = db.prepare('DELETE FROM players WHERE player_id = ?')
    const info = stmt.run(playerId)

    if (info.changes === 0) {
      return res.status(404).json({ error: 'Player not found' })
    }

    res.status(204).send()
  } catch (e) {
    res.status(400).json({ error: 'Delete failed', details: String(e) })
  }
})

// Games
app.get('/api/games', (req, res) => {
  res.json(getAllGames())
})
app.get('/api/games/:id', (req, res) => {
  const game = getGameById(Number(req.params.id))
  if (!game) return res.status(404).json({ error: 'Game not found' })
  res.json(game)
})
app.post('/api/games', (req, res) => {
  try {
    const created = createGame(req.body)
    res.status(201).json(created)
  } catch (e) {
    res.status(400).json({ error: 'Invalid game data', details: String(e) })
  }
})

app.put('/api/games/:id', (req, res) => {
  try {
    const gameId = Number(req.params.id)

    // Vérifier que le jeu existe
    const existingGame = db
      .prepare('SELECT * FROM games WHERE game_id = ?')
      .get(gameId)

    if (!existingGame) {
      return res.status(404).json({ error: 'Game not found' })
    }

    // Mettre à jour le jeu
    const {
      game_id_bgg,
      game_name,
      game_description,
      game_image,
      has_characters,
      characters,
      min_players,
      max_players,
      supports_cooperative,
      supports_competitive,
      supports_campaign,
      default_mode
    } = req.body

    const stmt = db.prepare(`
      UPDATE games SET 
        game_id_bgg = COALESCE(?, game_id_bgg),
        game_name = COALESCE(?, game_name),
        game_description = COALESCE(?, game_description),
        game_image = COALESCE(?, game_image),
        has_characters = COALESCE(?, has_characters),
        characters = COALESCE(?, characters),
        min_players = COALESCE(?, min_players),
        max_players = COALESCE(?, max_players),
        supports_cooperative = COALESCE(?, supports_cooperative),
        supports_competitive = COALESCE(?, supports_competitive),
        supports_campaign = COALESCE(?, supports_campaign),
        default_mode = COALESCE(?, default_mode)
      WHERE game_id = ?
    `)

    stmt.run(
      game_id_bgg,
      game_name,
      game_description,
      game_image,
      has_characters ? 1 : 0,
      characters,
      min_players,
      max_players,
      supports_cooperative ? 1 : 0,
      supports_competitive ? 1 : 0,
      supports_campaign ? 1 : 0,
      default_mode,
      gameId
    )

    // Récupérer le jeu mis à jour
    const updated = db
      .prepare('SELECT * FROM games WHERE game_id = ?')
      .get(gameId)

    res.json(updated)
  } catch (e) {
    res.status(400).json({ error: 'Update failed', details: String(e) })
  }
})

app.delete('/api/games/:id', (req, res) => {
  deleteGame(Number(req.params.id))
  res.status(204).end()
})

// Game Sessions
app.get('/api/game-sessions', (req, res) => {
  res.json(getAllGameSessions())
})
app.get('/api/game-sessions/:id', (req, res) => {
  const session = getGameSessionById(Number(req.params.id))
  if (!session) return res.status(404).json({ error: 'Session not found' })
  res.json(session)
})
app.post('/api/game-sessions', (req, res) => {
  try {
    const input: GameSessionInput = req.body
    const created = createGameSession(input)
    res.status(201).json(created)
  } catch (e) {
    res.status(400).json({ error: 'Invalid session data', details: String(e) })
  }
})
app.delete('/api/game-sessions/:id', (req, res) => {
  deleteGameSession(Number(req.params.id))
  res.status(204).end()
})

// Game Characters
app.get('/api/game-characters', (req, res) => {
  res.json(getAllGameCharacters())
})
app.get('/api/game-characters/:id', (req, res) => {
  const character = getGameCharacterById(Number(req.params.id))
  if (!character) return res.status(404).json({ error: 'Character not found' })
  res.json(character)
})
app.post('/api/game-characters', (req, res) => {
  try {
    const input: GameCharacterInput = req.body
    const created = createGameCharacter(input)
    res.status(201).json(created)
  } catch (e) {
    res
      .status(400)
      .json({ error: 'Invalid character data', details: String(e) })
  }
})
app.delete('/api/game-characters/:id', (req, res) => {
  deleteGameCharacter(Number(req.params.id))
  res.status(204).end()
})

// Game Extensions
app.get('/api/game-extensions', (req, res) => {
  res.json(getAllGameExtensions())
})
app.get('/api/game-extensions/:id', (req, res) => {
  const ext = getGameExtensionById(Number(req.params.id))
  if (!ext) return res.status(404).json({ error: 'Extension not found' })
  res.json(ext)
})
app.post('/api/game-extensions', (req, res) => {
  try {
    const input: GameExtensionInput = req.body
    const created = createGameExtension(input)
    res.status(201).json(created)
  } catch (e) {
    res
      .status(400)
      .json({ error: 'Invalid extension data', details: String(e) })
  }
})
app.delete('/api/game-extensions/:id', (req, res) => {
  deleteGameExtension(Number(req.params.id))
  res.status(204).end()
})

// Current Game
app.get('/api/current-game', (req, res) => {
  res.json(getCurrentGame())
})
app.post('/api/current-game', (req, res) => {
  try {
    const input: CurrentGameInput = req.body
    const created = saveCurrentGame(input)
    res.status(201).json(created)
  } catch (e) {
    res
      .status(400)
      .json({ error: 'Invalid current game data', details: String(e) })
  }
})
app.put('/api/current-game/:id', (req, res) => {
  try {
    const updated = updateCurrentGame(Number(req.params.id), req.body.game_data)
    res.json(updated)
  } catch (e) {
    res.status(400).json({ error: 'Update failed', details: String(e) })
  }
})

// Player Stats
app.get('/api/player-stats', (req, res) => {
  res.json(getAllPlayerStats())
})
app.get('/api/player-stats/:id', (req, res) => {
  const stat = getPlayerStatsById(Number(req.params.id))
  if (!stat) return res.status(404).json({ error: 'Player stat not found' })
  res.json(stat)
})

// Game Stats
app.get('/api/game-stats', (req, res) => {
  res.json(getAllGameStats())
})
app.get('/api/game-stats/:id', (req, res) => {
  const stat = getGameStatsById(Number(req.params.id))
  if (!stat) return res.status(404).json({ error: 'Game stat not found' })
  res.json(stat)
})

// Player Game Stats
app.get('/api/player-game-stats', (req, res) => {
  res.json(getAllPlayerGameStats())
})
app.get('/api/player-game-stats/:id', (req, res) => {
  const stat = getPlayerGameStatsById(Number(req.params.id))
  if (!stat)
    return res.status(404).json({ error: 'Player game stat not found' })
  res.json(stat)
})

// BGG Integration Routes
app.get('/api/bgg/search', async (req, res) => {
  try {
    const query = req.query.q as string
    if (!query) {
      return res.status(400).json({ error: 'Query parameter required' })
    }

    const results = await bggService.searchGames(query)
    res.json(results)
  } catch (error) {
    res.status(500).json({ error: 'BGG search failed', details: String(error) })
  }
})

app.get('/api/bgg/game/:id', async (req, res) => {
  try {
    const gameId = req.params.id
    const gameDetails = await bggService.getGameDetails(gameId)
    res.json(gameDetails)
  } catch (error) {
    res
      .status(500)
      .json({ error: 'BGG game details failed', details: String(error) })
  }
})

app.post('/api/bgg/import/:id', async (req, res) => {
  try {
    const gameId = req.params.id
    const bggGame = await bggService.getGameDetails(gameId)
    const gameData = bggService.convertToGameFormat(bggGame)

    // Convertir null vers undefined pour compatibilité avec createGame
    const convertedData = {
      game_id_bgg: gameData.game_id_bgg || undefined,
      game_name: gameData.game_name,
      game_description: gameData.game_description || undefined,
      game_image: gameData.game_image || undefined,
      has_characters: gameData.has_characters,
      characters: gameData.characters || undefined,
      min_players: gameData.min_players || undefined,
      max_players: gameData.max_players || undefined,
      supports_cooperative: gameData.supports_cooperative,
      supports_competitive: gameData.supports_competitive,
      supports_campaign: gameData.supports_campaign,
      default_mode: gameData.default_mode
    }

    // Créer le jeu dans notre base
    const created = createGame(convertedData)
    res.status(201).json(created)
  } catch (error) {
    res.status(500).json({ error: 'BGG import failed', details: String(error) })
  }
})

app.listen(3001, () => {
  console.log('Server running on port 3001')
})
export default app
