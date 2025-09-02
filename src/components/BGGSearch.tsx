import React, { useState } from 'react'
import { BGGService } from '../services/BGGService'
import type { BGGSearchResult, BGGGameDetails } from '../types/bgg.types'
import type { CreateGameRequest } from '../types'

interface BGGSearchProps {
  onImport: (gameData: CreateGameRequest) => void // Callback pour pré-remplir le formulaire
}

export default function BGGSearch({ onImport }: BGGSearchProps) {
  const [query, setQuery] = useState('')
  const [searchResults, setSearchResults] = useState<BGGSearchResult[]>([])
  const [selectedGame, setSelectedGame] = useState<BGGGameDetails | null>(null)
  const [loading, setLoading] = useState(false)
  const [importing, setImporting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!query.trim()) return

    setLoading(true)
    setError(null)

    try {
      const results = await BGGService.searchGames(query)
      setSearchResults(results)
    } catch (error) {
      setError('Erreur lors de la recherche sur BoardGameGeek')
      console.error('BGG search error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleViewDetails = async (gameId: string) => {
    setLoading(true)
    setError(null)

    try {
      const details = await BGGService.getGameDetails(gameId)
      setSelectedGame(details)
    } catch (error) {
      setError('Erreur lors de la récupération des détails')
      console.error('BGG details error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleImport = async (gameId: string) => {
    setImporting(true)
    setError(null)

    try {
      // Récupérer les détails du jeu depuis BGG
      const gameDetails = await BGGService.getGameDetails(gameId)

      // Convertir vers le format de notre formulaire
      const gameData: CreateGameRequest = {
        game_id_bgg: gameId,
        game_name: gameDetails.name,
        game_description: gameDetails.description || '',
        game_image: gameDetails.image || '',
        has_characters:
          gameDetails.categories?.some(
            (cat) =>
              cat.toLowerCase().includes('character') ||
              cat.toLowerCase().includes('role playing')
          ) || false,
        min_players: gameDetails.minPlayers || 1,
        max_players: gameDetails.maxPlayers || 4,
        supports_cooperative:
          gameDetails.mechanics?.some(
            (mech) =>
              mech.toLowerCase().includes('cooperative') ||
              mech.toLowerCase().includes('co-op')
          ) || false,
        supports_competitive: true, // Par défaut
        supports_campaign:
          gameDetails.mechanics?.some(
            (mech) =>
              mech.toLowerCase().includes('campaign') ||
              mech.toLowerCase().includes('legacy')
          ) || false,
        default_mode: 'competitive' as const
      }

      // Passer les données au formulaire parent
      onImport(gameData)

      // Réinitialiser l'interface BGG
      setSelectedGame(null)
      setSearchResults([])
      setQuery('')
    } catch (error) {
      setError("Erreur lors de l'importation du jeu")
      console.error('BGG import error:', error)
    } finally {
      setImporting(false)
    }
  }

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
      <h3 className="text-lg font-semibold text-blue-900 mb-4">
        🔍 Importer depuis BoardGameGeek
      </h3>

      {/* Formulaire de recherche */}
      <form onSubmit={handleSearch} className="mb-4">
        <div className="flex gap-2">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Rechercher un jeu sur BGG..."
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            disabled={loading || !query.trim()}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            {loading ? '🔄' : 'Rechercher'}
          </button>
        </div>
      </form>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {/* Résultats de recherche */}
      {searchResults.length > 0 && !selectedGame && (
        <div className="space-y-2 mb-4">
          <h4 className="font-medium text-gray-900">
            Résultats de recherche :
          </h4>
          <div className="max-h-60 overflow-y-auto space-y-2">
            {searchResults.map((result) => (
              <div
                key={result.id}
                className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded hover:bg-gray-50"
              >
                <div>
                  <div className="font-medium">{result.name}</div>
                  {result.yearPublished && (
                    <div className="text-sm text-gray-600">
                      ({result.yearPublished})
                    </div>
                  )}
                </div>
                <button
                  onClick={() => handleViewDetails(result.id)}
                  className="px-3 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors"
                >
                  Voir détails
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Détails du jeu sélectionné */}
      {selectedGame && (
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-start gap-4 mb-4">
            {selectedGame.thumbnail && (
              <img
                src={selectedGame.thumbnail}
                alt={selectedGame.name}
                className="w-20 h-20 object-cover rounded"
              />
            )}
            <div className="flex-1">
              <h4 className="text-lg font-semibold">{selectedGame.name}</h4>
              {selectedGame.yearPublished && (
                <p className="text-sm text-gray-600">
                  Année : {selectedGame.yearPublished}
                </p>
              )}
              {selectedGame.minPlayers && selectedGame.maxPlayers && (
                <p className="text-sm text-gray-600">
                  Joueurs : {selectedGame.minPlayers} -{' '}
                  {selectedGame.maxPlayers}
                </p>
              )}
              {selectedGame.playingTime && (
                <p className="text-sm text-gray-600">
                  Durée : {selectedGame.playingTime} min
                </p>
              )}
              {selectedGame.rating && (
                <p className="text-sm text-gray-600">
                  Note BGG : {selectedGame.rating.toFixed(1)}/10
                </p>
              )}
            </div>
          </div>

          {selectedGame.description && (
            <div className="mb-4">
              <h5 className="font-medium mb-2">Description :</h5>
              <div
                className="text-sm text-gray-700 max-h-32 overflow-y-auto"
                dangerouslySetInnerHTML={{
                  __html:
                    selectedGame.description
                      .replace(/&#10;/g, '<br/>')
                      .substring(0, 500) + '...'
                }}
              />
            </div>
          )}

          {selectedGame.categories && selectedGame.categories.length > 0 && (
            <div className="mb-4">
              <h5 className="font-medium mb-2">Catégories :</h5>
              <div className="flex flex-wrap gap-1">
                {selectedGame.categories.map((category, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded"
                  >
                    {category}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="flex justify-end gap-2">
            <button
              onClick={() => setSelectedGame(null)}
              className="px-4 py-2 text-gray-600 border border-gray-300 rounded hover:bg-gray-50 transition-colors"
            >
              Retour
            </button>
            <button
              onClick={() => handleImport(selectedGame.id)}
              disabled={importing}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50 transition-colors"
            >
              {importing ? '🔄 Import...' : '📥 Pré-remplir le formulaire'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
