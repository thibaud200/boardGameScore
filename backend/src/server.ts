import express from 'express'
import { getAllPlayers, getPlayerById } from './services/playerService'
import {
  getAllGames,
  getGameById,
  createGame,
  updateGame,
  deleteGame
} from './services/gameService'
import { bggService } from './services/bggService'
import { externalGameDataService } from './services/externalGameDataService'
import GameTranslationService from './services/gameTranslationService'
import {
  getAllGameSessions,
  getGameSessionById,
  createGameSession,
  deleteGameSession,
  GameSessionInput,
  GameSessionRecord
} from './services/gameSessionService'
import LoggerService from './services/loggerService.js'
import {
  requestLoggingMiddleware,
  errorLoggingMiddleware,
  bggLoggingMiddleware
} from './middleware/loggingMiddleware.js'

const app = express()

// Middleware JSON parser
app.use(express.json())

// Middleware de logging (avant les autres middlewares)
app.use(requestLoggingMiddleware)
app.use(bggLoggingMiddleware)

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

// Initialiser le service de traduction
import database from './database.js'
const translationService = new GameTranslationService(database)
translationService.initializeDefaultTranslations()

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
  deleteCurrentGame,
  finishCurrentGameAsSession,
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

// Current Game routes (prioritaires)
app.get('/api/current-game', (req, res) => {
  const currentGame = getCurrentGame()
  if (currentGame) {
    res.json(currentGame)
  } else {
    res.json(null)
  }
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

app.delete('/api/current-game/:id', (req, res) => {
  try {
    console.log('DELETE /api/current-game/:id called with id:', req.params.id)
    deleteCurrentGame(Number(req.params.id))
    res.status(204).end()
  } catch (e) {
    console.error('Delete current game error:', e)
    res.status(400).json({ error: 'Delete failed', details: String(e) })
  }
})

app.post('/api/current-game/:id/finish', (req, res) => {
  try {
    console.log(
      'POST /api/current-game/:id/finish called with id:',
      req.params.id
    )
    const finalScores = req.body.scores || {}
    const result = finishCurrentGameAsSession(
      Number(req.params.id),
      finalScores
    )
    res.json({
      message: 'Partie terminée et session créée',
      sessionId: result.sessionId,
      gameData: result.gameData
    })
  } catch (e) {
    console.error('Finish current game error:', e)
    res.status(400).json({ error: 'Failed to finish game', details: String(e) })
  }
})

// Route de test
app.delete('/api/test-delete/:id', (req, res) => {
  console.log('Test DELETE route called with id:', req.params.id)
  res.json({ message: 'Test DELETE worked', id: req.params.id })
})

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
    const updated = updateGame(Number(req.params.id), req.body)
    res.json(updated)
  } catch (e) {
    res.status(400).json({ error: 'Update failed', details: String(e) })
  }
})

app.delete('/api/games/:id', (req, res) => {
  try {
    const gameId = Number(req.params.id)

    // Vérifier que le jeu existe
    const existingGame = getGameById(gameId)
    if (!existingGame) {
      return res.status(404).json({ error: 'Game not found' })
    }

    deleteGame(gameId)
    res.status(204).end()
  } catch (e) {
    res.status(500).json({ error: 'Delete failed', details: String(e) })
  }
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

// Route de test
app.delete('/api/test-delete/:id', (req, res) => {
  console.log('Test DELETE route called with id:', req.params.id)
  res.json({ message: 'Test DELETE worked', id: req.params.id })
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

app.get('/api/bgg/game/:id/extensions', async (req, res) => {
  try {
    const gameId = req.params.id
    const extensions = await bggService.getGameExtensions(gameId)
    res.json({
      gameId,
      extensionCount: extensions.length,
      extensions
    })
  } catch (error) {
    res
      .status(500)
      .json({ error: 'BGG extensions request failed', details: String(error) })
  }
})

app.post('/api/bgg/analyze/extensions', async (req, res) => {
  try {
    const { gameIds } = req.body

    if (!gameIds || !Array.isArray(gameIds) || gameIds.length === 0) {
      return res.status(400).json({
        error: 'gameIds array is required and must not be empty'
      })
    }

    // Limiter le nombre de jeux pour éviter les timeouts
    if (gameIds.length > 20) {
      return res.status(400).json({
        error: 'Maximum 20 games allowed for analysis'
      })
    }

    const analysis = await bggService.analyzeExtensionPatterns(gameIds)
    res.json(analysis)
  } catch (error) {
    res
      .status(500)
      .json({ error: 'BGG extension analysis failed', details: String(error) })
  }
})

app.post('/api/bgg/compare/extensions', async (req, res) => {
  try {
    const { gameIds } = req.body

    if (!gameIds || !Array.isArray(gameIds) || gameIds.length < 2) {
      return res.status(400).json({
        error: 'gameIds array is required and must contain at least 2 games'
      })
    }

    // Limiter le nombre de jeux pour éviter les timeouts
    if (gameIds.length > 10) {
      return res.status(400).json({
        error: 'Maximum 10 games allowed for comparison'
      })
    }

    const comparison = await bggService.compareGameExtensions(gameIds)
    res.json(comparison)
  } catch (error) {
    res.status(500).json({
      error: 'BGG extension comparison failed',
      details: String(error)
    })
  }
})

// Routes pour la recherche multilingue et données externes
app.get('/api/games/search', async (req, res) => {
  try {
    const query = req.query.q as string
    const language = (req.query.lang as string) || 'fr'
    const limit = parseInt(req.query.limit as string) || 10

    if (!query) {
      return res.status(400).json({ error: 'Query parameter required' })
    }

    const results = translationService.searchGames(query, language, limit)
    res.json({
      query,
      language,
      results
    })
  } catch (error) {
    res.status(500).json({
      error: 'Search failed',
      details: String(error)
    })
  }
})

app.get('/api/games/:id/external-data', async (req, res) => {
  try {
    const gameId = parseInt(req.params.id)

    // First, get the game from database to get its BGG ID
    const game = await getGameById(gameId)
    if (!game) {
      return res.status(404).json({ error: 'Game not found' })
    }

    if (!game.game_id_bgg) {
      return res.status(400).json({ error: 'Game has no BGG ID' })
    }

    const bggId = parseInt(game.game_id_bgg)
    if (!externalGameDataService.isGameSupported(bggId)) {
      return res.status(404).json({
        error: 'Game not supported for external data scraping',
        supportedGames: externalGameDataService.getSupportedGames()
      })
    }

    const externalData = await externalGameDataService.scrapeGameData(bggId)

    if (!externalData) {
      return res.status(404).json({
        error: 'No external data found for this game'
      })
    }

    res.json(externalData)
  } catch (error) {
    res.status(500).json({
      error: 'External data scraping failed',
      details: String(error)
    })
  }
})

app.get('/api/external/supported-games', async (req, res) => {
  try {
    const supportedGames = externalGameDataService.getSupportedGames()
    res.json({
      count: supportedGames.length,
      games: supportedGames,
      note: 'These games have external character/role data available for scraping'
    })
  } catch (error) {
    res.status(500).json({
      error: 'Failed to get supported games',
      details: String(error)
    })
  }
})

// Endpoint pour vérifier si un jeu BGG est supporté par le service externe
app.get('/api/external-game-data/support/:bggId', async (req, res) => {
  try {
    const bggId = parseInt(req.params.bggId)

    if (isNaN(bggId)) {
      return res.status(400).json({
        error: 'Invalid BGG ID'
      })
    }

    const isSupported = externalGameDataService.isGameSupported(bggId)

    res.json({
      isSupported,
      hasCharacters: isSupported, // Si supporté, c'est qu'il a des personnages
      bggId
    })
  } catch (error) {
    res.status(500).json({
      error: 'Failed to check game support',
      details: String(error)
    })
  }
})

app.post('/api/translations/init', async (req, res) => {
  try {
    translationService.initializeDefaultTranslations()
    res.json({
      message: 'Default translations initialized successfully',
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    res.status(500).json({
      error: 'Failed to initialize translations',
      details: String(error)
    })
  }
})

app.post('/api/bgg/import/:id', async (req, res) => {
  try {
    const gameId = req.params.id
    const bggGame = await bggService.getGameDetails(gameId)
    const gameData = await bggService.convertToGameFormat(bggGame)

    // Vérifier le support du service externe pour les personnages
    const externalSupport = externalGameDataService.isGameSupported(
      parseInt(gameId)
    )
    let externalCharacters = null

    if (externalSupport) {
      try {
        const externalData = await externalGameDataService.scrapeGameData(
          parseInt(gameId)
        )
        externalCharacters = externalData?.characters || null
      } catch (error) {
        LoggerService.warn('External character data fetch failed', {
          context: 'BGG_IMPORT',
          gameId: parseInt(gameId),
          error: error instanceof Error ? error.message : String(error)
        })
      }
    }

    // Créer le jeu de base (sans extensions ni personnages en JSON)
    const convertedData = {
      game_id_bgg: gameData.game_id_bgg || undefined,
      game_name: gameData.game_name,
      game_description: gameData.game_description || undefined,
      game_image: gameData.game_image || undefined,
      has_characters: externalSupport, // Utiliser le service externe, pas BGG
      min_players: gameData.min_players || undefined,
      max_players: gameData.max_players || undefined,
      supports_cooperative: gameData.supports_cooperative,
      supports_competitive: gameData.supports_competitive,
      supports_campaign: gameData.supports_campaign,
      default_mode: gameData.default_mode
    }

    // Créer le jeu dans notre base
    const created = createGame(convertedData)
    if (!created) {
      return res.status(500).json({ error: 'Failed to create game' })
    }
    const createdGameId = created.game_id

    // Ajouter les extensions dans la table dédiée
    let extensionsCreated = 0
    if (bggGame.extensions && bggGame.extensions.length > 0) {
      for (const extension of bggGame.extensions) {
        try {
          createGameExtension({
            extensions_name: extension.name,
            base_game_id: createdGameId,
            extensions_description: `Extension BGG ID: ${extension.id}`,
            is_active: true
          })
          extensionsCreated++
        } catch (error) {
          LoggerService.warn('Failed to create extension', {
            context: 'BGG_IMPORT',
            gameId: createdGameId,
            extensionName: extension.name,
            error: error instanceof Error ? error.message : String(error)
          })
        }
      }
    }

    // Ajouter les personnages dans la table dédiée
    let charactersCreated = 0
    if (externalCharacters && externalCharacters.length > 0) {
      for (const character of externalCharacters) {
        try {
          createGameCharacter({
            game_id: createdGameId,
            characters_name: character.name,
            characters_description: character.description || undefined,
            characters_abilities: character.abilities
              ? JSON.stringify(character.abilities)
              : undefined,
            characters_source: character.source || 'external_service',
            characters_external_id: undefined,
            class_type: undefined,
            is_active: true
          })
          charactersCreated++
        } catch (error) {
          LoggerService.warn('Failed to create character', {
            context: 'BGG_IMPORT',
            gameId: createdGameId,
            characterName: character.name,
            error: error instanceof Error ? error.message : String(error)
          })
        }
      }
    }

    res.status(201).json({
      game: created,
      import_details: {
        has_characters: externalSupport,
        character_source: externalSupport ? 'external_service' : 'none',
        characters_created: charactersCreated,
        extensions_count: bggGame.extensions?.length || 0,
        extensions_created: extensionsCreated,
        extensions_source: 'boardgamegeek'
      }
    })
  } catch (error) {
    res.status(500).json({ error: 'BGG import failed', details: String(error) })
  }
})

// Routes pour les statistiques
app.get('/api/stats/player/:id', (req, res) => {
  try {
    // Pour l'instant, retourner des stats par défaut
    // TODO: Implémenter la logique de calcul des stats
    const playerId = Number(req.params.id)
    const mockStats = {
      player_id: playerId,
      total_games_played: 0,
      total_wins: 0,
      total_losses: 0,
      total_score: 0,
      average_score: 0,
      last_game_date: null
    }
    res.json(mockStats)
  } catch (error) {
    res
      .status(500)
      .json({ error: 'Failed to get player stats', details: String(error) })
  }
})

app.get('/api/stats/game/:id', (req, res) => {
  try {
    // Pour l'instant, retourner des stats par défaut
    // TODO: Implémenter la logique de calcul des stats
    const gameId = Number(req.params.id)
    const mockStats = {
      game_id: gameId,
      total_games_played: 0,
      total_players: 0,
      total_score: 0,
      duration: null
    }
    res.json(mockStats)
  } catch (error) {
    res
      .status(500)
      .json({ error: 'Failed to get game stats', details: String(error) })
  }
})

app.get('/api/stats/game/:id/players', (req, res) => {
  try {
    // Pour l'instant, retourner un tableau vide
    // TODO: Implémenter la logique de récupération des stats des joueurs pour un jeu
    res.json([])
  } catch (error) {
    res.status(500).json({
      error: 'Failed to get players stats for game',
      details: String(error)
    })
  }
})

app.get('/api/stats/player/:id/games', (req, res) => {
  try {
    // Pour l'instant, retourner un tableau vide
    // TODO: Implémenter la logique de récupération des stats des jeux pour un joueur
    res.json([])
  } catch (error) {
    res.status(500).json({
      error: 'Failed to get games stats for player',
      details: String(error)
    })
  }
})

// Routes pour les sessions
app.get('/api/sessions', (req, res) => {
  try {
    res.json(getAllGameSessions())
  } catch (error) {
    res
      .status(500)
      .json({ error: 'Failed to get sessions', details: String(error) })
  }
})

app.get('/api/sessions/game/:gameId', (req, res) => {
  try {
    const gameId = Number(req.params.gameId)
    // Filtrer les sessions par jeu
    const allSessions = getAllGameSessions() as GameSessionRecord[]
    const gameSessions = allSessions.filter(
      (session: GameSessionRecord) => session.game_id === gameId
    )
    res.json(gameSessions)
  } catch (error) {
    res.status(500).json({
      error: 'Failed to get sessions for game',
      details: String(error)
    })
  }
})

app.get('/api/sessions/player/:playerId', (req, res) => {
  try {
    const playerId = Number(req.params.playerId)
    // Filtrer les sessions par joueur
    const allSessions = getAllGameSessions() as GameSessionRecord[]
    const playerSessions = allSessions.filter((session: GameSessionRecord) => {
      try {
        const players = JSON.parse(session.sessions_players || '[]')
        return players.includes(playerId)
      } catch {
        return false
      }
    })
    res.json(playerSessions)
  } catch (error) {
    res.status(500).json({
      error: 'Failed to get sessions for player',
      details: String(error)
    })
  }
})

// Middleware de gestion d'erreurs (doit être le dernier)
app.use(errorLoggingMiddleware)

app.listen(3001, () => {
  LoggerService.info('Server started successfully', {
    context: 'API_INTERNAL',
    port: 3001,
    environment: process.env.NODE_ENV || 'development'
  })
})
export default app
