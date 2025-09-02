import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { CurrentGameService } from '../services/currentGameService'
import { PlayersService } from '../services/playersService'
import { GamesService } from '../services/gamesService'
import type {
  CurrentGame,
  CurrentGameData,
  Player,
  Game,
  CreateCurrentGameRequest
} from '../types'

export default function CurrentGamePage() {
  const navigate = useNavigate()
  const [currentGame, setCurrentGame] = useState<CurrentGame | null>(null)
  const [gameData, setGameData] = useState<CurrentGameData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // États pour créer une nouvelle partie
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [players, setPlayers] = useState<Player[]>([])
  const [games, setGames] = useState<Game[]>([])
  const [selectedGameId, setSelectedGameId] = useState<number | null>(null)
  const [selectedPlayerIds, setSelectedPlayerIds] = useState<number[]>([])
  const [selectedMode, setSelectedMode] = useState('competitive')

  useEffect(() => {
    loadCurrentGame()
    loadPlayersAndGames()
  }, [])

  const loadCurrentGame = async () => {
    try {
      setLoading(true)
      setError(null)
      const game = await CurrentGameService.getCurrentGame()
      setCurrentGame(game)

      if (game) {
        const parsedData = CurrentGameService.parseGameData(game.game_data)

        // Enrichir les données avec les vraies informations des joueurs
        if (parsedData.players && parsedData.players.length > 0) {
          try {
            const allPlayers = await PlayersService.getAllPlayers()
            const enrichedPlayers = parsedData.players.map((p) => {
              const fullPlayer = allPlayers.find(
                (player) => player.player_id === p.player_id
              )
              return fullPlayer || p
            })
            parsedData.players = enrichedPlayers
          } catch (err) {
            console.warn('Impossible de charger les détails des joueurs:', err)
          }
        }

        setGameData(parsedData)
      }
    } catch (err) {
      setError('Erreur lors du chargement de la partie en cours')
      console.error('Erreur:', err)
    } finally {
      setLoading(false)
    }
  }

  const loadPlayersAndGames = async () => {
    try {
      const [playersData, gamesData] = await Promise.all([
        PlayersService.getAllPlayers(),
        GamesService.getAllGames()
      ])
      setPlayers(playersData)
      setGames(gamesData)
    } catch (err) {
      console.error('Erreur chargement données:', err)
    }
  }

  const handleCreateGame = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedGameId || selectedPlayerIds.length === 0) return

    try {
      setError(null)
      const gameRequest: CreateCurrentGameRequest = {
        game_id: selectedGameId,
        players: selectedPlayerIds,
        game_mode: selectedMode
      }

      const newGame = await CurrentGameService.startGame(gameRequest)
      setCurrentGame(newGame)

      const parsedData = CurrentGameService.parseGameData(newGame.game_data)

      // Enrichir avec les vraies données des joueurs
      if (parsedData.players && parsedData.players.length > 0) {
        const enrichedPlayers = parsedData.players.map((p) => {
          const fullPlayer = players.find(
            (player) => player.player_id === p.player_id
          )
          return fullPlayer || p
        })
        parsedData.players = enrichedPlayers
      }

      // Enrichir avec les données du jeu
      const selectedGame = games.find((g) => g.game_id === selectedGameId)
      if (selectedGame) {
        parsedData.game_name = selectedGame.game_name
      }

      setGameData(parsedData)

      setShowCreateForm(false)
      resetForm()
    } catch (err) {
      setError('Erreur lors de la création de la partie')
      console.error('Erreur:', err)
    }
  }

  const handleFinishGame = async () => {
    if (!currentGame || !gameData) return

    if (window.confirm('Êtes-vous sûr de vouloir terminer cette partie ?')) {
      try {
        setError(null)

        // Créer des scores par défaut pour les joueurs (0 pour tous)
        const defaultScores: { [key: number]: number } = {}
        if (gameData.players) {
          gameData.players.forEach((player) => {
            defaultScores[player.player_id] = 0
          })
        }

        // Terminer la partie et créer la session
        const result = await CurrentGameService.finishCurrentGame(
          currentGame.id,
          defaultScores
        )
        console.log('Partie terminée, session créée:', result)

        setCurrentGame(null)
        setGameData(null)

        // Rediriger vers l'historique des sessions
        navigate('/sessions')
      } catch (err) {
        setError('Erreur lors de la finalisation de la partie')
        console.error('Erreur:', err)
      }
    }
  }

  const handleCancelGame = async () => {
    if (!currentGame) return

    if (
      window.confirm(
        'Êtes-vous sûr de vouloir annuler cette partie ? Toutes les données seront perdues.'
      )
    ) {
      try {
        setError(null)
        await CurrentGameService.cancelCurrentGame(currentGame.id)
        setCurrentGame(null)
        setGameData(null)
      } catch (err) {
        setError("Erreur lors de l'annulation de la partie")
        console.error('Erreur:', err)
      }
    }
  }

  const resetForm = () => {
    setSelectedGameId(null)
    setSelectedPlayerIds([])
    setSelectedMode('competitive')
  }

  const handlePlayerToggle = (playerId: number) => {
    setSelectedPlayerIds((prev) =>
      prev.includes(playerId)
        ? prev.filter((id) => id !== playerId)
        : [...prev, playerId]
    )
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-96">
        <div className="text-lg">Chargement...</div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Partie en Cours</h1>
        {!currentGame && (
          <button
            onClick={() => setShowCreateForm(true)}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
          >
            🎮 Nouvelle Partie
          </button>
        )}
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      {/* Aucune partie en cours */}
      {!currentGame && !showCreateForm && (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <div className="text-6xl mb-4">🎲</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Aucune partie en cours
          </h2>
          <p className="text-gray-600 mb-6">
            Démarrez une nouvelle partie pour commencer à jouer !
          </p>
          <button
            onClick={() => setShowCreateForm(true)}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
          >
            🎮 Créer une nouvelle partie
          </button>
        </div>
      )}

      {/* Formulaire de création */}
      {showCreateForm && (
        <div className="bg-white border border-gray-200 rounded-lg p-6 mb-8 shadow-sm">
          <h2 className="text-xl font-semibold mb-4">
            Créer une nouvelle partie
          </h2>

          <form onSubmit={handleCreateGame} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Choisir un jeu *
              </label>
              <select
                value={selectedGameId || ''}
                onChange={(e) =>
                  setSelectedGameId(
                    e.target.value ? Number(e.target.value) : null
                  )
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              >
                <option value="">Sélectionner un jeu</option>
                {games.map((game) => (
                  <option key={game.game_id} value={game.game_id}>
                    {game.game_name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mode de jeu
              </label>
              <select
                value={selectedMode}
                onChange={(e) => setSelectedMode(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="competitive">Compétitif</option>
                <option value="cooperative">Coopératif</option>
                <option value="campaign">Campagne</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sélectionner les joueurs * ({selectedPlayerIds.length}{' '}
                sélectionné{selectedPlayerIds.length > 1 ? 's' : ''})
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-48 overflow-y-auto border border-gray-300 rounded-md p-3">
                {players.map((player) => (
                  <label key={player.player_id} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={selectedPlayerIds.includes(player.player_id)}
                      onChange={() => handlePlayerToggle(player.player_id)}
                      className="mr-2"
                    />
                    <span className="text-sm">{player.player_name}</span>
                  </label>
                ))}
              </div>
              {selectedPlayerIds.length === 0 && (
                <p className="text-red-500 text-sm mt-1">
                  Au moins un joueur doit être sélectionné
                </p>
              )}
            </div>

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => {
                  setShowCreateForm(false)
                  resetForm()
                }}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
              >
                Annuler
              </button>
              <button
                type="submit"
                disabled={!selectedGameId || selectedPlayerIds.length === 0}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 transition-colors"
              >
                🎮 Démarrer la partie
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Partie en cours */}
      {currentGame && gameData && (
        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                🎮 {gameData.game_name}
              </h2>
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <span className="flex items-center">
                  <span className="font-medium">Mode:</span>
                  <span className="ml-1 px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">
                    {gameData.current_mode === 'competitive'
                      ? 'Compétitif'
                      : gameData.current_mode === 'cooperative'
                        ? 'Coopératif'
                        : 'Campagne'}
                  </span>
                </span>
                <span>
                  <span className="font-medium">Démarrée:</span>{' '}
                  {new Date(gameData.started_at).toLocaleString('fr-FR')}
                </span>
                {gameData.current_round && (
                  <span>
                    <span className="font-medium">Tour:</span>{' '}
                    {gameData.current_round}
                  </span>
                )}
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={handleFinishGame}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                ✅ Terminer
              </button>
              <button
                onClick={handleCancelGame}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
              >
                ❌ Annuler
              </button>
            </div>
          </div>

          {/* Joueurs participants */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-3">
              👥 Joueurs ({gameData.players?.length || 0})
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {(gameData.players || []).map((player) => (
                <div
                  key={player.player_id}
                  className="bg-gray-50 rounded-lg p-3 text-center"
                >
                  <div className="font-medium">{player.player_name}</div>
                </div>
              ))}
            </div>
          </div>

          {/* État du jeu */}
          {gameData.game_state && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-3">
                🎯 État de la partie
              </h3>
              <div className="bg-gray-50 rounded-lg p-4">
                <pre className="text-sm text-gray-700 whitespace-pre-wrap">
                  {JSON.stringify(gameData.game_state, null, 2)}
                </pre>
              </div>
            </div>
          )}

          {/* Actions de partie */}
          <div className="border-t pt-4">
            <p className="text-sm text-gray-600 mb-3">
              💡 <strong>Conseil:</strong> Utilisez cette page pour suivre
              l&apos;état de votre partie. Une fois terminée, les résultats
              seront automatiquement sauvegardés dans l&apos;historique.
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => navigate('/sessions')}
                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
              >
                📊 Voir l&apos;historique des parties
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
