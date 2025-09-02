/**
 * Service pour l'intégration BoardGameGeek côté frontend
 */
import { apiClient } from './apiClient'
import type { BGGSearchResult, BGGGameDetails } from '../types/bgg.types'
import type { Game } from '../types'

export class BGGService {
  /**
   * Recherche des jeux sur BGG
   */
  static async searchGames(query: string): Promise<BGGSearchResult[]> {
    return apiClient.get<BGGSearchResult[]>(
      `/bgg/search?q=${encodeURIComponent(query)}`
    )
  }

  /**
   * Récupère les détails d'un jeu BGG
   */
  static async getGameDetails(gameId: string): Promise<BGGGameDetails> {
    return apiClient.get<BGGGameDetails>(`/bgg/game/${gameId}`)
  }

  /**
   * Importe un jeu depuis BGG vers notre base de données
   */
  static async importGame(gameId: string): Promise<Game> {
    return apiClient.post<Game>(`/bgg/import/${gameId}`, {})
  }
}
