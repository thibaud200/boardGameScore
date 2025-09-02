import React, { useState, useEffect } from 'react'
import { PlayersService } from '../services/playersService'
import type { Player, CreatePlayerRequest, UpdatePlayerRequest } from '../types'

interface EditingPlayer {
  player_id: number
  player_name: string
}

export default function Players() {
  const [players, setPlayers] = useState<Player[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isCreating, setIsCreating] = useState(false)
  const [editingPlayer, setEditingPlayer] = useState<EditingPlayer | null>(null)
  const [newPlayerName, setNewPlayerName] = useState('')
  const [editPlayerName, setEditPlayerName] = useState('')

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
    if (!newPlayerName.trim()) return

    try {
      setError(null)
      const playerData: CreatePlayerRequest = {
        player_name: newPlayerName.trim()
      }
      const newPlayer = await PlayersService.createPlayer(playerData)
      setPlayers((prev) => [...prev, newPlayer])
      setNewPlayerName('')
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
    setEditingPlayer({
      player_id: player.player_id,
      player_name: player.player_name
    })
    setEditPlayerName(player.player_name)
  }

  const cancelEdit = () => {
    setEditingPlayer(null)
    setEditPlayerName('')
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
          <form onSubmit={handleCreatePlayer} className="flex gap-3">
            <input
              type="text"
              value={newPlayerName}
              onChange={(e) => setNewPlayerName(e.target.value)}
              placeholder="Nom du joueur"
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              autoFocus
              required
            />
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
                          className="flex gap-2"
                        >
                          <input
                            type="text"
                            value={editPlayerName}
                            onChange={(e) => setEditPlayerName(e.target.value)}
                            className="flex-1 px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            autoFocus
                            required
                          />
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
                        </form>
                      ) : (
                        <div className="text-sm text-gray-900 font-medium">
                          {player.player_name}
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
                          <button
                            onClick={() => startEdit(player)}
                            className="text-blue-600 hover:text-blue-900 font-medium transition-colors"
                          >
                            Modifier
                          </button>
                          <button
                            onClick={() => handleDeletePlayer(player.player_id)}
                            className="text-red-600 hover:text-red-900 font-medium transition-colors"
                          >
                            Supprimer
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
