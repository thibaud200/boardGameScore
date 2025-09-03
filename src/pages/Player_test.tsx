// --- MOCK AUTONOME ---
import React, { useState, useEffect } from 'react'

import { PlayersService } from '../services/playersService'
import type { Player, CreatePlayerRequest } from '../types'
import { motion } from 'framer-motion'
import { Card, CardContent } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { BarChart3, History, Edit, Trash2, UserPlus } from 'lucide-react'

export function PlayersMock() {
  const [players, setPlayers] = useState<Player[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isCreating, setIsCreating] = useState(false)
  const [newPlayerName, setNewPlayerName] = useState('')
  const [newAvatarUrl, setNewAvatarUrl] = useState('')
  const [newColor, setNewColor] = useState('#2196f3')
  const [validationError, setValidationError] = useState<string | null>(null)

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
    try {
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

  const handleDeletePlayer = async (playerId: number) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce joueur ?')) return
    try {
      await PlayersService.deletePlayer(playerId)
      setPlayers((prev) => prev.filter((p) => p.player_id !== playerId))
    } catch (err) {
      setError('Erreur lors de la suppression du joueur')
      console.error('Erreur:', err)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="text-lg text-gray-600">Chargement des joueurs...</div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">
          Gestion des Joueurs
        </h1>
        {!isCreating && (
          <Button
            onClick={() => setIsCreating(true)}
            className="flex items-center gap-2"
          >
            <UserPlus className="w-4 h-4" /> Nouveau Joueur
          </Button>
        )}
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}

      {isCreating && (
        <div className="bg-white shadow-md rounded-xl p-6 mb-6 border">
          <h2 className="text-lg font-semibold text-gray-800 mb-3">
            Créer un nouveau joueur
          </h2>
          <form onSubmit={handleCreatePlayer} className="flex flex-col gap-4">
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
            <input
              type="url"
              value={newAvatarUrl}
              onChange={(e) => setNewAvatarUrl(e.target.value)}
              placeholder="https://...jpg/png"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {newAvatarUrl &&
              /^https?:\/\/.+\.(jpg|jpeg|png|gif|svg)$/.test(newAvatarUrl) && (
                <img
                  src={newAvatarUrl}
                  alt="Preview"
                  className="mt-2 w-16 h-16 rounded-full border"
                />
              )}
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={newColor}
                onChange={(e) => setNewColor(e.target.value)}
                className="w-12 h-8 border rounded"
              />
              <span
                className="inline-block w-6 h-6 rounded-full border"
                style={{ background: newColor }}
              />
            </div>
            {validationError && (
              <div className="text-red-600 text-sm mb-2">{validationError}</div>
            )}
            <div className="flex gap-3">
              <Button type="submit" className="bg-green-600 hover:bg-green-700">
                Créer
              </Button>
              <Button
                type="button"
                variant="secondary"
                onClick={() => setIsCreating(false)}
              >
                Annuler
              </Button>
            </div>
          </form>
        </div>
      )}

      {players.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <p className="text-lg mb-2">Aucun joueur trouvé</p>
          <p>Commencez par créer votre premier joueur.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {players.map((player) => (
            <motion.div
              key={player.player_id}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
            >
              <Card className="rounded-2xl shadow-md border hover:shadow-lg transition-all">
                <CardContent className="p-4 flex flex-col items-center text-center">
                  {player.avatar_url ? (
                    <img
                      src={player.avatar_url}
                      alt={player.player_name}
                      className="w-20 h-20 rounded-full border mb-3"
                    />
                  ) : (
                    <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center mb-3">
                      <span className="text-2xl text-gray-500">👤</span>
                    </div>
                  )}
                  <h3 className="text-lg font-semibold text-gray-900">
                    {player.player_name}
                  </h3>
                  {player.color && (
                    <span
                      className="inline-block mt-2 w-6 h-6 rounded-full border"
                      style={{ background: player.color }}
                    />
                  )}
                  <p className="text-xs text-gray-500 mt-1">
                    Créé le{' '}
                    {new Date(player.created_at).toLocaleDateString('fr-FR', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                  <div className="flex gap-2 mt-4 flex-wrap justify-center">
                    <Button size="sm" variant="outline" asChild>
                      <a href={`/stats/player/${player.player_id}`}>
                        <BarChart3 className="w-4 h-4 mr-1" /> Stats
                      </a>
                    </Button>
                    <Button size="sm" variant="outline" asChild>
                      <a href={`/sessions/player/${player.player_id}`}>
                        <History className="w-4 h-4 mr-1" /> Parties
                      </a>
                    </Button>
                  </div>
                  <div className="flex gap-2 mt-3">
                    <Button size="sm" variant="secondary">
                      <Edit className="w-4 h-4 mr-1" /> Modifier
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDeletePlayer(player.player_id)}
                    >
                      <Trash2 className="w-4 h-4 mr-1" /> Supprimer
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

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
