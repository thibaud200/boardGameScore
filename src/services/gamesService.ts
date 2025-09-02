/**
 * Service pour gérer les jeux via l'API backend
 * Préparé pour future intégration API BoardGameGeek
 */
import { apiClient } from './apiClient'
import type { Game, CreateGameRequest, UpdateGameRequest } from '../types'

export class GamesService {
  /**
   * Récupère tous les jeux
   */
  static async getAllGames(): Promise<Game[]> {
    return apiClient.get<Game[]>('/games')
  }

  /**
   * Récupère un jeu par son ID
   */
  static async getGameById(id: number): Promise<Game> {
    return apiClient.get<Game>(`/games/${id}`)
  }

  /**
   * Crée un nouveau jeu manuellement
   */
  static async createGame(data: CreateGameRequest): Promise<Game> {
    return apiClient.post<Game>('/games', data)
  }

  /**
   * Met à jour un jeu existant
   */
  static async updateGame(id: number, data: UpdateGameRequest): Promise<Game> {
    return apiClient.put<Game>(`/games/${id}`, data)
  }

  /**
   * Supprime un jeu
   */
  static async deleteGame(id: number): Promise<void> {
    return apiClient.delete<void>(`/games/${id}`)
  }

  // TODO: Futures méthodes pour intégration BGG
  /**
   * Recherche un jeu via l'API BoardGameGeek (à implémenter)
   */
  // static async searchGameOnBGG(query: string): Promise<BGGGame[]> {
  //   // À implémenter avec l'API BGG
  // }

  /**
   * Importe un jeu depuis BoardGameGeek (à implémenter)
   */
  // static async importGameFromBGG(bggId: number): Promise<Game> {
  //   // À implémenter avec l'API BGG
  // }
}
