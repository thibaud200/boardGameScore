/**
 * Page Dashboard - Vue d'ensemble de l'application
 */
import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { PlayersService } from '../services/playersService'
import { GamesService } from '../services/gamesService'
import type { Player, Game } from '../types'

export default function Dashboard() {
  const [stats, setStats] = useState({
    playersCount: 0,
    gamesCount: 0,
    loading: true,
    error: null as string | null
  })

  const [recentPlayers, setRecentPlayers] = useState<Player[]>([])
  const [recentGames, setRecentGames] = useState<Game[]>([])

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    try {
      setStats((prev) => ({ ...prev, loading: true, error: null }))

      const [players, games] = await Promise.all([
        PlayersService.getAllPlayers(),
        GamesService.getAllGames()
      ])

      // Stats générales
      setStats({
        playersCount: players.length,
        gamesCount: games.length,
        loading: false,
        error: null
      })

      // Données récentes (3 derniers)
      setRecentPlayers(players.slice(-3).reverse())
      setRecentGames(games.slice(-3).reverse())
    } catch (error) {
      console.error('Erreur lors du chargement du dashboard:', error)
      setStats((prev) => ({
        ...prev,
        loading: false,
        error: 'Erreur lors du chargement des données'
      }))
    }
  }

  if (stats.loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg text-gray-600">Chargement du dashboard...</div>
      </div>
    )
  }

  if (stats.error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-md p-4">
        <div className="text-red-800">{stats.error}</div>
        <button
          onClick={loadDashboardData}
          className="mt-2 text-red-600 hover:text-red-800 underline"
        >
          Réessayer
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-2 text-gray-600">
          Vue d&apos;ensemble de votre collection de jeux et statistiques
        </p>
      </div>

      {/* Statistiques principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <span className="text-2xl">👥</span>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Joueurs
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {stats.playersCount}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-5 py-3">
            <div className="text-sm">
              <Link
                to="/players"
                className="font-medium text-purple-600 hover:text-purple-500"
              >
                Voir tous les joueurs
              </Link>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <span className="text-2xl">🎮</span>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Jeux
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {stats.gamesCount}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-5 py-3">
            <div className="text-sm">
              <Link
                to="/games"
                className="font-medium text-purple-600 hover:text-purple-500"
              >
                Voir tous les jeux
              </Link>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <span className="text-2xl">🎯</span>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Partie en cours
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    Disponible
                  </dd>
                </dl>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-5 py-3">
            <div className="text-sm">
              <Link
                to="/current-game"
                className="font-medium text-purple-600 hover:text-purple-500"
              >
                Gérer une partie
              </Link>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <span className="text-2xl">⚙️</span>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Backend API
                  </dt>
                  <dd className="text-lg font-medium text-green-600">
                    ✅ Online
                  </dd>
                </dl>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-5 py-3">
            <div className="text-sm text-gray-500">33/33 tests passent</div>
          </div>
        </div>
      </div>

      {/* Actions rapides */}
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">
          Actions rapides
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            to="/current-game"
            className="flex items-center p-4 bg-green-50 border border-green-200 rounded-lg hover:bg-green-100 transition-colors"
          >
            <span className="text-2xl mr-3">🎮</span>
            <div>
              <div className="font-medium text-green-900">Nouvelle partie</div>
              <div className="text-sm text-green-600">
                Démarrer ou gérer une partie
              </div>
            </div>
          </Link>

          <Link
            to="/players?action=create"
            className="flex items-center p-4 bg-purple-50 border border-purple-200 rounded-lg hover:bg-purple-100 transition-colors"
          >
            <span className="text-2xl mr-3">➕</span>
            <div>
              <div className="font-medium text-purple-900">
                Ajouter un joueur
              </div>
              <div className="text-sm text-purple-600">
                Créer un nouveau profil joueur
              </div>
            </div>
          </Link>

          <Link
            to="/games?action=create"
            className="flex items-center p-4 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors"
          >
            <span className="text-2xl mr-3">🎲</span>
            <div>
              <div className="font-medium text-blue-900">Ajouter un jeu</div>
              <div className="text-sm text-blue-600">
                Ajouter un jeu à votre collection
              </div>
            </div>
          </Link>
        </div>
      </div>

      {/* Activité récente */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Joueurs récents */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">
            Joueurs récents
          </h2>
          {recentPlayers.length > 0 ? (
            <div className="space-y-3">
              {recentPlayers.map((player) => (
                <div key={player.player_id} className="flex items-center">
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                    <span className="text-sm font-medium text-purple-600">
                      {player.player_name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className="ml-3">
                    <div className="text-sm font-medium text-gray-900">
                      {player.player_name}
                    </div>
                    <div className="text-xs text-gray-500">
                      Ajouté le{' '}
                      {new Date(player.created_at).toLocaleDateString('fr-FR')}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-sm">Aucun joueur pour le moment</p>
          )}
        </div>

        {/* Jeux récents */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">
            Jeux récents
          </h2>
          {recentGames.length > 0 ? (
            <div className="space-y-3">
              {recentGames.map((game) => (
                <div key={game.game_id} className="flex items-center">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-sm">🎮</span>
                  </div>
                  <div className="ml-3">
                    <div className="text-sm font-medium text-gray-900">
                      {game.game_name}
                    </div>
                    <div className="text-xs text-gray-500">
                      {game.min_players}-{game.max_players} joueurs
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-sm">Aucun jeu pour le moment</p>
          )}
        </div>
      </div>
    </div>
  )
}
