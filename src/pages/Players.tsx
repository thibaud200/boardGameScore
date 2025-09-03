import React, { useState, useEffect } from 'react'
import { PlayersService } from '../services/playersService'
import type { Player, CreatePlayerRequest, UpdatePlayerRequest } from '../types'

export default function Players() {
  const [players, setPlayers] = useState<Player[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isCreating, setIsCreating] = useState(false)
  const [editingPlayer, setEditingPlayer] = useState<Player | null>(null)
  const [newPlayerName, setNewPlayerName] = useState('')
  const [newAvatarUrl, setNewAvatarUrl] = useState('')
  const [newColor, setNewColor] = useState('#2196f3')
  const [editPlayerName, setEditPlayerName] = useState('')
  const [editAvatarUrl, setEditAvatarUrl] = useState('')
  const [editColor, setEditColor] = useState('#2196f3')
  // Suppression des variables inutilisées pour édition avatar/couleur
  const [validationError, setValidationError] = useState<string | null>(null)

  // Charger tous les joueurs au montage du composant
  useEffect(() => {
    loadPlayers()
  }, [])

  const loadPlayers = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await PlayersService.getAllPlayers()
      setPlayers(data)
    } catch (err) {
      setError('Erreur lors du chargement des joueurs')
      console.error('Erreur:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleCreatePlayer = async (e: React.FormEvent) => {
    e.preventDefault()
    setValidationError(null)
    if (newPlayerName.trim().length < 3) {
      setValidationError('Le nom doit comporter au moins 3 caractères.')
      return
    }
    if (
      players.some(
        (p) =>
          p.player_name.toLowerCase() === newPlayerName.trim().toLowerCase()
      )
    ) {
      setValidationError('Ce nom de joueur existe déjà.')
      return
    }
    if (
      newAvatarUrl &&
      !/^https?:\/\/.+\.(jpg|jpeg|png|gif|svg)$/.test(newAvatarUrl)
    ) {
      setValidationError("URL d'avatar invalide (doit être une image).")
      return
    }
    if (newColor && !/^#[0-9A-Fa-f]{6}$/.test(newColor)) {
      setValidationError('Couleur invalide (code hex attendu).')
      return
    }
    try {
      setError(null)
      const playerData: CreatePlayerRequest = {
        player_name: newPlayerName.trim(),
        avatar_url: newAvatarUrl || null,
        color: newColor || null
      }
      const newPlayer = await PlayersService.createPlayer(playerData)
      setPlayers((prev) => [...prev, newPlayer])
      setNewPlayerName('')
      setNewAvatarUrl('')
      setNewColor('#2196f3')
      setIsCreating(false)
    } catch (err) {
      setError('Erreur lors de la création du joueur')
      console.error('Erreur:', err)
    }
  }

  const handleUpdatePlayer = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingPlayer || !editPlayerName.trim()) return

    try {
      setError(null)
      const updateData: UpdatePlayerRequest = {
        player_name: editPlayerName.trim()
      }
      const updatedPlayer = await PlayersService.updatePlayer(
        editingPlayer.player_id,
        updateData
      )
      setPlayers((prev) =>
        prev.map((p) =>
          p.player_id === updatedPlayer.player_id ? updatedPlayer : p
        )
      )
      setEditingPlayer(null)
      setEditPlayerName('')
    } catch (err) {
      setError('Erreur lors de la mise à jour du joueur')
      console.error('Erreur:', err)
    }
  }

  const handleDeletePlayer = async (playerId: number) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce joueur ?')) return

    try {
      setError(null)
      await PlayersService.deletePlayer(playerId)
      setPlayers((prev) => prev.filter((p) => p.player_id !== playerId))
    } catch (err) {
      setError('Erreur lors de la suppression du joueur')
      console.error('Erreur:', err)
    }
  }

  const startEdit = (player: Player) => {
    setEditingPlayer(player)
    setEditPlayerName(player.player_name)
    setEditAvatarUrl(player.avatar_url || '')
    setEditColor(player.color || '#2196f3')
  }

  const cancelEdit = () => {
    setEditingPlayer(null)
    setEditPlayerName('')
    setEditAvatarUrl('')
    setEditColor('#2196f3')
  }

  const cancelCreate = () => {
    setIsCreating(false)
    setNewPlayerName('')
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="text-lg text-gray-600">Chargement des joueurs...</div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">
          Gestion des Joueurs
        </h1>
        {!isCreating && (
          <button
            onClick={() => setIsCreating(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
          >
            + Nouveau Joueur
          </button>
        )}
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}

      {/* Formulaire de création */}
      {isCreating && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
          <h2 className="text-lg font-semibold text-green-800 mb-3">
            Créer un nouveau joueur
          </h2>
          <form onSubmit={handleCreatePlayer} className="flex flex-col gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Nom du joueur
              </label>
              <input
                type="text"
                value={newPlayerName}
                onChange={(e) => setNewPlayerName(e.target.value)}
                placeholder="Nom du joueur"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                minLength={3}
                required
                autoFocus
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Avatar (URL)
              </label>
              <input
                type="url"
                value={newAvatarUrl}
                onChange={(e) => setNewAvatarUrl(e.target.value)}
                placeholder="https://...jpg/png"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {newAvatarUrl &&
                /^https?:\/\/.+\.(jpg|jpeg|png|gif|svg)$/.test(
                  newAvatarUrl
                ) && (
                  <img
                    src={newAvatarUrl}
                    alt="Avatar preview"
                    className="mt-2 w-16 h-16 rounded-full border"
                  />
                )}
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Couleur</label>
              <label
                htmlFor="new-player-color"
                className="block text-sm font-medium mb-1"
              >
                Couleur
              </label>
              <input
                id="new-player-color"
                type="color"
                value={newColor}
                onChange={(e) => setNewColor(e.target.value)}
                className="w-12 h-8 p-0 border-none bg-transparent"
              />
              <span
                className="inline-block ml-2 w-6 h-6 rounded-full border"
                style={{ background: newColor }}
                title={newColor}
              />
            </div>
            {validationError && (
              <div className="text-red-600 text-sm mb-2">{validationError}</div>
            )}
            <div className="flex gap-3 mt-2">
              <button
                type="submit"
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
              >
                Créer
              </button>
              <button
                type="button"
                onClick={cancelCreate}
                className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
              >
                Annuler
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Liste des joueurs */}
      <div className="bg-white shadow-sm border border-gray-200 rounded-lg">
        {players.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <p className="text-lg mb-2">Aucun joueur trouvé</p>
            <p>Commencez par créer votre premier joueur.</p>
          </div>
        ) : (
          <div className="overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nom du Joueur
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date de Création
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {players.map((player) => (
                  <tr key={player.player_id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {player.player_id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {editingPlayer?.player_id === player.player_id ? (
                        <form
                          onSubmit={handleUpdatePlayer}
                          className="flex flex-col gap-2"
                        >
                          <input
                            type="text"
                            value={editPlayerName}
                            onChange={(e) => setEditPlayerName(e.target.value)}
                            className="px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            minLength={3}
                            required
                            autoFocus
                          />
                          <input
                            type="url"
                            value={editAvatarUrl}
                            onChange={(e) => setEditAvatarUrl(e.target.value)}
                            placeholder="URL de l'avatar"
                            className="px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                          {editAvatarUrl &&
                            /^https?:\/\/.+\.(jpg|jpeg|png|gif|svg)$/.test(
                              editAvatarUrl
                            ) && (
                              <img
                                src={editAvatarUrl}
                                alt="Avatar preview"
                                className="mt-1 w-12 h-12 rounded-full border"
                              />
                            )}
                          <label
                            htmlFor="edit-player-color"
                            className="block text-sm font-medium mb-1"
                          >
                            Couleur
                          </label>
                          <input
                            id="edit-player-color"
                            type="color"
                            value={editColor}
                            onChange={(e) => setEditColor(e.target.value)}
                            className="w-10 h-6 p-0 border-none bg-transparent"
                          />
                          <span
                            className="inline-block ml-2 w-5 h-5 rounded-full border"
                            style={{ background: editColor }}
                            title={editColor}
                          />
                          <div className="flex gap-2 mt-2">
                            <button
                              type="submit"
                              className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm font-medium transition-colors"
                            >
                              Sauver
                            </button>
                            <button
                              type="button"
                              onClick={cancelEdit}
                              className="bg-gray-500 hover:bg-gray-600 text-white px-3 py-1 rounded text-sm font-medium transition-colors"
                            >
                              Annuler
                            </button>
                          </div>
                        </form>
                      ) : (
                        <div className="flex items-center gap-3">
                          {player.avatar_url ? (
                            <img
                              src={player.avatar_url}
                              alt={player.player_name}
                              className="w-10 h-10 rounded-full border"
                            />
                          ) : (
                            <span className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center border text-gray-500">
                              <svg
                                width="24"
                                height="24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                viewBox="0 0 24 24"
                              >
                                <circle cx="12" cy="8" r="4" />
                                <path d="M4 20c0-4 8-4 8-4s8 0 8 4" />
                              </svg>
                            </span>
                          )}
                          <span className="text-sm text-gray-900 font-medium">
                            {player.player_name}
                          </span>
                          {player.color && (
                            <span
                              className="inline-block ml-2 w-5 h-5 rounded-full border"
                              style={{ background: player.color }}
                              title={player.color}
                            />
                          )}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(player.created_at).toLocaleDateString('fr-FR', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      {editingPlayer?.player_id === player.player_id ? null : (
                        <div className="flex gap-2 justify-end">
                          <a
                            href={`/stats/player/${player.player_id}`}
                            className="text-purple-600 hover:text-purple-900 font-medium transition-colors"
                            title="Voir les statistiques"
                          >
                            📊 Stats
                          </a>
                          <a
                            href={`/sessions/player/${player.player_id}`}
                            className="text-green-600 hover:text-green-900 font-medium transition-colors"
                            title="Voir l'historique des parties"
                          >
                            📋 Parties
                          </a>
                          <button
                            onClick={() => startEdit(player)}
                            className="text-blue-600 hover:text-blue-900 font-medium transition-colors"
                          >
                            ✏️ Modifier
                          </button>
                          <button
                            onClick={() => handleDeletePlayer(player.player_id)}
                            className="text-red-600 hover:text-red-900 font-medium transition-colors"
                          >
                            🗑️ Supprimer
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Statistiques */}
      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-blue-800 mb-2">
          Statistiques
        </h3>
        <p className="text-blue-700">
          Total des joueurs :{' '}
          <span className="font-bold">{players.length}</span>
        </p>
      </div>
    </div>
  )
}
