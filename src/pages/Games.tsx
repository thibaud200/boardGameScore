import React, { useState, useEffect } from 'react'
import { GamesService } from '../services/gamesService'
import BGGSearch from '../components/BGGSearch'
import type { Game, CreateGameRequest } from '../types'

export default function Games() {
  const [games, setGames] = useState<Game[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [editingGame, setEditingGame] = useState<Game | null>(null)
  const [bggImported, setBggImported] = useState(false)

  // Form data
  const [formData, setFormData] = useState<CreateGameRequest>({
    game_name: '',
    game_description: '',
    game_image: '',
    has_characters: false,
    min_players: 1,
    max_players: 4,
    supports_cooperative: false,
    supports_competitive: true,
    supports_campaign: false,
    default_mode: 'competitive'
  })

  useEffect(() => {
    loadGames()
  }, [])

  const loadGames = async () => {
    try {
      setLoading(true)
      const data = await GamesService.getAllGames()
      setGames(data)
    } catch (error) {
      setError('Erreur lors du chargement des jeux')
      console.error('Erreur:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (editingGame) {
        // Mise à jour - utiliser l'API classique
        const cleanedData: CreateGameRequest = {
          game_id_bgg: formData.game_id_bgg || null,
          game_name: formData.game_name,
          game_description: formData.game_description || null,
          game_image: formData.game_image || null,
          has_characters: formData.has_characters,
          min_players: formData.min_players || 1,
          max_players: formData.max_players || 4,
          supports_cooperative:
            formData.supports_cooperative !== undefined
              ? formData.supports_cooperative
              : false,
          supports_competitive:
            formData.supports_competitive !== undefined
              ? formData.supports_competitive
              : true,
          supports_campaign:
            formData.supports_campaign !== undefined
              ? formData.supports_campaign
              : false,
          default_mode: formData.default_mode || 'competitive'
        }
        await GamesService.updateGame(editingGame.game_id, cleanedData)
      } else {
        // Création - vérifier s'il y a un BGG ID pour utiliser l'import complet
        if (formData.game_id_bgg) {
          // Utiliser l'API d'import BGG qui gère automatiquement extensions et personnages
          const response = await fetch(
            `http://localhost:3001/api/bgg/import/${formData.game_id_bgg}`,
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              }
            }
          )

          if (!response.ok) {
            throw new Error("Erreur lors de l'import BGG")
          }
        } else {
          // Création manuelle sans BGG ID - utiliser l'API classique
          const cleanedData: CreateGameRequest = {
            game_id_bgg: null,
            game_name: formData.game_name,
            game_description: formData.game_description || null,
            game_image: formData.game_image || null,
            has_characters: formData.has_characters,
            min_players: formData.min_players || 1,
            max_players: formData.max_players || 4,
            supports_cooperative:
              formData.supports_cooperative !== undefined
                ? formData.supports_cooperative
                : false,
            supports_competitive:
              formData.supports_competitive !== undefined
                ? formData.supports_competitive
                : true,
            supports_campaign:
              formData.supports_campaign !== undefined
                ? formData.supports_campaign
                : false,
            default_mode: formData.default_mode || 'competitive'
          }
          await GamesService.createGame(cleanedData)
        }
      }
      resetForm()
      loadGames()
    } catch (error) {
      setError(
        editingGame
          ? 'Erreur lors de la mise à jour'
          : 'Erreur lors de la création'
      )
      console.error('Erreur:', error)
    }
  }

  const handleEdit = (game: Game) => {
    setEditingGame(game)
    setFormData({
      game_name: game.game_name,
      game_description: game.game_description || '',
      game_image: game.game_image || '',
      has_characters: game.has_characters || false,
      min_players: game.min_players || 1,
      max_players: game.max_players || 4,
      supports_cooperative: game.supports_cooperative || false,
      supports_competitive: game.supports_competitive || true,
      supports_campaign: game.supports_campaign || false,
      default_mode: game.default_mode || 'competitive'
    })
    setShowCreateForm(true)
  }

  const handleDelete = async (id: number) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce jeu ?')) {
      try {
        await GamesService.deleteGame(id)
        loadGames()
      } catch (error) {
        setError('Erreur lors de la suppression')
        console.error('Erreur:', error)
      }
    }
  }

  const handleBGGImport = (gameData: CreateGameRequest) => {
    // Pré-remplir le formulaire avec les données BGG
    setFormData({
      game_id_bgg: gameData.game_id_bgg,
      game_name: gameData.game_name,
      game_description: gameData.game_description,
      game_image: gameData.game_image,
      has_characters: gameData.has_characters,
      min_players: gameData.min_players,
      max_players: gameData.max_players,
      supports_cooperative: gameData.supports_cooperative,
      supports_competitive: gameData.supports_competitive,
      supports_campaign: gameData.supports_campaign,
      default_mode: gameData.default_mode
    })
    setBggImported(true)
  }

  const handleBGGReset = () => {
    // Réinitialiser le formulaire quand une nouvelle recherche BGG est lancée
    if (bggImported) {
      setFormData({
        game_name: '',
        game_description: '',
        game_image: '',
        has_characters: false,
        min_players: 1,
        max_players: 4,
        supports_cooperative: false,
        supports_competitive: true,
        supports_campaign: false,
        default_mode: 'competitive'
      })
      setBggImported(false)
    }
  }

  const resetForm = () => {
    setFormData({
      game_name: '',
      game_description: '',
      game_image: '',
      has_characters: false,
      min_players: 1,
      max_players: 4,
      supports_cooperative: false,
      supports_competitive: true,
      supports_campaign: false,
      default_mode: 'competitive'
    })
    setEditingGame(null)
    setShowCreateForm(false)
    setBggImported(false)
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-96">
        <div className="text-lg">Chargement des jeux...</div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Gestion des Jeux</h1>
        <button
          onClick={() => setShowCreateForm(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
        >
          Ajouter un jeu
        </button>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      {/* Formulaire de création/modification */}
      {showCreateForm && (
        <div className="bg-white border border-gray-200 rounded-lg p-6 mb-8 shadow-sm">
          <h2 className="text-xl font-semibold mb-4">
            {editingGame ? 'Modifier le jeu' : 'Ajouter un nouveau jeu'}
          </h2>

          {/* Intégration BoardGameGeek - uniquement lors de l'ajout/modification */}
          <BGGSearch onImport={handleBGGImport} onReset={handleBGGReset} />

          {/* Feedback BGG import */}
          {bggImported && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
              ✅ Formulaire pré-rempli avec les données BoardGameGeek. Vous
              pouvez modifier les champs puis cliquer &quot;Créer&quot;.
            </div>
          )}

          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            {formData.game_image && (
              <div className="md:col-span-2">
                <img
                  src={formData.game_image}
                  alt={`Image de ${formData.game_name}`}
                  className="w-20 h-20 object-cover rounded-lg shadow-md"
                />
              </div>
            )}

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nom du jeu *
              </label>
              <input
                type="text"
                value={formData.game_name}
                onChange={(e) =>
                  setFormData({ ...formData, game_name: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                value={formData.game_description || ''}
                onChange={(e) =>
                  setFormData({ ...formData, game_description: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={3}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Joueurs minimum
              </label>
              <input
                type="number"
                min="1"
                value={formData.min_players || ''}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    min_players: e.target.value
                      ? parseInt(e.target.value)
                      : undefined
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Joueurs maximum
              </label>
              <input
                type="number"
                min="1"
                value={formData.max_players || ''}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    max_players: e.target.value
                      ? parseInt(e.target.value)
                      : undefined
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Modes de jeu supportés
              </label>
              <div className="flex flex-wrap gap-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.supports_competitive || false}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        supports_competitive: e.target.checked
                      })
                    }
                    className="mr-2"
                  />
                  Compétitif
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.supports_cooperative || false}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        supports_cooperative: e.target.checked
                      })
                    }
                    className="mr-2"
                  />
                  Coopératif
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.supports_campaign || false}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        supports_campaign: e.target.checked
                      })
                    }
                    className="mr-2"
                  />
                  Campagne
                </label>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mode par défaut
              </label>
              <select
                value={formData.default_mode || 'competitive'}
                onChange={(e) =>
                  setFormData({ ...formData, default_mode: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="competitive">Compétitif</option>
                <option value="cooperative">Coopératif</option>
                <option value="campaign">Campagne</option>
              </select>
            </div>

            <div className="flex items-center">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.has_characters || false}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      has_characters: e.target.checked
                    })
                  }
                  className="mr-2"
                />
                Le jeu a des personnages
              </label>
            </div>

            <div className="md:col-span-2 flex justify-end space-x-3">
              <button
                type="button"
                onClick={resetForm}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
              >
                Annuler
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                {editingGame ? 'Mettre à jour' : 'Créer'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Liste des jeux */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {games.map((game) => (
          <div
            key={game.game_id}
            className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col"
          >
            {game.game_image && (
              <img
                src={game.game_image}
                alt={`Image de ${game.game_name}`}
                className="w-full h-40 object-cover rounded-md mb-4"
              />
            )}
            <div className="flex-grow">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-semibold text-gray-900">
                  {game.game_name}
                </h3>
                <div className="flex flex-wrap gap-2">
                  <a
                    href={`/stats/game/${game.game_id}`}
                    className="text-purple-600 hover:text-purple-800 text-sm font-medium"
                    title="Voir les statistiques"
                  >
                    📊 Stats
                  </a>
                  <a
                    href={`/sessions/game/${game.game_id}`}
                    className="text-green-600 hover:text-green-800 text-sm font-medium"
                    title="Voir l'historique des parties"
                  >
                    📋 Parties
                  </a>
                  <button
                    onClick={() => handleEdit(game)}
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                  >
                    ✏️ Modifier
                  </button>
                  <button
                    onClick={() => handleDelete(game.game_id)}
                    className="text-red-600 hover:text-red-800 text-sm font-medium"
                  >
                    🗑️ Supprimer
                  </button>
                </div>
              </div>

              {game.game_description && (
                <p className="text-gray-600 text-sm mb-3">
                  {game.game_description.substring(0, 100)}
                  {game.game_description.length > 100 && '...'}
                </p>
              )}
            </div>

            <div className="mt-auto pt-4 border-t border-gray-200">
              <div className="space-y-2 text-sm text-gray-700">
                <div>
                  <span className="font-medium">Joueurs:</span>{' '}
                  {game.min_players} - {game.max_players}
                </div>
                <div>
                  <span className="font-medium">Mode par défaut:</span>{' '}
                  {game.default_mode}
                </div>
                <div className="flex items-center space-x-4">
                  {game.supports_campaign && (
                    <div className="inline-block bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                      Campagne
                    </div>
                  )}
                  {game.has_characters && (
                    <div
                      className="inline-flex items-center bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs"
                      title="Ce jeu a des personnages"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 mr-1"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                          clipRule="evenodd"
                        />
                      </svg>
                      Personnages
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {games.length === 0 && !loading && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg mb-4">Aucun jeu enregistré</p>
          <button
            onClick={() => setShowCreateForm(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
          >
            Ajouter votre premier jeu
          </button>
        </div>
      )}
    </div>
  )
}
