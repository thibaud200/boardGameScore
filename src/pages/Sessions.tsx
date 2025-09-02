import React, { useState, useEffect, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { GameSessionsService } from '../services/gameSessionsService'
import { PlayersService } from '../services/playersService'
import { GamesService } from '../services/gamesService'
import type { SessionWithDetails, Player, Game } from '../types'

export default function SessionsPage() {
  const { gameId, playerId } = useParams()
  const navigate = useNavigate()

  const [sessions, setSessions] = useState<SessionWithDetails[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filterContext, setFilterContext] = useState<{
    type: 'all' | 'game' | 'player'
    entity?: Game | Player
  }>({ type: 'all' })

  const loadSessions = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      let sessionsData: SessionWithDetails[]

      if (gameId) {
        sessionsData = await GameSessionsService.getSessionsByGame(
          Number(gameId)
        )
      } else if (playerId) {
        sessionsData = await GameSessionsService.getSessionsByPlayer(
          Number(playerId)
        )
      } else {
        sessionsData = await GameSessionsService.getAllSessions()
      }

      setSessions(sessionsData)
    } catch (err) {
      setError('Erreur lors du chargement des sessions')
      console.error('Erreur:', err)
    } finally {
      setLoading(false)
    }
  }, [gameId, playerId])

  const loadFilterContext = useCallback(async () => {
    try {
      if (gameId) {
        const game = await GamesService.getGameById(Number(gameId))
        setFilterContext({ type: 'game', entity: game })
      } else if (playerId) {
        const player = await PlayersService.getPlayerById(Number(playerId))
        setFilterContext({ type: 'player', entity: player })
      } else {
        setFilterContext({ type: 'all' })
      }
    } catch (err) {
      console.error('Erreur chargement contexte:', err)
    }
  }, [gameId, playerId])

  useEffect(() => {
    loadSessions()
    loadFilterContext()
  }, [loadSessions, loadFilterContext])

  const handleDeleteSession = async (sessionId: number) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette session ?')) {
      try {
        setError(null)
        await GameSessionsService.deleteSession(sessionId)
        setSessions((prev) => prev.filter((s) => s.sessions_id !== sessionId))
      } catch (err) {
        setError('Erreur lors de la suppression')
        console.error('Erreur:', err)
      }
    }
  }

  const getSessionPlayers = (session: SessionWithDetails): Player[] => {
    if (session.players_details) {
      return session.players_details
    }

    // Fallback: parser les IDs si les détails ne sont pas disponibles
    const playerIds = GameSessionsService.parsePlayersData(
      session.sessions_players
    )
    return playerIds.map((id) => ({
      player_id: id,
      player_name: `Joueur ${id}`,
      created_at: ''
    }))
  }

  const getSessionScores = (session: SessionWithDetails) => {
    return GameSessionsService.parseScoresData(session.sessions_scores)
  }

  const getPageTitle = () => {
    if (filterContext.type === 'game' && filterContext.entity) {
      return `Historique - ${(filterContext.entity as Game).game_name}`
    }
    if (filterContext.type === 'player' && filterContext.entity) {
      return `Historique - ${(filterContext.entity as Player).player_name}`
    }
    return 'Historique des Parties'
  }

  const getBreadcrumb = () => {
    if (filterContext.type === 'game') {
      return (
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
          <button
            onClick={() => navigate('/games')}
            className="text-blue-600 hover:text-blue-800"
          >
            📋 Jeux
          </button>
          <span>›</span>
          <span>{(filterContext.entity as Game)?.game_name}</span>
          <span>›</span>
          <span>Historique</span>
        </div>
      )
    }

    if (filterContext.type === 'player') {
      return (
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
          <button
            onClick={() => navigate('/players')}
            className="text-blue-600 hover:text-blue-800"
          >
            👥 Joueurs
          </button>
          <span>›</span>
          <span>{(filterContext.entity as Player)?.player_name}</span>
          <span>›</span>
          <span>Historique</span>
        </div>
      )
    }

    return null
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-96">
        <div className="text-lg">Chargement des sessions...</div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      {getBreadcrumb()}

      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">{getPageTitle()}</h1>
        <div className="flex gap-2">
          {filterContext.type !== 'all' && (
            <button
              onClick={() => navigate('/sessions')}
              className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              📊 Toutes les sessions
            </button>
          )}
          <button
            onClick={() => navigate('/current-game')}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
          >
            🎮 Nouvelle partie
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      {sessions.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <div className="text-6xl mb-4">🎲</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            {filterContext.type === 'game'
              ? 'Aucune partie jouée'
              : filterContext.type === 'player'
                ? 'Aucune partie jouée'
                : 'Aucune session enregistrée'}
          </h2>
          <p className="text-gray-600 mb-6">
            {filterContext.type === 'game'
              ? "Ce jeu n'a pas encore été joué."
              : filterContext.type === 'player'
                ? "Ce joueur n'a pas encore participé à une partie."
                : "Aucune partie n'a été enregistrée dans l'historique."}
          </p>
          <button
            onClick={() => navigate('/current-game')}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
          >
            🎮 Démarrer une partie
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {sessions.map((session) => {
            const players = getSessionPlayers(session)
            const scores = getSessionScores(session)

            return (
              <div
                key={session.sessions_id}
                className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-semibold text-gray-900">
                        {session.game?.game_name ||
                          `Jeu ${session.sessions_game_id}`}
                      </h3>
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm">
                        {GameSessionsService.formatGameMode(session.game_mode)}
                      </span>
                      {session.sessions_coop_result && (
                        <span className="text-sm">
                          {GameSessionsService.formatCoopResult(
                            session.sessions_coop_result
                          )}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <span>
                        📅{' '}
                        {session.sessions_date
                          ? new Date(session.sessions_date).toLocaleDateString(
                              'fr-FR',
                              {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              }
                            )
                          : new Date(session.created_at).toLocaleDateString(
                              'fr-FR'
                            )}
                      </span>
                      {session.sessions_duration && (
                        <span>
                          ⏱️{' '}
                          {GameSessionsService.formatDuration(
                            session.sessions_duration
                          )}
                        </span>
                      )}
                      <span>
                        👥 {players.length} joueur
                        {players.length > 1 ? 's' : ''}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleDeleteSession(session.sessions_id)}
                    className="text-red-600 hover:text-red-800 text-sm font-medium"
                  >
                    🗑️ Supprimer
                  </button>
                </div>

                {/* Joueurs et scores */}
                <div className="border-t pt-4">
                  <h4 className="font-medium text-gray-900 mb-3">Résultats</h4>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                    {players.map((player) => {
                      const score = scores[player.player_id.toString()]
                      const isWinner =
                        session.sessions_winner === player.player_id

                      return (
                        <div
                          key={player.player_id}
                          className={`p-3 rounded-lg border-2 ${
                            isWinner
                              ? 'border-yellow-400 bg-yellow-50'
                              : 'border-gray-200 bg-gray-50'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-medium">
                              {isWinner && '👑 '}
                              {player.player_name}
                            </span>
                            {score !== undefined && (
                              <span className="text-sm font-mono">{score}</span>
                            )}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>

                {/* Condition de victoire */}
                {session.win_condition && (
                  <div className="mt-3 pt-3 border-t">
                    <span className="text-sm text-gray-600">
                      <strong>Condition de victoire:</strong>{' '}
                      {session.win_condition}
                    </span>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}

      {/* Statistiques rapides */}
      {sessions.length > 0 && (
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-blue-800 mb-2">
            📊 Résumé
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <span className="font-medium text-blue-700">Total parties:</span>
              <div className="text-lg font-bold text-blue-900">
                {sessions.length}
              </div>
            </div>
            <div>
              <span className="font-medium text-blue-700">
                Parties terminées:
              </span>
              <div className="text-lg font-bold text-blue-900">
                {sessions.filter((s) => s.sessions_completed).length}
              </div>
            </div>
            <div>
              <span className="font-medium text-blue-700">
                Modes populaires:
              </span>
              <div className="text-sm text-blue-800">
                {sessions.length > 0 &&
                  (() => {
                    const modes = sessions.reduce(
                      (acc, s) => {
                        acc[s.game_mode] = (acc[s.game_mode] || 0) + 1
                        return acc
                      },
                      {} as Record<string, number>
                    )
                    const topMode = Object.entries(modes).sort(
                      ([, a], [, b]) => b - a
                    )[0]
                    return GameSessionsService.formatGameMode(topMode[0])
                  })()}
              </div>
            </div>
            <div>
              <span className="font-medium text-blue-700">
                Dernière partie:
              </span>
              <div className="text-sm text-blue-800">
                {sessions.length > 0 &&
                  new Date(
                    Math.max(
                      ...sessions.map((s) =>
                        new Date(s.sessions_date || s.created_at).getTime()
                      )
                    )
                  ).toLocaleDateString('fr-FR')}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
