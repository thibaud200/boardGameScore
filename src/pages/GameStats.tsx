import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { StatsService } from '../services/statsService'
import { GamesService } from '../services/gamesService'
import { PlayersService } from '../services/playersService'
import type { GameStats, PlayerGameStats, Game, Player } from '../types'

export default function GameStatsPage() {
  const { gameId } = useParams()
  const navigate = useNavigate()

  const [game, setGame] = useState<Game | null>(null)
  const [gameStats, setGameStats] = useState<GameStats | null>(null)
  const [playerStats, setPlayerStats] = useState<PlayerGameStats[]>([])
  const [players, setPlayers] = useState<Player[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (gameId) {
      loadGameStats(Number(gameId))
    }
  }, [gameId])

  const loadGameStats = async (id: number) => {
    try {
      setLoading(true)
      setError(null)

      const [gameData, statsData, playerStatsData, playersData] =
        await Promise.all([
          GamesService.getGameById(id),
          StatsService.getGameStats(id),
          StatsService.getAllPlayersStatsForGame(id),
          PlayersService.getAllPlayers()
        ])

      setGame(gameData)
      setGameStats(statsData)
      setPlayerStats(playerStatsData)
      setPlayers(playersData)
    } catch (err) {
      setError('Erreur lors du chargement des statistiques')
      console.error('Erreur:', err)
    } finally {
      setLoading(false)
    }
  }

  const getPlayerName = (playerId: number): string => {
    const player = players.find((p) => p.player_id === playerId)
    return player?.player_name || `Joueur ${playerId}`
  }

  const getBestPlayer = (): PlayerGameStats | null => {
    if (playerStats.length === 0) return null
    return playerStats.reduce((best, current) => {
      const currentWinRate =
        current.total_games_played > 0
          ? (current.total_wins / current.total_games_played) * 100
          : 0
      const bestWinRate =
        best.total_games_played > 0
          ? (best.total_wins / best.total_games_played) * 100
          : 0
      return currentWinRate > bestWinRate ? current : best
    })
  }

  const getMostActivePlayer = (): PlayerGameStats | null => {
    if (playerStats.length === 0) return null
    return playerStats.reduce((most, current) =>
      current.total_games_played > most.total_games_played ? current : most
    )
  }

  const getHighestScorer = (): PlayerGameStats | null => {
    if (playerStats.length === 0) return null
    return playerStats.reduce((highest, current) =>
      current.average_score > highest.average_score ? current : highest
    )
  }

  const getTotalPlayers = (): number => {
    return playerStats.length
  }

  const getTotalGames = (): number => {
    return playerStats.reduce(
      (total, stats) => total + stats.total_games_played,
      0
    )
  }

  const getAverageDuration = (): string => {
    if (!gameStats || !gameStats.duration) return 'Non disponible'
    const minutes = gameStats.duration
    if (minutes < 60) {
      return `${minutes} min`
    } else {
      const hours = Math.floor(minutes / 60)
      const remainingMinutes = minutes % 60
      return `${hours}h${remainingMinutes > 0 ? ` ${remainingMinutes}min` : ''}`
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-96">
        <div className="text-lg">Chargement des statistiques...</div>
      </div>
    )
  }

  if (!game) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Jeu introuvable
        </h2>
        <button
          onClick={() => navigate('/games')}
          className="text-blue-600 hover:text-blue-800"
        >
          ← Retour aux jeux
        </button>
      </div>
    )
  }

  const bestPlayer = getBestPlayer()
  const mostActivePlayer = getMostActivePlayer()
  const highestScorer = getHighestScorer()

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
        <button
          onClick={() => navigate('/games')}
          className="text-blue-600 hover:text-blue-800"
        >
          🎮 Jeux
        </button>
        <span>›</span>
        <span>{game.game_name}</span>
        <span>›</span>
        <span>Statistiques</span>
      </div>

      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          📊 Statistiques - {game.game_name}
        </h1>
        <div className="flex gap-2">
          <button
            onClick={() => navigate(`/sessions/game/${game.game_id}`)}
            className="px-4 py-2 text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
          >
            📋 Voir l&apos;historique
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      {/* Informations sur le jeu */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">🎮 Informations du Jeu</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <span className="font-medium text-gray-700">Joueurs:</span>
            <div className="text-lg">
              {game.min_players} - {game.max_players}
            </div>
          </div>
          <div>
            <span className="font-medium text-gray-700">Mode par défaut:</span>
            <div className="text-lg capitalize">{game.default_mode}</div>
          </div>
          <div>
            <span className="font-medium text-gray-700">Personnages:</span>
            <div className="text-lg">
              {game.has_characters ? '✅ Oui' : '❌ Non'}
            </div>
          </div>
        </div>
        {game.game_description && (
          <div className="mt-4">
            <span className="font-medium text-gray-700">Description:</span>
            <p className="text-gray-600 mt-1">{game.game_description}</p>
          </div>
        )}
      </div>

      {/* Statistiques globales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white border border-gray-200 rounded-lg p-6 text-center">
          <div className="text-3xl font-bold text-blue-600 mb-2">
            {getTotalGames()}
          </div>
          <div className="text-gray-600">Parties jouées</div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6 text-center">
          <div className="text-3xl font-bold text-green-600 mb-2">
            {getTotalPlayers()}
          </div>
          <div className="text-gray-600">Joueurs différents</div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6 text-center">
          <div className="text-3xl font-bold text-purple-600 mb-2">
            {getAverageDuration()}
          </div>
          <div className="text-gray-600">Durée moyenne</div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6 text-center">
          <div className="text-3xl font-bold text-orange-600 mb-2">
            {gameStats?.total_score || 0}
          </div>
          <div className="text-gray-600">Score total cumulé</div>
        </div>
      </div>

      {/* Podium des joueurs */}
      {bestPlayer && mostActivePlayer && highestScorer && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-yellow-800 mb-3">
              🏆 Meilleur taux de victoire
            </h3>
            <div className="font-medium text-yellow-900">
              {getPlayerName(bestPlayer.player_id)}
            </div>
            <div className="text-2xl font-bold text-yellow-700 mt-1">
              {StatsService.formatWinRate(
                bestPlayer.total_wins,
                bestPlayer.total_games_played
              )}
            </div>
            <div className="text-sm text-yellow-600 mt-1">
              {bestPlayer.total_wins}/{bestPlayer.total_games_played} parties
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-blue-800 mb-3">
              🎯 Joueur le plus actif
            </h3>
            <div className="font-medium text-blue-900">
              {getPlayerName(mostActivePlayer.player_id)}
            </div>
            <div className="text-2xl font-bold text-blue-700 mt-1">
              {mostActivePlayer.total_games_played}
            </div>
            <div className="text-sm text-blue-600 mt-1">parties jouées</div>
          </div>

          <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-purple-800 mb-3">
              ⭐ Meilleur score moyen
            </h3>
            <div className="font-medium text-purple-900">
              {getPlayerName(highestScorer.player_id)}
            </div>
            <div className="text-2xl font-bold text-purple-700 mt-1">
              {StatsService.formatAverageScore(highestScorer.average_score)}
            </div>
            <div className="text-sm text-purple-600 mt-1">
              points en moyenne
            </div>
          </div>
        </div>
      )}

      {/* Tableau des performances des joueurs */}
      {playerStats.length > 0 ? (
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-6">
            👥 Performances des Joueurs
          </h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Joueur
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Parties
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Victoires
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Taux de victoire
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Score moyen
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Score total
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Dernière partie
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {playerStats
                  .sort((a, b) => {
                    const aWinRate =
                      a.total_games_played > 0
                        ? (a.total_wins / a.total_games_played) * 100
                        : 0
                    const bWinRate =
                      b.total_games_played > 0
                        ? (b.total_wins / b.total_games_played) * 100
                        : 0
                    return bWinRate - aWinRate
                  })
                  .map((stats, index) => {
                    const winRate =
                      stats.total_games_played > 0
                        ? (stats.total_wins / stats.total_games_played) * 100
                        : 0

                    return (
                      <tr key={stats.player_id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            {index < 3 && (
                              <span className="mr-2">
                                {index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'}
                              </span>
                            )}
                            <div className="text-sm font-medium text-gray-900">
                              {getPlayerName(stats.player_id)}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {stats.total_games_played}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {stats.total_wins}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`text-sm font-medium ${StatsService.getPerformanceColor(winRate)}`}
                          >
                            {StatsService.getPerformanceIcon(winRate)}{' '}
                            {StatsService.formatWinRate(
                              stats.total_wins,
                              stats.total_games_played
                            )}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {StatsService.formatAverageScore(stats.average_score)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {stats.total_score.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {StatsService.formatLastGameDate(
                            stats.last_game_date
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button
                            onClick={() =>
                              navigate(`/players/${stats.player_id}/stats`)
                            }
                            className="text-blue-600 hover:text-blue-900"
                          >
                            📊 Profil
                          </button>
                        </td>
                      </tr>
                    )
                  })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <div className="text-6xl mb-4">🎲</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Aucune statistique disponible
          </h2>
          <p className="text-gray-600 mb-6">
            Ce jeu n&apos;a pas encore été joué ou aucune partie n&apos;a été
            terminée.
          </p>
          <button
            onClick={() => navigate('/current-game')}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
          >
            🎮 Démarrer une partie
          </button>
        </div>
      )}
    </div>
  )
}
