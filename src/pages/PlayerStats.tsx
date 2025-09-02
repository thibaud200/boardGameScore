import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { StatsService } from '../services/statsService'
import { PlayersService } from '../services/playersService'
import { GamesService } from '../services/gamesService'
import type { PlayerStats, PlayerGameStats, Player, Game } from '../types'

export default function PlayerStatsPage() {
  const { playerId } = useParams()
  const navigate = useNavigate()

  const [player, setPlayer] = useState<Player | null>(null)
  const [globalStats, setGlobalStats] = useState<PlayerStats | null>(null)
  const [gameStats, setGameStats] = useState<PlayerGameStats[]>([])
  const [games, setGames] = useState<Game[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (playerId) {
      loadPlayerStats(Number(playerId))
    }
  }, [playerId])

  const loadPlayerStats = async (id: number) => {
    try {
      setLoading(true)
      setError(null)

      const [playerData, statsData, gameStatsData, gamesData] =
        await Promise.all([
          PlayersService.getPlayerById(id),
          StatsService.getPlayerStats(id),
          StatsService.getAllGameStatsForPlayer(id),
          GamesService.getAllGames()
        ])

      setPlayer(playerData)
      setGlobalStats(statsData)
      setGameStats(gameStatsData)
      setGames(gamesData)
    } catch (err) {
      setError('Erreur lors du chargement des statistiques')
      console.error('Erreur:', err)
    } finally {
      setLoading(false)
    }
  }

  const getGameName = (gameId: number): string => {
    const game = games.find((g) => g.game_id === gameId)
    return game?.game_name || `Jeu ${gameId}`
  }

  const getTotalWinRate = (): number => {
    if (!globalStats || globalStats.total_games_played === 0) return 0
    return (globalStats.total_wins / globalStats.total_games_played) * 100
  }

  const getBestGame = (): PlayerGameStats | null => {
    if (gameStats.length === 0) return null
    return gameStats.reduce((best, current) => {
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

  const getWorstGame = (): PlayerGameStats | null => {
    if (gameStats.length === 0) return null
    return gameStats.reduce((worst, current) => {
      const currentWinRate =
        current.total_games_played > 0
          ? (current.total_wins / current.total_games_played) * 100
          : 0
      const worstWinRate =
        worst.total_games_played > 0
          ? (worst.total_wins / worst.total_games_played) * 100
          : 0
      return currentWinRate < worstWinRate ? current : worst
    })
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-96">
        <div className="text-lg">Chargement des statistiques...</div>
      </div>
    )
  }

  if (!player) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Joueur introuvable
        </h2>
        <button
          onClick={() => navigate('/players')}
          className="text-blue-600 hover:text-blue-800"
        >
          ← Retour aux joueurs
        </button>
      </div>
    )
  }

  const bestGame = getBestGame()
  const worstGame = getWorstGame()

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
        <button
          onClick={() => navigate('/players')}
          className="text-blue-600 hover:text-blue-800"
        >
          👥 Joueurs
        </button>
        <span>›</span>
        <span>{player.player_name}</span>
        <span>›</span>
        <span>Statistiques</span>
      </div>

      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          📊 Statistiques - {player.player_name}
        </h1>
        <div className="flex gap-2">
          <button
            onClick={() => navigate(`/sessions/player/${player.player_id}`)}
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

      {/* Statistiques globales */}
      {globalStats ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white border border-gray-200 rounded-lg p-6 text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">
              {globalStats.total_games_played}
            </div>
            <div className="text-gray-600">Parties jouées</div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-6 text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">
              {globalStats.total_wins}
            </div>
            <div className="text-gray-600">Victoires</div>
            <div className="text-sm text-gray-500 mt-1">
              {StatsService.formatWinRate(
                globalStats.total_wins,
                globalStats.total_games_played
              )}
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-6 text-center">
            <div className="text-3xl font-bold text-red-600 mb-2">
              {globalStats.total_losses}
            </div>
            <div className="text-gray-600">Défaites</div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-6 text-center">
            <div className="text-3xl font-bold text-purple-600 mb-2">
              {StatsService.formatAverageScore(globalStats.average_score)}
            </div>
            <div className="text-gray-600">Score moyen</div>
          </div>
        </div>
      ) : (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-8 text-center">
          <div className="text-6xl mb-4">📊</div>
          <h2 className="text-xl font-bold text-yellow-800 mb-2">
            Aucune statistique disponible
          </h2>
          <p className="text-yellow-700">
            Ce joueur n&apos;a pas encore participé à une partie terminée.
          </p>
        </div>
      )}

      {/* Résumé des performances */}
      {globalStats && (
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">
            🎯 Résumé des Performances
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <span className="font-medium">Taux de victoire global:</span>
              <div
                className={`text-2xl font-bold ${StatsService.getPerformanceColor(getTotalWinRate())}`}
              >
                {StatsService.getPerformanceIcon(getTotalWinRate())}{' '}
                {StatsService.formatWinRate(
                  globalStats.total_wins,
                  globalStats.total_games_played
                )}
              </div>
            </div>
            <div>
              <span className="font-medium">Dernière partie:</span>
              <div className="text-lg text-gray-700">
                {StatsService.formatLastGameDate(globalStats.last_game_date)}
              </div>
            </div>
            <div>
              <span className="font-medium">Score total cumulé:</span>
              <div className="text-lg font-bold text-gray-900">
                {globalStats.total_score.toLocaleString()} pts
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Meilleur et pire jeu */}
      {bestGame && worstGame && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-green-50 border border-green-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-green-800 mb-3">
              🏆 Meilleur jeu
            </h3>
            <div className="font-medium text-green-900">
              {getGameName(bestGame.game_id)}
            </div>
            <div className="text-sm text-green-700 mt-1">
              {StatsService.formatWinRate(
                bestGame.total_wins,
                bestGame.total_games_played
              )}{' '}
              de victoires ({bestGame.total_wins}/{bestGame.total_games_played}{' '}
              parties)
            </div>
            <div className="text-sm text-green-600 mt-1">
              Score moyen:{' '}
              {StatsService.formatAverageScore(bestGame.average_score)}
            </div>
          </div>

          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-red-800 mb-3">
              📈 À améliorer
            </h3>
            <div className="font-medium text-red-900">
              {getGameName(worstGame.game_id)}
            </div>
            <div className="text-sm text-red-700 mt-1">
              {StatsService.formatWinRate(
                worstGame.total_wins,
                worstGame.total_games_played
              )}{' '}
              de victoires ({worstGame.total_wins}/
              {worstGame.total_games_played} parties)
            </div>
            <div className="text-sm text-red-600 mt-1">
              Score moyen:{' '}
              {StatsService.formatAverageScore(worstGame.average_score)}
            </div>
          </div>
        </div>
      )}

      {/* Statistiques par jeu */}
      {gameStats.length > 0 ? (
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-6">
            🎮 Performances par Jeu
          </h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Jeu
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
                    Dernière partie
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {gameStats
                  .sort((a, b) => b.total_games_played - a.total_games_played)
                  .map((stats) => {
                    const winRate =
                      stats.total_games_played > 0
                        ? (stats.total_wins / stats.total_games_played) * 100
                        : 0

                    return (
                      <tr key={stats.game_id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {getGameName(stats.game_id)}
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
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {StatsService.formatLastGameDate(
                            stats.last_game_date
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button
                            onClick={() =>
                              navigate(`/sessions/game/${stats.game_id}`)
                            }
                            className="text-blue-600 hover:text-blue-900"
                          >
                            📊 Voir sessions
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
        globalStats && (
          <div className="text-center py-8 bg-gray-50 rounded-lg">
            <p className="text-gray-600">
              Aucune statistique détaillée par jeu disponible.
            </p>
          </div>
        )
      )}
    </div>
  )
}
