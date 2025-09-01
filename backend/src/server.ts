import express from 'express'
import { getAllPlayers, getPlayerById } from './services/playerService'
import {
  getAllGames,
  getGameById,
  createGame,
  deleteGame
} from './services/gameService'
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

const app = express()
app.use(express.json())

app.get('/api/players', (req, res) => {
  res.json(getAllPlayers())
})

app.get('/api/players/:id', (req, res) => {
  const player = getPlayerById(Number(req.params.id))
  if (!player) return res.status(404).json({ error: 'Player not found' })
  res.json(player)
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

app.listen(3001, () => {
  console.log('Server running on port 3001')
})
